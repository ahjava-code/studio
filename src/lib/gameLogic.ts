import { db } from './firebase';
import { collection, addDoc, doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import type { User } from 'firebase/auth';

// Add a new type for the game mode
type GameMode = 'duel' | 'test';

// Add gameMode as a parameter to the function
export const saveGameResult = async (user: User, wpm: number, accuracy: number, gameMode: GameMode) => {
  if (!user) throw new Error("User not authenticated");

  try {
    const userRef = doc(db, 'users', user.uid);
    
    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists()) {
        throw "User profile does not exist!";
      }
      const userData = userDoc.data();

      // 1. Add the new game result with the gameMode
      const gameResultData = {
        userId: user.uid,
        userName: userData.displayName || `Player_${user.uid.substring(0,6)}`,
        wpm,
        accuracy,
        timestamp: serverTimestamp(),
        gameMode: gameMode, // <-- ADD THIS LINE
      };
      const gameResultsCol = collection(db, 'gameResults');
      transaction.set(doc(gameResultsCol), gameResultData);

      // 2. Update the user's all-time best scores (this can be from any mode)
      const newBestWpm = Math.max(userData.bestWpm || 0, wpm);
      const newBestAccuracy = Math.max(userData.bestAccuracy || 0, accuracy);

      transaction.update(userRef, {
        bestWpm: newBestWpm,
        bestAccuracy: newBestAccuracy,
        lastPlayed: serverTimestamp(),
      });
    });
    console.log(`Game result for mode '${gameMode}' saved successfully!`);
  } catch (error) {
    console.error("Error saving game result: ", error);
  }
};