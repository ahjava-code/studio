// src/components/homepage/HeroSection.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui2/button';
import { ArrowRight } from 'lucide-react';

export const HeroSection = () => {
  const router = useRouter();

  // The only goal of this button is to get the user to the lobby page.
  const navigateToLobby = () => {
    router.push('/play');
  };

  return (
    <section className="text-center py-20 md:py-32">
      <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
        Challenge Friends to a Live Typing Race
      </h1>
      <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
        Test your WPM against real players in real-time. Join a room or create your own.
      </p>
      <div className="flex justify-center">
        {/* A single, powerful Call to Action button */}
        <Button onClick={navigateToLobby} variant='primary' className="text-lg px-8 py-4">
          Play Now
        </Button>
      </div>
    </section>
  );
};