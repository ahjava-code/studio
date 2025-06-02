// src/components/game/GameArea.tsx
import type { ChangeEvent } from 'react';
import type { Player } from '@/types';
import { ParagraphDisplay } from './ParagraphDisplay';
import { TypingInput } from './TypingInput';
import { WpmBar } from './WpmBar';
import { Card, CardContent } from '@/components/ui/card';

interface GameAreaProps {
  paragraphText: string;
  currentPlayer: Player; // The user on this client
  opponentPlayer: Player | null; // The other user
  onTyped: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  isMyTurn: boolean;
  disabled: boolean;
}

export function GameArea({
  paragraphText,
  currentPlayer,
  opponentPlayer,
  onTyped,
  isMyTurn,
  disabled,
}: GameAreaProps) {
  return (
    <Card className="mt-4">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-stretch min-h-[300px] md:min-h-[400px]">
          {/* Current User's WPM Bar */}
          <WpmBar
            wpm={currentPlayer.wpm}
            playerName={currentPlayer.name}
            isCurrentUser={true}
          />

          {/* Typing Area */}
          <div className="flex-grow flex flex-col space-y-4 w-full md:w-3/5">
            <ParagraphDisplay
              paragraphText={paragraphText}
              typedText={currentPlayer.typedText}
              currentFocusIndex={currentPlayer.typedText.length}
            />
            <TypingInput
              value={currentPlayer.typedText}
              onChange={onTyped}
              disabled={disabled || !isMyTurn}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Accuracy: {currentPlayer.accuracy.toFixed(0)}%</span>
              <span>Errors: {currentPlayer.errors}</span>
              <span>Progress: {currentPlayer.progress.toFixed(0)}%</span>
            </div>
          </div>

          {/* Opponent's WPM Bar */}
          {opponentPlayer ? (
            <WpmBar
              wpm={opponentPlayer.wpm}
              playerName={opponentPlayer.name}
              isCurrentUser={false}
            />
          ) : (
            // Placeholder for opponent if not connected
            <div className="flex flex-col items-center h-full w-16 md:w-24 p-2 rounded-lg shadow-md bg-secondary">
              <div className="text-sm font-medium mb-2 truncate w-full text-center" title="Opponent">
                Opponent
              </div>
              <div className="flex-grow w-full bg-muted rounded-md overflow-hidden relative flex items-end justify-center">
                 <span className="absolute bottom-1 text-xs font-semibold text-white mix-blend-difference pointer-events-none">
                    0 WPM
                  </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
