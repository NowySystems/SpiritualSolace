"use client";

const SCRIPT_ID = "churchwork-end-to-end-v1";

let currentAudio: HTMLAudioElement | null = null;
let currentObjectUrl: string | null = null;
let currentRequestToken = 0;

export type PlayChurchWorkDemoNarrationOptions = {
  stepId: string;
  fallbackText: string;
  voiceEnabled: boolean;
  scriptId?: string;
  voice?: string;
};

function cleanupAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.src = "";
    currentAudio = null;
  }

  if (currentObjectUrl) {
    URL.revokeObjectURL(currentObjectUrl);
    currentObjectUrl = null;
  }
}

function chooseBrowserVoice() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return undefined;
  const voices = window.speechSynthesis.getVoices().filter((voice) => voice.lang.toLowerCase().startsWith("en"));
  return voices.find((voice) => /samantha|ava|jenny|aria|emma|natural|female|warm/i.test(`${voice.name} ${voice.voiceURI}`)) ?? voices.find((voice) => voice.lang.toLowerCase().startsWith("en-us")) ?? voices[0];
}

export function stopChurchWorkDemoNarration() {
  currentRequestToken += 1;
  cleanupAudio();

  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export function playBrowserSpeechFallback(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.94;
  utterance.pitch = 1.02;
  utterance.volume = 0.86;

  const voice = chooseBrowserVoice();
  if (voice) utterance.voice = voice;

  window.speechSynthesis.speak(utterance);
}

async function tryPlayApiAudio(options: PlayChurchWorkDemoNarrationOptions, requestToken: number) {
  const response = await fetch("/api/churchwork-demo-audio", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      scriptId: options.scriptId ?? SCRIPT_ID,
      stepId: options.stepId,
      voice: options.voice ?? "default"
    })
  });

  if (requestToken !== currentRequestToken) return true;

  const contentType = response.headers.get("content-type") ?? "";

  if (response.ok && contentType.startsWith("audio/")) {
    const audioBlob = await response.blob();
    if (requestToken !== currentRequestToken) return true;

    currentObjectUrl = URL.createObjectURL(audioBlob);
    currentAudio = new Audio(currentObjectUrl);
    await currentAudio.play();
    return true;
  }

  return false;
}

export async function playChurchWorkDemoNarration(options: PlayChurchWorkDemoNarrationOptions) {
  if (!options.voiceEnabled) {
    stopChurchWorkDemoNarration();
    return;
  }

  stopChurchWorkDemoNarration();
  const requestToken = currentRequestToken;

  try {
    const playedApiAudio = await tryPlayApiAudio(options, requestToken);
    if (playedApiAudio || requestToken !== currentRequestToken) return;
  } catch {
    // Browser speech fallback below.
  }

  if (requestToken === currentRequestToken) {
    playBrowserSpeechFallback(options.fallbackText);
  }
}
