import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getRequestUser, PaymentError } from "@/lib/payments/server";
import { errorResponse } from "@/lib/payments/route-helpers";

const PLATFORMS = ["facebook", "instagram", "youtube", "tiktok", "twitter", "linkedin", "whatsapp"];

const str = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** A seller submits an account for sale. It stays `pending` until an admin approves it. */
export async function POST(request: Request) {
  try {
    const user = await getRequestUser(request);
    if (!user) throw new PaymentError("Please sign in to sell accounts", 401);

    const body = await request.json().catch(() => ({}));
    const platform = str(body.platform, 30).toLowerCase();
    const username = str(body.username, 120);
    const email = str(body.email, 200);
    const password = str(body.password, 200);
    const priceNaira = Number(body.price);
    const followers = Math.max(0, Math.floor(Number(body.followersCount) || 0));

    if (!PLATFORMS.includes(platform)) throw new PaymentError("Choose a supported platform");
    if (!username || !email || !password) throw new PaymentError("Username, login email and password are required");
    if (!Number.isFinite(priceNaira) || priceNaira < 100) throw new PaymentError("Price must be at least ₦100");

    const extra = [
      str(body.accountType, 40) && `Type: ${str(body.accountType, 40)}`,
      str(body.country, 40) && `Country: ${str(body.country, 40)}`,
    ].filter(Boolean);
    const description = [str(body.description, 2000), ...extra].filter(Boolean).join("\n");

    const db = createAdminClient();
    const { error } = await db.from("accounts").insert({
      platform,
      username,
      email,
      password,
      recovery_email: str(body.recoveryEmail, 200) || null,
      followers_count: followers,
      verified: Boolean(body.verified),
      price_cents: Math.round(priceNaira * 100),
      currency: "NGN",
      description: description || null,
      seller_id: user.id,
      status: "pending",
    });

    if (error) {
      console.error("[listings] insert failed:", error);
      throw new PaymentError("Could not submit your listing. Please try again later.", 500);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
