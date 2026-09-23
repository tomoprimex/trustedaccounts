import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const adminSupabase = createAdminClient();
    const { accountId } = await request.json();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not authenticated' }, { status: 401 });
    }

    // Get account details
    const { data: account } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', accountId)
      .single();

    if (!account) {
      return NextResponse.json({ success: false, error: 'Account not found' }, { status: 404 });
    }

    if (account.status !== 'available') {
      return NextResponse.json({ success: false, error: 'This account is no longer available' }, { status: 400 });
    }

    // Check wallet balance using service role (admin client for security)
    const { data: wallet } = await adminSupabase
      .from('wallets')
      .select('balance_cents')
      .eq('user_id', user.id)
      .single();

    if (!wallet || wallet.balance_cents < account.price_cents) {
      return NextResponse.json({ success: false, error: 'Insufficient wallet balance' }, { status: 400 });
    }

    // Deduct from wallet balance using service role
    const { error: walletError } = await adminSupabase
      .from('wallets')
      .update({ balance_cents: wallet.balance_cents - account.price_cents })
      .eq('user_id', user.id);

    if (walletError) {
      return NextResponse.json({ success: false, error: 'Failed to deduct from wallet' }, { status: 500 });
    }

    // Update profile wallet balance as well
    await adminSupabase
      .from('profiles')
      .update({ wallet_balance_cents: wallet.balance_cents - account.price_cents })
      .eq('id', user.id);

    // Create order
    const orderNum = `ORD-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

    const { data: order, error: orderError } = await supabase
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in wallet purchase:', error);
    return NextResponse.json({ success: false, error: 'Purchase failed' }, { status: 500 });
  }
}
