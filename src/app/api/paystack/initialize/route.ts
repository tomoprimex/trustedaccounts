import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { initializeTransaction } from "@/lib/paystack";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const { websiteId } = await request.json();
  if (!websiteId) {
    return NextResponse.json({ error: "websiteId required" }, { status: 400 });
  }

  const { data: website, error: websiteError } = await supabase
    .from("websites")
    .select("id, price_kobo, is_published")
    .eq("id", websiteId)
    .single();

  if (websiteError || !website || !website.is_published) {
    return NextResponse.json({ error: "Website not found" }, { status: 404 });
  }

  const { data: existing } = await supabase
    .from("purchases")
    .select("id, status")
    .eq("user_id", user.id)
    .eq("website_id", website.id)
    .maybeSingle();

  if (existing?.status === "paid") {
    return NextResponse.json({ error: "Already purchased" }, { status: 409 });
  }

  const reference = `ta_${user.id.slice(0, 8)}_${website.id}_${Date.now()}`;

  if (existing) {
    await supabase
      .from("purchases")
      .update({ paystack_reference: reference, status: "pending", amount_kobo: website.price_kobo })
      .eq("id", existing.id);
  } else {
    const { error: insertError } = await supabase.from("purchases").insert({
      user_id: user.id,
      website_id: website.id,
      paystack_reference: reference,
      status: "pending",
      amount_kobo: website.price_kobo,
    });
    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 400 });
    }
  }

  const payment = await initializeTransaction({
    email: user.email,
    amountKobo: website.price_kobo,
    reference,
    callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/payment/callback`,
    metadata: {
      user_id: user.id,
      website_id: String(website.id),
    },
  });

  return NextResponse.json({ authorization_url: payment.authorization_url });
}
