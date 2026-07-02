"use client";

import { FormEvent, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type FacilitySignupCardProps = {
  session: Session;
};

type CreatedFacility = {
  organization_id: string;
  facility_id: string;
  membership_id: string;
  organization_slug: string;
  facility_name: string;
  role: string;
  status: string;
};

export function FacilitySignupCard({ session }: FacilitySignupCardProps) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [facilityName, setFacilityName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [status, setStatus] = useState("Ready to create a facility workspace.");
  const [isBusy, setIsBusy] = useState(false);
  const [createdFacility, setCreatedFacility] = useState<CreatedFacility | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsBusy(true);
    setStatus("Creating facility workspace...");

    const { data, error } = await supabase.rpc("create_facility_account", {
      p_facility_name: facilityName,
      p_address_line_1: addressLine1,
      p_city: city,
      p_state: state,
      p_postal_code: postalCode
    });

    if (error) {
      setStatus(error.message);
      setIsBusy(false);
      return;
    }

    setCreatedFacility(data as CreatedFacility);
    setStatus("Facility workspace created. You are now the Facility Admin for this organization.");
    setFacilityName("");
    setAddressLine1("");
    setCity("");
    setState("");
    setPostalCode("");
    setIsBusy(false);
  }

  return (
    <section className="mt-8 rounded-[2rem] border border-[#d8d0c0] bg-white p-8 text-[#102b3a] shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[#789052]">Facility signup</p>
      <h3 className="mt-3 font-serif text-3xl font-semibold tracking-[-0.03em]">Create a facility workspace.</h3>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-[#4d5d55]">
        If a facility wants to use ChurchWork, the first signed-in person can create the facility workspace and becomes the Facility Admin for that organization. Later, that admin will manage facility staff without ChurchWork owner involvement.
      </p>

      <div className="mt-5 rounded-2xl border border-[#ddb66c]/45 bg-[#fff8e7] p-5 text-sm leading-7 text-[#5f4b1f]">
        Facility signup creates the organization and first Facility Admin only. Spiritual-care requests still remain structured, non-medical, and consent-aware.
      </div>

      {createdFacility ? (
        <div className="mt-6 rounded-2xl border border-[#86a45f]/40 bg-[#f0f5e8] p-5 text-sm leading-7 text-[#173b2d]">
          <p className="font-black">{createdFacility.facility_name} created.</p>
          <p>Workspace slug: {createdFacility.organization_slug}</p>
          <p>Your role: {createdFacility.role} · Status: {createdFacility.status}</p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-bold text-[#173b2d] md:col-span-2">
          Facility name
          <input
            type="text"
            value={facilityName}
            onChange={(event) => setFacilityName(event.target.value)}
            required
            maxLength={160}
            placeholder="Example: Grandview Post Acute"
            className="mt-2 w-full rounded-xl border border-[#d8d0c0] px-4 py-3 text-base outline-none focus:border-[#8aa363]"
          />
        </label>

        <label className="block text-sm font-bold text-[#173b2d] md:col-span-2">
          Address, optional
          <input
            type="text"
            value={addressLine1}
            onChange={(event) => setAddressLine1(event.target.value)}
            maxLength={180}
            placeholder="Street address"
            className="mt-2 w-full rounded-xl border border-[#d8d0c0] px-4 py-3 text-base outline-none focus:border-[#8aa363]"
          />
        </label>

        <label className="block text-sm font-bold text-[#173b2d]">
          City, optional
          <input
            type="text"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            maxLength={120}
            placeholder="City"
            className="mt-2 w-full rounded-xl border border-[#d8d0c0] px-4 py-3 text-base outline-none focus:border-[#8aa363]"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-bold text-[#173b2d]">
            State, optional
            <input
              type="text"
              value={state}
              onChange={(event) => setState(event.target.value.toUpperCase())}
              maxLength={2}
              placeholder="TN"
              className="mt-2 w-full rounded-xl border border-[#d8d0c0] px-4 py-3 text-base outline-none focus:border-[#8aa363]"
            />
          </label>

          <label className="block text-sm font-bold text-[#173b2d]">
            ZIP, optional
            <input
              type="text"
              value={postalCode}
              onChange={(event) => setPostalCode(event.target.value)}
              maxLength={20}
              placeholder="38501"
              className="mt-2 w-full rounded-xl border border-[#d8d0c0] px-4 py-3 text-base outline-none focus:border-[#8aa363]"
            />
          </label>
        </div>

        <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={isBusy}
            className="rounded-xl bg-[#173b2d] px-6 py-3 text-base font-bold text-white shadow-lg hover:bg-[#102b3a] disabled:opacity-60"
          >
            {isBusy ? "Creating..." : "Create facility workspace"}
          </button>
          <p className="text-sm font-semibold text-[#4d5d55]">{status}</p>
        </div>
      </form>
    </section>
  );
}
