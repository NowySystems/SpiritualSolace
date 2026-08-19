"use client";

import { useMemo, useState, type ReactNode } from "react";

type RoleKey = "requester" | "facility" | "partner";
type SupportOption = "Prayer" | "Friendly visit" | "Encouragement" | "Pastoral call";
type RequestStage = "draft" | "facility-review" | "partner-assignment" | "complete";

type PilotWorkspaceProps = {
  role: RoleKey;
};

type PilotRequest = {
  support: SupportOption[];
  note: string;
  stage: RequestStage;
  activity: string[];
};

const supportOptions: SupportOption[] = ["Prayer", "Friendly visit", "Encouragement", "Pastoral call"];
const blockedTerms = ["diagnosis", "medication", "medicine", "treatment", "symptom", "insurance", "emergency", "doctor", "nurse", "pain", "clinical", "chart", "record"];

const roleLabels: Record<RoleKey, string> = {
  requester: "Requester",
  facility: "Facility reviewer",
  partner: "Care partner"
};

const roleHeadlines: Record<RoleKey, string> = {
  requester: "Start or check a spiritual-care request.",
  facility: "Review requests before anything is shared.",
  partner: "Respond only to approved care assignments."
};

const initialRequest: PilotRequest = {
  support: [],
  note: "",
  stage: "draft",
  activity: ["Pilot workspace opened."]
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function stageLabel(stage: RequestStage) {
  if (stage === "facility-review") return "Facility review";
  if (stage === "partner-assignment") return "Care partner assignment";
  if (stage === "complete") return "Update released";
  return "Draft";
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={cx("rounded-[1.5rem] border border-[#d9dfd7] bg-white p-5 shadow-sm shadow-[#0d2b3b]/5", className)}>{children}</section>;
}

function Eyebrow({ children }: { children: string }) {
  return <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">{children}</p>;
}

function StatusPill({ children, tone = "neutral" }: { children: string; tone?: "neutral" | "green" | "gold" }) {
  const className = tone === "green"
    ? "bg-[#e7f1eb] text-[#0f6b54]"
    : tone === "gold"
      ? "bg-[#fff8e7] text-[#7a5b20]"
      : "bg-[#edf4f0] text-[#4f6259]";

  return <span className={cx("rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.1em]", className)}>{children}</span>;
}

export function PilotWorkspace({ role }: PilotWorkspaceProps) {
  const [request, setRequest] = useState<PilotRequest>(initialRequest);
  const [submitted, setSubmitted] = useState(false);

  const blockedMatches = useMemo(() => {
    const lower = request.note.toLowerCase();
    return blockedTerms.filter((term) => lower.includes(term));
  }, [request.note]);

  const canSubmit = request.support.length > 0 && request.note.trim().length > 0 && blockedMatches.length === 0 && request.stage === "draft";

  function addActivity(line: string) {
    setRequest((current) => ({
      ...current,
      activity: [`${nowLabel()} · ${line}`, ...current.activity].slice(0, 8)
    }));
  }

  function toggleSupport(option: SupportOption) {
    setRequest((current) => {
      const exists = current.support.includes(option);
      return {
        ...current,
        support: exists ? current.support.filter((item) => item !== option) : [...current.support, option]
      };
    });
  }

  function submitForReview() {
    if (!canSubmit) return;
    setRequest((current) => ({
      ...current,
      stage: "facility-review",
      activity: [`${nowLabel()} · Request submitted for facility review.`, ...current.activity]
    }));
    setSubmitted(true);
  }

  function newRequest() {
    setRequest(initialRequest);
    setSubmitted(false);
  }

  async function signOut() {
    await fetch("/api/role-sign-out", { method: "POST" }).catch(() => null);
    window.location.href = "/";
  }

  return (
    <main className="min-h-screen bg-[#edf4f0] text-[#0d2b3b]">
      <header className="border-b border-white/10 bg-[#082838] text-white shadow-xl shadow-[#0d2b3b]/15">
        <div className="mx-auto flex max-w-[90rem] flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between md:px-8">
          <a href="/" className="flex items-center gap-4" aria-label="ChurchWork public site">
            <span className="flex h-12 w-16 shrink-0 items-center justify-center rounded-2xl bg-white p-2 shadow-sm">
              <img src="/brand/churchwork-corner-logo.png" alt="ChurchWork logo" className="h-full w-full object-contain" />
            </span>
            <span>
              <span className="block font-serif text-2xl font-semibold tracking-[-0.03em] md:text-3xl">Church<span className="text-[#8dbd9e]">Work</span></span>
              <span className="block text-xs font-semibold text-[#d9e7df]">Pilot workspace</span>
            </span>
          </a>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#e7f1eb] px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#0f6b54]">{roleLabels[role]}</span>
            {role === "requester" ? (
              <button type="button" onClick={newRequest} className="rounded-full border border-white/15 bg-white/8 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#d9e7df] hover:bg-white/15">New request</button>
            ) : null}
            <button type="button" onClick={signOut} className="rounded-full bg-[#d6a943] px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#082838]">Sign out</button>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-[90rem] gap-6 px-4 py-6 md:px-8 xl:grid-cols-[1fr_23rem]">
        <div className="space-y-5">
          <Card className="bg-[#0f3f35] text-white">
            <Eyebrow>ChurchWork pilot</Eyebrow>
            <h1 className="mt-3 max-w-4xl font-serif text-4xl font-semibold tracking-[-0.05em] md:text-5xl">{roleHeadlines[role]}</h1>
            <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-[#d9e7df] md:text-base">
              ChurchWork keeps requesters, facility reviewers, and care partners in separate role-based workspaces.
            </p>
          </Card>

          {role === "requester" ? (
            <Card>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <Eyebrow>Requester intake</Eyebrow>
                  <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em]">What kind of spiritual support would help?</h2>
                  <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-[#4f6259]">Use the guided request path. Do not include medical, emergency, insurance, diagnosis, treatment, or chart details.</p>
                </div>
                <StatusPill tone={submitted ? "gold" : "neutral"}>{stageLabel(request.stage)}</StatusPill>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {supportOptions.map((option) => {
                  const active = request.support.includes(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleSupport(option)}
                      disabled={submitted}
                      className={cx("rounded-2xl border p-5 text-left transition", active ? "border-[#0f6b54] bg-[#e7f1eb] shadow-sm" : "border-[#d9dfd7] bg-[#f8fbf8] hover:bg-white", submitted && "opacity-80")}
                    >
                      <span className={cx("flex h-9 w-9 items-center justify-center rounded-full text-sm font-black", active ? "bg-[#0f6b54] text-white" : "bg-white text-[#506a49]")}>{active ? "✓" : ""}</span>
                      <span className="mt-4 block text-lg font-black">{option}</span>
                      <span className="mt-1 block text-sm font-semibold text-[#4f6259]">Spiritual-care support category</span>
                    </button>
                  );
                })}
              </div>

              <label className="mt-6 block">
                <Eyebrow>Safe context note</Eyebrow>
                <textarea
                  value={request.note}
                  onChange={(event) => setRequest((current) => ({ ...current, note: event.target.value }))}
                  disabled={submitted}
                  rows={4}
                  className="mt-3 w-full rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] px-4 py-4 text-base font-semibold leading-7 outline-[#0f6b54] disabled:opacity-80"
                  placeholder="Example: They would appreciate prayer and a calm visit this week."
                />
              </label>

              {blockedMatches.length > 0 ? (
                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold leading-6 text-red-900">
                  Remove medical, emergency, insurance, chart, diagnosis, symptom, or treatment details before submitting.
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-[#cfe4d5] bg-[#f1f8f3] p-4 text-sm font-bold leading-6 text-[#173b2d]">
                  Request is spiritual-care only and ready for facility review.
                </div>
              )}

              <div className="mt-6">
                <button type="button" onClick={submitForReview} disabled={!canSubmit} className={cx("rounded-xl px-5 py-4 text-sm font-black shadow-lg transition", canSubmit ? "bg-[#082838] text-white hover:bg-[#0f3f35]" : "bg-[#d9dfd7] text-[#6a746e]")}>Submit for facility review</button>
              </div>
            </Card>
          ) : null}

          {role === "facility" ? (
            <Card>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <Eyebrow>Facility review</Eyebrow>
                  <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em]">Review requests before partner release.</h2>
                  <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-[#4f6259]">Approved facility users review each spiritual-care request and control what may be shared with care partners.</p>
                </div>
                <StatusPill>No requests</StatusPill>
              </div>
              <div className="mt-6 rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] p-6 text-sm font-bold leading-7 text-[#4f6259]">
                No requests are waiting for review in this pilot workspace yet.
              </div>
            </Card>
          ) : null}

          {role === "partner" ? (
            <Card>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <Eyebrow>Care partner assignments</Eyebrow>
                  <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em]">Respond using approved context only.</h2>
                  <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-[#4f6259]">Care partners receive only facility-approved spiritual-care context and submit safe, limited updates.</p>
                </div>
                <StatusPill>No assignments</StatusPill>
              </div>
              <div className="mt-6 rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] p-6 text-sm font-bold leading-7 text-[#4f6259]">
                No approved assignments are available for this care partner account yet.
              </div>
            </Card>
          ) : null}
        </div>

        <aside className="space-y-5">
          <Card>
            <Eyebrow>Request record</Eyebrow>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em]">Current status</h2>
            <dl className="mt-6 space-y-4 text-sm font-semibold text-[#0d2b3b]">
              <div><dt className="text-[#4f6259]">Signed-in role</dt><dd>{roleLabels[role]}</dd></div>
              <div><dt className="text-[#4f6259]">Request status</dt><dd>{stageLabel(request.stage)}</dd></div>
              <div><dt className="text-[#4f6259]">Support</dt><dd>{request.support.length ? request.support.join(", ") : "Not selected"}</dd></div>
              <div><dt className="text-[#4f6259]">Facility review</dt><dd>{request.stage === "draft" ? "Pending submission" : "Pending review"}</dd></div>
            </dl>
          </Card>

          <Card>
            <Eyebrow>Activity</Eyebrow>
            <div className="mt-4 space-y-2">
              {request.activity.map((item) => (
                <p key={item} className="rounded-2xl bg-[#f8fbf8] p-4 text-sm font-semibold leading-6 text-[#4f6259]">{item}</p>
              ))}
            </div>
          </Card>
        </aside>
      </section>
    </main>
  );
}
