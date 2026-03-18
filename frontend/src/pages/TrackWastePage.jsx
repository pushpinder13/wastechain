import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { wasteAPI } from '../services/api';
import { Package, User, Clock, CheckCircle } from 'lucide-react';
import Card from '../components/Card';

export default function TrackWastePage() {
  const { id } = useParams();
  const [waste, setWaste] = useState(null);
  const [trace, setTrace] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [wasteRes, traceRes] = await Promise.all([
        wasteAPI.getById(id),
        wasteAPI.getTrace(id)
      ]);
      setWaste(wasteRes.data);
      setTrace(traceRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!waste) {
    return <div className="min-h-screen flex items-center justify-center">Waste not found</div>;
  }

  const statusSteps = [
    'Submitted',
    'Pickup Scheduled',
    'Collected',
    'Delivered to Recycler',
    'Recycled'
  ];

  const currentStepIndex = statusSteps.indexOf(waste.status);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Track Your Waste</h1>

        {/* Waste Details */}
        <Card className="mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              {waste.imageUrl && (
                <img
                  src={waste.imageUrl}
                  alt="Waste"
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              )}
              {waste.qrCode && (
                <div className="bg-white p-4 rounded-lg">
                  <img src={waste.qrCode} alt="QR Code" className="w-full" />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">{waste.wasteId}</h2>
                <p className="text-gray-600 dark:text-gray-400">Waste Tracking ID</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
                  <p className="font-medium">{waste.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Weight</p>
                  <p className="font-medium">{waste.weight} kg</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <p className="font-medium text-primary-600">{waste.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Points</p>
                  <p className="font-medium text-yellow-600">+{waste.pointsAwarded}</p>
                </div>
              </div>

              {waste.description && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Description</p>
                  <p className="font-medium">{waste.description}</p>
                </div>
              )}

              {waste.userId && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Submitted By</p>
                  <p className="font-medium">{waste.userId.name}</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Status Timeline */}
        <Card className="mb-8">
          <h3 className="text-xl font-bold mb-6">Lifecycle Status</h3>
          <div className="space-y-4">
            {statusSteps.map((step, idx) => {
              const isCompleted = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-6 h-6" /> : <div className="w-3 h-3 rounded-full bg-gray-400" />}
                  </div>
                  <div className="ml-4 flex-1">
                    <p className={`font-medium ${isCurrent ? 'text-primary-600' : ''}`}>
                      {step}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Blockchain Traceability */}
        <Card>
          <h3 className="text-xl font-bold mb-6">Blockchain Traceability Log</h3>
          <div className="space-y-4">
            {trace.map((log, idx) => (
              <div key={log._id} className="border-l-4 border-primary-600 pl-4 py-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{log.action}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {log.performedBy?.name} ({log.performedByRole})
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 font-mono">
                      Hash: {log.currentHash?.substring(0, 32)}...
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
