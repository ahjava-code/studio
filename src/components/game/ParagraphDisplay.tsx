// src/components/game/ParagraphDisplay.tsx
import { ScrollArea } from '@/components/ui/scroll-area';

interface ParagraphDisplayProps {
  paragraphText: string;
  typedText: string;
  currentFocusIndex: number; // Where the cursor conceptually is
}

export function ParagraphDisplay({ paragraphText, typedText, currentFocusIndex }: ParagraphDisplayProps) {
  
  const getCharClass = (charIndex: number) => {
    if (charIndex >= paragraphText.length) return 'text-muted-foreground opacity-50'; // Beyond text length
    if (charIndex >= typedText.length) {
        // Not yet typed
        return charIndex === currentFocusIndex ? 'bg-primary/20 rounded px-px -mx-px' : 'text-foreground';
    }
    // Typed characters
    if (typedText[charIndex] === paragraphText[charIndex]) {
      return 'text-green-600 dark:text-green-400'; // Correctly typed
    }
    return 'text-destructive bg-destructive/20 rounded px-px -mx-px'; // Incorrectly typed
  };

  return (
    <ScrollArea className="h-40 md:h-48 w-full rounded-md border p-4 bg-card shadow">
      <p className="text-lg md:text-xl leading-relaxed whitespace-pre-wrap font-serif select-none">
        {paragraphText.split('').map((char, index) => (
          <span key={index} className={getCharClass(index)}>
            {char === ' ' && typedText[index] !== paragraphText[index] && typedText.length > index ? '·' : char}
          </span>
        ))}
      </p>
    </ScrollArea>
  );
}
