import { useEffect, useState } from 'react';

export function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const tick = () => {
      const distance = new Date(targetDate).getTime() - Date.now();
      if (distance < 0) {
        setTimeLeft('Trip Started!');
        return false;
      }
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      setTimeLeft(`${days}d ${hours}h`);
      return true;
    };

    if (!tick()) return;
    // Update every minute is enough for a day/hour countdown.
    const interval = setInterval(() => {
      if (!tick()) clearInterval(interval);
    }, 60_000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return <span className="font-black text-[#ff6600]">{timeLeft || '...'}</span>;
}
