import crypto from "crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { findRecordByReference, verifyAndSettle } from "@/lib/payments/server";

function signatureIsValid(rawBody: string, signature: string) {
  const key = process.env.ERCASPAY_PUBLIC_KEY?.replace(/\\n/g, "\n");
  if (!key || !signature) return false;
  try {
    const verifier = crypto.createVerify("RSA-SHA256");
    verifier.update(rawBody, "utf8");
    return verifier.verify(key, Buffer.from(signature, "base64"));
  } catch {
    return false;
  }
}

/**
 * Ercaspay webhook. The payload is never trusted on its own: every event is
 * re-verified against the Ercaspay API before anything is fulfilled, so a
 * forged webhook can at most trigger a harmless re-check of a real payment.
 */
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-ercaspay-signature") ?? "";
  if (!signatureIsValid(rawBody, signature)) {
    console.warn("[ercaspay webhook] signature missing/invalid; relying on API re-verification");
  }

  let event: Record<string, unknown>;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const body = (event.data ?? event.responseBody ?? event) as Record<string, unknown>;
  const candidates = [
    body.transaction_reference,
    body.transactionReference,
    body.ercs_reference,
    body.tx_reference,
    body.payment_reference,
    body.paymentReference,
  ].filter((v): v is string => typeof v === "string" && v.length > 0);

  const db = createAdminClient();
  for (const reference of candidates) {
    const record = await findRecordByReference(db, reference);
    if (record) {
      const outcome = await verifyAndSettle(db, record);
      return NextResponse.json({ received: true, status: outcome.status });
    }
  }
  return NextResponse.json({ received: true });
}
