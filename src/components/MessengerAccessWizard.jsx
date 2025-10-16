'use client';
import React, { useEffect, useMemo, useState } from "react";

/**
 * MessengerAccessWizard.jsx
 * A step-by-step UI that walks a client through connecting a Facebook Page
 * so your app can send/receive Messenger messages on their behalf.
 *
 * Back-end endpoints used (you created these already):
 *  - GET  /api/meta/oauth/start?scopes=...            → redirect to FB login
 *  - GET  /api/meta/session                            → reads short-lived user token from cookie
 *  - POST /api/meta/token/exchange { userAccessToken } → long-lived user token
 *  - GET  /api/meta/businesses                         → list businesses for the user
 *  - GET  /api/meta/pages[?businessId=...]            → list pages
 *  - POST /api/meta/pages/token { pageId }            → get page token + name (masked)
 *  - POST /api/meta/pages/subscribe { pageId, pageAccessToken }
 *  - GET  /api/meta/webhook/verify-status             → basic webhook health
 *  - POST /api/meta/test-message { pageId, psid, pageAccessToken }
 *  - POST /api/secure/save { pageId, pageName, pageTokenMasked, businessId }
 */

const STEPS = [
  "Welcome",
  "Login",
  "Choose Business",
  "Choose Page",
  "Subscribe Webhook",
  "Create Page Token",
  "Verify Webhook",
  "Send Test Message",
  "Save & Finish",
];

const Card = ({ title, children }) => (
  <div className="space-y-3">
    <h2 className="text-xl font-semibold">{title}</h2>
    <div className="rounded-2xl border bg-white p-4 shadow-sm">{children}</div>
  </div>
);

export default function MessengerAccessWizard() {
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  // Tokens
  const [userToken, setUserToken] = useState("");
  const [userTokenLL, setUserTokenLL] = useState("");
  const [pageAccessToken, setPageAccessToken] = useState("");

  // Business/Page
  const [businesses, setBusinesses] = useState([]);
  const [businessId, setBusinessId] = useState("");
  const [pages, setPages] = useState([]);
  const [pageId, setPageId] = useState("");
  const [pageName, setPageName] = useState("");

  // Webhook + test
  const [webhookSubscribed, setWebhookSubscribed] = useState(false);
  const [pageTokenMasked, setPageTokenMasked] = useState("");
  const [webhookVerified, setWebhookVerified] = useState(false);
  const [psid, setPsid] = useState("");
  const [testText, setTestText] = useState("Hello from your new Messenger integration! 👋");
  const [testSent, setTestSent] = useState(false);

  // Step gating
  const canNext = useMemo(() => {
    switch (step) {
      case 0: return true;
      case 1: return !!userToken;
      case 2: return businesses.length === 0 || !!(businessId || businessId === "");
      case 3: return !!pageId;
      case 4: return webhookSubscribed;
      case 5: return !!pageTokenMasked && !!pageAccessToken;
      case 6: return webhookVerified;
      case 7: return testSent;
      case 8: return true;
      default: return false;
    }
  }, [step, userToken, businesses.length, businessId, pageId, webhookSubscribed, pageTokenMasked, pageAccessToken, webhookVerified, testSent]);

  const next = () => canNext && setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  async function j(url, init) {
    const r = await fetch(url, init);
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d?.error || "Request failed");
    return d;
  }

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

  useEffect(() => {
    (async () => {
      try {
        const d = await j("/api/meta/session");
        if (d?.userAccessToken) setUserToken(d.userAccessToken);
      } catch {}
    })();
  }, []);

  const exchangeUserToken = async () => {
    setBusy(true); setErr("");
    try {
      const d = await j("/api/meta/token/exchange", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAccessToken: userToken }),
      });
      setUserTokenLL(d.longLivedUserToken || "");
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  };

  const loadBusinesses = async () => {
    setBusy(true); setErr("");
    try {
      const d = await j("/api/meta/businesses");
      setBusinesses(d.businesses || []);
      if ((d.businesses || []).length === 0) setBusinessId("");
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  };

  const loadPages = async () => {
    setBusy(true); setErr("");
    try {
      const url = businessId ? `/api/meta/pages?businessId=${businessId}` : "/api/meta/pages";
      const d = await j(url);
      setPages(d.pages || []);
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  };

  const subscribeWebhook = async () => {
    if (!pageId || !pageAccessToken) return;
    setBusy(true); setErr("");
    try {
      await j("/api/meta/pages/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId, pageAccessToken }),
      });
      setWebhookSubscribed(true);
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  };

  const createPageToken = async () => {
    if (!pageId) return;
    setBusy(true); setErr("");
    try {
      const d = await j("/api/meta/pages/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId }),
      });
      setPageTokenMasked(d.pageTokenMasked || "");
      setPageAccessToken(d.pageAccessToken || "");
      if (d.pageName) setPageName(d.pageName);
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  };

  const verifyWebhook = async () => {
    setBusy(true); setErr("");
    try {
      const d = await j(`/api/meta/webhook/verify-status`);
      setWebhookVerified(!!d?.status || !!d?.verified);
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  };

  const sendTest = async () => {
    if (!pageId || !psid || !pageAccessToken) return;
    setBusy(true); setErr("");
    try {
      await j("/api/meta/test-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId, psid, pageAccessToken, text: testText }),
      });
      setTestSent(true);
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  };

  const saveConnection = async () => {
    setBusy(true); setErr("");
    try {
      await j("/api/secure/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId, pageName, pageTokenMasked, businessId }),
      });
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Messenger Access Wizard</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Step {step + 1} of {STEPS.length}</span>
          <div className="h-2 w-40 overflow-hidden rounded-full bg-gray-100">
            <div className="h-2 bg-indigo-600 transition-all" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
          </div>
        </div>
      </header>

      {err && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{err}</div>}

      <div className="space-y-6">
        {step === 0 && (
          <Card title="Welcome">
            <p className="text-gray-700">Connect your Facebook Page in a few guided steps: login → choose business/page → subscribe webhook → generate page token → verify → send test → save.</p>
          </Card>
        )}

        {step === 1 && (
          <Card title="Login with Facebook">
            <div className="flex flex-wrap items-center gap-3">
              <button className="rounded-xl bg-indigo-600 px-4 py-2 text-white" onClick={beginOAuth}>Continue with Facebook</button>
              <button className="rounded-xl border px-4 py-2" onClick={exchangeUserToken} disabled={!userToken || busy}>Exchange for long‑lived user token</button>
            </div>
            {userToken && <p className="pt-2 text-xs text-green-700">Short‑lived token detected; you can exchange it now.</p>}
            {userTokenLL && <p className="pt-1 text-xs text-green-700">Long‑lived user token ready ✔</p>}
          </Card>
        )}

        {step === 2 && (
          <Card title="Choose Business (optional)">
            <div className="flex items-center gap-2">
              <button className="rounded-lg border px-3 py-2" onClick={loadBusinesses} disabled={busy}>Load Businesses</button>
              <select className="min-w-[16rem] rounded-lg border px-3 py-2" value={businessId} onChange={(e) => setBusinessId(e.target.value)}>
                <option value="">— No Business / Personal —</option>
                {businesses.map((b) => <option key={b.id} value={b.id}>{b.name} ({b.id})</option>)}
              </select>
            </div>
          </Card>
        )}

        {step === 3 && (
          <Card title="Choose Page">
            <div className="flex items-center gap-2">
              <button className="rounded-lg border px-3 py-2" onClick={loadPages} disabled={busy}>Load Pages</button>
              <select className="min-w-[20rem] rounded-lg border px-3 py-2" value={pageId} onChange={(e) => {
                const id = e.target.value; setPageId(id);
                const p = pages.find((x) => x.id === id); setPageName(p?.name || "");
              }}>
                <option value="">— Select a Page —</option>
                {pages.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}
              </select>
            </div>
            {pageName && <p className="pt-2 text-xs text-gray-600">Selected: <b>{pageName}</b></p>}
          </Card>
        )}

        {step === 4 && (
          <Card title="Subscribe Webhook">
            <p className="text-gray-700">Subscribe our app to your Page webhook so we can receive Messenger events.</p>
            <button className="mt-3 rounded-xl bg-indigo-600 px-4 py-2 text-white disabled:opacity-50" onClick={subscribeWebhook} disabled={!pageId || !pageAccessToken || busy}>Subscribe</button>
            {webhookSubscribed && <p className="pt-2 text-xs text-green-700">Webhook subscription successful ✔</p>}
          </Card>
        )}

        {step === 5 && (
          <Card title="Create Page Token">
            <p className="text-gray-700">We’ll request a Page access token and only show a masked preview here.</p>
            <button className="mt-3 rounded-xl bg-indigo-600 px-4 py-2 text-white disabled:opacity-50" onClick={createPageToken} disabled={!pageId || busy}>Create Page token</button>
            {pageTokenMasked && <p className="pt-2 text-xs text-green-700">Token: <span className="font-mono">{pageTokenMasked}</span> ✔</p>}
          </Card>
        )}

        {step === 6 && (
          <Card title="Verify Webhook">
            <p className="text-gray-700">Click to check your webhook health. In your Meta App settings, the Webhook URL should point to <code>/api/meta/webhook</code> and use the same verify token as your env.</p>
            <button className="mt-3 rounded-xl bg-indigo-600 px-4 py-2 text-white disabled:opacity-50" onClick={verifyWebhook} disabled={busy}>Check status</button>
            {webhookVerified && <p className="pt-2 text-xs text-green-700">Webhook verified ✔</p>}
          </Card>
        )}

        {step === 7 && (
          <Card title="Send Test Message">
            <div className="flex flex-col gap-3 max-w-xl">
              <input className="rounded-lg border px-3 py-2" placeholder="Recipient PSID" value={psid} onChange={(e) => setPsid(e.target.value)} />
              <textarea className="min-h-[80px] rounded-lg border px-3 py-2" value={testText} onChange={(e) => setTestText(e.target.value)} />
              <button className="rounded-xl bg-indigo-600 px-4 py-2 text-white disabled:opacity-50" onClick={sendTest} disabled={!pageId || !psid || !pageAccessToken || busy}>Send test</button>
              {testSent && <p className="text-xs text-green-700">Test message sent ✔</p>}
            </div>
          </Card>
        )}

        {step === 8 && (
          <Card title="Save & Finish">
            <p className="text-gray-700">Save the connection (masked token only). You can add more Pages later.</p>
            <button className="mt-3 rounded-xl bg-indigo-600 px-4 py-2 text-white disabled:opacity-50" onClick={saveConnection} disabled={!pageId || !pageTokenMasked || busy}>Save connection</button>
            <p className="pt-2 text-xs text-gray-600">Page: <b>{pageName || pageId}</b> {businessId ? `(Business: ${businessId})` : ""}</p>
          </Card>
        )}
      </div>

      <footer className="flex items-center justify-between pt-2">
        <button onClick={back} disabled={step === 0} className="rounded-xl border px-4 py-2 disabled:opacity-50">Back</button>
        <button onClick={next} disabled={!canNext} className="rounded-xl bg-black px-4 py-2 text-white disabled:opacity-50">{step === STEPS.length - 1 ? "Close" : "Next"}</button>
      </footer>

      <p className="pt-4 text-xs text-gray-500">Tip: In Development mode only app admins/developers/testers can use messaging. For production, request App Review for: pages_messaging, pages_manage_metadata, pages_show_list, pages_read_engagement.</p>
    </div>
  );
}
