import React, { useEffect, useMemo, useState } from "react";

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

  const [userToken, setUserToken] = useState("");
  const [userTokenLL, setUserTokenLL] = useState("");
  const [pageAccessToken, setPageAccessToken] = useState("");

  const [businesses, setBusinesses] = useState([]);
  const [businessId, setBusinessId] = useState("");
  const [pages, setPages] = useState([]);
  const [pageId, setPageId] = useState("");
  const [pageName, setPageName] = useState("");

  const [webhookSubscribed, setWebhookSubscribed] = useState(false);
  const [pageTokenMasked, setPageTokenMasked] = useState("");
  const [webhookVerified, setWebhookVerified] = useState(false);
  const [psid, setPsid] = useState("");
  const [testText, setTestText] = useState("Hello from your new Messenger integration! 👋");
  const [testSent, setTestSent] = useState(false);

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
        {/* Steps omitted for brevity */}
      </div>

      <footer className="flex items-center justify-between pt-2">
        <button onClick={back} disabled={step === 0} className="rounded-xl border px-4 py-2 disabled:opacity-50">Back</button>
        <button onClick={next} disabled={!canNext} className="rounded-xl bg-purple-600 px-4 py-2 text-white disabled:opacity-50">{step === STEPS.length - 1 ? "Close" : "Next"}</button>
      </footer>

      <p className="pt-4 text-xs text-gray-500">Tip: In Development mode only app admins/developers/testers can use messaging. For production, request App Review for: pages_messaging, pages_manage_metadata, pages_show_list, pages_read_engagement.</p>
    </div>
  );
}

