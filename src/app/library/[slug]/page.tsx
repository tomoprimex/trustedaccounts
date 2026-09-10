import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function LibraryItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: website } = await supabase
    .from("websites")
    .select("id, name, slug")
    .eq("slug", slug)
    .single();

  if (!website) notFound();

  const { data: texts } = await supabase
    .from("website_texts")
    .select("email, phone_number, two_factor_link, password")
    .eq("website_id", website.id)
    .maybeSingle();

  if (!texts) {
    return <main className="min-h-screen bg-[#f5f7fb] px-3 py-8 sm:px-6 sm:py-12"><div className="app-surface mx-auto max-w-2xl p-6"><h1 className="app-page-title">{website.name}</h1><p className="mt-3 text-sm text-slate-500">You have not purchased this account recovery pack yet.</p></div></main>;
  }

  const details = [["Email", texts.email], ["Phone number", texts.phone_number], ["2FA link", texts.two_factor_link], ["Password", texts.password]];
  return <main className="min-h-screen bg-[#f5f7fb] px-3 py-8 sm:px-6 sm:py-12"><div className="mx-auto max-w-2xl"><Link href="/library" className="text-xs font-bold text-blue-600">← Back to library</Link><div className="mb-6 mt-5"><p className="text-[10px] font-bold uppercase tracking-[.16em] text-blue-600">Private purchase</p><h1 className="mt-2 text-2xl font-extrabold tracking-[-.06em] text-[#0a2342]">{website.name}</h1><p className="mt-2 text-xs text-slate-500">Keep these recovery details private.</p></div><div className="space-y-3">{details.map(([label, value]) => <section key={label} className="app-surface p-4"><h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</h2><pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-all rounded-lg bg-slate-50 p-3 text-xs font-medium text-[#0a2342]">{value}</pre></section>)}</div></div></main>;
}
