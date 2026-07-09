"use client";

import { ReactNode, useEffect } from "react";

type ChurchWorkDemoAutoScrollProps = {
  children: ReactNode;
};

function isVisible(element: Element) {
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function findActiveDemoTarget() {
  const explicitTargets = Array.from(document.querySelectorAll<HTMLElement>('[data-demo-field-active="true"], [data-demo-active="true"]')).filter(isVisible);
  if (explicitTargets.length) return explicitTargets[0];

  const highlightedTargets = Array.from(document.querySelectorAll<HTMLElement>('.churchwork-demo-active, [class*="ring-[#cbbbea]"], [class*="ring-[#d8c5ff]"]')).filter(isVisible);
  return highlightedTargets[0] ?? null;
}

function centerTargetInScrollContainer(target: HTMLElement, parent: HTMLElement) {
  const parentRect = parent.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  const targetCenter = targetRect.top + targetRect.height / 2;
  const parentCenter = parentRect.top + parentRect.height / 2;
  const nextTop = parent.scrollTop + targetCenter - parentCenter;

  parent.scrollTo({ top: Math.max(0, nextTop), behavior: "smooth" });
}

function scrollContainingPanels(target: HTMLElement) {
  let parent = target.parentElement;

  while (parent && parent !== document.body) {
    const style = window.getComputedStyle(parent);
    const canScroll = /(auto|scroll)/.test(`${style.overflow}${style.overflowY}${style.overflowX}`);

    if (canScroll && parent.scrollHeight > parent.clientHeight) {
      centerTargetInScrollContainer(target, parent);
    }

    parent = parent.parentElement;
  }
}

function centerTargetInViewport(target: HTMLElement) {
  const rect = target.getBoundingClientRect();
  const headerAllowance = 96;
  const availableHeight = Math.max(360, window.innerHeight - headerAllowance);
  const targetTop = window.scrollY + rect.top;
  const desiredTop = rect.height > availableHeight * 0.78
    ? targetTop - headerAllowance
    : targetTop - (window.innerHeight - rect.height) / 2;

  window.scrollTo({ top: Math.max(0, desiredTop), behavior: "smooth" });
}

function markTargetAsSettling(target: HTMLElement) {
  target.dataset.demoSpotlight = "true";
  window.setTimeout(() => {
    if (target.dataset.demoSpotlight === "true") {
      delete target.dataset.demoSpotlight;
    }
  }, 900);
}

export function ChurchWorkDemoAutoScroll({ children }: ChurchWorkDemoAutoScrollProps) {
  useEffect(() => {
    let timer: number | undefined;
    let lastSignature = "";

    function scrollToActiveTarget() {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const target = findActiveDemoTarget();
        if (!target) return;

        const rect = target.getBoundingClientRect();
        const signature = `${target.tagName}:${target.dataset.demoActive ?? ""}:${target.dataset.demoFieldActive ?? ""}:${target.textContent?.slice(0, 42)}:${Math.round(rect.width)}x${Math.round(rect.height)}`;
        if (signature === lastSignature) return;
        lastSignature = signature;

        markTargetAsSettling(target);
        scrollContainingPanels(target);
        window.setTimeout(() => centerTargetInViewport(target), 80);
      }, 110);
    }

    const observer = new MutationObserver(scrollToActiveTarget);
    observer.observe(document.body, {
      subtree: true,
      attributes: true,
      childList: true,
      attributeFilter: ["class", "data-demo-active", "data-demo-field-active", "data-demo-spotlight", "aria-live"]
    });

    scrollToActiveTarget();

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return <>{children}</>;
}
