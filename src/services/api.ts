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

export const usersApi = {
  getMe: () => api.get('/users/me'),

  addCourse: async (courseId: string) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/users/me/courses`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ courseId }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Ошибка добавления курса');
    }
    return response;
  },

  removeCourse: (courseId: string) => api.delete(`/users/me/courses/${courseId}`),

  getCourseProgress: (courseId: string) => api.get(`/users/me/progress?courseId=${courseId}`),

  saveWorkoutProgress: (courseId: string, workoutId: string, progressData: number[]) => {
    const token = localStorage.getItem('token');
    return fetch(`${API_BASE_URL}/courses/${courseId}/workouts/${workoutId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ progressData }), 
    }).then(async (res) => {
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка сохранения');
      }
      return res.json();
    });
  },

  getWorkoutProgress: (courseId: string, workoutId: string) =>
    api.get(`/users/me/progress?courseId=${courseId}&workoutId=${workoutId}`),
};

export const coursesApi = {
  getAll: () => api.get('/courses'),
  getById: (courseId: string) => api.get(`/courses/${courseId}`),
  getWorkouts: (courseId: string) => api.get(`/courses/${courseId}/workouts`),
};

export const workoutsApi = {
  getById: (workoutId: string) => api.get(`/workouts/${workoutId}`),
};

export default api;
