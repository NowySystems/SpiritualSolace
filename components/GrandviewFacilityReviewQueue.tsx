"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type TimelineEventPreview = {
  id: string;
  event_type: string;
  visibility: string;
  sharing_level: string;
  priority_label: string | null;
  created_at: string;
};

type FacilityReviewRequest = {
  id: string;
  requester_display_name: string;
  requester_role: string;
  relationship_to_resident: string | null;
  resident_display_name: string;
  room_or_unit: string | null;
  request_type: string;
  priority: string;
  status: string;
  source: string;
  created_at: string;
  updated_at: string;
  timeline_events: TimelineEventPreview[];
};

type FacilityReviewSnapshot = {
  can_review: boolean;
  can_assign_to_hope: boolean;
  facility_id: string;
  facility_name: string;
  requests: FacilityReviewRequest[];
};

const actionButtons = [
  { action: "start_facility_review", label: "Start review" },
  { action: "mark_partner_ready", label: "Mark ready" },
  { action: "pause_request", label: "Pause" },
  { action: "close_request", label: "Close" }
];

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

function statusTone(status: string) {
  if (status === "new") return "bg-[#fff8e7] text-[#5f4b1f] border-[#ddb66c]/45";
  if (status === "partner_ready") return "bg-[#f0f5e8] text-[#173b2d] border-[#86a45f]/45";
  if (status === "partner_assigned") return "bg-[#edf5e6] text-[#173b2d] border-[#86a45f]/45";
  if (status === "paused") return "bg-[#f7f3ea] text-[#4d5d55] border-[#d8d0c0]";
  return "bg-white text-[#173b2d] border-[#d8d0c0]";
}

export function GrandviewFacilityReviewQueue() {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [snapshot, setSnapshot] = useState<FacilityReviewSnapshot | null>(null);
  const [status, setStatus] = useState("Loading Grandview review queue...");
  const [isBusy, setIsBusy] = useState(false);
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);

  async function loadQueue() {
    setIsBusy(true);
    setStatus("Loading Grandview review queue...");

    const { data, error } = await supabase.rpc("get_grandview_facility_review_queue");

    if (error) {
      setStatus(error.message);
      setSnapshot(null);
      setIsBusy(false);
      return;
    }

    const nextSnapshot = data as FacilityReviewSnapshot;
    setSnapshot({
      ...nextSnapshot,
      requests: nextSnapshot.requests ?? []
    });
    setStatus("Grandview review queue loaded.");
    setIsBusy(false);
  }

  async function handleAction(requestId: string, action: string) {
    setIsBusy(true);
    setActiveRequestId(requestId);
    setStatus("Updating request status...");

    const { error } = await supabase.rpc("update_grandview_facility_review_status", {
      p_care_request_id: requestId,
      p_action: action
    });

    if (error) {
      setStatus(error.message);
      setIsBusy(false);
      setActiveRequestId(null);
      return;
    }

    setStatus("Request status updated.");
    setActiveRequestId(null);
    await loadQueue();
  }

  async function handleHopeAssignment(requestId: string) {
    setIsBusy(true);
    setActiveRequestId(requestId);
    setStatus("Assigning request to Hope Church...");

    const { error } = await supabase.rpc("assign_grandview_request_to_hope", {
      p_care_request_id: requestId
    });

    if (error) {
      setStatus(error.message);
      setIsBusy(false);
      setActiveRequestId(null);
      return;
    }

    setStatus("Request assigned to Hope Church.");
    setActiveRequestId(null);
    await loadQueue();
  }

  useEffect(() => {
    void loadQueue();
  }, []);

  const requests = snapshot?.requests ?? [];

  return (
    <section className="mt-8 rounded-[2rem] border border-[#d8d0c0] bg-white p-8 text-[#102b3a] shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#789052]">Grandview review queue</p>
          <h3 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.03em]">Facility request review.</h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#4d5d55]">
            Review structured spiritual-care requests submitted to Grandview. This queue uses button-only actions: no open chat, no requester notes, and no medical information fields.
          </p>
        </div>
        <button
          type="button"
          onClick={loadQueue}
          disabled={isBusy}
          className="rounded-xl border border-[#173b2d]/20 bg-[#173b2d] px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#102b3a] disabled:opacity-60"
        >
          {isBusy ? "Refreshing..." : "Refresh queue"}
        </button>
      </div>

      <div className="mt-6 rounded-2xl border border-[#ddb66c]/45 bg-[#fff8e7] p-5 text-sm leading-7 text-[#5f4b1f]">
        Facility review can start review, mark a request ready for later partner assignment, pause, or close. Owner/admin users can assign partner-ready requests to Hope Church after human review.
      </div>

      <div className="mt-6 rounded-2xl border border-[#d8d0c0] bg-[#f7f3ea] p-4 text-sm font-semibold text-[#173b2d]">
        {status}
      </div>

      <div className="mt-6 grid gap-4">
        {requests.length ? requests.map((request) => (
          <article key={request.id} className="rounded-2xl border border-[#d8d0c0] bg-[#f7f3ea] p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap gap-2">
                  <span className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${statusTone(request.status)}`}>
                    {formatSystemLabel(request.status)}
                  </span>
                  <span className="rounded-full border border-[#d8d0c0] bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#173b2d]">
                    {formatSystemLabel(request.priority)}
                  </span>
                </div>
                <h4 className="mt-4 font-serif text-2xl font-semibold text-[#102b3a]">{request.resident_display_name}</h4>
                <p className="mt-2 text-sm leading-6 text-[#4d5d55]">
                  Request: <span className="font-bold text-[#173b2d]">{formatSystemLabel(request.request_type)}</span>
                  {request.room_or_unit ? <> · Room/unit: <span className="font-bold text-[#173b2d]">{request.room_or_unit}</span></> : null}
                </p>
                <p className="mt-1 text-sm leading-6 text-[#4d5d55]">
                  Requester: <span className="font-bold text-[#173b2d]">{request.requester_display_name}</span> ({formatSystemLabel(request.requester_role)})
                  {request.relationship_to_resident ? <> · Relationship: {request.relationship_to_resident}</> : null}
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#789052]">
                  Submitted {formatDate(request.created_at)} · Source {formatSystemLabel(request.source)}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 lg:justify-end">
                {actionButtons.map((item) => (
                  <button
                    key={item.action}
                    type="button"
                    onClick={() => handleAction(request.id, item.action)}
                    disabled={isBusy || activeRequestId === request.id}
                    className="rounded-xl border border-[#173b2d]/15 bg-white px-4 py-2 text-sm font-bold text-[#173b2d] shadow-sm hover:bg-[#edf5e6] disabled:opacity-60"
                  >
                    {item.label}
                  </button>
                ))}
                {snapshot?.can_assign_to_hope && request.status === "partner_ready" ? (
                  <button
                    type="button"
                    onClick={() => handleHopeAssignment(request.id)}
                    disabled={isBusy || activeRequestId === request.id}
                    className="rounded-xl border border-[#86a45f]/30 bg-[#173b2d] px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-[#102b3a] disabled:opacity-60"
                  >
                    Assign to Hope
                  </button>
                ) : null}
              </div>
            </div>

            {request.timeline_events.length ? (
              <div className="mt-5 rounded-2xl border border-[#d8d0c0] bg-white/70 p-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#789052]">Facility-visible timeline</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {request.timeline_events.slice(0, 4).map((event) => (
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
            No active Grandview requests are waiting in the facility queue.
          </div>
        )}
      </div>
    </section>
  );
}
