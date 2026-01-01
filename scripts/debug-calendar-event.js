const { google } = require('googleapis');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

async function inspectEvent() {
    console.log('Fetching Jan 25th Event details...');
    
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    const jwtClient = new google.auth.JWT({
        email: clientEmail,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/calendar.events.readonly']
    });

    await jwtClient.authorize();
    const calendar = google.calendar({ version: 'v3', auth: jwtClient });

    // Range covering Jan 25, 2026
    const timeMin = '2026-01-25T00:00:00Z';
    const timeMax = '2026-01-26T00:00:00Z';

    const res = await calendar.events.list({
        calendarId,
        timeMin,
        timeMax,
        singleEvents: true,
        conferenceDataVersion: 1 // <--- CRITICAL: Request conference data
    });

    const events = res.data.items || [];
    if (events.length === 0) {
        console.log('No events found on Jan 25.');
        return;
    }

    const event = events[0];
    console.log(`\nEvent Found: ${event.summary}`);
    console.log(`ID: ${event.id}`);
    console.log(`--- LINK DATA ---`);
    console.log(`hangoutLink: ${event.hangoutLink}`); // Built-in Meet
    console.log(`location: ${event.location}`);       // Manual location field
    console.log(`description: ${event.description}`);
    console.log(`-----------------`);
    
    if (!event.hangoutLink && !event.location) {
        console.log("⚠️  API sees NO links. Check if 'conferenceData' is populated...");
        console.log(JSON.stringify(event.conferenceData, null, 2));
    }
}

inspectEvent();
