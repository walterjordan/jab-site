import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import Airtable from 'airtable';
import crypto from 'crypto';

// Configure Airtable Lazily
const getAirtableBase = () => {
  if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
    throw new Error("Missing Airtable configuration");
  }
  return new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID
  );
};
const PARTICIPANTS_TABLE = process.env.AIRTABLE_PARTICIPANTS_TABLE || 'Participants';
const REGISTRATIONS_TABLE = process.env.AIRTABLE_REGISTRATIONS_TABLE || 'Registrations';

// Helper to format private key
const getPrivateKey = () => process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

export async function POST(req: Request) {
  try {
    const { eventId, email, phone, name } = await req.json();

    if (!eventId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: eventId or email' },
        { status: 400 }
      );
    }

    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = getPrivateKey();

    if (!calendarId || !clientEmail || !privateKey) {
      console.error('Missing Google Calendar configuration');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // 1. UPSERT REGISTRATION RECORD (Registrations Table)
    let airtableRegistrationId;
    let confirmUrl;
    let confirmToken;
    let programTrack;

    try {
      console.log('Starting Airtable Sync (Registrations)...');
      
      const airtableBase = getAirtableBase();
      
      // Escape values for formula
      const escapedEmail = email.replace(/'/g, "\\'");
      const escapedEventId = eventId.replace(/'/g, "\\'");
      
      console.log(`Searching for existing registration: Email='${email}', Event='${eventId}'`);
      
      const records = await airtableBase(REGISTRATIONS_TABLE)
        .select({
          filterByFormula: `AND({Registrant Email} = '${escapedEmail}', {Event ID} = '${escapedEventId}')`,
          maxRecords: 1,
        })
        .firstPage();

      // Generate Confirmation Token & URL (Always fresh or persistent)
      // Note: In a real app, you might want to preserve the old token if it exists, 
      // but regenerating ensures the user always gets a working link if they re-register.
      confirmToken = crypto.randomUUID();
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jordanborden.com'; 
      confirmUrl = `${baseUrl}/confirm?token=${confirmToken}`;

      const commonFields = {
          'Registrant Email': email,
          'Registrant Name': name || email.split('@')[0],
          'Registrant Phone': phone || '',
          'Confirm Token': confirmToken,
          'Confirm URL': confirmUrl,
          'Event ID': eventId, // Text field backup
      };

      if (records.length > 0) {
        // Update existing registration
        const record = records[0];
        airtableRegistrationId = record.id;
        console.log(`Found existing registration ${airtableRegistrationId}. Updating...`);
        
        // Only reset Status to Pending if it was Canceled or Declined? 
        // For now, let's leave Status alone if it's already there, unless we want to re-trigger the flow.
        // Let's assume re-registering means they want to restart -> Pending.
        
        await airtableBase(REGISTRATIONS_TABLE).update(airtableRegistrationId, {
            ...commonFields,
            'Status': 'Pending', 
            'Email: Ack Sent': false, // Reset triggers
            'Email: Welcome Sent': false,
        });

      } else {
        // Create new registration
        console.log('Creating new registration record...');
        
        // We need to link to the Session based on Event ID. 
        // This usually requires a separate lookup of the Sessions table by Event ID 
        // OR we just rely on the Make automation to link it later. 
        // However, the prompt implies we rely on "Event ID" text field or we assume the frontend passed the ID?
        // Let's stick to saving the text "Event ID" for now as per schema 
        // (The schema has a text field "Event ID"). 
        // Ideally, we would find the "Live Session" record ID to link to the "Session" field.
        // For this refactor, we will focus on the text fields as requested, 
        // but let's try to link the session if possible to enable the "Program Track" lookup later.

        // Lookup Session ID (Optional improvement)
        let sessionId: string[] = [];
        try {
             const sessionRecords = await airtableBase(process.env.AIRTABLE_SESSIONS_TABLE || 'Live Sessions')
                .select({
                    filterByFormula: `{Google Event ID} = '${escapedEventId}'`,
                    maxRecords: 1
                }).firstPage();
             if (sessionRecords.length > 0) {
                 sessionId = [sessionRecords[0].id];
             }
        } catch (err) {
            console.warn("Could not link to Live Session:", err);
        }

        const createFields: any = {
          ...commonFields,
          'Status': 'Pending',
          'Email: Ack Sent': false,
          'Email: Welcome Sent': false,
        };
        
        if (sessionId.length > 0) {
            createFields['Session'] = sessionId;
        }

        const newRecord = await airtableBase(REGISTRATIONS_TABLE).create(createFields);
        airtableRegistrationId = newRecord.id;
        console.log(`Created registration: ${airtableRegistrationId}`);
      }

    } catch (airtableError: any) {
      console.error('Airtable Sync Error Full Details:', JSON.stringify(airtableError, null, 2));
      console.error('Airtable Error Message:', airtableError.message);
      // We don't block the response here, but we should probably alert
    }

    // 2. TRIGGER MAKE.COM WEBHOOK (Now sending Registration ID)
    if (process.env.MAKE_Mastermind_Registration_webhook_URL && airtableRegistrationId) {
      try {
        await fetch(process.env.MAKE_Mastermind_Registration_webhook_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            airtableRegistrationId, // Renamed for clarity
            email,
            eventId,
            status: 'Pending',
            source: 'jab-site-registration',
            confirmToken,
            confirmUrl
          }),
        });
      } catch (webhookError) {
        console.error('Make Webhook Error:', webhookError);
      }
    }

    // 3. GOOGLE CALENDAR INVITE
    try {
      const jwtClient = new google.auth.JWT({
        email: clientEmail,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/calendar'],
        subject: 'walterjordan@f2wconsulting.com'
      });

      const calendar = google.calendar({ version: 'v3', auth: jwtClient });

      // Fetch the event to get current attendees
      const event = await calendar.events.get({
        calendarId,
        eventId,
      });

      const currentAttendees = event.data.attendees || [];
      
      // Check if already attending
      const isAlreadyAttending = currentAttendees.some(a => a.email === email);

      if (!isAlreadyAttending) {
        const updatedAttendees = [
          ...currentAttendees,
          { email, displayName: name || email },
        ];

        await calendar.events.patch({
          calendarId,
          eventId,
          requestBody: {
            attendees: updatedAttendees,
          },
          sendUpdates: 'all', // This triggers the email invite
        });
      }
    } catch (calError: any) {
      console.error('Google Calendar Error:', calError);
    }

    // Sanity check for debugging
    console.log(`[Registration Complete] Returning ID: ${airtableRegistrationId}`);

    return NextResponse.json({ 
      success: true, 
      message: 'Registration successful',
      airtableId: airtableRegistrationId 
    });

  } catch (error: any) {
    console.error('Registration Error:', error);
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
