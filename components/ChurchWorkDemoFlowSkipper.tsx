"use client";

import { useEffect, useRef } from "react";

const intermediateLedgerStepNumbers = new Set([10, 12, 16]);

function findGuidedDemoStepNumber() {
  const text = document.body.textContent ?? "";
  const match = text.match(/Guided demo\s*·\s*(\d+)\/(\d+)/i);
  if (!match) return null;

  return Number(match[1]);
}

function findNextButton() {
  const buttons = Array.from(document.querySelectorAll("button"));
  return buttons.find((button) => button.textContent?.trim().toLowerCase() === "next") ?? null;
}

export function ChurchWorkDemoFlowSkipper() {
  const lastSkippedStepRef = useRef<number | null>(null);

  useEffect(() => {
    let timeoutId: number | null = null;

    function maybeSkipIntermediateLedgerStop() {
      const stepNumber = findGuidedDemoStepNumber();
      if (!stepNumber || !intermediateLedgerStepNumbers.has(stepNumber)) return;
      if (lastSkippedStepRef.current === stepNumber) return;

      lastSkippedStepRef.current = stepNumber;

      if (timeoutId) window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        const nextButton = findNextButton();
        if (!nextButton || nextButton.disabled) return;
        nextButton.click();
      }, 360);
    }

    const observer = new MutationObserver(maybeSkipIntermediateLedgerStop);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    maybeSkipIntermediateLedgerStop();

    return () => {
      observer.disconnect();
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  return null;
}
