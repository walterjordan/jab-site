// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://jab-mobile-199373649190.us-east1.run.app"),
  title: {
    default: "Facebook Automation — JAB",
    template: "%s — JAB",
  },
  description:
    "Sell more with AI-powered Facebook & Messenger automation by Jordan & Borden.",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico" }, // fallback for older browsers
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  themeColor: "#010E63",
  openGraph: {
    title: "Facebook Automation — JAB",
    description: "AI assistant that captures leads and replies 24/7 on Messenger.",
    url: "/",
    siteName: "JAB",
    images: [{ url: "/jab-logo.png", width: 512, height: 512, alt: "JAB" }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Facebook Automation — JAB",
    description: "AI assistant that captures leads and replies 24/7 on Messenger.",
    images: ["/jab-logo.png"],
  },
  applicationName: "JAB",
  creator: "Jordan & Borden",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

