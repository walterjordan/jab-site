const { google } = require('googleapis');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

async function listAllAccessible() {
    console.log('Listing all files accessible by the Service Account...');
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
            pageSize: 20,
            fields: 'files(id, name, mimeType, parents)',
            supportsAllDrives: true,
            includeItemsFromAllDrives: true,
        });

        console.log(`Found ${res.data.files.length} items total:`);
        res.data.files.forEach(f => {
            console.log(`- ${f.name} (${f.id}) [${f.mimeType}] Parents: ${f.parents ? f.parents.join(', ') : 'none'}`);
        });
    } catch (e) {
        console.error('Error:', e.message);
    }
}

listAllAccessible();
