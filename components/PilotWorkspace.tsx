"use client";

import { useMemo, useState } from "react";

type RoleKey = "requester" | "facility" | "partner";
type SupportOption = "Prayer" | "Friendly visit" | "Encouragement" | "Pastoral call";
type RequestStage = "draft" | "facility-review" | "partner-assignment" | "care-complete";
type Outcome = "Contacted" | "Visited" | "Unable to reach" | "Follow-up requested";

type PilotWorkspaceProps = {
  role: RoleKey;
};

type PilotRequest = {
  support: SupportOption[];
  note: string;
  stage: RequestStage;
  facilityApproved: boolean;
  partnerOutcome: Outcome | null;
  requesterUpdateReleased: boolean;
  activity: string[];
};

const supportOptions: SupportOption[] = ["Prayer", "Friendly visit", "Encouragement", "Pastoral call"];
const blockedTerms = ["diagnosis", "medication", "medicine", "treatment", "symptom", "insurance", "emergency", "doctor", "nurse", "pain", "clinical", "chart", "record"];

const initialRequest: PilotRequest = {
  support: [],
  note: "",
  stage: "draft",
  facilityApproved: false,
  partnerOutcome: null,
  requesterUpdateReleased: false,
  activity: ["Pilot workspace opened."]
};

const roleLabels: Record<RoleKey, string> = {
  requester: "Requester",
  facility: "Facility reviewer",
  partner: "Care partner"
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function stageLabel(stage: RequestStage) {
  if (stage === "draft") return "Draft";
  if (stage === "facility-review") return "Facility review";
  if (stage === "partner-assignment") return "Partner assignment";
  return "Care complete";
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={cx("rounded-[1.5rem] border border-[#d9dfd7] bg-white p-5 shadow-sm shadow-[#0d2b3b]/5", className)}>{children}</section>;
}

function Eyebrow({ children }: { children: string }) {
  return <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">{children}</p>;
}

function Pill({ children, active = false }: { children: string; active?: boolean }) {
  return <span className={cx("rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.1em]", active ? "bg-[#e7f1eb] text-[#0f6b54]" : "bg-[#edf4f0] text-[#4f6259]")}>{children}</span>;
}

export function PilotWorkspace({ role }: PilotWorkspaceProps) {
  const [request, setRequest] = useState<PilotRequest>(initialRequest);
  const [activeView, setActiveView] = useState<RoleKey>(role);

  const blockedMatches = useMemo(() => {
    const lower = request.note.toLowerCase();
    return blockedTerms.filter((term) => lower.includes(term));
  }, [request.note]);

  const canSubmit = request.support.length > 0 && request.note.trim().length > 0 && blockedMatches.length === 0;
  const canFacilityApprove = request.stage === "facility-review";
  const canPartnerReport = request.stage === "partner-assignment";

  function addActivity(line: string) {
    setRequest((current) => ({
      ...current,
      activity: [`${nowLabel()} · ${line}`, ...current.activity].slice(0, 10)
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

  function submitRequest() {
    if (!canSubmit) return;
    setRequest((current) => ({
      ...current,
      stage: "facility-review",
      activity: [`${nowLabel()} · Request submitted for facility review.`, ...current.activity]
    }));
    setActiveView("facility");
  }

  function approveForPartner() {
    if (!canFacilityApprove) return;
    setRequest((current) => ({
      ...current,
      stage: "partner-assignment",
      facilityApproved: true,
      activity: [`${nowLabel()} · Facility reviewer approved partner-safe context.`, ...current.activity]
    }));
    setActiveView("partner");
  }

  function recordOutcome(outcome: Outcome) {
    if (!canPartnerReport) return;
    setRequest((current) => ({
      ...current,
      stage: "care-complete",
      partnerOutcome: outcome,
      requesterUpdateReleased: true,
      activity: [`${nowLabel()} · Care partner recorded outcome: ${outcome}.`, ...current.activity]
    }));
    setActiveView("requester");
  }

  function resetRequest() {
    setRequest(initialRequest);
    setActiveView(role);
  }

  async function signOut() {
    await fetch("/api/role-sign-out", { method: "POST" }).catch(() => null);
    window.location.href = "/";
  }

  return (
    <main className="min-h-screen bg-[#edf4f0] text-[#0d2b3b]">
      <header className="border-b border-white/10 bg-[#082838] text-white shadow-xl shadow-[#0d2b3b]/15">
        <div className="mx-auto flex max-w-[118rem] flex-col gap-5 px-4 py-5 md:flex-row md:items-center md:justify-between md:px-8">
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
            <Pill active>{roleLabels[role]}</Pill>
            <button type="button" onClick={resetRequest} className="rounded-full border border-white/15 bg-white/8 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#d9e7df] hover:bg-white/15">New request</button>
            <button type="button" onClick={signOut} className="rounded-full bg-[#d6a943] px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#082838]">Sign out</button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[118rem] px-4 py-5 md:px-8 md:py-8">
        <div className="grid gap-6 xl:grid-cols-[1fr_24rem]">
          <section className="min-w-0 space-y-5">
            <Card className="bg-[#0f3f35] text-white">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <Eyebrow>Pilot request path</Eyebrow>
                  <h1 className="mt-3 max-w-4xl font-serif text-4xl font-semibold tracking-[-0.05em] md:text-6xl">Move spiritual-care requests through review.</h1>
                  <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-[#d9e7df] md:text-base">
                    Requesters submit a guided spiritual-care request. Facility reviewers approve what may be shared. Care partners receive only approved context and return a safe update.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#c7e2d0]">Current status</p>
                  <p className="mt-2 text-2xl font-black text-[#d6a943]">{stageLabel(request.stage)}</p>
                </div>
              </div>
            </Card>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {(["requester", "facility", "partner"] as RoleKey[]).map((view) => (
                <button
                  key={view}
                  type="button"
                  onClick={() => setActiveView(view)}
                  className={cx(
                    "shrink-0 rounded-full px-4 py-3 text-sm font-black transition",
                    activeView === view ? "bg-[#082838] text-white shadow-lg" : "border border-[#d9dfd7] bg-white text-[#4f6259]"
                  )}
                >
                  {roleLabels[view]}
                </button>
              ))}
            </div>

            {activeView === "requester" ? (
              <Card>
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <Eyebrow>Requester intake</Eyebrow>
                    <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em]">What kind of spiritual support would help?</h2>
                    <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-[#4f6259]">Use a guided request path. Keep the request spiritual-care only.</p>
                  </div>
                  <Pill active={request.stage !== "draft"}>{stageLabel(request.stage)}</Pill>
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  {supportOptions.map((option) => {
                    const active = request.support.includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleSupport(option)}
                        className={cx("rounded-2xl border p-5 text-left transition", active ? "border-[#0f6b54] bg-[#e7f1eb] shadow-sm" : "border-[#d9dfd7] bg-[#f8fbf8] hover:bg-white")}
                      >
                        <span className={cx("flex h-9 w-9 items-center justify-center rounded-full text-sm font-black", active ? "bg-[#0f6b54] text-white" : "bg-white text-[#506a49]")}>{active ? "✓" : ""}</span>
                        <span className="mt-4 block text-lg font-black">{option}</span>
                        <span className="mt-1 block text-sm font-semibold text-[#4f6259]">Facility-reviewed support category</span>
                      </button>
                    );
                  })}
                </div>

                <label className="mt-6 block">
                  <Eyebrow>Safe context note</Eyebrow>
                  <textarea
                    value={request.note}
                    onChange={(event) => setRequest((current) => ({ ...current, note: event.target.value }))}
                    rows={4}
                    className="mt-3 w-full rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] px-4 py-4 text-base font-semibold leading-7 outline-[#0f6b54]"
                    placeholder="Example: They would appreciate prayer and a calm visit this week."
                  />
                </label>

                {blockedMatches.length > 0 ? (
                  <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold leading-6 text-red-900">
                    Review needed: remove medical, emergency, insurance, chart, or treatment details before submitting.
                  </div>
                ) : (
                  <div className="mt-4 rounded-2xl border border-[#cfe4d5] bg-[#f1f8f3] p-4 text-sm font-bold leading-6 text-[#173b2d]">
                    Ready for facility review.
                  </div>
                )}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button type="button" onClick={submitRequest} disabled={!canSubmit || request.stage !== "draft"} className={cx("rounded-xl px-5 py-4 text-sm font-black shadow-lg transition", canSubmit && request.stage === "draft" ? "bg-[#082838] text-white hover:bg-[#0f3f35]" : "bg-[#d9dfd7] text-[#6a746e]")}>Submit for facility review</button>
                </div>
              </Card>
            ) : null}

            {activeView === "facility" ? (
              <Card>
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <Eyebrow>Facility review</Eyebrow>
                    <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em]">Approve what may be shared.</h2>
                    <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-[#4f6259]">Facility review is the approval boundary before a care partner receives context.</p>
                  </div>
                  <Pill active={request.facilityApproved}>{request.facilityApproved ? "Approved" : request.stage === "facility-review" ? "Needs review" : "Waiting"}</Pill>
                </div>

                {request.stage === "draft" ? (
                  <div className="mt-6 rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] p-6 text-sm font-bold text-[#4f6259]">No submitted request is waiting for review.</div>
                ) : (
                  <div className="mt-6 grid gap-5 lg:grid-cols-2">
                    <section className="rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] p-5">
                      <Eyebrow>Incoming request</Eyebrow>
                      <h3 className="mt-3 text-2xl font-black">{request.support.length ? request.support.join(" + ") : "Support not selected"}</h3>
                      <p className="mt-4 rounded-2xl bg-white p-4 text-sm font-semibold leading-7 text-[#4f6259]">{request.note || "No requester note yet."}</p>
                    </section>
                    <section className="rounded-2xl border border-[#eed9a8] bg-[#fff8e7] p-5">
                      <Eyebrow>Partner-safe release</Eyebrow>
                      <ul className="mt-4 space-y-3 text-sm font-bold leading-6 text-[#5f4b1f]">
                        <li>• Share selected support categories</li>
                        <li>• Share requester-safe spiritual-care note</li>
                        <li>• Hold internal facility context</li>
                        <li>• Do not share medical or emergency details</li>
                      </ul>
                    </section>
                  </div>
                )}

                <div className="mt-6">
                  <button type="button" onClick={approveForPartner} disabled={!canFacilityApprove} className={cx("rounded-xl px-5 py-4 text-sm font-black shadow-lg transition", canFacilityApprove ? "bg-[#082838] text-white hover:bg-[#0f3f35]" : "bg-[#d9dfd7] text-[#6a746e]")}>Approve for care partner</button>
                </div>
              </Card>
            ) : null}

            {activeView === "partner" ? (
              <Card>
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <Eyebrow>Care partner assignment</Eyebrow>
                    <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em]">Respond using approved context only.</h2>
                    <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-[#4f6259]">Care partners receive only what facility review approved for spiritual-care coordination.</p>
                  </div>
                  <Pill active={request.stage === "partner-assignment" || request.stage === "care-complete"}>{request.partnerOutcome ? "Outcome logged" : request.stage === "partner-assignment" ? "Assigned" : "Waiting"}</Pill>
                </div>

                {request.stage === "draft" || request.stage === "facility-review" ? (
                  <div className="mt-6 rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] p-6 text-sm font-bold text-[#4f6259]">No approved assignment is ready yet.</div>
                ) : (
                  <div className="mt-6 rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] p-5">
                    <Eyebrow>Approved assignment</Eyebrow>
                    <h3 className="mt-3 text-2xl font-black">{request.support.join(" + ")}</h3>
                    <p className="mt-4 rounded-2xl bg-white p-4 text-sm font-semibold leading-7 text-[#4f6259]">{request.note}</p>
                  </div>
                )}

                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  {(["Contacted", "Visited", "Unable to reach", "Follow-up requested"] as Outcome[]).map((outcome) => (
                    <button key={outcome} type="button" onClick={() => recordOutcome(outcome)} disabled={!canPartnerReport} className={cx("rounded-xl border px-4 py-4 text-left text-sm font-black", canPartnerReport ? "border-[#0f6b54] bg-[#e7f1eb] text-[#0f3f35] hover:bg-white" : "border-[#d9dfd7] bg-[#f8fbf8] text-[#8a938d]")}>{outcome}</button>
                  ))}
                </div>
              </Card>
            ) : null}
          </section>

          <aside className="space-y-5">
            <Card>
              <Eyebrow>Request record</Eyebrow>
              <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.04em]">Current request</h2>
              <dl className="mt-5 space-y-4 text-sm font-bold leading-6">
                <div><dt className="text-[#4f6259]">Status</dt><dd>{stageLabel(request.stage)}</dd></div>
                <div><dt className="text-[#4f6259]">Support</dt><dd>{request.support.length ? request.support.join(", ") : "Not selected"}</dd></div>
                <div><dt className="text-[#4f6259]">Facility review</dt><dd>{request.facilityApproved ? "Approved" : "Pending"}</dd></div>
                <div><dt className="text-[#4f6259]">Care partner outcome</dt><dd>{request.partnerOutcome || "Pending"}</dd></div>
                <div><dt className="text-[#4f6259]">Requester update</dt><dd>{request.requesterUpdateReleased ? "Released" : "Pending"}</dd></div>
              </dl>
            </Card>

            <Card>
              <Eyebrow>Activity</Eyebrow>
              <div className="mt-4 space-y-3">
                {request.activity.map((item) => (
                  <p key={item} className="rounded-2xl bg-[#f8fbf8] p-4 text-sm font-semibold leading-6 text-[#4f6259]">{item}</p>
                ))}
              </div>
            </Card>
          </aside>
        </div>
      </section>
    </main>
  );
}
