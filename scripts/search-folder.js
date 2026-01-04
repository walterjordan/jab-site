const { google } = require('googleapis');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

async function searchByName() {
    console.log('Searching for folder "3pq5hv11n1ub35619ct9ovfobs" globally...');
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    const jwtClient = new google.auth.JWT({
        email: clientEmail,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    await jwtClient.authorize();
    const drive = google.drive({ version: 'v3', auth: jwtClient });

    try {
        const res = await drive.files.list({
            q: "name = '3pq5hv11n1ub35619ct9ovfobs' and mimeType = 'application/vnd.google-apps.folder' and trashed = false",
            fields: 'files(id, name, parents)',
            supportsAllDrives: true,
            includeItemsFromAllDrives: true,
        });

        console.log(`Found ${res.data.files.length} folders:`);
        res.data.files.forEach(f => {
            console.log(`- ${f.name} (${f.id}) Parents: ${f.parents ? f.parents.join(', ') : 'none'}`);
        });
    } catch (e) {
        console.error('Error:', e.message);
    }
}

searchByName();
