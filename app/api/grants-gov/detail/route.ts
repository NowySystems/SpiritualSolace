import { NextResponse } from "next/server";
import { buildGrantsGovDetailBody, normalizeGrantsGovDetail } from "@/lib/grants-gov-detail";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const opportunityId = typeof body?.opportunityId === "string" ? body.opportunityId.trim() : "";
    const opportunityNumber = typeof body?.opportunityNumber === "string" ? body.opportunityNumber.trim() : "";
    const sourceUrl = typeof body?.sourceUrl === "string" ? body.sourceUrl.trim() : "";
    const title = typeof body?.title === "string" ? body.title.trim() : "";
    const agency = typeof body?.agency === "string" ? body.agency.trim() : "";

    if (!opportunityId) {
      return NextResponse.json({ error: "Opportunity ID is required for Grants.gov detail lookup." }, { status: 400 });
    }

    const requestBodies = [
      buildGrantsGovDetailBody(opportunityId),
      { oppId: opportunityId },
      { id: opportunityId },
    ];

    let data: unknown = null;
    let detailFetchSucceeded = false;

    for (const requestBody of requestBodies) {
      const response = await fetch("https://api.grants.gov/v1/api/fetchOpportunity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        cache: "no-store",
      });

      if (response.ok) {
        data = await response.json();
        detailFetchSucceeded = true;
        break;
      }
    }

    if (!detailFetchSucceeded) {
      return NextResponse.json(
        { error: "Detail fetch unavailable. Open the source link and verify manually." },
        { status: 502 },
      );
    }
    return NextResponse.json(
      normalizeGrantsGovDetail(data, {
        opportunityId,
        opportunityNumber,
        sourceUrl,
        title,
        agency,
      }),
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Detail fetch unavailable. Open the source link and verify manually.",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
