"use client";

import type { ReactNode } from "react";
import { OperatorPortalSwitcher } from "@/components/OperatorPortalSwitcher";

export type ChurchWorkNavKey = "home" | "requests" | "new" | "assignments" | "completed" | "overview" | "organizations" | "users" | "activity" | "settings";

type NavItem = {
  key: ChurchWorkNavKey;
  label: string;
  icon: "home" | "request" | "plus" | "people" | "check" | "building" | "activity" | "settings";
};

type ChurchWorkAppShellProps = {
  organization: string;
  currentPortal?: "requester" | "facility" | "partner" | "admin";
  accountLabel?: string;
  navItems: NavItem[];
  activeKey: ChurchWorkNavKey;
  onNavigate: (key: ChurchWorkNavKey) => void;
  primaryAction?: { label: string; onClick: () => void };
  children: ReactNode;
};

function Icon({ name }: { name: NavItem["icon"] }) {
  const common = "h-5 w-5";
  if (name === "home") return <svg viewBox="0 0 24 24" fill="none" className={common} stroke="currentColor" strokeWidth="1.8"><path d="M3.5 10.5 12 3l8.5 7.5"/><path d="M5.5 9.5V21h13V9.5"/><path d="M9.5 21v-6h5v6"/></svg>;
  if (name === "request") return <svg viewBox="0 0 24 24" fill="none" className={common} stroke="currentColor" strokeWidth="1.8"><path d="M6 3.5h9l3 3V21H6z"/><path d="M15 3.5V7h3"/><path d="M9 11h6M9 15h6"/></svg>;
  if (name === "plus") return <svg viewBox="0 0 24 24" fill="none" className={common} stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>;
  if (name === "people") return <svg viewBox="0 0 24 24" fill="none" className={common} stroke="currentColor" strokeWidth="1.8"><circle cx="9" cy="8" r="3"/><path d="M3.5 20c.4-4 2.2-6 5.5-6s5.1 2 5.5 6"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 14.5c3.1-.5 5 1.3 5.5 4.5"/></svg>;
  if (name === "check") return <svg viewBox="0 0 24 24" fill="none" className={common} stroke="currentColor" strokeWidth="1.9"><circle cx="12" cy="12" r="9"/><path d="m8 12 2.6 2.6L16.5 9"/></svg>;
  if (name === "building") return <svg viewBox="0 0 24 24" fill="none" className={common} stroke="currentColor" strokeWidth="1.8"><path d="M4 21V8l8-4 8 4v13"/><path d="M2.5 21h19M8 10h2M14 10h2M8 14h2M14 14h2M10 21v-4h4v4"/></svg>;
  if (name === "activity") return <svg viewBox="0 0 24 24" fill="none" className={common} stroke="currentColor" strokeWidth="1.8"><path d="M4 19V9M10 19V4M16 19v-7M22 19H2"/></svg>;
  return <svg viewBox="0 0 24 24" fill="none" className={common} stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19 13.5v-3l-2-.7a7 7 0 0 0-.8-1.9l.9-1.9-2.1-2.1-1.9.9a7 7 0 0 0-1.9-.8L10.5 2h-3l-.7 2a7 7 0 0 0-1.9.8L3 3.9.9 6l.9 1.9A7 7 0 0 0 1 9.8l-2 .7v3l2 .7a7 7 0 0 0 .8 1.9L.9 18l2.1 2.1 1.9-.9a7 7 0 0 0 1.9.8l.7 2h3l.7-2a7 7 0 0 0 1.9-.8l1.9.9L18 18l-.9-1.9a7 7 0 0 0 .8-1.9z" transform="translate(2) scale(.83)"/></svg>;
}

export function ChurchWorkAppShell({
  organization,
  currentPortal,
  accountLabel = "My Account",
  navItems,
  activeKey,
  onNavigate,
  primaryAction,
  children
}: ChurchWorkAppShellProps) {
  return (
    <main className="min-h-screen bg-[#f6f2e9] text-[#123044]">
      <div className="min-h-screen lg:grid lg:grid-cols-[15.5rem_1fr]">
        <aside className="hidden border-r border-[#ddd8cc] bg-[#fbf9f4] lg:flex lg:min-h-screen lg:flex-col">
          <div className="border-b border-[#e5e0d6] px-6 py-5">
            <a href="/" className="flex items-center gap-3" aria-label="ChurchWork home">
              <img src="/brand/churchwork-corner-logo.png" alt="ChurchWork" className="h-9 w-12 object-contain" />
              <span className="font-serif text-2xl font-semibold tracking-[-0.04em] text-[#123044]">Church<span className="text-[#2f7b65]">Work</span></span>
            </a>
          </div>

          <div className="px-4 py-5">
            {primaryAction ? (
              <button type="button" onClick={primaryAction.onClick} className="mb-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#164f3e] px-4 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-[#123f33]">
                <Icon name="plus" />
                {primaryAction.label}
              </button>
            ) : null}

            <nav className="space-y-1">
              {navItems.map((item) => {
                const active = item.key === activeKey;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => onNavigate(item.key)}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold transition ${active ? "bg-[#e3eee7] text-[#164f3e]" : "text-[#425660] hover:bg-[#f1eee7] hover:text-[#123044]"}`}
                  >
                    <Icon name={item.icon} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto border-t border-[#e5e0d6] px-6 py-6">
            <div className="flex items-center gap-2 text-[#2f7b65]">
              <span className="text-xl">♥</span>
              <span className="text-xs font-bold uppercase tracking-[0.16em]">Spiritual care</span>
            </div>
            <p className="mt-3 font-serif text-lg italic leading-6 text-[#53666d]">People. Churches.<br />Care. Together.</p>
            <p className="mt-5 text-xs font-semibold text-[#87918f]">ChurchWork Pilot</p>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-30 border-b border-[#e5e0d6] bg-[#fffdf9]/95 backdrop-blur">
            <div className="flex min-h-[4.5rem] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <a href="/" className="flex items-center gap-2 lg:hidden">
                  <img src="/brand/churchwork-corner-logo.png" alt="ChurchWork" className="h-8 w-10 object-contain" />
                </a>
                <p className="truncate text-sm font-extrabold text-[#334b55]">{organization}</p>
              </div>
              <div className="flex items-center gap-3">
                {currentPortal ? <OperatorPortalSwitcher currentPortal={currentPortal} /> : null}
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dfece5] text-xs font-black text-[#164f3e]">CW</span>
                <span className="hidden text-sm font-bold text-[#334b55] sm:inline">{accountLabel}</span>
              </div>
            </div>
            <div className="flex gap-1 overflow-x-auto border-t border-[#eee9df] px-3 py-2 lg:hidden">
              {navItems.map((item) => (
                <button key={item.key} type="button" onClick={() => onNavigate(item.key)} className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-extrabold ${item.key === activeKey ? "bg-[#e3eee7] text-[#164f3e]" : "text-[#5d6d72]"}`}>
                  {item.label}
                </button>
              ))}
            </div>
          </header>

          <div className="mx-auto max-w-[92rem] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
