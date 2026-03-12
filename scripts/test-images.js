const { google } = require('googleapis');
require('dotenv').config({ path: '.env.local' });

async function test() {
  const jwtClient = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });
  await jwtClient.authorize();
  const drive = google.drive({ version: 'v3', auth: jwtClient });
  const res = await drive.files.list({
    q: "'13IWLZXq6ezK9ZkIdnKeCaa46EdPmipMz' in parents",
    fields: 'files(id, name, webViewLink, webContentLink, thumbnailLink)',
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });
  console.log(JSON.stringify(res.data.files, null, 2));
}

test().catch(console.error);
