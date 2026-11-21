import { NextResponse } from "next/server";
import { getRequestUser, PaymentError, reconcileUserPayments } from "@/lib/payments/server";
import { errorResponse } from "@/lib/payments/route-helpers";

export const dynamic = "force-dynamic";

/** Re-verifies the signed-in user's pending payments with the gateway and credits any that were paid. */
export async function POST(request: Request) {
  try {
    const user = await getRequestUser(request);
    if (!user) throw new PaymentError("Please sign in", 401);
    const result = await reconcileUserPayments(user.id);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return errorResponse(error);
  }
}
