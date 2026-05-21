import type { ReactNode } from "react";
import Link from "next/link";
import { navigationItems, saveState } from "@/lib/static-data";

const accountMenuItems = [
  { label: "Settings", href: "/reports" },
  { label: "Help / Rules", href: "/governance" },
  { label: "Privacy", href: "/governance" },
  { label: "Legal", href: "/governance" },
  { label: "Security", href: "/governance" },
  { label: "System Info", href: "/governance" },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <aside className="border-b border-slate-200 bg-white lg:fixed lg:inset-y-0 lg:w-72 lg:border-b-0 lg:border-r">
        <div className="flex h-full flex-col gap-8 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-crcf-blue">Internal Use</p>
            <h1 className="mt-3 text-2xl font-bold leading-tight text-crcf-navy">CRCF Funding Command Center</h1>
            <p className="mt-3 text-sm text-slate-600">Source-backed funding workflows for staff review.</p>
          </div>

          <nav className="space-y-2 text-sm">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-xl px-3 py-2 font-medium text-slate-700 transition hover:bg-slate-100 hover:text-crcf-navy"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Account</p>
            <div className="mt-2 space-y-1">
              {accountMenuItems.map((item) => (
                <Link key={item.label} href={item.href} className="block rounded-lg px-2 py-1.5 hover:bg-white hover:text-crcf-navy">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <p className="font-semibold text-crcf-navy">Save State</p>
            <p className="mt-1">{saveState}</p>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-crcf-blue">Cookeville Regional Charitable Foundation</p>
              <p className="text-sm text-slate-600">Public sources only · human-reviewed · external actions disabled</p>
            </div>
            <span className="rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">Internal</span>
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">{children}</main>
        <footer className="border-t border-slate-200 bg-white px-6 py-4">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
            <p>Internal Use · Human review required before external action.</p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/governance" className="hover:text-crcf-navy">Privacy</Link>
              <Link href="/governance" className="hover:text-crcf-navy">Legal</Link>
              <Link href="/governance" className="hover:text-crcf-navy">Security</Link>
              <Link href="/governance" className="hover:text-crcf-navy">Help / Rules</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
