// src/components/game/WpmBar.tsx
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface WpmBarProps {
  wpm: number;
  playerName: string;
  isCurrentUser: boolean;
  isActive: boolean;
  maxWpm?: number;
}

export function WpmBar({
  wpm,
  playerName,
  isCurrentUser,
  isActive,
  maxWpm = 150,
}: WpmBarProps) {
  const validWpm = Math.max(0, Number.isFinite(wpm) ? wpm : 0);
  const heightPercentage = Math.min(100, (validWpm / maxWpm) * 100);
  const barHeight = 'h-40'; // Increased height for better visibility

  return (
    <div className={cn(
      "flex flex-col items-center w-20 md:w-28 p-3 rounded-xl transition-all duration-300",
      isCurrentUser ? "bg-primary/10" : "bg-secondary/30",
      isActive ? "ring-2 ring-offset-2" : "",
      isCurrentUser && isActive ? "ring-primary" : "ring-muted-foreground"
    )}>
      {/* Player name with active indicator */}
      <div className="flex items-center mb-3">
        <div className={cn(
          "w-2 h-2 rounded-full mr-2",
          isActive ? "animate-pulse bg-green-500" : "bg-muted-foreground"
        )} />
        <div 
          className={cn(
            'text-sm font-semibold truncate max-w-[80px]',
            isCurrentUser ? 'text-primary' : 'text-foreground'
          )}
          title={playerName}
        >
          {isCurrentUser ? "You" : playerName}
        </div>
      </div>

      {/* Bar container */}
      <div className={cn(
        "relative w-full", barHeight, 
        "bg-gradient-to-b from-muted/50 to-muted/20 rounded-lg overflow-hidden",
        "border border-muted-foreground/20 flex items-end"
      )}>
        {/* Animated fill bar */}
        <motion.div
          className={cn(
            'absolute bottom-0 left-0 w-full rounded-t-lg',
            isCurrentUser 
              ? 'bg-gradient-to-t from-primary to-primary/70' 
              : 'bg-gradient-to-t from-foreground/70 to-foreground/50'
          )}
          initial={{ height: "0%" }}
          animate={{ height: `${heightPercentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        
        {/* WPM label inside bar */}
        {heightPercentage > 20 && (
          <motion.span 
            className="absolute top-2 left-0 w-full text-center text-xs font-bold text-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {Math.round(validWpm)} WPM
          </motion.span>
        )}
        
        {/* WPM label outside bar */}
        {heightPercentage <= 20 && (
          <span className="absolute -bottom-6 left-0 w-full text-center text-xs font-semibold">
            {Math.round(validWpm)} WPM
          </span>
        )}
      </div>

      {/* Skill level indicator */}
      <div className="mt-4 text-center">
        <div className="text-xs text-muted-foreground">Speed</div>
        <div className="text-[10px] font-semibold uppercase mt-1">
          {validWpm < 40 ? "Beginner" : 
           validWpm < 60 ? "Intermediate" : 
           validWpm < 100 ? "Advanced" : "Pro"}
        </div>
      </div>
    </div>
  );
}