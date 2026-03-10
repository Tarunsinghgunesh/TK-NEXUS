import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth APIs
export const authAPI = {
  register: (email: string, password: string, businessName: string) =>
    api.post('/api/auth/register', { email, password, businessName }),
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),
  getMe: () => api.get('/api/auth/me'),
};

// Leads APIs
export const leadsAPI = {
  findLeads: (keywords: string, location: string, quantity: number) =>
    api.post('/api/leads/find', { keywords, location, quantity }),
  getAllLeads: () => api.get('/api/leads'),
  getLead: (id: string) => api.get(`/api/leads/${id}`),
  importLeads: (leads: any[]) => api.post('/api/leads/bulk', { leads }),
};

// Outreach APIs
export const outreachAPI = {
  sendMessage: (leadId: string, channel: string, message: string) =>
    api.post('/api/outreach/send', { leadId, channel, message }),
  getResults: () => api.get('/api/outreach/results'),
};

// Website APIs
export const websiteAPI = {
  generate: () => api.post('/api/website/generate'),
  getWebsite: () => api.get('/api/website'),
  publish: () => api.post('/api/website/publish'),
};

// AI APIs
export const aiAPI = {
  ask: (question: string) => api.post('/api/ai/ask', { question }),
  generateContent: (type: string, quantity: number) =>
    api.post('/api/ai/content/generate', { type, quantity }),
};

// Analytics APIs
export const analyticsAPI = {
  getSummary: () => api.get('/api/analytics/summary'),
  getTrends: (metric: string, period: string) =>
    api.get(`/api/analytics/trends?metric=${metric}&period=${period}`),
  getInsights: () => api.get('/api/analytics/insights'),
};
