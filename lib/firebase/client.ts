export interface FirebaseClientConfig {
  publicToken: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
}

export function getFirebaseClientConfig(): FirebaseClientConfig | null {
  const publicToken = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

  if (!publicToken || !authDomain || !projectId || !appId) {
    return null;
  }

  return {
    publicToken,
    authDomain,
    projectId,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId
  };
}

export function isFirebaseClientConfigured(): boolean {
  return Boolean(getFirebaseClientConfig());
}
