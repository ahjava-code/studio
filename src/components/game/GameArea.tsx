// src/components/game/GameArea.tsx
import type { ChangeEvent } from 'react';
import type { Player } from '@/types';
import { ParagraphDisplay } from './ParagraphDisplay';
import { TypingInput } from './TypingInput';
import { WpmBar } from './WpmBar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface GameAreaProps {
  paragraphText: string;
  currentPlayer: Player;
  opponentPlayer: Player | null;
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
    <Card className="mt-4 w-full max-w-6xl mx-auto shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Typing Challenge</h2>
          <div className="flex items-center gap-2">
            <Badge variant={isMyTurn ? 'default' : 'secondary'}>
              {isMyTurn ? 'Your Turn' : "Opponent's Turn"}
            </Badge>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm">
                    Type the text as fast as you can. The player with the highest WPM wins!
                    Mistakes reduce your accuracy score.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* 
          We no longer pass `indicatorClassName`. 
          Instead we use Tailwind's child selector [&>div] to style the inner bar when complete.
        */}
        <Progress
          value={currentPlayer.progress}
          className={
            `mt-2 h-2 transition-all duration-300 ` +
            (currentPlayer.progress === 100
              ? '[&>div]:bg-green-500'
              : '')
          }
        />
      </CardHeader>

      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-6 items-stretch min-h-[320px] md:min-h-[400px]">
          {/* Current User's WPM Bar */}
          <WpmBar
            wpm={currentPlayer.wpm}
            playerName={currentPlayer.name}
            isCurrentUser={true}
            isActive={isMyTurn}
          />

          {/* Main Typing Area */}
          <div className="flex-grow flex flex-col space-y-4 w-full md:w-2/3">
            <ParagraphDisplay
              paragraphText={paragraphText}
              typedText={currentPlayer.typedText}
              currentFocusIndex={currentPlayer.typedText.length}
            />

            {!isMyTurn && opponentPlayer && (
              <div className="text-center text-sm text-muted-foreground animate-pulse">
                Waiting for {opponentPlayer.name} to finish...
              </div>
            )}

            <TypingInput
              value={currentPlayer.typedText}
              onChange={onTyped}
              disabled={disabled || !isMyTurn}
              placeholder={disabled ? 'Game starting soon...' : 'Start typing here...'}
            />

            <div className="grid grid-cols-3 gap-4 text-center">
              <StatCard
                label="Accuracy"
                value={`${currentPlayer.accuracy.toFixed(0)}%`}
                isGood={currentPlayer.accuracy > 85}
              />
              <StatCard
                label="Errors"
                value={currentPlayer.errors.toString()}
                isGood={currentPlayer.errors === 0}
              />
              <StatCard
                label="Progress"
                value={`${currentPlayer.progress.toFixed(0)}%`}
                isGood={currentPlayer.progress === 100}
              />
            </div>
          </div>

          {/* Opponent's WPM Bar */}
          {opponentPlayer ? (
            <WpmBar
              wpm={opponentPlayer.wpm}
              playerName={opponentPlayer.name}
              isCurrentUser={false}
              isActive={!isMyTurn}
            />
          ) : (
            <div className="flex flex-col items-center h-full w-20 md:w-28 p-3 rounded-xl bg-muted/50 border border-dashed">
              <div className="text-sm font-medium mb-3 truncate text-center text-muted-foreground">
                Waiting for opponent...
              </div>
              <div className="flex-grow w-full bg-muted/80 rounded-lg overflow-hidden relative flex items-end justify-center">
                <Skeleton className="w-full bg-muted-foreground/20" style={{ height: '10%' }} />
                <span className="absolute bottom-2 text-xs font-semibold text-muted-foreground">
                  0 WPM
                </span>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">Connecting...</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Helper component for stats display
function StatCard({
  label,
  value,
  isGood,
}: {
  label: string;
  value: string;
  isGood: boolean;
}) {
  return (
    <div className="bg-muted/50 p-3 rounded-lg border">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className={`text-lg font-bold ${isGood ? 'text-green-500' : 'text-foreground'}`}>
        {value}
      </div>
    </div>
  );
}
