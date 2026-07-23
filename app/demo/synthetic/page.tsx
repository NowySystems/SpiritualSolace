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
  screenItems: string[];
  biCheck: string;
  result: string;
  cta: string;
  tone: DemoTone;
};

const demoSteps: DemoStep[] = [
  {
    id: "requester-start",
    actor: "Synthetic requester",
    title: "Family opens a guided request",
    action: "The synthetic requester starts with safe spiritual-care choices instead of an open medical story.",
    screenEyebrow: "Requester view",
    screenTitle: "What kind of support would help?",
    screenItems: ["Prayer", "Friendly visit", "Encouragement", "Facility reviews before sharing"],
    biCheck: "No diagnosis, treatment, emergency, medication, insurance, or open-chat language is requested.",
    result: "PASS · Structured spiritual-care request",
    cta: "Continue to safe context",
    tone: "green"
  },
  {
    id: "requester-submit",
    actor: "Synthetic requester",
    title: "Safe context is prepared",
    action: "The request becomes a limited spiritual-care note that Grandview can review before anything leaves the facility.",
    screenEyebrow: "Safe note",
    screenTitle: "They would appreciate prayer and a calm visit this week.",
    screenItems: ["No medical details", "No emergency language", "Grandview approval required", "Requester can track status"],
    biCheck: "Requester copy explains that partner routing is controlled by the facility.",
    result: "PASS · Facility remains the boundary",
    cta: "Send to facility review",
    tone: "blue"
  },
  {
    id: "facility-review",
    actor: "Synthetic facility reviewer",
    title: "Grandview receives the request",
    action: "The facility reviewer sees the request, sharing rules, and release decision before Hope Church sees anything.",
    screenEyebrow: "Facility console",
    screenTitle: "Review before partner release",
    screenItems: ["Incoming request snapshot", "Sharing status", "Hold back unclear details", "Activity log"],
    biCheck: "Facility approval is required before partner access.",
    result: "PASS · Human review required",
    cta: "Approve safe version",
    tone: "gold"
  },
  {
    id: "facility-release",
    actor: "Synthetic facility reviewer",
    title: "Approved partner context is released",
    action: "Grandview releases only the spiritual-care need and basic coordination guidance to Hope Church.",
    screenEyebrow: "Approved release",
    screenTitle: "Partner-safe context only",
    screenItems: ["Prayer requested", "Friendly visit requested", "No clinical details", "No internal notes"],
    biCheck: "Partner receives approved context only and cannot see internal facility notes.",
    result: "PASS · Scoped partner view",
    cta: "Send to Hope Church",
    tone: "green"
  },
  {
    id: "partner-assignment",
    actor: "Synthetic partner",
    title: "Hope Church receives the assignment",
    action: "The partner sees enough to prepare for care, but not enough to become a medical or counseling record.",
    screenEyebrow: "Partner workspace",
    screenTitle: "Prepare for a calm visit",
    screenItems: ["Approved context", "Visit preparation", "Hidden private details", "Safe outcome options"],
    biCheck: "Partner page does not become a counseling chart, medical record, or uncontrolled messaging lane.",
    result: "PASS · Partner guardrails intact",
    cta: "Log safe outcome",
    tone: "blue"
  },
  {
    id: "partner-report",
    actor: "Synthetic partner",
    title: "Safe report-back is logged",
    action: "The partner reports a structured outcome instead of writing private details into a free-form thread.",
    screenEyebrow: "Report back",
    screenTitle: "Visited · follow-up welcomed",
    screenItems: ["Contacted", "Visited", "Unable to reach", "Follow-up requested"],
    biCheck: "Report-back does not expose private details or create medical documentation.",
    result: "PASS · Safe outcome language",
    cta: "Send approved update",
    tone: "gold"
  },
  {
    id: "requester-update",
    actor: "Synthetic requester",
    title: "Requester sees an approved update",
    action: "The requester sees progress without internal facility notes or partner-only details.",
    screenEyebrow: "Requester status",
    screenTitle: "Your request has an approved update",
    screenItems: ["Received", "Facility reviewed", "Partner assigned", "Approved update available"],
    biCheck: "Requester sees approved updates only; internal review details stay hidden.",
    result: "PASS · Approved status only",
    cta: "View status path",
    tone: "green"
  },
  {
    id: "bi-readout",
    actor: "BI synthetic inspector",
    title: "Run summary is generated",
    action: "BI compares the path against /ai-map, /synthetic-smoke, and NSB guardrails.",
    screenEyebrow: "BI readout",
    screenTitle: "Synthetic demo pass",
    screenItems: ["Preview chain complete", "No writes", "No medical workflow", "Auth remains separate"],
    biCheck: "Safe preview chain is complete; real writes remain behind /pilot.",
    result: "PASS · Demo ready for human review",
    cta: "Open inspection surfaces",
    tone: "slate"
  }
];

const validationRows = [
  "No auth required for demo playback",
  "No Supabase calls or writes",
  "No medical workflow",
  "Facility approves before partner release",
  "Partner sees approved context only",
  "Requester sees approved updates only",
  "BI can compare this path to /synthetic-smoke"
];

function toneClasses(tone: DemoTone) {
  if (tone === "green") return "border-[#cfe4d5] bg-[#f1f8f3] text-[#173b2d]";
  if (tone === "blue") return "border-[#c9dbe5] bg-[#f0f7fa] text-[#082838]";
  if (tone === "gold") return "border-[#eed9a8] bg-[#fff8e7] text-[#5f4b1f]";
  return "border-[#d9dfd7] bg-white text-[#0d2b3b]";
}

function StepDot({ active, complete }: { active: boolean; complete: boolean }) {
  return (
    <span
      className={`block h-2.5 rounded-full transition-all ${
        active ? "w-10 bg-[#d6a943]" : complete ? "w-5 bg-[#0f6b54]" : "w-5 bg-white/25"
      }`}
    />
  );
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
    }, 7200);

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
    setActiveIndex(0);
    setIsPlaying(false);
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
              <span className="block text-xs font-semibold text-[#d9e7df]">Synthetic Super Demo · Tap-through mode</span>
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
        <div className="rounded-[1.5rem] border border-[#ddb66c]/60 bg-[#fff8e7] p-4 text-sm font-semibold leading-6 text-[#5f4b1f] shadow-sm shadow-[#0d2b3b]/5 md:p-5">
          Mobile demo mode: playback is paused by default. Tap Next to watch the staged synthetic user move through the workflow. No auth, no Supabase, no writes.
        </div>

        <div className="mt-5 overflow-hidden rounded-[2rem] border border-[#d9dfd7] bg-white shadow-xl shadow-[#0d2b3b]/8">
          <div className="grid gap-0 xl:grid-cols-[0.9fr_1.1fr]">
            <section className="bg-[#0f3f35] px-5 py-7 text-white md:px-10 md:py-12">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#c7e2d0]">Synthetic super demo</p>
              <h1 className="mt-3 max-w-4xl font-serif text-3xl font-semibold tracking-[-0.05em] md:text-6xl">
                Watch the care loop one step at a time.
              </h1>
              <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-[#d9e7df] md:text-base md:leading-8">
                This is a staged demo-theater version of the future synthetic user. It shows what each role sees and what BI validates.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
                <button type="button" onClick={goBack} className="rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm font-black text-white">
                  Back
                </button>
                <button type="button" onClick={goNext} className="rounded-xl bg-white px-4 py-3 text-sm font-black text-[#082838] shadow-lg">
                  Next step
                </button>
                <button type="button" onClick={() => setIsPlaying((value) => !value)} className="rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm font-black text-white">
                  {isPlaying ? "Pause" : "Slow play"}
                </button>
                <button type="button" onClick={restart} className="rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm font-black text-white">
                  Restart
                </button>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                {demoSteps.map((step, index) => (
                  <button key={step.id} type="button" onClick={() => { setIsPlaying(false); setActiveIndex(index); }} aria-label={`Go to step ${index + 1}`}>
                    <StepDot active={index === activeIndex} complete={index < activeIndex} />
                  </button>
                ))}
              </div>
            </section>

            <aside className="bg-[#082838] p-4 text-white md:p-7">
              <div className="mx-auto max-w-md rounded-[2rem] border border-white/15 bg-[#edf4f0] p-3 text-[#0d2b3b] shadow-2xl shadow-black/20 md:max-w-xl">
                <div className="rounded-[1.5rem] bg-white p-4 shadow-sm md:p-6">
                  <div className="flex items-center justify-between gap-3 border-b border-[#d9dfd7] pb-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#506a49]">{activeStep.screenEyebrow}</p>
                      <h2 className="mt-1 font-serif text-2xl font-semibold tracking-[-0.04em] md:text-3xl">{activeStep.screenTitle}</h2>
                    </div>
                    <span className="rounded-full bg-[#e7f1eb] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-[#0f6b54]">
                      {activeIndex + 1}/{demoSteps.length}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {activeStep.screenItems.map((item) => (
                      <div key={item} className="flex items-center gap-3 rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] p-4 text-sm font-bold text-[#4f6259]">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#0f6b54]" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <button type="button" onClick={goNext} className="mt-5 w-full rounded-2xl bg-[#082838] px-5 py-4 text-sm font-black text-white shadow-lg">
                    {activeStep.cta}
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>

        <div className="mt-5 grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <section className={`rounded-[1.5rem] border p-5 shadow-sm shadow-[#0d2b3b]/5 md:p-6 ${toneClasses(activeStep.tone)}`}>
            <p className="text-xs font-black uppercase tracking-[0.18em]">Now acting as</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em] md:text-4xl">{activeStep.actor}</h2>
            <p className="mt-4 text-base font-semibold leading-7">{activeStep.action}</p>
            <div className="mt-5 rounded-2xl border border-current/15 bg-white/70 p-4 text-sm font-black uppercase tracking-[0.12em]">
              {activeStep.result}
            </div>
          </section>

          <aside className="rounded-[1.5rem] border border-[#d9dfd7] bg-white p-5 shadow-sm shadow-[#0d2b3b]/5 md:p-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">BI is checking</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#0d2b3b]">Guardrail validation</h2>
            <p className="mt-4 text-base font-semibold leading-7 text-[#4f6259]">{activeStep.biCheck}</p>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#e7f1eb]">
              <div className="h-full rounded-full bg-[#0f6b54] transition-all duration-700" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-3 text-sm font-black uppercase tracking-[0.14em] text-[#0f6b54]">{progress}% through staged run</p>
          </aside>
        </div>

        <section className="mt-5 rounded-[1.5rem] border border-[#d9dfd7] bg-white p-5 shadow-sm shadow-[#0d2b3b]/5 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Tap any scene</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#0d2b3b]">Synthetic user path</h2>
            </div>
            <span className="w-fit rounded-full bg-[#e7f1eb] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-[#0f6b54]">Demo theater v2</span>
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

        <section className="mt-5 rounded-[1.5rem] border border-[#d9dfd7] bg-white p-5 shadow-sm shadow-[#0d2b3b]/5 md:p-6">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Validation board</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {validationRows.map((row) => (
              <div key={row} className="flex gap-3 rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] p-4 text-sm font-semibold leading-6 text-[#4f6259]">
                <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#0f6b54]" />
                <span>{row}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_24rem]">
          <section className="rounded-[1.5rem] border border-[#d9dfd7] bg-white p-5 shadow-sm shadow-[#0d2b3b]/5 md:p-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Where this goes next</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#0d2b3b]">Later, this becomes a real watchable synthetic run.</h2>
            <p className="mt-4 text-sm font-semibold leading-7 text-[#4f6259]">
              This demo is staged and reliable. The future Playwright version will open the real app in a headed browser, click through the same path, capture screenshots/video, record console errors, and compare the rendered output against /ai-map and /synthetic-smoke.
            </p>
          </section>

          <aside className="rounded-[1.5rem] border border-[#d9dfd7] bg-white p-5 shadow-sm shadow-[#0d2b3b]/5 md:p-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Inspection links</p>
            <div className="mt-5 flex flex-col gap-3">
              <a href="/preview" className="rounded-xl bg-[#082838] px-5 py-3 text-center text-sm font-black text-white shadow-lg hover:bg-[#0f3f35]">Open preview chain</a>
              <a href="/synthetic-smoke" className="rounded-xl border border-[#d9dfd7] bg-[#f8fbf8] px-5 py-3 text-center text-sm font-black text-[#0d2b3b]">Open smoke contract</a>
              <a href="/ai-map" className="rounded-xl border border-[#d9dfd7] bg-[#f8fbf8] px-5 py-3 text-center text-sm font-black text-[#0d2b3b]">Open AI map</a>
              <a href="/admin" className="rounded-xl border border-[#d9dfd7] bg-[#f8fbf8] px-5 py-3 text-center text-sm font-black text-[#0d2b3b]">Back to admin</a>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
