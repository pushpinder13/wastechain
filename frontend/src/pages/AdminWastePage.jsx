import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { wasteAPI } from '../services/api';
import { Eye, Search } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import toast from 'react-hot-toast';

const statusColors = { 'Submitted': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', 'Pickup Scheduled': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', 'Collected': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200', 'Delivered to Recycler': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', 'Recycled': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
const statuses = ['Submitted', 'Pickup Scheduled', 'Collected', 'Delivered to Recycler', 'Recycled'];

export default function AdminWastePage() {
  const [waste, setWaste] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => { load(); }, [page, filterStatus, filterCategory, search]);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await wasteAPI.getAll({ page, limit: 15, status: filterStatus, category: filterCategory, search });
      setWaste(data.waste || data);
      setTotalPages(data.pages || 1);
    } catch { toast.error('Failed to load waste'); }
    finally { setLoading(false); }
  };

  const handleStatusChange = async (wasteId, status) => {
    try {
      await wasteAPI.updateStatus(wasteId, { status });
      setWaste(waste.map(w => w.wasteId === wasteId ? { ...w, status } : w));
      toast.success(`Status updated to ${status}`);
    } catch { toast.error('Failed to update status'); }
  };

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">All Waste Submissions</h1>

          <div className="flex flex-wrap gap-3 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input className="input pl-9" placeholder="Search by ID or description..." value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && load()} />
            </div>
            <select className="input w-auto" value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}>
              <option value="">All Statuses</option>
              {statuses.map(s => <option key={s}>{s}</option>)}
            </select>
            <select className="input w-auto" value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setPage(1); }}>
              <option value="">All Categories</option>
              {['Plastic', 'Paper', 'Metal', 'Glass', 'E-waste'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(8)].map((_, i) => <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-xl h-14 shadow" />)}
            </div>
          ) : waste.length === 0 ? (
            <Card><p className="text-center text-gray-500 py-12">No waste submissions found.</p></Card>
          ) : (
            <>
              <Card className="overflow-hidden p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-xs">
                      <tr>
                        <th className="px-6 py-3 text-left">Waste ID</th>
                        <th className="px-6 py-3 text-left">Category</th>
                        <th className="px-6 py-3 text-left">Weight</th>
                        <th className="px-6 py-3 text-left">Submitted By</th>
                        <th className="px-6 py-3 text-left">Status</th>
                        <th className="px-6 py-3 text-left">Date</th>
                        <th className="px-6 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {waste.map(w => (
                        <tr key={w._id} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="px-6 py-4 font-mono text-xs text-gray-600 dark:text-gray-400">{w.wasteId}</td>
                          <td className="px-6 py-4 font-medium">{w.category}</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{w.weight}kg</td>
                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-800 dark:text-white">{w.userId?.name || '—'}</p>
                            <p className="text-xs text-gray-500">{w.userId?.email || ''}</p>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={w.status}
                              onChange={e => handleStatusChange(w.wasteId, e.target.value)}
                              className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer ${statusColors[w.status]}`}
                            >
                              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </td>
                          <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">{new Date(w.createdAt).toLocaleDateString()}</td>
                          <td className="px-6 py-4">
                            <Link to={`/track/${w.wasteId}`} className="flex items-center gap-1 text-primary-600 hover:text-primary-700 text-xs font-medium">
                              <Eye className="w-4 h-4" /> Track
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-6">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn btn-secondary disabled:opacity-50">Previous</button>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Page {page} of {totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="btn btn-secondary disabled:opacity-50">Next</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
