const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
}

async function test() {
    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    const jwtClient = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/calendar.events.readonly'],
    });

    const calendar = google.calendar({ version: 'v3', auth: jwtClient });
    const response = await calendar.events.list({
      calendarId,
      timeMin: new Date().toISOString(),
      maxResults: 1,
      singleEvents: true,
      orderBy: 'startTime',
      q: '90 Minute AI Mastermind',
    });

    if (response.data.items && response.data.items.length > 0) {
        const event = response.data.items[0];
        console.log('Sample Event Data:');
        console.log(JSON.stringify({
            summary: event.summary,
            location: event.location,
            hangoutLink: event.hangoutLink,
            description: event.description
        }, null, 2));
    } else {
        console.log('No upcoming events found.');
    }
}

test();
