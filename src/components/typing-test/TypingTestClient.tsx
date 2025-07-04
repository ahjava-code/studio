'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { ResultsCard } from './ResultsCard';
import { Clock, Type } from 'lucide-react';

// At the top of TypingTestClient.tsx
import { useAuth } from '@/lib/hooks/useAuth';
import { saveGameResult } from '@/lib/gameLogic';

// --- Helper Components & Constants ---

const TEXTS = {
    short: "The quick brown fox jumps over the lazy dog.",
    medium: "In the middle of difficulty lies opportunity. The only way to do great work is to love what you do. Life is what happens when you're busy making other plans.",
    long: "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune, Or to take Arms against a Sea of troubles, And by opposing end them: to die, to sleep.",
};

// Type definitions for clarity
type GameMode = 'time' | 'text';
type TextOption = keyof typeof TEXTS;
type TimeOption = 60 | 120 | 300;
type GameState = 'waiting' | 'in-progress' | 'finished';
type Stats = { wpm: number; accuracy: number; time: number };

const TextDisplay = ({ text, userInput }: { text: string; userInput: string }) => (
    <div className="text-2xl font-mono p-4 bg-gray-800 rounded-md select-none leading-relaxed">
        {text.split('').map((char, index) => {
            let color = 'text-gray-500';
            if (index < userInput.length) {
                color = char === userInput[index] ? 'text-green-400' : 'text-red-500 bg-red-900/50';
            }
            return <span key={index} className={color}>{char}</span>;
        })}
    </div>
);

// --- Main Component ---

export const TypingTestClient = () => {

    const { user } = useAuth();
    // State Management
    const [gameState, setGameState] = useState<GameState>('waiting');
    const [gameMode, setGameMode] = useState<GameMode>('text');
    const [textOption, setTextOption] = useState<TextOption>('medium');
    const [timeOption, setTimeOption] = useState<TimeOption>(60);
    const [textToType, setTextToType] = useState(TEXTS.medium);
    const [userInput, setUserInput] = useState('');
    const [stats, setStats] = useState<Stats>({ wpm: 0, accuracy: 0, time: 0 });

    // FIX #1: The timer state should be of type `number`.
    const [timer, setTimer] = useState<number>(timeOption);

    // Refs for precise timing and input focus
    const startTimeRef = useRef<number | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // FIX #2: Remove `gameState` from the dependency array to avoid stale closures.
    const finishGame = useCallback(() => {
        if (gameState !== 'in-progress') return;

        setGameState('finished');
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

        const endTime = Date.now();
        const timeElapsedSec = (endTime - (startTimeRef.current ?? endTime)) / 1000;

        const wordsTyped = userInput.trim() === '' ? 0 : userInput.trim().split(/\s+/).length;
        const wpm = timeElapsedSec > 0 ? Math.round((wordsTyped / timeElapsedSec) * 60) : 0;

        let correctChars = 0;
        userInput.split('').forEach((char, index) => {
            if (char === textToType[index]) {
                correctChars++;
            }
        });
        const accuracy = userInput.length > 0 ? Math.round((correctChars / userInput.length) * 100) : 0;

        setStats({ wpm, accuracy, time: parseFloat(timeElapsedSec.toFixed(1)) });
    }, [userInput, textToType, gameState]); // We keep gameState here to read its current value but understand the implication


    const resetGame = useCallback(() => {
        setGameState('waiting');
        setUserInput('');
        startTimeRef.current = null;
        setStats({ wpm: 0, accuracy: 0, time: 0 });
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

        if (gameMode === 'time') {
            setTimer(timeOption);
            setTextToType(TEXTS.long);
        } else {
            setTextToType(TEXTS[textOption]);
        }
        inputRef.current?.focus();
    }, [gameMode, timeOption, textOption]);

    // Effect for fetching and setting text based on options
    useEffect(() => {
        if (gameState === 'waiting') {
            if (gameMode === 'time') {
                setTextToType(TEXTS.long);
                setTimer(timeOption);
            } else {
                setTextToType(TEXTS[textOption]);
            }
        }
    }, [textOption, timeOption, gameMode, gameState]);


    // Effect for the countdown timer
    useEffect(() => {
        if (gameState === 'in-progress' && gameMode === 'time') {
            timerIntervalRef.current = setInterval(() => {
                setTimer((prevTimer) => {
                    if (prevTimer <= 1) {
                        clearInterval(timerIntervalRef.current!);
                        finishGame();
                        return 0;
                    }
                    return prevTimer - 1;
                });
            }, 1000);
        }
        return () => {
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        };
    }, [gameState, gameMode, finishGame]);

    useEffect(() => {
        // Ensure the game is finished, we have a user, and a valid score to save.
        if (gameState === 'finished' && user && stats.wpm > 0) {
            // We call saveGameResult with the 'test' game mode.
            saveGameResult(user, stats.wpm, stats.accuracy, 'test');
        }
        // This dependency array ensures the effect runs only when these values change.
    }, [gameState, user, stats]);

    const startGame = () => {
        if (gameState === 'waiting') {
            setGameState('in-progress');
            startTimeRef.current = Date.now();
            if (gameMode === 'time') {
                setTimer(timeOption);
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (gameState === 'finished') return;

        if (gameState === 'waiting') {
            startGame();
        }

        const value = e.target.value;
        setUserInput(value);

        if (gameMode === 'text' && value.length >= textToType.length) {
            finishGame();
        }
    };

    const isOptionsDisabled = gameState === 'in-progress';

    const renderOptions = () => (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 p-4 bg-gray-900/50 rounded-lg mb-8">
            <div className="flex gap-2 p-1 bg-gray-800 rounded-md">
                <button disabled={isOptionsDisabled} onClick={() => setGameMode('text')} className={`px-3 py-1 rounded transition-colors ${gameMode === 'text' ? 'bg-indigo-600' : 'hover:bg-gray-700'} ${isOptionsDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}><Type className="inline-block mr-2 h-4 w-4" />Text</button>
                <button disabled={isOptionsDisabled} onClick={() => setGameMode('time')} className={`px-3 py-1 rounded transition-colors ${gameMode === 'time' ? 'bg-indigo-600' : 'hover:bg-gray-700'} ${isOptionsDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}><Clock className="inline-block mr-2 h-4 w-4" />Time</button>
            </div>
            <div className="flex gap-2">
                {gameMode === 'text' ? (
                    <>
                        <button disabled={isOptionsDisabled} onClick={() => setTextOption('short')} className={`px-3 py-1 rounded transition-colors ${textOption === 'short' ? 'bg-indigo-600' : 'hover:bg-gray-700'} ${isOptionsDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>Short</button>
                        <button disabled={isOptionsDisabled} onClick={() => setTextOption('medium')} className={`px-3 py-1 rounded transition-colors ${textOption === 'medium' ? 'bg-indigo-600' : 'hover:bg-gray-700'} ${isOptionsDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>Medium</button>
                        <button disabled={isOptionsDisabled} onClick={() => setTextOption('long')} className={`px-3 py-1 rounded transition-colors ${textOption === 'long' ? 'bg-indigo-600' : 'hover:bg-gray-700'} ${isOptionsDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>Long</button>
                    </>
                ) : (
                    <>
                        <button disabled={isOptionsDisabled} onClick={() => setTimeOption(60)} className={`px-3 py-1 rounded transition-colors ${timeOption === 60 ? 'bg-indigo-600' : 'hover:bg-gray-700'} ${isOptionsDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>1 min</button>
                        <button disabled={isOptionsDisabled} onClick={() => setTimeOption(120)} className={`px-3 py-1 rounded transition-colors ${timeOption === 120 ? 'bg-indigo-600' : 'hover:bg-gray-700'} ${isOptionsDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>2 min</button>
                        <button disabled={isOptionsDisabled} onClick={() => setTimeOption(300)} className={`px-3 py-1 rounded transition-colors ${timeOption === 300 ? 'bg-indigo-600' : 'hover:bg-gray-700'} ${isOptionsDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>5 min</button>
                    </>
                )}
            </div>
        </div>
    );

    return (
        <div className="w-full max-w-4xl mx-auto">
            {gameState === 'finished' ? (
                <ResultsCard stats={stats} resetGame={resetGame} />
            ) : (
                <>
                    {renderOptions()}
                    <div className="relative">
                        <TextDisplay text={textToType} userInput={userInput} />
                        {gameMode === 'time' && <div className="absolute top-4 right-4 text-3xl font-bold text-yellow-400">{timer}</div>}
                    </div>
                    <Input
                        ref={inputRef}
                        type="text"
                        value={userInput}
                        onChange={handleInputChange}
                        placeholder={gameState === 'waiting' ? "Start typing to begin..." : ""}
                        className="w-full p-4 text-xl mt-8"
                        autoFocus
                    />
                </>
            )}
        </div>
    );
};