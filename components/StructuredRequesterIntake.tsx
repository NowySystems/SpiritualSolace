"use client";

import { FormEvent, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type StructuredRequesterIntakeProps = {
  session: Session;
};

const requesterRoles = [
  { value: "resident", label: "Resident" },
  { value: "family", label: "Family" },
  { value: "facility_staff", label: "Facility staff" },
  { value: "church_member", label: "Church member" },
  { value: "community_member", label: "Community member" },
  { value: "other", label: "Other" }
];

const requestTypes = [
  { value: "prayer", label: "Prayer" },
  { value: "pastoral_visit", label: "Pastoral visit" },
  { value: "family_support", label: "Family support" },
  { value: "church_connection", label: "Church connection" },
  { value: "facility_follow_up", label: "Facility follow-up" }
];

const priorities = [
  { value: "today", label: "Today" },
  { value: "this_week", label: "This week" },
  { value: "routine", label: "Routine" }
];

export function StructuredRequesterIntake({ session }: StructuredRequesterIntakeProps) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [requesterDisplayName, setRequesterDisplayName] = useState("");
  const [requesterRole, setRequesterRole] = useState("family");
  const [relationshipToResident, setRelationshipToResident] = useState("");
  const [residentDisplayName, setResidentDisplayName] = useState("");
  const [roomOrUnit, setRoomOrUnit] = useState("");
  const [requestType, setRequestType] = useState("prayer");
  const [priority, setPriority] = useState("routine");
  const [acknowledged, setAcknowledged] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [status, setStatus] = useState("Ready for structured spiritual-care request.");
  const [submittedRequestId, setSubmittedRequestId] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!acknowledged) {
      setStatus("Confirm the no-medical-information acknowledgment before submitting.");
      return;
    }

    setIsBusy(true);
    setStatus("Submitting request to Grandview review queue...");

    const { data, error } = await supabase.rpc("submit_grandview_spiritual_request", {
      p_requester_display_name: requesterDisplayName,
      p_requester_role: requesterRole,
      p_relationship_to_resident: relationshipToResident,
      p_resident_display_name: residentDisplayName,
      p_room_or_unit: roomOrUnit,
      p_request_type: requestType,
      p_priority: priority
    });

    if (error) {
      setStatus(error.message);
      setIsBusy(false);
      return;
    }

    setSubmittedRequestId(typeof data === "string" ? data : null);
    setStatus("Request submitted. Grandview facility review is the next step.");
    setRequesterDisplayName("");
    setRelationshipToResident("");
    setResidentDisplayName("");
    setRoomOrUnit("");
    setRequestType("prayer");
    setPriority("routine");
    setAcknowledged(false);
    setIsBusy(false);
  }

  return (
    <section className="mt-8 rounded-[2rem] border border-[#d8d0c0] bg-white p-8 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[#789052]">Requester path</p>
      <h3 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.03em]">Submit a structured spiritual-care request.</h3>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-[#4d5d55]">
        Signed in as {session.user.email}. This form is intentionally structured. Requesters cannot enter notes, medical details, emergency information, diagnosis, symptoms, medications, treatment details, chart notes, clinical instructions, or insurance information.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-5 md:grid-cols-2">
        <label className="block text-sm font-bold text-[#173b2d]">
          Your name
          <input
            value={requesterDisplayName}
            onChange={(event) => setRequesterDisplayName(event.target.value)}
            required
            maxLength={160}
            className="mt-2 w-full rounded-xl border border-[#d8d0c0] px-4 py-3 text-base outline-none focus:border-[#8aa363]"
          />
        </label>

        <label className="block text-sm font-bold text-[#173b2d]">
          Who are you?
          <select
            value={requesterRole}
            onChange={(event) => setRequesterRole(event.target.value)}
            className="mt-2 w-full rounded-xl border border-[#d8d0c0] px-4 py-3 text-base outline-none focus:border-[#8aa363]"
          >
            {requesterRoles.map((role) => (
              <option key={role.value} value={role.value}>{role.label}</option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-bold text-[#173b2d]">
          Relationship, optional
          <input
            value={relationshipToResident}
            onChange={(event) => setRelationshipToResident(event.target.value)}
            maxLength={120}
            placeholder="Example: daughter, spouse, friend"
            className="mt-2 w-full rounded-xl border border-[#d8d0c0] px-4 py-3 text-base outline-none focus:border-[#8aa363]"
          />
        </label>

        <label className="block text-sm font-bold text-[#173b2d]">
          Resident/person name
          <input
            value={residentDisplayName}
            onChange={(event) => setResidentDisplayName(event.target.value)}
            required
            maxLength={160}
            className="mt-2 w-full rounded-xl border border-[#d8d0c0] px-4 py-3 text-base outline-none focus:border-[#8aa363]"
          />
        </label>

        <label className="block text-sm font-bold text-[#173b2d]">
          Room or unit, optional
          <input
            value={roomOrUnit}
            onChange={(event) => setRoomOrUnit(event.target.value)}
            maxLength={80}
            placeholder="Example: 104B"
            className="mt-2 w-full rounded-xl border border-[#d8d0c0] px-4 py-3 text-base outline-none focus:border-[#8aa363]"
          />
        </label>

        <label className="block text-sm font-bold text-[#173b2d]">
          Spiritual-care request
          <select
            value={requestType}
            onChange={(event) => setRequestType(event.target.value)}
            className="mt-2 w-full rounded-xl border border-[#d8d0c0] px-4 py-3 text-base outline-none focus:border-[#8aa363]"
          >
            {requestTypes.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-bold text-[#173b2d]">
          Priority
          <select
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
            className="mt-2 w-full rounded-xl border border-[#d8d0c0] px-4 py-3 text-base outline-none focus:border-[#8aa363]"
          >
            {priorities.map((item) => (
              <option key={item.value} value={item.value}>{item.label}</option>
            ))}
          </select>
        </label>

        <label className="md:col-span-2 flex gap-3 rounded-2xl border border-[#ddb66c]/45 bg-[#fff8e7] p-5 text-sm leading-7 text-[#5f4b1f]">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(event) => setAcknowledged(event.target.checked)}
            className="mt-1 h-5 w-5"
          />
          <span>
            I understand ChurchWork is for spiritual-care coordination only. I will not submit medical details, emergency information, diagnosis, symptoms, medications, treatment details, chart notes, clinical instructions, or insurance information.
          </span>
        </label>

        <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={isBusy || !acknowledged}
            className="rounded-xl bg-[#173b2d] px-6 py-3 text-base font-bold text-white shadow-lg hover:bg-[#102b3a] disabled:opacity-60"
          >
            {isBusy ? "Submitting..." : "Submit request to Grandview review"}
          </button>
          <p className="text-sm font-semibold text-[#4d5d55]">{status}</p>
        </div>
      </form>

      {submittedRequestId ? (
        <div className="mt-6 rounded-2xl border border-[#8aa363]/50 bg-[#f0f5e8] p-5 text-sm leading-7 text-[#173b2d]">
          Request submitted for facility review. Reference: <span className="font-mono font-bold">{submittedRequestId}</span>
        </div>
      ) : null}
    </section>
  );
}
