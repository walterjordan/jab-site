// src/components/landing/Features.tsx
import React from 'react';

export function Features() {
  return (
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
  );
}
