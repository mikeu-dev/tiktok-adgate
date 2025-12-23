
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { User } from 'firebase/auth';

export async function createOrUpdateUser(user: User) {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        // Create new user
        await setDoc(userRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
            role: 'free' // Default role
        });
    } else {
        // Update existing user last login
        await setDoc(userRef, {
            lastLogin: serverTimestamp(),
            // Update basic info in case it changed on Google side
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
        }, { merge: true });
    }
}
