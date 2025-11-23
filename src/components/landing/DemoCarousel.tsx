// src/components/landing/DemoCarousel.tsx
'use client';

import React, { useEffect, useState } from 'react';

export function DemoCarousel() {
  const slides = [
    "/demo-1.png",
    "/demo-2.png",
    "/demo-3.png",
    "/demo-4.png",
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % slides.length), 3500);
    return () => clearInterval(id);
  }, [slides.length]);
  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden ring-1 ring-slate-200 bg-slate-100">
      {/* slide */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={slides[i]}
        alt="Messenger demo screenshot"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* privacy masks (blur common sensitive zones) */}
      <div className="absolute inset-y-0 left-0 w-28 bg-white/20 backdrop-blur-sm" />
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-white/20 backdrop-blur-sm" />
      {/* controls */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            className={`h-2.5 w-2.5 rounded-full border border-slate-300 ${
              i === idx ? "bg-[#7FFF41] border-[#010E63]" : "bg-white/70"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
