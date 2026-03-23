import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
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
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <Script id="ga4" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                  page_path: window.location.pathname,
                });
                ${
                  process.env.NODE_ENV === "development"
                    ? `console.log("GA_ID loaded: ${process.env.NEXT_PUBLIC_GA_ID}");`
                    : ""
                }
              `}
            </Script>
          </>
        )}
        <Script 
          src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js" 
          strategy="lazyOnload" 
        />
        {children}
      </body>
    </html>
  );
}