import { NextResponse } from "next/server";
import crypto from "crypto";
import { verifyTransaction } from "@/lib/ercas";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const received = request.headers.get("x-ercaspay-signature") ?? "";

  const computed = crypto
    .createHmac("sha512", process.env.ERCASPAY_SECRET_KEY!)
    .update(rawBody)
    .digest("hex");

  const a = Buffer.from(computed);
  const b = Buffer.from(received);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  const event = JSON.parse(rawBody);

  // Re-verify with the API as the final authority
  const result = await verifyTransaction(event.transaction_reference);

  // Look up the order, and if it's not already marked paid, mark it paid + fulfil
  // (webhooks can arrive more than once, so make this idempotent)
  const supabase = createAdminClient();

  const { data: purchase } = await supabase
    .from("purchases")
    .select("id, website_id, amount_kobo, status")
    .eq("ercas_reference", event.transaction_reference)
    .maybeSingle();

  if (!purchase) {
    return NextResponse.json({ received: true });
  }

  if (purchase.status === "paid") {
    return NextResponse.json({ received: true });
  }

  await supabase
    .from("purchases")
    .update({ status: "paid" })
    .eq("id", purchase.id);

  return NextResponse.json({ received: true });
}
