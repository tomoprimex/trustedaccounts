import { NextResponse } from "next/server";
import {
  getRequestUser,
  PaymentError,
  startAccountCheckout,
  startDeposit,
  startWebsiteCheckout,
} from "@/lib/payments/server";
import { errorResponse, parseProvider } from "@/lib/payments/route-helpers";

/**
 * Starts a hosted checkout with Paystack or Ercaspay.
 * Body: { type: "deposit", provider, amount }      amount in Naira
 *       { type: "account", provider, accountId }
 *       { type: "website", provider, websiteId }
 * Amounts for accounts/websites always come from the database, never the client.
 */
export async function POST(request: Request) {
  try {
    const user = await getRequestUser(request);
    if (!user?.email) throw new PaymentError("Please sign in to continue", 401);

    const body = await request.json().catch(() => ({}));
    const provider = parseProvider(body.provider);

    let result: { checkoutUrl: string };
    if (body.type === "deposit") {
      const naira = Number(body.amount);
      if (!Number.isFinite(naira)) throw new PaymentError("Enter a valid amount");
      result = await startDeposit(request, user, provider, Math.round(naira * 100));
    } else if (body.type === "account") {
      if (!body.accountId) throw new PaymentError("accountId is required");
      result = await startAccountCheckout(request, user, provider, String(body.accountId));
    } else if (body.type === "website") {
      if (!body.websiteId) throw new PaymentError("websiteId is required");
      result = await startWebsiteCheckout(request, user, provider, String(body.websiteId));
    } else {
      throw new PaymentError("Unknown checkout type");
    }

    return NextResponse.json({ success: true, checkoutUrl: result.checkoutUrl });
  } catch (error) {
    return errorResponse(error);
  }
}
