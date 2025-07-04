'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui2/button';
import { RefreshCw, BarChart, CheckCircle, Target,Clock } from 'lucide-react';

type Stats = { wpm: number; accuracy: number; time: number };

const StatItem = ({ icon, label, value, unit }: { icon: React.ReactNode, label: string, value: number, unit: string }) => (
    <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg">
        <div className="flex items-center text-gray-400">
            {icon}
            <span className="ml-2">{label}</span>
        </div>
        <p className="text-4xl font-bold text-white">{value}<span className="text-xl text-gray-400 ml-1">{unit}</span></p>
    </div>
);

export const ResultsCard = ({ stats, resetGame }: { stats: Stats; resetGame: () => void }) => {
    const router = useRouter();

    const challengeFriend = () => {
        // This navigates the user to your multiplayer lobby page
        router.push('/play');
    };

    return (
        <div className="p-8 bg-gray-900 border border-gray-700 rounded-xl text-center shadow-2xl">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-6">Test Complete!</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <StatItem icon={<BarChart size={24}/>} label="WPM" value={stats.wpm} unit="" />
                <StatItem icon={<Target size={24}/>} label="Accuracy" value={stats.accuracy} unit="%" />
                <StatItem icon={<Clock size={24}/>} label="Time" value={stats.time} unit="s" />
            </div>

            <h3 className="text-xl font-semibold text-white mb-4">Happy with your score?</h3>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Button onClick={resetGame} variant="secondary" className="w-full sm:w-auto">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                </Button>
                <Button onClick={challengeFriend} variant="primary" className="w-full sm:w-auto">
                    Challenge a Friend to a Duel!
                </Button>
            </div>
        </div>
    );
};