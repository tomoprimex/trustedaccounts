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

  return <main className="min-h-screen bg-[#f5f7fb] px-3 py-8 sm:px-6 sm:py-14"><div className="mx-auto max-w-2xl"><a href="/library" className="text-xs font-bold text-blue-600">← Back to library</a><section className="app-surface mt-5 overflow-hidden"><div className="bg-[#0a2342] p-6 text-white sm:p-8"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-blue-200">Verified recovery pack</p><h1 className="mt-3 text-3xl font-extrabold tracking-[-.06em]">{website.name}</h1><p className="mt-3 text-sm leading-6 text-blue-100/70">{website.description}</p></div><div className="space-y-6 p-5 sm:p-8"><div className="flex items-end justify-between gap-4"><span className="text-xs text-slate-500">One-time price</span><strong className="text-2xl font-extrabold tracking-[-.05em] text-[#0a2342]">{(website.price_kobo / 100).toLocaleString()} {website.currency}</strong></div><div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs leading-6 text-slate-600">After payment, you will receive the email, phone number, 2FA link, and password needed for recovery.</div>{alreadyBought ? <a className="block rounded-xl bg-[#0a2342] px-4 py-3 text-center text-xs font-extrabold text-white" href={`/library/${website.slug}`}>Open in library</a> : <BuyButton websiteId={website.id} />}</div></section></div></main>;
}
