"use client";

import { useState } from "react";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionTitle: string;
  sessionDate: string;
  eventId: string;
  onSuccess?: () => void;
}

export default function RegistrationModal({
  isOpen,
  onClose,
  sessionTitle,
  sessionDate,
  eventId,
  onSuccess,
}: RegistrationModalProps) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/calendar/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, email, phone, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div 
        className="absolute inset-0 bg-slate-950/80" 
        onClick={onClose} 
        aria-hidden="true"
      />
      
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl">
        {/* Header Gradient */}
        <div className="absolute inset-0 h-32 bg-gradient-to-br from-[#010e63]/50 via-[#630183]/30 to-transparent" />

        <div className="relative p-6">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>

          {!success ? (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white">Secure Your Spot</h2>
                <p className="mt-1 text-sm text-slate-300">
                  {sessionTitle} <br />
                  <span className="text-[#7fff41]">{sessionDate}</span>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="mb-1 block text-xs font-medium text-slate-400">
                    Full Name (Optional)
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-[#7fff41] focus:outline-none focus:ring-1 focus:ring-[#7fff41]"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-1 block text-xs font-medium text-slate-400">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-[#7fff41] focus:outline-none focus:ring-1 focus:ring-[#7fff41]"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="mb-1 block text-xs font-medium text-slate-400">
                    Phone Number (Optional)
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-[#7fff41] focus:outline-none focus:ring-1 focus:ring-[#7fff41]"
                  />
                  <p className="mt-1 text-[10px] text-slate-500">
                    For event reminders and updates.
                  </p>
                </div>

                {error && (
                  <div className="rounded-md bg-red-500/10 p-3 text-xs text-red-400">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 flex w-full items-center justify-center rounded-lg bg-[#7fff41] py-2.5 text-sm font-semibold text-slate-900 shadow-lg shadow-[#7fff41]/20 transition hover:bg-[#a4ff82] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      Registering...
                    </span>
                  ) : (
                    "Confirm Registration"
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="mb-4 rounded-full bg-[#7fff41]/20 p-3 text-[#7fff41]">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white">You're In!</h3>
              <p className="mt-2 text-sm text-slate-300">
                A calendar invite has been sent to <strong>{email}</strong>.
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Check your inbox to accept the invite.
              </p>
              <button
                onClick={onClose}
                className="mt-6 rounded-full border border-white/20 px-6 py-2 text-sm font-medium text-white hover:bg-white/10"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
