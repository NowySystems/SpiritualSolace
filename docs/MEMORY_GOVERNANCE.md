# Memory Governance Notes (CRCF 2.4)

CRCF 2.4 allows a single controlled Firestore workflow for `review_items`.

## Allowed posture

- Find, read, summarize, rank, recommend, explain, and organize internally.
- Prepare future internal review memory with explicit governance.

## Disallowed posture

- No grant submissions.
- No funder outreach or emailing agencies.
- No writes to source systems.
- No external portal logins/actions.
- No uncontrolled persistent writes.
- No client-side Firestore writes.

## Write controls

- Writes are server-side only through the review queue API path.
- If Firebase admin env vars are missing, writes fail closed with explicit internal error messaging.
- Payloads are validated/sanitized and bounded (no large free-text blobs).
- Proposal text and uploaded document content must not be persisted automatically.
- Human review is required before any external action.
- External actions remain disabled.
