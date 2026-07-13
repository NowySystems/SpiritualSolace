"use client";

import { useEffect, useMemo, useState } from "react";

type DemoButtonAction = "Voice On" | "Replay" | "Back" | "Next" | "End";

function getDemoStepLabel() {
  const text = document.body.textContent ?? "";
  const match = text.match(/Guided demo\s*·\s*(\d+)\/(\d+)/i);
  if (!match) return null;

  return `${match[1]}/${match[2]}`;
}

function findButtonByLabel(label: DemoButtonAction) {
  const buttons = Array.from(document.querySelectorAll("button"));
  return buttons.find((button) => button.textContent?.trim().toLowerCase() === label.toLowerCase()) ?? null;
}

function clickDemoButton(label: DemoButtonAction) {
  const button = findButtonByLabel(label);
  if (!button || button.disabled) return;
  button.click();
}

export function ChurchWorkDemoControlsDock() {
  const [stepLabel, setStepLabel] = useState<string | null>(null);

  useEffect(() => {
    function syncDemoState() {
      setStepLabel(getDemoStepLabel());
    }

    const observer = new MutationObserver(syncDemoState);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    syncDemoState();

    return () => observer.disconnect();
  }, []);

  const actions = useMemo<DemoButtonAction[]>(() => ["Voice On", "Replay", "Back", "Next", "End"], []);

  if (!stepLabel) return null;

  return (
    <section className="churchwork-demo-controls-dock pointer-events-auto fixed bottom-5 right-5 z-[245] rounded-[1.35rem] border border-[#d8d0c0] bg-[#fffdf8]/96 p-3 text-[#102b3a] shadow-[0_1.5rem_4rem_rgba(13,43,59,0.24)] backdrop-blur" aria-label="Guided demo controls">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4 px-1">
          <span className="text-[0.65rem] font-black uppercase tracking-[0.16em] text-[#7a5b20]">Guided demo</span>
          <span className="rounded-full bg-[#173b2d] px-2.5 py-1 text-[0.65rem] font-black text-[#fff8e7]">{stepLabel}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {actions.map((action) => (
            <button
              key={action}
              type="button"
              onClick={() => clickDemoButton(action)}
              className={action === "Next" ? "rounded-full bg-[#173b2d] px-4 py-2 text-xs font-black text-white shadow-sm hover:bg-[#102b3a]" : "rounded-full border border-[#d8d0c0] bg-white px-3 py-2 text-xs font-black text-[#4d3f73] shadow-sm hover:bg-[#f7f3ea]"}
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
