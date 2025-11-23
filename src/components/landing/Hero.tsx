// src/components/landing/Hero.tsx
import React from 'react';

export function Hero() {
  return (
    <section id="cta" className="relative">
      <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 ring-1 ring-slate-200 px-3 py-1 text-xs mb-4">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            Verified Meta Media Agency • WhatsApp • Instagram • Messenger • TikTok
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Make the most out of <span className="text-[#630183]">every conversation</span>
          </h1>
          <p className="mt-4 text-lg text-slate-700 max-w-2xl">
            Sell more, engage better, and grow your audience with powerful automations across Facebook and Instagram.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a className="px-5 py-3 rounded-xl bg-[#7FFF41] text-black shadow" href="https://m.me/611741395360453" target="_blank" rel="noopener noreferrer">Chat Live on Messenger</a>
          </div>
          <div className="mt-8 flex items-center gap-6 opacity-80">
            <span className="px-3 py-1 rounded-full bg-white/80 ring-1 ring-slate-200 text-sm">4.8★</span>
            <span className="px-3 py-1 rounded-full bg-white/80 ring-1 ring-slate-200 text-sm">Verified Meta Media Agency</span>
          </div>
        </div>
      </div>
    </section>
  );
}
