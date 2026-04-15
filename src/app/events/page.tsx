"use client";

import React from 'react';
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import UpcomingSessions from "@/components/booking/UpcomingSessions";
import PastSessions from "@/components/booking/PastSessions";

export default function EventsPage() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-50">
      <Header />

      <main className="py-20 md:py-32">
        {/* EVENTS SECTION */}
        <section id="events" className="relative">
          <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Live Events & Workshops</h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                Join our hands-on workshops and social networking sessions to master AI and automation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <UpcomingSessions 
                title="Paint & Sip Networking" 
                filterKeyword="Paint" 
                waitlistTrack="Paint & Sip"
              />
              <UpcomingSessions 
                title="AI Mastermind Workshops" 
                filterKeyword="Mastermind"
                featuredLayout={true}
                waitlistTrack="AI Mastermind"
                detailsLink="/mastermind-landing"
              />
            </div>

            {/* Past Events Recap (Dynamic) */}
            <PastSessions />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}