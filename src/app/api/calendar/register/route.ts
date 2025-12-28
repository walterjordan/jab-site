import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import Airtable from 'airtable';

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

    // 1. SYNC WITH AIRTABLE (Participants Table)
    let airtableRecordId;
    try {
      const airtableBase = getAirtableBase();
      // Check if participant exists
      const records = await airtableBase(PARTICIPANTS_TABLE)
        .select({
          filterByFormula: `{Email} = '${email}'`,
          maxRecords: 1,
        })
        .firstPage();

      if (records.length > 0) {
        // Update existing participant
        airtableRecordId = records[0].id;
        const updateFields: any = {};
        if (phone) updateFields['Phone'] = phone;
        if (name) updateFields['Full Name'] = name;
        
        // Only update if we have new info
        if (Object.keys(updateFields).length > 0) {
           await airtableBase(PARTICIPANTS_TABLE).update(airtableRecordId, updateFields);
        }
      } else {
        // Create new participant
        const newRecord = await airtableBase(PARTICIPANTS_TABLE).create({
          'Email': email,
          'Phone': phone || '',
          'Full Name': name || email.split('@')[0], // Fallback name
          'Status': 'Registered',
        });
        airtableRecordId = newRecord.id;
      }
    } catch (airtableError) {
      console.error('Airtable Sync Error:', airtableError);
    }

    // 2. TRIGGER MAKE.COM WEBHOOK (Optional enrichment/automation)
    if (process.env.MAKE_Mastermind_Registration_webhook_URL && airtableRecordId) {
      try {
        await fetch(process.env.MAKE_Mastermind_Registration_webhook_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            airtableRecordId,
            email,
            eventId,
            status: 'Registered',
            source: 'jab-site-registration'
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

    return NextResponse.json({ 
      success: true, 
      message: 'Registration successful',
      airtableId: airtableRecordId 
    });

  } catch (error: any) {
    console.error('Registration Error:', error);
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
