"use client";

import { useEffect, useState } from "react";

import RegistrationModal from "./RegistrationModal";

type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  link: string;
  description?: string;
};

export default function UpcomingSessions() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    async function fetchSessions() {
      try {
        const res = await fetch("/api/calendar/sessions");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setEvents(data.events || []);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchSessions();
  }, []);

  const handleReserveClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "America/New_York",
    }).format(date);
  };
  
  const formatFullDate = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZone: "America/New_York"
    }).format(date);
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "America/New_York",
    }).format(date);
  };

  if (error) {
    // Fallback UI in case of error (or maintain static look if preferred, but here we show a simple message or nothing)
    return (
      <div className="w-full max-w-md shrink-0 self-stretch rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/40 backdrop-blur md:w-5/12 flex flex-col justify-center items-center text-center">
        <p className="text-slate-300 mb-2">Check back soon for new sessions.</p>
        <a
          href="#pricing"
          className="text-[#7fff41] hover:underline text-sm font-medium"
        >
          Contact us for schedule
        </a>
      </div>
    );
  }

  return (
    <>
    <div className="w-full max-w-md shrink-0 self-stretch rounded-3xl border border-white/10 bg-slate-900/80 p-4 shadow-2xl shadow-black/40 backdrop-blur md:w-5/12 flex flex-col">
      <div className="flex items-center justify-between text-sm text-slate-300 mb-4 px-2">
        <span className="inline-flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-medium text-slate-100">Upcoming Masterminds</span>
        </span>
        <span className="text-xs text-slate-500 font-mono">EST (New York)</span>
      </div>

      <div className="flex-1 space-y-3">
        {loading ? (
          // Skeleton Loader
          <>
            {[1, 2].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl bg-slate-800/50 p-4 border border-white/5"
              >
                <div className="h-4 w-24 bg-slate-700 rounded mb-2"></div>
                <div className="h-5 w-3/4 bg-slate-700 rounded mb-3"></div>
                <div className="h-8 w-full bg-slate-700 rounded-lg"></div>
              </div>
            ))}
          </>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center px-4">
             <p className="text-slate-400 mb-4">No public sessions scheduled right now.</p>
             <a href="#contact" className="text-[#7fff41] text-sm font-medium hover:underline">Join the waitlist</a>
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="group relative rounded-2xl border border-white/5 bg-slate-800/40 hover:bg-slate-800/60 transition p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#7fff41]">
                    {formatDate(event.start)}
                  </span>
                  <span className="text-xs text-slate-400">
                    {formatTime(event.start)} - {formatTime(event.end)}
                  </span>
                </div>
              </div>
              
              <h4 className="text-base font-semibold text-slate-100 mb-3 leading-snug">
                {event.title}
              </h4>

              <button
                onClick={() => handleReserveClick(event)}
                className="flex items-center justify-center w-full rounded-lg bg-[#7fff41]/10 border border-[#7fff41]/20 py-2 text-sm font-semibold text-[#7fff41] hover:bg-[#7fff41] hover:text-slate-900 transition-colors"
              >
                Reserve Seat
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 px-2">
         <p className="text-xs text-center text-slate-500">
           Limited to 10 spots per session.
         </p>
      </div>
    </div>
    
    <RegistrationModal 
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      sessionTitle={selectedEvent?.title || "Mastermind Session"}
      sessionDate={selectedEvent ? formatFullDate(selectedEvent.start) : ""}
      eventId={selectedEvent?.id || ""}
    />
    </>
  );
}
