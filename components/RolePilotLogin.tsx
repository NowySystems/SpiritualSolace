"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type RoleKey = "requester" | "facility" | "partner";
type AuthMode = "sign-in" | "sign-up";

type RolePilotLoginProps = {
  role: RoleKey;
};

type RoleCopy = {
  eyebrow: string;
  title: string;
  body: string;
  destination: string;
  accountHelp: string;
  canCreateAccount: boolean;
};

type SignedInState = {
  email: string;
  role: RoleKey;
  roleVerified: boolean;
};

type InviteDetails = {
  valid: boolean;
  email?: string;
  organization_name?: string;
  org_slug?: string;
  portal?: string;
  role?: string;
  pilot_admin?: boolean;
  expires_at?: string;
};

const roleCopy = {
  requester: {
    eyebrow: "Requester portal",
    title: "Requester login",
    body: "Sign in to start or check a spiritual-care request. New requesters can create an account for the pilot.",
    destination: "Requester workspace",
    accountHelp: "Requesters may create an account. Facility review still controls what is shared with care partners.",
    canCreateAccount: true
  },
  facility: {
    eyebrow: "Facility portal",
    title: "Facility login",
    body: "Sign in with your approved facility account to review requests and control what may be released to approved care partners.",
    destination: "Facility review workspace",
    accountHelp: "Facility accounts are created from a ChurchWork invitation issued by the pilot admin.",
    canCreateAccount: false
  },
  partner: {
    eyebrow: "Partner portal",
    title: "Partner login",
    body: "Sign in with your approved partner account to view assignments and submit safe, non-medical report-backs.",
    destination: "Partner assignment workspace",
    accountHelp: "Partner accounts are created from a ChurchWork invitation issued by the pilot admin.",
    canCreateAccount: false
  }
} satisfies Record<RoleKey, RoleCopy>;

function messageFromResponse(body: unknown, fallback: string) {
  if (body && typeof body === "object" && "message" in body && typeof body.message === "string") {
    return body.message;
  }
  return fallback;
}

function roleLabel(role: string | undefined) {
  if (role === "facility_admin") return "Facility Admin";
  if (role === "facility_staff") return "Facility Staff";
  if (role === "partner_admin") return "Partner Admin";
  if (role === "partner_user") return "Partner User";
  return "Pilot User";
}

export function RolePilotLogin({ role }: RolePilotLoginProps) {
  const copy = roleCopy[role];
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [signedIn, setSignedIn] = useState<SignedInState | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [status, setStatus] = useState(copy.accountHelp);
  const [isBusy, setIsBusy] = useState(false);
  const [inviteToken, setInviteToken] = useState("");
  const [invite, setInvite] = useState<InviteDetails | null>(null);
  const [inviteChecked, setInviteChecked] = useState(role === "requester");

  useEffect(() => {
    if (role === "requester") return;

    const token = new URLSearchParams(window.location.search).get("invite")?.trim() ?? "";
    if (!token) {
      setInviteChecked(true);
      return;
    }

    let mounted = true;

    async function validateInvite() {
      setStatus("Checking your ChurchWork invitation...");
      const response = await fetch(`/api/pilot-invite?token=${encodeURIComponent(token)}`, { cache: "no-store" }).catch(() => null);
      const body = await response?.json().catch(() => null) as InviteDetails | null;

      if (!mounted) return;

      if (!response || !response.ok || !body?.valid || body.portal !== role) {
        setInvite(null);
        setInviteToken("");
        setStatus("This ChurchWork invitation is invalid, expired, already used, or belongs to another portal.");
        setInviteChecked(true);
        return;
      }

      setInvite(body);
      setInviteToken(token);
      setEmail(typeof body.email === "string" ? body.email : "");
      setMode("sign-up");
      setStatus(`Invitation verified for ${body.organization_name ?? "your organization"}. Choose a password to create your ChurchWork account.`);
      setInviteChecked(true);
    }

    void validateInvite();
    return () => { mounted = false; };
  }, [role]);

  const isRequesterSignup = role === "requester" && mode === "sign-up";
  const isInviteSignup = role !== "requester" && mode === "sign-up" && Boolean(invite?.valid);
  const canCreateHere = copy.canCreateAccount || Boolean(invite?.valid);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsBusy(true);
    setStatus(isRequesterSignup || isInviteSignup ? "Creating your ChurchWork account..." : inviteToken ? "Signing in and accepting your invitation..." : "Signing in...");

    try {
      const response = await fetch("/api/role-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          mode,
          email,
          password,
          inviteToken: inviteToken || undefined
        })
      });

      const body = await response.json().catch(() => null);

      if (!response.ok || !body?.ok) {
        setStatus(messageFromResponse(body, "ChurchWork sign-in could not complete. Please try again."));
        setIsBusy(false);
        return;
      }

      if (mode === "sign-up" && body.needsEmailConfirmation) {
        setStatus("Account created. Check your email to confirm the account, then return here and sign in.");
        setMode("sign-in");
        setPassword("");
        setInviteToken("");
        setInvite(null);
        setIsBusy(false);
        return;
      }

      setSignedIn({
        email: typeof body.email === "string" ? body.email : email,
        role,
        roleVerified: body.roleVerified === true
      });
      setStatus(`${messageFromResponse(body, "Signed in.")} Opening ChurchWork...`);
      window.location.assign("/pilot-mvp");
    } catch {
      setStatus("ChurchWork sign-in is temporarily unavailable. Please try again in a minute.");
      setIsBusy(false);
    }
  }

  async function handlePasswordReset() {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setStatus("Enter your account email first, then choose Forgot password.");
      return;
    }

    setIsBusy(true);
    setStatus("Sending a secure password reset link...");

    const redirectTo = `${window.location.origin}/pilot/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, { redirectTo });

    if (error) {
      setStatus("ChurchWork could not start password recovery right now. Try again shortly or contact the pilot admin.");
      setIsBusy(false);
      return;
    }

    setStatus("If that email belongs to a ChurchWork account, a secure reset link is on the way.");
    setIsBusy(false);
  }

  function handleSignOut() {
    setSignedIn(null);
    setPassword("");
    setStatus(copy.accountHelp);
  }

  function submitLabel() {
    if (isBusy) return isRequesterSignup || isInviteSignup ? "Creating account..." : "Signing in...";
    if (isInviteSignup) return "Create invited account";
    if (isRequesterSignup) return "Create requester account";
    if (inviteToken) return "Sign in & accept invite";
    return "Sign in";
  }

  return (
    <main className="min-h-screen bg-[#f7f3ea] px-5 py-8 text-[#102b3a]">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1fr_28rem]">
        <div>
          <a href="/" className="inline-flex items-center gap-3 rounded-2xl bg-white/80 p-3 shadow-sm ring-1 ring-[#d8d0c0]" aria-label="Back to ChurchWork public site">
            <span className="flex h-12 w-16 items-center justify-center rounded-xl bg-white p-1">
              <img src="/brand/churchwork-corner-logo.png" alt="ChurchWork logo" className="h-full w-full object-contain" />
            </span>
            <span className="font-serif text-2xl font-semibold tracking-[-0.04em]">Church<span className="text-[#3f806e]">Work</span></span>
          </a>

          <p className="mt-10 text-xs font-black uppercase tracking-[0.22em] text-[#789052]">{copy.eyebrow}</p>
          <h1 className="mt-3 max-w-3xl font-serif text-5xl font-semibold tracking-[-0.05em] md:text-6xl">{copy.title}</h1>
          <p className="mt-5 max-w-2xl text-base font-semibold leading-8 text-[#4d5d55]">{copy.body}</p>

          {invite?.valid ? (
            <div className="mt-8 rounded-[1.5rem] border border-[#b8d2c4] bg-[#eef7f1] p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#4f8062]">Verified invitation</p>
              <h2 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.035em]">{invite.organization_name}</h2>
              <p className="mt-2 text-sm font-bold text-[#4d655b]">{roleLabel(invite.role)}{invite.pilot_admin ? " · Pilot Admin dashboard access" : ""}</p>
              <p className="mt-3 text-xs font-semibold leading-5 text-[#687971]">This invitation fixes your organization and role. They cannot be changed from the signup form.</p>
            </div>
          ) : (
            <div className="mt-8 rounded-[1.5rem] border border-[#d8d0c0] bg-white/75 p-5 text-sm leading-7 text-[#4d5d55]">
              <strong className="text-[#173b2d]">Account rule:</strong> {copy.accountHelp}
            </div>
          )}
        </div>

        <section className="rounded-[2rem] border border-[#d8d0c0] bg-white p-7 shadow-2xl shadow-[#0d2b3b]/10">
          {!inviteChecked ? (
            <div className="py-10 text-center">
              <p className="text-sm font-black text-[#173b2d]">Checking invitation…</p>
            </div>
          ) : signedIn ? (
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#789052]">Signed in</p>
              <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.04em]">{copy.destination}</h2>
              <p className="mt-4 text-sm font-semibold leading-7 text-[#4d5d55]">You are signed in as {signedIn.email}. Opening ChurchWork now.</p>
              <div className="mt-4 rounded-xl border border-[#d8d0c0] bg-[#f8fbf8] p-4 text-sm font-semibold leading-6 text-[#4d5d55]">
                Role: <strong className="text-[#173b2d]">{signedIn.role}</strong> {signedIn.roleVerified ? "· Role verified" : "· Role not yet verified"}
              </div>
              <div className="mt-6 grid gap-3">
                <a href="/pilot-mvp" className="rounded-xl bg-[#173b2d] px-4 py-3 text-center text-sm font-black text-white hover:bg-[#102b3a]">Open ChurchWork</a>
                <a href="/" className="rounded-xl border border-[#d8d0c0] bg-[#f8fbf8] px-4 py-3 text-center text-sm font-black text-[#173b2d] hover:bg-white">Back to public site</a>
                <button type="button" onClick={handleSignOut} disabled={isBusy} className="rounded-xl border border-[#d8d0c0] bg-white px-4 py-3 text-sm font-black text-[#173b2d] hover:bg-[#f8fbf8] disabled:opacity-60">Sign out</button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#789052]">{invite?.valid ? "Approved pilot invitation" : "Pilot account"}</p>
                <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.04em]">{isInviteSignup ? "Create your account" : isRequesterSignup ? "Create requester account" : "Sign in"}</h2>
                <p className="mt-3 text-sm font-semibold leading-6 text-[#4d5d55]">
                  {isInviteSignup ? `Create your ${invite?.organization_name ?? "ChurchWork"} login with the invited email below.` : isRequesterSignup ? "Create a requester account for the ChurchWork pilot." : inviteToken ? "Already have a ChurchWork account? Sign in to accept this invitation." : copy.accountHelp}
                </p>
              </div>

              <label className="block text-sm font-black text-[#173b2d]">
                Email
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required readOnly={Boolean(invite?.valid)} autoComplete="email" className="mt-2 w-full rounded-xl border border-[#d8d0c0] px-4 py-3 text-base outline-none focus:border-[#8aa363] read-only:bg-[#f3f1eb]" />
              </label>

              <label className="block text-sm font-black text-[#173b2d]">
                Password
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} autoComplete={mode === "sign-up" ? "new-password" : "current-password"} className="mt-2 w-full rounded-xl border border-[#d8d0c0] px-4 py-3 text-base outline-none focus:border-[#8aa363]" />
                {mode === "sign-up" ? <span className="mt-2 block text-xs font-semibold leading-5 text-[#4d5d55]">Use at least 8 characters. A longer passphrase is better.</span> : null}
              </label>

              <button type="submit" disabled={isBusy} className="w-full rounded-xl bg-[#173b2d] px-5 py-3 text-base font-black text-white shadow-lg hover:bg-[#102b3a] disabled:opacity-60">{submitLabel()}</button>

              {mode === "sign-in" ? (
                <button type="button" onClick={handlePasswordReset} disabled={isBusy} className="w-full rounded-xl border border-[#d8d0c0] bg-white px-5 py-3 text-sm font-black text-[#173b2d] hover:bg-[#f8fbf8] disabled:opacity-60">Forgot password?</button>
              ) : null}

              {canCreateHere ? (
                <button
                  type="button"
                  onClick={() => {
                    const nextMode = mode === "sign-up" ? "sign-in" : "sign-up";
                    setMode(nextMode);
                    setPassword("");
                    setStatus(invite?.valid
                      ? nextMode === "sign-up"
                        ? `Invitation verified for ${invite.organization_name}. Choose a password to create your account.`
                        : "Already have a ChurchWork account? Sign in to accept this invitation."
                      : nextMode === "sign-up"
                        ? "Create a requester account for the ChurchWork pilot."
                        : copy.accountHelp);
                  }}
                  className="w-full rounded-xl border border-[#d8d0c0] bg-[#f8fbf8] px-5 py-3 text-sm font-black text-[#173b2d] hover:bg-white"
                >
                  {mode === "sign-up" ? "Already have an account? Sign in" : invite?.valid ? "New here? Create invited account" : "New requester? Create an account"}
                </button>
              ) : (
                <p className="rounded-xl border border-[#ddb66c]/45 bg-[#fff8e7] p-4 text-sm font-semibold leading-6 text-[#5f4b1f]">Need access? Ask your ChurchWork pilot admin for an approved invitation.</p>
              )}

              <p className="rounded-xl border border-[#ddb66c]/45 bg-[#fff8e7] p-4 text-sm font-semibold leading-6 text-[#5f4b1f]">{status}</p>
            </form>
          )}
        </section>
      </section>
    </main>
  );
}
