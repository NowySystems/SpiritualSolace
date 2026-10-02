"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

type Scene = "facility_setup" | "partner_setup" | "requester" | "facility" | "partner" | "status" | "bi";

type Action = {
  stepId: string;
  scene: Scene;
  actor: string;
  verb: string;
  detail: string;
  focus: string;
  x: number;
  y: number;
  click?: boolean;
};

const DEMO_SCRIPT_ID = "churchwork-synthetic-v1";
const DEMO_VOICE = "marin";

const actions: Action[] = [
  { stepId: "synthetic-facility-setup-name", scene: "facility_setup", actor: "New facility founder", verb: "names the facility", detail: "Cole's Nursing Home becomes the new facility workspace.", focus: "name", x: 48, y: 37, click: true },
  { stepId: "synthetic-facility-setup-admin", scene: "facility_setup", actor: "New facility founder", verb: "creates admin credentials", detail: "The founding user becomes the facility administrator and enters the workspace.", focus: "credentials", x: 52, y: 68, click: true },
  { stepId: "synthetic-partner-setup-name", scene: "partner_setup", actor: "New care partner founder", verb: "names the care partner", detail: "Cole's Church becomes the new care-partner workspace.", focus: "name", x: 48, y: 37, click: true },
  { stepId: "synthetic-partner-setup-admin", scene: "partner_setup", actor: "New care partner founder", verb: "creates admin credentials", detail: "The founding user becomes the partner administrator and enters the workspace.", focus: "credentials", x: 52, y: 68, click: true },
  { stepId: "synthetic-requester-open", scene: "requester", actor: "Synthetic requester", verb: "opens requester intake", detail: "The test user lands on the anonymous spiritual-care request.", focus: "open", x: 22, y: 19 },
  { stepId: "synthetic-requester-prayer", scene: "requester", actor: "Synthetic requester", verb: "taps Prayer", detail: "The request stays in safe support categories.", focus: "prayer", x: 26, y: 38, click: true },
  { stepId: "synthetic-requester-visit", scene: "requester", actor: "Synthetic requester", verb: "taps Friendly visit", detail: "The second choice adds a visit request without adding medical details.", focus: "visit", x: 72, y: 38, click: true },
  { stepId: "synthetic-requester-location", scene: "requester", actor: "Synthetic requester", verb: "enters room location", detail: "Only a short room or location code is added.", focus: "note", x: 36, y: 62, click: true },
  { stepId: "synthetic-requester-submit", scene: "requester", actor: "Synthetic requester", verb: "sends the request", detail: "The request is submitted for coordinated spiritual care.", focus: "submit", x: 72, y: 83, click: true },
  { stepId: "synthetic-facility-open", scene: "facility", actor: "Synthetic facility reviewer", verb: "opens incoming request", detail: "The facility sees the incoming request and status.", focus: "incoming", x: 28, y: 29, click: true },
  { stepId: "synthetic-facility-boundary", scene: "facility", actor: "Synthetic facility reviewer", verb: "checks the privacy boundary", detail: "Medical details and private notes are not part of the request.", focus: "hidden", x: 72, y: 49, click: true },
  { stepId: "synthetic-facility-aware", scene: "facility", actor: "Synthetic facility reviewer", verb: "stays informed", detail: "The facility can follow the request while the selected care partner moves it forward.", focus: "approve", x: 64, y: 74, click: true },
  { stepId: "synthetic-partner-open", scene: "partner", actor: "Synthetic partner", verb: "opens the routed request", detail: "The selected care partner receives only the scoped request.", focus: "assignment", x: 38, y: 31, click: true },
  { stepId: "synthetic-partner-review", scene: "partner", actor: "Synthetic partner", verb: "reviews the care request", detail: "The partner sees the requested support and room location, not medical records.", focus: "guardrail", x: 73, y: 53, click: true },
  { stepId: "synthetic-partner-complete", scene: "partner", actor: "Synthetic partner", verb: "marks care complete", detail: "The outcome is recorded as a simple structured status.", focus: "visited", x: 34, y: 77, click: true },
  { stepId: "synthetic-requester-update", scene: "status", actor: "Synthetic requester", verb: "sees the update", detail: "The requester sees the status in the same anonymous guest session.", focus: "update", x: 72, y: 66, click: true },
  { stepId: "synthetic-complete", scene: "bi", actor: "ChurchWork demo", verb: "completes the loop", detail: "Request, coordinated care, and a simple update without another medical record or open messaging system.", focus: "checks", x: 50, y: 52 }
];

const checks = [
  "No auth",
  "No Supabase writes",
  "No medical workflow",
  "Facility awareness view",
  "Partner sees scoped request only",
  "Requester sees simple status update"
];

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function ProgressDots({ index, setIndex }: { index: number; setIndex: (value: number) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action, actionIndex) => (
        <button
          key={`${action.scene}-${action.focus}-${actionIndex}`}
          type="button"
          aria-label={`Jump to action ${actionIndex + 1}`}
          onClick={() => setIndex(actionIndex)}
          className={cx(
            "h-2.5 rounded-full transition-all",
            actionIndex === index ? "w-10 bg-[#d6a943]" : actionIndex < index ? "w-5 bg-[#0f6b54]" : "w-5 bg-white/20"
          )}
        />
      ))}
    </div>
  );
}

function Cursor({ action }: { action: Action }) {
  return (
    <div
      className="pointer-events-none absolute z-30 transition-all duration-700 ease-out"
      style={{ left: `${action.x}%`, top: `${action.y}%`, transform: "translate(-20%, -10%)" }}
    >
      {action.click ? <span className="absolute -left-4 -top-4 h-10 w-10 animate-ping rounded-full bg-[#d6a943]/45" /> : null}
      <div className="relative h-9 w-9 rotate-[-18deg] rounded-tl-sm bg-[#082838] shadow-xl shadow-black/25" style={{ clipPath: "polygon(0 0, 0 100%, 30% 72%, 48% 100%, 66% 91%, 48% 64%, 84% 64%)" }} />
    </div>
  );
}

function Shell({ action, children }: { action: Action; children: ReactNode }) {
  const label = action.scene === "facility_setup" ? "Facility setup" : action.scene === "partner_setup" ? "Care partner setup" : action.scene === "requester" ? "Requester" : action.scene === "facility" ? "Facility workspace" : action.scene === "partner" ? "Care partner workspace" : action.scene === "status" ? "Requester status" : "Demo complete";
  return (
    <div className="relative mx-auto w-full max-w-[27rem] overflow-hidden rounded-[2.25rem] border-[10px] border-[#102b3a] bg-[#edf4f0] shadow-2xl shadow-black/25 md:max-w-[34rem]">
      <div className="flex items-center justify-between bg-[#082838] px-4 py-3 text-white">
        <div>
          <p className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-[#c7e2d0]">ChurchWork</p>
          <p className="font-serif text-xl font-semibold tracking-[-0.04em]">{label}</p>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black">demo</span>
      </div>
      <div className="relative min-h-[35rem] bg-[#f8fbf8] p-4 md:min-h-[38rem] md:p-5">
        {children}
        <Cursor action={action} />
      </div>
    </div>
  );
}

function SetupScreen({ action }: { action: Action }) {
  const isFacility = action.scene === "facility_setup";
  const orgName = isFacility ? "Cole's Nursing Home" : "Cole's Church";
  const prompt = isFacility ? "Enter facility name" : "Enter church or care partner name";

  return (
    <Shell action={action}>
      <div className="space-y-4">
        <section className="rounded-3xl border border-[#d9dfd7] bg-white p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#506a49]">First-time setup</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.05em] text-[#0d2b3b]">
            {isFacility ? "Create a facility workspace." : "Create a care partner workspace."}
          </h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-[#4f6259]">
            The founding user creates the organization and becomes its first administrator.
          </p>
        </section>

        <section className={cx("rounded-3xl border bg-white p-5 transition", action.focus === "name" ? "border-[#d6a943] shadow-lg" : "border-[#d9dfd7]")}>
          <p className="text-sm font-black text-[#0d2b3b]">{prompt}</p>
          <div className="mt-3 rounded-xl border border-[#d9dfd7] bg-[#f8fbf8] px-4 py-4 font-bold text-[#0d2b3b]">
            {orgName}
          </div>
        </section>

        <section className={cx("rounded-3xl border bg-white p-5 transition", action.focus === "credentials" ? "border-[#d6a943] shadow-lg" : "border-[#d9dfd7]")}>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#506a49]">Founding admin credentials</p>
          <div className="mt-3 space-y-3">
            <div className="rounded-xl border border-[#d9dfd7] bg-[#f8fbf8] px-4 py-3 text-sm font-bold text-[#0d2b3b]">admin@example.com</div>
            <div className="rounded-xl border border-[#d9dfd7] bg-[#f8fbf8] px-4 py-3 text-sm font-bold tracking-[0.2em] text-[#0d2b3b]">••••••••••••</div>
          </div>
          <div className="mt-4 rounded-xl bg-[#e7f1eb] p-4 text-sm font-black text-[#0f6b54]">
            {action.focus === "credentials" ? "Workspace created · Admin access granted" : "Next: create admin access"}
          </div>
        </section>
      </div>
    </Shell>
  );
}

function Choice({ title, sub, active, focus }: { title: string; sub: string; active: boolean; focus: boolean }) {
  return (
    <div className={cx("rounded-2xl border p-4 transition", active ? "border-[#0f6b54] bg-[#e7f1eb]" : focus ? "border-[#d6a943] bg-[#fff8e7] shadow-lg" : "border-[#d9dfd7] bg-white")}>
      <div className={cx("mb-3 flex h-8 w-8 items-center justify-center rounded-full text-xs font-black", active ? "bg-[#0f6b54] text-white" : "bg-[#edf4f0] text-[#4f6259]")}>{active ? "✓" : ""}</div>
      <p className="font-black text-[#0d2b3b]">{title}</p>
      <p className="mt-1 text-xs font-semibold text-[#4f6259]">{sub}</p>
    </div>
  );
}

function RequesterScreen({ index, action }: { index: number; action: Action }) {
  const prayer = index >= 5;
  const visit = index >= 6;
  const note = index >= 7;
  const submitted = index >= 8;

  return (
    <Shell action={action}>
      <div className="space-y-4">
        <section className="rounded-3xl border border-[#d9dfd7] bg-white p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#506a49]">Guided intake</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.05em] text-[#0d2b3b]">What kind of support would help?</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-[#4f6259]">Choose the spiritual support you want. The facility stays informed while the selected care partner receives the request.</p>
        </section>

        <div className="grid grid-cols-2 gap-3">
          <Choice active={prayer} focus={action.focus === "prayer"} title="Prayer" sub="Safe support" />
          <Choice active={visit} focus={action.focus === "visit"} title="Friendly visit" sub="Calm presence" />
          <Choice active={false} focus={false} title="Encouragement" sub="Message only" />
          <Choice active={false} focus={false} title="Pastoral call" sub="Facility reviewed" />
        </div>

        <section className={cx("rounded-3xl border bg-white p-4 transition", action.focus === "note" ? "border-[#d6a943] shadow-lg" : "border-[#d9dfd7]")}>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#506a49]">Safe context note</p>
          <div className="mt-3 min-h-[7rem] rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] p-4 text-sm font-semibold leading-6 text-[#0d2b3b]">
            {note ? "Room 406" : <span className="text-[#8b9991]">Room or location code appears here…</span>}
            {action.focus === "note" ? <span className="ml-1 inline-block h-4 w-1 animate-pulse bg-[#0d2b3b] align-middle" /> : null}
          </div>
        </section>

        <button className={cx("w-full rounded-2xl px-5 py-4 text-sm font-black shadow-lg transition", submitted || action.focus === "submit" ? "bg-[#d6a943] text-[#082838]" : "bg-[#082838] text-white")}>
          {submitted ? "Request sent" : "Send request"}
        </button>
      </div>
    </Shell>
  );
}

function FacilityRow({ label, value, active, focus }: { label: string; value: string; active: boolean; focus: boolean }) {
  return (
    <div className={cx("flex items-center justify-between rounded-2xl border p-4 transition", focus ? "border-[#d6a943] bg-[#fff8e7] shadow-lg" : "border-[#d9dfd7] bg-white")}>
      <span className="font-black text-[#0d2b3b]">{label}</span>
      <span className={cx("rounded-full px-3 py-1 text-xs font-black", active ? "bg-[#e7f1eb] text-[#0f6b54]" : "bg-[#edf4f0] text-[#506a49]")}>{value}</span>
    </div>
  );
}

function FacilityScreen({ index, action }: { index: number; action: Action }) {
  const reviewed = index >= 10;
  const approved = index >= 11;

  return (
    <Shell action={action}>
      <div className="space-y-4">
        <section className={cx("rounded-3xl border bg-white p-5 shadow-sm", action.focus === "incoming" ? "border-[#d6a943]" : "border-[#d9dfd7]")}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#9a6b16]">Incoming request</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.05em] text-[#0d2b3b]">Prayer + friendly visit</h2>
            </div>
            <span className="rounded-full bg-[#fff8e7] px-3 py-1 text-xs font-black text-[#7a5b20]">Review</span>
          </div>
          <p className="mt-4 rounded-2xl bg-[#f8fbf8] p-4 text-sm font-semibold leading-6 text-[#4f6259]">They would appreciate prayer and a calm visit this week.</p>
        </section>

        <div className="grid gap-3">
          <FacilityRow label="Approved to share" value={approved ? "Yes" : "Pending"} active={approved} focus={action.focus === "approve"} />
          <FacilityRow label="Internal notes" value="Held back" active={reviewed} focus={action.focus === "hidden"} />
          <FacilityRow label="Medical details" value="Not collected" active focus={false} />
        </div>

        <section className={cx("rounded-3xl border bg-white p-4 transition", action.focus === "approve" ? "border-[#d6a943] shadow-lg" : "border-[#d9dfd7]")}>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#506a49]">Release decision</p>
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#f8fbf8] p-4">
            <span className="font-black text-[#0d2b3b]">Release partner-safe context</span>
            <span className={cx("h-8 w-14 rounded-full p-1 transition", approved ? "bg-[#0f6b54]" : "bg-[#cfd8d2]")}>
              <span className={cx("block h-6 w-6 rounded-full bg-white transition", approved ? "translate-x-6" : "translate-x-0")} />
            </span>
          </div>
        </section>
      </div>
    </Shell>
  );
}

function PartnerScreen({ index, action }: { index: number; action: Action }) {
  const visited = index >= 14;
  return (
    <Shell action={action}>
      <div className="space-y-4">
        <section className={cx("rounded-3xl border bg-white p-5 shadow-sm", action.focus === "assignment" ? "border-[#d6a943]" : "border-[#d9dfd7]")}>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#506a49]">Routed request</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.05em] text-[#0d2b3b]">Prayer + friendly visit</h2>
          <div className="mt-4 grid gap-2 text-sm font-semibold text-[#4f6259]">
            <p className="rounded-2xl bg-[#f8fbf8] p-3">Prayer requested</p>
            <p className="rounded-2xl bg-[#f8fbf8] p-3">Friendly visit requested</p>
          </div>
        </section>

        <section className={cx("rounded-3xl border p-4 transition", action.focus === "guardrail" ? "border-[#d6a943] bg-[#fff8e7] shadow-lg" : "border-[#d9dfd7] bg-white")}>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#9a6b16]">Hidden from partner</p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-black text-[#5f4b1f]">
            <span className="rounded-xl bg-white/70 px-3 py-2">Clinical details</span>
            <span className="rounded-xl bg-white/70 px-3 py-2">Internal notes</span>
            <span className="rounded-xl bg-white/70 px-3 py-2">Emergency lane</span>
            <span className="rounded-xl bg-white/70 px-3 py-2">Open chat</span>
          </div>
        </section>

        <section className="rounded-3xl border border-[#d9dfd7] bg-white p-4">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#506a49]">Outcome</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {["Contacted", "Visited", "Unable", "Follow-up"].map((item) => (
              <div key={item} className={cx("rounded-2xl border p-4 text-center text-sm font-black transition", item === "Visited" && (visited || action.focus === "visited") ? "border-[#0f6b54] bg-[#e7f1eb] text-[#0f6b54]" : "border-[#d9dfd7] bg-[#f8fbf8] text-[#4f6259]")}>{item}</div>
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}

function StatusScreen({ action }: { action: Action }) {
  return (
    <Shell action={action}>
      <div className="space-y-4">
        <section className="rounded-3xl border border-[#d9dfd7] bg-white p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#506a49]">Requester status</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.05em] text-[#0d2b3b]">Your request has an update</h2>
        </section>
        {["Received", "Facility reviewed", "Partner assigned", "Approved update available"].map((item, itemIndex) => (
          <div key={item} className={cx("flex items-center gap-4 rounded-2xl border p-4", itemIndex < 3 ? "border-[#cfe4d5] bg-[#e7f1eb]" : "border-[#d6a943] bg-[#fff8e7] shadow-lg")}>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0f6b54] text-sm font-black text-white">✓</span>
            <span className="font-black text-[#0d2b3b]">{item}</span>
          </div>
        ))}
      </div>
    </Shell>
  );
}

function BiScreen({ action }: { action: Action }) {
  return (
    <Shell action={action}>
      <div className="space-y-4">
        <section className="rounded-3xl border border-[#d9dfd7] bg-white p-5 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#506a49]">BI readout</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.05em] text-[#0d2b3b]">Synthetic demo pass</h2>
        </section>
        {checks.map((check) => (
          <div key={check} className="flex items-center justify-between rounded-2xl border border-[#cfe4d5] bg-[#e7f1eb] p-4">
            <span className="font-black text-[#0d2b3b]">{check}</span>
            <span className="rounded-full bg-[#0f6b54] px-3 py-1 text-xs font-black text-white">PASS</span>
          </div>
        ))}
        <div className="rounded-3xl bg-[#082838] p-5 text-white">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#c7e2d0]">Next level</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-[#d9e7df]">Later this same path becomes a Playwright run with real clicks, screenshots, console logs, and video replay.</p>
        </div>
      </div>
    </Shell>
  );
}

function DemoScreen({ index, action }: { index: number; action: Action }) {
  if (action.scene === "facility_setup" || action.scene === "partner_setup") return <SetupScreen action={action} />;
  if (action.scene === "requester") return <RequesterScreen index={index} action={action} />;
  if (action.scene === "facility") return <FacilityScreen index={index} action={action} />;
  if (action.scene === "partner") return <PartnerScreen index={index} action={action} />;
  if (action.scene === "status") return <StatusScreen action={action} />;
  return <BiScreen action={action} />;
}

export default function SyntheticDemoPage() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [narrationReady, setNarrationReady] = useState(false);
  const [narrationStatus, setNarrationStatus] = useState("Loading Marin narration...");
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlsRef = useRef<Map<number, string>>(new Map());
  const action = actions[index];
  const progress = useMemo(() => Math.round(((index + 1) / actions.length) * 100), [index]);

  async function loadNarration(actionIndex: number) {
    const cached = audioUrlsRef.current.get(actionIndex);
    if (cached) return cached;

    const target = actions[actionIndex];
    const response = await fetch("/api/churchwork-demo-audio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scriptId: DEMO_SCRIPT_ID, stepId: target.stepId, voice: DEMO_VOICE })
    });

    if (!response.ok || response.headers.get("content-type")?.includes("application/json")) {
      throw new Error("Marin narration unavailable");
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    audioUrlsRef.current.set(actionIndex, url);
    return url;
  }

  async function preloadAllNarration() {
    setNarrationReady(false);
    setNarrationStatus("Loading Marin narration...");
    try {
      for (let i = 0; i < actions.length; i += 1) {
        await loadNarration(i);
      }
      setNarrationReady(true);
      setNarrationStatus("Marin narration ready");
    } catch {
      setNarrationReady(false);
      setNarrationStatus("Marin narration could not be loaded");
    }
  }

  useEffect(() => {
    void preloadAllNarration();
    return () => {
      audioElementRef.current?.pause();
      for (const url of audioUrlsRef.current.values()) URL.revokeObjectURL(url);
      audioUrlsRef.current.clear();
    };
  }, []);

  async function playNarratedStep(actionIndex: number) {
    const url = await loadNarration(actionIndex);
    const audio = new Audio(url);
    audioElementRef.current?.pause();
    audioElementRef.current = audio;

    audio.onended = () => {
      if (actionIndex >= actions.length - 1) {
        setPlaying(false);
        return;
      }
      const nextIndex = actionIndex + 1;
      setIndex(nextIndex);
      window.setTimeout(() => {
        void playNarratedStep(nextIndex);
      }, 120);
    };

    await audio.play();
  }

  async function startOrPause() {
    if (playing) {
      audioElementRef.current?.pause();
      setPlaying(false);
      return;
    }
    if (!narrationReady) return;
    setPlaying(true);
    await playNarratedStep(index);
  }

  function setActionIndex(nextIndex: number) {
    audioElementRef.current?.pause();
    setPlaying(false);
    const safeIndex = Math.max(0, Math.min(nextIndex, actions.length - 1));
    setIndex(safeIndex);
  }

  function next() {
    setActionIndex(index + 1);
  }

  function back() {
    setActionIndex(index - 1);
  }

  function reset() {
    setActionIndex(0);
  }

  return () => window.clearInterval(timer);
  }, [playing, soundEnabled]);

  function next() {
    setPlaying(false);
    setActionIndex(index + 1);
  }

  function back() {
    setPlaying(false);
    setActionIndex(index - 1);
  }

  function reset() {
    setPlaying(false);
    setActionIndex(0);
  }

  function toggleSound() {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    if (nextState) {
      setTimeout(() => playTone("on"), 0);
    }
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
              <span className="block text-xs font-semibold text-[#d9e7df]">Synthetic user actor demo</span>
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
        <div className="grid gap-6 xl:grid-cols-[1fr_25rem] xl:items-start">
          <section className="order-2 xl:order-1">
            <DemoScreen index={index} action={action} />
          </section>

          <aside className="order-1 space-y-4 xl:order-2">
            <section className="rounded-[1.5rem] bg-[#0f3f35] p-5 text-white shadow-xl shadow-[#0d2b3b]/10">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#c7e2d0]">Now acting</p>
              <h1 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.05em]">{action.actor}</h1>
              <p className="mt-3 text-xl font-black text-[#d6a943]">{action.verb}</p>
              <p className="mt-3 text-sm font-semibold leading-7 text-[#d9e7df]">{action.detail}</p>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/15">
                <div className="h-full rounded-full bg-[#d6a943] transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button type="button" onClick={back} className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-black text-white">Back</button>
                <button type="button" onClick={next} className="rounded-xl bg-white px-4 py-3 text-sm font-black text-[#082838] shadow-lg">Next action</button>
                <button type="button" onClick={() => { void startOrPause(); }} disabled={!narrationReady} className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:opacity-50">{playing ? "Pause" : "Play demo"}</button>
                <button type="button" onClick={reset} className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-black text-white">Reset</button>
                <div className="col-span-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-center text-sm font-black text-white">
                  {narrationStatus}
                </div>
              </div>

              <div className="mt-5">
                <ProgressDots index={index} setIndex={(value) => { setPlaying(false); setActionIndex(value); }} />
              </div>
            </section>

            <section className="rounded-[1.5rem] border border-[#ddb66c]/60 bg-[#fff8e7] p-5 text-sm font-semibold leading-6 text-[#5f4b1f] shadow-sm shadow-[#0d2b3b]/5">
              The automatic demo uses preloaded Marin narration and advances only after each narration clip finishes, keeping the voice and visuals synchronized.
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
