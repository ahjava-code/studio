// src/components/homepage/HowItWorks.tsx
import { Users, Type, Trophy } from 'lucide-react';

const Step = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="flex flex-col items-center text-center p-6 bg-gray-900 border border-gray-800 rounded-lg">
    <div className="mb-4 text-indigo-400">{icon}</div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

export const HowItWorks = () => {
  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-white mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Step
            icon={<Users size={48} />}
            title="1. Join Room"
            description="Enter a public race or create a private room to challenge your friends."
          />
          <Step
            icon={<Type size={48} />}
            title="2. Type the Paragraph"
            description="Race against the clock to type the given text as fast and accurately as possible."
          />
          <Step
            icon={<Trophy size={48} />}
            title="3. See Your WPM & Rank"
            description="Instantly see your Words Per Minute, accuracy, and rank against others."
          />
        </div>
      </div>
    </section>
  );
};