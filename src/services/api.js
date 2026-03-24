import axios from 'axios';
import config from '../config';

const api = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Flag to prevent multiple token refresh attempts
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

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(config.STORAGE_KEYS?.TOKEN || 'aura_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't redirect on login/register endpoints
      const isAuthEndpoint = originalRequest.url.includes('/auth/');
      
      if (isAuthEndpoint) {
        return Promise.reject(error);
      }
      
      if (isRefreshing) {
        // Queue the request while token is being refreshed
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
        // Try to refresh token (if you have refresh endpoint)
        // For now, just clear storage and redirect
        localStorage.removeItem('aura_token');
        localStorage.removeItem('aura_user');
        
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        
        return Promise.reject(error);
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    // Handle network errors
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      console.error('Network error:', error);
      // Don't redirect on network errors, just reject
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  register: (userData) => api.post(config.API_ENDPOINTS.REGISTER, userData),
  login: (credentials) => api.post(config.API_ENDPOINTS.LOGIN, credentials),
  validateToken: () => {
    const token = localStorage.getItem('aura_token');
    if (!token) {
      return Promise.reject(new Error('No token found'));
    }
    return api.get(config.API_ENDPOINTS.VALIDATE_TOKEN);
  },
};

// Chat Services
export const chatService = {
  sendMessage: (messageData) => api.post(config.API_ENDPOINTS.SEND_MESSAGE, messageData),
  
  getConversations: (page = 1, limit = 20) => 
    api.get(`${config.API_ENDPOINTS.CONVERSATIONS}?page=${page}&limit=${limit}`),
  
  getConversationMessages: (conversationId, page = 1, limit = 50) => 
    api.get(`${config.API_ENDPOINTS.CONVERSATION_MESSAGES(conversationId)}?page=${page}&limit=${limit}`),
  
  deleteConversation: (conversationId) => 
    api.delete(config.API_ENDPOINTS.DELETE_CONVERSATION(conversationId)),
  
  updateConversation: (conversationId, data) => 
    api.patch(config.API_ENDPOINTS.UPDATE_CONVERSATION(conversationId), data),
  
  pinConversation: (conversationId) => 
    api.patch(config.API_ENDPOINTS.PIN_CONVERSATION(conversationId)),
  
  editMessage: (messageId, content) => 
    api.put(config.API_ENDPOINTS.EDIT_MESSAGE(messageId), { content }),
  
  deleteMessage: (messageId) => 
    api.delete(config.API_ENDPOINTS.DELETE_MESSAGE(messageId)),
  
  searchMessages: (conversationId, query) => 
    api.get(`${config.API_ENDPOINTS.SEARCH_MESSAGES(conversationId)}?q=${encodeURIComponent(query)}`),
  
  exportConversation: (conversationId, format = 'markdown') => 
    api.get(`${config.API_ENDPOINTS.EXPORT_CONVERSATION(conversationId)}?format=${format}`, {
      responseType: format === 'markdown' ? 'text' : 'json',
    }),
  
  clearAllHistory: () => 
    api.delete(config.API_ENDPOINTS.CLEAR_ALL_HISTORY),
};

export default api;