import { createClient } from "./client";

const supabase = createClient();

// Dashboard Stats
export async function getDashboardStats() {
  const [
    { data: revenueData },
    { count: totalOrders },
    { count: totalCustomers },
    { count: totalAccounts },
  ] = await Promise.all([
    supabase.from('revenue').select('amount_cents'),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
    supabase.from('accounts').select('*', { count: 'exact', head: true }).eq('status', 'available'),
  ]);

  const totalRevenue = revenueData?.reduce((sum, r) => sum + (r.amount_cents || 0), 0) || 0;

  return {
    totalRevenue,
    totalOrders: totalOrders || 0,
    totalCustomers: totalCustomers || 0,
    totalAccounts: totalAccounts || 0,
  };
}

// Recent Orders
export async function getRecentOrders(limit = 10) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      customer:profiles!orders_customer_id_fkey (full_name, email),
      account:accounts!orders_account_id_fkey (platform, username, price_cents, currency)
    `)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

// Revenue by Date (for charts)
export async function getRevenueByDate(days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('revenue')
    .select('amount_cents, date, platform')
    .gte('date', startDate.toISOString().split('T')[0])
    .order('date', { ascending: true });

  if (error) throw error;
  return data;
}

// Platform Distribution
export async function getPlatformDistribution() {
  const { data, error } = await supabase
    .from('accounts')
    .select('platform')
    .eq('status', 'available');

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
