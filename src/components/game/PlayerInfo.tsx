// src/components/game/PlayerInfo.tsx
import type { Player } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { User, CheckCircle2, XCircle, Crown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface PlayerInfoProps {
  player1: Player | null;
  player2: Player | null;
  currentUserId: string | undefined;
}

const PlayerCard = ({ 
  player, 
  title, 
  isCurrentUser, 
  isHost 
}: { 
  player: Player | null, 
  title: string, 
  isCurrentUser: boolean,
  isHost: boolean
}) => {
  return (
    <Card className={cn(
      "h-full transition-all",
      isCurrentUser ? "border-primary bg-primary/5" : "bg-muted/20",
      !player && "opacity-70"
    )}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex items-center justify-center rounded-full w-10 h-10",
            player ? "bg-primary text-primary-foreground" : "bg-muted"
          )}>
            <User className="h-5 w-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className={cn(
                "font-semibold truncate",
                player ? "text-foreground" : "text-muted-foreground"
              )}>
                {player?.name || title}
              </h3>
              {isHost && <Crown className="h-4 w-4 text-yellow-500" />}
              {isCurrentUser && (
                <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                  You
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2 mt-1">
              {player ? (
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  <span>Connected</span>
                  {player.isReady && (
                    <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                      Ready
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center text-sm text-muted-foreground">
                  <XCircle className="h-4 w-4 mr-1" />
                  <span>Waiting...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function PlayerInfo({ player1, player2, currentUserId }: PlayerInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <PlayerCard 
        player={player1} 
        title="Host" 
        isCurrentUser={player1?.uid === currentUserId} 
        isHost={true}
      />
      <PlayerCard 
        player={player2} 
        title="Player 2" 
        isCurrentUser={player2?.uid === currentUserId} 
        isHost={false}
      />
    </div>
  );
}