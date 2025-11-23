import GoogleCalendar from "@/components/booking/GoogleCalendar";
"use client";

const MESSENGER_URL = "https://m.me/611741395360453";

// Put your real Video Builder URL in NEXT_PUBLIC_JAB_VIDEO_BUILDER_URL
const JAB_VIDEO_BUILDER_URL =
  process.env.NEXT_PUBLIC_JAB_VIDEO_BUILDER_URL ||
  "https://jab-ad-creatorv1.jordanborden.com/-video-builder";

const navItems = [
  { href: "#features", label: "Features" },
  { href: "#channels", label: "Channels" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

const audiencePills = ["Entrepreneurs", "Small Business", "Agencies", "Franchise"];

const featureCards = [
  {
    title: "Comment → DM funnels",
    desc: "Turn every post, story, and reel into an automated conversation that closes the loop in the DMs.",
  },
  {
    title: "Smart routing & inbox",
    desc: "Keep human and bot replies in sync with a unified Messenger & Instagram inbox.",
  },
  {
    title: "Lead capture that actually converts",
    desc: "Collect emails, phone numbers, and booking details without sending users to a clunky form.",
  },
  {
    title: "Playbooks for real brands",
    desc: "Proven flows for local service, e-commerce, creators, and franchises—no blank-page energy.",
  },
  {
    title: "Integrations that scale",
    desc: "Sync data to Airtable, Make.com, Google Sheets, and your CRM so nothing falls through the cracks.",
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
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-950 text-slate-50">
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
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#7fff41] text-xs font-black text-slate-900 shadow-lg shadow-[#7fff41]/40">
              JAB
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight">
                Jordan &amp; Borden
              </p>
              <p className="text-xs text-slate-400">Automation Consulting</p>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-slate-200 md:flex">
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
              className="hidden rounded-full border border-[#7fff41]/60 px-4 py-2 text-xs font-medium text-[#7fff41] hover:bg-[#7fff41]/10 md:inline-block"
            >
              Chat live on Messenger
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section id="cta" className="relative border-b border-white/5">
          <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-12 md:flex-row md:items-center md:py-20">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/70 px-3 py-1 text-[11px] ring-1 ring-white/10">
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

              <p className="mt-4 text-base text-slate-200/80 sm:text-lg">
                Jordan &amp; Borden designs high-performing Messenger and Instagram
                automations that feel human, respond instantly, and plug directly
                into your sales process.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href={MESSENGER_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-[#7fff41] px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-[#7fff41]/40 transition hover:translate-y-[1px] hover:bg-[#a4ff82]"
                >
                  Chat live on Messenger
                </a>
                <a
                  href="#pricing"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-slate-100 hover:border-[#7fff41]/60 hover:text-[#7fff41]"
                >
                  Book a strategy session
                </a>
              </div>

              <div className="mt-6 flex flex-wrap gap-6 text-xs text-slate-300/80">
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

              <div className="mt-8 flex flex-wrap gap-3 text-[11px] text-slate-300/70">
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

            {/* Right side mock panel */}
            <div className="w-full max-w-md shrink-0 self-stretch rounded-3xl border border-white/10 bg-slate-900/80 p-4 shadow-2xl shadow-black/40 backdrop-blur md:w-5/12">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Live automations
                </span>
                <span>Messenger · Instagram</span>
              </div>
              <div className="mt-4 space-y-3 text-xs">
                <div className="rounded-2xl bg-slate-800/80 p-3">
                  <p className="text-[11px] text-slate-400">
                    Lead from Facebook Ads
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-50">
                    “Hey JAB, I&apos;m ready to paint my house next month…”
                  </p>
                  <p className="mt-2 text-[11px] text-[#7fff41]">
                    Bot · “Got it Walter. What&apos;s your ZIP code so we can
                    match you to the right crew?”
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-800/80 p-3">
                  <p className="text-[11px] text-slate-400">Instagram DMs</p>
                  <p className="mt-1 text-sm font-medium text-slate-50">
                    “Can you do exteriors + cabinets?”
                  </p>
                  <p className="mt-2 text-[11px] text-[#7fff41]">
                    Flow · Sends services menu, qualifies budget, and routes to
                    your team when they say “ready”.
                  </p>
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-dashed border-white/15 p-3 text-[11px] text-slate-300">
                <p className="font-medium text-slate-100">What we deliver</p>
                <p className="mt-1">
                  Strategy, build, tech stack wiring, and the playbook your team
                  can keep iterating on.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES + JAB VIDEO BUILDER CTA */}
        <section id="features" className="border-b border-white/5 py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="max-w-2xl text-center md:mx-auto">
              <h2 className="text-2xl font-semibold text-slate-50 sm:text-3xl">
                Automation that sells while you sleep
              </h2>
              <p className="mt-3 text-sm text-slate-300 sm:text-base">
                We combine Meta automation, AI, and smart routing so every
                click, comment, and DM has a clear next step.
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
                  <h3 className="text-sm font-semibold text-slate-50">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-300">{f.desc}</p>
                </article>
              ))}

              {/* JAB Video Builder card */}
              <article className="group rounded-2xl border border-[#7fff41]/40 bg-gradient-to-br from-[#010e63] via-[#630183] to-slate-900 p-5 text-left shadow-lg shadow-[#7fff41]/25 md:col-span-3 lg:col-span-1">
                <p className="inline-flex items-center rounded-full bg-black/40 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-[#7fff41]">
                  {videoBuilderCard.badge}
                </p>
                <h3 className="mt-3 text-base font-semibold text-white">
                  {videoBuilderCard.title}
                </h3>
                <p className="mt-2 text-xs text-slate-100/90">
                  {videoBuilderCard.desc}
                </p>
                <button
                  type="button"
                  onClick={() => window.open(JAB_VIDEO_BUILDER_URL, "_blank")}
                  className="mt-4 inline-flex items-center justify-center rounded-full bg-black/80 px-4 py-2 text-xs font-semibold text-[#7fff41] ring-1 ring-[#7fff41]/60 transition hover:bg-black hover:ring-[#7fff41]"
                >
                  {videoBuilderCard.ctaLabel}
                  <span className="ml-2 text-[10px]">↗</span>
                </button>
              </article>
            </div>
          </div>
        </section>

        {/* CHANNELS */}
        <section id="channels" className="border-b border-white/5 py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div>
                <h2 className="text-2xl font-semibold text-slate-50 sm:text-3xl">
                  One brain across every Meta channel
                </h2>
                <p className="mt-2 max-w-xl text-sm text-slate-300 sm:text-base">
                  We keep your automations consistent, so your brand feels like
                  the same smart assistant whether someone clicks an ad,
                  comments on a post, or slides into the DMs.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2 text-xs">
                {["Instagram", "WhatsApp", "Messenger", "TikTok"].map((channel) => (
                  <span
                    key={channel}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-slate-100"
                  >
                    {channel}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 text-sm text-slate-200">
                <h3 className="text-sm font-semibold text-white">
                  Lead capture &amp; nurture
                </h3>
                <p className="mt-2 text-xs text-slate-300">
                  Click-to-Messenger and IG DM flows that capture details,
                  qualify interest, and queue your team for high-intent
                  conversations.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 text-sm text-slate-200">
                <h3 className="text-sm font-semibold text-white">
                  Customer support automations
                </h3>
                <p className="mt-2 text-xs text-slate-300">
                  Smart menus, order lookups, and FAQ flows that reduce
                  repetitive tickets while handing real issues to humans fast.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 text-sm text-slate-200">
                <h3 className="text-sm font-semibold text-white">
                  Post-purchase &amp; referrals
                </h3>
                <p className="mt-2 text-xs text-slate-300">
                  Follow-ups, review requests, and referral prompts that happen
                  automatically but still feel personal.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="border-b border-white/5 py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4">
            <div className="max-w-2xl text-center md:mx-auto">
              <h2 className="text-2xl font-semibold text-slate-50 sm:text-3xl">
                Pick how you want to work with us
              </h2>
              <p className="mt-3 text-sm text-slate-300 sm:text-base">
                Whether you&apos;re just getting started or rolling out across
                multiple locations, there&apos;s a path that fits.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {pricing.map((tier) => (
                <article
                  key={tier.name}
                  className={classNames(
                    "flex flex-col rounded-3xl border bg-slate-900/70 p-6 text-left text-sm shadow-sm",
                    tier.featured
                      ? "border-[#7fff41]/60 shadow-[#7fff41]/25"
                      : "border-white/10"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-semibold text-white">
                      {tier.name}
                    </h3>
                    {tier.featured && (
                      <span className="rounded-full bg-[#7fff41]/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#7fff41]">
                        Most popular
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-slate-300">
                    {tier.highlight}
                  </p>
                  <p className="mt-4 text-lg font-semibold text-white">
                    {tier.price}
                  </p>
                  <ul className="mt-4 space-y-2 text-xs text-slate-300">
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
                        "inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold transition",
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
          <div className="mx-auto max-w-5xl px-4">
            <div className="max-w-xl">
              <h2 className="text-2xl font-semibold text-slate-50 sm:text-3xl">
                Answers before you even DM us
              </h2>
              <p className="mt-3 text-sm text-slate-300 sm:text-base">
                If you don&apos;t see your situation here, send a quick message
                in Messenger and we&apos;ll point you in the right direction.
              </p>
            </div>

            <dl className="mt-8 space-y-5">
              {faqs.map((item) => (
                <div
                  key={item.q}
                  className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 text-sm"
                >
                  <dt className="font-semibold text-slate-50">{item.q}</dt>
                  <dd className="mt-2 text-xs text-slate-300">{item.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-6 text-xs text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 sm:flex-row">
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