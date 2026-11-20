"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Re-runs the server-side verification a few times while a payment is still processing. */
export function AutoRefresh({ intervalMs = 4000, maxTries = 12 }: { intervalMs?: number; maxTries?: number }) {
  const router = useRouter();

  useEffect(() => {
    const key = `pay-refresh:${window.location.pathname}`;
    let tries = 0;
    try {
      tries = Number(sessionStorage.getItem(key) || 0);
    } catch {}
    if (tries >= maxTries) return;

    const timer = setTimeout(() => {
      try {
        sessionStorage.setItem(key, String(tries + 1));
      } catch {}
      router.refresh();
    }, intervalMs);
    return () => clearTimeout(timer);
  }, [router, intervalMs, maxTries]);

  return null;
}
