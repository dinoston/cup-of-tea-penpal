import { useEffect, useState } from 'react';
import { subscribeToMessages } from '../services/firestore';
import type { Message } from '../types/message';

export function useMessages(matchId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!matchId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = subscribeToMessages(matchId, (msgs) => {
      setMessages(msgs);
      setLoading(false);
    });
    return unsub;
  }, [matchId]);

  return { messages, loading };
}
