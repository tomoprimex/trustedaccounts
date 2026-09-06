import { createClient } from "./client";

const supabase = createClient();

// Dashboard Stats
export async function getDashboardStats() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Get user role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = profile?.role || 'customer';

  let totalRevenue = 0;
  let totalOrders = 0;
  let totalCustomers = 0;
  let totalAccounts = 0;

  if (role === 'admin') {
    // Admin sees all data
    const [
      { data: revenueData },
      { count: ordersCount },
      { count: customersCount },
      { count: accountsCount },
    ] = await Promise.all([
      supabase.from('revenue').select('amount_cents'),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
      supabase.from('accounts').select('*', { count: 'exact', head: true }).eq('status', 'available'),
    ]);

    totalRevenue = revenueData?.reduce((sum, r) => sum + (r.amount_cents || 0), 0) || 0;
    totalOrders = ordersCount || 0;
    totalCustomers = customersCount || 0;
    totalAccounts = accountsCount || 0;
  } else if (role === 'seller') {
    // Seller sees their own accounts and revenue from their sales
    const [
      { data: revenueData },
      { count: ordersCount },
      { count: accountsCount },
    ] = await Promise.all([
      supabase.from('revenue').select('amount_cents').eq('platform', user.id), // This might need adjustment based on how revenue is linked to sellers
      supabase.from('orders').select('*', { count: 'exact', head: true }), // Orders for accounts sold by this seller
      supabase.from('accounts').select('*', { count: 'exact', head: true }).eq('seller_id', user.id),
    ]);

    totalRevenue = revenueData?.reduce((sum, r) => sum + (r.amount_cents || 0), 0) || 0;
    totalOrders = ordersCount || 0;
    totalAccounts = accountsCount || 0;
  } else {
    // Customer sees their own orders and spending
    const [
      { data: ordersData },
      { data: analyticsData },
    ] = await Promise.all([
      supabase.from('orders').select('amount_cents').eq('customer_id', user.id),
      supabase.from('customer_analytics').select('total_orders, total_spent_cents').eq('customer_id', user.id).single(),
    ]);

    totalRevenue = analyticsData?.total_spent_cents || 0;
    totalOrders = analyticsData?.total_orders || ordersData?.length || 0;
    totalCustomers = 0; // Not applicable for customers
    totalAccounts = 0; // Not applicable for customers
  }

  return {
    totalRevenue,
    totalOrders,
    totalCustomers,
    totalAccounts,
    role,
  };
}

// Recent Orders
export async function getRecentOrders(limit = 10) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Get user role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = profile?.role || 'customer';

  let query = supabase
    .from('orders')
    .select(`
      *,
      customer:profiles!orders_customer_id_fkey (full_name, email),
      account:accounts!orders_account_id_fkey (platform, username, price_cents, currency)
    `)
    .order('created_at', { ascending: false });

  // Filter based on role
  if (role === 'customer') {
    query = query.eq('customer_id', user.id);
  } else if (role === 'seller') {
    // Seller sees orders for their accounts
    query = query.eq('account.seller_id', user.id);
  }
  // Admin sees all orders (no filter)

  const { data, error } = await query.limit(limit);
  if (error) throw error;
  return data;
}

// Revenue by Date (for charts)
export async function getRevenueByDate(days = 7) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Get user role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = profile?.role || 'customer';

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  let query = supabase
    .from('revenue')
    .select('amount_cents, date, platform')
    .gte('date', startDate.toISOString().split('T')[0])
    .order('date', { ascending: true });

  // Filter based on role
  if (role === 'customer') {
    // Customers don't have revenue data, return empty
    return [];
  } else if (role === 'seller') {
    // Seller sees revenue from their sales
    // This needs to be adjusted based on how revenue is linked to sellers
    // For now, sellers see all revenue (should be filtered by their accounts)
  }
  // Admin sees all revenue

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// Platform Distribution
export async function getPlatformDistribution() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Get user role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = profile?.role || 'customer';

  let query = supabase
    .from('accounts')
    .select('platform')
    .eq('status', 'available');

  // Filter based on role
  if (role === 'seller') {
    query = query.eq('seller_id', user.id);
  }
  // Admin and customers see all available accounts
  // (customers see all to browse, sellers see their own)

  const { data, error } = await query;
  if (error) throw error;

  const distribution = data?.reduce((acc, account) => {
    acc[account.platform] = (acc[account.platform] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const total = data?.length || 1;
  return Object.entries(distribution).map(([platform, count]) => ({
    platform,
    count,
    percentage: Math.round((count / total) * 100),
  }));
}

// All Orders with filters
export async function getOrders(filters?: {
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  let query = supabase
    .from('orders')
    .select(`
      *,
      customer:profiles!orders_customer_id_fkey (full_name, email),
      account:accounts!orders_account_id_fkey (platform, username, price_cents, currency)
    `)
    .order('created_at', { ascending: false });

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  if (filters?.search) {
    query = query.or(`order_number.ilike.%${filters.search}%,customer.full_name.ilike.%${filters.search}%`);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// All Accounts with filters
export async function getAccounts(filters?: {
  platform?: string;
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  let query = supabase
    .from('accounts')
    .select(`
      *,
      seller:profiles!accounts_seller_id_fkey (full_name)
    `)
    .order('created_at', { ascending: false });

  if (filters?.platform && filters.platform !== 'all') {
    query = query.eq('platform', filters.platform);
  }

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  if (filters?.search) {
    query = query.or(`username.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// All Customers with filters
export async function getCustomers(filters?: {
  status?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  let query = supabase
    .from('profiles')
    .select(`
      *,
      customer_analytics!customer_analytics_customer_id_fkey (
        total_orders,
        total_spent_cents,
        last_order_date
      )
    `)
    .eq('role', 'customer')
    .order('created_at', { ascending: false });

  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  if (filters?.search) {
    query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// Create Order
export async function createOrder(orderData: {
  account_id: string;
  amount_cents: number;
  currency?: string;
  payment_method?: string;
  payment_reference?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('orders')
    .insert({
      customer_id: user.id,
      order_number: `ORD-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      ...orderData,
    })
    .select()
    .single();

  if (error) throw error;
  
  // Create revenue record
  if (data) {
    await supabase.from('revenue').insert({
      order_id: data.id,
      amount_cents: orderData.amount_cents,
      currency: orderData.currency || 'USD',
      date: new Date().toISOString().split('T')[0],
    });
  }
  
  return data;
}

// Update Account Status
export async function updateAccountStatus(accountId: string, status: 'available' | 'reserved' | 'sold' | 'removed') {
  const { data, error } = await supabase
    .from('accounts')
    .update({ status })
    .eq('id', accountId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update Order Status
export async function updateOrderStatus(orderId: string, status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded') {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Get User Profile
export async function getUserProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) throw error;
  return data;
}

// Update User Profile
export async function updateUserProfile(updates: {
  full_name?: string;
  phone?: string;
  avatar_url?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
