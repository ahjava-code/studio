// src/app/typing-test/page.tsx
import { TypingTestClient } from '@/components/typing-test/TypingTestClient';

export default function TypingTestPage() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white">Typing Test</h1>
        <p className="text-lg text-gray-400 mt-2">
          Check your Words Per Minute (WPM) and accuracy.
        </p>
      </div>
      <TypingTestClient />
    </div>
  );
}