export interface FirebaseAdminConfig {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`[firestore-readiness] Missing required server env var: ${name}`);
  }
  return value;
}

export function isFirebaseAdminConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
  );
}

export function getFirebaseAdminConfig(): FirebaseAdminConfig {
  return {
    projectId: requiredEnv('FIREBASE_PROJECT_ID'),
    clientEmail: requiredEnv('FIREBASE_CLIENT_EMAIL'),
    privateKey: requiredEnv('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n')
  };
}

export async function failClosedMemoryWritePlaceholder(): Promise<never> {
  throw new Error(
    '[firestore-readiness] Memory write blocked by policy in CRCF 2.3 readiness phase.'
  );
}

let cachedApp: unknown;

export async function getFirestoreAdminDb() {
  if (!isFirebaseAdminConfigured()) {
    throw new Error(
      '[review-queue] Firestore admin is not configured. Missing FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, or FIREBASE_PRIVATE_KEY.'
    );
  }

  const adminModuleName = 'firebase-admin';
  const firestoreModuleName = 'firebase-admin/firestore';
  const admin = (await import(adminModuleName)) as any;
  const firestore = (await import(firestoreModuleName)) as any;

  if (!cachedApp) {
    const config = getFirebaseAdminConfig();
    cachedApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: config.projectId,
        clientEmail: config.clientEmail,
        privateKey: config.privateKey
      })
    });
  }

  return firestore.getFirestore(cachedApp);
}
