"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Portal = "facility" | "partner";

type OrganizationOption = {
  id: string;
  name: string;
  slug: string;
};

type Application = {
  id?: string;
  status?: "pending" | "approved" | "rejected" | "withdrawn";
  applicant_name?: string;
  job_title?: string | null;
  phone?: string | null;
  existing_organization_id?: string | null;
  organization_name?: string;
  address_line_1?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  website?: string | null;
  relationship_note?: string | null;
  review_note?: string | null;
  created_at?: string;
  reviewed_at?: string | null;
};

export function PilotAccessApplicationForm({ portal }: { portal: Portal }) {
  const [organizations, setOrganizations] = useState<OrganizationOption[]>([]);
  const [application, setApplication] = useState<Application | null>(null);
  const [existingOrganizationId, setExistingOrganizationId] = useState("");
  const [applicantName, setApplicantName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [city, setCity] = useState("");
  const [stateValue, setStateValue] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [website, setWebsite] = useState("");
  const [relationshipNote, setRelationshipNote] = useState("");
  const [message, setMessage] = useState("Tell ChurchWork which organization you represent.");
  const [isBusy, setIsBusy] = useState(true);

  const portalLabel = portal === "facility" ? "Facility" : "Care Partner";
  const orgNoun = portal === "facility" ? "facility" : "church / care partner";

  useEffect(() => {
    let mounted = true;

    async function load() {
      const response = await fetch(`/api/pilot-access-application?portal=${portal}`, { cache: "no-store" }).catch(() => null);
      const body = await response?.json().catch(() => null);
      if (!mounted) return;

      if (!response || !response.ok || !body?.ok) {
        setMessage(typeof body?.message === "string" ? body.message : "ChurchWork could not load the access form.");
        setIsBusy(false);
        return;
      }

      const nextOrganizations = Array.isArray(body.organizations) ? body.organizations as OrganizationOption[] : [];
      const nextApplication = body.application && typeof body.application === "object" ? body.application as Application : null;

      setOrganizations(nextOrganizations);
      setApplication(nextApplication);

      if (nextApplication?.id) {
        setApplicantName(nextApplication.applicant_name ?? "");
        setJobTitle(nextApplication.job_title ?? "");
        setPhone(nextApplication.phone ?? "");
        setExistingOrganizationId(nextApplication.existing_organization_id ?? "");
        setOrganizationName(nextApplication.organization_name ?? "");
        setAddressLine1(nextApplication.address_line_1 ?? "");
        setCity(nextApplication.city ?? "");
        setStateValue(nextApplication.state ?? "");
        setPostalCode(nextApplication.postal_code ?? "");
        setWebsite(nextApplication.website ?? "");
        setRelationshipNote(nextApplication.relationship_note ?? "");
      }

      setIsBusy(false);
    }

    void load();
    return () => { mounted = false; };
  }, [portal]);

  const selectedOrg = useMemo(
    () => organizations.find((item) => item.id === existingOrganizationId) ?? null,
    [existingOrganizationId, organizations]
  );

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsBusy(true);
    setMessage("Submitting your pilot access request...");

    const response = await fetch("/api/pilot-access-application", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        portal,
        applicantName,
        jobTitle,
        phone,
        existingOrganizationId: existingOrganizationId || null,
        organizationName: selectedOrg?.name ?? organizationName,
        addressLine1,
        city,
        state: stateValue,
        postalCode,
        website,
        relationshipNote
      })
    }).catch(() => null);

    const body = await response?.json().catch(() => null);
    if (!response || !response.ok || !body?.ok) {
      setMessage(typeof body?.message === "string" ? body.message : "ChurchWork could not submit this request.");
      setIsBusy(false);
      return;
    }

    setApplication({
      id: typeof body.application?.application_id === "string" ? body.application.application_id : application?.id,
      status: "pending",
      applicant_name: applicantName,
      job_title: jobTitle,
      phone,
      existing_organization_id: existingOrganizationId || null,
      organization_name: selectedOrg?.name ?? organizationName,
      address_line_1: addressLine1,
      city,
      state: stateValue,
      postal_code: postalCode,
      website,
      relationship_note: relationshipNote
    });
    setMessage(typeof body.message === "string" ? body.message : "Pilot access request submitted.");
    setIsBusy(false);
  }

  if (isBusy && !application) {
    return <div className="rounded-2xl border border-[#d8d0c0] bg-white p-6 text-sm font-bold text-[#53666a]">Loading pilot access…</div>;
  }

  if (application?.status === "pending") {
    return (
      <div className="rounded-[1.6rem] border border-[#d9cda9] bg-[#fff9e9] p-6 shadow-lg shadow-[#725d2a]/5">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8b6d2f]">Awaiting ChurchWork approval</p>
        <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#173b2d]">{application.organization_name}</h2>
        <p className="mt-3 text-sm font-semibold leading-6 text-[#625c48]">Your {portalLabel.toLowerCase()} access request is in the ChurchWork Admin queue. You do not have organization data access until it is approved.</p>
        <div className="mt-5 rounded-xl bg-white/80 p-4">
          <p className="text-xs font-black text-[#4d5f56]">What happens next</p>
          <p className="mt-1 text-xs font-semibold leading-5 text-[#6e7772]">The ChurchWork platform admin reviews the organization, creates or links it, and approves the first organization admin. After that, your organization can manage its own team.</p>
        </div>
        <p className="mt-4 text-xs font-semibold text-[#7b725b]">{message}</p>
      </div>
    );
  }

  if (application?.status === "approved") {
    return (
      <div className="rounded-[1.6rem] border border-[#b9d7c6] bg-[#eff8f2] p-6">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#4f8062]">Approved</p>
        <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#173b2d]">Your pilot access is ready.</h2>
        <p className="mt-3 text-sm font-semibold leading-6 text-[#536960]">Sign out and sign back into the {portalLabel} portal to load your organization role.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-[1.6rem] border border-[#d8d0c0] bg-white p-6 shadow-xl shadow-[#0d2b3b]/8">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#789052]">Step 2 · Organization access</p>
      <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em] text-[#173b2d]">Request {portalLabel.toLowerCase()} access</h2>
      <p className="mt-3 text-sm font-semibold leading-6 text-[#5b6a65]">This tells ChurchWork who you represent and gives the platform admin enough information to create or link your {orgNoun}.</p>

      {application?.status === "rejected" ? (
        <div className="mt-5 rounded-xl border border-[#e0b8ae] bg-[#fff1ee] p-4 text-xs font-semibold leading-5 text-[#765047]">
          The previous request was not approved.{application.review_note ? ` ${application.review_note}` : ""} You may submit updated information below.
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-black text-[#173b2d]">
          Your name
          <input value={applicantName} onChange={(event) => setApplicantName(event.target.value)} required className="mt-2 w-full rounded-xl border border-[#d8d0c0] px-4 py-3 outline-none focus:border-[#789052]" />
        </label>
        <label className="block text-sm font-black text-[#173b2d]">
          Job title / role
          <input value={jobTitle} onChange={(event) => setJobTitle(event.target.value)} placeholder="Administrator, Chaplain, Pastor…" className="mt-2 w-full rounded-xl border border-[#d8d0c0] px-4 py-3 outline-none focus:border-[#789052]" />
        </label>
        <label className="block text-sm font-black text-[#173b2d]">
          Phone
          <input value={phone} onChange={(event) => setPhone(event.target.value)} className="mt-2 w-full rounded-xl border border-[#d8d0c0] px-4 py-3 outline-none focus:border-[#789052]" />
        </label>
        <label className="block text-sm font-black text-[#173b2d]">
          Existing ChurchWork organization
          <select
            value={existingOrganizationId}
            onChange={(event) => {
              setExistingOrganizationId(event.target.value);
              const option = organizations.find((item) => item.id === event.target.value);
              if (option) setOrganizationName(option.name);
            }}
            className="mt-2 w-full rounded-xl border border-[#d8d0c0] bg-white px-4 py-3 outline-none focus:border-[#789052]"
          >
            <option value="">My organization is new to ChurchWork</option>
            {organizations.map((org) => <option key={org.id} value={org.id}>{org.name}</option>)}
          </select>
        </label>

        {!existingOrganizationId ? (
          <>
            <label className="block text-sm font-black text-[#173b2d] sm:col-span-2">
              {portal === "facility" ? "Facility name" : "Church / care partner name"}
              <input value={organizationName} onChange={(event) => setOrganizationName(event.target.value)} required className="mt-2 w-full rounded-xl border border-[#d8d0c0] px-4 py-3 outline-none focus:border-[#789052]" />
            </label>
            <label className="block text-sm font-black text-[#173b2d] sm:col-span-2">
              Street address
              <input value={addressLine1} onChange={(event) => setAddressLine1(event.target.value)} className="mt-2 w-full rounded-xl border border-[#d8d0c0] px-4 py-3 outline-none focus:border-[#789052]" />
            </label>
            <label className="block text-sm font-black text-[#173b2d]">
              City
              <input value={city} onChange={(event) => setCity(event.target.value)} className="mt-2 w-full rounded-xl border border-[#d8d0c0] px-4 py-3 outline-none focus:border-[#789052]" />
            </label>
            <div className="grid grid-cols-[1fr_.8fr] gap-3">
              <label className="block text-sm font-black text-[#173b2d]">
                State
                <input value={stateValue} onChange={(event) => setStateValue(event.target.value)} className="mt-2 w-full rounded-xl border border-[#d8d0c0] px-4 py-3 outline-none focus:border-[#789052]" />
              </label>
              <label className="block text-sm font-black text-[#173b2d]">
                ZIP
                <input value={postalCode} onChange={(event) => setPostalCode(event.target.value)} className="mt-2 w-full rounded-xl border border-[#d8d0c0] px-4 py-3 outline-none focus:border-[#789052]" />
              </label>
            </div>
            <label className="block text-sm font-black text-[#173b2d] sm:col-span-2">
              Website
              <input value={website} onChange={(event) => setWebsite(event.target.value)} placeholder="https://" className="mt-2 w-full rounded-xl border border-[#d8d0c0] px-4 py-3 outline-none focus:border-[#789052]" />
            </label>
          </>
        ) : null}

        <label className="block text-sm font-black text-[#173b2d] sm:col-span-2">
          {portal === "facility" ? "Anything ChurchWork should know about your spiritual-care program or care-partner relationship?" : "Which facilities do you expect to serve, or what should ChurchWork know about your care ministry?"}
          <textarea value={relationshipNote} onChange={(event) => setRelationshipNote(event.target.value)} rows={3} className="mt-2 w-full resize-none rounded-xl border border-[#d8d0c0] px-4 py-3 outline-none focus:border-[#789052]" />
        </label>
      </div>

      <button type="submit" disabled={isBusy} className="mt-6 w-full rounded-xl bg-[#173b2d] px-5 py-3 text-sm font-black text-white shadow-lg disabled:opacity-50">{isBusy ? "Submitting…" : "Submit for ChurchWork approval"}</button>
      <p className="mt-3 text-xs font-semibold leading-5 text-[#74817d]">{message}</p>
    </form>
  );
}
