"use client";

import { useEffect, useMemo, useState } from "react";

type DemoTone = "green" | "blue" | "gold" | "slate";

type DemoStep = {
  id: string;
  actor: string;
  title: string;
  action: string;
  screenEyebrow: string;
  screenTitle: string;
  primaryBadge: string;
  screenItems: string[];
  timeline: string[];
  locked: string[];
  biCheck: string;
  result: string;
  cta: string;
  tone: DemoTone;
};

const STEP_MS = 10000;

const demoSteps: DemoStep[] = [
  {
    id: "requester-start",
    actor: "Synthetic requester",
    title: "Family opens intake",
    action: "The synthetic requester chooses safe spiritual-care options instead of typing an open medical story.",
    screenEyebrow: "Requester view",
    screenTitle: "What kind of support would help?",
    primaryBadge: "Guided request",
    screenItems: ["Prayer", "Friendly visit", "Encouragement", "Facility reviews before sharing"],
    timeline: ["Opened", "Choosing support", "Not submitted yet"],
    locked: ["No diagnosis field", "No emergency path", "No open chat"],
    biCheck: "No diagnosis, treatment, emergency, medication, insurance, or open-chat language is requested.",
    result: "PASS · Structured request",
    cta: "Continue to safe context",
    tone: "green"
  },
  {
    id: "requester-submit",
    actor: "Synthetic requester",
    title: "Safe context prepared",
    action: "The request becomes a limited spiritual-care note that Grandview can review before anything leaves the facility.",
    screenEyebrow: "Safe note",
    screenTitle: "They would appreciate prayer and a calm visit this week.",
    primaryBadge: "Facility review required",
    screenItems: ["Prayer requested", "Calm visit requested", "Requester can track status", "Grandview controls release"],
    timeline: ["Drafted", "Submitted", "Waiting on facility"],
    locked: ["Medical details hidden", "Partner cannot see yet", "No direct routing"],
    biCheck: "Requester copy explains that partner routing is controlled by the facility.",
    result: "PASS · Facility boundary",
    cta: "Send to facility review",
    tone: "blue"
  },
  {
    id: "facility-review",
    actor: "Synthetic facility reviewer",
    title: "Grandview reviews",
    action: "The facility reviewer sees the request, checks sharing rules, and decides what can be released.",
    screenEyebrow: "Facility console",
    screenTitle: "Review before partner release",
    primaryBadge: "Human approval",
    screenItems: ["Incoming request", "Consent/share state", "Hold unclear details", "Activity log"],
    timeline: ["Received", "Under review", "Release pending"],
    locked: ["Internal notes held", "No auto-assignment", "No bypassing Grandview"],
    biCheck: "Facility approval is required before partner access.",
    result: "PASS · Human review",
    cta: "Approve safe version",
    tone: "gold"
  },
  {
    id: "facility-release",
    actor: "Synthetic facility reviewer",
    title: "Partner-safe release",
    action: "Grandview releases only the approved spiritual-care need and basic coordination guidance to Hope Church.",
    screenEyebrow: "Approved release",
    screenTitle: "Partner-safe context only",
    primaryBadge: "Released by Grandview",
    screenItems: ["Prayer requested", "Friendly visit requested", "Basic coordination", "No clinical details"],
    timeline: ["Reviewed", "Approved", "Sent to partner"],
    locked: ["No internal facility notes", "No diagnosis", "No private details"],
    biCheck: "Partner receives approved context only and cannot see internal facility notes.",
    result: "PASS · Scoped partner view",
    cta: "Send to Hope Church",
    tone: "green"
  },
  {
    id: "partner-assignment",
    actor: "Synthetic partner",
    title: "Hope Church receives",
    action: "The partner sees enough to prepare for care, but not enough to become a medical or counseling record.",
    screenEyebrow: "Partner workspace",
    screenTitle: "Prepare for a calm visit",
    primaryBadge: "Approved context",
    screenItems: ["Assignment summary", "Visit preparation", "Safe outcome choices", "Report-back lane"],
    timeline: ["Assigned", "Preparing", "Visit not logged yet"],
    locked: ["Private details hidden", "No counseling chart", "No open messaging"],
    biCheck: "Partner page does not become a counseling chart, medical record, or uncontrolled messaging lane.",
    result: "PASS · Partner guardrails",
    cta: "Log safe outcome",
    tone: "blue"
  },
  {
    id: "partner-report",
    actor: "Synthetic partner",
    title: "Safe outcome logged",
    action: "The partner reports a structured outcome instead of writing private details into a free-form thread.",
    screenEyebrow: "Report back",
    screenTitle: "Visited · follow-up welcomed",
    primaryBadge: "Structured outcome",
    screenItems: ["Contacted", "Visited", "Unable to reach", "Follow-up requested"],
    timeline: ["Visited", "Outcome selected", "Update sent for approval"],
    locked: ["No private narrative", "No medical documentation", "No sensitive detail"],
    biCheck: "Report-back does not expose private details or create medical documentation.",
    result: "PASS · Safe report-back",
    cta: "Send approved update",
    tone: "gold"
  },
  {
    id: "requester-update",
    actor: "Synthetic requester",
    title: "Requester update shown",
    action: "The requester sees progress without internal facility notes or partner-only details.",
    screenEyebrow: "Requester status",
    screenTitle: "Your request has an approved update",
    primaryBadge: "Approved update",
    screenItems: ["Request received", "Facility reviewed", "Partner assigned", "Update available"],
    timeline: ["Received", "Reviewed", "Updated"],
    locked: ["Internal notes hidden", "Partner details hidden", "Only approved status"],
    biCheck: "Requester sees approved updates only; internal review details stay hidden.",
    result: "PASS · Approved status only",
    cta: "View status path",
    tone: "green"
  },
  {
    id: "bi-readout",
    actor: "BI synthetic inspector",
    title: "Run summary generated",
    action: "BI compares the visible path against /ai-map, /synthetic-smoke, and NSB guardrails.",
    screenEyebrow: "BI readout",
    screenTitle: "Synthetic demo pass",
    primaryBadge: "Inspection complete",
    screenItems: ["Preview chain complete", "No writes", "No medical workflow", "Auth remains separate"],
    timeline: ["Routes found", "Guardrails checked", "Report ready"],
    locked: ["Known auth issue isolated", "PWA issue tracked", "Playwright later"],
    biCheck: "Safe preview chain is complete; real writes remain behind /pilot.",
    result: "PASS · Demo ready",
    cta: "Open inspection surfaces",
    tone: "slate"
  }
];

const validationRows = [
  "No auth required",
  "No Supabase calls or writes",
  "No medical workflow",
  "Facility approves before partner release",
  "Partner sees approved context only",
  "Requester sees approved updates only"
];

function toneClasses(tone: DemoTone) {
  if (tone === "green") return "border-[#cfe4d5] bg-[#f1f8f3] text-[#173b2d]";
  if (tone === "blue") return "border-[#c9dbe5] bg-[#f0f7fa] text-[#082838]";
  if (tone === "gold") return "border-[#eed9a8] bg-[#fff8e7] text-[#5f4b1f]";
  return "border-[#d9dfd7] bg-white text-[#0d2b3b]";
}

function dotClasses(active: boolean, complete: boolean) {
  if (active) return "w-12 bg-[#d6a943]";
  if (complete) return "w-6 bg-[#0f6b54]";
  return "w-6 bg-white/25";
}

export default function SyntheticDemoPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const activeStep = demoSteps[activeIndex];
  const progress = useMemo(() => Math.round(((activeIndex + 1) / demoSteps.length) * 100), [activeIndex]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => {
        if (current >= demoSteps.length - 1) {
          setIsPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, STEP_MS);

    return () => window.clearInterval(timer);
  }, [isPlaying]);

  function goNext() {
    setIsPlaying(false);
    setActiveIndex((current) => Math.min(current + 1, demoSteps.length - 1));
  }

  function goBack() {
    setIsPlaying(false);
    setActiveIndex((current) => Math.max(current - 1, 0));
  }

  function restart() {
    setIsPlaying(false);
    setActiveIndex(0);
  }

  return (
    <main className="min-h-screen bg-[#edf4f0] text-[#0d2b3b]">
      <nav className="border-b border-white/10 bg-[#082838] px-4 py-4 text-white shadow-xl shadow-[#0d2b3b]/15 md:px-8">
        <div className="mx-auto flex max-w-[118rem] flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <a href="/admin" className="flex items-center gap-3">
            <span className="flex h-11 w-14 items-center justify-center rounded-2xl bg-white p-2 shadow-sm md:h-12 md:w-16">
              <img src="/brand/churchwork-corner-logo.png" alt="ChurchWork logo" className="h-full w-full object-contain" />
            </span>
            <span>
              <span className="block font-serif text-2xl font-semibold tracking-[-0.03em]">Church<span className="text-[#8dbd9e]">Work</span></span>
              <span className="block text-xs font-semibold text-[#d9e7df]">Synthetic Super Demo · Manual theater</span>
            </span>
          </a>

          <div className="flex flex-wrap gap-2">
            <a href="/preview" className="rounded-full border border-white/15 bg-white/8 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#d9e7df]">Preview</a>
            <a href="/synthetic-smoke" className="rounded-full border border-white/15 bg-white/8 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#d9e7df]">Smoke</a>
            <a href="/admin" className="rounded-full bg-[#d6a943] px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#082838]">Admin</a>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-[118rem] px-4 py-5 md:px-8 md:py-10">
        <div className="grid gap-5 xl:grid-cols-[1.12fr_0.88fr] xl:items-start">
          <section className="overflow-hidden rounded-[2rem] border border-[#d9dfd7] bg-[#082838] p-4 text-white shadow-xl shadow-[#0d2b3b]/15 md:p-7">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#c7e2d0]">Demo theater v2</p>
                <h1 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.05em] md:text-5xl">Tap through the ChurchWork loop.</h1>
              </div>
              <span className="rounded-full bg-[#d6a943] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#082838]">Step {activeIndex + 1} / {demoSteps.length}</span>
            </div>

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/15">
              <div className="h-full rounded-full bg-[#d6a943] transition-all duration-700" style={{ width: `${progress}%` }} />
            </div>

            <div className="mt-5 mx-auto max-w-[28rem] rounded-[2.4rem] border border-white/20 bg-[#0b1720] p-3 shadow-2xl shadow-black/30 md:max-w-[34rem]">
              <div className="overflow-hidden rounded-[1.8rem] bg-[#f8fbf8] text-[#0d2b3b]">
                <div className="flex items-center justify-between bg-white px-4 py-3 shadow-sm">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#506a49]">{activeStep.screenEyebrow}</p>
                    <p className="font-serif text-xl font-semibold tracking-[-0.04em]">ChurchWork</p>
                  </div>
                  <span className="rounded-full bg-[#e7f1eb] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-[#0f6b54]">Safe</span>
                </div>

                <div className="p-4 md:p-5">
                  <div className={`rounded-[1.5rem] border p-5 ${toneClasses(activeStep.tone)}`}>
                    <p className="text-xs font-black uppercase tracking-[0.16em]">{activeStep.primaryBadge}</p>
                    <h2 className="mt-3 font-serif text-2xl font-semibold tracking-[-0.04em] md:text-3xl">{activeStep.screenTitle}</h2>
                    <div className="mt-5 grid gap-3">
                      {activeStep.screenItems.map((item) => (
                        <div key={item} className="flex items-center gap-3 rounded-2xl border border-current/15 bg-white/70 p-3 text-sm font-black">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-base">✓</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 rounded-[1.25rem] border border-[#d9dfd7] bg-white p-4">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#506a49]">Visible status path</p>
                    <div className="mt-4 space-y-3">
                      {activeStep.timeline.map((item, index) => (
                        <div key={item} className="flex items-center gap-3 text-sm font-bold text-[#4f6259]">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0f6b54] text-xs font-black text-white">{index + 1}</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {activeStep.locked.map((item) => (
                      <div key={item} className="rounded-2xl border border-[#eed9a8] bg-[#fff8e7] p-3 text-center text-xs font-black uppercase tracking-[0.08em] text-[#5f4b1f]">
                        {item}
                      </div>
                    ))}
                  </div>

                  <button type="button" onClick={goNext} className="mt-5 w-full rounded-2xl bg-[#082838] px-5 py-4 text-sm font-black text-white shadow-lg">
                    {activeStep.cta}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              {demoSteps.map((step, index) => (
                <button key={step.id} type="button" onClick={() => { setIsPlaying(false); setActiveIndex(index); }} aria-label={`Go to step ${index + 1}`}>
                  <span className={`block h-3 rounded-full transition-all ${dotClasses(index === activeIndex, index < activeIndex)}`} />
                </button>
              ))}
            </div>
          </section>

          <aside className="space-y-5">
            <section className="rounded-[2rem] border border-[#d9dfd7] bg-white p-5 shadow-sm shadow-[#0d2b3b]/5 md:p-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Current synthetic user</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#0d2b3b]">{activeStep.actor}</h2>
              <p className="mt-3 text-sm font-semibold leading-7 text-[#4f6259]">{activeStep.action}</p>
              <div className="mt-4 rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#506a49]">BI checking</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-[#4f6259]">{activeStep.biCheck}</p>
              </div>
              <div className="mt-4 rounded-2xl bg-[#173b2d] p-4 text-sm font-black uppercase tracking-[0.1em] text-white">
                {activeStep.result}
              </div>
            </section>

            <section className="rounded-[2rem] border border-[#d9dfd7] bg-white p-5 shadow-sm shadow-[#0d2b3b]/5 md:p-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Controls</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button type="button" onClick={goBack} className="rounded-xl border border-[#d9dfd7] bg-[#f8fbf8] px-4 py-4 text-sm font-black text-[#0d2b3b]">Back</button>
                <button type="button" onClick={goNext} className="rounded-xl bg-[#082838] px-4 py-4 text-sm font-black text-white shadow-lg">Next</button>
                <button type="button" onClick={() => setIsPlaying((value) => !value)} className="rounded-xl border border-[#d9dfd7] bg-[#f8fbf8] px-4 py-4 text-sm font-black text-[#0d2b3b]">
                  {isPlaying ? "Pause" : "Slow play"}
                </button>
                <button type="button" onClick={restart} className="rounded-xl border border-[#d9dfd7] bg-[#f8fbf8] px-4 py-4 text-sm font-black text-[#0d2b3b]">Restart</button>
              </div>
              <p className="mt-4 rounded-2xl bg-[#fff8e7] p-4 text-sm font-semibold leading-6 text-[#5f4b1f]">
                Manual by default. Slow play advances every {STEP_MS / 1000} seconds and stops at the end.
              </p>
            </section>

            <section className="rounded-[2rem] border border-[#d9dfd7] bg-white p-5 shadow-sm shadow-[#0d2b3b]/5 md:p-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Guardrails</p>
              <div className="mt-4 grid gap-2">
                {validationRows.map((row) => (
                  <div key={row} className="flex items-center gap-3 rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] p-3 text-sm font-bold text-[#4f6259]">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#0f6b54]" />
                    <span>{row}</span>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>

        <section className="mt-5 rounded-[2rem] border border-[#d9dfd7] bg-white p-5 shadow-sm shadow-[#0d2b3b]/5 md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Timeline</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#0d2b3b]">Pick any synthetic scene.</h2>
            </div>
            <span className="rounded-full bg-[#e7f1eb] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-[#0f6b54]">No real data</span>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {demoSteps.map((step, index) => {
              const active = index === activeIndex;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => { setIsPlaying(false); setActiveIndex(index); }}
                  className={`rounded-2xl border p-4 text-left transition ${active ? "border-[#0f3f35] bg-[#e7f1eb] shadow-md" : "border-[#d9dfd7] bg-[#f8fbf8] hover:bg-white"}`}
                >
                  <span className="text-xs font-black uppercase tracking-[0.14em] text-[#506a49]">Step {index + 1}</span>
                  <span className="mt-2 block font-serif text-xl font-semibold tracking-[-0.04em] text-[#0d2b3b]">{step.title}</span>
                  <span className="mt-2 block text-sm font-semibold leading-6 text-[#4f6259]">{step.actor}</span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a href="/preview" className="rounded-xl bg-[#082838] px-5 py-3 text-center text-sm font-black text-white shadow-lg hover:bg-[#0f3f35]">Open preview chain</a>
          <a href="/synthetic-smoke" className="rounded-xl border border-[#d9dfd7] bg-white px-5 py-3 text-center text-sm font-black text-[#0d2b3b]">Open smoke contract</a>
          <a href="/ai-map" className="rounded-xl border border-[#d9dfd7] bg-white px-5 py-3 text-center text-sm font-black text-[#0d2b3b]">Open AI map</a>
          <a href="/admin" className="rounded-xl border border-[#d9dfd7] bg-white px-5 py-3 text-center text-sm font-black text-[#0d2b3b]">Back to admin</a>
        </div>
      </section>
    </main>
  );
}
