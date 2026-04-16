import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { wasteAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Eye, Calendar, Weight } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import toast from 'react-hot-toast';

const statusColors = {
  'Pickup Scheduled': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'Collected': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  'Delivered to Recycler': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  'Recycled': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};

export default function MyCollectionsPage() {
  const { user } = useAuth();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await wasteAPI.getAll({ collectorId: user._id, limit: 50 });
        setCollections(data.waste || data);
      } catch { toast.error('Failed to load collections'); }
      finally { setLoading(false); }
    };
    if (user) load();
  }, [user]);

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">My Collections</h1>
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-xl h-40 shadow" />)}
          </div>
        ) : collections.length === 0 ? (
          <Card><p className="text-center text-gray-500 py-12">No collections yet. Accept pickups to get started!</p></Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map(w => (
              <Card key={w._id}>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-sm text-gray-500">{w.wasteId}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[w.status] || ''}`}>{w.status}</span>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1"><Weight className="w-4 h-4" />{w.weight}kg</span>
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{new Date(w.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs">{w.category}</span>
                  <Link to={`/track/${w.wasteId}`} className="btn btn-secondary w-full flex items-center justify-center gap-2 text-sm">
                    <Eye className="w-4 h-4" /> View Details
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
