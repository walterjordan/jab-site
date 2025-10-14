// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Facebook Automation — JAB",
    template: "%s — JAB",
  },
  description:
    "Sell more with AI-powered Facebook & Messenger automation by Jordan & Borden.",
  icons: {
    icon: [
      { url: "/favicon.ico" },            // optional if you have one
      { url: "/jab-logo.png", type: "image/png" } // your logo in /public
    ],
  },
  openGraph: {
    title: "Facebook Automation — JAB",
    description:
      "AI assistant that captures leads and replies 24/7 on Messenger.",
    url: "https://jab-mobile-199373649190.us-east1.run.app", // your Cloud Run URL
    siteName: "JAB",
    images: [{ url: "/jab-logo.png", width: 512, height: 512 }],
  },
  twitter: {
    card: "summary",
    title: "Facebook Automation — JAB",
    description:
      "AI assistant that captures leads and replies 24/7 on Messenger.",
    images: ["/jab-logo.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
