# Care Binder demo narration

This folder documents the approved narration plan for the Care Binder Driver.js guided tour.

MP3 narration files are not committed through the Codex/GitHub PR flow because they are binary audio assets. The guided tour remains text-first while audio is pending: if a matching local MP3 file is absent or cannot be decoded, the tour continues without narration and the Replay control is unavailable for that step.

The app already supports local static MP3 playback from this folder. When approved MP3s are generated outside the application, a human maintainer may manually add them under `public/demo-audio/` using the exact filenames listed in [`audio-manifest.json`](./audio-manifest.json). The files are then served by the app as local `/demo-audio/...` assets.

[`audio-manifest.json`](./audio-manifest.json) is the source of truth for which narration files still need to be generated. Each entry includes the expected filename, approved script text, a pending duration, and `pending-audio` status.

Approved narration copy is also available in [`narration-scripts.md`](./narration-scripts.md) for reviewer-friendly reading.

The app does not call ElevenLabs or any other live narration API at runtime. Any future narration files must be generated, approved, and added outside the application by a human-controlled process.
