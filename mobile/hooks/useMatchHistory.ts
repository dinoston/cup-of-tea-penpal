import { useEffect, useState } from 'react';
import { subscribeToMatchHistory } from '../services/firestore';

export function useMatchHistory(uid: string | null) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }
    const unsub = subscribeToMatchHistory(uid, (h) => {
      setHistory(h);
      setLoading(false);
    });
    return unsub;
  }, [uid]);

  return { history, loading };
}
