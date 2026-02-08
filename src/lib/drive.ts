import { google } from 'googleapis';

export type DriveImage = {
  id: string;
  name: string;
  src: string;
};

export type EventDriveData = {
  flyer: DriveImage | null;
  highlights: DriveImage[];
  folderLink: string | null;
};

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

// Helper to find a folder by ID
async function findFolderById(drive: any, folderId: string) {
  try {
    const res = await drive.files.get({
      fileId: folderId,
      fields: 'id, name, webViewLink',
      supportsAllDrives: true,
    });
    return res.data;
  } catch (error) {
    console.error(`Error finding folder by ID ${folderId}:`, error);
    return null;
  }
}

// Helper to find a folder by name globally
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

async function processEventFolder(drive: any, eventFolderId: string) {
    const data: { flyer: DriveImage | null, highlights: DriveImage[] } = { flyer: null, highlights: [] };

    // Flyer logic
    const flyerFolderId = await findSubfolder(drive, eventFolderId, 'flyer');
    if (flyerFolderId) {
      let images = await listImages(drive, flyerFolderId, 'slot 2', 1);
      if (images.length === 0) {
        images = await listImages(drive, flyerFolderId, undefined, 1);
      }
      if (images[0]) {
        data.flyer = {
          id: images[0].id,
          name: images[0].name,
          src: images[0].thumbnailLink?.replace(/=s\d+$/, '=s1200') || images[0].webContentLink
        };
      }
    }

    // Highlights logic
    const publicFolderId = await findSubfolder(drive, eventFolderId, 'public');
    if (publicFolderId) {
      const images = await listImages(drive, publicFolderId, 'highlight', 4);
      data.highlights = images.map((img: any) => ({
        id: img.id,
        name: img.name,
        src: img.thumbnailLink?.replace(/=s\d+$/, '=s800') || img.webContentLink
      }));
    }
    return data;
}

export async function getEventImages(eventId: string, folderId?: string): Promise<EventDriveData> {
  const result: EventDriveData = {
    flyer: null,
    highlights: [],
    folderLink: null
  };

  if (!eventId && !folderId) return result;

  try {
    const drive = await getDriveClient();

    // 1. Find the Event Folder
    let eventFolder = null;
    // Prefer ID if provided
    if (folderId) {
      eventFolder = await findFolderById(drive, folderId);
    } 
    
    // If no ID or ID failed, try name
    if (!eventFolder && eventId) {
      eventFolder = await findFolderByName(drive, eventId);
    }

    if (!eventFolder) return result;

    // 2. Process contents
    let folderData = await processEventFolder(drive, eventFolder.id);

    // 3. Fallback: If no highlights found, and we used a specific folderId, try finding by name as backup
    // This handles cases where Airtable has a stale/wrong ID but the correct folder exists by name.
    if (folderData.highlights.length === 0 && folderId && eventId) {
        const fallbackFolder = await findFolderByName(drive, eventId);
        if (fallbackFolder && fallbackFolder.id !== eventFolder.id) {
            console.log(`Fallback: Found alternative folder for ${eventId} by name: ${fallbackFolder.id}`);
            const fallbackData = await processEventFolder(drive, fallbackFolder.id);
            if (fallbackData.highlights.length > 0) {
                folderData = fallbackData;
                eventFolder = fallbackFolder; // Update reference so link is correct
            }
        }
    }

    result.flyer = folderData.flyer;
    result.highlights = folderData.highlights;
    result.folderLink = eventFolder.webViewLink;

  } catch (error) {
    console.error("Error in getEventImages:", error);
  }

  return result;
}
