import axios from 'axios';

const API_BASE_URL = 'https://wedev-api.sky.pro/api/fitness';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      credentials: 'omit',
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Ошибка входа');
    }
    return data;
  },

  register: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      credentials: 'omit',
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Ошибка регистрации');
    }
    return data;
  },
};

export default api;
