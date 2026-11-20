import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { findRecordByReference, verifyAndSettle } from "@/lib/payments/server";
import { PaymentResult } from "@/components/payment/payment-result";

export const dynamic = "force-dynamic";

/** Legacy callback (?reference= / ?trxref= / ?transRef=) kept for payments started before the upgrade. */
export default async function LegacyPaymentCallbackPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const references = [
    params.transRef,
    params.transaction_reference,
    params.transactionReference,
    params.reference,
    params.trxref,
  ].filter((v): v is string => !!v);

  if (references.length === 0) redirect("/dashboard");

  const db = createAdminClient();
  for (const reference of references) {
    const record = await findRecordByReference(db, reference);
    if (record) return <PaymentResult outcome={await verifyAndSettle(db, record)} />;
  }

  return <PaymentResult outcome={{ status: "failed", message: "We couldn't find this payment. If you were charged, contact support." }} />;
}
