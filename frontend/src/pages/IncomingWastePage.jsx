import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { wasteAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Eye, CheckCircle, Calendar, Recycle, Weight, Package, TrendingUp } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import toast from 'react-hot-toast';

export default function IncomingWastePage() {
  const { user } = useAuth();
  const [waste, setWaste] = useState([]);
  const [stats, setStats] = useState({ totalRecycled: 0, incoming: 0, totalWeight: 0, byCategory: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const [wasteRes, statsRes] = await Promise.all([
        wasteAPI.getAll({ status: 'Delivered to Recycler', limit: 50 }),
        wasteAPI.getRecyclerStats()
      ]);
      setWaste(wasteRes.data.waste || wasteRes.data);
      setStats(statsRes.data);
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  const markRecycled = async (wasteId) => {
    try {
      await wasteAPI.updateStatus(wasteId, { status: 'Recycled', recyclerId: user._id });
      toast.success('Marked as Recycled!');
      load();
    } catch { toast.error('Failed to update status'); }
  };

  const statCards = [
    { icon: Recycle, label: 'Total Recycled', value: stats.totalRecycled, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
    { icon: Package, label: 'Incoming Now', value: stats.incoming, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { icon: Weight, label: 'Total Weight (kg)', value: stats.totalWeight?.toFixed(1) || 0, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  ];

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Recycling Center Dashboard</h1>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {statCards.map((s, i) => (
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Incoming Waste */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Incoming Waste ({waste.length})</h2>
              {loading ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-xl h-40 shadow" />)}
                </div>
              ) : waste.length === 0 ? (
                <Card><p className="text-center text-gray-500 py-12">No incoming waste at the moment.</p></Card>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {waste.map(w => (
                    <Card key={w._id}>
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <Link to={`/track/${w.wasteId}`} className="font-semibold text-primary-600 hover:underline">{w.wasteId}</Link>
                            <div className="flex gap-2 mt-1">
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">{w.category}</span>
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">{w.weight}kg</span>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />{new Date(w.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {w.description && <p className="text-sm text-gray-500">{w.description}</p>}
                        <div className="flex gap-2">
                          <Link to={`/track/${w.wasteId}`} className="btn btn-secondary flex-1 flex items-center justify-center gap-1 text-sm">
                            <Eye className="w-4 h-4" /> Track
                          </Link>
                          <Button onClick={() => markRecycled(w.wasteId)} variant="success" className="flex-1 flex items-center justify-center gap-1 text-sm">
                            <CheckCircle className="w-4 h-4" /> Mark Recycled
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Category Breakdown */}
            <div>
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Recycled by Category</h2>
              <Card>
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => <div key={i} className="animate-pulse h-10 bg-gray-100 dark:bg-gray-700 rounded-lg" />)}
                  </div>
                ) : stats.byCategory?.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No recycled waste yet.</p>
                ) : (
                  <div className="space-y-3">
                    {stats.byCategory?.map(c => (
                      <div key={c._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <span className="font-medium capitalize">{c._id}</span>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{c.count} items</p>
                          <p className="text-xs text-gray-500">{c.weight?.toFixed(1)}kg</p>
                        </div>
                      </div>
                    ))}
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
