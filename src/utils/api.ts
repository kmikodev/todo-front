import { config } from '../services';
import { authService } from '../services/auth.service';
import { mockAuthService } from '../services/auth.service.mock';

const BASE_URL = 'https://todolistdb-api.cap.c2developers.com/api';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    // Get auth headers from the appropriate service
    const authSvc = config.useMockAuth ? mockAuthService : authService;
    const authHeaders = authSvc.getAuthHeader();

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(response.status, errorData.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(0, 'Network error or server unavailable');
  }
}