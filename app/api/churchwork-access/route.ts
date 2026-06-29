import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const configuredAccessCode = process.env.CHURCHWORK_ACCESS_CODE;

  if (!configuredAccessCode) {
    return NextResponse.json({ error: "ChurchWork access is not configured." }, { status: 503 });
  }

  let payload: { accessCode?: unknown };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid access request." }, { status: 400 });
  }

  if (typeof payload.accessCode !== "string" || payload.accessCode !== configuredAccessCode) {
    return NextResponse.json({ error: "Invalid access code." }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
