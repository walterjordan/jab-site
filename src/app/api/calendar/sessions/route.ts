import { NextRequest, NextResponse } from 'next/server';
import Airtable from 'airtable';

// Force dynamic to ensure we get fresh data on every request
export const dynamic = 'force-dynamic';

const getAirtableBase = () => {
  if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
    throw new Error("Missing Airtable configuration");
  }
  return new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID
  );
};

const SESSIONS_TABLE = process.env.AIRTABLE_SESSIONS_TABLE || 'Live Sessions';

// Helper to safely convert Airtable field values to Date
function toDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

export async function GET(request: NextRequest) {
  try {
    const base = getAirtableBase();
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'upcoming'; // 'upcoming' | 'past'
    
    // Fetch all sessions, sorted by date.
    // We filter in-memory to ensure precise date comparison vs. current time
    const records = await base(SESSIONS_TABLE).select({
      sort: [{ field: 'Session Date', direction: type === 'past' ? 'desc' : 'asc' }],
    }).all();

    const now = new Date();

    const events = records.map((record) => {
      const fields = record.fields;
      
      // Extract Cover Image URL if present
      const coverImages = fields['Cover Image'] as any[];
      const coverImage = coverImages && coverImages.length > 0 ? coverImages[0].url : null;

      return {
        id: record.id,
        googleEventId: fields['Google Event ID'],
        title: fields['Session Title'] || 'Untitled Session',
        start: fields['Start Time'] || fields['Session Date'], // Fallback to date if time missing
        end: fields['End Time'],
        link: fields['Meeting Link'],
        description: fields['Description'],
        coverImage: coverImage,
        programTrack: fields['Program Track']
      };
    }).filter(event => {
       // Determine if event is in the future or past
       // Use End Time if available, otherwise Start Time
       const endTime = toDate(event.end);
       const startTime = toDate(event.start);
       const eventTime = endTime || startTime;
       
       if (!eventTime) return false; // Skip invalid dates

       if (type === 'past') {
         return eventTime < now;
       } else {
         return eventTime >= now;
       }
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching Airtable sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    );
  }
}
