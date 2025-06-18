// Service configuration
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'https://todolistdb-api.cap.c2developers.com/api',
  useMockAuth: import.meta.env.VITE_USE_MOCK_AUTH === 'true' || true, // Default to mock for development
  tokenKey: 'todo_app_token',
  userKey: 'todo_app_user',
};