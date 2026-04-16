import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { Trash2, CheckCircle, Search, UserCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import toast from 'react-hot-toast';

const roleBadge = { citizen: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', collector: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', recycler: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200', admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' };

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const { data } = await adminAPI.getAllUsers();
      setUsers(data);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  const handleApprove = async (id) => {
    try {
      await adminAPI.approveRecycler(id);
      setUsers(users.map(u => u._id === id ? { ...u, isApproved: true } : u));
      toast.success('Recycler approved!');
    } catch { toast.error('Failed to approve'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;
    try {
      await adminAPI.deleteUser(id);
      setUsers(users.filter(u => u._id !== id));
      toast.success('User deleted');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete'); }
  };

  const filtered = users.filter(u => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = !filterRole || u.role === filterRole;
    return matchSearch && matchRole;
  });

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">Manage Users</h1>

          <div className="flex flex-wrap gap-3 mb-6">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input className="input pl-9" placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="input w-auto" value={filterRole} onChange={e => setFilterRole(e.target.value)}>
              <option value="">All Roles</option>
              {['citizen', 'collector', 'recycler', 'admin'].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-xl h-16 shadow" />)}
            </div>
          ) : filtered.length === 0 ? (
            <Card><p className="text-center text-gray-500 py-12">No users found.</p></Card>
          ) : (
            <Card className="overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 uppercase text-xs">
                    <tr>
                      <th className="px-6 py-3 text-left">User</th>
                      <th className="px-6 py-3 text-left">Role</th>
                      <th className="px-6 py-3 text-left">Points</th>
                      <th className="px-6 py-3 text-left">Status</th>
                      <th className="px-6 py-3 text-left">Joined</th>
                      <th className="px-6 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {filtered.map(u => (
                      <tr key={u._id} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                              <UserCircle className="w-5 h-5 text-primary-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800 dark:text-white">{u.name}</p>
                              <p className="text-gray-500 dark:text-gray-400 text-xs">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${roleBadge[u.role]}`}>{u.role}</span>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-700 dark:text-gray-300">{u.points}</td>
                        <td className="px-6 py-4">
                          {u.role === 'recycler' ? (
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.isApproved ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                              {u.isApproved ? 'Approved' : 'Pending'}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {u.role === 'recycler' && !u.isApproved && (
                              <Button onClick={() => handleApprove(u._id)} variant="success" className="text-xs py-1 px-2 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> Approve
                              </Button>
                            )}
                            {u.role !== 'admin' && (
                              <Button onClick={() => handleDelete(u._id)} variant="danger" className="text-xs py-1 px-2 flex items-center gap-1">
                                <Trash2 className="w-3 h-3" /> Delete
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
