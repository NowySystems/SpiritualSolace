"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type DemoLane = "requester" | "facility" | "partner" | "requester-update";

type LaneInfo = {
  lane: DemoLane;
  eyebrow: string;
  title: string;
  subtitle: string;
  badge: string;
  shortLabel: string;
};

const laneInfo: Record<DemoLane, LaneInfo> = {
  requester: {
    lane: "requester",
    eyebrow: "Requester lane",
    title: "Sarah submits the need",
    subtitle: "The family/requester side creates a structured spiritual-care request with no medical details.",
    badge: "Requester",
    shortLabel: "Request"
  },
  facility: {
    lane: "facility",
    eyebrow: "Facility lane",
    title: "Facility reviews and controls sharing",
    subtitle: "The facility receives the request, reviews consent, and decides what can be shared externally.",
    badge: "Facility",
    shortLabel: "Facility"
  },
  partner: {
    lane: "partner",
    eyebrow: "Partner lane",
    title: "Partner receives approved context only",
    subtitle: "The church/partner sees only the approved assignment and reports back through structured actions.",
    badge: "Partner",
    shortLabel: "Partner"
  },
  "requester-update": {
    lane: "requester-update",
    eyebrow: "Requester update",
    title: "Sarah sees the approved outcome",
    subtitle: "The requester receives a safe update without facility-only notes or partner-only workflow details.",
    badge: "Requester update",
    shortLabel: "Update"
  }
};

const laneOrder: DemoLane[] = ["requester", "facility", "partner", "requester-update"];

function getStepNumber() {
  const text = document.body.textContent ?? "";
  const match = text.match(/Guided demo\s*·\s*(\d+)\/(\d+)/i);
  return match ? Number(match[1]) : null;
}

function laneForStep(stepNumber: number): DemoLane {
  if (stepNumber >= 20) return "requester-update";
  if (stepNumber >= 14) return "partner";
  if (stepNumber >= 8) return "facility";
  return "requester";
}

function previousLaneFor(lane: DemoLane) {
  if (lane === "facility") return laneInfo.requester.badge;
  if (lane === "partner") return laneInfo.facility.badge;
  if (lane === "requester-update") return laneInfo.partner.badge;
  return null;
}

export function ChurchWorkDemoRoleCue() {
  const [stepNumber, setStepNumber] = useState<number | null>(null);
  const [transitionLane, setTransitionLane] = useState<DemoLane | null>(null);
  const lastLaneRef = useRef<DemoLane | null>(null);
  const transitionTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    function syncStep() {
      const nextStep = getStepNumber();
      setStepNumber(nextStep);

      if (!nextStep) {
        lastLaneRef.current = null;
        setTransitionLane(null);
        return;
      }

      const nextLane = laneForStep(nextStep);
      if (lastLaneRef.current && lastLaneRef.current !== nextLane) {
        setTransitionLane(nextLane);
        if (transitionTimeoutRef.current) window.clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = window.setTimeout(() => setTransitionLane(null), 3000);
      }
      lastLaneRef.current = nextLane;
    }

    const observer = new MutationObserver(syncStep);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    syncStep();

    return () => {
      observer.disconnect();
      if (transitionTimeoutRef.current) window.clearTimeout(transitionTimeoutRef.current);
    };
  }, []);

  const currentLane = useMemo(() => (stepNumber ? laneForStep(stepNumber) : null), [stepNumber]);
  if (!stepNumber || !currentLane) return null;

  const current = laneInfo[currentLane];
  const transition = transitionLane ? laneInfo[transitionLane] : null;
  const previous = transition ? previousLaneFor(transition.lane) : null;

  return (
    <>
      <aside className="pointer-events-none fixed bottom-4 left-1/2 z-[210] w-[min(58rem,calc(100vw-1rem))] -translate-x-1/2 px-2 md:bottom-5">
        <div className="rounded-[1.4rem] border border-[#f2b84b]/45 bg-[#102b3a] p-3 text-[#fff8e7] shadow-[0_1.25rem_3rem_rgba(13,43,59,0.32)] ring-1 ring-white/10 backdrop-blur">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 whitespace-nowrap text-xs font-black uppercase tracking-[0.16em] text-[#fff8e7]">
              <span className="rounded-full bg-[#f2b84b] px-3 py-1 text-[#102b3a]">Demo path</span>
              <span className="hidden text-[#f2d68b] sm:inline">Current: {current.badge}</span>
              <span className="text-[#f2d68b] sm:hidden">{current.shortLabel}</span>
            </div>

            <ol className="grid grid-cols-4 gap-2 text-center text-[0.62rem] font-black uppercase tracking-[0.08em] text-[#d4dedc] md:flex md:items-center md:gap-2">
              {laneOrder.map((lane, index) => {
                const info = laneInfo[lane];
                const isActive = currentLane === lane;
                const isPast = laneOrder.indexOf(currentLane) > index;
                return (
                  <li key={lane} className="flex min-w-0 items-center gap-2 md:min-w-[7.5rem]">
                    <span
                      className={`block w-full rounded-full border px-2 py-2 transition ${
                        isActive
                          ? "border-[#f2b84b] bg-[#f2b84b] text-[#102b3a] shadow-sm"
                          : isPast
                            ? "border-[#8dbd9e]/55 bg-[#173b2d] text-[#edf5e6]"
                            : "border-white/15 bg-white/10 text-[#d4dedc]"
                      }`}
                    >
                      {info.shortLabel}
                    </span>
                    {index < laneOrder.length - 1 ? <span className="hidden shrink-0 text-[#f2b84b] md:block">→</span> : null}
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </aside>

      {transition ? (
        <div className="pointer-events-none fixed inset-0 z-[220] flex items-center justify-center px-5">
          <div className="absolute inset-0 bg-[#0d2b3b]/18 backdrop-blur-[1px]" />
          <section className="relative w-[min(48rem,calc(100vw-2rem))] rounded-[2rem] border border-[#f2b84b]/70 bg-[#fffdf8] p-7 text-center shadow-[0_3rem_8rem_rgba(13,43,59,0.38)] animate-[churchwork-role-cue-enter_3s_cubic-bezier(0.16,1,0.3,1)_both]">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#7a5b20]">{transition.eyebrow}</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.045em] text-[#0d2b3b] md:text-5xl">{transition.title}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-7 text-[#4d5d55]">{transition.subtitle}</p>
            {previous ? (
              <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-[#d8d0c0] bg-[#f7f3ea] px-4 py-2 text-sm font-black text-[#173b2d]">
                <span>{previous}</span>
                <span className="text-[#7a5b20]">→</span>
                <span>{transition.badge}</span>
              </div>
            ) : null}
          </section>
        </div>
      ) : null}
    </>
  );
}
