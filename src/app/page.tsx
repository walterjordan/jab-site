"use client";

import UpcomingSessions from "@/components/booking/UpcomingSessions";
import PastSessions from "@/components/booking/PastSessions";
import DemoInteractive from "@/components/landing/DemoInteractive";

const MESSENGER_URL = "https://m.me/611741395360453";

// Put your real Video Builder URL in NEXT_PUBLIC_JAB_VIDEO_BUILDER_URL
const JAB_VIDEO_BUILDER_URL =
  process.env.NEXT_PUBLIC_JAB_VIDEO_BUILDER_URL ||
  "https://jab-ad-creatorv1.jordanborden.com/";

const navItems = [
  { href: "#features", label: "Features" },
  { href: "#channels", label: "Channels" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

const audiencePills = ["Entrepreneurs", "Small Business", "Agencies", "Franchise"];

const featureCards = [
  {
    title: "Automated Instagram & Facebook DMs",
    desc: "Turn comments into instant DMs that deliver info, qualify leads, and book calls automatically—zero manual replies required.",
  },
  {
    title: "Self-Service Client Arrival Kiosk",
    desc: "Clients check themselves in on an iPad, updating your schedule in real-time so practitioners see who has arrived without checking the lobby.",
  },
  {
    title: "Lead capture that actually converts",
    desc: "Collect emails, phone numbers, and booking details without sending users to a clunky form.",
  },
  {
    title: "Same-Day Website — $100",
    desc: "Launch a simple, professional website today for a flat $100—no long timelines, no complexity, just results.",
  },
  {
    title: "Other Digital Marketing",
    desc: "Fast, practical execution of event flyers, landing pages, booking links, and promo pages tailored to your business.",
  },
];

const videoBuilderCard = {
  title: "JAB Video Builder",
  badge: "New • In beta",
  desc: "Turn a simple prompt into social-ready ad and explainer videos tailored to your campaigns.",
  ctaLabel: "Try it now",
};

const pricing = [
  {
    name: "Launch",
    price: "Free consult",
    highlight: "Perfect for trying things out",
    bullets: [
      "30-minute strategy session",
      "Audit of your current funnel",
      "Messenger & Instagram ideas you can apply immediately",
    ],
  },
  {
    name: "Done-With-You",
    price: "From $997",
    highlight: "We design & build your automations together",
    bullets: [
      "Custom flows for 1–2 key offers",
      "Messenger + Instagram setup",
      "Basic Make.com or Zapier integrations",
      "2 weeks of optimization support",
    ],
    featured: true,
  },
  {
    name: "Done-For-You",
    price: "Custom",
    highlight: "For agencies & franchises that need scale",
    bullets: [
      "Multi-location & multi-brand support",
      "Advanced routing & reporting",
      "Team training & playbook handoff",
    ],
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

      {/* NAVBAR */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 md:py-4">
          <div className="flex items-center gap-3">
            <img src="/jab-logo.png" alt="JAB logo" className="h-9 w-9 rounded-md shadow-sm invert" />
            <div>
              <p className="text-sm font-semibold tracking-tight">
                Jordan &amp; Borden
              </p>
              <p className="text-sm text-slate-400">Automation Consulting</p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-base text-slate-200 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="transition hover:text-[#7fff41]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={MESSENGER_URL}
              target="_blank"
              rel="noreferrer"
              className="hidden rounded-full border border-[#7fff41]/60 px-4 py-2 text-sm font-medium text-[#7fff41] hover:bg-[#7fff41]/10 md:inline-block"
            >
              Chat live on Messenger
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* HERO - Upcoming Events */}
        <section id="cta" className="relative border-b border-white/5">
          <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-12 md:py-20">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-3">Upcoming Live Events</h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                Join our hands-on workshops and social networking sessions to master AI and automation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <UpcomingSessions 
                title="Paint & Sip Networking" 
                filterKeyword="Paint" 
              />
              <UpcomingSessions 
                title="AI Mastermind Workshops" 
                filterKeyword="Mastermind"
                featuredLayout={true}
              />
            </div>

            {/* Past Events Recap (Dynamic) */}
            <PastSessions />
          </div>
        </section>

        {/* FEATURES + JAB VIDEO BUILDER CTA */}
        <section id="features" className="border-b border-white/5 py-12 md:py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-16 flex flex-col items-start gap-6 md:flex-row md:items-center">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/70 px-3 py-1 text-xs ring-1 ring-white/10">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#7fff41]" />
                  <span className="font-medium text-slate-200">
                    Verified Meta Media Agency · WhatsApp · Instagram · Messenger
                  </span>
                </div>

                <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-slate-50 sm:text-4xl md:text-5xl">
                  Make the most out of{" "}
                  <span className="bg-gradient-to-r from-[#7fff41] via-white to-[#ff00ff] bg-clip-text text-transparent">
                    every conversation
                  </span>
                </h1>

                <p className="mt-4 text-lg text-slate-200/80 sm:text-xl">
                  Jordan &amp; Borden designs high-performing Messenger and Instagram
                  automations that feel human, respond instantly, and plug directly
                  into your sales process.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <a
                    href={MESSENGER_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-[#7fff41] px-6 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-[#7fff41]/40 transition hover:translate-y-[1px] hover:bg-[#a4ff82]"
                  >
                    Chat live on Messenger
                  </a>
                  <a
                    href="#pricing"
                    className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-3 text-base font-medium text-slate-100 hover:border-[#7fff41]/60 hover:text-[#7fff41]"
                  >
                    Book a strategy session
                  </a>
                </div>

                <div className="mt-6 flex flex-wrap gap-6 text-sm text-slate-300/80">
                  <div>
                    <p className="font-semibold text-slate-100">
                      40+ campaigns automated
                    </p>
                    <p>From local service brands to multi-location franchises.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-100">
                      &lt; 30s average response
                    </p>
                    <p>Keep leads warm while your team focuses on closers.</p>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3 text-xs text-slate-300/70">
                  {audiencePills.map((pill) => (
                    <span
                      key={pill}
                      className="rounded-full border border-white/15 bg-white/5 px-3 py-1"
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="max-w-2xl text-center md:mx-auto">
              <h2 className="text-2xl font-semibold text-slate-50 sm:text-3xl">
                Practical Digital Tools for Real Businesses
              </h2>
              <p className="mt-3 text-base text-slate-300 sm:text-lg">
                From same-day websites to check-in stations and content tools, everything here is designed to be live, useful, and straightforward.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {featureCards.map((f) => (
                <article
                  key={f.title}
                  className="group rounded-2xl border border-white/8 bg-slate-900/70 p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#7fff41]/40 hover:shadow-[#7fff41]/20"
                >
                  <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#630183]/40 text-xs text-[#7fff41]">
                    ✶
                  </div>
                  <h3 className="text-base font-semibold text-slate-50">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-300">{f.desc}</p>
                </article>
              ))}

              {/* JAB Video Builder card */}
              <article className="group rounded-2xl border border-[#7fff41]/40 bg-gradient-to-br from-[#010e63] via-[#630183] to-slate-900 p-5 text-left shadow-lg shadow-[#7fff41]/25 md:col-span-3 lg:col-span-1">
                <p className="inline-flex items-center rounded-full bg-black/40 px-2 py-1 text-xs font-medium uppercase tracking-wide text-[#7fff41]">
                  {videoBuilderCard.badge}
                </p>
                <h3 className="mt-3 text-lg font-semibold text-white">
                  {videoBuilderCard.title}
                </h3>
                <p className="mt-2 text-sm text-slate-100/90">
                  {videoBuilderCard.desc}
                </p>
                <button
                  type="button"
                  onClick={() => window.open(JAB_VIDEO_BUILDER_URL, "_blank")}
                  className="mt-4 inline-flex items-center justify-center rounded-full bg-black/80 px-4 py-2 text-xs font-semibold text-[#7fff41] ring-1 ring-[#7fff41]/60 transition hover:bg-black hover:ring-[#7fff41]"
                >
                  {videoBuilderCard.ctaLabel}
                  <span className="ml-2 text-xs">↗</span>
                </button>
              </article>
            </div>
          </div>
        </section>

        {/* INTERACTIVE DEMO */}
        <DemoInteractive />

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
                  <p className="mt-4 text-xl font-semibold text-white">
                    {tier.price}
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-slate-300">
                    {tier.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2">
                        <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-[#7fff41]" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <a
                      href={MESSENGER_URL}
                      target="_blank"
                      rel="noreferrer"
                      className={classNames(
                        "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition",
                        tier.featured
                          ? "bg-[#7fff41] text-slate-900 shadow-lg shadow-[#7fff41]/40 hover:bg-[#a4ff82]"
                          : "border border-white/20 text-slate-100 hover:border-[#7fff41]/60 hover:text-[#7fff41]"
                      )}
                    >
                      Talk to JAB about this
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-12 md:py-16">
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-xl">
              <h2 className="text-2xl font-semibold text-slate-50 sm:text-3xl">
                Answers before you even DM us
              </h2>
              <p className="mt-3 text-base text-slate-300 sm:text-lg">
                If you don&apos;t see your situation here, send a quick message
                in Messenger and we&apos;ll point you in the right direction.
              </p>
            </div>

            <dl className="mt-8 space-y-5">
              {faqs.map((item) => (
                <div
                  key={item.q}
                  className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 text-base"
                >
                  <dt className="font-semibold text-slate-50">{item.q}</dt>
                  <dd className="mt-2 text-sm text-slate-300">{item.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-6 text-sm text-slate-400">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Jordan &amp; Borden Automation
            Consulting. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={MESSENGER_URL}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#7fff41]"
            >
              Chat on Messenger
            </a>
            <a href="#pricing" className="hover:text-[#7fff41]">
              Engagement models
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}