"use client";

import { useState } from "react";

export default function BuyButton({ websiteId }: { websiteId: number }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function buy() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/paystack/initialize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ websiteId }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Could not start payment");
      setLoading(false);
      if (res.status === 401) window.location.href = "/login";
      return;
    }
    window.location.href = json.authorization_url;
  }

  return (
    <div>
      <button onClick={buy} disabled={loading} style={{ padding: 12, fontSize: 16 }}>
        {loading ? "Redirecting..." : "Buy with Paystack"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
