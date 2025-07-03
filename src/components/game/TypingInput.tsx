// src/components/game/TypingInput.tsx
import type { ChangeEvent } from 'react';
import { useRef, useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Volume2, VolumeOff } from 'lucide-react';

interface TypingInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  disabled: boolean;
  placeholder?: string;
}

export function TypingInput({
  value,
  onChange,
  disabled,
  placeholder = "Start typing here..."
}: TypingInputProps) {
  // Ref for the keypress audio
  const audioRef = useRef<HTMLAudioElement>();
  // Mute state
  const [muted, setMuted] = useState(false);

  // Create & preload the audio once
  useEffect(() => {
    const audio = new Audio('/sounds/type1.mp3');
    // audio.volume = 0.3;        // adjust volume if needed
    audio.muted = muted;
    audioRef.current = audio;
  }, []);

  // Sync the muted flag whenever it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = muted;
    }
  }, [muted]);

  return (
    <div className="relative">
      <Textarea
        value={value}
        onChange={onChange}
        disabled={disabled}
        onKeyDown={() => {
          // Play click sound on every keypress
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {
              /* silently ignore playback errors */
            });
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

      {/* Mute / unmute toggle */}
      <button
        type="button"
        onClick={() => setMuted(m => !m)}
        className="absolute top-2 right-2 p-1 rounded hover:bg-muted/20"
        aria-label={muted ? "Unmute typing sound" : "Mute typing sound"}
      >
        {muted
          ? <VolumeOff className="h-5 w-5 text-muted-foreground" />
          : <Volume2 className="h-5 w-5 text-foreground" />
        }
      </button>
    </div>
  );
}
