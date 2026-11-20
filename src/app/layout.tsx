import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Compliance Document Editor & PDF Generator (Privacy Policy, SMS Terms & Consent)",
  description: "Easily update company details and generate standard compliant Privacy Policy, SMS Terms and Conditions, and SMS Consent PDF/DOCX documents for 10DLC & A2P verification.",
};

export default function RootLayout({
  children,
}: Readrs<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 min-h-screen text-slate-900">{children}</body>
    </html>
  );
}
type Readrs<T> = T;
