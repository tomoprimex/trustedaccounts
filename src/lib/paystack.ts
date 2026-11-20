import "server-only";

const PAYSTACK_BASE = "https://api.paystack.co";

function secretKey() {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not configured");
  return key;
}

interface InitializeTransactionInput {
  email: string;
  amountKobo: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}

export async function initializeTransaction(input: InitializeTransactionInput) {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey()}`,
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
    cache: "no-store",
  });

  const json = await res.json().catch(() => ({}));
  if (!json.status) {
    throw new Error(json.message || "Paystack initialize failed");
  }

  return json.data as { authorization_url: string; access_code: string; reference: string };
}

export interface PaystackVerifyResult {
  paid: boolean;
  status: string;
  amountKobo: number;
  raw: unknown;
}

export async function verifyTransaction(reference: string): Promise<PaystackVerifyResult> {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secretKey()}` },
    cache: "no-store",
  });

  const json = await res.json().catch(() => ({}));
  if (!json.status) {
    throw new Error(json.message || "Paystack verify failed");
  }

  return {
    paid: json.data.status === "success",
    status: json.data.status,
    amountKobo: Number(json.data.amount),
    raw: json.data,
  };
}
