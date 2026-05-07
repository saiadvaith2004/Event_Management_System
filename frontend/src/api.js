import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const eventApi = {
  list: () => api.get('/events'),
  listAll: () => api.get('/events/all'),
  details: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  approve: (id) => api.patch(`/events/${id}/approve`),
  reject: (id) => api.patch(`/events/${id}/reject`),
  delete: (id) => api.delete(`/events/${id}`),
  listMyEvents: (organizerId) => api.get(`/events/my-events/${organizerId}`),
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/events/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

export const registrationApi = {
  register: (eventId, user) => api.post(`/registrations/events/${eventId}/register`, user),
  cancel: (id) => api.post(`/registrations/${id}/cancel`),
};

export const resourceApi = {
  list: () => api.get('/resources'),
};

export const bookingApi = {
  request: (data) => api.post('/bookings', data),
  approve: (id) => api.patch(`/bookings/${id}/approve`),
  reject: (id) => api.patch(`/bookings/${id}/reject`),
};

export const authApi = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    return res;
  },
  register: async (data) => {
    const res = await api.post('/auth/register', data);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    return res;
  },
};

export const userApi = {
  listPending: () => api.get('/users/pending'),
  approve: (id) => api.patch(`/users/${id}/approve`),
  reject: (id) => api.patch(`/users/${id}/reject`),
};

export const dashboardApi = {
  stats: () => api.get('/dashboard/stats'),
};

export default api;
