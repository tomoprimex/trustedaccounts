import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { initializeTransaction } from "@/lib/ercas";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const { depositId, amount } = await request.json();
  if (!depositId || !amount) {
    return NextResponse.json({ error: "depositId and amount required" }, { status: 400 });
  }

  const { data: deposit, error: depositError } = await supabase
    .from("deposits")
    .select("id, amount_cents, status, payment_method")
    .eq("id", depositId)
    .eq("user_id", user.id)
    .single();

  if (depositError || !deposit) {
    return NextResponse.json({ error: "Deposit not found" }, { status: 404 });
  }

  if (deposit.status !== "pending") {
    return NextResponse.json({ error: "Deposit already processed" }, { status: 409 });
  }

  const paymentReference = `WALLET-${deposit.id}-${randomUUID().slice(0, 8)}`;

  await supabase
    .from("deposits")
    .update({ payment_reference: paymentReference })
    .eq("id", deposit.id);

  const payment = await initializeTransaction({
    amount: deposit.amount_cents,
    paymentReference,
    customerName: user.email?.split("@")[0] || "Customer",
    customerEmail: user.email,
    redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/callback`,
    currency: "NGN",
  });

  return NextResponse.json({ checkoutUrl: payment.checkoutUrl });
}
