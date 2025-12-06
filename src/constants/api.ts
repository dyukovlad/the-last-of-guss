export const API_BASE_URL = 'http://v2991160.hosted-by-vdsina.ru';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    ME: '/api/v1/auth/me',
    LOGOUT: '/api/v1/auth/logout'
  },
  ROUNDS: {
    LIST: '/api/v1/rounds',
    CREATE: '/api/v1/rounds',
    TAP: (id: string) => `/api/v1/rounds/${id}/tap`,
    DETAILS: (id: string) => `/api/v1/rounds/${id}`
  }
} as const;