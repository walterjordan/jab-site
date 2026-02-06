const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

async function createFolderAndPermissions() {
    console.log('Testing Drive Creation Permissions...');
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    const jwtClient = new google.auth.JWT({
        email: clientEmail,
        key: privateKey,
        scopes: ['https://www.googleapis.com/auth/drive'], // Full scope
    });

    await jwtClient.authorize();
    const drive = google.drive({ version: 'v3', auth: jwtClient });

    try {
        // 1. Create a Folder
        const folderName = `Test Folder ${Date.now()}`;
        console.log(`Creating folder: ${folderName}`);
        
        const folderRes = await drive.files.create({
            resource: {
                name: folderName,
                mimeType: 'application/vnd.google-apps.folder',
                // parent: [ROOT_FOLDER_ID] // Optional: If we want to nest it
            },
            fields: 'id, webViewLink'
        });

        const folderId = folderRes.data.id;
        console.log(`Folder Created: ${folderId}`);
        console.log(`Link: ${folderRes.data.webViewLink}`);

        // 2. Grant "Public" (anyone with link) Access? 
        // Or just Service Account access? 
        // Usually, we want the USER to be able to see it.
        // We can share it with a specific email if we knew it, or make it "anyone with link".
        
        console.log('Granting "reader" permission to anyone with link...');
        await drive.permissions.create({
            fileId: folderId,
            resource: {
                role: 'reader',
                type: 'anyone'
            }
        });
        console.log('Permissions updated.');

        // 3. Create Subfolder
        console.log('Creating "public" subfolder...');
        const subRes = await drive.files.create({
            resource: {
                name: 'public',
                mimeType: 'application/vnd.google-apps.folder',
                parents: [folderId]
            },
            fields: 'id'
        });
        console.log(`Subfolder Created: ${subRes.data.id}`);

        // Cleanup
        console.log('Deleting test folder...');
        await drive.files.delete({ fileId: folderId });
        console.log('Test complete.');

    } catch (e) {
        console.error('Error:', e.message);
    }
}

createFolderAndPermissions();
