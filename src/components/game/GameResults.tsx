// src/components/game/GameResults.tsx
import { motion } from 'framer-motion';
import type { Room, Player } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Award, UserCircle2, Star, Zap, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameResultsProps {
  room: Room;
  currentUserId: string;
  compact?: boolean;
}

const PlayerResultCard = ({ 
  player, 
  isWinner, 
  isCurrentUser,
  compact
}: { 
  player: Player, 
  isWinner: boolean, 
  isCurrentUser: boolean,
  compact?: boolean
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay: isWinner ? 0.3 : 0.1
      }}
      className={cn(
        "relative overflow-hidden rounded-xl p-0.5",
        isWinner ? "bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 shadow-xl" : "bg-muted/50"
      )}
    >
      <Card className={cn(
        "h-full relative overflow-hidden",
        isWinner ? "bg-gradient-to-br from-background to-muted/50" : "bg-background",
        isCurrentUser && "border-2 border-primary"
      )}>
        {isWinner && (
          <div className="absolute top-0 right-0 p-2">
            <div className="relative">
              <Award className="h-10 w-10 text-yellow-500" />
              <Star className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500 fill-yellow-500 animate-pulse" />
            </div>
          </div>
        )}
        
        <CardHeader className={cn("pb-2", compact ? "p-3" : "p-4")}>
          <div className="flex items-center justify-center gap-3">
            <div className={cn(
              "relative rounded-full p-1",
              isWinner ? "bg-gradient-to-r from-yellow-500 to-amber-500" : "bg-muted"
            )}>
              <UserCircle2 className={cn(
                isWinner ? "text-background" : "text-foreground",
                compact ? "h-8 w-8" : "h-10 w-10"
              )} />
            </div>
            <CardTitle className={cn(
              "font-bold truncate max-w-[120px]",
              compact ? "text-lg" : "text-xl",
              isWinner ? "text-amber-600" : "text-foreground"
            )}>
              {player.name} {isCurrentUser && "(You)"}
            </CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className={cn("space-y-2", compact ? "p-3 pt-0" : "p-4 pt-0")}>
          {isWinner && !compact && (
            <div className="mb-3 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 py-2 rounded-lg border border-amber-400/30">
              <div className="flex items-center justify-center gap-2 text-amber-600 font-bold">
                <Trophy className="h-5 w-5" />
                <span>WINNER</span>
              </div>
            </div>
          )}
          
          <div className={cn(
            "flex items-center justify-center gap-1",
            compact ? "text-lg" : "text-2xl"
          )}>
            <Zap className={cn(
              "text-yellow-500",
              compact ? "h-4 w-4" : "h-5 w-5"
            )} />
            <span className="font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              {player.wpm.toFixed(1)}
            </span>
            <span className="text-muted-foreground text-sm">WPM</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="flex flex-col items-center bg-muted/30 py-2 rounded-lg">
              <span className="text-sm text-muted-foreground">Accuracy</span>
              <div className="flex items-center gap-1 font-semibold text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>{player.accuracy.toFixed(1)}%</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center bg-muted/30 py-2 rounded-lg">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="font-semibold">{player.progress.toFixed(0)}%</span>
            </div>
            
            <div className="flex flex-col items-center bg-muted/30 py-2 rounded-lg">
              <span className="text-sm text-muted-foreground">Errors</span>
              <div className="flex items-center gap-1 font-semibold text-destructive">
                <XCircle className="h-4 w-4" />
                <span>{player.errors}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center bg-muted/30 py-2 rounded-lg">
              <span className="text-sm text-muted-foreground">Score</span>
              <span className="font-semibold">
                {(player.wpm * (player.accuracy / 100)).toFixed(0)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function GameResults({ room, currentUserId, compact }: GameResultsProps) {
  const { player1, player2, winner } = room;

  let resultMessage = "Game Over!";
  if (winner === 'draw') {
    resultMessage = "It's a Draw!";
  } else if (winner === 'player1' && player1) {
    resultMessage = `${player1.name} Wins!`;
  } else if (winner === 'player2' && player2) {
    resultMessage = `${player2.name} Wins!`;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className={cn(
        "overflow-hidden border-0 bg-gradient-to-br from-background via-purple-50 to-background dark:from-muted/30 dark:via-purple-900/10 dark:to-background",
        compact ? "py-4" : "py-6"
      )}>
        <CardHeader className="relative z-10 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mx-auto mb-4 flex items-center justify-center"
          >
            <div className="relative">
              <Trophy className={cn(
                "text-amber-500",
                compact ? "h-10 w-10" : "h-16 w-16"
              )} />
              <motion.div
                animate={{ 
                  rotate: [0, 15, 0, -15, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="absolute -top-1 -right-1"
              >
                <Star className={cn(
                  "text-yellow-400 fill-yellow-400",
                  compact ? "h-4 w-4" : "h-6 w-6"
                )} />
              </motion.div>
            </div>
          </motion.div>
          
          <CardTitle className={cn(
            "font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent",
            compact ? "text-2xl" : "text-4xl"
          )}>
            {resultMessage}
          </CardTitle>
          
          {!compact && (
            <p className="text-muted-foreground mt-2">
              Here are the final scores from the typing challenge
            </p>
          )}
        </CardHeader>
        
        <CardContent className={cn(
          "relative z-10",
          compact ? "px-2 py-0" : "px-4 py-2"
        )}>
          <div className={cn(
            "flex flex-col md:flex-row gap-4 justify-center",
            compact ? "mt-0" : "mt-4"
          )}>
            {player1 && (
              <PlayerResultCard 
                player={player1} 
                isWinner={winner === 'player1'} 
                isCurrentUser={player1.uid === currentUserId}
                compact={compact}
              />
            )}
            
            {player2 && (
              <PlayerResultCard 
                player={player2} 
                isWinner={winner === 'player2'} 
                isCurrentUser={player2.uid === currentUserId}
                compact={compact}
              />
            )}
          </div>
          
          {winner === 'draw' && player1 && player2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 text-center py-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10"
            >
              <p className="font-semibold text-primary flex items-center justify-center gap-2">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                Incredibly close match! Both players performed exceptionally well
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              </p>
            </motion.div>
          )}
        </CardContent>
        
        {/* Decorative elements */}
        {!compact && (
          <>
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-r from-amber-500/10 to-transparent rounded-full blur-xl" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-r from-purple-500/10 to-transparent rounded-full blur-xl" />
            <div className="absolute top-1/4 right-10 w-8 h-8 bg-yellow-400/20 rounded-full blur-lg" />
            <div className="absolute bottom-1/3 left-12 w-6 h-6 bg-purple-400/30 rounded-full blur-lg" />
          </>
        )}
      </Card>
    </motion.div>
  );
}