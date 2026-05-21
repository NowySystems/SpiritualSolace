import { NextResponse } from "next/server";
import { buildGrantsGovSearchBody, parseGrantsGovResponse } from "@/lib/grants-gov";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const keyword = typeof body?.keyword === "string" ? body.keyword.trim() : "";

    if (!keyword) {
      return NextResponse.json({ error: "Keyword is required." }, { status: 400 });
    }

    const response = await fetch("https://api.grants.gov/v1/api/search2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(buildGrantsGovSearchBody(keyword)),
      cache: "no-store"
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Grants.gov request failed with status ${response.status}.` },
        { status: 502 }
      );
    }

    const data = await response.json();
    return NextResponse.json(parseGrantsGovResponse(keyword, data));
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unable to search Grants.gov right now.",
        detail: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
