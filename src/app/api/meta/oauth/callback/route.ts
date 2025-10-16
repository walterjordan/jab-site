// ============================================================================
// File: src/app/api/meta/oauth/callback/route.ts
// Purpose: Handle Facebook's OAuth redirect, exchange the `code` for a
//          short‑lived *user* access token, set it in an HttpOnly cookie, and
//          redirect back to your front‑end wizard.
//
// Notes
// - The *user* token is needed to list Businesses/Pages the user manages.
// - Your front‑end wizard can then call /api/meta/token/exchange to swap this
//   short‑lived user token for a long‑lived one (optional but recommended).
// - We only store the token in an HttpOnly cookie; you should later move this
//   into a proper session store (iron-session/NextAuth) and/or exchange it for
//   a *Page* token server‑side when you know the chosen Page ID.
// - Set META_REDIRECT_URI in your .env to this callback route's absolute URL.
//
// Env required
//   META_APP_ID          → Your Meta App ID
//   META_APP_SECRET      → Your Meta App Secret
//   META_REDIRECT_URI    → Full URL to this callback route
//   POST_AUTH_REDIRECT   → (optional) Path to send the browser after success
//                          defaults to "/clients/connect-messenger"
// ============================================================================
export const dynamic = "force-dynamic"; // ensure this is evaluated per request

/**
 * GET /api/meta/oauth/callback
 * Facebook redirects here with `?code=...`. We exchange it for a user token.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);

  // If Facebook returns an error (user canceled, etc.), surface it nicely.
  const errorReason = url.searchParams.get("error_reason");
  const errorDesc = url.searchParams.get("error_description");
  if (errorReason) {
    return new Response(
      JSON.stringify({ error: `OAuth failed: ${errorReason}`, detail: errorDesc }),
      { status: 400, headers: { "content-type": "application/json" } }
    );
  }

  // The single‑use authorization code we must exchange for a token.
  const code = url.searchParams.get("code");
  if (!code) {
    return new Response(JSON.stringify({ error: "Missing ?code in callback" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  // Pull secrets from the environment (never hardcode these).
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  const redirect = process.env.META_REDIRECT_URI; // must exactly match the one set in the app settings
  const postAuthPath = process.env.POST_AUTH_REDIRECT || "/clients/connect-messenger";

  if (!appId || !appSecret || !redirect) {
    return new Response(
      JSON.stringify({ error: "Missing META_APP_ID, META_APP_SECRET, or META_REDIRECT_URI" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }

  // Exchange the code for a short‑lived *user* access token (1–2 hours typical)
  const tokenURL = new URL("https://graph.facebook.com/v19.0/oauth/access_token");
  tokenURL.searchParams.set("client_id", appId);
  tokenURL.searchParams.set("client_secret", appSecret);
  tokenURL.searchParams.set("redirect_uri", redirect);
  tokenURL.searchParams.set("code", code);

  try {
    const res = await fetch(tokenURL);
    const data = await res.json();

    if (!res.ok || !data?.access_token) {
      return new Response(
        JSON.stringify({ error: data?.error || "Failed to exchange token" }),
        { status: 500, headers: { "content-type": "application/json" } }
      );
    }

    // Write the short‑lived user token into an HttpOnly cookie for the wizard.
    // In production, prefer a real session store and avoid long‑term cookies.
    const headers = new Headers();
    headers.append(
      "Set-Cookie",
      [
        `fb_user_token=${encodeURIComponent(data.access_token)}`,
        "Path=/",
        "HttpOnly",
        "Secure",        // keep this even on HTTPS in production
        "SameSite=Lax",
        "Max-Age=3600",  // 1 hour; user can re‑run the wizard if needed
      ].join("; ")
    );

    // Send the user back to your front‑end wizard to continue.
    headers.set("Location", postAuthPath);
    return new Response(null, { status: 302, headers });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message || "Unknown error during token exchange" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
