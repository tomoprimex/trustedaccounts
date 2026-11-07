const ERCASPAY_BASE_URL = process.env.ERCASPAY_BASE_URL || "https://api.phoenix-wallet.ercaspay.com/api/v1";

interface InitializeTransactionInput {
  amount: number;
  paymentReference: string;
  customerName: string;
  customerEmail: string;
  redirectUrl: string;
  currency?: string;
}

export async function initializeTransaction(input: InitializeTransactionInput) {
  const res = await fetch(`${ERCASPAY_BASE_URL}/payment/initiate`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.ERCASPAY_SECRET_KEY}`,
    },
    body: JSON.stringify({
      amount: input.amount,
      paymentReference: input.paymentReference,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      currency: input.currency || "NGN",
      redirectUrl: input.redirectUrl,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Ercas Pay initialize failed");
  }

  return data.responseBody;
}

export async function verifyTransaction(transactionRef: string) {
  const res = await fetch(
    `${ERCASPAY_BASE_URL}/payment/transaction/verify/${encodeURIComponent(transactionRef)}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.ERCASPAY_SECRET_KEY}`,
      },
      cache: "no-store",
    }
  );

  return res.json();
}
