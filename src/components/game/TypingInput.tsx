// src/components/game/TypingInput.tsx
import type { ChangeEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface TypingInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  disabled: boolean;
  placeholder?: string;
}

export function TypingInput({ value, onChange, disabled, placeholder = "Start typing here..." }: TypingInputProps) {
  return (
    <Textarea
      value={value}
      onChange={onChange}
      disabled={disabled}
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
