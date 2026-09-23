import { NextRequest, NextResponse } from "next/server";

const ALLOWED_VOICES = new Set(["marin", "cedar"]);

const TOUR_SCENES: Record<string, string> = {
  intro: "One request. Three trusted roles. One closed loop. See how ChurchWork moves a spiritual-care request from a resident or family member, through facility review, to an approved church partner, and safely back again.",
  requester: "The requester chooses what would help. No medical narrative. No long form. Just a simple, structured spiritual-care request that Grandview can safely review.",
  "facility-review": "Grandview stays in control of what moves forward. The request lands in a focused review queue. Grandview checks the safe summary and approves it for the designated care partner.",
  partner: "Hope sees only the approved spiritual-care context. The church receives a clear assignment, not a chart, not a medical record, and not a private conversation thread.",
  "partner-complete": "The care team reports what happened in one tap. Prayer logged, visit planned, visit completed, or follow-up requested. The outcome goes back to Grandview for review.",
  "facility-release": "Grandview closes the privacy loop. Hope's outcome is visible to Grandview first. Grandview releases a standardized safe update to the requester. Nothing leaves automatically.",
  "requester-complete": "The requester gets closure without another task. The update is released, the request is complete, and the requester knows care happened. No extra acknowledgement or close button is required."
};



async function generateSpeech(input: string, voice = "marin") {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "speech-not-configured" },
      { status: 503, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow, noarchive" } }
    );
  }

  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini-tts",
      voice,
      input: input.slice(0, 4096),
      response_format: "mp3",
      instructions:
        "Narrate a polished healthcare-adjacent spiritual-care product walkthrough. Sound warm, calm, trustworthy, natural, and professional. Use clear pacing, gentle confidence, and subtle warmth. Avoid sounding salesy, theatrical, overly cheerful, or robotic."
    })
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error("[churchwork-tour-speech] OpenAI speech request failed", {
      status: response.status,
      detail: detail.slice(0, 400)
    });
    return NextResponse.json({ ok: false, error: "speech-generation-failed" }, { status: 502 });
  }

  const audio = await response.arrayBuffer();
  return new NextResponse(audio, {
    status: 200,
    headers: {
      "Content-Type": response.headers.get("content-type") || "audio/mpeg",
      "Cache-Control": "private, max-age=3600",
      "X-Robots-Tag": "noindex, nofollow, noarchive"
    }
  });
}

export async function GET(request: NextRequest) {
  const scene = request.nextUrl.searchParams.get("scene") ?? "";
  const input = TOUR_SCENES[scene];

  if (!input) {
    return NextResponse.json({ ok: false, error: "unknown-tour-scene" }, { status: 404 });
  }

  return generateSpeech(input, "marin");
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const input = typeof body?.input === "string" ? body.input.trim() : "";
  const requestedVoice = typeof body?.voice === "string" ? body.voice.toLowerCase() : "marin";
  const voice = ALLOWED_VOICES.has(requestedVoice) ? requestedVoice : "marin";

  if (!input) {
    return NextResponse.json({ ok: false, error: "speech-input-required" }, { status: 400 });
  }

  return generateSpeech(input, voice);
}
