"use client";

import React from 'react';
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { 
  MessageSquare, Phone, Mail, CreditCard, ShoppingBag, 
  Users, BarChart3, Users2, Calendar, CheckSquare, 
  Globe, Layout, Share2, Zap, Database, LineChart, 
  Smartphone, ArrowRight, Check, Minus 
} from 'lucide-react';

const featureGroups = [
  {
    title: "Communication Tools",
    features: [
      { name: "Conversations", icon: MessageSquare, desc: "Manage all customer communication channels (Email, SMS, DM, Calls, & Reviews) in one place." },
      { name: "Chat", icon: MessageSquare, desc: "Live chat with customers via SMS to increase engagement and drive more sales." },
      { name: "Calling", icon: Phone, desc: "Dedicated phone number for inbound/outbound calls and texts." },
      { name: "SMS Text", icon: Smartphone, desc: "Improve reach and response rates with direct SMS messaging." }
    ]
  },
  {
    title: "Payments & Revenue",
    features: [
      { name: "Payments", icon: CreditCard, desc: "Accept payments, send invoices, and enable text-to-pay options." },
      { name: "Products", icon: ShoppingBag, desc: "Easily create and track products and services performance." },
      { name: "Affiliate Management", icon: Users, desc: "Manage affiliates, campaigns, payouts, and promotions." }
    ]
  },
  {
    title: "Customer Management",
    features: [
      { name: "CRM", icon: Users2, desc: "Centralized system for contacts, companies, leads, and customers." },
      { name: "Pipelines", icon: BarChart3, desc: "Track sales and customer journeys through customizable pipelines." },
      { name: "Reputation Management", icon: LineChart, desc: "Automate review requests and manage your online reputation." }
    ]
  },
  {
    title: "Scheduling & Booking",
    features: [
      { name: "Calendars", icon: Calendar, desc: "Organize availability and increase bookings with managed calendars." },
      { name: "Appointments", icon: CheckSquare, desc: "Allow easy booking and collect payments during the process." }
    ]
  },
  {
    title: "Marketing Tools",
    features: [
      { name: "Email Marketing", icon: Mail, desc: "Drag-and-drop builder for automated or broadcast email campaigns." },
      { name: "Funnels", icon: Layout, desc: "Build high-converting funnels with an intuitive editor." },
      { name: "Websites", icon: Globe, desc: "Create professional websites with an easy drag-and-drop builder." },
      { name: "Social Posting", icon: Share2, desc: "Manage content across Facebook, Instagram, LinkedIn, and TikTok." },
      { name: "Templates", icon: Layout, desc: "Ready-made templates for websites, funnels, and emails." }
    ]
  },
  {
    title: "Automation & Efficiency",
    features: [
      { name: "Automation", icon: Zap, desc: "Save time by automating repetitive business processes." },
      { name: "Workflows", icon: Database, desc: "Eliminate errors with structured business workflows." },
      { name: "Mobile App", icon: Smartphone, desc: "Access key features and conversations from your mobile device." }
    ]
  }
];

const comparisonData = [
  {
    category: "Communication & Inbox",
    items: [
      { name: "Unified Inbox (SMS, Email, DM)", core: true, plus: true, elite: true },
      { name: "Google Business & Facebook Integration", core: true, plus: true, elite: true },
      { name: "Web Chat Widget", core: true, plus: true, elite: true },
      { name: "Mobile App Access", core: true, plus: true, elite: true },
      { name: "EdgeAssist AI Suggestions", core: true, plus: true, elite: true },
    ]
  },
  {
    category: "Contacts & Sales",
    items: [
      { name: "Basic Contacts & Communication", core: true, plus: true, elite: true },
      { name: "Reputation & Review Management", core: true, plus: true, elite: true },
      { name: "Full CRM Management", core: false, plus: true, elite: true },
      { name: "Advanced Pipelines & Opportunities", core: false, plus: true, elite: true },
    ]
  },
  {
    category: "Scheduling & Payments",
    items: [
      { name: "Invoicing & Text-to-Pay", core: false, plus: true, elite: true },
      { name: "Appointments & Calendars", core: false, plus: true, elite: true },
      { name: "Products & Affiliate Management", core: false, plus: true, elite: true },
    ]
  },
  {
    category: "Marketing & Growth",
    items: [
      { name: "Email Marketing Builder", core: false, plus: true, elite: true },
      { name: "Funnels & Website Builder", core: false, plus: true, elite: true },
      { name: "Forms & Surveys", core: false, plus: true, elite: true },
      { name: "Social Media Planner", core: false, plus: true, elite: true },
    ]
  },
  {
    category: "Advanced Technology",
    items: [
      { name: "Basic Follow-up Automations", core: true, plus: true, elite: true },
      { name: "Advanced Workflow Automations", core: false, plus: true, elite: true },
      { name: "AI Powered Assistant", core: false, plus: false, elite: true },
      { name: "Custom Web Apps & Dashboards", core: false, plus: false, elite: true },
      { name: "Secure Hosting Architecture", core: false, plus: false, elite: true },
      { name: "Custom Onboarding Flows", core: false, plus: false, elite: true },
    ]
  }
];

export default function FeaturesPage() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-50">
      <Header />

      <main>
        {/* HERO SECTION */}
        <section className="relative border-b border-white/5 py-16 md:py-24 overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-[#7fff41]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                  Practical{" "}
                  <span className="bg-gradient-to-r from-[#7fff41] via-white to-[#ff00ff] bg-clip-text text-transparent">
                    Digital Tools
                  </span>{" "}
                  for Businesses
                </h1>
                <p className="text-xl text-slate-300 mb-8 max-w-2xl">
                  Centralize your Business Operations And Generate Revenue with JAB&apos;s C.O.R.E technology platform. Manage all your customer communication channels, including email, SMS, direct messages, calls, appointments, and reviews, in one place.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://calendar.app.google/nrsnwLLEDFsyX5HP7"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-[#7fff41] px-8 py-4 text-lg font-bold text-slate-900 shadow-lg shadow-[#7fff41]/40 transition hover:bg-[#a4ff82]"
                  >
                    Schedule a Live Call
                  </a>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-[4/5] w-full max-w-md mx-auto rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 relative z-10">
                  <img 
                    src="/alysia.png" 
                    alt="JAB Technology Solutions" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent flex items-end p-8">
                    <p className="text-white font-semibold italic text-sm">Empowering Businesses with C.O.R.E Technology</p>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#630183]/20 rounded-2xl blur-xl z-0" />
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#7fff41]/20 rounded-full blur-xl z-0" />
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES OVERVIEW GRID */}
        <section className="py-20 md:py-32 border-b border-white/5">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">C.O.R.E Platform Features</h2>
              <p className="text-lg text-slate-400 max-w-3xl mx-auto">
                Everything you need to manage your business operations and drive revenue growth in one centralized dashboard. Check out the comparison matrix below to see which tier fits your needs.
              </p>
            </div>

            <div className="space-y-24">
              {featureGroups.map((group) => (
                <div key={group.title}>
                  <h3 className="text-xl font-bold text-[#7fff41] uppercase tracking-widest mb-10 pl-4 border-l-2 border-[#7fff41]">
                    {group.title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {group.features.map((feature) => (
                      <div 
                        key={feature.name}
                        className="group p-6 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-[#7fff41]/30 hover:bg-slate-900 transition-all duration-300 shadow-sm"
                      >
                        <div className="mb-4 inline-flex items-center justify-center h-12 w-12 rounded-xl bg-[#7fff41]/10 text-[#7fff41] group-hover:scale-110 transition-transform">
                          <feature.icon size={24} />
                        </div>
                        <h4 className="text-lg font-semibold text-white mb-2">{feature.name}</h4>
                        <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COMPARISON MATRIX SECTION */}
        <section id="compare" className="py-20 md:py-32 bg-slate-900/20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Compare Plans & Features</h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                See exactly what&apos;s included in each tier to find the perfect fit for your operations.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr>
                    <th className="p-6 border-b border-white/10 text-lg font-semibold text-slate-300 w-1/3 sticky left-0 bg-slate-950/80 backdrop-blur z-10">
                      Features Overview
                    </th>
                    <th className="p-6 border-b border-white/10 text-center w-1/5">
                      <div className="text-xl font-bold text-white mb-1">JAB CORE</div>
                      <div className="text-[#7fff41] font-semibold">$199/mo</div>
                    </th>
                    <th className="p-6 border-b border-[#7fff41]/30 text-center w-1/5 bg-[#7fff41]/5 rounded-t-2xl">
                      <div className="text-xs font-bold uppercase tracking-wider text-[#7fff41] mb-2">Most Popular</div>
                      <div className="text-xl font-bold text-white mb-1">JAB CORE +</div>
                      <div className="text-[#7fff41] font-semibold">$299/mo</div>
                    </th>
                    <th className="p-6 border-b border-white/10 text-center w-1/5">
                      <div className="text-xl font-bold text-white mb-1">CORE Elite</div>
                      <div className="text-[#7fff41] font-semibold">$399/mo</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((section, idx) => (
                    <React.Fragment key={section.category}>
                      {/* Section Header */}
                      <tr>
                        <td colSpan={4} className="py-6 px-4 border-b border-white/5 bg-slate-900/50">
                          <span className="text-sm font-bold uppercase tracking-wider text-[#7fff41]">
                            {section.category}
                          </span>
                        </td>
                      </tr>
                      {/* Feature Rows */}
                      {section.items.map((item, itemIdx) => (
                        <tr key={item.name} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-4 border-b border-white/5 text-slate-300 text-sm font-medium sticky left-0 bg-slate-950/40 backdrop-blur z-10">
                            {item.name}
                          </td>
                          <td className="p-4 border-b border-white/5 text-center">
                            {item.core ? <Check className="w-5 h-5 text-white mx-auto" /> : <Minus className="w-5 h-5 text-slate-600 mx-auto" />}
                          </td>
                          <td className="p-4 border-b border-white/5 text-center bg-[#7fff41]/[0.02] border-x border-x-[#7fff41]/10">
                            {item.plus ? <Check className="w-5 h-5 text-[#7fff41] mx-auto" /> : <Minus className="w-5 h-5 text-slate-600 mx-auto" />}
                          </td>
                          <td className="p-4 border-b border-white/5 text-center">
                            {item.elite ? <Check className="w-5 h-5 text-white mx-auto" /> : <Minus className="w-5 h-5 text-slate-600 mx-auto" />}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                  {/* Bottom Action Row */}
                  <tr>
                    <td className="p-6 sticky left-0 bg-slate-950/80 z-10"></td>
                    <td className="p-6 text-center">
                      <a href="/pricing" className="inline-block px-4 py-2 text-xs font-bold text-white border border-white/20 rounded-full hover:bg-white/10 transition">
                        Get CORE
                      </a>
                    </td>
                    <td className="p-6 text-center bg-[#7fff41]/5 rounded-b-2xl border-x border-b border-[#7fff41]/30">
                      <a href="/pricing" className="inline-block px-4 py-2 text-xs font-bold bg-[#7fff41] text-slate-900 rounded-full hover:bg-[#a4ff82] transition shadow-lg shadow-[#7fff41]/20">
                        Get CORE +
                      </a>
                    </td>
                    <td className="p-6 text-center">
                      <a href="/pricing" className="inline-block px-4 py-2 text-xs font-bold text-white border border-white/20 rounded-full hover:bg-white/10 transition">
                        Get Elite
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA BANNER */}
        <section className="py-20 bg-[#7fff41]">
          <div className="mx-auto max-w-5xl px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">
              In only 30 minutes we&apos;ll outline your fastest path to Centralize Operations for Revenue Generation.
            </h2>
            <a
              href="https://calendar.app.google/nrsnwLLEDFsyX5HP7"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-10 py-5 text-xl font-bold text-white shadow-xl transition hover:translate-y-[-2px]"
            >
              Book a Live Call <ArrowRight className="ml-2" />
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}