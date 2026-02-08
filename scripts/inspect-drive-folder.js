const { google } = require('googleapis');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

async function inspectDriveFolder() {
    console.log('Authenticating with Google Drive...');
    
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const folderIds = [
        "1Boqxd8wxCf5_Gxn07Vpwgq6l9FJ3DBnX", // Jan 3 'public' from Airtable folder
        "10DVrq4xE73E9X8eBTYArSvZ3TYnTDqqN"  // Jan 17 'public' from Airtable folder
    ];

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

    for (const folderId of folderIds) {
        console.log(`\nListing contents of folder: ${folderId}`);
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
}

inspectDriveFolder();
