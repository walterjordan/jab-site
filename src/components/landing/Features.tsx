// src/components/landing/Features.tsx
import React from 'react';

type Feature = {
  title: string;
  desc: string;
  videoUrl?: string;
  colSpan?: string; // e.g., "md:col-span-2"
};

const features: Feature[] = [
  {
    title: "Self-Service Client Arrival Kiosk",
    desc: "Streamline check-ins for local businesses like Olive Tree Therapy & Wellness. Clients simply scan a QR code to notify staff they've arrived—fully automated.",
    videoUrl: "/OTAD.mp4",
    colSpan: "md:col-span-2 md:row-span-2"
  },
  {
    title: "Facebook Messenger AI Agent", 
    desc: "Upgrade Facebook Messenger with JAB. Unlock an AI Assistant capable of generating leads and sending them to your phone in real-time."
  },
  {
    title: "AI Assisted Response Selector", 
    desc: "Smart Keywords capture prospect intent. AI suggests the best pre-crafted response for predictable, high-quality replies."
  },
  {
    title: "Cloud Storage", 
    desc: "Your customer interactions are securely stored and accessible by you only."
  },
  {
    title: "Speed to Lead", 
    desc: "AI Agents respond to customers instantly, 24/7, ensuring you never miss a lead."
  },
  {
    title: "Payments", 
    desc: "Collect payments directly via Stripe or native channel integrations."
  },
  {
    title: "Integrations", 
    desc: "Connect ChatGPT Assistants to Facebook, Instagram, Google, WhatsApp, Slack, Salesforce, and more."
  },
];

export function Features() {
  return (
    <section id="features" className="py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-3xl md:text-4xl font-semibold text-center text-white">Automation that sells while you sleep</h2>
        <p className="text-center text-slate-400 mt-3 max-w-2xl mx-auto">Knock out Facebook Messenger replies with JAB.</p>
        
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
          {features.map((f, i) => (
            <div 
              key={f.title} 
              className={`relative overflow-hidden rounded-2xl p-6 ring-1 ring-white/10 transition-all hover:ring-[#7FFF41]/50 ${f.colSpan || ""} ${f.videoUrl ? "bg-slate-900" : "bg-white/5"}`}
            >
              {f.videoUrl ? (
                <>
                  {/* Video Background */}
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-overlay transition-opacity duration-700 hover:opacity-40"
                  >
                    <source src={f.videoUrl} type="video/mp4" />
                  </video>
                  
                  {/* Dark Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                  {/* Content (Positioned at bottom for video visibility) */}
                  <div className="relative z-10 flex h-full flex-col justify-end">
                    <h3 className="text-2xl font-bold text-white mb-2">{f.title}</h3>
                    <p className="text-sm text-slate-200 font-medium leading-relaxed max-w-lg">
                      {f.desc}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {/* Standard Card */}
                  <svg
                    viewBox="0 0 24 24"
                    className="mb-4 h-9 w-9 fill-[#7FFF41] drop-shadow-lg"
                    aria-hidden="true"
                  >
                    <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-white">{f.title}</h3>
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed">{f.desc}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

