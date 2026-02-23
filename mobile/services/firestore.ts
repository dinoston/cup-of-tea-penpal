import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  where,
  getDocs,
  writeBatch,
  serverTimestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import type { UserProfile } from '../types/user';
import type { Match } from '../types/match';
import type { Message } from '../types/message';

// ── USER ─────────────────────────────────────────────────────────────────────

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

export async function updateUserProfile(
  uid: string,
  data: Partial<UserProfile>,
) {
  await updateDoc(doc(db, 'users', uid), {
    ...data,
    lastActiveAt: Date.now(),
  });
}

export function subscribeToUserProfile(
  uid: string,
  callback: (profile: UserProfile | null) => void,
): Unsubscribe {
  return onSnapshot(doc(db, 'users', uid), (snap) => {
    callback(snap.exists() ? (snap.data() as UserProfile) : null);
  });
}

// ── MATCH ─────────────────────────────────────────────────────────────────────

export function subscribeToMatch(
  matchId: string,
  callback: (match: Match | null) => void,
): Unsubscribe {
  return onSnapshot(doc(db, 'matches', matchId), (snap) => {
    callback(snap.exists() ? ({ id: snap.id, ...snap.data() } as Match) : null);
  });
}

export async function getPartnerProfile(
  match: Match,
  myUid: string,
): Promise<UserProfile | null> {
  const partnerUid = match.userA === myUid ? match.userB : match.userA;
  return getUserProfile(partnerUid);
}

// ── MESSAGES ─────────────────────────────────────────────────────────────────

export function subscribeToMessages(
  matchId: string,
  callback: (messages: Message[]) => void,
): Unsubscribe {
  const q = query(
    collection(db, 'chats', matchId, 'messages'),
    orderBy('createdAt', 'asc'),
    limit(300),
  );
  return onSnapshot(q, (snap) => {
    callback(
      snap.docs.map((d) => ({ id: d.id, ...d.data() } as Message)),
    );
  });
}

export async function sendMessage(
  matchId: string,
  senderId: string,
  text: string,
) {
  await addDoc(collection(db, 'chats', matchId, 'messages'), {
    senderId,
    text: text.trim(),
    createdAt: Date.now(),
    readAt: null,
  });
}

export async function markMessagesRead(
  matchId: string,
  readerUid: string,
  match: Match,
) {
  const q = query(
    collection(db, 'chats', matchId, 'messages'),
    where('readAt', '==', null),
  );
  const snap = await getDocs(q);
  if (snap.empty) return;

  const batch = writeBatch(db);
  const now = Date.now();
  snap.docs.forEach((d) => {
    if (d.data().senderId !== readerUid) {
      batch.update(d.ref, { readAt: now });
    }
  });

  const isUserA = match.userA === readerUid;
  batch.update(doc(db, 'matches', matchId), {
    [isUserA ? 'unreadCountA' : 'unreadCountB']: 0,
  });

  await batch.commit();
}

// ── MATCH HISTORY ─────────────────────────────────────────────────────────────

export function subscribeToMatchHistory(
  uid: string,
  callback: (history: any[]) => void,
): Unsubscribe {
  const q = query(
    collection(db, 'matchHistory', uid, 'weeks'),
    orderBy('weekStart', 'desc'),
    limit(20),
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}
