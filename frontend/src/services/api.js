import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

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
  approveRecycler: (id) => api.put(`/admin/users/${id}/approve`),
  getAllLogs: () => api.get('/admin/logs'),
};

export default api;

