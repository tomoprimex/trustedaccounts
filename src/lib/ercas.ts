import "server-only";

// Ercaspay API reference (matches the official ercaspay-sdk):
//   - auth:     Authorization: Bearer <SECRET KEY>   (ECRS-TEST-SK... / ECRS-LIVE-SK...)
//   - initiate: POST {base}/payment/initiate         amount is in NAIRA (major units)
//   - verify:   GET  {base}/payment/transaction/verify/{transactionReference}  (the "ERCS|..." ref)
const ERCASPAY_BASE_URL = (process.env.ERCASPAY_BASE_URL || "https://api.ercaspay.com/api/v1").replace(/\/+$/, "");

function secretKey() {
  const key = process.env.ERCASPAY_SECRET_KEY || process.env.ERCASPAY_API_KEY;
  if (!key) throw new Error("ERCASPAY_SECRET_KEY is not configured");
  return key;
}

function headers() {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${secretKey()}`,
  };
}

interface InitializeTransactionInput {
  /** Amount in kobo; converted to Naira for Ercaspay. */
  amountKobo: number;
  paymentReference: string;
  customerName: string;
  customerEmail: string;
  redirectUrl: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface ErcasInitResult {
  checkoutUrl: string;
  transactionReference: string;
  paymentReference: string;
}

export async function initializeTransaction(input: InitializeTransactionInput): Promise<ErcasInitResult> {
  const res = await fetchWithRetry(`${ERCASPAY_BASE_URL}/payment/initiate`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      amount: input.amountKobo / 100,
      paymentReference: input.paymentReference,
      paymentMethods: "card,bank-transfer,ussd,qrcode",
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      currency: "NGN",
      feeBearer: "customer",
      redirectUrl: input.redirectUrl,
      description: input.description,
      metadata: input.metadata,
    }),
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.requestSuccessful === false || !data.responseBody?.checkoutUrl) {
    throw new Error(data.responseMessage || data.message || `Ercaspay initialize failed (${res.status})`);
  }

  return data.responseBody as ErcasInitResult;
}

export interface ErcasVerifyResult {
  paid: boolean;
  status: string;
  amountKobo: number;
  raw: unknown;
}

/** fetch with one retry on network errors (DNS hiccups, timeouts). */
async function fetchWithRetry(url: string, init: RequestInit) {
  try {
    return await fetch(url, init);
  } catch {
    await new Promise((r) => setTimeout(r, 800));
    return fetch(url, init);
  }
}

export async function verifyTransaction(transactionReference: string): Promise<ErcasVerifyResult> {
  const res = await fetchWithRetry(
    `${ERCASPAY_BASE_URL}/payment/transaction/verify/${encodeURIComponent(transactionReference)}`,
    { headers: headers(), cache: "no-store" }
  );

  // Unpaid transactions come back with requestSuccessful=false but still include a status
  // (e.g. "UNCOMPLETED"), so only treat a missing body as an error.
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.responseBody?.status) {
    throw new Error(data.responseMessage || data.message || `Ercaspay verify failed (${res.status})`);
  }

  const body = data.responseBody;
  const status = String(body.status ?? "").toLowerCase();
  return {
    paid: ["success", "successful", "paid", "completed"].includes(status),
    status,
    amountKobo: Math.round(Number(body.amount ?? 0) * 100),
    raw: body,
  };
}
