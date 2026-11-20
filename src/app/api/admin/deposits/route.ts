import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { completeDeposit, getRequestUser, isAdmin, PaymentError } from "@/lib/payments/server";
import { errorResponse } from "@/lib/payments/route-helpers";

/** Admin: manually approve or reject a deposit (e.g. a bank transfer). */
export async function POST(request: Request) {
  try {
    const user = await getRequestUser(request);
    if (!user || !(await isAdmin(user.id))) throw new PaymentError("Forbidden", 403);

    const { depositId, action } = await request.json().catch(() => ({}));
    if (!depositId || !["approve", "reject"].includes(action)) throw new PaymentError("Invalid request");

    const db = createAdminClient();
    if (action === "reject") {
      const { data } = await db
        .from("deposits")
        .update({ status: "failed" })
        .eq("id", depositId)
        .eq("status", "pending")
        .select("id");
      if (!data?.length) throw new PaymentError("Only pending deposits can be rejected", 409);
      return NextResponse.json({ success: true });
    }

    const { data: deposit } = await db.from("deposits").select("amount_cents").eq("id", depositId).maybeSingle();
    if (!deposit) throw new PaymentError("Deposit not found", 404);
    const outcome = await completeDeposit(db, depositId, deposit.amount_cents);
    if (outcome.status !== "success") throw new PaymentError("Could not approve deposit");
    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
