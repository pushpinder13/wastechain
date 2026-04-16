import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Trash2, 
  QrCode, 
  TrendingUp, 
  Users, 
  Award,
  Truck,
  Building2,
  UserCircle,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  const citizenLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/submit-waste', icon: Trash2, label: 'Submit Waste' },
    { to: '/my-submissions', icon: QrCode, label: 'My Submissions' },
    { to: '/rewards', icon: Award, label: 'Rewards' },
    { to: '/profile', icon: UserCircle, label: 'Profile' },
  ];

  const collectorLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/pickups', icon: Truck, label: 'Pickups' },
    { to: '/my-collections', icon: QrCode, label: 'My Collections' },
  ];

  const recyclerLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/incoming-waste', icon: Building2, label: 'Incoming Waste' },
  ];

  const adminLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/analytics', icon: TrendingUp, label: 'Analytics' },
    { to: '/admin-users', icon: Users, label: 'Users' },
    { to: '/admin-waste', icon: Trash2, label: 'All Waste' },
    { to: '/admin-logs', icon: FileText, label: 'Logs' },
  ];

  const getLinks = () => {
    switch (user?.role) {
      case 'collector': return collectorLinks;
      case 'recycler': return recyclerLinks;
      case 'admin': return adminLinks;
      default: return citizenLinks;
    }
  };

  const links = getLinks();

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen p-4">
      <div className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;
          
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
