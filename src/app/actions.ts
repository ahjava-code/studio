// src/app/actions.ts
"use server";

import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { z } from 'zod';
import { db } from '@/lib/firebase';
import { generateRoomId } from '@/lib/utils';
import type { Room, Player, GameSettings } from '@/types'; // Ensure types are imported correctly
import { generateParagraph } from '@/ai/flows/generateParagraph'; // Updated import

const ParagraphLengthSchema = z.enum(['50', '100', '200', '300']).transform(val => parseInt(val, 10) as 50 | 100 | 200 | 300);
const GameDurationSchema = z.enum(['30', '60', '120']).transform(val => parseInt(val, 10) as 30 | 60 | 120);

// New schema for separate punctuation and numbers
const ParagraphSettingsSchema = z.object({
    length: ParagraphLengthSchema,
    includePunctuation: z.boolean().default(false), // Separate field
    includeNumbers: z.boolean().default(false),     // Separate field
});

const CreateRoomInputSchema = z.object({
  hostId: z.string(),
  hostName: z.string(),
  // Add settings here, assuming default values if not provided
  settings: ParagraphSettingsSchema.optional(),
});

export async function createRoomAction(input: z.infer<typeof CreateRoomInputSchema>): Promise<{ roomId: string } | { error: string }> {
  const validation = CreateRoomInputSchema.safeParse(input);
  if (!validation.success) {
    console.error("CreateRoomAction validation error:", validation.error.errors);
    return { error: "Invalid input for creating room." };
  }
  
  const { hostId, hostName, settings } = validation.data;
  const roomId = generateRoomId();

  // Default settings if not provided, or merge with provided
  const initialSettings: GameSettings = {
    paragraphLength: settings?.length ?? 100, // Default to 100 if not provided
    gameDuration: 60, // Default game duration
    includePunctuation: settings?.includePunctuation ?? false, // Default to false
    includeNumbers: settings?.includeNumbers ?? false,         // Default to false
  };

  const hostPlayer: Player = {
    uid: hostId,
    name: hostName,
    typedText: '',
    wpm: 0,
    accuracy: 100,
    errors: 0,
    progress: 0,
    isHost: true,
    isReady: true,
  };

  const newRoom: Room = {
    id: roomId,
    hostId,
    guestId: null,
    status: 'waiting',
    settings: initialSettings,
    paragraphText: null,
    startTime: null,
    createdAt: serverTimestamp() as any, 
    player1: hostPlayer,
    player2: null,
    winner: null, // Ensure winner field exists if not already
  };

  try {
    const roomRef = doc(db, 'rooms', roomId);
    await setDoc(roomRef, newRoom);
    return { roomId };
  } catch (error) {
    console.error('Error creating room:', error);
    return { error: 'Failed to create room. Please try again.' };
  }
}

// Updated fetchParagraphAction to accept the new options
export async function fetchParagraphAction(length: 50 | 100 | 200 | 300, includePunctuation: boolean = false, includeNumbers: boolean = false): Promise<string> {
  try {
    // Validate the input to this action
    ParagraphLengthSchema.parse(length.toString()); 
    
    // Call the imported generateParagraph function, ensuring the input matches its schema
    const paragraph = await generateParagraph({ 
        length: length.toString() as '50' | '100' | '200' | '300', 
        includePunctuation: includePunctuation,
        includeNumbers: includeNumbers
    });
    return paragraph;
  } catch (error) {
    console.error("Error generating paragraph via AI flow:", error);
    // Provide a fallback that respects the requested options if possible
    let fallback = "The quick brown fox jumps over the lazy dog. ";
    if (includePunctuation) {
        fallback += "It's a sunny day, isn't it?";
    }
    if (includeNumbers) {
        fallback += " We need 5 apples and 3 oranges for the recipe.";
    }
    return fallback;
  }
}

const JoinRoomInputSchema = z.object({
  roomId: z.string().length(6, "Room ID must be 6 characters."),
  guestId: z.string(),
  guestName: z.string(),
});

export async function joinRoomAction(input: z.infer<typeof JoinRoomInputSchema>): Promise<{ success: boolean } | { error: string }> {
  const validation = JoinRoomInputSchema.safeParse(input);
  if (!validation.success) {
    return { error: "Invalid input for joining room." };
  }

  const { roomId, guestId, guestName } = validation.data;
  const roomRef = doc(db, 'rooms', roomId);

  try {
    const roomSnap = await getDoc(roomRef);
    if (!roomSnap.exists()) {
      return { error: 'Room not found.' };
    }

    const roomData = roomSnap.data() as Room;

    if (roomData.guestId && roomData.guestId !== guestId) {
      return { error: 'Room is already full.' };
    }
    if (roomData.hostId === guestId) {
      return { error: 'Host cannot join as guest.' };
    }
    
    const guestPlayer: Player = {
      uid: guestId,
      name: guestName,
      typedText: '',
      wpm: 0,
      accuracy: 100,
      errors: 0,
      progress: 0,
      isHost: false,
      isReady: true, // Assume guest is ready upon joining
    };

    // Ensure we correctly merge and don't overwrite existing data unnecessarily
    await setDoc(roomRef, { 
      guestId: guestId, 
      player2: guestPlayer,
      status: 'ready' // Transition to ready if host was waiting
    }, { merge: true });
    
    return { success: true };

  } catch (error) {
    console.error('Error joining room:', error);
    return { error: 'Failed to join room. Please try again.' };
  }
}