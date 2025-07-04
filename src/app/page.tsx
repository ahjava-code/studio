// src/app/page.tsx
import { HeroSection } from '@/components/home/HeroSection';
import { HowItWorks } from '@/components/home/HowItWorks';
import { SocialProof } from '@/components/home/SocialProof';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      {/* The main container that centers content and sets max-width */}
      <div className="container mx-auto">
        <HeroSection />
        <SocialProof />
        <HowItWorks />
      </div>
    </main>
  );
}