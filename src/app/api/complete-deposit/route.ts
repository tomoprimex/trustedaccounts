import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    const { depositId } = await request.json();

    console.log('Complete deposit request:', { depositId, hasAuth: !!authHeader });

    if (!authHeader) {
      console.error('No authorization header');
      return NextResponse.json({ success: false, error: 'No authorization token' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const supabase = createClient();
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

    // Get deposit details using admin client
    const { data: deposit, error: depositError } = await adminSupabase
      .from('deposits')
      .select('*')
      .eq('id', depositId)
      .single();

    if (depositError) {
      console.error('Error finding deposit:', depositError);
      return NextResponse.json({ success: false, error: 'Deposit not found' }, { status: 404 });
    }

    if (!deposit) {
      console.error('Deposit not found:', depositId);
      return NextResponse.json({ success: false, error: 'Deposit not found' }, { status: 404 });
    }

    console.log('Deposit found:', deposit);

    // Verify the deposit belongs to the current user
    if (deposit.user_id !== user.id) {
      console.error('Unauthorized: deposit belongs to different user');
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    if (deposit.status === 'completed') {
      console.log('Deposit already completed');
      return NextResponse.json({ success: true, deposit });
    }

    // Update deposit status using admin client
    const { data: updatedDeposit, error: updateError } = await adminSupabase
      .from('deposits')
      .update({ status: 'completed' })
      .eq('id', depositId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating deposit status:', updateError);
      return NextResponse.json({ success: false, error: 'Failed to update deposit' }, { status: 500 });
    }

    console.log('Deposit status updated');

    // Update wallet balance using admin client
    const { data: wallet } = await adminSupabase
      .from('wallets')
      .select('balance_cents')
      .eq('user_id', deposit.user_id)
      .single();

    if (wallet) {
      // Update existing wallet
      await adminSupabase
        .from('wallets')
        .update({ balance_cents: wallet.balance_cents + deposit.amount_cents })
        .eq('user_id', deposit.user_id);
      console.log('Wallet updated');
    } else {
      // Create new wallet
      await adminSupabase
        .from('wallets')
        .insert({
          user_id: deposit.user_id,
          balance_cents: deposit.amount_cents,
          currency: 'NGN',
        });
      console.log('Wallet created');
    }

    // Update profile wallet balance
    await adminSupabase
      .from('profiles')
      .update({ wallet_balance_cents: (wallet?.balance_cents || 0) + deposit.amount_cents })
      .eq('id', deposit.user_id);

    console.log('Profile wallet balance updated');

    return NextResponse.json({ success: true, deposit: updatedDeposit });
  } catch (error) {
    console.error('Error completing deposit:', error);
    return NextResponse.json({ success: false, error: 'Failed to complete deposit' }, { status: 500 });
  }
}
