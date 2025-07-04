import { db } from '../../lib/firebase';
import { collection, query, orderBy, limit, getDocs, where, Timestamp } from 'firebase/firestore';
import Link from 'next/link';
import { Trophy } from 'lucide-react';

// --- Data Fetching Functions ---
async function getLeaderboard(field: 'bestWpm' | 'bestAccuracy', listLimit: number = 100) {
  const q = query(collection(db, 'users'), orderBy(field, 'desc'), limit(listLimit));
  const querySnapshot = await getDocs(q);
  // User documents from the 'users' collection likely have a 'displayName' field
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as object }));
}

async function getRecentLeaderboard(listLimit: number = 100) {
  const twentyFourHoursAgo = Timestamp.fromMillis(Date.now() - 24 * 60 * 60 * 1000);
  const q = query(
    collection(db, "gameResults"),
    where("timestamp", ">=", twentyFourHoursAgo),
    orderBy("timestamp", "desc"), 
    orderBy("wpm", "desc"),
    limit(listLimit * 2) 
  );
  const querySnapshot = await getDocs(q);
  // gameResult documents might have 'userName' denormalized onto them
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as { userId: string, wpm: number, [key: string]: any } }));
}


// --- Reusable Component ---
const LeaderboardTable = ({ title, data, valueField, unit }: { title: string, data: any[], valueField: string, unit: string }) => (
  <div>
    <h2 className="text-3xl font-bold text-center text-indigo-400 mb-6">{title}</h2>
    <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
      <ol>
        {data.map((player: any, index: number) => (
          <li key={player.id || player.userId || index} className="border-b border-gray-800 last:border-b-0">
            <Link href={`/user/${player.userId || player.id}`} className="flex items-center justify-between p-4 hover:bg-gray-800 transition-colors">
              <div className="flex items-center">
                <span className="text-gray-400 font-semibold w-10">{index + 1}.</span>
                {/* 
                  FIX: Check for userName (from gameResults) OR displayName (from users collection) 
                  before falling back to 'Player'.
                */}
                <span className="text-white font-medium">{player.userName || player.displayName || 'Player'}</span>
              </div>
              <span className="font-bold text-lg text-white">
                {Math.round(player[valueField])} <span className="text-sm text-gray-500">{unit}</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  </div>
);

// --- Page Component ---
export default async function LeaderboardsPage() {
  // Fetch all-time leaderboards
  const wpmLeaderboard = await getLeaderboard('bestWpm');
  const accuracyLeaderboard = await getLeaderboard('bestAccuracy');
  
  // Fetch recent games
  const recentGames = await getRecentLeaderboard();

  // This helper function correctly finds the best score for each unique user
  const getUniqueBestScores = (games: any[]) => {
    const bestScores = new Map();

    games.forEach((game) => {
      const existing = bestScores.get(game.userId);
      // If we haven't seen this user, or if their new score is better, update the map
      if (!existing || game.wpm > existing.wpm) {
        bestScores.set(game.userId, game);
      }
    });

    // Convert the map back to an array, sort it by WPM, and take the top 100
    return Array.from(bestScores.values())
        .sort((a, b) => b.wpm - a.wpm)
        .slice(0, 100);
  };
  
  // Process the fetched 'recentGames' data
  const recentWpmLeaderboard = getUniqueBestScores(recentGames);

  return (
    <div className="container mx-auto py-12 px-4">
      <header className="text-center mb-16">
        <Trophy className="mx-auto h-16 w-16 text-yellow-400 mb-4" />
        <h1 className="text-5xl font-bold text-white">Leaderboards</h1>
        <p className="text-lg text-gray-400 mt-2">See how you stack up against the competition.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
        <LeaderboardTable title="WPM (Last 24h)" data={recentWpmLeaderboard} valueField="wpm" unit="WPM" />
        <LeaderboardTable title="WPM (All-Time)" data={wpmLeaderboard} valueField="bestWpm" unit="WPM" />
        <LeaderboardTable title="Accuracy (All-Time)" data={accuracyLeaderboard} valueField="bestAccuracy" unit="%" />
      </div>
    </div>
  );
}