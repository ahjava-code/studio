// src/components/game/GameResults.tsx
import type { Room, Player } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Award, UserCircle2 } from 'lucide-react';

interface GameResultsProps {
  room: Room;
  currentUserId: string;
}

const PlayerResultCard = ({ player, isWinner, isCurrentUser }: { player: Player, isWinner: boolean, isCurrentUser: boolean }) => {
  return (
    <Card className={`p-4 text-center ${isWinner ? 'border-accent shadow-lg' : ''} ${isCurrentUser ? 'bg-primary/5' : ''}`}>
      <CardHeader className="p-2">
        <UserCircle2 className={`mx-auto h-12 w-12 mb-2 ${isWinner ? 'text-accent' : 'text-muted-foreground'}`} />
        <CardTitle className="text-xl">{player.name} {isCurrentUser && "(You)"}</CardTitle>
        {isWinner && <CardDescription className="text-accent font-semibold">Winner!</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-1 p-2">
        <p className="text-2xl font-bold">{player.wpm} <span className="text-sm font-normal">WPM</span></p>
        <p>Accuracy: {player.accuracy.toFixed(1)}%</p>
        <p>Progress: {player.progress.toFixed(0)}%</p>
        <p>Errors: {player.errors}</p>
      </CardContent>
    </Card>
  );
}

export function GameResults({ room, currentUserId }: GameResultsProps) {
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
    <Card className="mt-6 text-center">
      <CardHeader>
        <Trophy className="mx-auto h-16 w-16 text-accent mb-4" />
        <CardTitle className="text-4xl font-headline">{resultMessage}</CardTitle>
        <CardDescription>Here are the final scores:</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-around">
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
        {!player1 && !player2 && <p>No player data available for results.</p>}
      </CardContent>
    </Card>
  );
}
