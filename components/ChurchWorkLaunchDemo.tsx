"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type SceneKey =
  | "intro"
  | "requester"
  | "facility-review"
  | "partner"
  | "partner-complete"
  | "facility-release"
  | "requester-complete";

type Scene = {
  key: SceneKey;
  role: string;
  label: string;
  title: string;
  body: string;
  accent: string;
  soft: string;
};

const scenes: Scene[] = [
  {
    key: "intro",
    role: "ChurchWork",
    label: "A request becomes care",
    title: "One request. Three trusted roles. One closed loop.",
    body: "See how ChurchWork moves a spiritual-care request from a resident or family member, through facility review, to an approved church partner—and safely back again.",
    accent: "#164f3e",
    soft: "#edf5f1"
  },
  {
    key: "requester",
    role: "Requester",
    label: "1 · Ask for care",
    title: "The requester chooses what would help.",
    body: "No medical narrative. No long form. Just a simple, structured spiritual-care request that Grandview can safely review.",
    accent: "#276d5d",
    soft: "#edf6f2"
  },
  {
    key: "facility-review",
    role: "Grandview Post Acute",
    label: "2 · Facility review",
    title: "Grandview stays in control of what moves forward.",
    body: "The request lands in a focused review queue. Grandview checks the safe summary and approves it for the designated care partner.",
    accent: "#315c83",
    soft: "#edf3f8"
  },
  {
    key: "partner",
    role: "Hope Church",
    label: "3 · Care partner",
    title: "Hope sees only the approved spiritual-care context.",
    body: "The church receives a clear assignment—not a chart, not a medical record, and not a private conversation thread.",
    accent: "#7d6a34",
    soft: "#f7f2e6"
  },
  {
    key: "partner-complete",
    role: "Hope Church",
    label: "4 · Log the outcome",
    title: "The care team reports what happened in one tap.",
    body: "Prayer logged, visit planned, visit completed, or follow-up requested. The outcome goes back to Grandview for review.",
    accent: "#725b8a",
    soft: "#f2eef6"
  },
  {
    key: "facility-release",
    role: "Grandview Post Acute",
    label: "5 · Safe release",
    title: "Grandview closes the privacy loop.",
    body: "Hope's outcome is visible to Grandview first. Grandview releases a standardized safe update to the requester—nothing leaves automatically.",
    accent: "#315c83",
    soft: "#edf3f8"
  },
  {
    key: "requester-complete",
    role: "Requester",
    label: "6 · Complete",
    title: "The requester gets closure without another task.",
    body: "The update is released, the request is complete, and the requester knows care happened. No extra acknowledgement or close button is required.",
    accent: "#276d5d",
    soft: "#edf6f2"
  }
];

function Logo() {
  return (
    <a href="/" className="inline-flex items-center gap-3" aria-label="ChurchWork home">
      <img src="/brand/churchwork-corner-logo.png" alt="ChurchWork" className="h-10 w-12 object-contain" />
      <span className="font-serif text-2xl font-semibold tracking-[-0.04em] text-[#0d2d3e]">
        Church<span className="text-[#2f7b65]">Work</span>
      </span>
    </a>
  );
}

function Icon({ name }: { name: "heart" | "shield" | "church" | "check" | "arrow" | "home" | "clock" }) {
  const cls = "h-5 w-5";
  if (name === "heart") return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg>;
  if (name === "shield") return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3 5 6v5c0 4.6 2.7 8.2 7 10 4.3-1.8 7-5.4 7-10V6z"/><path d="m9 12 2 2 4-4"/></svg>;
  if (name === "church") return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2v5M9.5 4.5h5"/><path d="m4 11 8-5 8 5v10H4z"/><path d="M9.5 21v-6h5v6"/></svg>;
  if (name === "check") return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="m8 12 2.6 2.6L16.5 9"/></svg>;
  if (name === "arrow") return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M14 7l5 5-5 5"/></svg>;
  if (name === "home") return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3.5 10.5 12 3l8.5 7.5"/><path d="M5.5 9.5V21h13V9.5"/></svg>;
  return <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
}

function BrowserFrame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="overflow-hidden rounded-[1.8rem] border border-white/70 bg-[#fffdf9] shadow-[0_35px_90px_rgba(31,51,55,.18)] ring-1 ring-[#173b2d]/5">
      <div className="flex h-11 items-center gap-2 border-b border-[#e9e4db] bg-white/90 px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-[#e7a59c]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#e8c77c]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#90bda7]" />
        <div className="mx-auto flex max-w-[22rem] flex-1 items-center justify-center rounded-lg bg-[#f5f3ee] px-3 py-1.5 text-[10px] font-bold text-[#74827f]">
          church-work.com · {label}
        </div>
        <span className="w-8" />
      </div>
      {children}
    </div>
  );
}

function MiniSidebar({ role }: { role: string }) {
  return (
    <aside className="hidden w-44 shrink-0 border-r border-[#e8e4dc] bg-[#fbfaf7] p-4 md:block">
      <div className="flex items-center gap-2">
        <img src="/brand/churchwork-corner-logo.png" alt="" className="h-7 w-9 object-contain" />
        <span className="font-serif text-sm font-bold text-[#123044]">Church<span className="text-[#2f7b65]">Work</span></span>
      </div>
      <div className="mt-6 space-y-2 text-[11px] font-bold text-[#607176]">
        <div className="rounded-lg bg-[#e6f0e9] px-3 py-2.5 text-[#164f3e]">Home</div>
        <div className="px-3 py-2.5">{role === "Requester" ? "My Requests" : role === "Hope Church" ? "Assignments" : "Requests"}</div>
        {role === "Requester" ? <div className="px-3 py-2.5">New Request</div> : null}
      </div>
      <div className="mt-28 border-t border-[#e8e4dc] pt-4 text-[9px] font-bold uppercase tracking-[0.14em] text-[#708a72]">Spiritual care</div>
    </aside>
  );
}

function MiniTopbar({ role }: { role: string }) {
  return (
    <div className="flex h-12 items-center justify-between border-b border-[#ebe6dd] bg-white px-4">
      <span className="text-[11px] font-black text-[#334d58]">{role}</span>
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#dfece5] text-[9px] font-black text-[#164f3e]">CW</span>
        <span className="hidden text-[10px] font-bold text-[#637278] sm:inline">Demo account</span>
      </div>
    </div>
  );
}

function ProgressRail({ active }: { active: number }) {
  const labels = ["Submitted", "Under review", "Care in progress", "Update released"];
  return (
    <div className="grid grid-cols-4 py-2">
      {labels.map((label, index) => (
        <div key={label} className="relative text-center">
          {index < labels.length - 1 ? <span className={`absolute left-1/2 top-2.5 h-[2px] w-full ${index < active ? "bg-[#2f7b65]" : "bg-[#d9ddd8]"}`} /> : null}
          <span className={`relative mx-auto flex h-5 w-5 items-center justify-center rounded-full border-2 bg-white ${index <= active ? "border-[#2f7b65]" : "border-[#cfd5d1]"}`}>
            {index < active ? <span className="h-2 w-2 rounded-full bg-[#2f7b65]" /> : null}
            {index === active ? <span className="h-2.5 w-2.5 rounded-full bg-[#2f7b65] ring-4 ring-[#dcebe3]" /> : null}
          </span>
          <p className={`mt-2 text-[9px] font-black ${index <= active ? "text-[#244d40]" : "text-[#8a9693]"}`}>{label}</p>
        </div>
      ))}
    </div>
  );
}

function RequesterScene({ complete = false }: { complete?: boolean }) {
  return (
    <BrowserFrame label={complete ? "My request" : "New request"}>
      <div className="flex min-h-[30rem]">
        <MiniSidebar role="Requester" />
        <div className="min-w-0 flex-1 bg-[#f7f3ea]">
          <MiniTopbar role="Requester Portal" />
          <div className="p-5 sm:p-7">
            {complete ? (
              <>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#708a52]">My request</p>
                    <h3 className="mt-1 font-serif text-2xl font-semibold tracking-[-0.04em] text-[#123044]">Request #439AFD</h3>
                    <p className="mt-1 text-[10px] font-semibold text-[#708086]">Friendly visit · Sep 22, 2026</p>
                  </div>
                  <span className="rounded-full bg-[#dcecdf] px-3 py-1.5 text-[9px] font-black text-[#245f43]">Complete</span>
                </div>
                <div className="mt-5 rounded-xl border border-[#ded9cf] bg-white p-4"><ProgressRail active={3} /></div>
                <div className="mt-4 grid gap-3 md:grid-cols-[1fr_.55fr]">
                  <div className="rounded-xl border border-[#bcd7c6] bg-[#f0f7f3] p-5">
                    <div className="flex items-center gap-2 text-[#245f43]"><Icon name="check" /><p className="text-[10px] font-black uppercase tracking-[0.12em]">Update released</p></div>
                    <p className="mt-3 text-sm font-black leading-5 text-[#183f35]">A care partner has completed a spiritual-care visit.</p>
                    <p className="mt-2 text-[10px] font-semibold leading-4 text-[#60766d]">This request is complete. No further action is needed.</p>
                  </div>
                  <div className="rounded-xl border border-[#ded9cf] bg-white p-4">
                    <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#788482]">What happened</p>
                    <div className="mt-3 space-y-2.5 text-[10px] font-bold text-[#4f646c]">
                      <div>✓ Grandview reviewed</div>
                      <div>✓ Hope Church cared</div>
                      <div>✓ Grandview released update</div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#708a52]">New request</p>
                <h3 className="mt-1 font-serif text-2xl font-semibold tracking-[-0.04em] text-[#123044]">How can we support you?</h3>
                <p className="mt-1 text-[10px] font-semibold text-[#708086]">Choose one or more spiritual-care options.</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    ["Prayer", "A local care partner will pray for your request.", "✓"],
                    ["Friendly visit", "A brief spiritual-care visit.", "✓"],
                    ["Encouragement", "Words of support and encouragement.", ""],
                    ["Pastoral call", "A call from an approved pastor or care partner.", ""]
                  ].map(([title, detail, mark]) => (
                    <div key={title} className={`relative rounded-xl border p-4 ${mark ? "border-[#2f7b65] bg-[#f0f7f3]" : "border-[#ded9cf] bg-white"}`}>
                      <span className="text-[11px] font-black text-[#183f35]">{title}</span>
                      <p className="mt-1 text-[9px] font-semibold leading-4 text-[#728083]">{detail}</p>
                      {mark ? <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#2f7b65] text-[9px] font-black text-white">{mark}</span> : null}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between rounded-xl border border-[#d9ded8] bg-white px-4 py-3">
                  <span className="text-[9px] font-semibold text-[#607176]">Spiritual-care-only confirmation</span>
                  <button type="button" className="rounded-lg bg-[#164f3e] px-4 py-2 text-[10px] font-black text-white">Continue</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

function FacilityScene({ release = false }: { release?: boolean }) {
  return (
    <BrowserFrame label={release ? "Ready to release" : "Facility review"}>
      <div className="flex min-h-[30rem]">
        <MiniSidebar role="Grandview" />
        <div className="min-w-0 flex-1 bg-[#f7f3ea]">
          <MiniTopbar role="Grandview Post Acute" />
          <div className="p-5 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#708a52]">{release ? "Ready to release" : "Needs review"}</p>
                <h3 className="mt-1 font-serif text-2xl font-semibold tracking-[-0.04em] text-[#123044]">Request #439AFD</h3>
              </div>
              <span className={`rounded-full px-3 py-1.5 text-[9px] font-black ${release ? "bg-[#e5f1e8] text-[#2d6b50]" : "bg-[#fff0dc] text-[#85561a]"}`}>{release ? "Care completed" : "New request"}</span>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-[1fr_.65fr]">
              <section className="rounded-xl border border-[#ded9cf] bg-white p-5">
                <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#7d8784]">{release ? "Care partner update" : "Safe request summary"}</p>
                <p className="mt-3 text-sm font-black leading-5 text-[#183f35]">{release ? "Visit completed" : "Prayer + Friendly visit"}</p>
                <p className="mt-2 text-[10px] font-semibold leading-4 text-[#65777b]">{release ? "Hope Church has logged a completed spiritual-care visit. This outcome has not yet been released to the requester." : "Requested spiritual-care support: Prayer, Friendly visit."}</p>
                <div className="mt-4 rounded-lg bg-[#eef5f1] p-3 text-[9px] font-semibold leading-4 text-[#4d6b60]">No medical or clinical information is included in this workflow.</div>
              </section>
              <section className="rounded-xl border border-[#ded9cf] bg-white p-5">
                <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#7d8784]">Next action</p>
                <p className="mt-3 text-[11px] font-black leading-5 text-[#183f35]">{release ? "Review and release the safe requester update." : "Approve this request for Hope Church."}</p>
                <button type="button" className="mt-5 w-full rounded-lg bg-[#164f3e] px-4 py-2.5 text-[10px] font-black text-white">{release ? "Release update" : "Approve for Hope Church"}</button>
              </section>
            </div>
            <div className="mt-4 rounded-xl border border-[#ded9cf] bg-white p-4">
              <ProgressRail active={release ? 2 : 1} />
            </div>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

function PartnerScene({ complete = false }: { complete?: boolean }) {
  return (
    <BrowserFrame label={complete ? "Log outcome" : "Assignment"}>
      <div className="flex min-h-[30rem]">
        <MiniSidebar role="Hope Church" />
        <div className="min-w-0 flex-1 bg-[#f7f3ea]">
          <MiniTopbar role="Hope Church" />
          <div className="p-5 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#7d6a34]">Approved assignment</p>
                <h3 className="mt-1 font-serif text-2xl font-semibold tracking-[-0.04em] text-[#123044]">Prayer + Friendly visit</h3>
                <p className="mt-1 text-[10px] font-semibold text-[#708086]">Released by Grandview · Request #439AFD</p>
              </div>
              <span className="rounded-full bg-[#f2ead6] px-3 py-1.5 text-[9px] font-black text-[#735f2c]">{complete ? "In progress" : "New"}</span>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-[1fr_.7fr]">
              <section className="rounded-xl border border-[#ded9cf] bg-white p-5">
                <div className="flex items-center gap-2 text-[#164f3e]"><Icon name="shield" /><p className="text-[9px] font-black uppercase tracking-[0.12em]">Approved context</p></div>
                <p className="mt-3 text-sm font-black text-[#183f35]">Spiritual-care support requested</p>
                <p className="mt-2 text-[10px] font-semibold leading-4 text-[#68787c]">Prayer and a friendly visit. Coordinate through Grandview's approved care path.</p>
                <div className="mt-4 flex gap-2"><span className="rounded-full bg-[#edf5f1] px-3 py-1.5 text-[9px] font-black text-[#245f43]">Prayer</span><span className="rounded-full bg-[#edf5f1] px-3 py-1.5 text-[9px] font-black text-[#245f43]">Friendly visit</span></div>
              </section>
              <section className="rounded-xl border border-[#ded9cf] bg-white p-5">
                <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#7d8784]">{complete ? "Report outcome" : "Assignment status"}</p>
                {complete ? (
                  <div className="mt-3 space-y-2">
                    {["Prayer logged", "Visit planned", "Visit completed", "Follow-up requested"].map((item) => <div key={item} className={`rounded-lg border px-3 py-2.5 text-[10px] font-black ${item === "Visit completed" ? "border-[#2f7b65] bg-[#edf5f1] text-[#245f43]" : "border-[#e1ded7] text-[#65757a]"}`}>{item}</div>)}
                  </div>
                ) : (
                  <>
                    <p className="mt-3 text-[11px] font-black leading-5 text-[#183f35]">This request is ready for your care team.</p>
                    <button type="button" className="mt-5 w-full rounded-lg bg-[#164f3e] px-4 py-2.5 text-[10px] font-black text-white">Open assignment</button>
                  </>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

function IntroScene() {
  return (
    <div className="relative overflow-hidden rounded-[1.8rem] border border-white/70 bg-[#10394a] p-7 text-white shadow-[0_35px_90px_rgba(31,51,55,.24)] sm:p-10">
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#66a98c]/25 blur-3xl" />
      <div className="absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-[#e1bc72]/20 blur-3xl" />
      <div className="relative">
        <div className="flex items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#dcebe4]"><Icon name="heart" /> Spiritual care, safely connected</div>
          <span className="hidden rounded-full bg-white/10 px-3 py-2 text-[10px] font-bold text-white/70 sm:inline">2-minute walkthrough</span>
        </div>
        <h3 className="mt-10 max-w-2xl font-serif text-4xl font-semibold tracking-[-0.055em] sm:text-5xl">A human request shouldn't disappear into a system.</h3>
        <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-white/75">ChurchWork keeps the requester, facility, and care partner aligned—without turning spiritual care into a medical workflow or an uncontrolled message thread.</p>
        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {[
            ["1", "Requester", "Asks for spiritual care"],
            ["2", "Facility", "Reviews and controls sharing"],
            ["3", "Church", "Provides care and reports back"]
          ].map(([n, title, body]) => (
            <div key={n} className="rounded-2xl border border-white/12 bg-white/[.07] p-4 backdrop-blur">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e2c07b] text-xs font-black text-[#10394a]">{n}</span>
              <p className="mt-4 text-sm font-black">{title}</p>
              <p className="mt-1 text-[11px] font-medium leading-5 text-white/65">{body}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex items-center gap-3 text-[10px] font-bold text-white/60"><Icon name="shield" /> Demo uses fictional data and makes no database changes.</div>
      </div>
    </div>
  );
}

function SceneVisual({ scene }: { scene: Scene }) {
  if (scene.key === "intro") return <IntroScene />;
  if (scene.key === "requester") return <RequesterScene />;
  if (scene.key === "facility-review") return <FacilityScene />;
  if (scene.key === "partner") return <PartnerScene />;
  if (scene.key === "partner-complete") return <PartnerScene complete />;
  if (scene.key === "facility-release") return <FacilityScene release />;
  return <RequesterScene complete />;
}

export function ChurchWorkLaunchDemo() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [narrationEnabled, setNarrationEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const scene = scenes[index];
  const percent = ((index + 1) / scenes.length) * 100;

  const speakScene = useCallback((targetScene: Scene, advanceWhenDone: boolean) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSpeechSupported(false);
      return false;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(
      `${targetScene.title} ${targetScene.body}`
    );
    utterance.lang = "en-US";
    utterance.rate = 0.94;
    utterance.pitch = 0.98;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find((voice) =>
      voice.lang.toLowerCase().startsWith("en-us") &&
      /natural|samantha|ava|aria|jenny|guy|davis/i.test(voice.name)
    ) ?? voices.find((voice) => voice.lang.toLowerCase().startsWith("en-us"));

    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      if (advanceWhenDone) {
        setIndex((value) => {
          if (value >= scenes.length - 1) {
            setPlaying(false);
            return value;
          }
          return value + 1;
        });
      }
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeechSupported(false);
    };

    window.speechSynthesis.speak(utterance);
    return true;
  }, []);

  useEffect(() => {
    if (!playing) {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      return;
    }

    if (narrationEnabled && speechSupported) {
      const started = speakScene(scene, true);
      if (started) return;
    }

    const timer = window.setTimeout(() => {
      if (index >= scenes.length - 1) {
        setPlaying(false);
        return;
      }
      setIndex((value) => value + 1);
    }, 6500);

    return () => window.clearTimeout(timer);
  }, [index, narrationEnabled, playing, scene, speakScene, speechSupported]);

  useEffect(() => () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const nextLabel = useMemo(() => index === scenes.length - 1 ? "Replay demo" : index === 0 ? "Start walkthrough" : "Next", [index]);

  function next() {
    if (index === scenes.length - 1) {
      setIndex(0);
      setPlaying(true);
      return;
    }

    if (index === 0 && !playing) {
      setPlaying(true);
      return;
    }

    setPlaying(false);
    setIndex((value) => Math.min(value + 1, scenes.length - 1));
  }

  function back() {
    setPlaying(false);
    setIndex((value) => Math.max(value - 1, 0));
  }

  function replayNarration() {
    setPlaying(false);
    void speakScene(scene, false);
  }

  function toggleNarration() {
    const nextValue = !narrationEnabled;
    setNarrationEnabled(nextValue);

    if (!nextValue && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4efe5] text-[#123044]">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-9rem] top-[-9rem] h-[30rem] w-[30rem] rounded-full bg-[#cfe5d9]/55 blur-3xl" />
        <div className="absolute bottom-[-12rem] right-[-10rem] h-[34rem] w-[34rem] rounded-full bg-[#ead8aa]/35 blur-3xl" />
        <svg className="absolute inset-0 h-full w-full opacity-[.18]" aria-hidden="true">
          <defs>
            <pattern id="cw-grid" width="42" height="42" patternUnits="userSpaceOnUse">
              <path d="M 42 0 L 0 0 0 42" fill="none" stroke="#577369" strokeWidth=".35" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cw-grid)" />
        </svg>
      </div>

      <header className="relative z-10 border-b border-[#dcd6c9]/80 bg-[#fffdf9]/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[94rem] items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Logo />
          <div className="flex items-center gap-3">
            <span className="hidden text-xs font-bold text-[#71807e] md:inline">Guided product tour</span>
            <a href="/" className="rounded-xl border border-[#d7d4cb] bg-white/75 px-4 py-2.5 text-xs font-black text-[#244a40] transition hover:bg-white">Back to ChurchWork</a>
          </div>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-[94rem] px-5 py-7 sm:px-8 sm:py-10">
        <div className="grid items-center gap-8 xl:grid-cols-[26rem_1fr] xl:gap-12">
          <aside className="xl:sticky xl:top-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d9d3c7] bg-[#fffdf9]/80 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em]" style={{ color: scene.accent }}>
              <span className="h-2 w-2 rounded-full" style={{ background: scene.accent }} />
              {scene.role}
            </div>
            <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-[#728276]">{scene.label}</p>
            <h1 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.055em] text-[#102f40] sm:text-5xl">{scene.title}</h1>
            <p className="mt-5 text-sm font-medium leading-7 text-[#627278] sm:text-base">{scene.body}</p>

            <div className="mt-8 overflow-hidden rounded-full bg-[#ddd9cf]">
              <div className="h-1.5 rounded-full transition-all duration-500" style={{ width: `${percent}%`, background: scene.accent }} />
            </div>
            <div className="mt-3 flex items-center justify-between text-[10px] font-bold text-[#7c8785]">
              <span>{index + 1} / {scenes.length}</span>
              <span>{playing ? (isSpeaking && narrationEnabled ? "Narrating" : "Playing") : "Paused"}</span>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              {index > 0 ? <button type="button" onClick={back} className="rounded-xl border border-[#d4d1c8] bg-white/80 px-5 py-3 text-sm font-black text-[#4b6267] transition hover:bg-white">Back</button> : null}
              <button type="button" onClick={next} className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5" style={{ background: scene.accent }}>
                {nextLabel} <Icon name="arrow" />
              </button>
              {index > 0 && index < scenes.length - 1 ? (
                <button type="button" onClick={() => setPlaying((value) => !value)} className="rounded-xl border border-[#d4d1c8] bg-transparent px-4 py-3 text-xs font-black text-[#65767a]">
                  {playing ? "Pause" : "Auto-play"}
                </button>
              ) : null}
              <button
                type="button"
                onClick={toggleNarration}
                className="rounded-xl border border-[#d4d1c8] bg-white/60 px-4 py-3 text-xs font-black text-[#65767a]"
                aria-pressed={narrationEnabled}
              >
                {narrationEnabled ? "🔊 Narration on" : "🔇 Narration off"}
              </button>
              {speechSupported ? (
                <button type="button" onClick={replayNarration} className="rounded-xl border border-[#d4d1c8] bg-white/60 px-4 py-3 text-xs font-black text-[#65767a]">
                  ↻ Replay voice
                </button>
              ) : null}
            </div>

            <div className="mt-4 rounded-2xl border border-[#d9d3c7] bg-[#fffdf9]/70 p-4 backdrop-blur" aria-live="polite">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#71807e]">Narration</p>
                <span className="text-[10px] font-bold text-[#87928f]">{speechSupported ? (narrationEnabled ? "Voice + captions" : "Captions only") : "Captions only"}</span>
              </div>
              <p className="mt-2 text-xs font-semibold leading-5 text-[#52676d]">{scene.title} {scene.body}</p>
            </div>

            <div className="mt-8 space-y-2">
              {scenes.map((item, itemIndex) => (
                <button
                  type="button"
                  key={item.key}
                  onClick={() => { setPlaying(false); setIndex(itemIndex); }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${itemIndex === index ? "bg-white/80 shadow-sm" : "hover:bg-white/45"}`}
                >
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-black ${itemIndex <= index ? "text-white" : "border border-[#d1d4cf] bg-white/50 text-[#7b8784]"}`} style={itemIndex <= index ? { background: item.accent } : undefined}>
                    {itemIndex < index ? "✓" : itemIndex + 1}
                  </span>
                  <span>
                    <span className="block text-[11px] font-black text-[#314e54]">{item.role}</span>
                    <span className="block text-[9px] font-semibold text-[#82908d]">{item.label.replace(/^\d+ · /, "")}</span>
                  </span>
                </button>
              ))}
            </div>
          </aside>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[3rem] opacity-75 blur-3xl transition-colors duration-700" style={{ background: scene.soft }} />
            <div key={scene.key} className="relative animate-[cwDemoScene_.5s_ease-out]">
              <SceneVisual scene={scene} />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#ded9cf] bg-[#fffdf9]/80 p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-[#2f7b65]"><Icon name="shield" /><span className="text-[10px] font-black uppercase tracking-[0.12em]">Facility controlled</span></div>
                <p className="mt-2 text-[11px] font-semibold leading-5 text-[#66777a]">Grandview decides what reaches the care partner and what returns to the requester.</p>
              </div>
              <div className="rounded-2xl border border-[#ded9cf] bg-[#fffdf9]/80 p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-[#315c83]"><Icon name="church" /><span className="text-[10px] font-black uppercase tracking-[0.12em]">Role specific</span></div>
                <p className="mt-2 text-[11px] font-semibold leading-5 text-[#66777a]">Every person sees only the information and actions needed for their role.</p>
              </div>
              <div className="rounded-2xl border border-[#ded9cf] bg-[#fffdf9]/80 p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-[#7d6a34]"><Icon name="check" /><span className="text-[10px] font-black uppercase tracking-[0.12em]">Closed loop</span></div>
                <p className="mt-2 text-[11px] font-semibold leading-5 text-[#66777a]">The requester receives a clear safe update without needing to manage the workflow.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes cwDemoScene {
          from { opacity: 0; transform: translateY(12px) scale(.99); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </main>
  );
}
