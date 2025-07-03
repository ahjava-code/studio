// src/components/game/ParagraphDisplay.tsx

import { ScrollArea } from '@/components/ui/scroll-area';
import React, { useEffect, useRef } from 'react';

interface ParagraphDisplayProps {
  paragraphText: string;
  typedText: string;
  currentFocusIndex: number; // Where the cursor conceptually is
}

export function ParagraphDisplay({ paragraphText, typedText, currentFocusIndex }: ParagraphDisplayProps) {
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  // The scrollAreaRef is not actively used in the component logic, but we can leave it
  // in case it's needed for future functionality or by the ScrollArea component itself.
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Re-initialize refs array when the source paragraph changes
    charRefs.current = Array(paragraphText.length).fill(null);
  }, [paragraphText]);

  const getCharClass = (charIndex: number) => {
    const baseClasses = 'inline-block min-w-[0.3em] text-center'; // Ensure spans have some width for borders
    const isCurrentFocus = charIndex === currentFocusIndex;
    const isTyped = charIndex < typedText.length;
    const isCorrect = isTyped && typedText[charIndex] === paragraphText[charIndex];

    if (charIndex >= paragraphText.length) {
      return `${baseClasses} text-muted-foreground opacity-50`;
    }

    if (!isTyped) {
      // Not yet typed
      return isCurrentFocus
        ? `${baseClasses} border-b-2 border-primary/50` // Underline the current focus character
        : `${baseClasses} text-foreground`;
    }

    // Typed characters
    if (isCorrect) {
      return `${baseClasses} text-green-600 dark:text-green-400`; // Correctly typed
    } else {
      // Incorrectly typed
      return `${baseClasses} text-destructive border-b-2 border-destructive`; // Red underline for incorrect characters
    }
  };

  useEffect(() => {
    // This effect handles scrolling the current character into view
    if (currentFocusIndex >= 0 && currentFocusIndex < charRefs.current.length) {
      const targetElement = charRefs.current[currentFocusIndex];
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest'
        });
      }
    }
  }, [currentFocusIndex]);

  // We need a counter to track the absolute index of each character
  let globalCharIndex = 0;

  return (
    <ScrollArea ref={scrollAreaRef} className="h-40 md:h-48 w-full rounded-md border p-4 bg-card shadow">
      {/*
        MODIFICATION: Removed 'break-words' to prevent the browser from breaking words
        that we are now grouping manually. 'whitespace-pre-wrap' is kept to respect
        the source text's whitespace and wrapping.
      */}
      <p className="text-lg md:text-xl leading-relaxed whitespace-pre-wrap font-serif">
        {/*
          MODIFICATION: Split by words and whitespace chunks instead of individual characters.
          The regex /_(\s+)_/ splits the string by whitespace and keeps the whitespace as part of the array.
          e.g., "Hello  world" -> ["Hello", "  ", "world"]
        */}
        {paragraphText.split(/(\s+)/).map((chunk, chunkIndex) => {
          // A chunk is either a word or a string of whitespace.
          // We wrap word chunks in an 'inline-flex' container to prevent them from breaking.
          const isWord = !/\s+/.test(chunk);

          return (
            <span key={chunkIndex} className={isWord ? 'inline-flex' : ''}>
              {chunk.split('').map((char) => {
                const currentIndex = globalCharIndex++;
                return (
                  <span
                    key={currentIndex}
                    ref={(el: HTMLSpanElement | null) => {
                      charRefs.current[currentIndex] = el;
                    }}
                    className={getCharClass(currentIndex)}
                  >
                    {/* Render space as '·' only if it's a typed incorrect character */}
                    {char === ' ' && typedText.length > currentIndex && typedText[currentIndex] !== ' '
                      ? '·'
                      : char}
                  </span>
                );
              })}
            </span>
          );
        })}
      </p>
    </ScrollArea>
  );
}