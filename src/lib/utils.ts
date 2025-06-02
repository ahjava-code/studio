import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateRoomId(length: number = 6): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function calculateWpm(correctChars: number, timeElapsedSeconds: number): number {
  // Wait for at least a small amount of time to pass (e.g., 0.25s) for a more stable WPM,
  // or if no characters have been typed correctly yet.
  if (timeElapsedSeconds < 0.25 || correctChars === 0) {
    return 0;
  }
  const minutes = timeElapsedSeconds / 60;
  // minutes should not be 0 here due to the timeElapsedSeconds < 0.25 check
  const words = correctChars / 5; // Standard WPM calculation: 5 chars = 1 word
  return Math.round(words / minutes);
}

export function calculateAccuracy(typedChars: number, errors: number): number {
  if (typedChars <= 0) return 0;
  const correctChars = typedChars - errors;
  return Math.round((correctChars / typedChars) * 100);
}

export function getOrdinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
