# Guided demo narration placeholders

Place pre-generated narration files for the Care Binder Driver.js tour in this folder.

Expected local paths:

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

These files should be generated outside the application and committed or deployed as static assets. The tour never calls ElevenLabs or any external audio service at runtime, and missing files are ignored so the text-only demo remains usable.
