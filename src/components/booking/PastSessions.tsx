"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type CalendarEvent = {
  id: string;
  googleEventId: string;
  title: string;
  start: string;
  end: string;
  link: string;
  description?: string;
  coverImage?: string | null;
};

export default function PastSessions() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPastSessions() {
      try {
        const res = await fetch("/api/calendar/sessions?type=past");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setEvents(data.events || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPastSessions();
  }, []);

  if (loading) return null; // Or a subtle skeleton
  if (events.length === 0) return null;

  // Grouping Logic: Consolidate "Slot 1", "Slot 2" etc into a single card
  // Helper to normalize title
  const normalizeTitle = (title: string) => {
    // Remove "Slot X" or ": Slot X" or "(Slot X)"
    // Also remove everything after a colon if it looks like a subtitle? 
    // User case: "Paint & Sip: Slot 1 (Social Networking)" -> "Paint & Sip"
    return title
        .replace(/:\s*Slot\s*\d+.*$/i, "") // Remove ": Slot 1..."
        .replace(/\s*Slot\s*\d+.*$/i, "")  // Remove " Slot 1..."
        .replace(/\(.*\)/g, "")           // Remove parens content? Maybe risky.
        .trim();
  };

  const groupedEvents = events.reduce((acc, event) => {
    const key = normalizeTitle(event.title);
    if (!acc[key]) {
        acc[key] = event; // Keep the first one found (since sorted desc, this is the LATEST one)
    }
    return acc;
  }, {} as Record<string, CalendarEvent>);

  const uniqueEvents = Object.values(groupedEvents);

  if (uniqueEvents.length === 0) return null;

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }).format(date);
  };

  return (
    <div className="mt-8 pt-8 border-t border-white/5 w-full">
      <h3 className="text-xl font-bold text-white mb-6">Past Events</h3>
      <div className="flex flex-col gap-4">
        {uniqueEvents.map((event) => (
          <div 
            key={event.id}
            className="group relative flex flex-col md:flex-row items-center gap-4 rounded-2xl bg-white/5 p-4 border border-white/10 hover:border-[#7fff41]/30 transition overflow-hidden"
          >
            {/* Background Image (Blurred) - Optional visual flair */}
            {event.coverImage && (
               <div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-20 transition duration-500 grayscale group-hover:grayscale-0">
                 <Image
                   src={event.coverImage}
                   alt=""
                   fill
                   className="object-cover"
                   sizes="(max-width: 768px) 100vw, 50vw"
                 />
               </div>
            )}
            
            {/* Content Container (z-10 to sit above bg) */}
            <div className="relative z-10 flex flex-1 items-center gap-4 w-full">
                {/* Thumbnail */}
                {event.coverImage && (
                    <div className="relative shrink-0 h-16 w-16 md:h-20 md:w-20 rounded-lg overflow-hidden border border-white/10 grayscale group-hover:grayscale-0 transition duration-300">
                        <Image 
                          src={event.coverImage} 
                          alt={event.title} 
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 64px, 80px"
                        />
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                        <span className="inline-flex items-center rounded-md bg-slate-800/80 px-2 py-0.5 text-xs font-medium text-slate-400 ring-1 ring-inset ring-white/10">
                            Ended
                        </span>
                        <span className="text-sm text-slate-500 font-mono">
                            {formatDate(event.start)}
                        </span>
                    </div>
                    <h4 className="text-base font-semibold text-slate-200 group-hover:text-white transition truncate">
                        {normalizeTitle(event.title)}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                        {event.description || "Check out the highlights from this session."}
                    </p>
                </div>

                <a 
                    href={`/events/paint-sip-recap?eventId=${event.googleEventId}`} 
                    className="shrink-0 rounded-full bg-white/5 px-4 py-2 text-xs font-semibold text-white ring-1 ring-white/10 hover:bg-[#7fff41] hover:text-slate-900 transition flex items-center gap-2 group/btn backdrop-blur-sm"
                >
                    View Recap
                    <span className="group-hover/btn:translate-x-0.5 transition-transform">→</span>
                </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
