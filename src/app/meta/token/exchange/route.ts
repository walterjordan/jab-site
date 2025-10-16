// ============================================================================
// File: src/app/api/meta/token/exchange/route.ts
// Purpose: Exchange a short-lived Facebook *user* access token for a
//          long-lived one (valid ~60 days). This allows you to avoid reauth
//          frequently. Used by the front-end wizard after login.
//
// Flow
// 1. User logs in via /oauth/start → /oauth/callback.
// 2. The callback route sets a cookie with the short-lived user token.
// 3. The front-end wizard calls this endpoint, passing that token in JSON body.
// 4. The route contacts Facebook Graph to exchange it for a long-lived token.
// 5. Returns: { longLivedUserToken }
//
// Env required
//   META_APP_ID     → Your Facebook App ID
//   META_APP_SECRET → Your Facebook App Secret
// ============================================================================
export const dynamic = "force-dynamic"; // ensure runtime execution per request

/**
 * POST /api/meta/token/exchange
 * Request body: { userAccessToken: string }
 * Response: { longLivedUserToken: string }
 */
export async function POST(req: Request) {
  try {
    const { userAccessToken } = await req.json();

    // Basic validation of input.
    if (!userAccessToken) {
      return new Response(
        JSON.stringify({ error: "Missing userAccessToken in request body" }),
        { status: 400, headers: { "content-type": "application/json" } }
      );
    }

    // Load secrets for API call.
    const appId = process.env.META_APP_ID;
    const appSecret = process.env.META_APP_SECRET;

    if (!appId || !appSecret) {
      return new Response(
        JSON.stringify({ error: "Missing META_APP_ID or META_APP_SECRET in env" }),
        { status: 500, headers: { "content-type": "application/json" } }
      );
    }

    // Facebook Graph endpoint for token exchange.
    const exchangeURL = `https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${userAccessToken}`;

    const res = await fetch(exchangeURL);
    const data = await res.json();

    if (!res.ok || !data?.access_token) {
      return new Response(
        JSON.stringify({ error: data?.error || "Failed to exchange token" }),
        { status: 502, headers: { "content-type": "application/json" } }
      );
    }

    // Return the long-lived token back to client wizard for secure storage.
    return new Response(
      JSON.stringify({ longLivedUserToken: data.access_token }),
      { status: 200, headers: { "content-type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || "Unexpected server error" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
