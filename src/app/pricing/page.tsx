"use client";

import React from 'react';
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Check, ArrowRight } from 'lucide-react';

const pricing = [
  {
    name: "JAB CORE",
    price: "$199 / Month",
    highlight: "The complete technology platform that allows you to manage all your customer communications including email, SMS, Direct Messages, Calls, Appointments, Reviews & more.",
    bullets: [
      "Pipeline + stages configured",
      "Text + email conversations setup",
      "Core follow-up automations",
      "EdgeAssist suggestions enabled",
      "Google Business Profile Integration",
      "Facebook & Instagram Integration",
      "Unified Inbox",
      "Mobile App Access"
    ],
    cta: "Book A Demo"
  },
  {
    name: "JAB CORE +",
    price: "$299 / Month",
    highlight: "All the Features of CORE with advanced features such as APPOINTMENTS & CALENDARS, CONTACTS & CRM, PIPELINES & OPPORTUNITIES & EMAIL MARKETING.",
    bullets: [
      "Everything in JAB CORE",
      "Advanced Appointments & Calendars",
      "Full CRM & Contact Management",
      "Pipelines & Opportunities Tracking",
      "Email Marketing Engine",
      "Integrated Website Templates",
      "Form & Survey Builder",
      "Automation Workflows"
    ],
    cta: "Book A Demo",
    featured: true
  },
  {
    name: "CORE Elite",
    price: "$399 / Month",
    highlight: "All the features of CORE + with AI Assistance, Advanced Automation and Integrated Website. If you don't see your situation here, send a message using the green chat bubble.",
    bullets: [
      "Everything in JAB CORE +",
      "AI Powered Assistant",
      "Advanced Custom Automations",
      "Fully Integrated Custom Website",
      "Web Apps & Dashboards",
      "Custom Onboarding Flows",
      "Secure Hosting Architecture",
      "Priority Support"
    ],
    cta: "Book A Demo"
  }
];

function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function PricingPage() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-50">
      <Header />

      <main className="py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl text-center md:mx-auto mb-20">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Pick how you want to work with us
            </h1>
            <p className="text-xl text-slate-300">
              Whether you&apos;re just getting started or rolling out across multiple locations, there&apos;s a path that fits.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pricing.map((tier) => (
              <article
                key={tier.name}
                className={classNames(
                  "flex flex-col rounded-3xl border bg-slate-900/50 p-8 text-left text-base shadow-sm transition-all duration-300 hover:scale-[1.02]",
                  tier.featured
                    ? "border-[#7fff41] shadow-lg shadow-[#7fff41]/10 ring-1 ring-[#7fff41]"
                    : "border-white/10"
                )}
              >
                <div className="flex items-center justify-between gap-2 mb-4">
                  <h2 className="text-2xl font-bold text-white">
                    {tier.name}
                  </h2>
                  {tier.featured && (
                    <span className="rounded-full bg-[#7fff41] px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-900">
                      Most popular
                    </span>
                  )}
                </div>
                
                <p className="text-slate-400 mb-6 min-h-[80px]">
                  {tier.highlight}
                </p>
                
                <div className="mb-8">
                  <span className="text-4xl font-bold text-white">{tier.price}</span>
                </div>

                <div className="space-y-4 mb-10 flex-1">
                  {tier.bullets.map((bullet) => (
                    <div key={bullet} className="flex items-start gap-3">
                      <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-[#7fff41]/20 flex items-center justify-center">
                        <Check className="w-3 h-3 text-[#7fff41]" />
                      </div>
                      <span className="text-sm text-slate-300">{bullet}</span>
                    </div>
                  ))}
                </div>

                <a
                  href="https://calendar.app.google/nrsnwLLEDFsyX5HP7"
                  target="_blank"
                  rel="noreferrer"
                  className={classNames(
                    "inline-flex items-center justify-center rounded-xl px-6 py-4 text-lg font-bold transition-all duration-300",
                    tier.featured
                      ? "bg-[#7fff41] text-slate-900 shadow-lg shadow-[#7fff41]/40 hover:bg-[#a4ff82]"
                      : "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-[#7fff41]"
                  )}
                >
                  {tier.cta} <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </article>
            ))}
          </div>

          {/* Bottom Summary */}
          <div className="mt-32 max-w-3xl mx-auto text-center">
            <div className="inline-block p-1 px-4 rounded-full bg-[#7fff41]/10 text-[#7fff41] font-bold text-xs uppercase tracking-widest mb-6 border border-[#7fff41]/20">
              The Bottom Line
            </div>
            <p className="text-2xl text-slate-300 italic leading-relaxed">
              &quot;JAB CORE is a premium business operating system that organizes your leads, automates your follow-ups, and uses AI to help your team close deals faster. It’s not just software; it’s a fully configured revenue engine that we set up for you, so you can stop worrying about the tech and start focusing on growth.&quot;
            </p>
          </div>

          {/* NEW: Terminal Call to Action / Next Steps */}
          <div className="mt-20 border-t border-white/10 pt-16 text-center">
            <h3 className="text-3xl font-bold text-white mb-6">Ready to see it in action?</h3>
            <p className="text-slate-300 mb-10 max-w-2xl mx-auto">
              Book a demo to see how JAB CORE can be customized for your business, or explore our resources to learn more about our automation platform.
            </p>

            {/* Main Action Buttons (Stack on mobile, side-by-side on tablet/desktop) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <a
                href="https://calendar.app.google/nrsnwLLEDFsyX5HP7"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-[#7fff41] px-8 py-4 text-lg font-bold text-slate-900 shadow-lg shadow-[#7fff41]/40 transition hover:bg-[#a4ff82]"
              >
                Book A Demo <ArrowRight className="ml-2 w-5 h-5" />
              </a>
              <a
                href="/events"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-lg font-medium text-white transition hover:border-[#7fff41]/60 hover:bg-white/10"
              >
                Join a Free Workshop
              </a>
            </div>

            {/* Secondary Links (Smaller, text-based options) */}
            <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-slate-400">
              <a href="/features" className="hover:text-[#7fff41] transition">
                → View All Features
              </a>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('open-chatkit'))} 
                className="hover:text-[#7fff41] transition"
              >
                → Ask us a question
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
