import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { Clock, User, Hash } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import toast from 'react-hot-toast';

export default function AdminLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getAllLogs()
      .then(({ data }) => setLogs(data))
      .catch(() => toast.error('Failed to load logs'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">Traceability Logs</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Blockchain-style audit trail of all waste actions</p>

          {loading ? (
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-xl h-24 shadow" />)}
            </div>
          ) : logs.length === 0 ? (
            <Card><p className="text-center text-gray-500 py-12">No logs found.</p></Card>
          ) : (
            <div className="space-y-4">
              {logs.map((log, idx) => (
                <Card key={log._id} className="border-l-4 border-primary-500">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 dark:text-white">{log.action}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-mono mt-1">Waste: {log.wasteId}</p>
                      <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {log.performedBy?.name || 'Unknown'} ({log.performedByRole})
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                        <Hash className="w-3 h-3" />
                        {log.currentHash?.substring(0, 20)}...
                      </p>
                      <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">
                        prev: {log.previousHash?.substring(0, 16)}...
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
