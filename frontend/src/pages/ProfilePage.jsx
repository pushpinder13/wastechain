import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import toast from 'react-hot-toast';
import { User, Lock, Save } from 'lucide-react';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState({ name: user?.name || '', phone: user?.phone || '', address: user?.address || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await authAPI.updateProfile(profile);
      setUser(data);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirm) {
      return toast.error('Passwords do not match');
    }
    setChangingPw(true);
    try {
      await authAPI.changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success('Password changed!');
      setPasswords({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPw(false);
    }
  };

  return (
    <div className="flex bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Profile</h1>

          <Card>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><User className="w-5 h-5" /> Personal Info</h2>
            <form onSubmit={handleProfileSave} className="space-y-4">
              {[['Full Name', 'name', 'text'], ['Phone', 'phone', 'tel'], ['Address', 'address', 'text']].map(([label, key, type]) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-1">{label}</label>
                  <input type={type} className="input" value={profile[key]} onChange={e => setProfile({ ...profile, [key]: e.target.value })} />
                </div>
              ))}
              <div className="pt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
                <p className="font-medium text-gray-700 dark:text-gray-300">{user?.email}</p>
              </div>
              <Button type="submit" disabled={saving} className="flex items-center gap-2">
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </Card>

          <Card>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Lock className="w-5 h-5" /> Change Password</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {[['Current Password', 'currentPassword'], ['New Password', 'newPassword'], ['Confirm New Password', 'confirm']].map(([label, key]) => (
                <div key={key}>
                  <label className="block text-sm font-medium mb-1">{label}</label>
                  <input type="password" className="input" value={passwords[key]} onChange={e => setPasswords({ ...passwords, [key]: e.target.value })} required minLength={key !== 'currentPassword' ? 6 : undefined} />
                </div>
              ))}
              <Button type="submit" disabled={changingPw} className="flex items-center gap-2">
                <Lock className="w-4 h-4" /> {changingPw ? 'Updating...' : 'Change Password'}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
