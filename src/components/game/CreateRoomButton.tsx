// src/components/game/CreateRoomButton.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/useAuth';
import { createRoomAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PartyPopper } from 'lucide-react';
import { getOrdinal } from '@/lib/utils'; // Assuming this exists for player naming

let playerNumber = 1; // Simple counter for player names

export function CreateRoomButton() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCreateRoom = async () => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be signed in to create a room.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    
    // Simple sequential player naming for demo. A more robust system might be needed.
    const hostPlayerName = `Player ${getOrdinal(playerNumber)}`; 
    playerNumber = (playerNumber % 2) + 1; // Alternate between 1 and 2 for simplicity

    const result = await createRoomAction({ hostId: user.uid, hostName: hostPlayerName });
    
    if ('roomId' in result && result.roomId) {
      toast({
        title: "Room Created!",
        description: `Room ${result.roomId} successfully created. Redirecting...`,
      });
      router.push(`/room/${result.roomId}`);
    } else if ('error' in result) {
      toast({
        title: "Error Creating Room",
        description: result.error,
        variant: "destructive",
      });
      setIsLoading(false);
    } else {
       toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return <Button className="w-full" disabled><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Authenticating...</Button>;
  }

  return (
    <Button
      onClick={handleCreateRoom}
      disabled={isLoading || !user}
      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6"
      size="lg"
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      ) : (
        <PartyPopper className="mr-2 h-5 w-5" />
      )}
      Create Game Room
    </Button>
  );
}
