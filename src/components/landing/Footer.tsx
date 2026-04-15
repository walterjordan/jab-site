"use client";

import React from 'react';

const MESSENGER_URL = "https://m.me/611741395360453";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/events", label: "Events" },
  { href: "/pricing", label: "Pricing" },
  { href: "/workshops", label: "Free LIVE Workshops" },
  { href: "/demo", label: "Demo" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-12 text-sm text-slate-400">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img src="/jab-logo.png" alt="JAB logo" className="h-9 w-9 rounded-md shadow-sm invert" />
              <span className="text-xl font-bold text-white tracking-tight">Jordan & Borden</span>
            </div>
            <p className="text-slate-400 max-w-sm">
              Helping growth-minded brands build Meta Messenger & Instagram automations that sell, support, and scale using AI.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Navigation</h4>
            <ul className="space-y-4">
              {navItems.map(item => (
                <li key={item.label}>
                  <a href={item.href} className="hover:text-[#7fff41] transition">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Connect</h4>
            <ul className="space-y-4">
              <li>
                <a href={MESSENGER_URL} target="_blank" rel="noreferrer" className="hover:text-[#7fff41] transition">Messenger</a>
              </li>
              <li>
                <a href="https://calendar.app.google/nrsnwLLEDFsyX5HP7" target="_blank" rel="noreferrer" className="hover:text-[#7fff41] transition">Book a Call</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>
            © {new Date().getFullYear()} Jordan &amp; Borden Automation Consulting. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="/pricing" className="hover:text-[#7fff41] transition text-slate-300">Pricing</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
