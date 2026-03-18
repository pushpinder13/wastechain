import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Trash2, Award } from 'lucide-react';
import Card from '../components/Card';
import Sidebar from '../components/Sidebar';

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const { data } = await adminAPI.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="text-center">Loading analytics...</div>
        </div>
      </div>
    );
  }

  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  const categoryData = analytics?.wasteByCategory?.map(item => ({
    name: item._id,
    value: item.count,
    weight: item.weight
  })) || [];

  const statusData = analytics?.wasteByStatus?.map(item => ({
    name: item._id,
    value: item.count
  })) || [];

  const monthlyData = analytics?.monthlyTrends?.map(item => ({
    month: `${item._id.month}/${item._id.year}`,
    count: item.count,
    weight: item.weight
  })) || [];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Total Waste</p>
                  <p className="text-2xl font-bold mt-1">{analytics?.totalWaste || 0}</p>
                </div>
                <Trash2 className="w-10 h-10 text-blue-600" />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Total Weight</p>
                  <p className="text-2xl font-bold mt-1">{analytics?.totalWeight?.toFixed(1) || 0} kg</p>
                </div>
                <TrendingUp className="w-10 h-10 text-green-600" />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Total Points</p>
                  <p className="text-2xl font-bold mt-1">{analytics?.totalPoints || 0}</p>
                </div>
                <Award className="w-10 h-10 text-yellow-600" />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Active Users</p>
                  <p className="text-2xl font-bold mt-1">
                    {analytics?.usersByRole?.reduce((sum, u) => sum + u.count, 0) || 0}
                  </p>
                </div>
                <Users className="w-10 h-10 text-purple-600" />
              </div>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Waste by Category */}
            <Card>
              <h3 className="text-lg font-bold mb-4">Waste by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            {/* Waste by Status */}
            <Card>
              <h3 className="text-lg font-bold mb-4">Waste by Status</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Monthly Trends */}
          <Card className="mb-8">
            <h3 className="text-lg font-bold mb-4">Monthly Recycling Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#22c55e" name="Count" />
                <Line type="monotone" dataKey="weight" stroke="#3b82f6" name="Weight (kg)" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Top Users */}
          <Card>
            <h3 className="text-lg font-bold mb-4">Top Recyclers 🏆</h3>
            <div className="space-y-3">
              {analytics?.topUsers?.map((user, idx) => (
                <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-600">{user.points} pts</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{user.level}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
