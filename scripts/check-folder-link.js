const { google } = require('googleapis');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

async function checkFolderLink() {
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    const jwtClient = new google.auth.JWT({
        email: clientEmail,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    await jwtClient.authorize();
    const drive = google.drive({ version: 'v3', auth: jwtClient });

    // Search for the specific folder ID we were looking for earlier, or just any folder
    // The user mentioned "13IWLZXq6ezK9ZkIdnKeCaa46EdPmipMz" as the old one. 
    const folderId = "13IWLZXq6ezK9ZkIdnKeCaa46EdPmipMz"; 

    try {
        const res = await drive.files.get({
            fileId: folderId,
            fields: 'id, name, webViewLink'
        });
        console.log('Folder Metadata:', res.data);
    } catch (e) {
        console.error('Error:', e.message);
    }
}

checkFolderLink();
