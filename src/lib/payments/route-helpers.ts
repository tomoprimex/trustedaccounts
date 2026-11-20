import "server-only";
import { NextResponse } from "next/server";
import { PaymentError } from "./server";

export function errorResponse(error: unknown) {
  if (error instanceof PaymentError) {
    return NextResponse.json({ success: false, error: error.message }, { status: error.status });
  }
  console.error("[payments] unexpected error:", error);
  return NextResponse.json({ success: false, error: "Something went wrong. Please try again." }, { status: 500 });
}

export function parseProvider(value: unknown) {
  if (value === "ercas") return "ercas" as const;
  if (value === "paystack" || value === "card" || value === undefined) return "paystack" as const;
  throw new PaymentError("Unsupported payment method");
}
