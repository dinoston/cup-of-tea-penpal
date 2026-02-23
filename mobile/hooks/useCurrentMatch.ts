import { useEffect, useState } from 'react';
import { subscribeToMatch, getPartnerProfile } from '../services/firestore';
import type { Match } from '../types/match';
import type { UserProfile } from '../types/user';

export function useCurrentMatch(
  currentMatchId: string | null,
  myUid: string | null,
) {
  const [match, setMatch] = useState<Match | null>(null);
  const [partner, setPartner] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentMatchId || !myUid) {
      setMatch(null);
      setPartner(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = subscribeToMatch(currentMatchId, async (m) => {
      setMatch(m);
      if (m) {
        const p = await getPartnerProfile(m, myUid);
        setPartner(p);
      } else {
        setPartner(null);
      }
      setLoading(false);
    });
    return unsub;
  }, [currentMatchId, myUid]);

  return { match, partner, loading };
}
