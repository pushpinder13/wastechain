import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import InfoPage from './pages/InfoPage';
import CitizenDashboard from './pages/CitizenDashboard';
import CollectorDashboard from './pages/CollectorDashboard';
import SubmitWastePage from './pages/SubmitWastePage';
import MySubmissionsPage from './pages/MySubmissionsPage';
import TrackWastePage from './pages/TrackWastePage';
import RewardsPage from './pages/RewardsPage';
import AdminAnalytics from './pages/AdminAnalytics';
import AboutPage from './pages/AboutPage';
import FeaturesPage from './pages/FeaturesPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import ProfilePage from './pages/ProfilePage';
import PickupsPage from './pages/PickupsPage';
import MyCollectionsPage from './pages/MyCollectionsPage';
import IncomingWastePage from './pages/IncomingWastePage';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminWastePage from './pages/AdminWastePage';
import AdminLogsPage from './pages/AdminLogsPage';

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

// Dashboard Router
function DashboardRouter() {
  const { user } = useAuth();
  if (user?.role === 'collector') return <CollectorDashboard />;
  if (user?.role === 'admin') return <AdminDashboard />;
  return <CitizenDashboard />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Toaster position="top-right" />
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/info" element={<InfoPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardRouter />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/submit-waste"
              element={
                <ProtectedRoute allowedRoles={['citizen']}>
                  <SubmitWastePage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/my-submissions"
              element={
                <ProtectedRoute allowedRoles={['citizen']}>
                  <MySubmissionsPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/rewards"
              element={
                <ProtectedRoute allowedRoles={['citizen']}>
                  <RewardsPage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/analytics"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminAnalytics />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/pickups"
              element={
                <ProtectedRoute allowedRoles={['collector']}>
                  <PickupsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-collections"
              element={
                <ProtectedRoute allowedRoles={['collector']}>
                  <MyCollectionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/incoming-waste"
              element={
                <ProtectedRoute allowedRoles={['recycler']}>
                  <IncomingWastePage />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/admin-users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminUsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-waste"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminWastePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-logs"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLogsPage />
                </ProtectedRoute>
              }
            />
            
            <Route path="/track/:id" element={<TrackWastePage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
