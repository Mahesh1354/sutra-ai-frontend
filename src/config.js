const config = {
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  API_ENDPOINTS: {
    // Auth
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    VALIDATE_TOKEN: '/auth/validate',
    
    // Chat
    SEND_MESSAGE: '/chat/send',
    CONVERSATIONS: '/chat/conversations',
    CONVERSATION_MESSAGES: (id) => `/chat/conversations/${id}/messages`,
    DELETE_CONVERSATION: (id) => `/chat/conversations/${id}`,
    UPDATE_CONVERSATION: (id) => `/chat/conversations/${id}`,
    PIN_CONVERSATION: (id) => `/chat/conversations/${id}/pin`,
    EDIT_MESSAGE: (id) => `/chat/messages/${id}`,
    DELETE_MESSAGE: (id) => `/chat/messages/${id}`,
    SEARCH_MESSAGES: (id) => `/chat/conversations/${id}/search`,
    EXPORT_CONVERSATION: (id) => `/chat/conversations/${id}/export`,
    CLEAR_ALL_HISTORY: '/chat/conversations',
  },
  PROMPT_TYPES: {
    GENERAL: 'general',
    CODING: 'coding',
    CREATIVE: 'creative',
  },
  STORAGE_KEYS: {
    TOKEN: 'aura_token',
    USER: 'aura_user',
  },
};

export default config;