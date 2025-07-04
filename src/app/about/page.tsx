// src/app/about/page.tsx
import { Code, Heart, Rocket } from 'lucide-react';
import Link from 'next/link';

// A small component for displaying tech stack items
const TechPill = ({ name }: { name: string }) => (
  <div className="flex items-center justify-center p-4 bg-gray-800 border border-gray-700 rounded-lg text-center text-gray-300">
    {name}
  </div>
);

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-3xl py-12 px-4">
      <header className="text-center mb-16">
        <h1 className="text-5xl font-bold text-white">Behind the Pixels</h1>
        <p className="text-lg text-gray-400 mt-2">The story of Type Duel.</p>
      </header>

      <main className="space-y-12">
        {/* Our Story Section */}
        <section>
          <h2 className="flex items-center text-3xl font-bold text-indigo-400 mb-4">
            <Heart className="mr-3 h-7 w-7" />
            Our Story
          </h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>
              Type Duel started as a passion project by a solo developer who loved two things: clean code and the thrill of competition. Frustrated with bland, ad-filled typing tests, the goal was simple: create a beautiful, fast, and fun platform where people could genuinely enjoy improving their typing skills.
            </p>
            <p>
              What began as a weekend experiment quickly grew into a fully-featured application, driven by a desire to build the best real-time typing experience on the web.
            </p>
          </div>
        </section>

        {/* Our Mission Section */}
        <section>
          <h2 className="flex items-center text-3xl font-bold text-indigo-400 mb-4">
            <Rocket className="mr-3 h-7 w-7" />
            Our Mission
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Our mission is to make typing practice engaging, not a chore. We believe that friendly competition is one of the best motivators. We're committed to providing a seamless, open-source, and community-driven platform for typists of all levels, from beginners learning the ropes to seasoned veterans chasing new records.
          </p>
        </section>

        {/* Built With Section */}
        <section>
          <h2 className="flex items-center text-3xl font-bold text-indigo-400 mb-4">
            <Code className="mr-3 h-7 w-7" />
            Built With
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <TechPill name="Next.js" />
            <TechPill name="React" />
            <TechPill name="TypeScript" />
            <TechPill name="Tailwind CSS" />
            <TechPill name="Socket.IO" />
            <TechPill name="Vercel" />
          </div>
        </section>

        {/* Get in Touch Section */}
         <section className="text-center pt-8">
            <p className="text-gray-400">
                Have feedback or want to contribute?
            </p>
            <Link href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline font-semibold text-lg">
                Check out the project on GitHub
            </Link>
         </section>
      </main>
    </div>
  );
}