import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jordan & Borden | Facebook Automation & AI Consulting",
  description:
    "Jordan & Borden helps growth-minded brands build Meta Messenger & Instagram automations that sell, support, and scale using AI.",
  metadataBase: new URL("https://jordanborden.com"),
  openGraph: {
    title: "Jordan & Borden Automation Consulting",
    description:
      "Automation that makes every Facebook & Instagram conversation count.",
    url: "https://jordanborden.com",
    siteName: "Jordan & Borden",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-full flex flex-col bg-slate-950 text-slate-50`}
      >
        {children}
      </body>
    </html>
  );
}