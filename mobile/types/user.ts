export type Gender = 'male' | 'female';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  country: string;
  gender: Gender;
  interests: string[];
  bio: string;
  isAvailableForMatching: boolean;
  currentMatchId: string | null;
  fcmToken: string | null;
  createdAt: number;
  lastActiveAt: number;
}
