import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyTransaction } from "@/lib/paystack";

export default async function PaymentCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  const { reference } = await searchParams;
  if (!reference) redirect("/");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const verified = await verifyTransaction(reference);

  if (verified.status === "success") {
    const admin = createAdminClient();
    await admin
      .from("purchases")
      .update({ status: "paid" })
      .eq("paystack_reference", reference)
      .eq("user_id", user.id);
  }

  return (
    <main style={{ maxWidth: 600, margin: "40px auto", padding: 16 }}>
      <h1>{verified.status === "success" ? "Payment successful" : "Payment not completed"}</h1>
      <p><Link href="/library">Go to library</Link></p>
    </main>
  );
}
