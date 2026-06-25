import axios from 'axios';
import { clearStoredToken, getStoredToken } from '@/lib/auth/token';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearStoredToken();

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('app:unauthorized'));
      }
    }

    return Promise.reject(error);
  },
);
