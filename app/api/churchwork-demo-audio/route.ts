import { NextResponse } from "next/server";
import { getChurchWorkDemoStep } from "@/lib/churchworkDemoScripts";

type DemoAudioRequestBody = {
  scriptId?: string;
  stepId?: string;
  voice?: string;
};

export async function POST(request: Request) {
  let body: DemoAudioRequestBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const scriptId = body.scriptId?.trim();
  const stepId = body.stepId?.trim();
  const voice = body.voice?.trim() || "default";

  if (!scriptId || !stepId) {
    return NextResponse.json({ error: "scriptId and stepId are required." }, { status: 400 });
  }

  const step = getChurchWorkDemoStep(scriptId, stepId);

  if (!step) {
    return NextResponse.json({ error: "Unknown ChurchWork demo script or step." }, { status: 404 });
  }

  return NextResponse.json(
    {
      status: "fallback_only",
      message: "OpenAI audio generation is not wired yet. Use browser speech synthesis fallback for now.",
      scriptId,
      stepId,
      voice,
      narration: step.narration,
      relatedEventType: step.relatedEventType ?? null
    },
    { status: 202 }
  );
}
