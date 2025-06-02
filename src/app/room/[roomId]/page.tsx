// src/app/room/[roomId]/page.tsx
import { GameRoomClient } from '@/components/game/GameRoomClient';
import { Card, CardContent } from '@/components/ui/card';

type GameRoomPageProps = {
  params: {
    roomId: string;
  };
};

export default function GameRoomPage({ params }: GameRoomPageProps) {
  const { roomId } = params;

  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-xl">
        <CardContent className="p-4 md:p-6">
          <GameRoomClient roomId={roomId} />
        </CardContent>
      </Card>
    </div>
  );
}
