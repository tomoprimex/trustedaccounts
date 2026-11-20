import { NextResponse } from "next/server";
import { getRequestUser, PaymentError, startWebsiteCheckout } from "@/lib/payments/server";
import { errorResponse, parseProvider } from "@/lib/payments/route-helpers";

/** Legacy endpoint for website purchases. Prefer POST /api/checkout. */
export async function POST(request: Request) {
  try {
    const user = await getRequestUser(request);
    if (!user?.email) throw new PaymentError("Login required", 401);
    const { websiteId, paymentMethod } = await request.json().catch(() => ({}));
    if (!websiteId) throw new PaymentError("websiteId required");
    const { checkoutUrl } = await startWebsiteCheckout(request, user, parseProvider(paymentMethod), String(websiteId));
    return NextResponse.json({ checkoutUrl, authorization_url: checkoutUrl });
  } catch (error) {
    return errorResponse(error);
  }
}
