import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const apiInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

apiInstance.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    console.warn("Cleared invalid/expired token. Retrying as guest.");
    // Remove the auth header and retry the original request
    const config = error.config;
    delete config.headers['Authorization'];
    return apiInstance(config);
  }
  return Promise.reject(error.response?.data || error.message);
});

const extractData = (res: any) => res.data;

export const api = {
  auth: {
    register: (data: any) => apiInstance.post('/auth/register', data).then(extractData),
    login: (data: any) => apiInstance.post('/auth/login', data).then(extractData),
  },
  tasks: {
    getAll: () => apiInstance.get('/tasks').then(extractData),
    create: (data: any) => apiInstance.post('/tasks', data).then(extractData),
    update: (id: string, data: any) => apiInstance.put(`/tasks/${id}`, data).then(extractData),
    delete: (id: string) => apiInstance.delete(`/tasks/${id}`).then(extractData),
  },
  goals: {
    getAll: () => apiInstance.get('/goals').then(extractData),
    create: (data: any) => apiInstance.post('/goals', data).then(extractData),
    update: (id: string, data: any) => apiInstance.put(`/goals/${id}`, data).then(extractData),
    delete: (id: string) => apiInstance.delete(`/goals/${id}`).then(extractData),
  },
  wellness: {
    getAll: () => apiInstance.get('/wellness').then(extractData),
    create: (data: any) => apiInstance.post('/wellness', data).then(extractData),
  },
  routines: {
    getAll: () => apiInstance.get('/routines').then(extractData),
    create: (data: any) => apiInstance.post('/routines', data).then(extractData),
    update: (id: string, data: any) => apiInstance.put(`/routines/${id}`, data).then(extractData),
    delete: (id: string) => apiInstance.delete(`/routines/${id}`).then(extractData),
  },
  team: {
    getAll: () => apiInstance.get('/team').then(extractData),
    create: (data: any) => apiInstance.post('/team', data).then(extractData),
  },
  shopping: {
    getAll: () => apiInstance.get('/shopping').then(extractData),
    create: (data: any) => apiInstance.post('/shopping', data).then(extractData),
    update: (id: string, data: any) => apiInstance.put(`/shopping/${id}`, data).then(extractData),
  },
  expenses: {
    getAll: () => apiInstance.get('/expenses').then(extractData),
    create: (data: any) => apiInstance.post('/expenses', data).then(extractData),
    delete: (id: string) => apiInstance.delete(`/expenses/${id}`).then(extractData),
  },
  documents: {
    getAll: () => apiInstance.get('/documents').then(extractData),
    create: (data: any) => apiInstance.post('/documents', data).then(extractData),
    update: (id: string, data: any) => apiInstance.put(`/documents/${id}`, data).then(extractData),
  },
  messages: {
    getAll: () => apiInstance.get('/messages').then(extractData),
    create: (data: any) => apiInstance.post('/messages', data).then(extractData),
  },
};
