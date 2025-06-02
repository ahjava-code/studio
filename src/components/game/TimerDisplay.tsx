// src/components/game/TimerDisplay.tsx
"use client";
import type { Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Timer } from 'lucide-react';

interface TimerDisplayProps {
  startTime: Timestamp;
  duration: number; // in seconds
}

export function TimerDisplay({ startTime, duration }: TimerDisplayProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    const interval = setInterval(() => {
      const nowInSeconds = Math.floor(Date.now() / 1000);
      const startInSeconds = startTime.seconds;
      const elapsed = nowInSeconds - startInSeconds;
      const remaining = duration - elapsed;
      setTimeLeft(Math.max(0, remaining));

      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, duration]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Card className="mb-4">
      <CardContent className="p-3 flex items-center justify-center">
        <Timer className="h-6 w-6 mr-3 text-primary" />
        <p className="text-2xl font-semibold font-mono tabular-nums">
          Time Left: {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </p>
      </CardContent>
    </Card>
  );
}
