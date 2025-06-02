// src/components/game/PlayerInfo.tsx
import type { Player } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, CheckCircle2, XCircle } from 'lucide-react';

interface PlayerInfoProps {
  player1: Player | null;
  player2: Player | null;
  currentUserId: string | undefined;
}

const PlayerCard = ({ player, title, isCurrentUser }: { player: Player | null, title: string, isCurrentUser: boolean }) => {
  return (
    <Card className={`flex-1 ${isCurrentUser ? 'border-primary shadow-lg' : 'border-border'}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <User className="mr-2 h-5 w-5 text-muted-foreground" />
          {player?.name || title} {isCurrentUser && "(You)"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {player ? (
          <div className="flex items-center text-green-600">
            <CheckCircle2 className="mr-2 h-5 w-5" />
            Connected
            {player.isReady && <span className="ml-1 text-xs">(Ready)</span>}
          </div>
        ) : (
          <div className="flex items-center text-destructive">
            <XCircle className="mr-2 h-5 w-5" />
            Not Connected
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export function PlayerInfo({ player1, player2, currentUserId }: PlayerInfoProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-around">
      <PlayerCard player={player1} title="Player 1 (Host)" isCurrentUser={player1?.uid === currentUserId} />
      <PlayerCard player={player2} title="Player 2" isCurrentUser={player2?.uid === currentUserId} />
    </div>
  );
}
