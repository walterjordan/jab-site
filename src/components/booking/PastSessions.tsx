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
        // 1. Fetch all past sessions
        const res = await fetch("/api/calendar/sessions?type=past");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        const rawEvents: CalendarEvent[] = data.events || [];

        // 2. Normalize and Deduplicate (keep latest)
        const normalizeTitle = (title: string) => {
          return title
              .replace(/:\s*Slot\s*\d+.*$/i, "") 
              .replace(/\s*Slot\s*\d+.*$/i, "")  
              .replace(/\(.*\)/g, "")           
              .trim();
        };

        const groupedEvents = rawEvents.reduce((acc, event) => {
          const key = normalizeTitle(event.title);
          // Since the API returns them sorted by date (desc or asc),
          // we want to ensure we keep one representation.
          // If the list is desc (newest first), the first one we see is the latest.
          if (!acc[key]) {
              acc[key] = event; 
          }
          return acc;
        }, {} as Record<string, CalendarEvent>);

        const uniqueEvents = Object.values(groupedEvents);

        // 3. Filter: Only keep events that have highlight photos
        // We check this by querying our own API for each event.
        const eventsWithPhotos: CalendarEvent[] = [];

        await Promise.all(uniqueEvents.map(async (event) => {
           try {
             const driveRes = await fetch(`/api/drive/files?type=highlights&eventId=${event.googleEventId}`);
             if (driveRes.ok) {
                const driveData = await driveRes.json();
                if (driveData.data && Array.isArray(driveData.data) && driveData.data.length > 0) {
                    eventsWithPhotos.push(event);
                }
             }
           } catch (err) {
             // Ignore errors, just don't include
             console.warn(`Failed to check drive for ${event.title}`, err);
           }
        }));

        // Sort again by date desc (just to be sure, as Promise.all order isn't guaranteed)
        eventsWithPhotos.sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());

        setEvents(eventsWithPhotos);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPastSessions();
  }, []);

  if (loading) return null; 
  if (events.length === 0) return null;

  const normalizeTitle = (title: string) => {
    return title
        .replace(/:\s*Slot\s*\d+.*$/i, "") 
        .replace(/\s*Slot\s*\d+.*$/i, "")  
        .replace(/\(.*\)/g, "")           
        .trim();
  };

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
        {events.map((event) => (
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
