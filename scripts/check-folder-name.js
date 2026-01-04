const { google } = require('googleapis');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

async function checkFolder() {
    const driveId = "1Zmlqxwn2wLek1-0V36FHJTjzghEYv-Wr";
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
        const res = await drive.files.get({
            fileId: driveId,
            fields: 'id, name, parents',
            supportsAllDrives: true,
        });
        console.log(`Folder Name: ${res.data.name} (${res.data.id})`);
        console.log(`Parents: ${res.data.parents ? res.data.parents.join(', ') : 'none'}`);
    } catch (e) {
        console.error('Error:', e.message);
    }
}

checkFolder();
