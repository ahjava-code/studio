import type { Timestamp } from 'firebase/firestore';

export interface GameSettings {
  paragraphLength: 50 | 100 | 200 | 300;
  gameDuration: 30 | 60 | 120; // in seconds
}

export interface Player {
  uid: string;
  name: string;
  typedText: string;
  wpm: number;
  accuracy: number; // percentage
  errors: number;
  progress: number; // percentage of paragraph typed
  isHost: boolean;
  isReady?: boolean; // For indicating readiness before game starts
}

export interface Room {
  id: string;
  hostId: string;
  guestId: string | null;
  status: 'waiting' | 'ready' | 'countdown' | 'playing' | 'finished';
  settings: GameSettings;
  paragraphText: string | null;
  startTime: Timestamp | null; // Firebase Timestamp when game starts
  createdAt: Timestamp;
  player1: Player | null; // Host
  player2: Player | null; // Guest
  winner?: 'player1' | 'player2' | 'draw' | null;
}
