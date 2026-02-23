import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const expireMatchesCron = functions.pubsub
  .schedule('every sunday 23:00')
  .timeZone('UTC')
  .onRun(async () => {
    console.log('Expiring old matches...');
    const now = Date.now();

    const snap = await db
      .collection('matches')
      .where('status', '==', 'active')
      .where('expiresAt', '<=', now)
      .get();

    console.log(`Matches to expire: ${snap.size}`);

    const expirePromises = snap.docs.map(async (matchDoc) => {
      const data = matchDoc.data();
      const { userA, userB, weekStart } = data;
      const weekId = new Date(weekStart).toISOString().slice(0, 10);

      // Count messages exchanged
      const messagesSnap = await db
        .collection('chats')
        .doc(matchDoc.id)
        .collection('messages')
        .get();
      const messageCount = messagesSnap.size;

      // Get display names for history
      const [userASnap, userBSnap] = await Promise.all([
        db.collection('users').doc(userA).get(),
        db.collection('users').doc(userB).get(),
      ]);

      const userAData = userASnap.data();
      const userBData = userBSnap.data();

      const batch = db.batch();

      // Expire match
      batch.update(matchDoc.ref, { status: 'expired' });

      // Reset currentMatchId for both users
      batch.update(db.collection('users').doc(userA), { currentMatchId: null });
      batch.update(db.collection('users').doc(userB), { currentMatchId: null });

      // Write match history for userA
      batch.set(db.collection('matchHistory').doc(userA).collection('weeks').doc(weekId), {
        matchId: matchDoc.id,
        partnerUid: userB,
        partnerDisplayName: userBData?.displayName ?? 'Unknown',
        partnerCountry: userBData?.country ?? '',
        weekStart,
        messageCount,
        status: 'expired',
      });

      // Write match history for userB
      batch.set(db.collection('matchHistory').doc(userB).collection('weeks').doc(weekId), {
        matchId: matchDoc.id,
        partnerUid: userA,
        partnerDisplayName: userAData?.displayName ?? 'Unknown',
        partnerCountry: userAData?.country ?? '',
        weekStart,
        messageCount,
        status: 'expired',
      });

      await batch.commit();

      // FCM: notify both users
      const tokens = [userAData?.fcmToken, userBData?.fcmToken].filter(Boolean) as string[];
      if (tokens.length > 0) {
        await admin.messaging().sendEachForMulticast({
          tokens,
          notification: {
            title: '✨ Penpal week ended',
            body: 'A new penpal arrives tomorrow. See you Monday!',
          },
          data: { type: 'match_expired' },
        });
      }
    });

    await Promise.all(expirePromises);
    console.log('Done expiring matches');
    return null;
  });
