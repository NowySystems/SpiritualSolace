"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationItems, saveState } from "@/lib/static-data";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f3e8] via-[#f6f1e7] to-[#eef2ee] lg:flex">
      <aside className="border-b border-[#ddd8cd] bg-[#f7f2e8]/95 lg:fixed lg:inset-y-0 lg:w-80 lg:border-b-0 lg:border-r">
        <div className="flex h-full flex-col gap-7 p-6 lg:p-7">
          <div className="rounded-3xl border border-[#e2dbcf] bg-white/70 p-5 shadow-[0_8px_30px_rgba(77,94,86,0.08)]">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#d6d0c3] bg-[#f1ece3] text-xs font-semibold tracking-[0.16em] text-[#50625b]">SS</span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5f746d]">Demo Prototype</p>
                <h1 className="mt-1 text-2xl font-semibold leading-tight text-[#1f3442]">SpiritualSolace</h1>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[#4c5e56]">
              Facility-controlled spiritual support operations preview with calm, human-reviewed workflows.
            </p>
          </div>

          <nav className="max-h-[52vh] space-y-2 overflow-y-auto rounded-3xl border border-[#e2dbcf] bg-white/75 p-3 text-sm shadow-[0_8px_22px_rgba(66,84,76,0.06)]">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  className={`block rounded-2xl px-4 py-3 font-medium transition ${
                    isActive
                      ? "border border-[#d8d9cf] bg-gradient-to-r from-[#edf1ea] to-[#f8f3ea] text-[#243847] shadow-sm"
                      : "text-[#4e6058] hover:bg-[#f4efe6] hover:text-[#223746]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="space-y-3 rounded-3xl border border-[#e2dbcf] bg-[#f8f5ed] p-5 text-sm text-[#485a53] shadow-[0_8px_20px_rgba(76,94,86,0.06)]">
            <p className="font-semibold text-[#223746]">Prototype safeguards</p>
            <ul className="space-y-1.5 text-xs leading-relaxed text-[#5a6b64]">
              <li>• No real patient data</li>
              <li>• One-way temporary messaging only</li>
              <li>• Human review before any delivery</li>
            </ul>
          </div>

          <div className="mt-auto rounded-3xl border border-[#e2dbcf] bg-white/80 p-5 text-sm text-[#495b54] shadow-[0_8px_20px_rgba(76,94,86,0.06)]">
            <p className="font-semibold text-[#223746]">Save State</p>
            <p className="mt-1 text-xs leading-relaxed text-[#5f716a]">{saveState}</p>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col lg:pl-80">
        <header className="sticky top-0 z-10 border-b border-[#ddd8cd] bg-[#f9f5ec]/95 px-6 py-4 backdrop-blur lg:px-8">
          <div className="flex flex-col gap-1.5 text-sm text-[#4f6058] md:flex-row md:items-center md:justify-between">
            <p className="leading-relaxed">SpiritualSolace demo shell · visual prototype only · no external actions · no real patient data</p>
            <p className="text-xs font-medium tracking-[0.02em] text-[#6b7a74]">Built by Nowy Systems · Demo Prototype</p>
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-8 md:px-6 lg:px-8 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
