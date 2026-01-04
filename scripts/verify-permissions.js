const { google } = require('googleapis');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

async function verifyPermissions() {
    console.log('Verifying Specific File Permissions...');
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const folderId = "1Zmlqxwn2wLek1-0V36FHJTjzghEYv-Wr";

    const jwtClient = new google.auth.JWT({
        email: clientEmail,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    await jwtClient.authorize();
    const drive = google.drive({ version: 'v3', auth: jwtClient });

    try {
        // Try to get metadata for the folder specifically
        const file = await drive.files.get({
            fileId: folderId,
            fields: 'id, name, permissions',
            supportsAllDrives: true,
        });

        console.log(`\nFolder Name: ${file.data.name}`);
        console.log(`Folder ID: ${file.data.id}`);
        console.log('\n--- Permissions ---');
        
        if (file.data.permissions) {
            file.data.permissions.forEach(p => {
                console.log(`- ${p.role}: ${p.emailAddress || p.type}`);
            });
        } else {
            console.log('No permissions returned (insufficient access to view permissions?)');
        }

    } catch (e) {
        console.error('FAILED to get folder metadata:');
        console.error(e.message);
    }
}

verifyPermissions();
