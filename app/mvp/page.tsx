"use client";

import { useMemo, useState } from "react";

type TabKey = "requester" | "facility" | "partner" | "status" | "bi";
type SupportOption = "Prayer" | "Friendly visit" | "Encouragement" | "Pastoral call";
type Outcome = "Contacted" | "Visited" | "Unable to reach" | "Follow-up requested";

type SandboxRequest = {
  options: SupportOption[];
  note: string;
  submitted: boolean;
  approved: boolean;
  assigned: boolean;
  outcome: Outcome | null;
  updateReleased: boolean;
  activity: string[];
};

const supportOptions: SupportOption[] = ["Prayer", "Friendly visit", "Encouragement", "Pastoral call"];
const unsafeTerms = ["diagnosis", "medication", "medicine", "treatment", "symptom", "insurance", "emergency", "doctor", "nurse", "pain", "clinical"];

const emptyRequest: SandboxRequest = {
  options: [],
  note: "They would appreciate prayer and a calm visit this week.",
  submitted: false,
  approved: false,
  assigned: false,
  outcome: null,
  updateReleased: false,
  activity: ["MVP sandbox opened."]
};

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={cx("rounded-[1.5rem] border border-[#d9dfd7] bg-white p-5 shadow-sm shadow-[#0d2b3b]/5", className)}>{children}</section>;
}

function StatusPill({ children, tone = "green" }: { children: string; tone?: "green" | "gold" | "blue" | "slate" }) {
  const classes = tone === "gold" ? "bg-[#fff8e7] text-[#7a5b20]" : tone === "blue" ? "bg-[#eef7fb] text-[#082838]" : tone === "slate" ? "bg-[#edf4f0] text-[#4f6259]" : "bg-[#e7f1eb] text-[#0f6b54]";
  return <span className={cx("rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.1em]", classes)}>{children}</span>;
}

function FieldLabel({ children }: { children: string }) {
  return <p className="text-xs font-black uppercase tracking-[0.16em] text-[#506a49]">{children}</p>;
}

export default function ChurchWorkMvpPage() {
  const [tab, setTab] = useState<TabKey>("requester");
  const [request, setRequest] = useState<SandboxRequest>(emptyRequest);

  const unsafeMatches = useMemo(() => {
    const lower = request.note.toLowerCase();
    return unsafeTerms.filter((term) => lower.includes(term));
  }, [request.note]);

  const canSubmit = request.options.length > 0 && request.note.trim().length > 0 && unsafeMatches.length === 0;
  const statusLabel = request.updateReleased ? "Requester updated" : request.outcome ? "Outcome logged" : request.assigned ? "Assigned to partner" : request.approved ? "Approved" : request.submitted ? "Facility review" : "Draft";

  function addActivity(line: string) {
    setRequest((current) => ({ ...current, activity: [`${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · ${line}`, ...current.activity].slice(0, 8) }));
  }

  function toggleOption(option: SupportOption) {
    setRequest((current) => {
      const exists = current.options.includes(option);
      return { ...current, options: exists ? current.options.filter((item) => item !== option) : [...current.options, option] };
    });
  }

  function submitRequest() {
    if (!canSubmit) return;
    setRequest((current) => ({ ...current, submitted: true, activity: [`${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · Request submitted to Grandview review.`, ...current.activity] }));
    setTab("facility");
  }

  function approveRelease() {
    if (!request.submitted) return;
    setRequest((current) => ({
      ...current,
      approved: true,
      assigned: true,
      activity: [`${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · Grandview approved partner-safe context and assigned Hope Church.`, ...current.activity]
    }));
    setTab("partner");
  }

  function logOutcome(outcome: Outcome) {
    if (!request.assigned) return;
    setRequest((current) => ({
      ...current,
      outcome,
      updateReleased: true,
      activity: [`${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · Hope Church logged outcome: ${outcome}.`, ...current.activity]
    }));
    setTab("status");
  }

  function resetSandbox() {
    setRequest(emptyRequest);
    setTab("requester");
  }

  const tabs: { key: TabKey; label: string }[] = [
    { key: "requester", label: "Requester" },
    { key: "facility", label: "Facility" },
    { key: "partner", label: "Partner" },
    { key: "status", label: "Status" },
    { key: "bi", label: "BI" }
  ];

  return (
    <main className="min-h-screen bg-[#edf4f0] text-[#0d2b3b]">
      <header className="border-b border-white/10 bg-[#082838] text-white shadow-xl shadow-[#0d2b3b]/15">
        <div className="mx-auto flex max-w-[118rem] flex-col gap-5 px-4 py-5 md:flex-row md:items-center md:justify-between md:px-8">
          <a href="/admin" className="flex items-center gap-4">
            <span className="flex h-12 w-16 shrink-0 items-center justify-center rounded-2xl bg-white p-2 shadow-sm">
              <img src="/brand/churchwork-corner-logo.png" alt="ChurchWork logo" className="h-full w-full object-contain" />
            </span>
            <span>
              <span className="block font-serif text-2xl font-semibold tracking-[-0.03em] md:text-3xl">Church<span className="text-[#8dbd9e]">Work</span></span>
              <span className="block text-xs font-semibold text-[#d9e7df]">Integrated MVP Sandbox · one-device workflow</span>
            </span>
          </a>
          <div className="flex flex-wrap gap-2">
            <a href="/demo/synthetic" className="rounded-full border border-white/15 bg-white/8 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#d9e7df]">Demo</a>
            <a href="/synthetic-smoke" className="rounded-full border border-white/15 bg-white/8 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#d9e7df]">Smoke</a>
            <button type="button" onClick={resetSandbox} className="rounded-full bg-[#d6a943] px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#082838]">Reset</button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[118rem] px-4 py-5 md:px-8 md:py-8">
        <div className="grid gap-6 xl:grid-cols-[1fr_24rem]">
          <section className="min-w-0 space-y-5">
            <Card className="bg-[#0f3f35] text-white">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#c7e2d0]">MVP path</p>
                  <h1 className="mt-3 max-w-4xl font-serif text-4xl font-semibold tracking-[-0.05em] md:text-6xl">Make a real request move.</h1>
                  <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-[#d9e7df] md:text-base">
                    This is the practical MVP: one sandbox request moves from requester to Grandview review to Hope Church assignment to approved requester update.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#c7e2d0]">Current state</p>
                  <p className="mt-2 text-2xl font-black text-[#d6a943]">{statusLabel}</p>
                </div>
              </div>
            </Card>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {tabs.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setTab(item.key)}
                  className={cx(
                    "shrink-0 rounded-full px-4 py-3 text-sm font-black transition",
                    tab === item.key ? "bg-[#082838] text-white shadow-lg" : "border border-[#d9dfd7] bg-white text-[#4f6259]"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {tab === "requester" ? (
              <Card>
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <FieldLabel>Requester intake</FieldLabel>
                    <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em]">What kind of spiritual support would help?</h2>
                    <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-[#4f6259]">Requester sees a guided path, not an open medical intake or chat thread.</p>
                  </div>
                  <StatusPill tone={request.submitted ? "green" : "slate"}>{request.submitted ? "Submitted" : "Draft"}</StatusPill>
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  {supportOptions.map((option) => {
                    const active = request.options.includes(option);
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => toggleOption(option)}
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
                  <FieldLabel>Safe context note</FieldLabel>
                  <textarea
                    value={request.note}
                    onChange={(event) => setRequest((current) => ({ ...current, note: event.target.value }))}
                    rows={4}
                    className="mt-3 w-full rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] px-4 py-4 text-base font-semibold leading-7 outline-[#0f6b54]"
                    placeholder="Example: They would appreciate prayer and a calm visit this week."
                  />
                </label>

                {unsafeMatches.length > 0 ? (
                  <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold leading-6 text-red-900">
                    Guardrail caught medical/emergency wording: {unsafeMatches.join(", ")}. Keep this request spiritual-care only.
                  </div>
                ) : (
                  <div className="mt-4 rounded-2xl border border-[#cfe4d5] bg-[#f1f8f3] p-4 text-sm font-bold leading-6 text-[#173b2d]">
                    Clean: no medical, insurance, treatment, symptom, or emergency terms detected.
                  </div>
                )}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button type="button" onClick={submitRequest} disabled={!canSubmit || request.submitted} className={cx("rounded-xl px-5 py-4 text-sm font-black shadow-lg transition", canSubmit && !request.submitted ? "bg-[#082838] text-white hover:bg-[#0f3f35]" : "bg-[#d9dfd7] text-[#6a746e]")}>Submit to Grandview review</button>
                  <button type="button" onClick={() => addActivity("Requester reviewed the guardrails before submitting.")} className="rounded-xl border border-[#d9dfd7] bg-white px-5 py-4 text-sm font-black text-[#0d2b3b]">Add activity note</button>
                </div>
              </Card>
            ) : null}

            {tab === "facility" ? (
              <Card>
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <FieldLabel>Grandview review</FieldLabel>
                    <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em]">Facility controls what leaves.</h2>
                    <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-[#4f6259]">Grandview reviews the requester-safe version before Hope Church receives anything.</p>
                  </div>
                  <StatusPill tone={request.approved ? "green" : request.submitted ? "gold" : "slate"}>{request.approved ? "Approved" : request.submitted ? "Needs review" : "No request yet"}</StatusPill>
                </div>

                {request.submitted ? (
                  <div className="mt-6 grid gap-5 lg:grid-cols-2">
                    <section className="rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] p-5">
                      <FieldLabel>Incoming request</FieldLabel>
                      <h3 className="mt-3 text-2xl font-black">{request.options.join(" + ")}</h3>
                      <p className="mt-4 rounded-2xl bg-white p-4 text-sm font-semibold leading-7 text-[#4f6259]">{request.note}</p>
                    </section>
                    <section className="rounded-2xl border border-[#eed9a8] bg-[#fff8e7] p-5">
                      <FieldLabel>Partner-safe release</FieldLabel>
                      <ul className="mt-4 space-y-3 text-sm font-bold leading-6 text-[#5f4b1f]">
                        <li>• Share support request only</li>
                        <li>• Hold internal facility notes</li>
                        <li>• No medical data collected</li>
                        <li>• No automatic partner routing</li>
                      </ul>
                    </section>
                  </div>
                ) : (
                  <div className="mt-6 rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] p-6 text-sm font-bold text-[#4f6259]">No submitted request yet. Start on Requester.</div>
                )}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button type="button" onClick={approveRelease} disabled={!request.submitted || request.approved} className={cx("rounded-xl px-5 py-4 text-sm font-black shadow-lg transition", request.submitted && !request.approved ? "bg-[#0f3f35] text-white hover:bg-[#082838]" : "bg-[#d9dfd7] text-[#6a746e]")}>Approve and assign Hope Church</button>
                  <button type="button" onClick={() => addActivity("Grandview held unclear details back inside facility review.")} disabled={!request.submitted} className="rounded-xl border border-[#d9dfd7] bg-white px-5 py-4 text-sm font-black text-[#0d2b3b] disabled:opacity-50">Hold unclear details</button>
                </div>
              </Card>
            ) : null}

            {tab === "partner" ? (
              <Card>
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <FieldLabel>Hope Church workspace</FieldLabel>
                    <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em]">Partner sees approved context only.</h2>
                    <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-[#4f6259]">This is the partner-facing assignment view after Grandview approves release.</p>
                  </div>
                  <StatusPill tone={request.assigned ? "green" : "slate"}>{request.assigned ? "Assigned" : "Waiting"}</StatusPill>
                </div>

                {request.assigned ? (
                  <div className="mt-6 grid gap-5 lg:grid-cols-2">
                    <section className="rounded-2xl border border-[#cfe4d5] bg-[#f1f8f3] p-5">
                      <FieldLabel>Approved assignment</FieldLabel>
                      <h3 className="mt-3 text-2xl font-black">{request.options.join(" + ")}</h3>
                      <p className="mt-4 rounded-2xl bg-white p-4 text-sm font-semibold leading-7 text-[#4f6259]">{request.note}</p>
                    </section>
                    <section className="rounded-2xl border border-[#eed9a8] bg-[#fff8e7] p-5">
                      <FieldLabel>Hidden from partner</FieldLabel>
                      <div className="mt-4 grid grid-cols-2 gap-3 text-xs font-black text-[#5f4b1f]">
                        <span className="rounded-xl bg-white/70 px-3 py-3">Internal notes</span>
                        <span className="rounded-xl bg-white/70 px-3 py-3">Clinical details</span>
                        <span className="rounded-xl bg-white/70 px-3 py-3">Emergency lane</span>
                        <span className="rounded-xl bg-white/70 px-3 py-3">Open chat</span>
                      </div>
                    </section>
                  </div>
                ) : (
                  <div className="mt-6 rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] p-6 text-sm font-bold text-[#4f6259]">No partner assignment yet. Grandview must approve first.</div>
                )}

                <div className="mt-6 grid gap-3 md:grid-cols-4">
                  {(["Contacted", "Visited", "Unable to reach", "Follow-up requested"] as Outcome[]).map((outcome) => (
                    <button key={outcome} type="button" disabled={!request.assigned} onClick={() => logOutcome(outcome)} className={cx("rounded-2xl border p-5 text-sm font-black transition", request.outcome === outcome ? "border-[#0f6b54] bg-[#e7f1eb] text-[#0f6b54]" : "border-[#d9dfd7] bg-white text-[#4f6259] hover:bg-[#f8fbf8]", !request.assigned && "opacity-50")}>{outcome}</button>
                  ))}
                </div>
              </Card>
            ) : null}

            {tab === "status" ? (
              <Card>
                <FieldLabel>Requester status</FieldLabel>
                <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em]">Approved status only.</h2>
                <div className="mt-6 grid gap-3">
                  {[
                    ["Request drafted", true],
                    ["Submitted to Grandview", request.submitted],
                    ["Facility reviewed", request.approved],
                    ["Hope Church assigned", request.assigned],
                    [request.outcome ? `Outcome logged: ${request.outcome}` : "Outcome pending", Boolean(request.outcome)],
                    ["Approved update available", request.updateReleased]
                  ].map(([label, done]) => (
                    <div key={String(label)} className={cx("flex items-center gap-4 rounded-2xl border p-4", done ? "border-[#cfe4d5] bg-[#e7f1eb]" : "border-[#d9dfd7] bg-[#f8fbf8]")}> 
                      <span className={cx("flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-black", done ? "bg-[#0f6b54] text-white" : "bg-white text-[#8b9991]")}>{done ? "✓" : ""}</span>
                      <span className="font-black text-[#0d2b3b]">{label}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ) : null}

            {tab === "bi" ? (
              <Card>
                <FieldLabel>BI / guardrail board</FieldLabel>
                <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em]">MVP contract readout.</h2>
                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  {[
                    ["No auth required for sandbox", true],
                    ["No Supabase writes", true],
                    ["Unsafe note filter active", unsafeMatches.length === 0],
                    ["Facility boundary enforced", !request.assigned || request.approved],
                    ["Partner sees approved context only", request.assigned ? request.approved : true],
                    ["Requester update released only after partner outcome", request.updateReleased ? Boolean(request.outcome) : true]
                  ].map(([label, pass]) => (
                    <div key={String(label)} className={cx("flex items-center justify-between rounded-2xl border p-4", pass ? "border-[#cfe4d5] bg-[#e7f1eb]" : "border-red-200 bg-red-50")}> 
                      <span className="font-black text-[#0d2b3b]">{label}</span>
                      <span className={cx("rounded-full px-3 py-1 text-xs font-black text-white", pass ? "bg-[#0f6b54]" : "bg-red-700")}>{pass ? "PASS" : "WARN"}</span>
                    </div>
                  ))}
                </div>
              </Card>
            ) : null}
          </section>

          <aside className="space-y-5">
            <Card>
              <FieldLabel>Sandbox record</FieldLabel>
              <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em]">One request</h2>
              <div className="mt-4 space-y-3 text-sm font-bold leading-6 text-[#4f6259]">
                <p><span className="text-[#0d2b3b]">Support:</span> {request.options.length ? request.options.join(", ") : "None selected"}</p>
                <p><span className="text-[#0d2b3b]">Facility:</span> Grandview Post Acute</p>
                <p><span className="text-[#0d2b3b]">Partner:</span> Hope Church</p>
                <p><span className="text-[#0d2b3b]">Outcome:</span> {request.outcome ?? "Pending"}</p>
              </div>
            </Card>

            <Card>
              <FieldLabel>Activity</FieldLabel>
              <ol className="mt-4 space-y-3 text-sm font-semibold leading-6 text-[#4f6259]">
                {request.activity.map((item) => <li key={item} className="rounded-2xl bg-[#f8fbf8] p-3">{item}</li>)}
              </ol>
            </Card>

            <Card className="bg-[#fff8e7] text-[#5f4b1f]">
              <FieldLabel>Reality check</FieldLabel>
              <p className="mt-3 text-sm font-bold leading-7">This is not production persistence yet. It is the working MVP path we can show today, then wire to Supabase once auth and schema are stable.</p>
            </Card>
          </aside>
        </div>
      </section>
    </main>
  );
}
