import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const supabase = createClient();
    const { accountId } = await request.json();

    console.log('Wallet purchase request:', { accountId, hasAuth: !!authHeader });

    if (!authHeader) {
      console.error('No authorization header');
      return NextResponse.json({ success: false, error: 'No authorization token' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('User not authenticated:', authError);
      return NextResponse.json({ success: false, error: 'User not authenticated' }, { status: 401 });
    }

    console.log('User authenticated:', user.id);

    // Try to create admin client
    let adminSupabase;
    try {
      adminSupabase = createAdminClient();
      console.log('Admin client created successfully');
    } catch (error) {
      console.error('Failed to create admin client:', error);
      return NextResponse.json({ success: false, error: 'Server configuration error' }, { status: 500 });
    }

    // Get account details
    const { data: account } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', accountId)
      .single();

    if (!account) {
      console.error('Account not found:', accountId);
      return NextResponse.json({ success: false, error: 'Account not found' }, { status: 404 });
    }

    console.log('Account found:', account.id);

    if (account.status !== 'available') {
      console.error('Account not available:', account.status);
      return NextResponse.json({ success: false, error: 'This account is no longer available' }, { status: 400 });
    }

    // Check wallet balance using service role (admin client for security)
    const { data: wallet } = await adminSupabase
      .from('wallets')
      .select('balance_cents')
      .eq('user_id', user.id)
      .single();

    if (!wallet || wallet.balance_cents < account.price_cents) {
      console.error('Insufficient wallet balance:', wallet?.balance_cents, account.price_cents);
      return NextResponse.json({ success: false, error: 'Insufficient wallet balance' }, { status: 400 });
    }

    console.log('Wallet balance sufficient');

    // Deduct from wallet balance using service role
    const { error: walletError } = await adminSupabase
      .from('wallets')
      .update({ balance_cents: wallet.balance_cents - account.price_cents })
      .eq('user_id', user.id);

    if (walletError) {
      console.error('Failed to deduct from wallet:', walletError);
      return NextResponse.json({ success: false, error: 'Failed to deduct from wallet' }, { status: 500 });
    }

    console.log('Wallet balance deducted');

    // Update profile wallet balance as well
    await adminSupabase
      .from('profiles')
      .update({ wallet_balance_cents: wallet.balance_cents - account.price_cents })
      .eq('id', user.id);

    // Create order using admin client to bypass RLS
    const orderNum = `ORD-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

    const { data: order, error: orderError } = await adminSupabase
      .from('orders')
      .insert({
        order_number: orderNum,
        customer_id: user.id,
        account_id: accountId,
        amount_cents: account.price_cents,
        currency: 'NGN',
        status: 'completed',
        delivery_status: 'delivered',
        payment_method: 'wallet',
      })
      .select()
      .single();

    if (orderError) {
      console.error('Failed to create order:', orderError);
      // Rollback wallet deduction
      await adminSupabase
        .from('wallets')
        .update({ balance_cents: wallet.balance_cents })
        .eq('user_id', user.id);

      await adminSupabase
        .from('profiles')
        .update({ wallet_balance_cents: wallet.balance_cents })
        .eq('id', user.id);

      return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 });
    }

    console.log('Order created:', order.id);

    // Create revenue record
    const { error: revenueError } = await adminSupabase.from('revenue').insert({
      order_id: order.id,
      amount_cents: account.price_cents,
      currency: 'NGN',
      date: new Date().toISOString().split('T')[0],
    });

    if (revenueError) {
      console.error('Error creating revenue record:', revenueError);
      // Don't fail the purchase if revenue record creation fails
    }

    // Mark account as sold
    const { error: updateError } = await adminSupabase
      .from('accounts')
      .update({ status: 'sold' })
      .eq('id', accountId);

    if (updateError) {
      console.error('Error marking account as sold:', updateError);
    }

    console.log('Purchase completed successfully');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in wallet purchase:', error);
    return NextResponse.json({ success: false, error: 'Purchase failed' }, { status: 500 });
  }
}
