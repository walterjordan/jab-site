"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import type { DriveImage } from "@/lib/drive";
import ShareButtons from "../ui/ShareButtons";

type RecapViewProps = {
  flyer: DriveImage | null;
  highlights: DriveImage[];
  folderLink: string | null;
  eventId: string | null;
};

export default function RecapView({ flyer, highlights, folderLink, eventId }: RecapViewProps) {
  const [selectedImage, setSelectedImage] = useState<DriveImage | null>(null);
  
  // Start with a stable default (server-side URL) to ensure hydration matches
  const [shareUrl, setShareUrl] = useState(`https://jordanborden.com/events/paint-sip-recap?eventId=${eventId}`);

  useEffect(() => {
    // Update to current window location on client mount
    if (typeof window !== 'undefined') {
        setShareUrl(window.location.href);
    }
  }, []);

  const shareTitle = "Paint & Sip: Event Recap";

  return (
    <>
        {/* Header */}
        <div className="text-center mb-8 md:mb-16">
          <span className="inline-block rounded-full bg-[#7fff41]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#7fff41] mb-4">
            Event Recap
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Paint & Sip: Networking Night
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-6">
            A fantastic evening of creativity, connection, and automation conversations. 
            Thanks to everyone who joined us!
          </p>
          
          {/* Share Buttons */}
          <div className="flex justify-center">
            <ShareButtons url={shareUrl} title={shareTitle} />
          </div>
        </div>

        {/* Flyer Section - Single Centered Card */}
        {flyer ? (
           <div className="mb-16 flex justify-center">
             <div 
               onClick={() => setSelectedImage(flyer)}
               className="relative w-full max-w-lg aspect-[2/3] md:aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 group cursor-pointer"
             >
                <Image 
                  src={flyer.src} 
                  alt="Event Flyer" 
                  fill
                  className="object-contain bg-slate-900 transition duration-500 group-hover:scale-105" 
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                   <span className="bg-white/10 backdrop-blur px-4 py-2 rounded-full text-xs font-bold border border-white/20">View Full Size</span>
                </div>
             </div>
           </div>
        ) : (
           <div className="mb-16 flex justify-center">
              <div className="w-full max-w-lg aspect-video flex flex-col items-center justify-center p-12 border border-dashed border-white/10 rounded-2xl bg-white/5">
                <p className="text-slate-400">{!eventId ? "No event specified." : "Flyer not found in Drive."}</p>
              </div>
           </div>
        )}

        {/* Highlight Grid (Only if we have images) */}
        {highlights.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
             {highlights.map((img) => (
               <div 
                 key={img.id} 
                 onClick={() => setSelectedImage(img)}
                 className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 group cursor-pointer"
               >
                 <Image 
                   src={img.src} 
                   alt={img.name} 
                   fill
                   className="object-cover transition duration-500 group-hover:scale-105" 
                   sizes="(max-width: 768px) 100vw, 50vw"
                 />
                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="bg-white/10 backdrop-blur px-4 py-2 rounded-full text-xs font-bold border border-white/20">Expand Image</span>
                 </div>
               </div>
             ))}
          </div>
        ) : (
          <div className="mb-16 text-center border border-dashed border-white/10 rounded-2xl p-8">
            <p className="text-slate-400">No highlight photos found in the 'public' folder.</p>
          </div>
        )}

        {/* Lightbox Overlay */}
        {selectedImage && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md transition-all animate-in fade-in"
            onClick={() => setSelectedImage(null)}
          >
             <button 
               className="absolute top-6 right-6 text-white hover:text-[#7fff41] transition p-2 z-[60]"
               onClick={() => setSelectedImage(null)}
             >
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
             <div className="relative max-w-5xl w-full h-full flex items-center justify-center">
                <img 
                  src={selectedImage.src.replace('=s800', '=s2048').replace('=s1200', '=s2048')} 
                  alt={selectedImage.name} 
                  className="max-h-full max-w-full object-contain rounded-lg shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                />
             </div>
          </div>
        )}

        {/* CTA to Drive */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 p-8 md:p-12 text-center relative overflow-hidden">
           <div className="relative z-10">
             <h3 className="text-2xl font-bold text-white mb-4">Want to see all the photos?</h3>
             <p className="text-slate-300 mb-8 max-w-xl mx-auto">
               We've uploaded the full high-resolution album to our Google Drive. 
               Find yourself and share with your network!
             </p>
             {folderLink && (
               <a 
                 href={folderLink} 
                 target="_blank" 
                 rel="noreferrer"
                 className="inline-flex items-center gap-2 rounded-full bg-[#7fff41] px-8 py-3 text-base font-bold text-slate-900 shadow-lg shadow-[#7fff41]/20 transition hover:bg-[#a4ff82] hover:scale-105"
               >
                 View Full Gallery on Drive
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" stroke="currentColor" />
                 </svg>
               </a>
             )}
           </div>
           
           {/* Background decoration */}
           <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
             <div className="absolute top-[-50%] left-[-20%] w-[500px] h-[500px] bg-[#7fff41]/20 rounded-full blur-[100px]" />
           </div>
        </div>
    </>
  );
}
