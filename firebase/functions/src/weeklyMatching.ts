import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { greedyMatch, Candidate } from './utils/matchingAlgorithm';

const db = admin.firestore();

function getCurrentMondayUTC(): Date {
  const now = new Date();
  const day = now.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + diff),
  );
  return monday;
}

export const weeklyMatchingCron = functions.pubsub
  .schedule('every monday 00:00')
  .timeZone('UTC')
  .onRun(async () => {
    console.log('Weekly matching started');

    // Fetch all users available for matching with no current match
    const snap = await db
      .collection('users')
      .where('isAvailableForMatching', '==', true)
      .where('currentMatchId', '==', null)
      .get();

    const candidates: Candidate[] = snap.docs
      .map((d) => {
        const data = d.data();
        if (!data.gender || !data.country) return null;
        return {
          uid: d.id,
          country: data.country,
          gender: data.gender,
          interests: data.interests ?? [],
          fcmToken: data.fcmToken ?? null,
        } as Candidate;
      })
      .filter(Boolean) as Candidate[];

    console.log(`Eligible candidates: ${candidates.length}`);

    const pairs = greedyMatch(candidates);
    console.log(`Matches created: ${pairs.length}`);

    const weekStart = getCurrentMondayUTC();
    const expiresAt = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
    const weekId = weekStart.toISOString().slice(0, 10);

    // Create match documents
    const matchPromises = pairs.map(async (pair) => {
      const matchRef = db.collection('matches').doc();
      const now = Date.now();

      await matchRef.set({
        userA: pair.userA.uid,
        userB: pair.userB.uid,
        sharedInterests: pair.sharedInterests,
        status: 'active',
        weekStart: weekStart.getTime(),
        expiresAt: expiresAt.getTime(),
        createdAt: now,
        lastMessageAt: null,
        lastMessageText: null,
        unreadCountA: 0,
        unreadCountB: 0,
      });

      const batch = db.batch();
      batch.update(db.collection('users').doc(pair.userA.uid), {
        currentMatchId: matchRef.id,
      });
      batch.update(db.collection('users').doc(pair.userB.uid), {
        currentMatchId: matchRef.id,
      });
      await batch.commit();

      // Send FCM push notifications
      const tokens = [pair.userA.fcmToken, pair.userB.fcmToken].filter(Boolean) as string[];
      if (tokens.length > 0) {
        await admin.messaging().sendEachForMulticast({
          tokens,
          notification: {
            title: '☕ You have a new penpal!',
            body: 'Your weekly penpal has arrived. Say hello!',
          },
          data: { matchId: matchRef.id, type: 'new_match' },
        });
      }
    });

    await Promise.all(matchPromises);
    console.log('Weekly matching complete');
    return null;
  });
