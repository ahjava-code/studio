// src/components/game/CountdownDisplay.tsx
"use client";
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

export function CountdownDisplay() {
  const [count, setCount] = useState(3);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (count <= 0) {
      const timer = setTimeout(() => setIsVisible(false), 800);
      return () => clearTimeout(timer);
    }

    const timer = setInterval(() => {
      setCount(prevCount => prevCount - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [count]);

  // Don't render if component is hidden
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-md border-0 bg-transparent shadow-none">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            className="text-center"
          >
            <p className="mb-6 text-2xl font-bold text-white drop-shadow-lg">
              {count > 0 ? "Get ready!" : "GO!"}
            </p>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={count}
                initial={{ scale: 0.5, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 1.5, opacity: 0, rotate: count === 0 ? 0 : 10 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 15,
                  duration: count === 0 ? 0.3 : 0.5
                }}
                className={`
                  ${count > 0 ? "text-9xl font-bold text-white" : "text-8xl font-extrabold text-green-400"}
                  drop-shadow-lg
                `}
              >
                {count > 0 ? count : "GO!"}
              </motion.div>
            </AnimatePresence>

            {count > 0 && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, ease: "linear" }}
                className="mt-8 h-1.5 bg-white rounded-full overflow-hidden"
              />
            )}
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}