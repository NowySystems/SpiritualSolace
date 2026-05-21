import { NextResponse } from "next/server";
import { liveSourcePilots } from "@/lib/live-source-pilots";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    phase: "CRCF 3.2.1 — Grants.gov Forecast / Non-Actionable Opportunity Handling",
    readOnly: true,
    failClosed: true,
    humanReviewRequired: true,
    canSendToReviewQueue: false,
    canPersist: false,
    opportunities: [],
    pilots: liveSourcePilots,
    sourceNotice:
      "Source pilots are read-only and source-bound. No fallback/fake opportunities are generated when sources are unavailable."
  });
}
