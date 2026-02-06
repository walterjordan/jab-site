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
const SESSIONS_TABLE = process.env.AIRTABLE_SESSIONS_TABLE || 'Live Sessions';

// Helper to format private key
const getPrivateKey = () => process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

export async function POST(req: Request) {
  try {
    const { eventId, email, phone, name, isWaitlist, waitlistTrack } = await req.json();

    if (!email || (!eventId && !isWaitlist)) {
      return NextResponse.json(
        { error: 'Missing required fields: email, and either eventId or isWaitlist' },
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

    const airtableBase = getAirtableBase();
    let airtableRegistrationId;
    let confirmUrl;
    let confirmToken;
    let googleEventId;
    let sessionIdArray: string[] = [];

    // 0. FETCH SESSION DETAILS (Retrieve Google Event ID)
    try {
        console.log(`Fetching session details for Airtable Record: ${eventId}`);
        const sessionRecord = await airtableBase(SESSIONS_TABLE).find(eventId);
        if (sessionRecord) {
            googleEventId = sessionRecord.get('Google Event ID') as string;
            sessionIdArray = [sessionRecord.id];
            console.log(`Found Session. Google Event ID: ${googleEventId}`);
        }
    } catch (sessionError) {
        console.warn(`Could not find session with ID ${eventId}:`, sessionError);
        // We continue, but calendar invite might fail if googleEventId is missing
    }

      // 1. UPSERT REGISTRATION RECORD (Registrations Table)
    try {
      console.log('Starting Airtable Sync (Registrations)...');
      
      // Determine which ID to use for the 'Event ID' field and duplicate check
      const idToRegister = googleEventId || eventId || (isWaitlist ? `WAITLIST_${waitlistTrack?.toUpperCase() || 'GENERAL'}` : 'UNKNOWN');
      const escapedIdToRegister = idToRegister.replace(/'/g, "\\'");
      const escapedEmail = email.replace(/'/g, "\\'");

      console.log(`Searching for existing registration: Email='${email}', Event='${idToRegister}'`);
      
      const records = await airtableBase(REGISTRATIONS_TABLE)
        .select({
          filterByFormula: `AND({Registrant Email} = '${escapedEmail}', {Event ID} = '${escapedIdToRegister}')`,
          maxRecords: 1,
        })
        .firstPage();

      // Generate Confirmation Token & URL (Always fresh or persistent)
      confirmToken = crypto.randomUUID();
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://jordanborden.com'; 
      confirmUrl = `${baseUrl}/confirm?token=${confirmToken}`;

      const commonFields: any = {
          'Registrant Email': email,
          'Registrant Name': name || email.split('@')[0],
          'Registrant Phone': phone || '',
          'Confirm Token': confirmToken,
          'Confirm URL': confirmUrl,
          'Event ID': idToRegister,
      };

      // Add Waitlist specific fields if applicable
      if (isWaitlist) {
          commonFields['Waitlist Status'] = 'Active';
          commonFields['Waitlist Joined At'] = new Date().toISOString();
          commonFields['Waitlist Notes'] = `Joined via ${waitlistTrack || 'General'} waitlist link on site.`;
          commonFields['Status'] = 'Waitlist'; // Standard status for waitlist entries
      } else {
          commonFields['Status'] = 'Pending';
      }

      // Link to Session if found
      if (sessionIdArray.length > 0) {
          commonFields['Session'] = sessionIdArray;
      }

      if (records.length > 0) {
        // Update existing registration
        const record = records[0];
        airtableRegistrationId = record.id;
        console.log(`Found existing registration ${airtableRegistrationId}. Updating...`);
        
        await airtableBase(REGISTRATIONS_TABLE).update(airtableRegistrationId, {
            ...commonFields,
            'Email: Ack Sent': false, // Reset triggers
            'Email: Welcome Sent': false,
        });

      } else {
        // Create new registration
        console.log('Creating new registration record...');
        
        const createFields: any = {
          ...commonFields,
          'Email: Ack Sent': false,
          'Email: Welcome Sent': false,
        };

        const createdRecords = await airtableBase(REGISTRATIONS_TABLE).create([
          { fields: createFields }
        ]);
        airtableRegistrationId = createdRecords[0].id;
        console.log(`Created registration: ${airtableRegistrationId}`);
      }

    } catch (airtableError: any) {
      console.error('Airtable Sync Error Full Details:', JSON.stringify(airtableError, null, 2));
      console.error('Airtable Error Message:', airtableError.message);
    }

    // 2. TRIGGER MAKE.COM WEBHOOK (Now sending Registration ID)
    if (process.env.MAKE_Mastermind_Registration_webhook_URL && airtableRegistrationId) {
      try {
        await fetch(process.env.MAKE_Mastermind_Registration_webhook_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            airtableRegistrationId,
            email,
            eventId,
            googleEventId,
            status: isWaitlist ? 'Waitlist' : 'Pending',
            isWaitlist,
            waitlistTrack,
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
    // Only attempt if we found a valid Google Event ID and it's NOT a waitlist entry
    if (googleEventId && !isWaitlist) {
        try {
            console.log(`Attempting Google Calendar Invite for Event: ${googleEventId}`);
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
                eventId: googleEventId,
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
                    eventId: googleEventId,
                    requestBody: {
                        attendees: updatedAttendees,
                    },
                    sendUpdates: 'all', // This triggers the email invite
                });
                console.log(`Google Calendar invite sent to ${email}`);
            } else {
                console.log(`User ${email} is already on the invite.`);
            }
        } catch (calError: any) {
            console.error('Google Calendar Error:', calError);
        }
    } else {
        console.warn('Skipping Google Calendar invite: No Google Event ID found for this session.');
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