import { notFound, redirect } from "next/navigation";
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
    return (
      <main style={{ maxWidth: 700, margin: "40px auto", padding: 16 }}>
        <h1>{website.name}</h1>
        <p>You have not purchased this account recovery pack yet.</p>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 700, margin: "40px auto", padding: 16 }}>
      <h1>{website.name} - Account Recovery Details</h1>
      <section style={{ marginBottom: 24 }}>
        <h2>Email</h2>
        <pre style={{ background: "#f5f5f5", padding: 12, borderRadius: 4 }}>{texts.email}</pre>
      </section>
      <section style={{ marginBottom: 24 }}>
        <h2>Phone Number</h2>
        <pre style={{ background: "#f5f5f5", padding: 12, borderRadius: 4 }}>{texts.phone_number}</pre>
      </section>
      <section style={{ marginBottom: 24 }}>
        <h2>2FA Link</h2>
        <pre style={{ background: "#f5f5f5", padding: 12, borderRadius: 4 }}>{texts.two_factor_link}</pre>
      </section>
      <section style={{ marginBottom: 24 }}>
        <h2>Password</h2>
        <pre style={{ background: "#f5f5f5", padding: 12, borderRadius: 4 }}>{texts.password}</pre>
      </section>
    </main>
  );
}
