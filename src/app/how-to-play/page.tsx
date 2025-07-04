// src/app/how-to-play/page.tsx
import { ListChecks, Scale, Calculator } from 'lucide-react';
import Link from 'next/link';

// A helper component to structure the FAQ section nicely
const QuestionAnswer = ({ question, children }: { question: string, children: React.ReactNode }) => (
  <div className="py-4">
    <h3 className="text-xl font-semibold text-white mb-2">{question}</h3>
    <div className="space-y-2 text-gray-300 leading-relaxed">
      {children}
    </div>
  </div>
);

export default function HowToPlayPage() {
  return (
    <div className="container mx-auto max-w-3xl py-12 px-4">
      <header className="text-center mb-16">
        <h1 className="text-5xl font-bold text-white">Game Guide</h1>
        <p className="text-lg text-gray-400 mt-2">Everything you need to know to become a Type Duel champion.</p>
      </header>

      <main className="space-y-12">
        {/* Getting Started Section */}
        <section>
          <h2 className="flex items-center text-3xl font-bold text-indigo-400 mb-4">
            <ListChecks className="mr-3 h-7 w-7" />
            Getting Started
          </h2>
          <ol className="list-decimal list-inside space-y-4 text-gray-300 leading-relaxed">
            <li>
              <strong>Create or Join a Room:</strong> Head over to the <Link href="/play" className="text-indigo-400 hover:underline">Play</Link> page. You can either create a new private room to share with friends or join a public race to be matched with other players.
            </li>
            <li>
              <strong>Wait for the Countdown:</strong> Once you're in a room, the game host can start the match. A countdown will appear on screen to give everyone a moment to prepare.
            </li>
            <li>
              <strong>Type the Text:</strong> As soon as the countdown hits zero, start typing the paragraph shown on screen. Your progress, speed, and position will be updated in real-time. Correctly typed characters will be green, while mistakes will be highlighted in red.
            </li>
            <li>
              <strong>Finish and See Your Results:</strong> The race ends when you've typed the entire paragraph. Your final Words Per Minute (WPM), accuracy, and ranking will be displayed.
            </li>
          </ol>
        </section>

        {/* Stats & Calculations Section */}
        <section>
          <h2 className="flex items-center text-3xl font-bold text-indigo-400 mb-4">
            <Calculator className="mr-3 h-7 w-7" />
            Understanding the Stats
          </h2>
          <div className="divide-y divide-gray-800">
            <QuestionAnswer question="How is WPM (Words Per Minute) calculated?">
              <p>We use the standard formula for calculating typing speed. A "word" is defined as 5 characters (including spaces).</p>
              <p>The formula is: <code>(All Characters Typed / 5) / Time in Minutes</code>.</p>
              <p>This method ensures that typing longer words is fairly rewarded compared to shorter ones.</p>
            </QuestionAnswer>

            <QuestionAnswer question="How is Accuracy calculated?">
              <p>Accuracy is a simple percentage of how many characters you typed correctly out of the total characters you typed.</p>
              <p>The formula is: <code>(Correct Characters / Total Characters Typed) * 100%</code>.</p>
              <p>Note that backspacing to fix errors will improve your accuracy, but it will take more time and lower your overall WPM.</p>
            </QuestionAnswer>
            
            <QuestionAnswer question="Do I have to fix my mistakes?">
              <p>No, you are not required to backspace and fix errors to proceed. You can continue typing, but each incorrect character will remain highlighted in red and will lower your final accuracy score.</p>
            </QuestionAnswer>
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center pt-8">
            <p className="text-lg text-white font-semibold mb-4">
                Ready to put your skills to the test?
            </p>
            <Link href="/play">
              <button className="px-8 py-3 font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500">
                  Find a Race
              </button>
            </Link>
         </section>
      </main>
    </div>
  );
}