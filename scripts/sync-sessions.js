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

    if (!privateKey) {
        throw new Error("Missing Google Credentials: GOOGLE_PRIVATE_KEY is undefined");
    }

    console.log(`Raw Private Key Length: ${privateKey.length}`);

    // Robust handling for various input formats (JSON vs String, Escaped Newlines)
    if (privateKey.trim().startsWith('{')) {
        try {
            const keyJson = JSON.parse(privateKey);
            privateKey = keyJson.private_key;
            console.log("Parsed Private Key from JSON object.");
        } catch (e) {
            console.warn("Key looked like JSON but failed to parse, treating as string.");
        }
    }
    
    // Ensure we have the raw string key with correct newlines
    if (typeof privateKey === 'string') {
        // Remove surrounding quotes if they were accidentally included in the GitHub Secret
        privateKey = privateKey.trim().replace(/^"|"$/g, '');
        // Replace literal "\n" characters (common in CI/CD secrets) with actual newlines
        privateKey = privateKey.replace(/\\n/g, '\n');
    }

    // Safety Check: Log the start of the key to verify format (without leaking the secret)
    console.log(`Processed Key Start: ${privateKey.substring(0, 25)}...`);
    
    if (!clientEmail || !privateKey) {
        throw new Error("Missing Google Credentials (CLIENT_EMAIL or PRIVATE_KEY)");
    }

    const jwtClient = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: [
          'https://www.googleapis.com/auth/calendar.events.readonly',
          'https://www.googleapis.com/auth/drive' // Added Drive scope for folder creation
      ]
    });

    // Explicitly authorize to fail fast if creds are wrong
    await jwtClient.authorize();
    console.log('Successfully authorized Google Client');

    const calendar = google.calendar({ version: 'v3', auth: jwtClient });
    const drive = google.drive({ version: 'v3', auth: jwtClient }); // Initialize Drive Client
    
    // Fetch events from the last 30 days to 90 days in the future
    const timeMin = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    
    console.log(`Fetching events from Google Calendar (${CALENDAR_ID})...`);
    const response = await calendar.events.list({
      calendarId: CALENDAR_ID,
      timeMin: timeMin,
      singleEvents: true,
      orderBy: 'startTime',
      // q: 'AI Mastermind', // Removed filter to sync all events
      conferenceDataVersion: 1 // Request full conference data (Meet links)
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
        const programTrack = summary.toLowerCase().includes('full-day') ? 'Full-day' : 'Free 90-min';

        console.log(`Processing: ${summary} (${start})`);
        
        // Check if record exists in Airtable
        const existing = await base(SESSIONS_TABLE).select({
            filterByFormula: `{Google Event ID} = '${eventId}'`,
            maxRecords: 1
        }).firstPage();

        // Use full ISO strings for Airtable Date/Time fields to avoid parsing errors
        const startTime = start; 
        const endTime = event.end.dateTime || event.end.date;

        // Fields to use when CREATING a new record
        let createFields = {
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

        let driveFolderId = null;

        if (existing.length > 0) {
             const record = existing[0];
             driveFolderId = record.fields['Drive Folder ID'];

             // If Drive Folder ID is missing, create it now!
             if (!driveFolderId) {
                 console.log(`  [Drive] Folder missing for existing event. Creating...`);
                 try {
                     // 1. Create Main Folder
                     const folderName = `${start.split('T')[0]} - ${summary}`.replace(/[\/\\?%*:|"<>]/g, '-'); // Sanitize
                     const folderRes = await drive.files.create({
                         resource: {
                             name: folderName,
                             mimeType: 'application/vnd.google-apps.folder',
                         },
                         fields: 'id, webViewLink'
                     });
                     driveFolderId = folderRes.data.id;
                     console.log(`  [Drive] Created folder: ${folderName} (${driveFolderId})`);

                     // 2. Grant Permissions (Anyone with link can view)
                     await drive.permissions.create({
                         fileId: driveFolderId,
                         resource: { role: 'reader', type: 'anyone' }
                     });

                     // 3. Create 'public' subfolder
                     await drive.files.create({
                         resource: {
                             name: 'public',
                             mimeType: 'application/vnd.google-apps.folder',
                             parents: [driveFolderId]
                         },
                         fields: 'id'
                     });
                     console.log(`  [Drive] 'public' subfolder created.`);

                 } catch (err) {
                     console.error(`  [Drive] Error creating folder: ${err.message}`);
                 }
             }

             // Add Drive Folder ID to update fields if we just created it
             const updateFields = {
                'Google Event ID': eventId,
                'Session Date': start.split('T')[0],
                'Start Time': startTime,
                'End Time': endTime,
                'Meeting Link': meetingLink,
                'Program Track': programTrack,
                'Session Status': 'Upcoming'
             };
             
             if (driveFolderId) {
                 // @ts-ignore
                 updateFields['Drive Folder ID'] = driveFolderId;
             }

            console.log(`  Updating existing record ${record.id}...`);
            await base(SESSIONS_TABLE).update(record.id, updateFields);

        } else {
            // New Record Logic
            console.log(`  Creating new record...`);
            
            // Create Drive Folder for new event immediately
            try {
                 const folderName = `${start.split('T')[0]} - ${summary}`.replace(/[\/\\?%*:|"<>]/g, '-');
                 const folderRes = await drive.files.create({
                     resource: {
                         name: folderName,
                         mimeType: 'application/vnd.google-apps.folder',
                     },
                     fields: 'id'
                 });
                 driveFolderId = folderRes.data.id;
                 console.log(`  [Drive] Created folder for new event: ${driveFolderId}`);
                 
                 await drive.permissions.create({
                     fileId: driveFolderId,
                     resource: { role: 'reader', type: 'anyone' }
                 });

                 await drive.files.create({
                     resource: {
                         name: 'public',
                         mimeType: 'application/vnd.google-apps.folder',
                         parents: [driveFolderId]
                     },
                     fields: 'id'
                 });

                 if (driveFolderId) {
                    // @ts-ignore
                    createFields['Drive Folder ID'] = driveFolderId;
                 }

            } catch (err) {
                 console.error(`  [Drive] Error creating folder for new event: ${err.message}`);
            }

            await base(SESSIONS_TABLE).create([{ fields: createFields }]);
        }
    }

    console.log('Sync Complete.');
}

syncSessions().catch(err => {
    console.error('Sync Failed:', err);
    process.exit(1);
});
