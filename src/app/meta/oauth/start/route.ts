// ==============================================
// File: src/app/api/meta/oauth/callback/route.ts
// Purpose: Handle Facebook OAuth redirect and exchange code for user access token
// ==============================================
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error_reason");

  if (error) {
    return new Response(`OAuth failed: ${error}`, { status: 400 });
  }

  if (!code) {
    return new Response("Missing ?code in callback", { status: 400 });
  }

  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  const redirect = process.env.META_REDIRECT_URI;

  if (!appId || !appSecret || !redirect) {
    return new Response(JSON.stringify({ error: "Missing META_APP_ID, META_APP_SECRET, or META_REDIRECT_URI" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }

  try {
    const tokenRes = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${appId}&redirect_uri=${encodeURIComponent(
        redirect
      )}&client_secret=${appSecret}&code=${code}`
    );

    const data = await tokenRes.json();
    if (!tokenRes.ok) {
      return new Response(JSON.stringify({ error: data.error || "Failed to exchange token" }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }

    // Temporary cookie or redirect back to client-side app to finish flow
    const headers = new Headers();
    headers.set("Set-Cookie", `fb_user_token=${data.access_token}; Path=/; HttpOnly; Secure; SameSite=Lax`);

    // Redirect user back to your frontend wizard
    headers.set("Location", "/messenger-setup?granted=true");

    return new Response(null, { status: 302, headers });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
