// src/app/user/[userId]/page.tsx
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore'; // Import Timestamp
import { notFound } from 'next/navigation';
import { User as UserIcon, BarChart2, Target } from 'lucide-react';

// --- DEFINE THE TYPES FOR YOUR DATA ---
type UserProfile = {
  id: string;
  displayName: string;
  bestWpm?: number; // Optional because a new user might not have a score
  bestAccuracy?: number; // Optional
};

type GameResult = {
  id: string;
  wpm: number;
  accuracy: number;
  timestamp: Timestamp;
};
// ----------------------------------------

// --- Data Fetching Functions ---
// Use the UserProfile type as the return type
async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    return null;
  }
  // Cast the data to your defined type
  return { id: docSnap.id, ...docSnap.data() } as UserProfile;
}

// Use the GameResult type
async function getUserRecentGames(userId:string): Promise<GameResult[]> {
    const q = query(
        collection(db, 'gameResults'), 
        where('userId', '==', userId), 
        orderBy('timestamp', 'desc'), 
        limit(10)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as GameResult);
}

// --- Page Component (The rest of the file) ---
export default async function UserProfilePage({ params }: { params: { userId: string } }) {
  const userProfile = await getUserProfile(params.userId);
  const recentGames = await getUserRecentGames(params.userId);

  if (!userProfile) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
      <header className="flex flex-col sm:flex-row items-center gap-6 mb-12">
        <div className="p-4 bg-gray-800 rounded-full">
            <UserIcon className="h-16 w-16 text-indigo-400" />
        </div>
        <div>
            {/* These will now work without errors */}
            <h1 className="text-4xl font-bold text-white text-center sm:text-left">{userProfile.displayName}</h1>
            <p className="text-gray-400 text-center sm:text-left">UID: {userProfile.id}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg text-center">
            <BarChart2 className="mx-auto h-8 w-8 text-indigo-400 mb-2" />
            <p className="text-sm text-gray-400">Best WPM</p>
            {/* These will now work without errors */}
            <p className="text-5xl font-bold text-white">{userProfile.bestWpm || 0}</p>
          </div>
          <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg text-center">
            <Target className="mx-auto h-8 w-8 text-indigo-400 mb-2" />
            <p className="text-sm text-gray-400">Best Accuracy</p>
            {/* These will now work without errors */}
            <p className="text-5xl font-bold text-white">{userProfile.bestAccuracy || 0}%</p>
          </div>
      </div>

      <section>
          <h2 className="text-2xl font-bold text-white mb-4">Recent Games</h2>
          <div className="bg-gray-900 border border-gray-700 rounded-lg">
              {recentGames.map((game) => (
                  <div key={game.id} className="flex justify-between items-center p-4 border-b border-gray-800 last:border-b-0">
                      <p className="text-gray-400">
                        {new Date(game.timestamp.seconds * 1000).toLocaleDateString()}
                      </p>
                      <div className="flex gap-6 text-right">
                        <span className="font-semibold text-white w-24">{game.wpm} WPM</span>
                        <span className="font-semibold text-white w-24">{game.accuracy}% Accuracy</span>
                      </div>
                  </div>
              ))}
              {recentGames.length === 0 && <p className="p-4 text-gray-500">No games played yet.</p>}
          </div>
      </section>
    </div>
  );
}