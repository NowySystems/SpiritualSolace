"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

type DemoRequestPayload = {
  requesterName: string;
  requesterContact: string;
  contactPreference: string;
  recipientName: string;
  relationship: string;
  locationName: string;
  roomOrUnit: string;
  careType: string;
  urgency: string;
  notes: string;
  status: "demo-only";
  source: "requester-demo";
};

const careTypes = ["Prayer", "Visit", "End-of-life support", "Family support", "Follow-up call", "Church connection", "Other"];
const urgencyOptions = ["Today", "This week", "Not urgent", "Unsure"];
const contactPreferences = ["Phone", "Email", "Text message", "Facility staff follow-up"];

const fieldClass =
  "mt-2 w-full rounded-2xl border border-[#d8d0c0] bg-white px-4 py-3 text-sm text-[#20372d] outline-none ring-[#8aa363]/20 transition focus:border-[#8aa363] focus:ring-4";
const labelClass = "block text-sm font-bold text-[#20372d]";

export function RequestCareDemo() {
  const [recipientName, setRecipientName] = useState("Mary Johnson");
  const [relationship, setRelationship] = useState("Daughter");
  const [locationName, setLocationName] = useState("Bethesda Senior Living");
  const [roomOrUnit, setRoomOrUnit] = useState("Room 214");
  const [careType, setCareType] = useState(careTypes[0]);
  const [urgency, setUrgency] = useState(urgencyOptions[0]);
  const [requesterName, setRequesterName] = useState("Sarah Johnson");
  const [contactPreference, setContactPreference] = useState(contactPreferences[0]);
  const [requesterContact, setRequesterContact] = useState("(555) 010-2842");
  const [notes, setNotes] = useState(
    "Mom has been anxious this week and asked if someone from a local church could pray with her. Family would appreciate a gentle follow-up after the visit."
  );
  const [submittedPayload, setSubmittedPayload] = useState<DemoRequestPayload | null>(null);

  const previewPayload = useMemo<DemoRequestPayload>(
    () => ({
      requesterName,
      requesterContact,
      contactPreference,
      recipientName,
      relationship,
      locationName,
      roomOrUnit,
      careType,
      urgency,
      notes,
      status: "demo-only",
      source: "requester-demo"
    }),
    [careType, contactPreference, locationName, notes, recipientName, relationship, requesterContact, requesterName, roomOrUnit, urgency]
  );

  function submitDemoRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedPayload(previewPayload);
  }

  function resetDemo() {
    setSubmittedPayload(null);
  }

  const visiblePayload = submittedPayload ?? previewPayload;

  return (
    <main className="min-h-screen bg-[#f7f3ea] px-6 py-8 text-[#102b3a]">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-[#d8d0c0] bg-[#0d2b3b] p-6 text-white shadow-xl md:flex-row md:items-center md:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-4xl leading-none">🕊</span>
            <span>
              <span className="block text-3xl font-semibold leading-none tracking-[-0.04em]">
                Church<span className="text-[#9fb36b]">Work</span>
              </span>
              <span className="mt-1 block text-xs tracking-wide text-[#d4dedc]">Requester demo preview</span>
            </span>
          </Link>
          <div className="flex flex-wrap gap-3">
            <Link href="/care-binder?demo=true" className="rounded-full border border-white/35 px-5 py-3 text-sm font-black text-white hover:bg-white/10">
              View Care Team Demo
            </Link>
            <Link href="/care-binder" className="rounded-full bg-[#86a45f] px-5 py-3 text-sm font-black text-white shadow-lg hover:bg-[#789752]">
              Enter Care Binder
            </Link>
          </div>
        </header>

        <section className="mt-6 rounded-[2rem] border border-[#d8d0c0] bg-white/80 p-6 shadow-sm md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#789052]">Gated demo only</p>
              <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#102b3a] md:text-6xl">
                Preview how someone asks for spiritual care.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[#4d5d55]">
                This requester-side preview shows how a family member, resident, staff member, church member, or facility partner could prepare a spiritual care request before it becomes a care team queue item.
              </p>
              <div className="mt-6 rounded-2xl border border-[#eadfce] bg-[#fff8ed] p-5 text-sm leading-7 text-[#6b5b45]">
                <strong className="text-[#173b2d]">Demo safety note:</strong> no request is submitted, stored, emailed, routed, or sent from this screen. Supabase intake routing will be connected later when the backend is ready.
              </div>
            </div>

            <aside className="rounded-[1.7rem] border border-[#d8d0c0] bg-[#173b2d] p-6 text-white shadow-lg">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#c8d9b3]">Future platform flow</p>
              <div className="mt-5 space-y-3 text-sm font-bold">
                <div className="rounded-2xl bg-white/10 p-4">Requester prepares care need</div>
                <div className="pl-4 text-[#c8d9b3]">↓</div>
                <div className="rounded-2xl bg-white/10 p-4">Supabase intake record</div>
                <div className="pl-4 text-[#c8d9b3]">↓</div>
                <div className="rounded-2xl bg-white/10 p-4">Care Queue card</div>
                <div className="pl-4 text-[#c8d9b3]">↓</div>
                <div className="rounded-2xl bg-white/10 p-4">Care Binder timeline and actions</div>
              </div>
            </aside>
          </div>
        </section>

        {submittedPayload ? (
          <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
            <div className="rounded-[2rem] border border-[#d8d0c0] bg-white p-8 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#789052]">Demo confirmation</p>
              <h2 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.04em] text-[#102b3a]">Demo request prepared</h2>
              <p className="mt-4 text-base leading-8 text-[#4d5d55]">
                In the live ChurchWork workflow, this request would be routed into the care team queue for human review. For this pilot preview, it stays on this page only.
              </p>

              <div className="mt-6 rounded-[1.5rem] border border-[#d8d6d1] bg-[#f8fbf8] p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#4d5f6c]">Future care queue card</p>
                <h3 className="mt-3 text-2xl font-bold text-[#1e2b3f]">{submittedPayload.recipientName}</h3>
                <p className="mt-1 text-sm font-semibold text-[#65717a]">
                  {submittedPayload.locationName} {submittedPayload.roomOrUnit ? `· ${submittedPayload.roomOrUnit}` : ""}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#eef6f0] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-[#315f44]">{submittedPayload.careType}</span>
                  <span className="rounded-full bg-[#fff4df] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-[#76501a]">{submittedPayload.urgency}</span>
                  <span className="rounded-full bg-[#f4effc] px-3 py-1 text-xs font-black uppercase tracking-[0.1em] text-[#5b4a83]">New request</span>
                </div>
                <p className="mt-4 text-sm leading-7 text-[#4b5b66]">{submittedPayload.notes}</p>
                <p className="mt-4 text-xs font-bold text-[#65717a]">
                  Requested by {submittedPayload.requesterName} · {submittedPayload.relationship} · {submittedPayload.contactPreference}: {submittedPayload.requesterContact}
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href="/care-binder?demo=true" className="inline-flex justify-center rounded-full bg-[#173b2d] px-6 py-3 text-sm font-black text-white shadow-md hover:bg-[#234b3b]">
                  View Care Binder Demo
                </Link>
                <button type="button" onClick={resetDemo} className="rounded-full border border-[#cfc5b5] px-6 py-3 text-sm font-black text-[#44564c] hover:bg-[#fffaf0]">
                  Reset Demo Request
                </button>
              </div>
            </div>

            <PayloadPreview payload={visiblePayload} />
          </section>
        ) : (
          <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
            <form onSubmit={submitDemoRequest} className="rounded-[2rem] border border-[#d8d0c0] bg-[#fbf8f0] p-6 shadow-sm md:p-8">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#789052]">Requester demo intake</p>
              <h2 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.04em] text-[#102b3a]">Request spiritual care</h2>

              <div className="mt-7 grid gap-5 md:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="recipient-name">Who needs care?</label>
                  <input id="recipient-name" value={recipientName} onChange={(event) => setRecipientName(event.target.value)} className={fieldClass} required />
                </div>
                <div>
                  <label className={labelClass} htmlFor="relationship">Relationship to requester</label>
                  <input id="relationship" value={relationship} onChange={(event) => setRelationship(event.target.value)} className={fieldClass} required />
                </div>
                <div>
                  <label className={labelClass} htmlFor="location-name">Facility or location</label>
                  <input id="location-name" value={locationName} onChange={(event) => setLocationName(event.target.value)} className={fieldClass} required />
                </div>
                <div>
                  <label className={labelClass} htmlFor="room-or-unit">Room or unit</label>
                  <input id="room-or-unit" value={roomOrUnit} onChange={(event) => setRoomOrUnit(event.target.value)} className={fieldClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="care-type">Type of care</label>
                  <select id="care-type" value={careType} onChange={(event) => setCareType(event.target.value)} className={fieldClass}>
                    {careTypes.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass} htmlFor="urgency">Urgency</label>
                  <select id="urgency" value={urgency} onChange={(event) => setUrgency(event.target.value)} className={fieldClass}>
                    {urgencyOptions.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass} htmlFor="requester-name">Your name</label>
                  <input id="requester-name" value={requesterName} onChange={(event) => setRequesterName(event.target.value)} className={fieldClass} required />
                </div>
                <div>
                  <label className={labelClass} htmlFor="contact-preference">Best way to follow up</label>
                  <select id="contact-preference" value={contactPreference} onChange={(event) => setContactPreference(event.target.value)} className={fieldClass}>
                    {contactPreferences.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass} htmlFor="requester-contact">Contact detail</label>
                  <input id="requester-contact" value={requesterContact} onChange={(event) => setRequesterContact(event.target.value)} className={fieldClass} required />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass} htmlFor="notes">What is going on?</label>
                  <textarea id="notes" value={notes} onChange={(event) => setNotes(event.target.value)} rows={6} className={`${fieldClass} leading-6`} required />
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-[#eadfce] bg-[#fff8ed] p-4 text-sm leading-6 text-[#6b5b45]">
                This button prepares a local demo confirmation only. It does not create a user, write to Supabase, notify a care team, or send any outside message.
              </div>

              <div className="mt-6 flex justify-end">
                <button type="submit" className="rounded-full bg-[#173b2d] px-7 py-3 text-sm font-black text-white shadow-md hover:bg-[#234b3b]">
                  Prepare Demo Request
                </button>
              </div>
            </form>

            <PayloadPreview payload={visiblePayload} />
          </section>
        )}
      </div>
    </main>
  );
}

function PayloadPreview({ payload }: { payload: DemoRequestPayload }) {
  const rows = [
    ["recipientName", payload.recipientName],
    ["locationName", payload.locationName],
    ["roomOrUnit", payload.roomOrUnit || "Not provided"],
    ["careType", payload.careType],
    ["urgency", payload.urgency],
    ["requesterName", payload.requesterName],
    ["contactPreference", payload.contactPreference],
    ["requesterContact", payload.requesterContact],
    ["status", payload.status],
    ["source", payload.source]
  ];

  return (
    <aside className="rounded-[2rem] border border-[#d8d0c0] bg-[#102b3a] p-6 text-white shadow-xl md:p-8">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[#c8d9b3]">Future Supabase-ready shape</p>
      <h2 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.04em]">How this aligns to the care team side</h2>
      <p className="mt-4 text-sm leading-7 text-[#d4dedc]">
        These demo fields mirror the future intake record that can become a care queue item, then a Care Binder timeline entry after human review.
      </p>
      <div className="mt-6 divide-y divide-white/10 rounded-2xl border border-white/15 bg-white/5">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-1 px-4 py-3 text-sm sm:grid-cols-[150px_1fr]">
            <span className="font-black text-[#c8d9b3]">{label}</span>
            <span className="text-[#eef5f2]">{value}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-2xl border border-[#c8d9b3]/30 bg-[#c8d9b3]/10 p-4 text-sm leading-6 text-[#edf5e6]">
        In production, Supabase should own persistence, auth-aware routing, status changes, assignment, and audit history. This PR intentionally does none of that.
      </div>
    </aside>
  );
}
