import { User, LoginCredentials, RegisterData, AuthResponse } from '../types/auth';
import { config } from './index';

class AuthService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.apiUrl;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      
      // Store token and user data
      if (data.success && data.data.token) {
        this.setToken(data.data.token);
        this.setUser(data.data.user);
      }

      return data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Network error');
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      
      // Store token and user data
      if (data.success && data.data.token) {
        this.setToken(data.data.token);
        this.setUser(data.data.user);
      }

      return data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Network error');
    }
  }

  async logout(): Promise<void> {
    try {
      const token = this.getToken();
      if (token) {
        await fetch(`${this.baseUrl}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.warn('Logout request failed:', error);
    } finally {
      this.clearAuth();
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No token available');
      }

      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      
      if (data.success && data.data.token) {
        this.setToken(data.data.token);
        this.setUser(data.data.user);
      }

      return data;
    } catch (error) {
      this.clearAuth();
      throw new Error(error instanceof Error ? error.message : 'Token refresh failed');
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error('No token available');
      }

      const response = await fetch(`${this.baseUrl}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get user data');
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        this.setUser(data.data);
        return data.data;
      }

      throw new Error('Invalid user data received');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get user data');
    }
  }

  // Token management
  setToken(token: string): void {
    localStorage.setItem(config.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(config.tokenKey);
  }

  // User management
  setUser(user: User): void {
    localStorage.setItem(config.userKey, JSON.stringify(user));
  }

  getUser(): User | null {
    const userData = localStorage.getItem(config.userKey);
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch {
        return null;
      }
    }
    return null;
  }

  // Clear authentication data
  clearAuth(): void {
    localStorage.removeItem(config.tokenKey);
    localStorage.removeItem(config.userKey);
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  }

  // Get authorization header
  getAuthHeader(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

export const authService = new AuthService();