import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BuyButton from "./buy-button";

export default async function WebsitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: website } = await supabase
    .from("websites")
    .select("id, slug, name, description, price_kobo, currency")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!website) notFound();

  const { data: { user } } = await supabase.auth.getUser();

  let alreadyBought = false;
  if (user) {
    const { data: purchase } = await supabase
      .from("purchases")
      .select("id")
      .eq("user_id", user.id)
      .eq("website_id", website.id)
      .eq("status", "paid")
      .maybeSingle();
    alreadyBought = Boolean(purchase);
  }

  return (
    <main style={{ maxWidth: 700, margin: "40px auto", padding: 16 }}>
      <h1>{website.name}</h1>
      <p>{website.description}</p>
      <p>Price: {(website.price_kobo / 100).toLocaleString()} {website.currency}</p>
      <p>After payment, you'll receive: Email, Phone Number, 2FA Link, and Password to recover your account.</p>
      {alreadyBought ? (
        <a href={`/library/${website.slug}`}>Open in library</a>
      ) : (
        <BuyButton websiteId={website.id} />
      )}
    </main>
  );
}
