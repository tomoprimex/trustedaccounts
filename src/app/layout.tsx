import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TrustedAccounts — Premium Verified Logins for Social Media",
  description:
    "Get verified logins for Facebook, YouTube, Instagram, TikTok and more. Fast delivery, secure transactions, and 24/7 support.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(geist.variable, inter.variable)}>
      <body className="antialiased">{children}</body>
    </html>
  );
}