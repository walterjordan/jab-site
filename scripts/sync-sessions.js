const Airtable = require('airtable');
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
}

const API_KEY = process.env.AIRTABLE_API_KEY;
const BASE_ID = process.env.AIRTABLE_BASE_ID;
const SESSIONS_TABLE = process.env.AIRTABLE_SESSIONS_TABLE || 'Live Sessions';
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;

const base = new Airtable({ apiKey: API_KEY }).base(BASE_ID);

async function syncSessions() {
    console.log('Starting Google Calendar to Airtable Sync...');
    
    // Debug environment variables (masking values)
    console.log('Environment Check:');
    console.log('  AIRTABLE_API_KEY:', !!API_KEY ? 'Set' : 'Missing');
    console.log('  AIRTABLE_BASE_ID:', !!BASE_ID ? 'Set' : 'Missing');
    console.log('  GOOGLE_CALENDAR_ID:', !!CALENDAR_ID ? 'Set' : 'Missing');
    console.log('  GOOGLE_CLIENT_EMAIL:', !!process.env.GOOGLE_CLIENT_EMAIL ? 'Set' : 'Missing');
    console.log('  GOOGLE_PRIVATE_KEY:', !!process.env.GOOGLE_PRIVATE_KEY ? 'Set' : 'Missing');

    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (privateKey) {
        // Replace literal \n with actual newlines if present (fixes GitHub Secrets issue)
        privateKey = privateKey.replace(/\\n/g, '\n');
    }

    if (!clientEmail || !privateKey) {
        throw new Error("Missing Google Credentials (CLIENT_EMAIL or PRIVATE_KEY)");
    }

    const jwtClient = new google.auth.JWT(
      clientEmail,
      null,
      privateKey,
      ['https://www.googleapis.com/auth/calendar.events.readonly']
    );

    // Explicitly authorize to fail fast if creds are wrong
    await jwtClient.authorize();
    console.log('Successfully authorized Google Client');

    const calendar = google.calendar({ version: 'v3', auth: jwtClient });
    
    // Fetch events from the last 30 days to 90 days in the future
    const timeMin = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    
    console.log(`Fetching events from Google Calendar (${CALENDAR_ID})...`);
    const response = await calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: timeMin,
      singleEvents: true,
      orderBy: 'startTime',
      q: 'AI Mastermind',
    });

    const events = response.data.items || [];
    console.log(`Found ${events.length} matching events.`);

    for (const event of events) {
        const eventId = event.id;
        const summary = event.summary;
        const description = event.description || '';
        const start = event.start.dateTime || event.start.date;
        const meetingLink = event.hangoutLink || event.location || '';
        
        // Determine Program Track based on title
        const programTrack = summary.toLowerCase().includes('free') ? 'Free 90-min' : 'Full-day';

        console.log(`Processing: ${summary} (${start})`);

        // Check if record exists in Airtable
        const existing = await base(SESSIONS_TABLE).select({
            filterByFormula: `{Google Event ID} = '${eventId}'`,
            maxRecords: 1
        }).firstPage();

        const startTime = new Date(start).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
        const endTime = new Date(event.end.dateTime || event.end.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });

        const fields = {
            'Session Title': summary,
            'Google Event ID': eventId,
            'Description': description,
            'Session Date': start.split('T')[0],
            'Start Time': startTime,
            'End Time': endTime,
            'Meeting Link': meetingLink,
            'Program Track': programTrack,
            'Session Status': 'Upcoming'
        };

        if (existing.length > 0) {
            console.log(`  Updating existing record ${existing[0].id}...`);
            await base(SESSIONS_TABLE).update(existing[0].id, fields);
        } else {
            console.log(`  Creating new record...`);
            await base(SESSIONS_TABLE).create([{ fields }]);
        }
    }

    console.log('Sync Complete.');
}

syncSessions().catch(err => {
    console.error('Sync Failed:', err);
    process.exit(1);
});
