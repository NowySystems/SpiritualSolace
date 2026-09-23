"use client";

import type { ReactNode } from "react";
import { OperatorPortalSwitcher } from "@/components/OperatorPortalSwitcher";

export type ChurchWorkNavKey = "home" | "requests" | "new" | "assignments" | "completed" | "overview" | "organizations" | "users" | "activity" | "settings";

type NavItem = {
  key: ChurchWorkNavKey;
  label: string;
  icon: "home" | "request" | "plus" | "people" | "check" | "building" | "activity" | "settings";
};

type PortalKey = "requester" | "facility" | "partner" | "admin";

type ChurchWorkAppShellProps = {
  organization: string;
  currentPortal?: PortalKey;
  accountLabel?: string;
  navItems: NavItem[];
  activeKey: ChurchWorkNavKey;
  onNavigate: (key: ChurchWorkNavKey) => void;
  onSignOut?: () => void;
  primaryAction?: { label: string; onClick: () => void };
  children: ReactNode;
};

const portalTheme: Record<PortalKey, {
  accent: string;
  accentDark: string;
  soft: string;
  sidebar: string;
  label: string;
  descriptor: string;
}> = {
  requester: {
    accent: "#2f7b65",
    accentDark: "#173f34",
    soft: "#e5f1eb",
    sidebar: "#153d34",
    label: "Requester",
    descriptor: "Spiritual-care requests"
  },
  facility: {
    accent: "#416f96",
    accentDark: "#294c69",
    soft: "#eaf2f8",
    sidebar: "#203f58",
    label: "Facility",
    descriptor: "Review & release"
  },
  partner: {
    accent: "#87713a",
    accentDark: "#5f512d",
    soft: "#f4edda",
    sidebar: "#4e442b",
    label: "Care Partner",
    descriptor: "Assignments & outcomes"
  },
  admin: {
    accent: "#6f5c8c",
    accentDark: "#4d3f68",
    soft: "#f0ebf5",
    sidebar: "#3f3650",
    label: "Admin",
    descriptor: "ChurchWork operations"
  }
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
  currentPortal = "requester",
  accountLabel = "My Account",
  navItems,
  activeKey,
  onNavigate,
  onSignOut,
  primaryAction,
  children
}: ChurchWorkAppShellProps) {
  const theme = portalTheme[currentPortal];

  return (
    <main className="min-h-screen bg-[#f5f1e8] text-[#123044]">
      <div
        className="pointer-events-none fixed inset-0 opacity-80"
        style={{
          background: `radial-gradient(circle at 80% -10%, ${theme.soft} 0, transparent 30rem), radial-gradient(circle at 20% 110%, rgba(231,213,169,.22) 0, transparent 28rem)`
        }}
      />

      <div className="relative min-h-screen lg:grid lg:grid-cols-[17.5rem_1fr]">
        <aside className="hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:overflow-hidden" style={{ background: theme.sidebar }}>
          <div className="px-6 pb-5 pt-6">
            <a href="/" className="inline-flex items-center gap-3" aria-label="ChurchWork home">
              <span className="flex h-11 w-14 items-center justify-center rounded-2xl bg-white shadow-lg shadow-black/10">
                <img src="/brand/churchwork-corner-logo.png" alt="ChurchWork" className="h-8 w-10 object-contain" />
              </span>
              <span className="font-serif text-2xl font-semibold tracking-[-0.045em] text-white">
                Church<span className="text-[#b9d9c8]">Work</span>
              </span>
            </a>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[.07] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/50">{theme.label} workspace</p>
              <p className="mt-1 truncate text-sm font-black text-white">{organization}</p>
              <p className="mt-1 text-xs font-semibold text-white/55">{theme.descriptor}</p>
            </div>
          </div>

          <div className="px-4">
            {primaryAction ? (
              <button
                type="button"
                onClick={primaryAction.onClick}
                className="mb-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-black shadow-lg shadow-black/10 transition hover:-translate-y-0.5"
                style={{ color: theme.accentDark }}
              >
                <Icon name="plus" />
                {primaryAction.label}
              </button>
            ) : null}

            <p className="mb-2 px-3 text-[10px] font-black uppercase tracking-[0.18em] text-white/35">Workspace</p>
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const active = item.key === activeKey;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => onNavigate(item.key)}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold transition ${active ? "bg-white text-[#163a32] shadow-lg shadow-black/10" : "text-white/70 hover:bg-white/10 hover:text-white"}`}
                  >
                    <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${active ? "bg-[#edf4f0]" : "bg-white/[.06]"}`} style={active ? { color: theme.accent } : undefined}>
                      <Icon name={item.icon} />
                    </span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto p-5">
            <div className="rounded-2xl border border-white/10 bg-white/[.06] p-4">
              <div className="flex items-center gap-2 text-[#d8e9df]">
                <span className="text-lg">♥</span>
                <span className="text-[10px] font-black uppercase tracking-[0.16em]">Spiritual care</span>
              </div>
              <p className="mt-2 font-serif text-base italic leading-6 text-white/75">People. Churches.<br />Care. Together.</p>
              <div className="mt-4 flex items-center justify-between text-[10px] font-bold text-white/40">
                <span>ChurchWork</span>
                <span>Pilot</span>
              </div>
            </div>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-30 border-b border-[#ded8cb] bg-[#fffdf9]/92 shadow-[0_8px_30px_rgba(18,48,68,.04)] backdrop-blur-xl">
            <div className="flex min-h-[5rem] items-center justify-between gap-4 px-4 sm:px-6 lg:px-9">
              <div className="flex min-w-0 items-center gap-3">
                <a href="/" className="flex items-center gap-2 lg:hidden">
                  <span className="flex h-9 w-11 items-center justify-center rounded-xl bg-white shadow-sm">
                    <img src="/brand/churchwork-corner-logo.png" alt="ChurchWork" className="h-7 w-9 object-contain" />
                  </span>
                </a>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-black text-[#213f49]">{organization}</p>
                    <span className="hidden rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] sm:inline" style={{ background: theme.soft, color: theme.accentDark }}>{theme.label}</span>
                  </div>
                  <p className="mt-0.5 hidden text-[11px] font-semibold text-[#7c8987] sm:block">{theme.descriptor}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <OperatorPortalSwitcher currentPortal={currentPortal} />
                <div className="hidden h-8 w-px bg-[#e1ddd4] sm:block" />
                <div className="flex items-center gap-2 rounded-xl border border-[#e0dbd1] bg-white/80 p-1.5 pl-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-black" style={{ background: theme.soft, color: theme.accentDark }}>CW</span>
                  <span className="hidden pr-1 text-xs font-black text-[#40565e] md:inline">{accountLabel}</span>
                  {onSignOut ? (
                    <button type="button" onClick={onSignOut} className="rounded-lg px-2 py-1.5 text-[10px] font-black text-[#7b8787] transition hover:bg-[#f3f0ea] hover:text-[#314d55]">
                      Sign out
                    </button>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex gap-1 overflow-x-auto border-t border-[#eee9df] bg-[#fffdf9]/90 px-3 py-2 lg:hidden">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => onNavigate(item.key)}
                  className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-black transition ${item.key === activeKey ? "shadow-sm" : "text-[#65757a]"}`}
                  style={item.key === activeKey ? { background: theme.soft, color: theme.accentDark } : undefined}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </header>

          <div className="mx-auto max-w-[96rem] px-4 py-6 sm:px-6 lg:px-9 lg:py-9">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
