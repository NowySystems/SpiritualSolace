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

function scrollContainingPanels(target: HTMLElement) {
  let parent = target.parentElement;

  while (parent && parent !== document.body) {
    const style = window.getComputedStyle(parent);
    const canScroll = /(auto|scroll)/.test(`${style.overflow}${style.overflowY}${style.overflowX}`);

    if (canScroll && parent.scrollHeight > parent.clientHeight) {
      const parentRect = parent.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const nextTop = parent.scrollTop + targetRect.top - parentRect.top - 24;
      parent.scrollTo({ top: Math.max(0, nextTop), behavior: "smooth" });
    }

    parent = parent.parentElement;
  }
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
        const signature = `${target.tagName}:${target.textContent?.slice(0, 42)}:${Math.round(rect.top)}:${Math.round(rect.left)}`;
        if (signature === lastSignature) return;
        lastSignature = signature;

        scrollContainingPanels(target);

        const targetTop = window.scrollY + target.getBoundingClientRect().top - 130;
        window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
      }, 120);
    }

    const observer = new MutationObserver(scrollToActiveTarget);
    observer.observe(document.body, {
      subtree: true,
      attributes: true,
      childList: true,
      attributeFilter: ["class", "data-demo-active", "data-demo-field-active", "aria-live"]
    });

    scrollToActiveTarget();

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return <>{children}</>;
}
