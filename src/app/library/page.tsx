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
    <main className="min-h-screen bg-[#f5f7fb] px-2 py-4 sm:px-4 sm:py-6">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-gradient-to-br from-blue-900 to-indigo-900 rounded-lg">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5-1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5-1.253" />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
              My Library
            </h1>
          </div>
          <p className="text-xs text-slate-500">Your purchased recovery details</p>
        </div>

        {/* Empty State */}
        {(purchases ?? []).length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-xl p-4 border border-white/30 text-center shadow-sm">
            <div className="p-2 bg-blue-50 rounded-full w-fit mx-auto mb-2">
              <svg className="w-5 h-5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5-1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5-1.253" />
              </svg>
            </div>
            <p className="text-xs text-slate-500">No purchases yet</p>
            <p className="text-[10px] text-slate-400 mt-1">Visit the marketplace to get started</p>
          </div>
        ) : (
          <ul className="grid gap-2">
            {(purchases ?? []).map((p) => (
              <li key={p.website_id}>
                <Link 
                  href={`/library/${p.websites[0]?.slug}`}
                  className="block relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-indigo-900/10 rounded-xl blur-md" />
                  <div className="relative bg-white/80 backdrop-blur-xl rounded-xl p-2.5 border border-white/30 shadow-sm transition hover:shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5-1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5-1.253" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <strong className="block text-[10px] text-slate-900 truncate">{p.websites[0]?.name}</strong>
                          <small className="block text-[8px] text-slate-500 truncate">Purchased recovery pack</small>
                        </div>
                      </div>
                      <svg className="w-4 h-4 text-blue-900 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Back to Dashboard */}
        <div className="mt-4">
          <Link 
            href="/dashboard"
            className="inline-flex items-center gap-1 text-[10px] font-medium text-blue-900 hover:text-blue-800 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}