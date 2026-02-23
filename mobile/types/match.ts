export interface Match {
  id: string;
  userA: string;
  userB: string;
  sharedInterests: string[];
  status: 'active' | 'expired';
  weekStart: number;
  expiresAt: number;
  createdAt: number;
  lastMessageAt: number | null;
  lastMessageText: string | null;
  unreadCountA: number;
  unreadCountB: number;
}
