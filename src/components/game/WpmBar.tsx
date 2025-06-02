// src/components/game/WpmBar.tsx
import { cn } from '@/lib/utils';

interface WpmBarProps {
  wpm: number;
  playerName: string;
  isCurrentUser: boolean;
  maxWpm?: number; // For scaling the bar height
}

export function WpmBar({ wpm, playerName, isCurrentUser, maxWpm = 150 }: WpmBarProps) {
  // Ensure wpm is a non-negative, finite number. Default to 0 if undefined, NaN, or Infinity.
  const validWpm = Math.max(0, Number.isFinite(wpm) ? wpm : 0);
  const heightPercentage = Math.min(100, (validWpm / maxWpm) * 100);

  return (
    <div className={cn(
      "flex flex-col items-center h-full w-16 md:w-24 p-2 rounded-lg shadow-md", 
      isCurrentUser ? "bg-primary/10 border-primary border" : "bg-secondary"
    )}>
      <div 
        className={cn(
            "text-sm font-medium mb-2 truncate w-full text-center",
            isCurrentUser ? "text-primary-foreground" : "text-secondary-foreground" // Ensure player name is visible
        )} 
        title={playerName}
      >
        {playerName || "Player"}
      </div>
      <div className="flex-grow w-full bg-muted rounded-md overflow-hidden relative flex items-end justify-center">
        <div
          className={cn(
            "w-full rounded-t-md transition-[height] duration-300 ease-out", 
            isCurrentUser ? "bg-primary" : "bg-accent/80" 
          )}
          style={{ height: `${heightPercentage}%` }} 
          aria-valuenow={Math.round(validWpm)}
          aria-valuemin={0}
          aria-valuemax={maxWpm}
          role="progressbar"
        >
        </div>
         {/* Changed text color for better contrast against bg-muted if bar height is 0 */}
         <span className="absolute bottom-1 text-xs font-semibold text-card-foreground pointer-events-none">
            {Math.round(validWpm)} WPM
          </span>
      </div>
    </div>
  );
}
