"use client";

import React from 'react';
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";

export default function WorkshopsPage() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-50">
      <Header />

      <main className="flex-1 flex flex-col justify-center">
        {/* WORKSHOPS SECTION */}
        <section id="workshops" className="py-20 md:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold text-slate-50 mb-8">
                  Free LIVE Workshops
                </h1>
                <p className="text-xl text-slate-300 mb-10 leading-relaxed">
                  We provide LIVE free Business Workshops for business owners that want to learn more about how AI and advanced Automation can boost productivity. Visit the Events link from the menu to register for an upcoming session!
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="/events"
                    className="inline-flex items-center justify-center rounded-full bg-[#7fff41] px-8 py-4 text-lg font-bold text-slate-900 shadow-lg shadow-[#7fff41]/40 transition hover:bg-[#a4ff82]"
                  >
                    View Upcoming Sessions
                  </a>
                </div>
              </div>
              <div className="rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
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
    </div>
  );
}
