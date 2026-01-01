const { google } = require('googleapis');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

async function listAllEvents() {
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

    const res = await calendar.events.list({
        calendarId,
        timeMin: '2026-01-01T00:00:00Z',
        timeMax: '2026-02-01T00:00:00Z',
        singleEvents: true,
        orderBy: 'startTime'
    });

    const events = res.data.items || [];
    console.log(`Found ${events.length} events in January:`);
    events.forEach(e => {
        console.log(`${e.summary} | ${e.start.dateTime || e.start.date}`);
    });
}

listAllEvents();
