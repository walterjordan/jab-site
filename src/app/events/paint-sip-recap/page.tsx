import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { getEventImages } from "@/lib/drive";
import RecapView from "@/components/events/RecapView";
import type { Metadata, ResolvingMetadata } from "next";
import Airtable from 'airtable';

export const dynamic = 'force-dynamic';

const getAirtableBase = () => {
  return new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID!);
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function getAirtableFolderId(eventId: string) {
  try {
    const base = getAirtableBase();
    const records = await base('Live Sessions').select({
      filterByFormula: `{Google Event ID} = '${eventId}'`,
      maxRecords: 1
    }).firstPage();

    if (records.length > 0) {
      return records[0].fields['Drive Folder ID'] as string || null;
    }
  } catch (e) {
    console.error("Error fetching Airtable Folder ID:", e);
  }
  return null;
}

export async function generateMetadata(
  { searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const eventId = resolvedSearchParams.eventId;
  
  if (typeof eventId !== 'string') {
     return {
         title: "Event Recap | Jordan & Borden",
         description: "Check out the highlights from our latest event."
     }
  }

  // Get Folder ID from Airtable
  const folderId = await getAirtableFolderId(eventId);

  // Fetch flyer for OG Image
  const { flyer } = await getEventImages(eventId, folderId || undefined);

  const previousImages = (await parent).openGraph?.images || []

  return {
    title: "Recap: Paint & Sip - Networking Night",
    description: "Check out the photos from our latest AI Mastermind networking event. A fantastic evening of creativity, connection, and automation conversations.",
    openGraph: {
      images: flyer ? [flyer.src, ...previousImages] : previousImages,
    },
  }
}

export default async function PaintSipRecapPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const eventId = typeof resolvedSearchParams.eventId === 'string' ? resolvedSearchParams.eventId : null;

  let folderId: string | null = null;
  if (eventId) {
    folderId = await getAirtableFolderId(eventId);
  }

  // Server-side fetch
  const { flyer, highlights, folderLink } = await getEventImages(eventId || "", folderId || undefined);

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

      <main className="mx-auto max-w-5xl px-6 py-12 md:py-20">
        <Suspense fallback={
             <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7fff41] mb-4"></div>
                <p className="text-slate-400">Loading recap...</p>
             </div>
        }>
            <RecapView 
               flyer={flyer} 
               highlights={highlights} 
               folderLink={folderLink} 
               eventId={eventId}
            />
        </Suspense>
      </main>
    </div>
  );
}

