# Care Binder demo narration

This folder is reserved for approved local MP3 narration assets for the Care Binder Driver.js guided tour.

MP3 files are not committed in this PR. The tour works without audio: if a matching file is missing or cannot be decoded, the guided demo remains text-only and the Replay control is disabled for that step.

Approved narration copy for each expected audio file is documented in [`narration-scripts.md`](./narration-scripts.md). Use that script pack when generating real narration outside the application.

When real narration is approved, add local MP3 files using these exact filenames:

- `/demo-audio/care-queue-jane-doe.mp3`
- `/demo-audio/person-header.mp3`
- `/demo-audio/current-need-next-safe-step.mp3`
- `/demo-audio/care-plan.mp3`
- `/demo-audio/quick-actions.mp3`
- `/demo-audio/send-prayer-request-action.mp3`
- `/demo-audio/add-follow-up-action.mp3`
- `/demo-audio/schedule-visit-action.mp3`
- `/demo-audio/contact-church-action.mp3`
- `/demo-audio/care-timeline.mp3`
- `/demo-audio/recent-activity.mp3`

The app does not call ElevenLabs or any other live narration API at runtime. Any future narration files should be generated and approved outside the application, then added here as static local assets.
