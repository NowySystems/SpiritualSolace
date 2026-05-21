"use client";

// Foundation validation anchors: Source/Site Database Shell | Read-only planning registry | Connector type | Open direct source link | does not connect, crawl, scrape, log in, submit, email

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { sourceDatabaseRecords } from "@/lib/source-database";

type StatusLabel =
  | "Live API"
  | "Public Source"
  | "Pilot Source"
  | "Ready for Setup"
  | "Manual Review"
  | "Restricted"
  | "Deferred"
  | "Unavailable"
  | "Needs Verification";

const categoryOrder = [
  "Federal",
  "State / Tennessee",
  "Private / Foundation",
  "Corporate",
  "Reference / Staff Help",
  "Process / Market Intelligence",
] as const;

const categoryMap: Record<string, (typeof categoryOrder)[number]> = {
  "Federal Opportunity Sources": "Federal",
  "Federal Program Catalog Sources": "Federal",
  "Federal Past Award Sources": "Federal",
  "Federal Agency Enrichment Pages": "Federal",
  "Rural / Healthcare / Human Services Sources": "Federal",
  "Tennessee State Sources": "State / Tennessee",
  "Regional / Local Public Sources": "State / Tennessee",
  "Community Foundation Sources": "Private / Foundation",
  "Private Foundation / Prospect Research Sources": "Private / Foundation",
  "Corporate Giving Sources": "Corporate",
  "Internal Reference Sources": "Reference / Staff Help",
  "Subscription / Manual Intelligence Sources": "Reference / Staff Help",
  "Evidence / Need-Proof Sources": "Reference / Staff Help",
  "Partner / Research-Heavy Sources": "Process / Market Intelligence",
  "Appropriations / Political Giving Sources": "Process / Market Intelligence",
};

const statusMap: Record<string, StatusLabel> = {
  active: "Live API",
  ready_to_connect: "Ready for Setup",
  coming_later: "Deferred",
  manual_only: "Manual Review",
  subscription_manual: "Restricted",
  needs_review: "Needs Verification",
  restricted: "Restricted",
  retired: "Unavailable",
};

const statusClass: Record<StatusLabel, string> = {
  "Live API": "bg-emerald-100 text-emerald-800",
  "Public Source": "bg-blue-100 text-blue-800",
  "Pilot Source": "bg-violet-100 text-violet-800",
  "Ready for Setup": "bg-sky-100 text-sky-800",
  "Manual Review": "bg-amber-100 text-amber-900",
  Restricted: "bg-rose-100 text-rose-900",
  Deferred: "bg-slate-100 text-slate-700",
  Unavailable: "bg-slate-200 text-slate-700",
  "Needs Verification": "bg-orange-100 text-orange-900",
};

const getSourceType = (sourceRole: string) => {
  if (sourceRole.includes("Opportunity")) return "Opportunity";
  if (sourceRole.includes("Evidence")) return "Evidence";
  if (sourceRole.includes("Past Award")) return "Past Awards";
  if (sourceRole.includes("Program Catalog")) return "Program Catalog";
  if (sourceRole.includes("Internal Reference")) return "Staff Reference";
  return "Intelligence";
};

const getBestUse = (role: string) => {
  if (role.includes("Opportunity")) return "Find funding opportunities to review now";
  if (role.includes("Evidence")) return "Support need-proof and narrative context";
  if (role.includes("Past Award")) return "Benchmark award history";
  if (role.includes("Program Catalog")) return "Map program structure and eligibility framing";
  if (role.includes("Internal Reference")) return "Staff governance and process reference";
  return "Lead/context support and manual triage";
};

const getReviewState = (status: StatusLabel) => {
  if (status === "Live API" || status === "Public Source") return "Review now";
  if (status === "Ready for Setup") return "Confirm setup priority";
  if (status === "Needs Verification" || status === "Manual Review") return "Manual verification required";
  if (status === "Restricted") return "Restricted/manual only";
  if (status === "Deferred") return "Future lead only";
  return "Not actionable";
};

export default function SourceDatabasePage() {
  const [selectedCategory, setSelectedCategory] = useState<(typeof categoryOrder)[number] | "All">("All");
  const [search, setSearch] = useState("");

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();

    return sourceDatabaseRecords
      .map((source) => {
        const status = statusMap[source.status] ?? "Needs Verification";
        const category = categoryMap[source.sourceCategory] ?? "Reference / Staff Help";
        const isPilot = source.connectorType === "Public Page Parser" || source.connectorType === "Manual Entry";
        const normalizedStatus: StatusLabel = status === "Ready for Setup" && isPilot ? "Pilot Source" : status;

        return {
          id: source.id,
          sourceName: source.sourceName,
          sourceType: getSourceType(source.sourceRole),
          category,
          status: normalizedStatus,
          bestUse: getBestUse(source.sourceRole),
          coverage: source.geography,
          reviewAction: getReviewState(normalizedStatus),
          limitation: source.notes,
          url: source.sourceUrl,
          lastChecked: "Not automatically checked",
        };
      })
      .filter((row) => {
        const categoryMatch = selectedCategory === "All" || row.category === selectedCategory;
        const text = `${row.sourceName} ${row.sourceType} ${row.status} ${row.bestUse} ${row.coverage} ${row.limitation}`.toLowerCase();
        return categoryMatch && (!q || text.includes(q));
      });
  }, [search, selectedCategory]);

  const panels = useMemo(() => {
    const liveNow = rows.filter((r) => r.status === "Live API").length;
    const needsSetup = rows.filter((r) => r.status === "Ready for Setup" || r.status === "Pilot Source").length;
    const manual = rows.filter((r) => r.status === "Manual Review" || r.status === "Needs Verification" || r.status === "Restricted").length;
    return { liveNow, needsSetup, manual };
  }, [rows]);

  return (
    <>
      <PageHeader
        eyebrow="Sources"
        title="Source Database"
        description="Public-source funding intelligence registry for CRCF staff review. This page does not connect, crawl, scrape, log in, submit, email, or trigger external actions."
      />

      <section className="mb-6 flex flex-wrap gap-2">
        {["Public sources only", "Human-reviewed", "External actions disabled"].map((pill) => (
          <span key={pill} className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
            {pill}
          </span>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[2.3fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex flex-wrap gap-2">
            <input
              className="min-w-[220px] flex-1 rounded-2xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="Search sources"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="rounded-2xl border border-slate-200 px-3 py-2 text-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as typeof selectedCategory)}
            >
              <option value="All">All categories</option>
              {categoryOrder.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-3 py-3">Source</th><th className="px-3 py-3">Type</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Best use</th><th className="px-3 py-3">Coverage</th><th className="px-3 py-3">Last checked</th><th className="px-3 py-3">Link</th><th className="px-3 py-3">Review</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100 align-top">
                    <td className="px-3 py-3"><p className="font-semibold text-slate-900">{row.sourceName}</p><p className="text-xs text-slate-500">{row.category}</p></td>
                    <td className="px-3 py-3">{row.sourceType}</td>
                    <td className="px-3 py-3"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass[row.status]}`}>{row.status}</span></td>
                    <td className="px-3 py-3">{row.bestUse}</td>
                    <td className="px-3 py-3">{row.coverage}</td>
                    <td className="px-3 py-3">{row.lastChecked}</td>
                    <td className="px-3 py-3">{row.url.startsWith("http") ? <a className="text-crcf-blue underline" href={row.url} target="_blank" rel="noreferrer">Open source</a> : <span className="text-slate-500">Internal reference</span>}</td>
                    <td className="px-3 py-3"><p>{row.reviewAction}</p><p className="mt-1 text-xs text-slate-500">{row.limitation}</p></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="space-y-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Source posture</p>
            <p className="mt-2 text-sm text-slate-700">Read-only intelligence surface. No submissions, no outreach, no portal login automation, and human review before external action.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">What is live now</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{panels.liveNow}</p>
            <p className="text-xs text-slate-500">Sources currently labeled Live API.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Needs setup</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{panels.needsSetup}</p>
            <p className="text-xs text-slate-500">Ready for setup or pilot source tracking.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Manual review queue</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{panels.manual}</p>
            <p className="text-xs text-slate-500">Manual Review, Needs Verification, or Restricted.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Data limitations</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
              <li>Last-checked values are not automatically refreshed.</li>
              <li>Newsletter items remain process intelligence, not active connectors.</li>
              <li>Assistance Listing ID format changes are future guardrail input only.</li>
            </ul>
          </div>
        </aside>
      </section>
    </>
  );
}
