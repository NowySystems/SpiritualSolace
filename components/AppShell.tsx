import type { ReactNode } from "react";
import Link from "next/link";
import { navigationItems, saveState } from "@/lib/static-data";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <aside className="border-b border-slate-200 bg-white lg:fixed lg:inset-y-0 lg:w-72 lg:border-b-0 lg:border-r">
        <div className="flex h-full flex-col gap-6 p-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-slate-100 text-xs font-semibold tracking-[0.16em] text-slate-600">SS</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-crcf-blue">Demo Prototype</p>
                <h1 className="text-2xl font-bold leading-tight text-crcf-navy">SpiritualSolace</h1>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Calm, facility-controlled spiritual support request workflow for internal demonstration.
            </p>
          </div>

          <nav className="max-h-[44vh] space-y-1 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-2 text-sm">
            {navigationItems.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                className="block rounded-xl px-3 py-2 font-medium text-slate-700 transition hover:bg-white hover:text-crcf-navy"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <p className="font-semibold text-crcf-navy">Prototype framing</p>
            <ul className="space-y-1 text-xs leading-relaxed text-slate-600">
              <li>• No real patient data</li>
              <li>• One-way temporary messaging</li>
              <li>• Human review before delivery</li>
            </ul>
          </div>

          <div className="mt-auto rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
            <p className="font-semibold text-crcf-navy">Save State</p>
            <p className="mt-1 text-xs text-slate-600">{saveState}</p>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur">
          <div className="flex flex-col gap-1 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
            <p>SpiritualSolace demo shell · visual prototype only · no external actions · no real patient data</p>
            <p className="text-xs font-medium text-slate-500">Built by Nowy Systems · Demo Prototype</p>
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
