// src/components/game/WpmBar.tsx
import { cn } from '@/lib/utils';

interface WpmBarProps {
  wpm: number;
  playerName: string;
  isCurrentUser: boolean;
  maxWpm?: number; // For scaling the bar height
}

export function WpmBar({ wpm, playerName, isCurrentUser, maxWpm = 150 }: WpmBarProps) {
  const heightPercentage = Math.min(100, (wpm / maxWpm) * 100);

  // Ensure wpm is a positive number for style property
  const validWpm = Math.max(0, wpm);
  const barHeightStyle = { '--bar-height': `${heightPercentage}%` } as React.CSSProperties;


  return (
    <div className={cn("flex flex-col items-center h-full w-16 md:w-24 p-2 rounded-lg shadow-md", isCurrentUser ? "bg-primary/10 border-primary border" : "bg-secondary")}>
      <div className="text-sm font-medium mb-2 truncate w-full text-center" title={playerName}>
        {playerName}
      </div>
      <div className="flex-grow w-full bg-muted rounded-md overflow-hidden relative flex items-end justify-center">
        <div
          className={cn(
            "w-full rounded-t-md transition-all duration-300 ease-out",
            isCurrentUser ? "bg-primary" : "bg-accent/80",
            "animate-bar-up"
          )}
          style={barHeightStyle}
          aria-valuenow={validWpm}
          aria-valuemin={0}
          aria-valuemax={maxWpm}
          role="progressbar"
        >
        </div>
         <span className="absolute bottom-1 text-xs font-semibold text-background mix-blend-difference pointer-events-none">
            {Math.round(validWpm)} WPM
          </span>
      </div>
    </div>
  );
}
