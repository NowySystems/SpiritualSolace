"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type PartnerTimelineEvent = {
  id: string;
  event_type: string;
  visibility: string;
  sharing_level: string;
  priority_label: string | null;
  created_at: string;
};

type HopeAssignment = {
  assignment_id: string;
  assignment_status: string;
  assigned_at: string;
  care_request_id: string;
  resident_display_name: string;
  room_or_unit: string | null;
  request_type: string;
  priority: string;
  request_status: string;
  request_created_at: string;
  facility_name: string;
  timeline_events: PartnerTimelineEvent[];
};

type HopePartnerSnapshot = {
  can_view: boolean;
  partner_id: string;
  partner_name: string;
  requests: HopeAssignment[];
};

function formatSystemLabel(value: string | null | undefined) {
  if (!value) return "";
  return value
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

export function HopePartnerAssignmentQueue() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [snapshot, setSnapshot] = useState<HopePartnerSnapshot | null>(null);
  const [status, setStatus] = useState("Loading Hope Church assignment queue...");
  const [isLoading, setIsLoading] = useState(false);

  async function loadQueue() {
    setIsLoading(true);
    setStatus("Loading Hope Church assignment queue...");

    const { data, error } = await supabase.rpc("get_hope_partner_assignment_queue");

    if (error) {
      setStatus(error.message);
      setSnapshot(null);
      setIsLoading(false);
      return;
    }

    const nextSnapshot = data as HopePartnerSnapshot;
    setSnapshot({
      ...nextSnapshot,
      requests: nextSnapshot.requests ?? []
    });
    setStatus("Hope Church assignment queue loaded.");
    setIsLoading(false);
  }

  useEffect(() => {
    void loadQueue();
  }, []);

  const assignments = snapshot?.requests ?? [];

  return (
    <section className="mt-8 rounded-[2rem] border border-[#d8d0c0] bg-white p-8 text-[#102b3a] shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#789052]">Hope Church assignments</p>
          <h3 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.03em]">Partner-safe request queue.</h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#4d5d55]">
            This read-only queue shows requests assigned to Hope Church after owner/admin review. It shows partner-safe fields only and does not provide open chat or free-text notes.
          </p>
        </div>
        <button
          type="button"
          onClick={loadQueue}
          disabled={isLoading}
          className="rounded-xl border border-[#173b2d]/20 bg-[#173b2d] px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#102b3a] disabled:opacity-60"
        >
          {isLoading ? "Refreshing..." : "Refresh assignments"}
        </button>
      </div>

      <div className="mt-6 rounded-2xl border border-[#ddb66c]/45 bg-[#fff8e7] p-5 text-sm leading-7 text-[#5f4b1f]">
        PR75 is assignment prep only. Hope Church can view assigned, partner-safe request context here, but accepting, scheduling, completion, and report-back actions come later.
      </div>

      <div className="mt-6 rounded-2xl border border-[#d8d0c0] bg-[#f7f3ea] p-4 text-sm font-semibold text-[#173b2d]">
        {status}
      </div>

      <div className="mt-6 grid gap-4">
        {assignments.length ? assignments.map((assignment) => (
          <article key={assignment.assignment_id} className="rounded-2xl border border-[#d8d0c0] bg-[#f7f3ea] p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-[#86a45f]/45 bg-[#edf5e6] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#173b2d]">
                    {formatSystemLabel(assignment.assignment_status)}
                  </span>
                  <span className="rounded-full border border-[#d8d0c0] bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#173b2d]">
                    {formatSystemLabel(assignment.priority)}
                  </span>
                </div>
                <h4 className="mt-4 font-serif text-2xl font-semibold text-[#102b3a]">{assignment.resident_display_name}</h4>
                <p className="mt-2 text-sm leading-6 text-[#4d5d55]">
                  Request: <span className="font-bold text-[#173b2d]">{formatSystemLabel(assignment.request_type)}</span>
                  {assignment.room_or_unit ? <> · Room/unit: <span className="font-bold text-[#173b2d]">{assignment.room_or_unit}</span></> : null}
                </p>
                <p className="mt-1 text-sm leading-6 text-[#4d5d55]">
                  Facility: <span className="font-bold text-[#173b2d]">{assignment.facility_name}</span> · Request status: {formatSystemLabel(assignment.request_status)}
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#789052]">
                  Assigned {formatDate(assignment.assigned_at)} · Submitted {formatDate(assignment.request_created_at)}
                </p>
              </div>
            </div>

            {assignment.timeline_events.length ? (
              <div className="mt-5 rounded-2xl border border-[#d8d0c0] bg-white/70 p-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#789052]">Partner-safe timeline</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {assignment.timeline_events.slice(0, 4).map((event) => (
                    <span key={event.id} className="rounded-full border border-[#d8d0c0] bg-white px-3 py-1 text-xs font-bold text-[#4d5d55]">
                      {formatSystemLabel(event.event_type)} · {formatDate(event.created_at)}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </article>
        )) : (
          <div className="rounded-2xl border border-[#d8d0c0] bg-[#f7f3ea] p-6 text-sm leading-7 text-[#4d5d55]">
            No Hope Church assignments are ready yet.
          </div>
        )}
      </div>
    </section>
  );
}
