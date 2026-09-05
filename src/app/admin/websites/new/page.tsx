"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function NewWebsitePage() {
  const supabase = createClient();
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price_naira: "2500",
    email: "",
    phone_number: "",
    two_factor_link: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  async function save() {
    const price_kobo = Math.round(Number(form.price_naira) * 100);

    const { data: website, error } = await supabase
      .from("websites")
      .insert({
        name: form.name,
        slug: form.slug,
        description: form.description,
        price_kobo,
        currency: "NGN",
        is_published: true,
      })
      .select("id")
      .single();

    if (error || !website) {
      setMessage(error?.message || "Could not create website");
      return;
    }

    const { error: textError } = await supabase.from("website_texts").insert({
      website_id: website.id,
      email: form.email,
      phone_number: form.phone_number,
      two_factor_link: form.two_factor_link,
      password: form.password,
    });

    setMessage(textError ? textError.message : "Saved. Open / to see it.");
  }

  function update(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <main style={{ maxWidth: 700, margin: "40px auto", padding: 16 }}>
      <h1>New Account Recovery Pack</h1>
      <input
        placeholder="Name (e.g., Facebook)"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("name", e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: 8, padding: 8 }}
      />
      <input
        placeholder="slug-like-this"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("slug", e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: 8, padding: 8 }}
      />
      <input
        placeholder="Description"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("description", e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: 8, padding: 8 }}
      />
      <input
        placeholder="Price in Naira"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => update("price_naira", e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: 8, padding: 8 }}
      />
      <textarea
        placeholder="Email"
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => update("email", e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: 8, padding: 8, minHeight: 60 }}
      />
      <textarea
        placeholder="Phone Number"
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => update("phone_number", e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: 8, padding: 8, minHeight: 60 }}
      />
      <textarea
        placeholder="2FA Link"
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => update("two_factor_link", e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: 8, padding: 8, minHeight: 60 }}
      />
      <textarea
        placeholder="Password"
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => update("password", e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: 8, padding: 8, minHeight: 60 }}
      />
      <button onClick={save} style={{ padding: 12, fontSize: 16 }}>Save</button>
      <p>{message}</p>
    </main>
  );
}
