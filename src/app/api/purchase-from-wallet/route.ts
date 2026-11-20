import { NextResponse } from "next/server";
import { getRequestUser, PaymentError, purchaseWithWallet } from "@/lib/payments/server";
import { errorResponse } from "@/lib/payments/route-helpers";

export async function POST(request: Request) {
  try {
    const user = await getRequestUser(request);
    if (!user) throw new PaymentError("Please sign in to continue", 401);
    const { accountId } = await request.json().catch(() => ({}));
    if (!accountId) throw new PaymentError("accountId is required");
    const { orderId } = await purchaseWithWallet(user, String(accountId));
    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    return errorResponse(error);
  }
}
