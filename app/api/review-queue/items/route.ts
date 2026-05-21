import { NextResponse } from "next/server";
import { createReviewItem } from "@/lib/firebase/review-items";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const created = await createReviewItem(body);
    return NextResponse.json({ item: created }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const isConfigError = message.includes("not configured") || message.includes("Missing FIREBASE");
    return NextResponse.json(
      {
        error: isConfigError
          ? "Review queue persistence unavailable: Firebase admin env vars are not configured."
          : "Unable to create review queue item.",
        detail: message,
      },
      { status: isConfigError ? 503 : 400 },
    );
  }
}
