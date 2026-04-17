import { useState, useEffect } from 'react';

export default function CountdownTimer({ targetTime }) {
  const [timeLeft, setTimeLeft] = useState({ h: '00', m: '00', s: '00' });
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetTime.getTime() - now;

      if (distance < 0) {
        setIsLive(true);
        clearInterval(timer);
        return;
      }

      const h = Math.floor(distance / (1000 * 60 * 60)).toString().padStart(2, '0');
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
      const s = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0');

      setTimeLeft({ h, m, s });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTime]);

  if (isLive) {
    return (
      <div className="flex items-center gap-2 text-kerala-red font-black animate-pulse text-2xl">
        <span className="w-3 h-3 bg-kerala-red rounded-full"></span>
        DRAW LIVE NOW
      </div>
    );
  }

  return (
    <div className="flex gap-4 font-mono">
      <TimeUnit value={timeLeft.h} label="HRS" />
      <TimeUnit value={timeLeft.m} label="MIN" />
      <TimeUnit value={timeLeft.s} label="SEC" />
    </div>
  );
}

function TimeUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white/10 text-white w-14 h-16 md:w-16 md:h-20 rounded-xl flex items-center justify-center text-3xl md:text-4xl font-black shadow-lg border border-white/5">
        {value}
      </div>
      <span className="text-[10px] md:text-xs font-black text-white/40 mt-2 tracking-widest">{label}</span>
    </div>
  );
}
