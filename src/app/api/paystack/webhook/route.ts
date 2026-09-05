import crypto from "crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyTransaction } from "@/lib/paystack";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature") || "";

  const expected = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(rawBody)
    .digest("hex");

  if (expected !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  if (event.event !== "charge.success") {
    return NextResponse.json({ received: true });
  }

  const reference = event.data.reference;
  const verified = await verifyTransaction(reference);

  if (verified.status !== "success") {
    return NextResponse.json({ received: true });
  }

  const supabase = createAdminClient();

  const { data: purchase } = await supabase
    .from("purchases")
    .select("id, website_id, amount_kobo")
    .eq("paystack_reference", reference)
    .maybeSingle();

  if (!purchase) {
    return NextResponse.json({ received: true });
  }

  if (verified.amount !== purchase.amount_kobo) {
    return NextResponse.json({ error: "Amount mismatch" }, { status: 400 });
  }

  await supabase
    .from("purchases")
    .update({ status: "paid" })
    .eq("id", purchase.id);

  return NextResponse.json({ received: true });
}
