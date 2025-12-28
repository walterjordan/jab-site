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
      console.log('Starting Airtable Sync...');
      console.log(`Config: Base=${process.env.AIRTABLE_BASE_ID ? 'Set' : 'Missing'}, Key=${process.env.AIRTABLE_API_KEY ? 'Set' : 'Missing'}`);
      
      const airtableBase = getAirtableBase();
      // Check if participant exists
      console.log(`Searching for email: ${email} in table: ${PARTICIPANTS_TABLE}`);
      
      const records = await airtableBase(PARTICIPANTS_TABLE)
        .select({
          filterByFormula: `{Email} = '${email}'`,
          maxRecords: 1,
        })
        .firstPage();

      console.log(`Found ${records.length} existing records.`);

      if (records.length > 0) {
        // Update existing participant
        airtableRecordId = records[0].id;
        const updateFields: any = {};
        if (phone) updateFields['Phone'] = phone;
        if (name) updateFields['Full Name'] = name;
        
        // Only update if we have new info
        if (Object.keys(updateFields).length > 0) {
           console.log(`Updating record ${airtableRecordId} with fields:`, Object.keys(updateFields));
           await airtableBase(PARTICIPANTS_TABLE).update(airtableRecordId, updateFields);
        }
      } else {
        // Create new participant
        console.log('Creating new record...');
        
        // Generate custom ID and Date
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
        const participantId = `P-${timestamp}-${randomStr}`;
        const joinDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        const newRecord = await airtableBase(PARTICIPANTS_TABLE).create({
          'Email': email,
          'Phone': phone || '',
          'Full Name': name || email.split('@')[0],
          'Status': 'Registered',
          'Participant ID': participantId,
          'Join Date': joinDate,
        });
        airtableRecordId = newRecord.id;
        console.log(`Created record: ${airtableRecordId}`);
      }
    } catch (airtableError: any) {
      console.error('Airtable Sync Error Full Details:', JSON.stringify(airtableError, null, 2));
      console.error('Airtable Error Message:', airtableError.message);
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
