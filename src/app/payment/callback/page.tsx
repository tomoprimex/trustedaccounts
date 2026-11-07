import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyTransaction as verifyPaystackTransaction } from "@/lib/paystack";
import { verifyTransaction as verifyErcasTransaction } from "@/lib/ercas";

export default async function PaymentCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; transaction_reference?: string }>;
}) {
  const { reference, transaction_reference } = await searchParams;
  const paymentReference = reference || transaction_reference;
  if (!paymentReference) redirect("/");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Try both Paystack and Ercas Pay verification
  let verified = null;
  let isPaystack = false;

  try {
    verified = await verifyPaystackTransaction(paymentReference);
    isPaystack = true;
  } catch (paystackError) {
    try {
      verified = await verifyErcasTransaction(paymentReference);
      isPaystack = false;
    } catch (ercasError) {
      // Both failed
    }
  }

  const isSuccess = verified && (verified.status === "success" || verified.status === "completed");

  if (isSuccess) {
    const admin = createAdminClient();
    if (isPaystack) {
      await admin
        .from("purchases")
        .update({ status: "paid" })
        .eq("paystack_reference", paymentReference)
        .eq("user_id", user.id);
    } else {
      await admin
        .from("purchases")
        .update({ status: "paid" })
        .eq("ercas_reference", paymentReference)
        .eq("user_id", user.id);
    }
  }

  return (
    <main style={{ maxWidth: 600, margin: "40px auto", padding: 16 }}>
      <h1>{isSuccess ? "Payment successful" : "Payment not completed"}</h1>
      <p><Link href="/library">Go to library</Link></p>
    </main>
  );
}
