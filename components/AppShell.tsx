import type { ReactNode } from "react";
import Link from "next/link";
import { navigationItems, saveState } from "@/lib/static-data";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <aside className="border-b border-slate-200 bg-white lg:fixed lg:inset-y-0 lg:w-72 lg:border-b-0 lg:border-r">
        <div className="flex h-full flex-col gap-8 p-6">
          <div>
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 64 64" className="h-10 w-10" aria-hidden="true">
                <circle cx="32" cy="32" r="30" fill="#E0F2FE" />
                <path d="M14 38c6-10 30-10 36 0" stroke="#0EA5E9" strokeWidth="4" fill="none" strokeLinecap="round"/>
                <circle cx="32" cy="23" r="6" fill="#0284C7" />
                <path d="M24 26c4 4 12 4 16 0" stroke="#BAE6FD" strokeWidth="2" fill="none" strokeLinecap="round"/>
              </svg>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-crcf-blue">Demo Prototype</p>
                <h1 className="text-2xl font-bold leading-tight text-crcf-navy">SpiritualSolace</h1>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-600">Patient-first spiritual support request flow with facility review controls.</p>
          </div>

          <nav className="space-y-2 text-sm">
            {navigationItems.map((item) => (
              <Link key={item.href + item.label} href={item.href} className="block rounded-xl px-3 py-2 font-medium text-slate-700 transition hover:bg-slate-100 hover:text-crcf-navy">{item.label}</Link>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <p className="font-semibold text-crcf-navy">Save State</p>
            <p className="mt-1">{saveState}</p>
          </div>
        </div>
      </aside>
      <div className="flex min-h-screen flex-1 flex-col lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur">
          <p className="text-sm text-slate-600">SpiritualSolace demo shell · visual prototype only · no external actions.</p>
        </header>
        <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
