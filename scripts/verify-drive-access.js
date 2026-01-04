const { google } = require('googleapis');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

async function verifyDriveAccess() {
    console.log('Verifying Drive Access...');
    
    // 1. Try with the credentials in .env.local WITHOUT impersonation (acting as the Service Account)
    try {
        const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
        const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
        const folderId = "1Zmlqxwn2wLek1-0V36FHJTjzghEYv-Wr";

        console.log(`Using Credentials for: ${clientEmail}`);
        console.log(`Target Folder: ${folderId}`);

        const jwtClient = new google.auth.JWT({
            email: clientEmail,
            key: privateKey,
            scopes: ['https://www.googleapis.com/auth/drive.readonly'],
            // No subject line = Act as Service Account
        });

        await jwtClient.authorize();
        const drive = google.drive({ version: 'v3', auth: jwtClient });

        const res = await drive.files.list({
            q: `'${folderId}' in parents`,
            pageSize: 5,
            fields: 'files(id, name)',
        });

        console.log('--- Access Verification ---');
        if (res.data.files.length === 0) {
            console.log('✅ Connected, but folder is empty or contains no files matching query.');
        } else {
            console.log('✅ Success! Found files:');
            res.data.files.forEach(f => console.log(` - ${f.name} (${f.id})`));
        }
        
    } catch (error) {
        console.error('❌ Failed to access folder.');
        console.error('Error:', error.message);
        
        if (error.message.includes('Project 199373649190 is not found and cannot be used for API calls')) {
             console.log('\n💡 Tip: This might be a mismatch between the Service Account Project and the enabled APIs.');
        }
    }
}

verifyDriveAccess();
