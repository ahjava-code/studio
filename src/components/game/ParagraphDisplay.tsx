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
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

  return (
    <ScrollArea ref={scrollAreaRef} className="h-40 md:h-48 w-full rounded-md border p-4 bg-card shadow">
      <p className="text-lg md:text-xl leading-relaxed whitespace-pre-wrap font-serif break-words">
        {paragraphText.split('').map((char, index) => (
          <span
            key={index}
            ref={(el: HTMLSpanElement | null) => {
              // Re-initialize or update the ref array
              if (!charRefs.current) { // Defensive check, though useEffect should handle this
                charRefs.current = [];
              }
              charRefs.current[index] = el;
            }}
            className={getCharClass(index)}
          >
            {/* Render space as '·' only if it's a typed incorrect character */}
            {char === ' ' && typedText.length > index && typedText[index] !== paragraphText[index] ? '·' : char}
          </span>
        ))}
      </p>
    </ScrollArea>
  );
}