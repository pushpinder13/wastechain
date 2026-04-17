import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { wasteAPI } from '../services/api';
import { QrCode, Eye, Trash2, Calendar, Weight, Search } from 'lucide-react';
import Card from '../components/Card';
import Sidebar from '../components/Sidebar';
import ConfirmationModal from '../components/ConfirmationModal';
import toast from 'react-hot-toast';

export default function MySubmissionsPage() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const { data } = await wasteAPI.getAll({ userId: user._id, limit: 1000 });
      setSubmissions(data.waste || data);
    } catch (error) {
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setSubmissionToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (submissionToDelete) {
      try {
        await wasteAPI.delete(submissionToDelete);
        setSubmissions(submissions.filter((s) => s._id !== submissionToDelete));
        toast.success('Submission deleted');
      } catch (error) {
        toast.error('Failed to delete submission');
      } finally {
        setIsModalOpen(false);
        setSubmissionToDelete(null);
      }
    }
  };

  const statusColors = {
    'Submitted': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Pickup Scheduled': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'Collected': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    'Delivered to Recycler': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'Recycled': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  };

  const categoryColors = {
    'Plastic': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'Paper': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'Metal': 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    'Glass': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
    'E-waste': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-xl h-64 shadow" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const filtered = submissions.filter(w => {
    const matchSearch = !search || w.wasteId.toLowerCase().includes(search.toLowerCase()) || w.description?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || w.status === filterStatus;
    const matchCategory = !filterCategory || w.category === filterCategory;
    return matchSearch && matchStatus && matchCategory;
  });

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">My Submissions</h1>
            <Link to="/submit-waste" className="btn btn-primary">Submit New Waste</Link>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input className="input pl-9" placeholder="Search by ID or description..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="input w-auto" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">All Statuses</option>
              {['Submitted','Pickup Scheduled','Collected','Delivered to Recycler','Recycled'].map(s => <option key={s}>{s}</option>)}
            </select>
            <select className="input w-auto" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
              <option value="">All Categories</option>
              {['Plastic','Paper','Metal','Glass','E-waste'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          {filtered.length === 0 ? (
            <Card>
              <div className="text-center py-16">
                <QrCode className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold mb-3">No submissions yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Ready to make a difference? Submit your first recyclable waste.
                </p>
                <Link to="/submit-waste" className="btn btn-primary">
                  Submit Waste
                </Link>
              </div>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((waste) => (
                <Card key={waste._id} className="flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300">
                  <div>
                    {waste.imageUrl && (
                      <img
                        src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${waste.imageUrl}`}
                        alt="Waste"
                        className="w-full h-48 object-cover rounded-t-xl mb-4"
                      />
                    )}
                    
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${categoryColors[waste.category]}`}>
                          {waste.category}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[waste.status]}`}>
                          {waste.status}
                        </span>
                      </div>

                      <p className="font-mono text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                        {waste.wasteId}
                      </p>

                      <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                        <div className="flex items-center space-x-2">
                          <Weight className="w-5 h-5 text-primary-500"/>
                          <span className="font-medium">{waste.weight}kg</span>
                        </div>
                        <div className="flex items-center space-x-2">
                           <Calendar className="w-5 h-5 text-primary-500"/>
                           <span className="font-medium">{new Date(waste.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                       <div className="text-right">
                         <span className="text-lg font-bold text-green-500">
                          +{waste.pointsAwarded} pts
                        </span>
                       </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <div className="flex items-center space-x-2">
                        <Link
                          to={`/track/${waste.wasteId}`}
                          className="btn btn-secondary w-full flex items-center justify-center"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Track
                        </Link>
                        <button
                          onClick={() => handleDelete(waste._id)}
                          className="btn btn-danger-outline w-auto px-3"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={confirmDelete}
          title="Confirm Deletion"
          message="Are you sure you want to delete this submission? This will permanently remove the item and deduct the points awarded. This action cannot be undone."
        />
      </div>
    </div>
  );
}
