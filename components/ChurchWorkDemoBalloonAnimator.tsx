"use client";

import { useEffect, useRef } from "react";

const animationDurationMs = 5200;
const centerHoldStart = 0.28;
const centerHoldEnd = 0.78;

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
  clone.classList.add("churchwork-demo-balloon-clone");
  clone.setAttribute("aria-hidden", "true");
  clone.style.position = "fixed";
  clone.style.left = `${sourceRect.left}px`;
  clone.style.top = `${sourceRect.top}px`;
  clone.style.width = `${sourceRect.width}px`;
  clone.style.height = `${sourceRect.height}px`;
  clone.style.maxWidth = "none";
  clone.style.maxHeight = "none";
  clone.style.margin = "0";
  clone.style.zIndex = "520";
  clone.style.pointerEvents = "none";
  clone.style.transformOrigin = "center center";
  clone.style.boxSizing = "border-box";
  clone.style.border = "3px solid rgba(242, 184, 75, 0.98)";
  clone.style.borderRadius = "1.75rem";
  clone.style.background = "linear-gradient(135deg, rgba(255, 252, 244, 0.99), rgba(239, 247, 245, 0.98))";
  clone.style.boxShadow = "0 3rem 8rem rgba(13, 43, 59, 0.42), 0 0 0 0.72rem rgba(242, 184, 75, 0.24)";
  clone.style.padding = "2rem";
  clone.style.display = "flex";
  clone.style.flexDirection = "column";
  clone.style.justifyContent = "center";
  clone.style.overflow = "hidden";
  clone.style.willChange = "transform, opacity, filter";
  clone.style.isolation = "isolate";
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

function getTargetMotion(sourceRect: DOMRect) {
  const sourceCenterX = sourceRect.left + sourceRect.width / 2;
  const sourceCenterY = sourceRect.top + sourceRect.height / 2;
  const targetCenterX = window.innerWidth / 2;
  const targetCenterY = window.innerHeight / 2;

  const targetWidth = Math.min(860, Math.max(560, window.innerWidth * 0.58));
  const targetHeight = Math.min(350, Math.max(240, sourceRect.height * 2.45));
  const scaleX = targetWidth / Math.max(sourceRect.width, 1);
  const scaleY = targetHeight / Math.max(sourceRect.height, 1);
  const scale = Math.max(1.38, Math.min(2.15, Math.min(scaleX, scaleY)));

  return {
    dx: targetCenterX - sourceCenterX,
    dy: targetCenterY - sourceCenterY,
    scale
  };
}

function animateField(element: HTMLElement) {
  const sourceRect = element.getBoundingClientRect();
  if (!sourceRect.width || !sourceRect.height) return;

  const target = getTargetMotion(sourceRect);
  const clone = element.cloneNode(true) as HTMLElement;
  styleClone(clone, sourceRect);
  styleCloneChildren(clone);
  document.body.appendChild(clone);

  element.classList.add("churchwork-demo-field-origin-highlight");

  const centerTransform = `translate3d(${target.dx}px, ${target.dy}px, 0) scale(${target.scale})`;

  const animation = clone.animate(
    [
      {
        opacity: "0.78",
        transform: "translate3d(0, 0, 0) scale(1)",
        filter: "saturate(0.95) blur(0.5px)",
        offset: 0
      },
      {
        opacity: "1",
        transform: "translate3d(0, -0.5rem, 0) scale(1.06)",
        filter: "saturate(1.08) blur(0)",
        offset: 0.11
      },
      {
        opacity: "1",
        transform: centerTransform,
        filter: "saturate(1.18) blur(0)",
        offset: centerHoldStart
      },
      {
        opacity: "1",
        transform: centerTransform,
        filter: "saturate(1.18) blur(0)",
        offset: centerHoldEnd
      },
      {
        opacity: "0.28",
        transform: "translate3d(0, 0, 0) scale(1)",
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

  animation.addEventListener("finish", () => {
    clone.remove();
    element.classList.remove("churchwork-demo-field-origin-highlight");
  });

  animation.addEventListener("cancel", () => {
    clone.remove();
    element.classList.remove("churchwork-demo-field-origin-highlight");
  });
}

export function ChurchWorkDemoBalloonAnimator() {
  const lastAnimatedKeyRef = useRef<string | null>(null);

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
        animateField(currentField);
      }, 120);
    }

    const observer = new MutationObserver(scheduleAnimation);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["data-demo-field-active", "class"] });
    scheduleAnimation();

    return () => {
      observer.disconnect();
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  return null;
}
