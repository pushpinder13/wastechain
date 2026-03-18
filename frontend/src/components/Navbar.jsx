import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Recycle, Moon, Sun, LogOut, User } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Recycle className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">WasteChain</span>
          </Link>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/about" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-500">
              About Us
            </Link>
            <Link to="/features" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-500">
              Features
            </Link>
            <Link to="/contact" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-500">
              Contact
            </Link>

            <Link to="/info" className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-500">
              Info
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <>
                <Link to="/dashboard" className="flex items-center space-x-2 hover:text-primary-600">
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary">Login</Link>
                <Link to="/register" className="btn-primary">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
