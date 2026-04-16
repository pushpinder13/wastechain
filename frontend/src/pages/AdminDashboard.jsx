import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { Users, Trash2, TrendingUp, Award, ArrowRight, FileText } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getAnalytics()
      .then(({ data }) => setAnalytics(data))
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Total Submissions', value: analytics?.totalWaste || 0, icon: Trash2, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Total Weight (kg)', value: analytics?.totalWeight?.toFixed(1) || 0, icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Total Points Awarded', value: analytics?.totalPoints || 0, icon: Award, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
    { label: 'Total Users', value: analytics?.usersByRole?.reduce((s, u) => s + u.count, 0) || 0, icon: Users, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  ];

  const quickLinks = [
    { to: '/analytics', label: 'View Analytics', desc: 'Charts, trends, top recyclers', icon: TrendingUp, color: 'border-green-500' },
    { to: '/admin-users', label: 'Manage Users', desc: 'Approve recyclers, delete users', icon: Users, color: 'border-blue-500' },
    { to: '/admin-waste', label: 'All Waste', desc: 'View and update waste status', icon: Trash2, color: 'border-orange-500' },
    { to: '/admin-logs', label: 'Traceability Logs', desc: 'Blockchain audit trail', icon: FileText, color: 'border-purple-500' },
  ];

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">System overview and management</p>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((s, i) => (
              <Card key={i} className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${s.bg}`}>
                  <s.icon className={`w-6 h-6 ${s.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
                  {loading ? (
                    <div className="animate-pulse h-7 w-16 bg-gray-200 dark:bg-gray-700 rounded mt-1" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{s.value}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Users by Role */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            <Card>
              <h2 className="text-lg font-bold mb-4">Users by Role</h2>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => <div key={i} className="animate-pulse h-10 bg-gray-100 dark:bg-gray-700 rounded-lg" />)}
                </div>
              ) : (
                <div className="space-y-3">
                  {(['citizen', 'collector', 'recycler', 'admin']).map(role => {
                    const count = analytics?.usersByRole?.find(u => u._id === role)?.count || 0;
                    const colors = { citizen: 'bg-blue-500', collector: 'bg-green-500', recycler: 'bg-orange-500', admin: 'bg-purple-500' };
                    return (
                      <div key={role} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${colors[role]}`} />
                          <span className="capitalize font-medium">{role}</span>
                        </div>
                        <span className="font-bold text-gray-700 dark:text-gray-200">{count}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            <Card>
              <h2 className="text-lg font-bold mb-4">Waste by Status</h2>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => <div key={i} className="animate-pulse h-10 bg-gray-100 dark:bg-gray-700 rounded-lg" />)}
                </div>
              ) : (
                <div className="space-y-3">
                  {analytics?.wasteByStatus?.map(s => {
                    const colors = { 'Submitted': 'bg-blue-500', 'Pickup Scheduled': 'bg-yellow-500', 'Collected': 'bg-orange-500', 'Delivered to Recycler': 'bg-purple-500', 'Recycled': 'bg-green-500' };
                    return (
                      <div key={s._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${colors[s._id] || 'bg-gray-400'}`} />
                          <span className="font-medium text-sm">{s._id}</span>
                        </div>
                        <span className="font-bold text-gray-700 dark:text-gray-200">{s.count}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>

          {/* Quick Links */}
          <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link) => (
              <Link key={link.to} to={link.to}>
                <Card className={`border-l-4 ${link.color} hover:shadow-lg transition-shadow cursor-pointer h-full`}>
                  <link.icon className="w-8 h-8 text-gray-500 dark:text-gray-400 mb-3" />
                  <p className="font-bold text-gray-800 dark:text-white">{link.label}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{link.desc}</p>
                  <div className="flex items-center gap-1 mt-3 text-primary-600 text-sm font-medium">
                    Go <ArrowRight className="w-4 h-4" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
