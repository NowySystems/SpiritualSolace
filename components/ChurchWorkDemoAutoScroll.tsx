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
  const candidates = Array.from(document.querySelectorAll<HTMLElement>('[class*="ring-[#cbbbea]"]')).filter(isVisible);
  if (!candidates.length) return null;

  const activeField = candidates.find((element) => element.tagName.toLowerCase() === "label");
  if (activeField) return activeField;

  return candidates[candidates.length - 1];
}

export function ChurchWorkDemoAutoScroll({ children }: ChurchWorkDemoAutoScrollProps) {
  useEffect(() => {
    let timer: number | undefined;
    let lastTarget: Element | null = null;

    function scrollToActiveTarget() {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const target = findActiveDemoTarget();
        if (!target || target === lastTarget) return;

        lastTarget = target;
        target.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
      }, 90);
    }

    const observer = new MutationObserver(scrollToActiveTarget);
    observer.observe(document.body, {
      subtree: true,
      attributes: true,
      childList: true,
      attributeFilter: ["class", "aria-live"]
    });

    scrollToActiveTarget();

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return <>{children}</>;
}
