// src/components/landing/SocialProof.tsx
import React from 'react';

export function SocialProof() {
  return (
    <section className="py-6">
      <div className="mx-auto max-w-7xl px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {["Entrepreneurs", "Small Business", "Agencies", "Franchise"].map((t) => (
          <div key={t} className="rounded-2xl bg-white/80 ring-1 ring-slate-200 p-4 text-center">{t}</div>
        ))}
      </div>
    </section>
  );
}
