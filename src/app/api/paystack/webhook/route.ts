import crypto from "crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { findRecordByReference, verifyAndSettle } from "@/lib/payments/server";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature") || "";
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  const expected = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
  const valid =
    signature.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  if (!valid) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });

  let event: { event?: string; data?: { reference?: string } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const reference = event.data?.reference;
  if (event.event !== "charge.success" || !reference) return NextResponse.json({ received: true });

  const db = createAdminClient();
  const record = await findRecordByReference(db, reference);
  if (!record) return NextResponse.json({ received: true });

  // Re-verifies with Paystack and fulfils idempotently.
  const outcome = await verifyAndSettle(db, record);
  return NextResponse.json({ received: true, status: outcome.status });
}
