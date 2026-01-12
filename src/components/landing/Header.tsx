// src/components/landing/Header.tsx
import React from 'react';
import Image from 'next/image';

export function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-slate-200/60">
      <nav className="mx-auto max-w-7xl flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Image 
            src="/jab-logo.png" 
            alt="JAB logo" 
            width={36} 
            height={36} 
            className="rounded-md shadow-sm"
            priority
          />
          <span className="font-semibold tracking-tight">Facebook Automation</span>
        </div>
        <ul className="hidden md:flex items-center gap-6 text-sm">
          <li><a href="#features" className="hover:text-[#010E63]">Features</a></li>
          <li><a href="#channels" className="hover:text-[#010E63]">Channels</a></li>
          <li><a href="#pricing" className="hover:text-[#010E63]">Pricing</a></li>
          <li><a href="#faq" className="hover:text-[#010E63]">FAQ</a></li>
        </ul>
        <div className="flex items-center gap-3">
          <a href="/api/meta/oauth/start" className="hidden md:inline-block px-4 py-2 rounded-xl border border-slate-300 text-sm">Sign In</a>
          <a href="/clients/connect-messenger" className="inline-block px-4 py-2 rounded-xl bg-[#7FFF41] text-black text-sm shadow">Get started</a>
        </div>
      </nav>
    </header>
  );
}
