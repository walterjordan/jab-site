import React from 'react';

export function Banner() {
  return (
    <div className="bg-[#7fff41] text-slate-900 py-2 px-4 text-center text-sm font-semibold sticky top-0 z-50">
      <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
        <span>In only 30 minutes we&apos;ll outline your fastest path to Centralize Operations for Revenue Generation.</span>
        <a 
          href="https://calendar.app.google/nrsnwLLEDFsyX5HP7" 
          target="_blank" 
          rel="noreferrer"
          className="bg-slate-900 text-white px-3 py-1 rounded-full text-xs hover:bg-slate-800 transition"
        >
          Book Live Call Today!
        </a>
      </div>
    </div>
  );
}
