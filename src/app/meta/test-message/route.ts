// ============================================================================
// File: src/app/api/meta/test-message/route.ts
// Purpose: Allows your app to send a **test message** via Messenger API to
//          verify that the Page token and webhook subscription work correctly.
//
// Typical Use Case
//   - Triggered after connecting a Page successfully.
//   - Confirms that the Page access token is valid and Messenger permissions
//     are properly configured.
//
// Endpoint
//   POST /api/meta/test-message
//   Body: { pageId: string, psid: string, pageAccessToken: string }
//   Response: { success: boolean, messageId?: string, error?: string }
//
// Requirements
//   - Page token with `pages_messaging` permission
//   - The user (PSID) must have previously messaged the Page (for privacy)
// ============================================================================
export const dynamic = "force-dynamic";

/**
 * POST /api/meta/test-message
 * Sends a simple text message via the Messenger Send API.
 */
export async function POST(req: Request) {
  try {
    const { pageId, psid, pageAccessToken } = await req.json();

    // Basic validation
    if (!pageId || !psid || !pageAccessToken) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: pageId, psid, or pageAccessToken" }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }

    // Construct the Messenger Send API request
    const sendUrl = `https://graph.facebook.com/v19.0/${pageId}/messages`;
    const body = {
      recipient: { id: psid },
      message: { text: "✅ Test successful! Your Messenger integration is live." },
    };

    const res = await fetch(`${sendUrl}?access_token=${pageAccessToken}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      return new Response(
        JSON.stringify({ success: false, error: data.error || "Failed to send test message" }),
        { status: 502, headers: { "content-type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, messageId: data.message_id }),
      { status: 200, headers: { "content-type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err?.message || "Unexpected error" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
