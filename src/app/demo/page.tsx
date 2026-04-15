"use client";

import React from 'react';
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import DemoInteractive from "@/components/landing/DemoInteractive";

const audiencePills = ["Entrepreneurs", "Small Business", "Agencies", "Franchise"];
const MESSENGER_URL = "https://m.me/611741395360453";

export default function DemoPage() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-50">
      <Header />

      <main>
        {/* HERO SECTION */}
        <section className="relative border-b border-white/5 py-12 md:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/70 px-3 py-1 text-xs ring-1 ring-white/10 mb-8">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#7fff41]" />
                <span className="font-medium text-slate-200">
                  Verified Meta Media Agency · WhatsApp · Instagram · Messenger
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Make the most out of{" "}
                <span className="bg-gradient-to-r from-[#7fff41] via-white to-[#ff00ff] bg-clip-text text-transparent">
                  every conversation
                </span>
              </h1>

              <p className="text-xl text-slate-300 mb-8 max-w-2xl">
                Jordan & Borden designs high-performing Messenger and Instagram automations that feel human, respond instantly, and plug directly into your sales process.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <a
                  href={MESSENGER_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-[#7fff41] px-8 py-4 text-lg font-bold text-slate-900 shadow-lg shadow-[#7fff41]/40 transition hover:bg-[#a4ff82]"
                >
                  Chat live on Messenger
                </a>
                <a
                  href="https://calendar.app.google/nrsnwLLEDFsyX5HP7"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-4 text-lg font-medium text-slate-100 hover:border-[#7fff41]/60 hover:text-[#7fff41]"
                >
                  Book a strategy session
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left max-w-4xl mx-auto mb-16">
                <div>
                  <p className="text-2xl font-bold text-white mb-2">40+ campaigns automated</p>
                  <p className="text-slate-400">From local service brands to multi-location franchises.</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white mb-2">&lt; 30s average response</p>
                  <p className="text-slate-400">Keep leads warm while your team focuses on closers.</p>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                {audiencePills.map((pill) => (
                  <span
                    key={pill}
                    className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-300"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE DEMO */}
        <div className="py-20 bg-slate-900/30">
          <div className="mx-auto max-w-7xl px-6">
            <DemoInteractive />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
