const { google } = require('googleapis');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

async function createPaintAndSipEvents() {
    console.log('Preparing to create Paint & Sip events...');
    
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const calendarId = process.env.GOOGLE_CALENDAR_ID;

    const jwtClient = new google.auth.JWT({
        email: clientEmail,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/calendar'],
        subject: 'walterjordan@f2wconsulting.com' // Impersonate the calendar owner
    });

    await jwtClient.authorize();
    const calendar = google.calendar({ version: 'v3', auth: jwtClient });

    const events = [
        {
            summary: 'Paint & Sip: Slot 1 (Social Networking)',
            description: 'A fun social networking event to promote our AI Mastermind workshops. Drinks, painting, and automation talk!',
            start: {
                dateTime: '2026-01-17T19:00:00Z', // Saturday Jan 17, 7PM UTC
                timeZone: 'UTC',
            },
            end: {
                dateTime: '2026-01-17T21:00:00Z',
                timeZone: 'UTC',
            },
            location: 'https://meet.google.com/hiz-wejz-kch', // Using your existing Meet link as placeholder
            conferenceData: {
                createRequest: { requestId: "paint-sip-jan17" }
            }
        },
        {
            summary: 'Paint & Sip: Slot 2 (Social Networking)',
            description: 'Round two! Networking and creativity combined with business automation insights.',
            start: {
                dateTime: '2026-01-24T19:00:00Z', // Saturday Jan 24, 7PM UTC
                timeZone: 'UTC',
            },
            end: {
                dateTime: '2026-01-24T21:00:00Z',
                timeZone: 'UTC',
            },
            location: 'https://meet.google.com/hiz-wejz-kch',
            conferenceData: {
                createRequest: { requestId: "paint-sip-jan24" }
            }
        }
    ];

    for (const event of events) {
        console.log(`Creating event: ${event.summary}...`);
        try {
            const res = await calendar.events.insert({
                calendarId: calendarId,
                resource: event,
                conferenceDataVersion: 1
            });
            console.log(`✅ Success! Event created: ${res.data.htmlLink}`);
        } catch (err) {
            console.error(`❌ Failed to create event ${event.summary}:`, err.message);
        }
    }
}

createPaintAndSipEvents();
