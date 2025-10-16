// ============================================================================
// File: src/app/api/meta/pages/subscribe/route.ts
// Purpose: Subscribe a selected Facebook Page to your app's webhook so it can
//          receive Messenger events such as messages, postbacks, etc.
//
// Flow
// - Called after the user selects a Page.
// - Uses the Page ID and user access token to call the Graph API subscription endpoint.
// - Returns a confirmation JSON if the webhook subscription succeeds.
//
// Requirements
//   - Page access token (previously exchanged from user token)
//   - Permissions: pages_manage_metadata, pages_messaging
//   - Webhook must already be configured in your app dashboard
// ============================================================================
export const dynamic = "force-dynamic";

/**
 * POST /api/meta/pages/subscribe
 * Request Body: { pageId: string, pageAccessToken: string }
 * Response: { success: boolean, details?: any }
 */
export async function POST(req: Request) {
  try {
    const { pageId, pageAccessToken } = await req.json();

    // Validate input
    if (!pageId || !pageAccessToken) {
      return new Response(
        JSON.stringify({ error: "Missing required pageId or pageAccessToken" }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }

    // Facebook Graph API endpoint to subscribe app to Page webhook
    const graphUrl = `https://graph.facebook.com/v19.0/${pageId}/subscribed_apps`;

    const res = await fetch(graphUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subscribed_fields: ["messages", "messaging_postbacks", "messaging_optins"],
        access_token: pageAccessToken,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: data?.error || "Failed to subscribe page to webhook" }),
        { status: 502, headers: { "content-type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, details: data }),
      { status: 200, headers: { "content-type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || "Unexpected server error" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
