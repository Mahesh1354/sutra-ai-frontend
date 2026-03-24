import api from './api';
import config from '../config';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const refreshToken = async () => {
  try {
    const response = await api.post('/auth/refresh-token');
    const { token } = response.data;
    localStorage.setItem(config.STORAGE_KEYS.TOKEN, token);
    return token;
  } catch (error) {
    localStorage.removeItem(config.STORAGE_KEYS.TOKEN);
    localStorage.removeItem(config.STORAGE_KEYS.USER);
    window.location.href = '/login';
    throw error;
  }
};

// Add to api.js interceptors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        const newToken = await refreshToken();
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);