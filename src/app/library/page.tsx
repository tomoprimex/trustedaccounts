import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function LibraryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: purchases } = await supabase
    .from("purchases")
    .select("website_id, websites(name, slug)")
    .eq("user_id", user.id)
    .eq("status", "paid");

  return (
    <main style={{ maxWidth: 700, margin: "40px auto", padding: 16 }}>
      <h1>My library</h1>
      <ul>
        {(purchases ?? []).map((p) => (
          <li key={p.website_id}>
            <Link href={`/library/${p.websites[0]?.slug}`}>{p.websites[0]?.name}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
