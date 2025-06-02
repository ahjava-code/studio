// src/components/game/GameArea.tsx
import type { ChangeEvent } from 'react';
import type { Player } from '@/types';
import { ParagraphDisplay } from './ParagraphDisplay';
import { TypingInput } from './TypingInput';
import { WpmBar } from './WpmBar';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface GameAreaProps {
  paragraphText: string;
  currentPlayer: Player;
  opponentPlayer: Player | null;
  onTyped: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  isMyTurn: boolean; // Could be useful for turn-based games, here always true while playing
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
          {/* Player 1 WPM Bar (Current User or Opponent) */}
          <WpmBar 
            wpm={currentPlayer.uid === (opponentPlayer?.isHost ? opponentPlayer.uid : currentPlayer.uid) ? currentPlayer.wpm : opponentPlayer?.wpm ?? 0}
            playerName={currentPlayer.uid === (opponentPlayer?.isHost ? opponentPlayer.uid : currentPlayer.uid) ? currentPlayer.name : opponentPlayer?.name ?? "Player 1"}
            isCurrentUser={currentPlayer.uid === (opponentPlayer?.isHost ? opponentPlayer.uid : currentPlayer.uid)}
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

          {/* Player 2 WPM Bar (Opponent or Current User) */}
           <WpmBar 
            wpm={opponentPlayer?.uid === (currentPlayer.isHost ? opponentPlayer.uid : currentPlayer.uid) ? opponentPlayer.wpm : currentPlayer?.wpm ?? 0}
            playerName={opponentPlayer?.uid === (currentPlayer.isHost ? opponentPlayer.uid : currentPlayer.uid) ? opponentPlayer.name : currentPlayer?.name ?? "Player 2"}
            isCurrentUser={opponentPlayer?.uid === (currentPlayer.isHost ? opponentPlayer.uid : currentPlayer.uid)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
