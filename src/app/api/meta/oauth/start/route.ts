import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * MessengerAccessWizard (client component only)
 * ---------------------------------------------------------
 * This file now contains ONLY the React UI. All API route code
 * must live in separate files under /src/app/api/... in your
 * Next.js app (see the list at the bottom of this comment).
 *
 * Create these server files separately (one per route):
 *   - src/app/api/meta/oauth/start/route.ts
 *   - src/app/api/meta/oauth/callback/route.ts
 *   - src/app/api/meta/session/route.ts
 *   - src/app/api/meta/token/exchange/route.ts
 *   - src/app/api/meta/businesses/route.ts
 *   - src/app/api/meta/pages/route.ts
 *   - src/app/api/meta/pages/subscribe/route.ts
 *   - src/app/api/meta/pages/token/route.ts
 *   - src/app/api/meta/webhook/route.ts
 *   - src/app/api/meta/webhook/verify-status/route.ts
 *   - src/app/api/meta/test-message/route.ts
 *   - src/app/api/secure/save/route.ts
 *
 * IMPORTANT: Your Meta App settings should include
 *   - OAuth Redirect: https://YOUR_DOMAIN/api/meta/oauth/callback
 *   - Webhook URL:    https://YOUR_DOMAIN/api/meta/webhook
 *   - Verify Token:   wow_verify_token (or your chosen value)
 */

const STEPS = [
  "Welcome",
  "Login with Facebook",
  "Pick Business",
  "Pick Page",
  "Subscribe Webhook",
  "Generate Page Token",
  "Verify Webhook",
  "Send Test Message",
  "Save & Finish",
];

const Section = ({ title, children }) => (
  <div className="space-y-3">
    <h2 className="text-xl font-semibold">{title}</h2>
    <div className="rounded-2xl border p-4 shadow-sm bg-white">{children}</div>
  </div>
);

const Info = ({ children }) => (
  <div className="text-sm text-gray-600 leading-relaxed">{children}</div>
);

const Divider = () => <div className="h-px bg-gray-200 my-4" />;

export default function MessengerAccessWizard() {
  const [active, setActive] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  // OAuth & tokens
  const [userToken, setUserToken] = useState(null);
  const [userTokenLL, setUserTokenLL] = useState(null);

  // Business & page selection
  const [businesses, setBusinesses] = useState([]);
  const [businessId, setBusinessId] = useState("");
  const [pages, setPages] = useState([]);
  const [pageId, setPageId] = useState("");
  const [pageName, setPageName] = useState("");

  // Webhook + page token
  const [webhookSubscribed, setWebhookSubscribed] = useState(false);
  const [pageTokenMasked, setPageTokenMasked] = useState("");
  const [webhookVerified, setWebhookVerified] = useState(false);

  // Test message
  const [psid, setPsid] = useState("");
  const [testText, setTestText] = useState("Hello from your new Messenger integration! 👋");
  const [testSent, setTestSent] = useState(false);

  const canNext = useMemo(() => {
    switch (active) {
      case 0:
        return true; // welcome
      case 1:
        return !!userToken; // after OAuth
      case 2:
        return !!businessId || businesses.length === 0; // business chosen or no business context
      case 3:
        return !!pageId;
      case 4:
        return webhookSubscribed;
      case 5:
        return !!pageTokenMasked;
      case 6:
        return webhookVerified;
      case 7:
        return testSent;
      case 8:
        return true;
      default:
        return false;
    }
  }, [active, userToken, businessId, businesses.length, pageId, webhookSubscribed, pageTokenMasked, webhookVerified, testSent]);

  const next = async () => {
    if (!canNext) return;
    setActive((a) => Math.min(a + 1, STEPS.length - 1));
  };
  const back = () => setActive((a) => Math.max(a - 1, 0));

  // 1) Start OAuth (server handles redirect+callback exchange)
  const beginOAuth = () => {
    const scopes = [
      "pages_show_list",
      "pages_manage_metadata",
      "pages_read_engagement",
      "pages_messaging",
      "business_management",
    ].join(",");
    window.location.href = `/api/meta/oauth/start?scopes=${encodeURIComponent(scopes)}`;
  };

  // On mount, check if server dropped a short-lived user token in session (after callback)
  useEffect(() => {
    const fetchUserToken = async () => {
      try {
        const r = await fetch("/api/meta/session");
        if (!r.ok) return;
        const data = await r.json();
        if (data?.userAccessToken) setUserToken(data.userAccessToken);
      } catch (e) {}
    };
    fetchUserToken();
  }, []);

  // 2) Exchange for long-lived user token
  const exchangeToken = async () => {
    if (!userToken) return;
    setBusy(true); setError(null);
    try {
      const r = await fetch("/api/meta/token/exchange", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAccessToken: userToken }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "Failed to exchange token");
      setUserTokenLL(data.longLivedUserToken);
    } catch (e) {
      setError(e.message);
    } finally { setBusy(false); }
  };

  // 3) Load businesses the user can manage
  const loadBusinesses = async () => {
    setBusy(true); setError(null);
    try {
      const r = await fetch("/api/meta/businesses");
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "Failed to load businesses");
      setBusinesses(data.businesses || []);
      if ((data.businesses || []).length === 0) setBusinessId("");
    } catch (e) {
      setError(e.message);
    } finally { setBusy(false); }
  };

  // 4) Load pages for selected business (or all pages from /me/accounts when none)
  const loadPages = async () => {
    if (busy) return;
    setBusy(true); setError(null);
    try {
      const url = businessId ? `/api/meta/pages?businessId=${businessId}` : "/api/meta/pages";
      const r = await fetch(url);
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "Failed to load pages");
      setPages(data.pages || []);
    } catch (e) {
      setError(e.message);
    } finally { setBusy(false); }
  };

  // 5) Subscribe app to page webhooks
  const subscribeWebhook = async () => {
    if (!pageId) return;
    setBusy(true); setError(null);
    try {
      const r = await fetch("/api/meta/pages/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId, fields: ["messages", "messaging_postbacks", "messaging_optins"] }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "Subscription failed");
      setWebhookSubscribed(true);
    } catch (e) {
      setError(e.message);
    } finally { setBusy(false); }
  };

  // 6) Generate long-lived Page access token
  const createPageToken = async () => {
    if (!pageId) return;
    setBusy(true); setError(null);
    try {
      const r = await fetch("/api/meta/pages/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "Could not get Page token");
      setPageTokenMasked(data.pageTokenMasked || "•••• •••• ••••");
    } catch (e) {
      setError(e.message);
    } finally { setBusy(false); }
  };

  // 7) Verify webhook handshake (server should track last verify timestamp)
  const checkWebhook = async () => {
    setBusy(true); setError(null);
    try {
      const r = await fetch(`/api/meta/webhook/verify-status?pageId=${pageId}`);
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "Webhook not verified yet");
      setWebhookVerified(!!data.verified);
    } catch (e) {
      setError(e.message);
    } finally { setBusy(false); }
  };

  // 8) Send a test message (requires a PSID; obtain by having the user DM the Page first)
  const sendTestMessage = async () => {
    if (!pageId || !psid) return;
    setBusy(true); setError(null);
    try {
      const r = await fetch("/api/meta/test-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId, psid, text: testText }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "Failed to send message");
      setTestSent(true);
    } catch (e) {
      setError(e.message);
    } finally { setBusy(false); }
  };

  // 9) Save & Finish
  const saveAndFinish = async () => {
    setBusy(true); setError(null);
    try {
      const r = await fetch("/api/secure/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId, pageName, pageTokenMasked, businessId }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || "Failed to save");
      // noop
    } catch (e) {
      setError(e.message);
    } finally { setBusy(false); }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Messenger Access Wizard</h1>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">Step {active + 1} of {STEPS.length}</div>
          <div className="w-40 bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="h-2 bg-indigo-500 transition-all"
              style={{ width: `${((active + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </header>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="space-y-6"
        >
          {active === 0 && (
            <Section title="Welcome">
              <Info>
                This guided setup helps you connect a Facebook Page so we can send Messenger messages on your behalf. You’ll:
                <ul className="list-disc ml-6 mt-2">
                  <li>Sign in with Facebook and grant the minimum required permissions.</li>
                  <li>Pick your Business and Page.</li>
                  <li>Subscribe our app to your Page webhooks.</li>
                  <li>Generate a secure, long‑lived Page access token.</li>
                  <li>Verify the webhook and send a test message.</li>
                </ul>
              </Info>
            </Section>
          )}

          {active === 1 && (
            <Section title="Login with Facebook">
              <Info>
                You’ll be redirected to Facebook to approve permissions. You must be an <b>admin</b> on the Page.
              </Info>
              <Divider />
              <div className="flex items-center gap-3">
                <button onClick={beginOAuth} className="px-4 py-2 rounded-xl bg-indigo-600 text-white disabled:opacity-50">
                  Continue with Facebook
                </button>
                <button
                  onClick={exchangeToken}
                  disabled={!userToken || busy}
                  className="px-4 py-2 rounded-xl border"
                >
                  Exchange for long‑lived token
                </button>
              </div>
              {userToken && <p className="text-xs text-green-700 mt-2">Short‑lived user token detected. You can exchange it now.</p>}
              {userTokenLL && <p className="text-xs text-green-700 mt-2">Long‑lived user token ready ✔</p>}
            </Section>
          )}

          {active === 2 && (
            <Section title="Pick Business (optional)">
              <Info>
                If your Page is owned by a Business Manager, choose it; otherwise, skip and we’ll show your personal Pages.
              </Info>
              <Divider />
              <div className="flex items-center gap-2">
                <button onClick={loadBusinesses} className="px-3 py-2 rounded-lg border">Load Businesses</button>
                <select
                  className="px-3 py-2 rounded-lg border min-w-[16rem]"
                  value={businessId}
                  onChange={(e) => setBusinessId(e.target.value)}
                >
                  <option value="">— No Business / Personal —</option>
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>{b.name} ({b.id})</option>
                  ))}
                </select>
              </div>
              {businesses.length > 0 && (
                <p className="text-xs text-gray-600 mt-2">Selected: {businessId || "None"}</p>
              )}
            </Section>
          )}

          {active === 3 && (
            <Section title="Pick Page">
              <Info>
                We’ll request the Pages you can manage. Select the Page to connect.
              </Info>
              <Divider />
              <div className="flex items-center gap-2">
                <button onClick={loadPages} className="px-3 py-2 rounded-lg border">Load Pages</button>
                <select
                  className="px-3 py-2 rounded-lg border min-w-[20rem]"
                  value={pageId}
                  onChange={(e) => {
                    const pid = e.target.value;
                    setPageId(pid);
                    const found = pages.find((p) => p.id === pid);
                    setPageName(found?.name || "");
                  }}
                >
                  <option value="">— Select a Page —</option>
                  {pages.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                  ))}
                </select>
              </div>
              {pageName && <p className="text-xs text-gray-600 mt-2">Selected: <b>{pageName}</b></p>}
            </Section>
          )}

          {active === 4 && (
            <Section title="Subscribe Webhook">
              <Info>
                We’ll subscribe our app to this Page’s webhook so we can receive messages, postbacks, and opt‑ins.
              </Info>
              <Divider />
              <button onClick={subscribeWebhook} disabled={!pageId || busy} className="px-4 py-2 rounded-xl bg-indigo-600 text-white disabled:opacity-50">
                Subscribe to Page events
              </button>
              {webhookSubscribed && <p className="text-xs text-green-700 mt-2">Webhook subscription successful ✔</p>}
            </Section>
          )}

          {active === 5 && (
            <Section title="Generate Page Token">
              <Info>
                We’ll create a long‑lived Page access token (stored securely on the server). Only a masked preview is shown here.
              </Info>
              <Divider />
              <button onClick={createPageToken} disabled={!pageId || busy} className="px-4 py-2 rounded-xl bg-indigo-600 text-white disabled:opacity-50">
                Create Page token
              </button>
              {pageTokenMasked && (
                <p className="text-xs text-green-700 mt-2">Page token: <span className="font-mono">{pageTokenMasked}</span> ✔</p>
              )}
            </Section>
          )}

          {active === 6 && (
            <Section title="Verify Webhook">
              <Info>
                Your server should expose a webhook endpoint (e.g., <code>/api/meta/webhook</code>) with the FB verify token. Click below once it’s reachable.
              </Info>
              <Divider />
              <button onClick={checkWebhook} disabled={!pageId || busy} className="px-4 py-2 rounded-xl bg-indigo-600 text-white disabled:opacity-50">
                Check verification status
              </button>
              {webhookVerified && <p className="text-xs text-green-700 mt-2">Webhook verified ✔</p>}
            </Section>
          )}

          {active === 7 && (
            <Section title="Send Test Message">
              <Info>
                Ask someone to open <b>m.me/{pageName || pageId}</b> and send a DM first. Your webhook should capture their <b>PSID</b>. Paste that PSID and send a test message.
              </Info>
              <Divider />
              <div className="flex flex-col gap-3 max-w-xl">
                <input
                  className="px-3 py-2 rounded-lg border"
                  placeholder="Recipient PSID"
                  value={psid}
                  onChange={(e) => setPsid(e.target.value)}
                />
                <textarea
                  className="px-3 py-2 rounded-lg border min-h-[80px]"
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                />
                <button onClick={sendTestMessage} disabled={!pageId || !psid || busy} className="px-4 py-2 rounded-xl bg-indigo-600 text-white disabled:opacity-50">
                  Send test message
                </button>
                {testSent && <p className="text-xs text-green-700">Test message sent ✔</p>}
              </div>
            </Section>
          )}

          {active === 8 && (
            <Section title="Save & Finish">
              <Info>
                We’ll store the Page connection securely. You can revisit this wizard anytime to add more Pages.
              </Info>
              <Divider />
              <button onClick={saveAndFinish} disabled={!pageId || !pageTokenMasked || busy} className="px-4 py-2 rounded-xl bg-indigo-600 text-white disabled:opacity-50">
                Save connection
              </button>
              <p className="text-xs text-gray-600 mt-2">Page: <b>{pageName || pageId}</b> {businessId ? `(Business: ${businessId})` : ""}</p>
            </Section>
          )}
        </motion.div>
      </AnimatePresence>

      <footer className="flex items-center justify-between pt-2">
        <button onClick={back} disabled={active === 0} className="px-4 py-2 rounded-xl border disabled:opacity-50">Back</button>
        <button onClick={next} disabled={!canNext} className="px-4 py-2 rounded-xl bg-black text-white disabled:opacity-50">{active === STEPS.length - 1 ? "Close" : "Next"}</button>
      </footer>

      <div className="text-xs text-gray-500 pt-4">
        Tip: In Development mode, only app admins/developers/testers can use messaging. For production, request App Review for required permissions and switch the app to Live.
      </div>
    </div>
  );
}


// ==============================================
// File: src/app/api/meta/oauth/start/route.ts
// Purpose: Redirect user to Facebook OAuth dialog
// ==============================================
export const dynamic = "force-dynamic"; // ensure this runs at request time

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  // You can pass custom scopes from the client; otherwise we use a sane default
  const scopes = searchParams.get("scopes") || [
    "pages_show_list",
    "pages_manage_metadata",
    "pages_read_engagement",
    "pages_messaging",
    "business_management",
  ].join(",");

  const appId = process.env.META_APP_ID;
  const redirect = process.env.META_REDIRECT_URI; // e.g. https://jordanborden.com/api/meta/oauth/callback

  if (!appId || !redirect) {
    return new Response(
      JSON.stringify({ error: "Server missing META_APP_ID or META_REDIRECT_URI" }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }

  const state = Math.random().toString(36).slice(2);
  const auth = new URL("https://www.facebook.com/v19.0/dialog/oauth");
  auth.searchParams.set("client_id", appId);
  auth.searchParams.set("redirect_uri", redirect);
  auth.searchParams.set("scope", scopes);
  auth.searchParams.set("response_type", "code");
  auth.searchParams.set("state", state);

  return Response.redirect(auth.toString(), 302);
}
