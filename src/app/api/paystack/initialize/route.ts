import { NextResponse } from "next/server";
import { getRequestUser, PaymentError, startWebsiteCheckout } from "@/lib/payments/server";
import { errorResponse } from "@/lib/payments/route-helpers";

/** Legacy endpoint for website purchases via Paystack. Prefer POST /api/checkout. */
export async function POST(request: Request) {
  try {
    const user = await getRequestUser(request);
    if (!user?.email) throw new PaymentError("Login required", 401);
    const { websiteId } = await request.json().catch(() => ({}));
    if (!websiteId) throw new PaymentError("websiteId required");
    const { checkoutUrl } = await startWebsiteCheckout(request, user, "paystack", String(websiteId));
    return NextResponse.json({ authorization_url: checkoutUrl });
  } catch (error) {
    return errorResponse(error);
  }
}
