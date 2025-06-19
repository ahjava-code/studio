// src/components/game/WpmBar.tsx
import { cn } from '@/lib/utils';

interface WpmBarProps {
  wpm: number;
  playerName: string;
  isCurrentUser: boolean;
  maxWpm?: number; // For scaling the bar height
}

export function WpmBar({
  wpm,
  playerName,
  isCurrentUser,
  maxWpm = 150,
}: WpmBarProps) {
  // Ensure wpm is a valid number
  const validWpm = Math.max(0, Number.isFinite(wpm) ? wpm : 0);
  const heightPercentage = Math.min(100, (validWpm / maxWpm) * 100);

  // Define a fixed height for the bar container (e.g., 8rem)
  const barContainerHeight = 'h-32'; // Tailwind: 8rem = h-32

  return (
    <div className="flex flex-col items-center w-16 md:w-24 p-2 rounded-lg shadow-md">
      {/* Display player name */}
      <div
        className={cn(
          'text-sm font-medium mb-2 truncate w-full text-center',
          isCurrentUser ? 'text-primary-foreground' : 'text-secondary-foreground'
        )}
        title={playerName}
      >
        {playerName || 'Player'}
      </div>

      {/* Bar container with fixed height */}
      <div
        className={cn(
          `relative w-full ${barContainerHeight} bg-gray-200 rounded-md overflow-hidden`,
          isCurrentUser ? 'border-primary border' : ''
        )}
      >
        {/* Filled portion */}
        <div
          className={cn(
            'absolute bottom-0 left-0 w-full rounded-t-md transition-[height] duration-300 ease-out',
            isCurrentUser ? 'bg-primary' : 'bg-accent/80'
          )}
          style={{ height: `${heightPercentage}%` }}
          role="progressbar"
          aria-valuenow={Math.round(validWpm)}
          aria-valuemin={0}
          aria-valuemax={maxWpm}
        />

        {/* WPM Label */}
        <span className="absolute bottom-1 left-1 text-xs font-semibold text-gray-800">
          {Math.round(validWpm)} WPM
        </span>
      </div>
    </div>
  );
}
