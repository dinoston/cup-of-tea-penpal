import * as admin from 'firebase-admin';

admin.initializeApp();

export { weeklyMatchingCron } from './weeklyMatching';
export { expireMatchesCron } from './expireMatches';
export { onMessageCreate } from './onMessageCreate';
