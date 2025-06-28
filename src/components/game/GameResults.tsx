// src/components/game/GameResults.tsx
import { motion } from 'framer-motion';
import type { Room, Player } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Award, UserCircle2, Star, Zap, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameResultsProps {
  room: Room;
  currentUserId: string;
  compact?: boolean; // Keep compact for potential future use, but the main design will be more compact.
}

const PlayerResultCard = ({
  player,
  isWinner,
  isCurrentUser,
}: {
  player: Player,
  isWinner: boolean,
  isCurrentUser: boolean,
}) => {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0, y: 15 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
        delay: isWinner ? 0.2 : 0.05
      }}
      className={cn(
        "relative rounded-xl p-0.5",
        isWinner
          ? "bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 shadow-lg shadow-yellow-500/30"
          : "bg-gradient-to-br from-muted/30 to-muted/50"
      )}
    >
      <Card className={cn(
        "relative overflow-hidden",
        isWinner
          ? "bg-gradient-to-br from-background/95 to-background/80 border-transparent"
          : "bg-background border-muted/30",
        isCurrentUser && "border-2 border-primary shadow-sm"
      )}>
        {isWinner && (
          <div className="absolute top-2 right-2 p-1.5">
            <div className="relative">
              <Award className="h-7 w-7 text-yellow-500" />
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 0.9, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                className="absolute -top-1 -right-1"
              >
                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
              </motion.div>
            </div>
          </div>
        )}

        <CardHeader className="pb-1.5 px-3.5 py-2.5">
          <div className="flex items-center justify-center gap-2.5">
            <div className={cn(
              "relative rounded-full p-0.5",
              isWinner ? "bg-gradient-to-br from-yellow-500 to-amber-500" : "bg-muted"
            )}>
              <UserCircle2 className={cn(
                isWinner ? "text-background" : "text-foreground",
                "h-7 w-7"
              )} />
            </div>
            <CardTitle className={cn(
              "font-bold truncate max-w-[100px]",
              "text-lg",
              isWinner ? "text-amber-600 dark:text-amber-400" : "text-foreground dark:text-primary-foreground"
            )}>
              {player.name} {isCurrentUser && <span className="text-xs text-muted-foreground">(You)</span>}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="space-y-2 px-3.5 py-2.5">
          {isWinner && (
            <div className="mb-3 bg-gradient-to-br from-yellow-500/15 via-amber-500/15 to-orange-500/15 py-1.5 rounded-lg border border-yellow-500/20">
              <div className="flex items-center justify-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold">
                <Trophy className="h-4 w-4" />
                <span>Winner</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-1">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            >
              <Zap className="text-yellow-500 h-5 w-5" />
            </motion.div>
            <span className="font-extrabold text-2xl bg-gradient-to-br from-primary via-purple-600 to-yellow-500 bg-clip-text text-transparent">
              {player.wpm.toFixed(1)}
            </span>
            <span className="text-muted-foreground text-xs -mt-1.5">WPM</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mt-3">
            <div className="flex flex-col items-center bg-muted/15 py-1.5 rounded-md border border-muted/25">
              <span className="text-xs text-muted-foreground">Accuracy</span>
              <div className="flex items-center gap-0.5 font-bold text-green-600 dark:text-green-400">
                <CheckCircle className="h-3 w-3" />
                <span className="text-base">{player.accuracy.toFixed(1)}%</span>
              </div>
            </div>

            <div className="flex flex-col items-center bg-muted/15 py-1.5 rounded-md border border-muted/25">
              <span className="text-xs text-muted-foreground">Progress</span>
              <span className="font-bold text-base">{player.progress.toFixed(0)}%</span>
            </div>

            <div className="flex flex-col items-center bg-muted/15 py-1.5 rounded-md border border-muted/25">
              <span className="text-xs text-muted-foreground">Errors</span>
              <div className="flex items-center gap-0.5 font-bold text-red-600 dark:text-red-400">
                <XCircle className="h-3 w-3" />
                <span className="text-base">{player.errors}</span>
              </div>
            </div>

            <div className="flex flex-col items-center bg-muted/15 py-1.5 rounded-md border border-muted/25">
              <span className="text-xs text-muted-foreground">Score</span>
              <span className="font-bold text-base">
                {(player.wpm * (player.accuracy / 100)).toFixed(0)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function GameResults({ room, currentUserId }: GameResultsProps) {
  const { player1, player2, winner } = room;

  let resultMessage = "Game Over!";
  let subMessage = "Here are the results!";
  let trophyColor = "text-neutral-400"; // Default/Neutral

  if (winner === 'draw') {
    resultMessage = "It's a Draw!";
    subMessage = "An incredibly close match!";
    trophyColor = "text-blue-500";
  } else if (winner === 'player1' && player1) {
    resultMessage = `${player1.name} Wins!`;
    subMessage = `${player1.name} took the lead!`;
    trophyColor = "text-yellow-500";
  } else if (winner === 'player2' && player2) {
    resultMessage = `${player2.name} Wins!`;
    subMessage = `${player2.name} emerged victorious!`;
    trophyColor = "text-green-500";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-3xl mx-auto"
    >
      <Card className="overflow-hidden relative border-0 shadow-xl px-4 py-5 bg-gradient-to-br from-background via-muted/5 to-background">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-yellow-400/10 rounded-full blur-3xl opacity-40" />
        <div className="absolute top-1/4 right-1/4 w-12 h-12 bg-purple-500/10 rounded-full blur-2xl opacity-30" />


        <CardHeader className="text-center mb-5 pt-3 pb-0">
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 80, damping: 12 }}
            className="mx-auto mb-3 flex items-center justify-center"
          >
            <div className="relative">
              <Trophy className={cn(trophyColor, "h-14 w-14")} />
              <motion.div
                animate={{
                  rotate: [0, 180, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "linear"
                }}
                className="absolute -top-1 -right-1"
              >
                <Star className="text-yellow-400 fill-yellow-400" />
              </motion.div>
            </div>
          </motion.div>

          <CardTitle className="font-extrabold tracking-tight text-4xl">
            {resultMessage}
          </CardTitle>
          <p className="text-muted-foreground mt-1.5 text-base">
            {subMessage}
          </p>
        </CardHeader>

        <CardContent className="pt-0 pb-3">
          <div className="flex flex-col md:flex-row gap-5 justify-center items-center">
            {player1 && (
              <PlayerResultCard
                player={player1}
                isWinner={winner === 'player1'}
                isCurrentUser={player1.uid === currentUserId}
              />
            )}

            {player2 && (
              <PlayerResultCard
                player={player2}
                isWinner={winner === 'player2'}
                isCurrentUser={player2.uid === currentUserId}
              />
            )}
          </div>

          {winner === 'draw' && player1 && player2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-5 text-center py-3 rounded-lg bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-blue-500/10 border border-blue-500/20 backdrop-blur-sm"
            >
              <p className="font-semibold text-primary flex items-center justify-center gap-1 text-sm">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                An epic battle! Both contenders showcased remarkable skill.
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}