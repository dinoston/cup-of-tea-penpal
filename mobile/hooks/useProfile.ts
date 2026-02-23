import { useEffect, useState } from 'react';
import { subscribeToUserProfile } from '../services/firestore';
import type { UserProfile } from '../types/user';

export function useProfile(uid: string | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = subscribeToUserProfile(uid, (p) => {
      setProfile(p);
      setLoading(false);
    });
    return unsub;
  }, [uid]);

  return { profile, loading };
}
