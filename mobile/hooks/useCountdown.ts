import { useEffect, useState } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeUntilNextMonday(): TimeLeft {
  const now = new Date();
  const dayOfWeek = now.getUTCDay(); // 0=Sun, 1=Mon
  const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
  const nextMonday = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + daysUntilMonday,
    ),
  );
  const diff = Math.max(0, nextMonday.getTime() - now.getTime());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export function useCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeUntilNextMonday());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeUntilNextMonday());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return timeLeft;
}
