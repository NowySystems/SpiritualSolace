# Firebase / Firestore Environment Checklist (CRCF 2.3)

CRCF 2.3 adds readiness-only infrastructure for future internal memory.

## Client-safe Firebase config (optional in CRCF 2.3)

These are public Firebase client values and may be prefixed with `NEXT_PUBLIC_`:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

If these are missing, the app should still render and build. The readiness client helper returns `null` instead of crashing.

## Server-only Firebase Admin secrets

These must remain server-only and must never be committed:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

If these are missing, server admin helpers fail closed with an explicit internal error.

## Security posture

- Never commit Firebase service account JSON.
- Never place server secrets in client bundles.
- Never enable broad writes in CRCF 2.3.
