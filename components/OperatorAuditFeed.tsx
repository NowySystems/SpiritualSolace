"use client";

import { useEffect, useState } from "react";

type AuditMetadata = Record<string, unknown> | null;

type AuditEvent = {
  id: string;
  action: string;
  target_table: string | null;
  metadata: AuditMetadata;
  created_at: string;
  actor_email: string | null;
};

type OverviewShape = {
  ok?: boolean;
  snapshot?: {
    audit_events?: AuditEvent[];
  };
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown time";
  return date.toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function actionLabel(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function detailParts(metadata: AuditMetadata) {
  if (!metadata) return [] as string[];

  const preferredKeys = ["user_email", "email", "org_slug", "role", "status", "requested_status", "outcome"];
  const parts: string[] = [];

  for (const key of preferredKeys) {
    const value = metadata[key];
    if (typeof value === "string" && value.trim()) {
      const label = key.replaceAll("_", " ");
      parts.push(`${label}: ${value.replaceAll("_", " ")}`);
    }
  }

  return parts;
}

export function OperatorAuditFeed() {
  const [events, setEvents] = useState<AuditEvent[] | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const response = await fetch("/api/operator-overview", { cache: "no-store" }).catch(() => null);
      if (!mounted || !response) return;

      const body = await response.json().catch(() => null) as OverviewShape | null;
      if (!response.ok || !body?.ok || !body.snapshot) {
        setEvents(null);
        return;
      }

      setEvents(Array.isArray(body.snapshot.audit_events) ? body.snapshot.audit_events : []);
    }

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  if (events === null) return null;

  return (
    <section className="bg-[#edf4f0] px-5 pb-10 text-[#0d2b3b] md:px-8">
      <div className="mx-auto max-w-[118rem] rounded-[1.5rem] border border-[#d9dfd7] bg-white p-6 shadow-sm shadow-[#0d2b3b]/5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#506a49]">Audit trail</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em]">Recent operator and pilot actions</h2>
            <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-[#66766e]">
              Access changes and workflow actions stay visible here so routine ChurchWork operations do not require digging through Supabase logs.
            </p>
          </div>
          <span className="text-sm font-black text-[#0f6b54]">Latest {events.length}</span>
        </div>

        <div className="mt-5 space-y-3">
          {events.length ? events.map((event) => {
            const details = detailParts(event.metadata);
            return (
              <article key={event.id} className="rounded-2xl border border-[#d9dfd7] bg-[#f8fbf8] p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-black text-[#173b2d]">{actionLabel(event.action)}</p>
                    <p className="mt-1 text-xs font-semibold text-[#66766e]">
                      {event.actor_email ?? "System"} · {formatDate(event.created_at)}
                      {event.target_table ? ` · ${event.target_table.replaceAll("_", " ")}` : ""}
                    </p>
                  </div>
                  {details.length ? (
                    <div className="flex max-w-2xl flex-wrap gap-2">
                      {details.map((detail) => (
                        <span key={detail} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#173b2d] ring-1 ring-[#d9dfd7]">{detail}</span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </article>
            );
          }) : (
            <div className="rounded-2xl border border-dashed border-[#cfd9d1] bg-[#f8fbf8] p-8 text-center text-sm font-semibold text-[#66766e]">
              No audit events have been recorded yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
