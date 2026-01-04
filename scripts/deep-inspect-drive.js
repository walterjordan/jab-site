const { google } = require('googleapis');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

async function deepInspect() {
    console.log('Deep Inspecting Folder...');
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const folderId = "1fJf3maC7AYUOQIbdQVd06CXPxua4evuH";

    const jwtClient = new google.auth.JWT({
        email: clientEmail,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    await jwtClient.authorize();
    const drive = google.drive({ version: 'v3', auth: jwtClient });

    // List ALL items in the folder, folders and files
    const res = await drive.files.list({
        q: `'${folderId}' in parents and trashed = false`,
        fields: 'files(id, name, mimeType)',
        supportsAllDrives: true,
        includeItemsFromAllDrives: true,
    });

    console.log(`Found ${res.data.files.length} items in root folder:`);
    res.data.files.forEach(f => {
        console.log(`[${f.mimeType === 'application/vnd.google-apps.folder' ? 'FOLDER' : 'FILE'}] ${f.name} (${f.id})`);
    });
}

deepInspect();
