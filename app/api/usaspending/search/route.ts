import { NextResponse } from "next/server";
import { buildUsaSpendingFallbackSearchBody, buildUsaSpendingSearchBody, parseUsaSpendingResponse } from "@/lib/usaspending";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const keyword = typeof body?.keyword === "string" ? body.keyword.trim() : "";

    if (!keyword) {
      return NextResponse.json({ error: "Search terms are required." }, { status: 400 });
    }

    let response = await fetch("https://api.usaspending.gov/api/v2/search/spending_by_award/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(buildUsaSpendingSearchBody(keyword)),
      cache: "no-store",
    });

    if (!response.ok && [400, 422].includes(response.status)) {
      response = await fetch("https://api.usaspending.gov/api/v2/search/spending_by_award/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildUsaSpendingFallbackSearchBody(keyword)),
        cache: "no-store",
      });
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: `USAspending request failed with status ${response.status}. Staff can try broader terms or verify directly on USAspending.gov.` },
        { status: 502 },
      );
    }

    const data = await response.json();
    return NextResponse.json(parseUsaSpendingResponse(keyword, data));
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unable to search USAspending right now. Staff can retry later or verify directly on USAspending.gov.",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
