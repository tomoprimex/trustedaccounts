const PAYSTACK_BASE = "https://api.paystack.co";

interface InitializeTransactionInput {
  email: string;
  amountKobo: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, any>;
}

export async function initializeTransaction(input: InitializeTransactionInput) {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
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
    throw new Error(json.message || "Paystack initialize failed");
  }

  return json.data;
}

export async function verifyTransaction(reference: string) {
  const res = await fetch(
    `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
      cache: "no-store",
    }
  );

  const json = await res.json();
  if (!json.status) {
    throw new Error(json.message || "Paystack verify failed");
  }

  return json.data;
}
