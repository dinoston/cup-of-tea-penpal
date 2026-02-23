import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

export const onMessageCreate = functions.firestore
  .document('chats/{matchId}/messages/{messageId}')
  .onCreate(async (snap, context) => {
    const { matchId } = context.params;
    const message = snap.data();
    if (!message) return;

    const { senderId, text } = message;

    // Fetch match to determine recipient
    const matchSnap = await db.collection('matches').doc(matchId).get();
    if (!matchSnap.exists) return;

    const match = matchSnap.data()!;
    const isUserA = match.userA === senderId;
    const recipientUid = isUserA ? match.userB : match.userA;
    const unreadField = isUserA ? 'unreadCountB' : 'unreadCountA';

    // Update match: unread count + last message preview
    await db.collection('matches').doc(matchId).update({
      [unreadField]: admin.firestore.FieldValue.increment(1),
      lastMessageAt: Date.now(),
      lastMessageText: text.length > 60 ? text.slice(0, 60) + '…' : text,
    });

    // Fetch recipient FCM token
    const recipientSnap = await db.collection('users').doc(recipientUid).get();
    const recipientData = recipientSnap.data();
    if (!recipientData?.fcmToken) return;

    // Fetch sender display name
    const senderSnap = await db.collection('users').doc(senderId).get();
    const senderName = senderSnap.data()?.displayName ?? 'Your penpal';

    // Send FCM push
    await admin.messaging().send({
      token: recipientData.fcmToken,
      notification: {
        title: `☕ ${senderName}`,
        body: text.length > 80 ? text.slice(0, 80) + '…' : text,
      },
      data: { matchId, type: 'new_message' },
      android: { priority: 'high' },
      apns: { payload: { aps: { sound: 'default' } } },
    });
  });
