
// src/components/game/GameRoomClient.tsx
"use client";

import type { ChangeEvent} from 'react';
import { useEffect, useState, useCallback } from 'react';
import { doc, onSnapshot, updateDoc, Timestamp, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/hooks/useAuth';
import type { Room, Player, GameSettings } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertTriangle, Copy, Link as LinkIcon, Settings, Play, Users, LogOut, Share2, Trophy } from 'lucide-react';
import { RoomInfo } from './RoomInfo';
import { PlayerInfo } from './PlayerInfo';
import { GameSettingsComponent } from './GameSettingsComponent';
import { GameArea } from './GameArea';
import { TimerDisplay } from './TimerDisplay';
import { CountdownDisplay } from './CountdownDisplay';
import { GameResults } from './GameResults';
import { fetchParagraphAction } from '@/app/actions';
import { calculateWpm, calculateAccuracy } from '@/lib/utils';

interface GameRoomClientProps {
  roomId: string;
}

export function GameRoomClient({ roomId }: GameRoomClientProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [opponentPlayer, setOpponentPlayer] = useState<Player | null>(null);
  const [isClientTimeUp, setIsClientTimeUp] = useState(false);

  useEffect(() => {
    if (!user) return;

    const roomRef = doc(db, 'rooms', roomId);
    const unsubscribe = onSnapshot(roomRef, (docSnap) => {
      if (docSnap.exists()) {
        const roomData = docSnap.data() as Room;
        setRoom(roomData);
        setIsHost(roomData.hostId === user.uid);
        
        if (roomData.hostId === user.uid) {
          setCurrentPlayer(roomData.player1);
          setOpponentPlayer(roomData.player2);
        } else if (roomData.guestId === user.uid) {
          setCurrentPlayer(roomData.player2);
          setOpponentPlayer(roomData.player1);
        } else if (roomData.status === 'waiting' && !roomData.guestId) {
          // User might be the host who created but navigated away and back
           // Or, a new user trying to join when only host is set
        } else {
           // User is not part of this room, but room exists. Maybe redirect or show error.
           // For now, if user is not host or guest and room is not 'waiting', it's an issue.
          if (roomData.status !== 'waiting') {
            toast({ title: "Access Denied", description: "You are not a participant in this room.", variant: "destructive"});
            router.push('/');
          }
        }
        setLoading(false);
        setError(null);
      } else {
        setError('Room not found. It might have been deleted or the ID is incorrect.');
        setLoading(false);
        toast({ title: "Error", description: "Room not found.", variant: "destructive" });
        router.push('/');
      }
    }, (err) => {
      console.error("Error listening to room:", err);
      setError('Failed to connect to the room. Please check your internet connection.');
      setLoading(false);
      toast({ title: "Connection Error", description: "Could not connect to room.", variant: "destructive" });
    });

    return () => unsubscribe();
  }, [roomId, user, router, toast]);

  const handleSettingsChange = async (newSettings: Partial<GameSettings>) => {
    if (!room || !isHost) return;
    const roomRef = doc(db, 'rooms', roomId);
    try {
      await updateDoc(roomRef, {
        settings: { ...room.settings, ...newSettings },
      });
      toast({ title: "Settings Updated", description: "Game settings have been changed." });
    } catch (e) {
      toast({ title: "Error", description: "Failed to update settings.", variant: "destructive" });
    }
  };

  const handleStartGame = async () => {
    if (!room || !isHost || !room.player1 || !room.player2 || room.status !== 'ready') return;
    
    setLoading(true);
    setIsClientTimeUp(false); 
    try {
      const paragraph = await fetchParagraphAction(room.settings.paragraphLength);
      const roomRef = doc(db, 'rooms', roomId);
      await updateDoc(roomRef, {
        paragraphText: paragraph,
        status: 'countdown',
        'player1.typedText': '', 'player1.wpm': 0, 'player1.accuracy': 100, 'player1.errors': 0, 'player1.progress': 0,
        'player2.typedText': '', 'player2.wpm': 0, 'player2.accuracy': 100, 'player2.errors': 0, 'player2.progress': 0,
      });
    } catch (e) {
      toast({ title: "Error Starting Game", description: "Could not fetch paragraph or update room.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (room?.status === 'countdown') {
      const countdownTimer = setTimeout(async () => {
        const roomRef = doc(db, 'rooms', roomId);
        try {
          await updateDoc(roomRef, {
            status: 'playing',
            startTime: serverTimestamp(),
          });
        } catch (e) {
          toast({ title: "Error", description: "Failed to start game after countdown.", variant: "destructive" });
        }
      }, 3000);
      return () => clearTimeout(countdownTimer);
    } else if (room?.status === 'playing') {
        if(isClientTimeUp) setIsClientTimeUp(false); // Reset if it was true from a previous game or state
    }
  }, [room?.status, roomId, toast, isClientTimeUp]);

  const handleTyping = async (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (!room || room.status !== 'playing' || !user || !currentPlayer || !room.paragraphText || !room.startTime || isClientTimeUp) return;

    const typedText = e.target.value;
    let errors = 0;
    for (let i = 0; i < typedText.length; i++) {
      if (i < room.paragraphText.length && typedText[i] !== room.paragraphText[i]) {
        errors++;
      } else if (i >= room.paragraphText.length) { // Typed beyond paragraph length
        errors++;
      }
    }
    
    const correctChars = typedText.length - errors;
    const progress = room.paragraphText ? Math.round((Math.min(typedText.length, room.paragraphText.length) / room.paragraphText.length) * 100) : 0;
    
    const timeNow = Timestamp.now();
    const elapsedSeconds = (timeNow.seconds - (room.startTime as Timestamp).seconds);
    const wpm = calculateWpm(correctChars, elapsedSeconds);
    const accuracy = calculateAccuracy(typedText.length, errors);

    const playerField = isHost ? 'player1' : 'player2';
    const updateData = {
      [`${playerField}.typedText`]: typedText,
      [`${playerField}.wpm`]: wpm,
      [`${playerField}.accuracy`]: accuracy,
      [`${playerField}.errors`]: errors,
      [`${playerField}.progress`]: progress,
    };

    const roomRef = doc(db, 'rooms', roomId);
    try {
      await updateDoc(roomRef, updateData);
    } catch (err) {
      console.error("Error updating player data:", err);
    }
  };
  
  const handleClientTimeUp = useCallback(() => {
    if (!isClientTimeUp) {
      setIsClientTimeUp(true);
    }
  }, [isClientTimeUp, setIsClientTimeUp]);

   useEffect(() => {
    // This effect is for the server-authoritative game end.
    // isClientTimeUp is handled by TimerDisplay's onTimeUp callback.
    if (!room || room.status !== 'playing' || !room.startTime) return;

    const checkGameEndAuthoritative = () => {
      const now = Timestamp.now();
      const elapsedSeconds = now.seconds - (room.startTime as Timestamp).seconds;
      
      const gameShouldEndByTime = elapsedSeconds >= room.settings.gameDuration;
      
      const p1Finished = room.player1 && room.paragraphText && room.player1.typedText.length >= room.paragraphText.length;
      const p2Finished = room.player2 && room.paragraphText && room.player2.typedText.length >= room.paragraphText.length;

      const bothPlayersFinished = p1Finished && p2Finished;
      const onePlayerFinishedAndOtherAbsent = (p1Finished && !room.player2) || (p2Finished && !room.player1);
      
      const gameShouldEnd = gameShouldEndByTime || bothPlayersFinished || onePlayerFinishedAndOtherAbsent;

      if (gameShouldEnd && room.status === 'playing') { 
        const roomRef = doc(db, 'rooms', roomId);
        let winner: Room['winner'] = null;
        if (room.player1 && room.player2) {
            const p1Score = room.player1.wpm * (room.player1.accuracy / 100) + room.player1.progress; 
            const p2Score = room.player2.wpm * (room.player2.accuracy / 100) + room.player2.progress;
            if (p1Score > p2Score) winner = 'player1';
            else if (p2Score > p1Score) winner = 'player2';
            else winner = 'draw'; 
        } else if (room.player1 && !room.player2) { 
            winner = 'player1';
        } else if (room.player2 && !room.player1) { 
            winner = 'player2';
        } else if (room.player1) { // Only p1 exists
             winner = 'player1';
        } else if (room.player2) { // Only p2 exists
             winner = 'player2';
        }

        updateDoc(roomRef, { status: 'finished', winner: winner }).catch(e => console.error("Error ending game:", e));
      }
    };
    
    // Run once immediately in case conditions are already met
    checkGameEndAuthoritative();
    const intervalId = setInterval(checkGameEndAuthoritative, 1000);
    return () => clearInterval(intervalId);

  }, [room?.status, room?.startTime, room?.settings?.gameDuration, room?.player1, room?.player2, room?.paragraphText, roomId]);


  const handleLeaveRoom = async () => {
    if (!user || !room) return;
    const roomRef = doc(db, 'rooms', roomId);
    try {
      if (isHost) {
        if (room.player2) {
             await updateDoc(roomRef, { 
               hostId: room.player2.uid, 
               player1: room.player2, 
               'player1.isHost': true,
               guestId: null,
               player2: null,
               status: 'waiting' 
              });
        } else {
            await updateDoc(roomRef, { player1: null, hostId: '', status: 'waiting', paragraphText: null, startTime: null, winner: null }); 
        }
      } else { 
        await updateDoc(roomRef, { guestId: null, player2: null, status: (room.player1 ? 'waiting' : 'empty'), paragraphText: (room.player1 ? room.paragraphText : null), winner: null });
      }
      router.push('/');
      toast({ title: "Left Room", description: "You have left the game room." });
    } catch (e) {
      toast({ title: "Error Leaving Room", description: "Could not update room status.", variant: "destructive" });
    }
  };
  
  const handlePlayAgain = async () => {
    if (!room || !isHost || room.status !== 'finished') return;
    setIsClientTimeUp(false); 
    const roomRef = doc(db, 'rooms', roomId);
    try {
      await updateDoc(roomRef, {
        status: 'ready', 
        paragraphText: null,
        startTime: null,
        winner: null,
        'player1.typedText': '', 'player1.wpm': 0, 'player1.accuracy': 100, 'player1.errors': 0, 'player1.progress': 0, 'player1.isReady': true, 
        'player2.typedText': '', 'player2.wpm': 0, 'player2.accuracy': 100, 'player2.errors': 0, 'player2.progress': 0, 'player2.isReady': false, 
      });
    } catch (e) {
      toast({ title: "Error", description: "Failed to reset game.", variant: "destructive" });
    }
  };


  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-12 w-12 animate-spin text-primary" /><p className="ml-4">Loading Room...</p></div>;
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
        <p className="mt-4 text-lg text-destructive">{error}</p>
        <Button onClick={() => router.push('/')} className="mt-6">Go to Home</Button>
      </div>
    );
  }

  if (!room || !user) { 
    return <div className="text-center py-10"><p>Room data or user not available.</p></div>;
  }
  
  if (!isHost && user.uid !== room.guestId && room.status !== 'waiting') {
     return (
        <div className="text-center py-10">
            <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
            <p className="mt-4 text-lg text-destructive">You are not a participant in this room.</p>
            <Button onClick={() => router.push('/')} className="mt-6">Go to Home</Button>
        </div>
     );
  }

  const canStartGame = isHost && room.status === 'ready' && room.player1 && room.player2 && room.player1.isReady && room.player2.isReady;

  return (
    <div className="space-y-6">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-headline">Room: {roomId}</CardTitle>
        <RoomInfo roomId={roomId} />
      </CardHeader>

      <PlayerInfo player1={room.player1} player2={room.player2} currentUserId={user.uid} />

      {room.status === 'waiting' && (
        <Card className="text-center">
          <CardHeader><CardTitle>Waiting for Player</CardTitle></CardHeader>
          <CardContent>
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-2 text-muted-foreground">
              {isHost ? "Share the room ID or link with another player to join." : "Waiting for the host..."}
            </p>
            {!room.player1 && isHost && <p className="text-sm text-destructive mt-2">Error: Host data missing. Try leaving and rejoining.</p>}
          </CardContent>
        </Card>
      )}
      
      {room.status === 'ready' && !isHost && room.player2 && !room.player2.isReady && (
        <div className="text-center">
          <Button onClick={async () => {
            if (user && room.player2) {
              const roomRef = doc(db, 'rooms', roomId);
              await updateDoc(roomRef, {'player2.isReady': true });
              toast({title: "You are Ready!", description: "Waiting for host to start."});
            }
          }}>
            Ready Up!
          </Button>
        </div>
      )}
      {room.status === 'ready' && !isHost && room.player2 && room.player2.isReady && (
         <Card className="text-center">
            <CardContent className="pt-6">
                <p className="font-semibold text-primary">You are Ready!</p>
                <p className="text-muted-foreground">Waiting for host to start the game...</p>
            </CardContent>
         </Card>
      )}


      {room.status === 'ready' && isHost && (
        <GameSettingsComponent settings={room.settings} onSettingsChange={handleSettingsChange} disabled={!isHost} />
      )}
      
      {room.status === 'ready' && !isHost && (
         <Card className="text-center">
          <CardHeader><CardTitle>Game Details</CardTitle></CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Paragraph Length: {room.settings.paragraphLength} words</p>
            <p className="text-muted-foreground">Game Duration: {room.settings.gameDuration} seconds</p>
             {/* Guest readiness already handled above */}
          </CardContent>
        </Card>
      )}

      {room.status === 'ready' && (
        <div className="text-center">
          {isHost && (
            <Button onClick={handleStartGame} disabled={!canStartGame || loading} size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Play className="mr-2 h-5 w-5" />}
              Start Game
            </Button>
          )}
          {isHost && (!room.player2 || !room.player1?.isReady || !room.player2?.isReady) && 
            <p className="text-sm text-muted-foreground mt-2">
              { !room.player2 && "Waiting for Player 2 to join."}
              { room.player2 && !room.player1?.isReady && "Host is not ready."}
              { room.player2 && room.player1?.isReady && !room.player2?.isReady && "Waiting for Player 2 to be ready."}
            </p>
          }
        </div>
      )}

      {room.status === 'countdown' && <CountdownDisplay />}
      
      {room.status === 'playing' && room.paragraphText && currentPlayer && room.startTime && (
        <>
          <TimerDisplay 
            startTime={room.startTime} 
            duration={room.settings.gameDuration}
            onTimeUp={handleClientTimeUp} 
          />
          <GameArea
            paragraphText={room.paragraphText}
            currentPlayer={currentPlayer}
            opponentPlayer={opponentPlayer}
            onTyped={handleTyping}
            isMyTurn={true} // Always true for this game type
            disabled={isClientTimeUp} 
          />
        </>
      )}
      
      {room.status === 'finished' && (
        <GameResults room={room} currentUserId={user.uid} />
      )}

      <CardFooter className="flex justify-between mt-8">
        <Button variant="outline" onClick={handleLeaveRoom}>
          <LogOut className="mr-2 h-4 w-4" /> Leave Room
        </Button>
        {isHost && room.status === 'finished' && (
          <Button onClick={handlePlayAgain} className="bg-primary hover:bg-primary/90">
            <Play className="mr-2 h-4 w-4" /> Play Again
          </Button>
        )}
        {!isHost && room.status === 'finished' && room.player1 && room.player2 && !room.player2.isReady && (
           <Button onClick={async () => {
             if (user && room.player2) {
                const roomRef = doc(db, 'rooms', roomId);
                await updateDoc(roomRef, {'player2.isReady': true });
                toast({title: "Ready for next game!", description: "Waiting for host to start."});
             }
           }} className="bg-primary hover:bg-primary/90">
            <Play className="mr-2 h-4 w-4" /> Play Again
          </Button>
        )}
         {!isHost && room.status === 'finished' && room.player1 && room.player2 && room.player2.isReady && (
             <p className="text-sm text-primary">Waiting for host to start next game...</p>
         )}
      </CardFooter>
    </div>
  );
}
