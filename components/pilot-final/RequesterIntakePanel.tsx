"use client";

import { useState } from "react";

const profileFields = [
  { label: "Requester name", value: "Sarah K." },
  { label: "Relationship", value: "Daughter" },
  { label: "Phone", value: "(615) 555-0184" },
  { label: "Preferred contact", value: "Text messages" }
];

const personFields = [
  { label: "Person receiving care", value: "Jane Doe" },
  { label: "Facility", value: "Morning Pointe Franklin" },
  { label: "Room / unit", value: "104B" },
  { label: "Best contact time", value: "Evenings" }
];

const requestOptions = [
  "Family encouragement & prayer support",
  "Pastoral visit request",
  "Scripture or devotional support",
  "Connection to a local church"
];

function FieldCard({ label, value }: { label: string; value: string }) {
  return (
    <label className="block rounded-2xl border border-[#d9dfd7] bg-white p-4 shadow-sm shadow-[#0d2b3b]/5">
      <span className="block text-xs font-black uppercase tracking-[0.14em] text-[#506a49]">{label}</span>
      <input
        value={value}
        readOnly
        className="mt-2 w-full rounded-xl border border-[#e4e8e2] bg-[#f8fbf8] px-3 py-3 text-sm font-bold text-[#0d2b3b] outline-none"
      />
    </label>
  );
}

export function RequesterIntakePanel() {
  const [selectedRequest, setSelectedRequest] = useState(requestOptions[0]);
  const [acknowledged, setAcknowledged] = useState(true);

  return (
    <section className="rounded-[1.5rem] border border-[#d9dfd7] bg-[#f3f8f5] p-5 shadow-sm shadow-[#0d2b3b]/5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0f6b54]">Requester profile</p>
          <h2 className="mt-2 font-serif text-2xl font-semibold tracking-[-0.03em] text-[#0d2b3b]">Profile and spiritual-care request.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#4f6259]">
            The requester completes structured profile and request details before the facility receives anything for review.
          </p>
        </div>
        <span className="rounded-full border border-[#b7d7c5] bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#0f6b54]">
          Draft ready
        </span>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <div className="rounded-[1.25rem] border border-[#d9dfd7] bg-[#eef7f2] p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#0f6b54]">Your information</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {profileFields.map((field) => (
              <FieldCard key={field.label} label={field.label} value={field.value} />
            ))}
          </div>
        </div>

        <div className="rounded-[1.25rem] border border-[#d9dfd7] bg-[#fffaf0] p-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#9a6b16]">Person receiving care</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {personFields.map((field) => (
              <FieldCard key={field.label} label={field.label} value={field.value} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-[1.25rem] border border-[#d9dfd7] bg-white p-4">
        <label className="block">
          <span className="text-xs font-black uppercase tracking-[0.16em] text-[#506a49]">Spiritual-care request type</span>
          <select
            value={selectedRequest}
            onChange={(event) => setSelectedRequest(event.target.value)}
            className="mt-3 w-full rounded-xl border border-[#d9dfd7] bg-[#f8fbf8] px-4 py-3 text-sm font-black text-[#0d2b3b] outline-none focus:border-[#0f6b54]"
          >
            {requestOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>

        <label className="mt-4 flex gap-3 rounded-2xl border border-[#eed9a8] bg-[#fffaf0] p-4 text-sm leading-6 text-[#5f4b1f]">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(event) => setAcknowledged(event.target.checked)}
            className="mt-1 h-5 w-5 shrink-0 rounded border-[#d6a943] accent-[#0f6b54]"
          />
          <span>
            I understand this request is for spiritual-care coordination only. It should not include medical records, symptoms, diagnosis, treatment instructions, insurance details, or emergencies.
          </span>
        </label>
      </div>

      <div className="mt-5 flex flex-col gap-3 rounded-[1.25rem] border border-[#c8dfd1] bg-[#0f3f35] p-4 text-white md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#c7e2d0]">Submission path</p>
          <p className="mt-1 text-sm font-semibold text-[#e7f1eb]">Save profile → Submit request → Facility review → Approved updates.</p>
        </div>
        <button
          type="button"
          disabled={!acknowledged}
          className="rounded-xl bg-[#d6a943] px-5 py-3 text-sm font-black text-[#082838] shadow-lg shadow-[#082838]/20 hover:bg-[#e3bc5c] disabled:cursor-not-allowed disabled:opacity-55"
        >
          Submit Request
        </button>
      </div>
    </section>
  );
}
