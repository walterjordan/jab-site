const { google } = require('googleapis');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

async function inspectDriveFolder() {
    console.log('Authenticating with Google Drive...');
    
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const folderId = "1Zmlqxwn2wLek1-0V36FHJTjzghEYv-Wr"; // The folder from events.md

    if (!clientEmail || !privateKey) {
        console.error('Missing credentials in .env.local');
        return;
    }

    const jwtClient = new google.auth.JWT({
        email: clientEmail,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    await jwtClient.authorize();
    const drive = google.drive({ version: 'v3', auth: jwtClient });

    console.log(`Listing contents of folder: ${folderId}`);

    try {
        const res = await drive.files.list({
            q: `'${folderId}' in parents and trashed = false`,
            fields: 'files(id, name, mimeType, webViewLink, thumbnailLink)',
        });

        const files = res.data.files;
        if (files.length) {
            console.log('Files found:');
            files.forEach((file) => {
                console.log(`- [${file.mimeType}] ${file.name} (${file.id})`);
            });
        } else {
            console.log('No files found.');
        }
    } catch (err) {
        console.error('The API returned an error: ' + err);
    }
}

inspectDriveFolder();
