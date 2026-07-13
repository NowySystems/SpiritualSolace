"use client";

import { useEffect, useRef } from "react";

const animationDurationMs = 5200;
const centerHoldStart = 0.24;
const centerHoldEnd = 0.74;

function getActiveDemoField() {
  return document.querySelector("form.churchwork-demo-active [data-demo-field-active='true']") as HTMLElement | null;
}

function getFieldKey(element: HTMLElement) {
  const form = element.closest("form");
  const labels = form ? Array.from(form.querySelectorAll("label")) : [];
  const index = labels.indexOf(element as HTMLLabelElement);
  const text = element.textContent?.replace(/\s+/g, " ").trim() ?? "";
  const stepText = document.body.textContent?.match(/Guided demo\s*·\s*(\d+)\/(\d+)/i)?.[0] ?? "";
  return `${stepText}-${index}-${text.slice(0, 80)}`;
}

function styleClone(clone: HTMLElement, sourceRect: DOMRect) {
  clone.setAttribute("aria-hidden", "true");
  clone.style.position = "fixed";
  clone.style.left = `${sourceRect.left}px`;
  clone.style.top = `${sourceRect.top}px`;
  clone.style.width = `${sourceRect.width}px`;
  clone.style.height = `${sourceRect.height}px`;
  clone.style.margin = "0";
  clone.style.zIndex = "190";
  clone.style.pointerEvents = "none";
  clone.style.transformOrigin = "center center";
  clone.style.boxSizing = "border-box";
  clone.style.border = "3px solid rgba(242, 184, 75, 0.96)";
  clone.style.borderRadius = "1.75rem";
  clone.style.background = "linear-gradient(135deg, rgba(255, 252, 244, 0.99), rgba(239, 247, 245, 0.98))";
  clone.style.boxShadow = "0 2.5rem 6rem rgba(13, 43, 59, 0.32), 0 0 0 0.6rem rgba(242, 184, 75, 0.22)";
  clone.style.padding = "2rem";
  clone.style.display = "flex";
  clone.style.flexDirection = "column";
  clone.style.justifyContent = "center";
  clone.style.overflow = "hidden";
  clone.style.willChange = "left, top, width, height, transform, opacity, filter";
}

function styleCloneChildren(clone: HTMLElement) {
  const stepBadge = clone.querySelector("span[class*='Current step']") as HTMLElement | null;
  if (stepBadge) {
    stepBadge.style.background = "#173b2d";
    stepBadge.style.color = "#fff8e7";
    stepBadge.style.top = "-0.9rem";
    stepBadge.style.left = "1.25rem";
  }

  const select = clone.querySelector("select") as HTMLSelectElement | null;
  if (select) {
    select.style.minHeight = "5rem";
    select.style.marginTop = "1.25rem";
    select.style.fontSize = "1.35rem";
    select.style.fontWeight = "900";
    select.style.borderRadius = "1rem";
  }

  const checkbox = clone.querySelector("input[type='checkbox']") as HTMLInputElement | null;
  if (checkbox) {
    checkbox.style.width = "2rem";
    checkbox.style.height = "2rem";
  }
}

function getTargetRect(sourceRect: DOMRect) {
  const targetWidth = Math.min(820, Math.max(560, window.innerWidth * 0.58));
  const targetHeight = Math.min(330, Math.max(230, sourceRect.height * 2.35));
  return {
    left: (window.innerWidth - targetWidth) / 2,
    top: (window.innerHeight - targetHeight) / 2 + 18,
    width: targetWidth,
    height: targetHeight
  };
}

function animateField(element: HTMLElement) {
  const sourceRect = element.getBoundingClientRect();
  if (!sourceRect.width || !sourceRect.height) return null;

  const target = getTargetRect(sourceRect);
  const clone = element.cloneNode(true) as HTMLElement;
  styleClone(clone, sourceRect);
  styleCloneChildren(clone);
  document.body.appendChild(clone);

  element.classList.add("churchwork-demo-field-origin-highlight");

  const animation = clone.animate(
    [
      {
        left: `${sourceRect.left}px`,
        top: `${sourceRect.top}px`,
        width: `${sourceRect.width}px`,
        height: `${sourceRect.height}px`,
        opacity: "0.72",
        transform: "scale(1)",
        filter: "saturate(0.95) blur(0.5px)",
        offset: 0
      },
      {
        left: `${sourceRect.left}px`,
        top: `${sourceRect.top}px`,
        width: `${sourceRect.width}px`,
        height: `${sourceRect.height}px`,
        opacity: "1",
        transform: "scale(1.05)",
        filter: "saturate(1.1) blur(0)",
        offset: 0.08
      },
      {
        left: `${target.left}px`,
        top: `${target.top}px`,
        width: `${target.width}px`,
        height: `${target.height}px`,
        opacity: "1",
        transform: "scale(1.055)",
        filter: "saturate(1.18) blur(0)",
        offset: centerHoldStart
      },
      {
        left: `${target.left}px`,
        top: `${target.top}px`,
        width: `${target.width}px`,
        height: `${target.height}px`,
        opacity: "1",
        transform: "scale(1.055)",
        filter: "saturate(1.18) blur(0)",
        offset: centerHoldEnd
      },
      {
        left: `${sourceRect.left}px`,
        top: `${sourceRect.top}px`,
        width: `${sourceRect.width}px`,
        height: `${sourceRect.height}px`,
        opacity: "0.86",
        transform: "scale(1.01)",
        filter: "saturate(1.02) blur(0)",
        offset: 0.92
      },
      {
        left: `${sourceRect.left}px`,
        top: `${sourceRect.top}px`,
        width: `${sourceRect.width}px`,
        height: `${sourceRect.height}px`,
        opacity: "0",
        transform: "scale(0.98)",
        filter: "saturate(0.95) blur(0.5px)",
        offset: 1
      }
    ],
    {
      duration: animationDurationMs,
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      fill: "both"
    }
  );

  const cleanup = () => {
    clone.remove();
    element.classList.remove("churchwork-demo-field-origin-highlight");
  };

  animation.addEventListener("finish", cleanup, { once: true });
  animation.addEventListener("cancel", cleanup, { once: true });

  return animation;
}

export function ChurchWorkDemoBalloonAnimator() {
  const lastAnimatedKeyRef = useRef<string | null>(null);
  const activeAnimationRef = useRef<Animation | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timeoutId: number | null = null;

    function scheduleAnimation() {
      const activeField = getActiveDemoField();
      if (!activeField) return;

      const key = getFieldKey(activeField);
      if (lastAnimatedKeyRef.current === key) return;
      lastAnimatedKeyRef.current = key;

      if (timeoutId) window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        const currentField = getActiveDemoField();
        if (!currentField || getFieldKey(currentField) !== key) return;

        activeAnimationRef.current?.cancel();
        activeAnimationRef.current = animateField(currentField);
      }, 140);
    }

    const observer = new MutationObserver(scheduleAnimation);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["data-demo-field-active", "class"] });
    scheduleAnimation();

    return () => {
      observer.disconnect();
      if (timeoutId) window.clearTimeout(timeoutId);
      activeAnimationRef.current?.cancel();
    };
  }, []);

  return null;
}
