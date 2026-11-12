/**
 * Gets the Ercas Pay public key from environment variables and formats it correctly
 */
export function getErcasPayPublicKey(): string {
  const publicKey = process.env.ERCASPAY_PUBLIC_KEY;
  if (!publicKey) {
    throw new Error("ERCASPAY_PUBLIC_KEY not configured");
  }

  // Replace escaped newlines with actual newlines
  return publicKey.replace(/\\n/g, "\n");
}
