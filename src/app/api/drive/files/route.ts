import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export const dynamic = 'force-dynamic';

async function getDriveClient() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!clientEmail || !privateKey) {
    throw new Error("Missing Google Credentials");
  }

  const jwtClient = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });

  await jwtClient.authorize();
  return google.drive({ version: 'v3', auth: jwtClient });
}

// Helper to find a folder by name globally (since root might not be accessible)
async function findFolderByName(drive: any, name: string) {
  try {
    const res = await drive.files.list({
      q: `name = '${name}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: 'files(id, name, webViewLink)',
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });
    return res.data.files && res.data.files.length > 0 ? res.data.files[0] : null;
  } catch (error) {
    console.error(`Error finding folder ${name}:`, error);
    return null;
  }
}

// Helper to find subfolder by name inside a parent
async function findSubfolder(drive: any, parentId: string, name: string) {
  try {
    const res = await drive.files.list({
      q: `'${parentId}' in parents and mimeType = 'application/vnd.google-apps.folder' and (name = '${name}' or name = '${name}s') and trashed = false`,
      fields: 'files(id, name)',
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });
    return res.data.files && res.data.files.length > 0 ? res.data.files[0].id : null;
  } catch (error) {
    console.error(`Error finding subfolder ${name} in ${parentId}:`, error);
    return null;
  }
}

async function listImages(drive: any, folderId: string, searchterm?: string, limit: number = 10) {
  try {
    let query = `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`;
    if (searchterm) {
      query += ` and name contains '${searchterm}'`;
    }

    const res = await drive.files.list({
      q: query,
      pageSize: limit,
      fields: 'files(id, name, webViewLink, webContentLink, thumbnailLink)',
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });
    return res.data.files || [];
  } catch (error) {
    console.error(`Error listing images in ${folderId}:`, error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type'); // 'flyer' | 'highlights' | 'folder'
    const eventId = searchParams.get('eventId'); // The Google Event ID (folder name)

    if (!eventId) {
      return NextResponse.json({ error: "Missing eventId" }, { status: 400 });
    }

    const drive = await getDriveClient();

    // 1. Find the Event Folder by name (eventId)
    const eventFolder = await findFolderByName(drive, eventId);
    if (!eventFolder) {
      return NextResponse.json({ error: `Event folder '${eventId}' not found` }, { status: 404 });
    }
    const eventFolderId = eventFolder.id;

    if (type === 'folder') {
      return NextResponse.json({ 
        data: {
          id: eventFolder.id,
          name: eventFolder.name,
          webViewLink: eventFolder.webViewLink
        }
      });
    }

    if (type === 'flyer') {
      const flyerFolderId = await findSubfolder(drive, eventFolderId, 'flyer');
      if (!flyerFolderId) {
        return NextResponse.json({ error: "Flyer folder not found" }, { status: 404 });
      }
      
      let images = await listImages(drive, flyerFolderId, 'slot 2', 1);
      if (images.length === 0) {
         images = await listImages(drive, flyerFolderId, undefined, 1);
      }

      const flyer = images[0] ? {
        id: images[0].id,
        name: images[0].name,
        src: images[0].thumbnailLink?.replace(/=s\d+$/, '=s1200') || images[0].webContentLink
      } : null;

      return NextResponse.json({ data: flyer });

    } else if (type === 'highlights') {
      const publicFolderId = await findSubfolder(drive, eventFolderId, 'public');
      if (!publicFolderId) {
        return NextResponse.json({ error: "Public folder not found" }, { status: 404 });
      }

      const images = await listImages(drive, publicFolderId, 'highlight', 4);
      
      const mappedImages = images.map((img: any) => ({
        id: img.id,
        name: img.name,
        src: img.thumbnailLink?.replace(/=s\d+$/, '=s800') || img.webContentLink
      }));

      return NextResponse.json({ data: mappedImages });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });

  } catch (error: any) {
    console.error("Drive API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
