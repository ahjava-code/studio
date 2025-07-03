// src/components/game/TypingInput.tsx
import type { ChangeEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';

import { useRef, useEffect } from 'react';

interface TypingInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  disabled: boolean;
  placeholder?: string;
}

export function TypingInput({ value, onChange, disabled, placeholder = "Start typing here..." }: TypingInputProps) {

  // 1️⃣ Preload the keypress sound
  const audioRef = useRef<HTMLAudioElement>();
  useEffect(() => {
    audioRef.current = new Audio('/sounds/type1.mp3');
    audioRef.current.volume = 0.3; // adjust to taste (0.0 to 1.0)
  }, []);

  return (
    <Textarea
      value={value}
      onChange={onChange}
      disabled={disabled}
      onKeyDown={() => {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => { });
        }
      }}
      placeholder={placeholder}
      className="w-full p-4 text-lg rounded-md shadow-inner focus:ring-2 focus:ring-primary resize-none"
      rows={5}
      autoFocus
      spellCheck="false"
      autoComplete="off"
      autoCorrect="off"
      aria-label="Typing area"
    />
  );
}
