const { google } = require('googleapis');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

async function searchByName() {
    const targets = ['3pq5hv11n1ub35619ct9ovfobs', 'v4l4r0bmi9qvnsddme8neurom0'];
    console.log(`Searching for folders: ${targets.join(', ')} globally...`);
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    const jwtClient = new google.auth.JWT({
        email: clientEmail,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    await jwtClient.authorize();
    const drive = google.drive({ version: 'v3', auth: jwtClient });

    for (const name of targets) {
        try {
            const res = await drive.files.list({
                q: `name = '${name}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
                fields: 'files(id, name, parents)',
                supportsAllDrives: true,
                includeItemsFromAllDrives: true,
            });

            console.log(`Results for '${name}':`);
            if (res.data.files.length) {
                res.data.files.forEach(f => {
                    console.log(`- FOUND: ${f.name} (ID: ${f.id}) Parents: ${f.parents ? f.parents.join(', ') : 'none'}`);
                });
            } else {
                console.log(`- NOT FOUND`);
            }
        } catch (e) {
            console.error(`Error searching for ${name}:`, e.message);
        }
    }
}

searchByName();
