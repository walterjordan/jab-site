"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import RegistrationModal from "./RegistrationModal";

type CalendarEvent = {

  id: string;

  title: string;

  start: string;

  end: string;

  link: string;

  description?: string;

  coverImage?: string | null;

};



interface Props {

  title?: string;

  filterKeyword?: string;

  featuredLayout?: boolean;

}



export default function UpcomingSessions({

  title = "Upcoming Masterminds",

  filterKeyword = "Mastermind",

  featuredLayout = false

}: Props) {

  const [events, setEvents] = useState<CalendarEvent[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(false);

  

  // Modal state

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);



  useEffect(() => {

    async function fetchSessions() {

      try {

        const res = await fetch("/api/calendar/sessions?type=upcoming");

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



  // Filter events based on keyword

  const filteredEvents = events.filter(e => 

    e.title.toLowerCase().includes(filterKeyword.toLowerCase())

  );

  

  // Sort by date just in case API didn't

  filteredEvents.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());



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

    return (

      <div className="w-full max-w-md shrink-0 self-stretch rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/40 backdrop-blur md:w-5/12 flex flex-col justify-center items-center text-center">

        <p className="text-slate-300 mb-2">Check back soon for new sessions.</p>

        <a href="#pricing" className="text-[#7fff41] hover:underline text-sm font-medium">Contact us</a>

      </div>

    );

  }

  

  // Logic for Featured Layout

  let displayEvents = filteredEvents;

  let futureEvents: CalendarEvent[] = [];



  if (featuredLayout && filteredEvents.length > 0) {

      displayEvents = [filteredEvents[0]];

      futureEvents = filteredEvents.slice(1);

  } else if (!featuredLayout) {

      displayEvents = filteredEvents.slice(0, 4);

  }



      return (



        <>



        <div className="w-full shrink-0 self-stretch rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-2xl shadow-black/40 backdrop-blur flex flex-col">



          <div className="flex items-center justify-between text-sm text-slate-300 mb-6 px-1">



            <span className="inline-flex items-center gap-2">



              <span className="relative flex h-2 w-2">



                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>



                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>



              </span>



              <span className="font-medium text-slate-100 uppercase tracking-wider">{title}</span>



            </span>



            <span className="text-xs text-slate-500 font-mono">EST (NYC)</span>



          </div>



    



          <div className="flex-1 space-y-6">



            {loading ? (



              // Skeleton Loader



              <>



                {[1, 2].map((i) => (



                  <div key={i} className="animate-pulse rounded-2xl bg-slate-800/50 p-4 border border-white/5">



                    <div className="h-4 w-24 bg-slate-700 rounded mb-4"></div>



                    <div className="h-40 w-full bg-slate-700 rounded-lg"></div>



                  </div>



                ))}



              </>



            ) : filteredEvents.length === 0 ? (



              <div className="flex flex-col items-center justify-center h-48 text-center px-4">



                 <p className="text-slate-400 mb-4">No sessions scheduled.</p>



                 <a href="#contact" className="text-[#7fff41] text-sm font-medium hover:underline">Join the waitlist</a>



              </div>



            ) : (



              <>

              {displayEvents.map((event) => {



                const hasImage = !!event.coverImage;



    



                return (



                  <div key={event.id} className="group relative rounded-2xl border border-white/5 bg-slate-800/40 p-4 hover:bg-slate-800/60 transition flex flex-col">



                    



                    {/* Header for the Slot */}



                    <div className="flex justify-between items-center mb-3">



                       <span className="text-sm font-bold uppercase tracking-wider text-[#7fff41]">



                          {formatDate(event.start)}



                       </span>



                       <span className="text-xs text-slate-400 bg-slate-900/50 px-2 py-1 rounded-full">



                         {formatTime(event.start)}



                       </span>



                    </div>



    



                                        {/* If image exists, show it (Flyer Mode) */}



    



                    



    



                                        {hasImage && (



    



                    



    



                                          <div className="flex flex-col gap-3 mb-1">



    



                    



    



                                            <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-white/10 bg-slate-950">



    



                    



    



                                              <Image 



    



                    



    



                                                src={event.coverImage!} 



    



                    



    



                                                alt={event.title} 



    



                    



    



                                                fill



    



                    



    



                                                className="object-contain"



    



                    



    



                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"



    



                    



    



                                                priority={displayEvents.indexOf(event) === 0}



    



                    



    



                                              />



    



                    



    



                                            </div>



                        <button



                          onClick={() => handleReserveClick(event)}



                          className="w-full bg-[#7fff41]/10 border border-[#7fff41]/20 py-2.5 rounded-lg text-xs font-bold text-[#7fff41] hover:bg-[#7fff41] hover:text-black transition uppercase tracking-wider"



                        >



                          Reserve {formatTime(event.start)} Slot



                        </button>



                      </div>



                    )}



    



                    {/* List View (Fallback for non-image events) */}



                    {!hasImage && (



                      <div className="flex flex-col">



                        <h4 className="text-base font-semibold text-slate-100 leading-snug">



                          {event.title}



                        </h4>



                        <div className="flex justify-between items-center mt-3">



                          <span className="text-xs text-slate-400">



                            {formatTime(event.start)} - {formatTime(event.end)}



                          </span>



                          <button



                            onClick={() => handleReserveClick(event)}



                            className="text-xs bg-[#7fff41]/10 border border-[#7fff41]/20 px-3 py-1.5 rounded text-[#7fff41] hover:bg-[#7fff41] hover:text-slate-900 transition"



                          >



                            Reserve Seat



                          </button>



                        </div>



                      </div>



                    )}



                  </div>



                );



              })}

              

              {/* Additional Future Events Links */}

              {featuredLayout && futureEvents.length > 0 && (

                  <div className="mt-6 pt-4 border-t border-white/5">

                      <p className="text-xs text-slate-400 mb-3 uppercase tracking-wider font-semibold">Also available on:</p>

                      <div className="flex flex-col gap-2">

                          {futureEvents.map((e) => (

                              <button 

                                  key={e.id}

                                  onClick={() => handleReserveClick(e)}

                                  className="text-left text-sm text-[#7fff41] hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg transition border border-transparent hover:border-white/10 flex justify-between items-center group"

                              >

                                  <span>{formatFullDate(e.start)}</span>

                                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>

                              </button>

                          ))}

                      </div>

                  </div>

              )}

              </>



            )}



          </div>



      <div className="mt-4 pt-4 border-t border-white/5 px-2">

         <p className="text-xs text-center text-slate-500">

           Limited spots available.

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


