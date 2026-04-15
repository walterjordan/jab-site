"use client";

import DemoInteractive from "@/components/landing/DemoInteractive";
import ChatWidget from "@/components/chat/ChatWidget";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Layers, Sparkles, GraduationCap, Globe, TabletSmartphone, Mic } from 'lucide-react';

const MESSENGER_URL = "https://m.me/611741395360453";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/events", label: "Events" },
  { href: "/pricing", label: "Pricing" },
  { href: "/workshops", label: "Free LIVE Workshops" },
  { href: "/demo", label: "Demo" },
];

const audiencePills = ["Entrepreneurs", "Small Business", "Agencies", "Franchise"];

const featureCards = [
  {
    title: "JAB CORE",
    desc: "The complete technology platform that allows you to manage all your customer communications including email, SMS, Direct Messages, Calls, Appointments, Reviews & more.",
    href: "/features",
    cta: "View all Features",
    icon: Layers,
    mainOffering: true,
  },
  {
    title: "JAB CORE+",
    desc: "All the Features of CORE with advanced features such as APPOINTMENTS & CALENDARS, CONTACTS & CRM, PIPELINES & OPPORTUNITIES & EMAIL MARKETING.",
    href: "/features",
    cta: "View all Features",
    icon: Sparkles,
    mainOffering: true,
  },
  {
    title: "AI Mastermind",
    desc: "Self Paced AI For Business upskilling. Master the skills, earn badges, and join a network of top-tier builders.",
    href: "https://www.aimastermind.jordanborden.com",
    cta: "Start your mission",
    highlight: true,
    icon: GraduationCap,
  },
  {
    title: "Same-Day Website $100",
    desc: "Launch a simple, professional website today for a flat $100! No long timelines, no complexity, just results.",
    icon: Globe,
  },
  {
    title: "Self-Service Client Arrival Kiosk",
    desc: "Clients check themselves in on an iPad, updating your schedule in real-time so practitioners see who has arrived without checking the lobby.",
    icon: TabletSmartphone,
  },
  {
    title: "Free Live 90 min AI Mastermind Workshop",
    desc: "Join our hands-on live workshop to discover practical AI and automation strategies you can implement immediately.",
    icon: Mic,
  },
];

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
      "Book A Demo",
    ],
  },
  {
    name: "JAB CORE +",
    price: "$299 / Month",
    highlight: "All the Features of CORE with advanced features such as APPOINTMENTS & CALENDARS, CONTACTS & CRM, PIPELINES & OPPORTUNITIES & EMAIL MARKETING.",
    bullets: [
      "Fast launches (no reinventing the wheel)",
      "GHL embedded forms + CRM tracking",
      "Conversion-first layout + CTA structure",
      "Add-ons like blog, private hosting, and more",
      "Book A Demo",
    ],
  },
  {
    name: "CORE Elite",
    price: "$399 / Month",
    highlight: "All the features of CORE + with AI Assistance, Advanced Automation and Integrated Website. If you don't see your situation here, send a message using the green chat bubble.",
    bullets: [
      "Web apps + dashboards",
      "Custom onboarding flows",
      "Data integrations & automations",
      "Secure hosting architecture (Secure Edge)",
      "Book A Demo",
    ],
    featured: true,
  },
];

const faqs = [
  {
    q: "Is this just another chatbot builder?",
    a: "No. We design the strategy, build the flows, and plug them into your existing marketing so they actually make money instead of just replying with canned answers.",
  },
  {
    q: "Do I need a big ad budget first?",
    a: "Not at all. Automations help whether your traffic comes from paid ads, organic content, or existing customers you’re re-engaging.",
  },
  {
    q: "Which tools do you work with?",
    a: "We specialize in Meta tools plus Make.com, Airtable, Google Sheets, and other API-friendly platforms that keep your stack flexible.",
  },
  {
    q: "Can you train my team or agency?",
    a: "Yes. We run internal workshops and build reusable playbooks so your team can keep iterating long after the first build.",
  },
];

function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ManyChatStyleLanding() {
  return (
    <div className="relative w-full">
      {/* Top gradient background */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-[#010e63] via-[#630183] to-slate-950"
      />

      {/* Subtle radial highlight */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 opacity-70 [background:radial-gradient(circle_at_top,_rgba(127,255,65,0.18),_transparent_60%)]"
      />

      <Header />

      <main>
        {/* NEW HERO */}
        <section className="relative border-b border-white/5 py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight text-white mb-6">
                  We Help Businesses Grow By{" "}
                  <span className="bg-gradient-to-r from-[#7fff41] to-white bg-clip-text text-transparent">
                    Centralizing Operations for Revenue Generation
                  </span>
                </h1>
                <p className="text-xl text-slate-300 mb-8">
                  JAB provides customer communications technology and marketing services to businesses that need to Centralize Operations for Revenue Generation.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="/pricing"
                    className="inline-flex items-center justify-center rounded-full bg-[#7fff41] px-8 py-4 text-lg font-bold text-slate-900 shadow-lg shadow-[#7fff41]/40 transition hover:bg-[#a4ff82]"
                  >
                    Get Started
                  </a>
                  <a
                    href="https://calendar.app.google/nrsnwLLEDFsyX5HP7"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-4 text-lg font-medium text-slate-100 hover:border-[#7fff41]/60 hover:text-[#7fff41]"
                  >
                    Book A Demo
                  </a>
                </div>
              </div>
              <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/IvGp2fczb5k"
                  title="JAB Technology Overview"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="border-b border-white/5 py-12 md:py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-3xl text-center md:mx-auto mb-12">
              <h2 className="text-2xl font-semibold text-[#7fff41] uppercase tracking-wider mb-2">
                C.O.R.E is a Complete Platform Solution
              </h2>
              <h3 className="text-3xl font-bold text-white mb-6">
                The Centralized Operations You Need for Revenue Generation
              </h3>
              <p className="text-lg text-slate-300">
                We provide a single Centralized Operations Platform for business owners of all types of industries that enable you to sell more, handle more, and grow revenue.
                Every industry has special needs when it comes to sales & marketing technology. JAB&apos;s C.O.R.E technology platform allows you to manage all your customer communication channels, including email, SMS, direct messages, calls, appointments, and reviews, in one place.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {featureCards.map((f: any) => (
                <article
                  key={f.title}
                  className={classNames(
                    "group relative flex flex-col rounded-2xl border p-5 text-left shadow-sm transition hover:-translate-y-1",
                    f.highlight
                      ? "border-[#7fff41]/40 bg-slate-900/80 shadow-[#7fff41]/10 hover:border-[#7fff41] hover:shadow-[#7fff41]/20"
                      : "border-white/8 bg-slate-900/70 hover:border-[#7fff41]/40 hover:shadow-[#7fff41]/20"
                  )}
                >
                  <div className={classNames(
                    "mb-4 inline-flex items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                    f.mainOffering 
                      ? "h-12 w-12 bg-gradient-to-br from-[#7fff41] to-[#32a852] text-slate-950 shadow-[0_0_20px_rgba(127,255,65,0.4)]" 
                      : "h-10 w-10 bg-[#630183]/40 text-[#7fff41]"
                  )}>
                    {f.icon ? <f.icon className={f.mainOffering ? "w-6 h-6" : "w-5 h-5"} /> : "✶"}
                  </div>
                  <h3 className="text-base font-semibold text-slate-50">
                    {f.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-slate-300">{f.desc}</p>

                  {f.href && (
                    <div className="mt-4">
                      <a
                        href={f.href}
                        target={f.href.startsWith('http') ? "_blank" : undefined}
                        rel={f.href.startsWith('http') ? "noreferrer" : undefined}
                        className="inline-flex items-center text-xs font-semibold text-[#7fff41] hover:underline"
                      >
                        {f.cta || "Learn more"} <span className="ml-1">→</span>
                      </a>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="border-b border-white/5 py-12 md:py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-2xl text-center md:mx-auto">
              <h2 className="text-2xl font-semibold text-slate-50 sm:text-3xl">
                Pick how you want to work with us
              </h2>
              <p className="mt-3 text-base text-slate-300 sm:text-lg">
                Whether you&apos;re just getting started or rolling out across
                multiple locations, there&apos;s a path that fits.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {pricing.map((tier) => (
                <article
                  key={tier.name}
                  className={classNames(
                    "flex flex-col rounded-3xl border bg-slate-900/70 p-6 text-left text-base shadow-sm",
                    tier.featured
                      ? "border-[#7fff41]/60 shadow-[#7fff41]/25"
                      : "border-white/10"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold text-white">
                      {tier.name}
                    </h3>
                    {tier.featured && (
                      <span className="rounded-full bg-[#7fff41]/10 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-[#7fff41]">
                        Most popular
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-slate-300">
                    {tier.highlight}
                  </p>
                  {tier.price && (
                    <p className="mt-4 text-xl font-semibold text-white">
                      {tier.price}
                    </p>
                  )}
                  <ul className="mt-4 space-y-2 text-sm text-slate-300">
                    {tier.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2">
                        <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-[#7fff41]" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => window.dispatchEvent(new CustomEvent('open-chatkit'))}
                      className={classNames(
                        "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition",
                        tier.featured
                          ? "bg-[#7fff41] text-slate-900 shadow-lg shadow-[#7fff41]/40 hover:bg-[#a4ff82]"
                          : "border border-white/20 text-slate-100 hover:border-[#7fff41]/60 hover:text-[#7fff41]"
                      )}
                    >
                      Talk to JAB about this
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* WORKSHOPS (formerly FAQ) */}
        <section id="workshops" className="py-12 md:py-16 border-b border-white/5">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-50 mb-6">
                  Free LIVE Workshops
                </h2>
                <p className="text-lg text-slate-300 mb-8">
                  We provide LIVE free Business Workshops for business owners that want to learn more about how AI and advanced Automation can boost productivity. Visit the Events link from the menu to register for an upcoming session!
                </p>
                <a
                  href="/events"
                  className="inline-flex items-center justify-center rounded-full bg-[#7fff41] px-6 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-[#7fff41]/40 transition hover:bg-[#a4ff82]"
                >
                  View Upcoming Sessions
                </a>
              </div>
              <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                <img 
                  src="/AI-Mastermind-Event.png" 
                  alt="AI Mastermind Workshop" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* AI Chat Widget */}

              <ChatWidget />
            </div>
          );
        }
        