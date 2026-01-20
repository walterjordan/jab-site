"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

type DriveImage = {
  id: string;
  name: string;
  src: string;
};

function RecapContent() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");
  
  const [flyer, setFlyer] = useState<DriveImage | null>(null);
  const [highlights, setHighlights] = useState<DriveImage[]>([]);
  const [folderLink, setFolderLink] = useState<string | null>(null);
  const [loadingFlyer, setLoadingFlyer] = useState(true);
  const [loadingHighlights, setLoadingHighlights] = useState(true);
  const [selectedImage, setSelectedImage] = useState<DriveImage | null>(null);

  useEffect(() => {
    if (!eventId) {
      setLoadingFlyer(false);
      setLoadingHighlights(false);
      return;
    }

    async function fetchData() {
      // Fetch Folder Link
      try {
        const resFolder = await fetch(`/api/drive/files?type=folder&eventId=${eventId}`);
        if (resFolder.ok) {
          const json = await resFolder.json();
          if (json.data?.webViewLink) {
            setFolderLink(json.data.webViewLink);
          }
        }
      } catch (e) {
        console.error("Failed to fetch folder link", e);
      }

      // Fetch Flyer
      try {
        const resFlyer = await fetch(`/api/drive/files?type=flyer&eventId=${eventId}`);
        if (resFlyer.ok) {
          const json = await resFlyer.json();
          setFlyer(json.data);
        }
      } catch (e) {
        console.error("Failed to fetch flyer", e);
      } finally {
        setLoadingFlyer(false);
      }

      // Fetch Highlights
      try {
        const resHighlights = await fetch(`/api/drive/files?type=highlights&eventId=${eventId}`);
        if (resHighlights.ok) {
          const json = await resHighlights.json();
          setHighlights(json.data || []);
        }
      } catch (e) {
        console.error("Failed to fetch highlights", e);
      } finally {
        setLoadingHighlights(false);
      }
    }

    fetchData();
  }, [eventId]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 md:py-20">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block rounded-full bg-[#7fff41]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#7fff41] mb-4">
            Event Recap
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Paint & Sip: Networking Night
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            A fantastic evening of creativity, connection, and automation conversations. 
            Thanks to everyone who joined us!
          </p>
        </div>

        {/* Flyer Section - Single Centered Card */}
        {loadingFlyer ? (
           <div className="mb-16 flex justify-center">
              <div className="w-full max-w-lg aspect-[2/3] md:aspect-video flex flex-col items-center justify-center p-12 border border-dashed border-white/10 rounded-2xl bg-white/5 animate-pulse">
                <p className="text-slate-400 text-sm">Loading flyer...</p>
              </div>
           </div>
        ) : flyer ? (
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
        {loadingHighlights ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
             {[1,2,3,4].map(i => (
                <div key={i} className="aspect-video rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
             ))}
          </div>
        ) : highlights.length > 0 ? (
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
      </main>
  );
}

export default function PaintSipRecapPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-[#7fff41] selection:text-slate-900">
      {/* Navbar (Simplified) */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/80 backdrop-blur px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <Image 
              src="/jab-logo.png" 
              alt="JAB logo" 
              width={36} 
              height={36} 
              className="rounded-md shadow-sm invert" 
              priority
            />
            <span className="text-sm font-semibold tracking-tight text-white">Jordan & Borden</span>
          </Link>
          <Link href="/" className="text-sm font-medium text-slate-400 hover:text-[#7fff41] transition">
            ← Back to Home
          </Link>
        </div>
      </header>

      <Suspense fallback={
        <main className="mx-auto max-w-5xl px-6 py-12 md:py-20 text-center">
          <p className="text-slate-400">Loading recap...</p>
        </main>
      }>
        <RecapContent />
      </Suspense>
    </div>
  );
}
