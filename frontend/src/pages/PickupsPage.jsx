import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { wasteAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MapPin, Phone, Package } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import toast from 'react-hot-toast';

export default function PickupsPage() {
  const { user } = useAuth();
  const [waste, setWaste] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const { data } = await wasteAPI.getAll({ status: 'Submitted', page: 1, limit: 50 });
      setWaste(data.waste || data);
    } catch { toast.error('Failed to load pickups'); }
    finally { setLoading(false); }
  };

  const accept = async (wasteId) => {
    try {
      await wasteAPI.updateStatus(wasteId, { status: 'Pickup Scheduled', collectorId: user._id });
      toast.success('Pickup accepted!');
      load();
    } catch { toast.error('Failed to accept pickup'); }
  };

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Available Pickups</h1>
        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-xl h-40 shadow" />)}
          </div>
        ) : waste.length === 0 ? (
          <Card><p className="text-center text-gray-500 py-12">No pickups available right now.</p></Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {waste.map(w => (
              <Card key={w._id}>
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <Link to={`/track/${w.wasteId}`} className="font-semibold text-primary-600 hover:underline">{w.wasteId}</Link>
                    <div className="flex gap-2 text-sm">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">{w.category}</span>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">{w.weight}kg</span>
                    </div>
                    <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin className="w-4 h-4" />{w.location?.address || 'N/A'}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1"><Phone className="w-4 h-4" />{w.userId?.phone || 'N/A'}</p>
                  </div>
                  <Button onClick={() => accept(w.wasteId)} variant="primary" size="sm">Accept</Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
