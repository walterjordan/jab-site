const Airtable = require('airtable');
const { google } = require('googleapis');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

// CONFIG
const TEST_EVENT_ID = 'recPqQhe1fqqc9Ew2'; // Paint & Sip Slot 2
const TEST_EMAIL = 'walterjordan+testlocal@f2wconsulting.com'; // Use a safe test alias
const TEST_NAME = 'Local Test User';

const REGISTRATIONS_TABLE = process.env.AIRTABLE_REGISTRATIONS_TABLE || 'Registrations';
const SESSIONS_TABLE = process.env.AIRTABLE_SESSIONS_TABLE || 'Live Sessions';

// MOCK RESPONSE
const NextResponse = {
    json: (data, opts) => {
        console.log('\n[API RESPONSE]:', JSON.stringify(data, null, 2));
        if (opts) console.log('[API STATUS]:', opts.status);
    }
};

async function main() {
    console.log('--- STARTING LOCAL REGISTRATION TEST ---');
    console.log(`Target Event (Airtable ID): ${TEST_EVENT_ID}`);
    console.log(`Test Email: ${TEST_EMAIL}`);

    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

    // --- LOGIC FROM route.ts STARTS HERE ---
    
    // 0. FETCH SESSION DETAILS
    let googleEventId;
    let sessionIdArray = [];
    try {
        console.log(`\n[STEP 0] Fetching session details for: ${TEST_EVENT_ID}`);
        const sessionRecord = await base(SESSIONS_TABLE).find(TEST_EVENT_ID);
        if (sessionRecord) {
            googleEventId = sessionRecord.get('Google Event ID');
            sessionIdArray = [sessionRecord.id];
            console.log(`[SUCCESS] Found Session. Google Event ID: ${googleEventId}`);
        }
    } catch (sessionError) {
        console.error(`[ERROR] Could not find session:`, sessionError);
    }

    // 1. UPSERT REGISTRATION
    let airtableRegistrationId;
    let confirmUrl;
    let confirmToken;
    
    try {
        console.log('\n[STEP 1] Starting Airtable Sync (Registrations)...');
        
        // LOGIC CHANGE: Determine which ID to use
        const idToRegister = googleEventId || TEST_EVENT_ID;
        const escapedIdToRegister = idToRegister.replace(/'/g, "\'");
        const escapedEmail = TEST_EMAIL.replace(/'/g, "\'");

        console.log(`Checking duplicates for: Email='${TEST_EMAIL}', Event='${idToRegister}'`);
        
        const records = await base(REGISTRATIONS_TABLE)
            .select({
                filterByFormula: `AND({Registrant Email} = '${escapedEmail}', {Event ID} = '${escapedIdToRegister}')`,
                maxRecords: 1,
            })
            .firstPage();

        confirmToken = crypto.randomUUID();
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jordanborden.com'; 
        confirmUrl = `${baseUrl}/confirm?token=${confirmToken}`;

        const commonFields = {
            'Registrant Email': TEST_EMAIL,
            'Registrant Name': TEST_NAME,
            'Registrant Phone': '',
            'Confirm Token': confirmToken,
            'Confirm URL': confirmUrl,
            'Event ID': idToRegister, 
        };

        if (sessionIdArray.length > 0) {
            commonFields['Session'] = sessionIdArray;
        }

        if (records.length > 0) {
            console.log(`[UPDATE] Found existing registration ${records[0].id}`);
            airtableRegistrationId = records[0].id;
            await base(REGISTRATIONS_TABLE).update(airtableRegistrationId, {
                ...commonFields,
                'Status': 'Pending',
                'Email: Ack Sent': false,
                'Email: Welcome Sent': false,
            });
        } else {
            console.log('[CREATE] Creating new registration...');
            const createdRecords = await base(REGISTRATIONS_TABLE).create([
                { fields: { ...commonFields, 'Status': 'Pending', 'Email: Ack Sent': false, 'Email: Welcome Sent': false } }
            ]);
            airtableRegistrationId = createdRecords[0].id;
        }
        console.log(`[SUCCESS] Airtable Record ID: ${airtableRegistrationId}`);

    } catch (airtableError) {
        console.error('[ERROR] Airtable Sync Failed:', airtableError);
    }

    // 2. MAKE.COM WEBHOOK (DRY RUN)
    console.log('\n[STEP 2] Simulating Make.com Webhook...');
    const webhookPayload = {
        airtableRegistrationId,
        email: TEST_EMAIL,
        eventId: TEST_EVENT_ID, // Original Request ID
        googleEventId: googleEventId, // New field
        status: 'Pending',
        source: 'jab-site-registration',
        confirmToken,
        confirmUrl
    };
    console.log('Payload that WOULD be sent:', JSON.stringify(webhookPayload, null, 2));
    
    // 3. GOOGLE CALENDAR INVITE
    console.log('\n[STEP 3] Attempting Google Calendar Invite...');
    if (googleEventId) {
        try {
            const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
            const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
            const calendarId = process.env.GOOGLE_CALENDAR_ID;

            const jwtClient = new google.auth.JWT({
                email: clientEmail,
                key: privateKey,
                scopes: ['https://www.googleapis.com/auth/calendar'],
                subject: 'walterjordan@f2wconsulting.com'
            });

            const calendar = google.calendar({ version: 'v3', auth: jwtClient });

            console.log(`Fetching G-Cal Event: ${googleEventId}`);
            const event = await calendar.events.get({
                calendarId,
                eventId: googleEventId,
            });

            const currentAttendees = event.data.attendees || [];
            console.log(`Current Attendees Count: ${currentAttendees.length}`);
            
            const isAlreadyAttending = currentAttendees.some(a => a.email === TEST_EMAIL);

            if (!isAlreadyAttending) {
                console.log(`Adding ${TEST_EMAIL} to attendees...`);
                // UNCOMMENT TO ACTUALLY SEND INVITE IN TEST
                /*
                const updatedAttendees = [
                    ...currentAttendees,
                    { email: TEST_EMAIL, displayName: TEST_NAME },
                ];
                await calendar.events.patch({
                    calendarId,
                    eventId: googleEventId,
                    requestBody: { attendees: updatedAttendees },
                    sendUpdates: 'all',
                });
                console.log('[SUCCESS] Invite sent!');
                */
               console.log('[DRY RUN] Invite would be sent here.');
            } else {
                console.log('[SKIP] User already attending.');
            }

        } catch (calError) {
            console.error('[ERROR] Google Calendar Error:', calError.message);
            if (calError.errors) console.error(JSON.stringify(calError.errors, null, 2));
        }
    } else {
        console.warn('[WARN] No Google Event ID found. Skipping invite.');
    }
}

main();
