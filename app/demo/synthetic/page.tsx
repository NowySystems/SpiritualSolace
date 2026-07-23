"use client";

import { useEffect, useMemo, useState } from "react";

type DemoTone = "green" | "blue" | "gold" | "slate";

type DemoStep = {
  id: string;
  actor: string;
  title: string;
  action: string;
  visibleToUser: string;
  biCheck: string;
  result: string;
  tone: DemoTone;
};

const demoSteps: DemoStep[] = [
  {
    id: "requester-start",
    actor: "Synthetic requester",
    title: "Family opens a guided request",
    action: "Chooses prayer and a friendly visit instead of typing an open-ended medical story.",
    visibleToUser: "Simple intake choices, safe context note, and clear facility-review boundary.",
    biCheck: "No diagnosis, treatment, emergency, medication, insurance, or open-chat language is requested.",
    result: "PASS · Structured spiritual-care request",
    tone: "green"
  },
  {
    id: "requester-submit",
    actor: "Synthetic requester",
    title: "Safe context is prepared",
    action: "Adds: They would appreciate prayer and a calm visit this week.",
    visibleToUser: "The requester sees that Grandview reviews before anything is shared.",
    biCheck: "Requester copy explains that partner routing is controlled by the facility.",
    result: "PASS · Facility remains the boundary",
    tone: "blue"
  },
  {
    id: "facility-review",
    actor: "Synthetic facility reviewer",
    title: "Grandview receives the request",
    action: "Reviews safe context, confirms what can leave the facility, and holds back anything unclear.",
    visibleToUser: "Facility sees request snapshot, sharing rules, release decision, and activity log.",
    biCheck: "Facility approval is required before Hope Church sees anything.",
    result: "PASS · Human review required",
    tone: "gold"
  },
  {
    id: "facility-release",
    actor: "Synthetic facility reviewer",
    title: "Approved partner context is released",
    action: "Sends only the spiritual-care need and basic coordination guidance to Hope Church.",
    visibleToUser: "Approved context says prayer/friendly visit; no medical details are included.",
    biCheck: "Partner receives approved context only and cannot see internal facility notes.",
    result: "PASS · Scoped partner view",
    tone: "green"
  },
  {
    id: "partner-assignment",
    actor: "Synthetic partner",
    title: "Hope Church receives the assignment",
    action: "Reviews approved context, prepares for a calm visit, and avoids counseling/emergency language.",
    visibleToUser: "Partner sees assignment, preparation guidance, hidden details, and safe outcome choices.",
    biCheck: "Partner page does not become a counseling chart, medical record, or uncontrolled messaging lane.",
    result: "PASS · Partner guardrails intact",
    tone: "blue"
  },
  {
    id: "partner-report",
    actor: "Synthetic partner",
    title: "Safe report-back is logged",
    action: "Marks visited and leaves a limited, facility-safe update.",
    visibleToUser: "Outcome language stays structured: contacted, visited, unable to reach, follow-up requested.",
    biCheck: "Report-back does not expose private details or create medical documentation.",
    result: "PASS · Safe outcome language",
    tone: "gold"
  },
  {
    id: "requester-update",
    actor: "Synthetic requester",
    title: "Requester sees an approved update",
    action: "Views status progress without internal facility notes or partner-only details.",
    visibleToUser: "Received → facility review → partner assignment → update available.",
    biCheck: "Requester sees approved updates only; internal review details stay hidden.",
    result: "PASS · Approved status only",
    tone: "green"
  },
  {
    id: "bi-readout",
    actor: "BI synthetic inspector",
    title: "Run summary is generated",
    action: "Compares the demo path against /ai-map, /synthetic-smoke, and NSB guardrails.",
    visibleToUser: "The demo ends with pass/warn/fail checks and links to inspection surfaces.",
    biCheck: "Safe preview chain is complete; real writes remain behind /pilot.",
    result: "PASS · Demo ready for human review",
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

function StepPill({ active, children }: { active: boolean; children: string }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.1em] ${active ? "bg-[#d6a943] text-[#082838]" : "bg-white/10 text-white/70"}`}>
      {children}
    </span>
  );
}

export default function SyntheticDemoPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const activeStep = demoSteps[activeIndex];
  const progress = useMemo(() => Math.round(((activeIndex + 1) / demoSteps.length) * 100), [activeIndex]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % demoSteps.length);
    }, 3200);

    return () => window.clearInterval(timer);
  }, [isPlaying]);

  return (
    <main className="min-h-screen bg-[#edf4f0] text-[#0d2b3b]">
      <nav className="border-b border-white/10 bg-[#082838] px-5 py-4 text-white shadow-xl shadow-[#0d2b3b]/15 md:px-8">
        <div className="mx-auto flex max-w-[118rem] flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <a href="/admin" className="flex items-center gap-4">
            <span className="flex h-12 w-16 items-center justify-center rounded-2xl bg-white p-2 shadow-sm">
              <img src="/brand/churchwork-corner-logo.png" alt="ChurchWork logo" className="h-full w-full object-contain" />
            </span>
            <span>
              <span className="block font-serif text-2xl font-semibold tracking-[-0.03em]">Church<span className="text-[#8dbd9e]">Work</span></span>
              <span className="block text-xs font-semibold text-[#d9e7df]">Synthetic Super Demo · No auth · No database</span>
            </span>
          </a>

          <div className="flex flex-wrap gap-2">
            <a href="/preview" className="rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#d9e7df]">Preview</a>
            <a href="/ai-map" className="rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#d9e7df]">AI map</a>
            <a href="/synthetic-smoke" className="rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#d9e7df]">Smoke</a>
            <a href="/admin" className="rounded-full bg-[#d6a943] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-[#082838]">Admin</a>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-[118rem] px-5 py-8 md:px-8 md:py-12">
        <div className="rounded-[2rem] border border-[#ddb66c]/60 bg-[#fff8e7] p-5 text-sm font-semibold leading-7 text-[#5f4b1f] shadow-sm shadow-[#0d2b3b]/5 md:p-6">
          Safe demo route. This is a staged synthetic-user playback only. It does not sign in, call Supabase, write records, collect medical data, or trigger partner routing.
        </div>

        <div className="mt-6 overflow-hidden rounded-[2rem] border border-[#d9dfd7] bg-white shadow-xl shadow-[#0d2b3b]/8">
          <div className="grid gap-0 xl:grid-cols-[1.05fr_0.95fr]">
            <section className="bg-[#0f3f35] px-6 py-10 text-white md:px-10 md:py-14">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#c7e2d0]">Synthetic super demo</p>
              <h1 className="mt-4 max-w-5xl font-serif text-4xl font-semibold tracking-[-0.05em] md:text-6xl">
                Watch ChurchWork act out the whole care loop.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[#d9e7df]">
                This is the smooth demo-theater version of the future synthetic user: requester, facility, partner, and BI all move through the pilot workflow with guardrails visible at every step.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setIsPlaying((value) => !value)}
                  className="rounded-xl bg-white px-5 py-3 text-center text-sm font-black text-[#082838] shadow-lg"
                >
                  {isPlaying ? "Pause playback" : "Play demo"}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveIndex((current) => (current + 1) % demoSteps.length)}
                  className="rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-center text-sm font-black text-white"
                >
                  Next step
                </button>
              </div>
            </section>

            <aside className="bg-[#082838] p-5 text-white md:p-7">
              <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-5 shadow-sm shadow-[#0d2b3b]/5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#c7e2d0]">Live playback</p>
                <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.04em]">{activeStep.actor}</h2>
                <p className="mt-3 text-sm font-semibold leading-7 text-[#d9e7df]">{activeStep.action}</p>
                <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/15">
                  <div className="h-full rounded-full bg-[#d6a943] transition-all duration-700" style={{ width: `${progress}%` }} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {demoSteps.map((step, index) => (
                    <button key={step.id} type="button" onClick={() => setActiveIndex(index)}>
                      <StepPill active={index === activeIndex}>{String(index + 1).padStart(2, "0")}</StepPill>
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>

        <div className="mt-7 grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <section className={`rounded-[1.5rem] border p-6 shadow-sm shadow-[#0d2b3b]/5 ${toneClasses(activeStep.tone)}`}>
            <p className="text-xs font-black uppercase tracking-[0.18em]">Current scene</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em]">{activeStep.title}</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <article className="rounded-2xl border border-current/15 bg-white/55 p-5">
                <p className="text-xs font-black uppercase tracking-[0.14em]">What the person sees</p>
                <p className="mt-3 text-sm font-semibold leading-7">{activeStep.visibleToUser}</p>
              </article>
              <article className="rounded-2xl border border-current/15 bg-white/55 p-5">
                <p className="text-xs font-black uppercase tracking-[0.14em]">What BI is checking</p>
                <p className="mt-3 text-sm font-semibold leading-7">{activeStep.biCheck}</p>
              </article>
            </div>
            <div className="mt-5 rounded-2xl border border-current/15 bg-white/70 p-5 text-sm font-black uppercase tracking-[0.12em]">
              {activeStep.result}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[1.5rem] border border-[#d9dfd7] bg-white p-6 shadow-sm shadow-[#0d2b3b]/5">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Validation board</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#0d2b3b]">What stays true during the demo.</h2>
              <ul className="mt-5 space-y-3 text-sm font-semibold leading-6 text-[#4f6259]">
                {validationRows.map((row) => (
                  <li key={row} className="flex gap-3 rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] p-4">
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#0f6b54]" />
                    <span>{row}</span>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>

        <section className="mt-7 rounded-[1.5rem] border border-[#d9dfd7] bg-white p-6 shadow-sm shadow-[#0d2b3b]/5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Full demo timeline</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#0d2b3b]">The synthetic user path.</h2>
            </div>
            <span className="rounded-full bg-[#e7f1eb] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-[#0f6b54]">Demo theater v1</span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {demoSteps.map((step, index) => {
              const active = index === activeIndex;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`rounded-2xl border p-5 text-left transition ${active ? "border-[#0f3f35] bg-[#e7f1eb] shadow-md" : "border-[#d9dfd7] bg-[#f8fbf8] hover:bg-white"}`}
                >
                  <span className="text-xs font-black uppercase tracking-[0.14em] text-[#506a49]">Step {index + 1}</span>
                  <span className="mt-3 block font-serif text-2xl font-semibold tracking-[-0.04em] text-[#0d2b3b]">{step.title}</span>
                  <span className="mt-3 block text-sm font-semibold leading-6 text-[#4f6259]">{step.actor}</span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_24rem]">
          <section className="rounded-[1.5rem] border border-[#d9dfd7] bg-white p-6 shadow-sm shadow-[#0d2b3b]/5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Where this goes next</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#0d2b3b]">Later, this becomes a real watchable synthetic run.</h2>
            <p className="mt-4 text-sm font-semibold leading-7 text-[#4f6259]">
              This demo is staged and reliable. The future Playwright version will open the real app in a headed browser, click through the same path, capture screenshots/video, record console errors, and compare the rendered output against /ai-map and /synthetic-smoke.
            </p>
          </section>

          <aside className="rounded-[1.5rem] border border-[#d9dfd7] bg-white p-6 shadow-sm shadow-[#0d2b3b]/5">
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
