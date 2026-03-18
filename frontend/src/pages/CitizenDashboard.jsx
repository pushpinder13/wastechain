import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { wasteAPI } from '../services/api';
import { Trash2, Award, TrendingUp, Package, BarChart, ExternalLink } from 'lucide-react';
import { Bar, BarChart as ReBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Card from '../components/Card';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';

export default function CitizenDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, points: 0, recycled: 0 });
  const [chartData, setChartData] = useState([]);
  const [recentWaste, setRecentWaste] = useState([]);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const { data } = await wasteAPI.getAll({ userId: user._id });
      setRecentWaste(data.slice(0, 3));
      
      const recycledCount = data.filter(w => w.status === 'Recycled').length;
      setStats({
        total: data.length,
        points: user.points,
        recycled: recycledCount
      });

      // Process data for the chart
      const categoryCounts = data.reduce((acc, waste) => {
        acc[waste.category] = (acc[waste.category] || 0) + 1;
        return acc;
      }, {});

      setChartData(Object.keys(categoryCounts).map(key => ({ name: key, count: categoryCounts[key] })));

    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const statCards = [
    { icon: Trash2, label: 'Total Submissions', value: stats.total, color: 'text-blue-500' },
    { icon: Award, label: 'EcoPoints Earned', value: stats.points, color: 'text-amber-500' },
    { icon: Package, label: 'Items Recycled', value: stats.recycled, color: 'text-green-500' },
    { icon: TrendingUp, label: 'Current Level', value: user?.level || 'Eco Starter', color: 'text-violet-500' },
  ];

  const statusColors = {
    'Submitted': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
    'Pickup Scheduled': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200',
    'Collected': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200',
    'Delivered to Recycler': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200',
    'Recycled': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200',
  };

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Welcome back, {user?.name}! 👋</h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, idx) => (
              <Card key={idx} className="flex items-center p-4">
                <div className={`p-3 rounded-full bg-opacity-20 ${stat.color.replace('text-', 'bg-')}`}>
                   <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Chart and Badges */}
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <BarChart className="w-6 h-6 mr-2 text-primary-600"/>
                  Your Submissions by Category
                </h2>
                <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                      <YAxis stroke="#6b7280" fontSize={12}/>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          backdropFilter: 'blur(5px)',
                          border: '1px solid #e5e7eb',
                          borderRadius: '0.5rem',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="count" name="Submissions" fill="#16a34a" radius={[4, 4, 0, 0]} />
                    </ReBarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {user?.badges && user.badges.length > 0 && (
                <Card>
                  <h2 className="text-xl font-bold mb-4">Your Badges 🏆</h2>
                  <div className="flex flex-wrap gap-4">
                    {user.badges.map((badge, idx) => (
                      <div key={idx} className="flex items-center space-x-3 bg-yellow-100 dark:bg-yellow-900/50 p-3 rounded-lg">
                        <Award className="w-8 h-8 text-yellow-500"/>
                        <div>
                          <p className="font-semibold text-yellow-800 dark:text-yellow-200">{badge.name}</p>
                          <p className="text-xs text-yellow-600 dark:text-yellow-400">Earned: {new Date(badge.earnedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Right Column: Recent Submissions */}
            <div className="lg:col-span-1">
              <Card>
                <h2 className="text-xl font-bold mb-4">Recent Submissions</h2>
                {recentWaste.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">No submissions yet. Time to recycle!</p>
                ) : (
                  <div className="space-y-4">
                    {recentWaste.map((waste) => (
                      <Link to={`/track/${waste.wasteId}`} key={waste._id} className="block p-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex items-center justify-between">
                            <p className="font-semibold text-sm text-gray-700 dark:text-gray-200">{waste.category} - {waste.weight}kg</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[waste.status]}`}>
                              {waste.status}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{new Date(waste.createdAt).toLocaleDateString()}</p>
                      </Link>
                    ))}
                     <Link to="/my-submissions" className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 mt-4">
                      View All Submissions <ExternalLink className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
