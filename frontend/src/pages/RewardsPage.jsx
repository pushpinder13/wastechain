import { useAuth } from '../context/AuthContext';
import { Award, Trophy, Star, Target } from 'lucide-react';
import Card from '../components/Card';
import Sidebar from '../components/Sidebar';

export default function RewardsPage() {
  const { user } = useAuth();

  const levels = [
    { name: 'Eco Starter', minPoints: 0, color: 'bg-gray-500' },
    { name: 'Eco Warrior', minPoints: 50, color: 'bg-blue-500' },
    { name: 'Green Champion', minPoints: 200, color: 'bg-green-500' },
    { name: 'Recycling Hero', minPoints: 500, color: 'bg-purple-500' },
  ];

  const currentLevel = levels.find(l => l.name === user?.level) || levels[0];
  const nextLevel = levels[levels.findIndex(l => l.name === user?.level) + 1];
  const progress = nextLevel 
    ? ((user?.points - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
    : 100;

  const allBadges = [
    { name: 'Eco Starter', description: 'Join WasteChain', icon: Star, earned: true },
    { name: 'Eco Warrior', description: 'Earn 50 points', icon: Award, earned: user?.points >= 50 },
    { name: 'Green Champion', description: 'Earn 200 points', icon: Trophy, earned: user?.points >= 200 },
    { name: 'Recycling Hero', description: 'Earn 500 points', icon: Target, earned: user?.points >= 500 },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Rewards & Achievements</h1>

          {/* Points Card */}
          <Card className="mb-8 bg-gradient-to-br from-primary-500 to-green-600 text-white">
            <div className="text-center py-8">
              <Award className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-5xl font-bold mb-2">{user?.points || 0}</h2>
              <p className="text-xl">Total Points Earned</p>
            </div>
          </Card>

          {/* Level Progress */}
          <Card className="mb-8">
            <h3 className="text-xl font-bold mb-4">Your Level</h3>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-2xl font-bold">{currentLevel.name}</p>
                {nextLevel && (
                  <p className="text-gray-600 dark:text-gray-400">
                    {nextLevel.minPoints - user?.points} points to {nextLevel.name}
                  </p>
                )}
              </div>
              <div className={`w-16 h-16 ${currentLevel.color} rounded-full flex items-center justify-center text-white`}>
                <Trophy className="w-8 h-8" />
              </div>
            </div>
            
            {nextLevel && (
              <div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                  <div
                    className="bg-primary-600 h-4 rounded-full transition-all"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {progress.toFixed(0)}% to next level
                </p>
              </div>
            )}
          </Card>

          {/* Badges */}
          <Card className="mb-8">
            <h3 className="text-xl font-bold mb-4">Badges Collection</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {allBadges.map((badge, idx) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border-2 ${
                      badge.earned
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                        : 'border-gray-300 dark:border-gray-700 opacity-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        badge.earned ? 'bg-primary-600 text-white' : 'bg-gray-300 dark:bg-gray-700'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold">{badge.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{badge.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Points Breakdown */}
          <Card>
            <h3 className="text-xl font-bold mb-4">How to Earn Points</h3>
            <div className="space-y-3">
              {[
                { category: 'Plastic', points: 10 },
                { category: 'Paper', points: 8 },
                { category: 'Metal', points: 20 },
                { category: 'Glass', points: 12 },
                { category: 'E-waste', points: 25 },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="font-medium">{item.category}</span>
                  <span className="text-primary-600 font-bold">+{item.points} points/kg</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
