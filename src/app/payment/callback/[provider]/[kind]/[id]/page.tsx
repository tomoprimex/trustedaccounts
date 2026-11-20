import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { findRecordById, verifyAndSettle, type PaymentKind } from "@/lib/payments/server";
import { PaymentResult } from "@/components/payment/payment-result";

export const dynamic = "force-dynamic";

const KINDS: PaymentKind[] = ["deposit", "order", "purchase"];
const UUIDISH = /^[0-9a-zA-Z-]{1,64}$/;

export default async function PaymentCallbackPage({
  params,
}: {
  params: Promise<{ provider: string; kind: string; id: string }>;
}) {
  const { kind, id } = await params;
  if (!KINDS.includes(kind as PaymentKind) || !UUIDISH.test(id)) notFound();

  // Verification always happens server-side with the gateway; the redirect itself proves nothing.
  const db = createAdminClient();
  const record = await findRecordById(db, kind as PaymentKind, id);
  if (!record) notFound();

  const outcome = await verifyAndSettle(db, record);
  return <PaymentResult outcome={outcome} />;
}
