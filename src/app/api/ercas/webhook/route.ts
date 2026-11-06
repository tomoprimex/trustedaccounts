import crypto from "crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyTransaction } from "@/lib/ercas";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-ercas-signature") || "";

  const expected = crypto
    .createHmac("sha512", process.env.ERCAS_SECRET_KEY!)
    .update(rawBody)
    .digest("hex");

  if (expected !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  if (event.event !== "payment.success") {
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
    .eq("ercas_reference", reference)
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
