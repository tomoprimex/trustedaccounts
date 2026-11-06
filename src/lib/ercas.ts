const ERCAS_BASE = "https://api.ercaspay.com/api/v1";

interface InitializeTransactionInput {
  email: string;
  amountKobo: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, any>;
}

export async function initializeTransaction(input: InitializeTransactionInput) {
  const res = await fetch(`${ERCAS_BASE}/payment/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.ERCAS_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: input.email,
      amount: input.amountKobo,
      currency: "NGN",
      reference: input.reference,
      callback_url: input.callbackUrl,
      metadata: input.metadata,
    }),
  });

  const json = await res.json();
  if (!json.status) {
    throw new Error(json.message || "Ercas Pay initialize failed");
  }

  return json.data;
}

export async function verifyTransaction(reference: string) {
  const res = await fetch(
    `${ERCAS_BASE}/payment/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.ERCAS_SECRET_KEY}`,
      },
      cache: "no-store",
    }
  );

  const json = await res.json();
  if (!json.status) {
    throw new Error(json.message || "Ercas Pay verify failed");
  }

  return json.data;
}
