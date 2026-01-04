const { google } = require('googleapis');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

async function checkTeamDrives() {
    console.log('Checking Team Drives...');
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    const jwtClient = new google.auth.JWT({
        email: clientEmail,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    await jwtClient.authorize();
    const drive = google.drive({ version: 'v3', auth: jwtClient });

    // 1. List Drives (Shared Drives)
    console.log('--- Shared Drives ---');
    try {
        const drives = await drive.drives.list({
            pageSize: 10,
        });
        if (drives.data.drives.length === 0) console.log('No Shared Drives found.');
        else drives.data.drives.forEach(d => console.log(`[DRIVE] ${d.name} (${d.id})`));
    } catch (e) {
        console.error('Error listing drives:', e.message);
    }
}

checkTeamDrives();
