# ChurchWork Demo Audio Architecture

The guided demo now uses a server-side audio route with browser speech synthesis as the fallback. OpenAI-generated narration is supported when `OPENAI_API_KEY` is configured in the deployment environment.

## Goal

Provide warm, professional, consistent narration for guided demos without exposing API keys in the browser.

## Current flow

```txt
Guided demo step
→ browser requests narration for script id + step id
→ server validates the known step
→ server returns cached audio, generates OpenAI audio, or returns fallback JSON
→ browser plays audio when audio is returned
→ browser falls back to speechSynthesis when fallback JSON or an error is returned
```

## API route

`POST /api/churchwork-demo-audio`

Request body:

```json
{
  "scriptId": "churchwork-end-to-end-v1",
  "stepId": "requester-terms-accepted",
  "voice": "marin"
}
```

Successful audio response:

- Status: `200`
- Content-Type: `audio/mpeg` or another `audio/*` response from OpenAI
- Body: audio bytes

Fallback response:

- Status: `202`
- JSON with `status: "fallback_only"`
- Browser should use speech synthesis fallback

## Server responsibilities

- Validate `scriptId` and `stepId` against known demo scripts.
- Never accept arbitrary user-provided narration text from the browser.
- Generate narration through the server-side OpenAI Speech API only when `OPENAI_API_KEY` is set.
- Cache generated audio in memory by `scriptId`, `stepId`, `voice`, and model.
- Return cached audio on repeat plays while the server instance keeps the cache.
- Never expose the OpenAI API key to the browser.
- Fall back safely when the OpenAI key is missing or generation fails.

## Client responsibilities

- Keep Voice On / Off.
- Keep Replay Step.
- Request audio only after the user starts the demo.
- Do not auto-start audio on page load.
- Fall back to browser speech synthesis if the API route returns fallback JSON or fails.
- Cancel current audio before moving to the next step.

## Environment variables

Required for OpenAI narration:

```txt
OPENAI_API_KEY=...
```

Optional:

```txt
CHURCHWORK_TTS_MODEL=gpt-4o-mini-tts
```

Default model: `gpt-4o-mini-tts`

Default voice: `marin`

Allowed built-in voices:

```txt
alloy, ash, ballad, coral, echo, fable, onyx, nova, sage, shimmer, verse, marin, cedar
```

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

- Durable audio storage instead of memory-only cache.
- Per-demo voice style.
- Faster prefetching of next-step audio after the current step starts.
- Admin setting to switch between browser voice and OpenAI voice.
- Demo analytics for how far a facility or partner prospect gets through the guided demo.
