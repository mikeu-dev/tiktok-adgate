
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (serviceAccountKey) {
        try {
            const serviceAccount = JSON.parse(serviceAccountKey);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        } catch (error) {
            console.error('Firebase Admin Init Error: Invalid JSON', error);
        }
    } else {
        // Fallback or warning
        console.warn('FIREBASE_SERVICE_ACCOUNT_KEY not found. Admin features may fail.');
        // If running in Google Cloud environment (e.g. Cloud Run/Functions), default credentials might work:
        // admin.initializeApp(); 
    }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
