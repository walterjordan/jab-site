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

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 md:py-4">
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-3">
            <img src="/jab-logo.png" alt="JAB logo" className="h-9 w-9 rounded-md shadow-sm invert" />
            <div>
              <p className="text-sm font-semibold tracking-tight text-white">
                Jordan &amp; Borden
              </p>
              <p className="text-sm text-slate-400">Automation Consulting</p>
            </div>
          </a>
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
  );
}
