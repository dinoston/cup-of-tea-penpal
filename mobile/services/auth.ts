import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

export async function signUp(email: string, password: string) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  // Create skeleton user doc — profile filled in during onboarding
  await setDoc(doc(db, 'users', credential.user.uid), {
    uid: credential.user.uid,
    email,
    displayName: '',
    country: '',
    gender: '',
    interests: [],
    bio: '',
    isAvailableForMatching: false,
    currentMatchId: null,
    fcmToken: null,
    createdAt: Date.now(),
    lastActiveAt: Date.now(),
  });
  return credential.user;
}

export async function signIn(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

export async function signOut() {
  await firebaseSignOut(auth);
}

export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}
