import axios from 'axios';
import { io } from 'socket.io-client';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
});

export const socket = io(BASE_URL, { autoConnect: false });

// Request interceptor to add token to headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => {
    const form = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v !== undefined && v !== null) form.append(k, v); });
    return api.put('/auth/profile', form, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  changePassword: (data) => api.put('/auth/change-password', data),
};


// Waste API
export const wasteAPI = {
  create: (formData) => api.post('/waste', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAll: (params) => api.get('/waste', { params }),
  getById: (id) => api.get(`/waste/${id}`),
  delete: (id) => api.delete(`/waste/${id}`),
  updateStatus: (id, data) => api.put(`/waste/${id}/status`, data),
  getTrace: (id) => api.get(`/waste/${id}/trace`),
  getNearby: () => api.get('/waste/nearby'),
  getCollectorStats: () => api.get('/waste/stats/collector'),
  getRecyclerStats: () => api.get('/waste/stats/recycler'),
};

// AI API
export const aiAPI = {
  analyzeImage: (formData) => api.post('/ai/analyze-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// Admin API
export const adminAPI = {
  getAnalytics: () => api.get('/admin/analytics'),
  getAllUsers: () => api.get('/admin/users'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  approveRecycler: (id) => api.put(`/admin/users/${id}/approve`),
  getAllLogs: () => api.get('/admin/logs'),
  exportCSV: () => api.get('/admin/export-csv', { responseType: 'blob' }),
};

export default api;

