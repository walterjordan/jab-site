// src/components/MessengerAccessWizard.jsx
'use client';

import React, { useEffect, useMemo, useState } from 'react';

function DemoCarousel() {
  const slides = [
    "/demo-1.png",
    "/demo-2.png",
    "/demo-3.png",
    "/demo-4.png",
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % slides.length), 3500);
    return () => clearInterval(id);
  }, [slides.length]);
  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden ring-1 ring-slate-200 bg-slate-100">
      {/* slide */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={slides[i]}
        alt="Messenger demo screenshot"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* privacy masks (blur common sensitive zones) */}
      <div className="absolute inset-y-0 left-0 w-28 bg-white/20 backdrop-blur-sm" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-white/20 backdrop-blur-sm" />
      {/* controls */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            className={`h-2.5 w-2.5 rounded-full border border-slate-300 ${
              i === idx ? "bg-[#7FFF41] border-[#010E63]" : "bg-white/70"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function ManyChatStyleLanding() {
  return (
    <div className="min-h-screen w-full text-slate-900 overflow-x-hidden">
      

      {/* Fixed background layer (desktop) */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 bg-center bg-cover bg-no-repeat bg-fixed bg-fixed-desktop"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1920&auto=format&fit=crop')",
          filter: "brightness(0.96)",
        }}
      />

      {/* Gradient scrim for contrast */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-white/70 via-white/85 to-white" />

      {/* Sticky top nav */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-slate-200/60">
        <nav className="mx-auto max-w-7xl flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <img src="/jab-logo.png" alt="JAB logo" className="h-9 w-9 rounded-md shadow-sm" />
            <span className="font-semibold tracking-tight">Facebook Automation</span>
          </div>
          <ul className="hidden md:flex items-center gap-6 text-sm">
            <li><a href="#features" className="hover:text-[#010E63]">Features</a></li>
            <li><a href="#channels" className="hover:text-[#010E63]">Channels</a></li>
            <li><a href="#pricing" className="hover:text-[#010E63]">Pricing</a></li>
            <li><a href="#faq" className="hover:text-[#010E63]">FAQ</a></li>
          </ul>
          <div className="flex items-center gap-3">
            <a href="#" className="hidden md:inline-block px-4 py-2 rounded-xl border border-slate-300 text-sm">Log in</a>
            <a href="#cta" className="inline-block px-4 py-2 rounded-xl bg-[#7FFF41] text-black text-sm shadow">Get started</a>
          </div>
        </nav>
      </header>

      {/* Hero */}
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

      {/* Social proof bubbles strip */}
      <section className="py-6">
        <div className="mx-auto max-w-7xl px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Entrepreneurs", "Small Business", "Agencies", "Franchise"].map((t) => (
            <div key={t} className="rounded-2xl bg-white/80 ring-1 ring-slate-200 p-4 text-center">{t}</div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-3xl md:text-4xl font-semibold text-center">Automation that sells while you sleep</h2>
          <p className="text-center text-slate-600 mt-3 max-w-2xl mx-auto">Knock out Facebook Messenger replies with JAB.</p>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {[
              {title: "Facebook Messenger AI Assistant Agent", desc: "Upgrade Facebook Messenger with JAB and unlock a powerful Facebook Messenger AI Assistant Agent capable of generating leads and sending them to your phone real time via text message."},
              {title: "AI Assisted Response Selector", desc: "Smart Keywords capture prospect intent from  a Facebook Ad reply. This technique provides a more predictiable response by letting AI decide the best pre-crafted response."},
              {title: "Cloud Storage", desc: "Your customer interactions are securely stored and accessible by you only."},
              {title: "Speed to Lead", desc: "AI Assistant Agent & AI Assisted Response Selector generate timely customer responses automatically 24/7"},
              {title: "Payments", desc: "Collect via Stripe or native channel payments."},
              {title: "Integrations", desc: "Connect Chat GPT Assistants to Facebook, Instagram, Google, What's App, Slack, Workday Salesforce and more."},
            ].map((f) => (
              <div key={f.title} className="rounded-2xl p-6 ring-1 ring-slate-200 bg-white/90">
                <svg
  viewBox="0 0 24 24"
  className="mb-3 h-9 w-9 fill-[#7FFF41] drop-shadow"
  aria-hidden="true"
>
  <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
</svg>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Channels tabs (static demo) */}
      <section id="channels" className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-center">Channels</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {["Facebook", "Linked In", "Instagram", "WhatsApp", "TikTok"].map((c,i) => (
              <button key={c} className={`px-4 py-2 rounded-full text-sm border ${i===0 ? 'bg-[#7FFF41] text-black border-[#010E63]' : 'bg-white border-slate-300'}`}>{c}</button>
            ))}
          </div>
          <div className="mt-8 rounded-2xl bg-white/90 ring-1 ring-slate-200 p-6 grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="font-semibold text-lg">Facebook Messenger Automation</h3>
              <p className="text-sm text-slate-600 mt-2">Reply to comments with AI, capture phone numbers, follow up with links, and receive text messages when there is a Hot Lead.</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700 list-disc ml-5">
                <li>Auto‑reply to Facebook Ad</li>
                <li>Automaically follow up</li>
                <li>Receive Leads via text when a phone number is captured in Messenger.</li>
              </ul>
            </div>
            <DemoCarousel />
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section id="pricing" className="py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-3xl font-semibold text-center">Start with one service. Upgrade as you grow.</h2>
          <p className="text-center text-slate-600 mt-2">Simple month to month pricing.</p>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {[
              {name: "Left Jab", price: "$199", features: ["1 Social Media", "AI Assisted Response Selector", "Advanced Automations", "Email/Chat support"]},
              {name: "Upper Cut", price: "from $499/mo", features: ["1 Social", "Facebook Messenger AI Assistant Agent", "AI Assisted Response Selector", "Advanced Custom Automations", "Payments", "Priority support"]},
              {name: "Hay Maker", price: "from $999/mo", features: ["2 Socials", "Facebook & Instagram Messenger AI Assistant Agent", "AI Assisted Response Selector", "Advanced Custom Automations", "Payments", "High‑volume", "Dedicated success", "24/7 Live Contact"]},
            ].map((t, idx) => (
              <div key={t.name} className={`rounded-2xl p-6 ring-1 ring-slate-200 bg-white/90 ${idx===1 ? 'shadow-xl scale-[1.02] border border-[#7FFF41]/40' : ''}`}>
                <div className="text-sm font-medium text-slate-500">{t.name}</div>
                <div className="mt-1 text-3xl font-bold">{t.price}</div>
                <ul className="mt-4 space-y-2 text-sm text-slate-700 list-disc ml-5">
                  {t.features.map(f => <li key={f}>{f}</li>)}
                </ul>
                <a href="#signup" className={`mt-6 inline-block w-full text-center px-4 py-3 rounded-xl ${idx===1 ? 'bg-[#7FFF41] text-black' : 'border border-slate-300 bg-white'}`}>Choose plan</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-12">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-center">Frequently asked questions</h2>
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            {[{q:'What do I need to get started?', a:'A solid Facebook Business Page is a great start, we can help develop that for you if needed.'},
              {q:'Is there a contract', a:'There is no contract. We are transperent about our prices. No suprises.'},
              {q:'Is it safe to use AI to respond to customers?', a:'We tailor the AI Agent experience from low interaction to more if needed to ensure AI stays in check, lol'},
              {q:'Can I provide information for the AI Messenger Assistant?', a:'Yes. you can share files, websites and anything else helpful AI to refrence while chatting.'}].map(item => (
              <details key={item.q} className="group rounded-xl bg-white/90 ring-1 ring-slate-200 p-5">
                <summary className="cursor-pointer font-medium">{item.q}</summary>
                <p className="mt-2 text-sm text-slate-600">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/70 bg-white/80">
        <div className="mx-auto max-w-7xl px-4 py-10 grid md:grid-cols-4 gap-6 text-sm">
          <div>
            <img src="/jab-logo.png" alt="JAB logo" className="h-9 w-9 rounded-md mb-3 shadow-sm" />
            <p className="text-slate-600">Make conversations your unfair advantage.</p>
          </div>
          <div>
            <div className="font-semibold mb-2">Product</div>
            <ul className="space-y-2 text-slate-600">
              <li><a href="#features">Features</a></li>
              <li><a href="#channels">Channels</a></li>
              <li><a href="#pricing">Pricing</a></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Resources</div>
            <ul className="space-y-2 text-slate-600">
              <li><a href="#">Docs</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Help Center</a></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Get started</div>
            <a href="https://m.me/611741395360453" target="_blank" rel="noopener noreferrer" className="inline-block px-5 py-3 rounded-xl bg-[#7FFF41] text-black shadow">Chat Live on Messenger</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
