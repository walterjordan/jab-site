import { NextResponse } from 'next/server';
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

export async function GET() {
  try {
    const base = getAirtableBase();
    
    // Fetch upcoming sessions from Airtable
    // Assuming 'Session Status' = 'Upcoming' or filter by date
    // For now, let's fetch all and filter in memory or rely on a view if one exists.
    // Better: Sort by Date.
    const records = await base(SESSIONS_TABLE).select({
      sort: [{ field: 'Session Date', direction: 'asc' }],
      filterByFormula: "OR({Session Status} = 'Upcoming', {Session Status} = 'Scheduled')" 
    }).all();

    const events = records.map((record) => {
      const fields = record.fields;
      
      // Extract Cover Image URL if present
      const coverImages = fields['Cover Image'] as any[];
      const coverImage = coverImages && coverImages.length > 0 ? coverImages[0].url : null;

      return {
        id: record.id,
        title: fields['Session Title'] || 'Untitled Session',
        start: fields['Start Time'] || fields['Session Date'], // Fallback to date if time missing
        end: fields['End Time'],
        link: fields['Meeting Link'],
        description: fields['Description'],
        coverImage: coverImage,
        programTrack: fields['Program Track']
      };
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
