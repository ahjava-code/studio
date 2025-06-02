// src/components/game/CountdownDisplay.tsx
"use client";
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

export function CountdownDisplay() {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count <= 0) return;

    const timer = setInterval(() => {
      setCount(prevCount => prevCount - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [count]);

  return (
    <Card className="flex items-center justify-center py-10 bg-primary/10 border-primary shadow-lg">
      <CardContent className="text-center">
        {count > 0 ? (
          <>
            <p className="text-xl text-primary font-semibold mb-2">Game starting in...</p>
            <p className="text-8xl font-bold text-primary animate-ping animation-delay-1000">{count}</p>
          </>
        ) : (
          <p className="text-8xl font-bold text-accent animate-pulse">GO!</p>
        )}
      </CardContent>
    </Card>
  );
}
