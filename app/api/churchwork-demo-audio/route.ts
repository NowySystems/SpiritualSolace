import { NextResponse } from "next/server";
import { getChurchWorkDemoStep } from "@/lib/churchworkDemoScripts";

type DemoAudioRequestBody = {
  scriptId?: string;
  stepId?: string;
  voice?: string;
};

type CachedAudio = {
  bytes: ArrayBuffer;
  contentType: string;
  createdAt: number;
};

const OPENAI_SPEECH_URL = "https://api.openai.com/v1/audio/speech";
const DEFAULT_MODEL = "gpt-4o-mini-tts";
const DEFAULT_VOICE = "marin";
const CACHE_TTL_MS = 1000 * 60 * 60 * 24;
const audioCache = new Map<string, CachedAudio>();
const supportedVoices = new Set(["alloy", "ash", "ballad", "coral", "echo", "fable", "onyx", "nova", "sage", "shimmer", "verse", "marin", "cedar"]);

function fallbackResponse(scriptId: string, stepId: string, voice: string, narration: string, reason: string, relatedEventType?: string) {
  return NextResponse.json(
    {
      status: "fallback_only",
      message: "Use browser speech synthesis fallback for this step.",
      reason,
      scriptId,
      stepId,
      voice,
      narration,
      relatedEventType: relatedEventType ?? null
    },
    { status: 202 }
  );
}

function safeVoice(rawVoice?: string) {
  const voice = rawVoice?.trim() || DEFAULT_VOICE;
  return supportedVoices.has(voice) ? voice : DEFAULT_VOICE;
}

function cacheKey(scriptId: string, stepId: string, voice: string, model: string) {
  return `${scriptId}:${stepId}:${voice}:${model}`;
}

function getCachedAudio(key: string) {
  const cached = audioCache.get(key);
  if (!cached) return null;

  if (Date.now() - cached.createdAt > CACHE_TTL_MS) {
    audioCache.delete(key);
    return null;
  }

  return cached;
}

function audioResponse(bytes: ArrayBuffer, contentType: string) {
  return new Response(bytes.slice(0), {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "private, max-age=86400"
    }
  });
}

export async function POST(request: Request) {
  let body: DemoAudioRequestBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const scriptId = body.scriptId?.trim();
  const stepId = body.stepId?.trim();
  const voice = safeVoice(body.voice);

  if (!scriptId || !stepId) {
    return NextResponse.json({ error: "scriptId and stepId are required." }, { status: 400 });
  }

  const step = getChurchWorkDemoStep(scriptId, stepId);

  if (!step) {
    return NextResponse.json({ error: "Unknown ChurchWork demo script or step." }, { status: 404 });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return fallbackResponse(scriptId, stepId, voice, step.narration, "OPENAI_API_KEY is not configured.", step.relatedEventType);
  }

  const model = process.env.CHURCHWORK_TTS_MODEL?.trim() || DEFAULT_MODEL;
  const key = cacheKey(scriptId, stepId, voice, model);
  const cached = getCachedAudio(key);

  if (cached) {
    return audioResponse(cached.bytes, cached.contentType);
  }

  const openAiResponse = await fetch(OPENAI_SPEECH_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      input: step.narration,
      voice,
      response_format: "mp3",
      instructions: "Speak with a warm, calm, professional care-coordination tone. Keep the pacing clear and reassuring. Do not sound dramatic, clinical, or salesy."
    })
  });

  if (!openAiResponse.ok) {
    return fallbackResponse(scriptId, stepId, voice, step.narration, `OpenAI speech request failed with status ${openAiResponse.status}.`, step.relatedEventType);
  }

  const bytes = await openAiResponse.arrayBuffer();
  const contentType = openAiResponse.headers.get("content-type") ?? "audio/mpeg";

  audioCache.set(key, {
    bytes: bytes.slice(0),
    contentType,
    createdAt: Date.now()
  });

  return audioResponse(bytes, contentType);
}
