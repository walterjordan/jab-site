import { google } from 'googleapis';
import { NextResponse } from 'next/server';

// Force dynamic to ensure we get fresh data on every request
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'); // Handle newlines in env vars

    if (!calendarId || !clientEmail || !privateKey) {
      console.error('Missing Google Calendar credentials');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const jwtClient = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/calendar.events.readonly'],
    });

    const calendar = google.calendar({ version: 'v3', auth: jwtClient });

    const now = new Date().toISOString();

    const response = await calendar.events.list({
      calendarId,
      timeMin: now,
      maxResults: 20, // Increased to fetch more events
      singleEvents: true,
      orderBy: 'startTime',
      // q: '90 Minute AI Mastermind', // Removed filter to allow Paint & Sip events
    });

    const events = response.data.items || [];

    // Map and format the events
    const formattedEvents = events
      // .slice(0, 3) // Removed slice to allow filtering on frontend
      .map((event) => {
        const start = event.start?.dateTime || event.start?.date;
        const end = event.end?.dateTime || event.end?.date;

        if (!start) return null;

        return {
          id: event.id,
          title: event.summary || 'AI Mastermind Session',
          start,
          end,
          link: event.htmlLink, // or custom booking link if description contains one
          description: event.description,
        };
      })
      .filter(Boolean);

    return NextResponse.json({ events: formattedEvents });
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
