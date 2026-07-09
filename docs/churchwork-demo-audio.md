# ChurchWork Demo Audio Architecture

The current guided demo uses browser speech synthesis as a fallback. Final ChurchWork demos should use generated narration audio so the voice is consistent across devices and does not depend on browser/system voice settings.

## Goal

Provide warm, professional, consistent narration for guided demos without exposing API keys in the browser.

## Target flow

```txt
Guided demo step
→ browser requests narration for step id
→ server validates the known step
→ server generates or retrieves cached audio
→ browser plays audio
→ browser falls back to speechSynthesis if unavailable
```

## Proposed API route

`POST /api/churchwork-demo-audio`

Request body:

```json
{
  "scriptId": "churchwork-end-to-end-v1",
  "stepId": "requester-terms-accepted",
  "voice": "default"
}
```

Response options:

1. `audio/mpeg` or another supported audio MIME type directly.
2. JSON containing a cached signed URL.

Preferred first implementation: return the audio bytes directly so the client can create an object URL.

## Server responsibilities

- Validate `scriptId` and `stepId` against known demo scripts.
- Never accept arbitrary user-provided narration text from the browser.
- Generate narration through the server-side OpenAI API client.
- Cache generated audio by `scriptId`, `stepId`, `voice`, and script version.
- Return cached audio on repeat plays.
- Never expose the OpenAI API key to the browser.

## Client responsibilities

- Keep Voice On / Off.
- Keep Replay Step.
- Request audio only after the user starts the demo.
- Do not auto-start audio on page load.
- Fall back to browser speech synthesis if the API route fails.
- Cancel current audio before moving to the next step.

## Demo script versioning

Each demo script should have a stable version:

```txt
churchwork-end-to-end-v1
churchwork-requester-v1
churchwork-facility-v1
churchwork-partner-v1
```

Changing narration text should bump the script version so cached audio does not mismatch the on-screen script.

## OpenAI integration note

Use OpenAI only from the server/API route. The frontend should know only `scriptId`, `stepId`, and playback state.

## Future refinements

- Per-demo voice style.
- Intro/outro music disabled by default.
- Faster prefetching of next-step audio after the current step starts.
- Admin setting to switch between browser voice and OpenAI voice.
- Demo analytics for how far a facility or partner prospect gets through the guided demo.
