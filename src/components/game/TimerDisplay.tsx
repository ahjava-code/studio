
// src/components/game/TimerDisplay.tsx
"use client";
import type { Timestamp } from 'firebase/firestore';
import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Timer } from 'lucide-react';

interface TimerDisplayProps {
  startTime: Timestamp;
  duration: number; // in seconds
  onTimeUp?: () => void;
}

export function TimerDisplay({ startTime, duration, onTimeUp }: TimerDisplayProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [timeUpCalled, setTimeUpCalled] = useState(false);

  useEffect(() => {
    setTimeLeft(duration); // Initialize timeLeft with the full duration
    setTimeUpCalled(false); // Reset for new game/props change

    // Calculate initial timeLeft based on current props
    const initialStartInSeconds = startTime.seconds;
    const initialNowInSeconds = Math.floor(Date.now() / 1000);
    const initialElapsed = initialNowInSeconds - initialStartInSeconds;
    let currentRemaining = duration - initialElapsed;
    
    // Set initial timeLeft, ensuring it's not negative
    setTimeLeft(Math.max(0, currentRemaining));

    // If time is already up on mount/prop change
    if (currentRemaining <= 0) {
      if (onTimeUp && !timeUpCalled) {
        onTimeUp();
        setTimeUpCalled(true);
      }
      return; // No interval needed if time is already up
    }

    const interval = setInterval(() => {
      const nowInSeconds = Math.floor(Date.now() / 1000);
      // startTime.seconds is from the prop, which is stable during one game
      const elapsed = nowInSeconds - startTime.seconds;
      currentRemaining = duration - elapsed; // Update currentRemaining
      
      const newTimeLeft = Math.max(0, currentRemaining);
      setTimeLeft(newTimeLeft);

      if (newTimeLeft <= 0) {
        if (onTimeUp && !timeUpCalled) { // Check !timeUpCalled before calling
          onTimeUp();
          setTimeUpCalled(true);
        }
        clearInterval(interval); 
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, duration, onTimeUp]); // onTimeUp should be memoized by the parent

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
