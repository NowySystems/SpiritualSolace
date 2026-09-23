import { NextRequest, NextResponse } from "next/server";

const ALLOWED_VOICES = new Set(["marin", "cedar"]);

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "speech-not-configured" },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
          "X-Robots-Tag": "noindex, nofollow, noarchive"
        }
      }
    );
  }

  const body = await request.json().catch(() => null);
  const input = typeof body?.input === "string" ? body.input.trim() : "";
  const requestedVoice = typeof body?.voice === "string" ? body.voice.toLowerCase() : "marin";
  const voice = ALLOWED_VOICES.has(requestedVoice) ? requestedVoice : "marin";

  if (!input) {
    return NextResponse.json({ ok: false, error: "speech-input-required" }, { status: 400 });
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
