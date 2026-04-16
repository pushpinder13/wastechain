import { useState, useEffect } from 'react';
import { wasteAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Truck, MapPin, Phone, CheckCircle, Package, DollarSign, ExternalLink } from 'lucide-react';
import Card from '../components/Card';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

export default function CollectorDashboard() {
  const { user } = useAuth();
  const [nearbyWaste, setNearbyWaste] = useState([]);
  const [scheduledPickups, setScheduledPickups] = useState([]);
  const [stats, setStats] = useState({ collectionsToday: 0, totalEarnings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(user) loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [nearbyRes, scheduledRes, statsRes] = await Promise.all([
        wasteAPI.getAll({ status: 'Submitted' }),
        wasteAPI.getAll({ collectorId: user._id, status: 'Pickup Scheduled' }),
        wasteAPI.getCollectorStats(),
      ]);
      setNearbyWaste(nearbyRes.data.waste || nearbyRes.data);
      setScheduledPickups(scheduledRes.data.waste || scheduledRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (wasteId, status) => {
    try {
      await wasteAPI.updateStatus(wasteId, { status, collectorId: user._id });
      loadData(); // Refresh all data
    } catch (error) {
      console.error(`Error updating status to ${status}:`, error);
      alert(`Failed to update status. Please try again.`);
    }
  };

  const statCards = [
    { icon: Truck, label: 'Available Pickups', value: nearbyWaste.length, color: 'text-blue-500' },
    { icon: CheckCircle, label: 'Collected Today', value: stats.collectionsToday, color: 'text-green-500' },
    { icon: DollarSign, label: 'Total Earnings', value: `$${stats.totalEarnings.toFixed(2)}`, color: 'text-amber-500' },
  ];

  const WasteCard = ({ waste, action }) => (
    <div className="border border-gray-200 dark:border-gray-700/50 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Link to={`/track/${waste.wasteId}`} className="font-semibold text-primary-600 hover:underline">{waste.wasteId}</Link>
          <div className="flex items-center space-x-2 mt-1 mb-2">
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded-full font-medium">
              {waste.category}
            </span>
            <span className="text-sm text-gray-500">{waste.weight}kg</span>
          </div>
          <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
            <p className="flex items-center"><MapPin className="w-4 h-4 mr-2" />{waste.location?.address || 'N/A'}</p>
            <p className="flex items-center"><Phone className="w-4 h-4 mr-2" />{waste.userId?.phone || 'N/A'}</p>
          </div>
        </div>
        <div className="ml-4">{action}</div>
      </div>
    </div>
  );

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Collector Dashboard</h1>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Scheduled Pickups */}
            <Card>
              <h2 className="text-xl font-bold mb-4">My Scheduled Pickups ({scheduledPickups.length})</h2>
              {loading ? <p>Loading...</p> : scheduledPickups.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">No pickups scheduled. Accept one from the available list!</p>
              ) : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  {scheduledPickups.map((waste) => (
                    <WasteCard key={waste._id} waste={waste} action={
                      <Button onClick={() => handleUpdateStatus(waste.wasteId, 'Collected')} variant="success" size="sm">
                        Mark Collected
                      </Button>
                    }/>
                  ))}
                </div>
              )}
            </Card>

            {/* Nearby Pickups */}
            <Card>
              <h2 className="text-xl font-bold mb-4">Available for Pickup ({nearbyWaste.length})</h2>
              {loading ? <p>Loading...</p> : nearbyWaste.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">No new pickups available right now.</p>
              ) : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  {nearbyWaste.map((waste) => (
                     <WasteCard key={waste._id} waste={waste} action={
                      <Button onClick={() => handleUpdateStatus(waste.wasteId, 'Pickup Scheduled')} variant="primary" size="sm">
                        Accept
                      </Button>
                    }/>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
