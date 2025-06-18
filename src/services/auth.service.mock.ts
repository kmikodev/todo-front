import { User, LoginCredentials, RegisterData, AuthResponse } from '../types/auth';
import { config } from './index';

// Mock users database
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@todoapp.com',
    name: 'Administrador',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00.000Z',
    lastLogin: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'user@todoapp.com',
    name: 'Usuario Demo',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    role: 'user',
    createdAt: '2024-01-15T00:00:00.000Z',
    lastLogin: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'maria@todoapp.com',
    name: 'María García',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    role: 'user',
    createdAt: '2024-02-01T00:00:00.000Z',
    lastLogin: '2024-06-17T10:30:00.000Z',
  },
];

// Mock passwords (in real app, these would be hashed)
const mockPasswords: Record<string, string> = {
  'admin@todoapp.com': 'admin123',
  'user@todoapp.com': 'user123',
  'maria@todoapp.com': 'maria123',
};

class MockAuthService {
  private delay(ms: number = 800): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateToken(user: User): string {
    // Simple mock token (in real app, use JWT)
    return btoa(JSON.stringify({ 
      userId: user.id, 
      email: user.email, 
      exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    }));
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await this.delay();

    const { email, password } = credentials;

    // Find user
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Check password
    if (mockPasswords[user.email] !== password) {
      throw new Error('Contraseña incorrecta');
    }

    // Update last login
    user.lastLogin = new Date().toISOString();

    // Generate token
    const token = this.generateToken(user);

    // Store in localStorage
    this.setToken(token);
    this.setUser(user);

    return {
      success: true,
      data: {
        user,
        token,
      },
      message: 'Login exitoso',
    };
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    await this.delay();

    const { name, email, password, confirmPassword } = userData;

    // Validation
    if (password !== confirmPassword) {
      throw new Error('Las contraseñas no coinciden');
    }

    if (password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      throw new Error('El usuario ya existe');
    }

    // Create new user
    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      email: email.toLowerCase(),
      name,
      role: 'user',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    // Add to mock database
    mockUsers.push(newUser);
    mockPasswords[newUser.email] = password;

    // Generate token
    const token = this.generateToken(newUser);

    // Store in localStorage
    this.setToken(token);
    this.setUser(newUser);

    return {
      success: true,
      data: {
        user: newUser,
        token,
      },
      message: 'Registro exitoso',
    };
  }

  async logout(): Promise<void> {
    await this.delay(300);
    this.clearAuth();
  }

  async refreshToken(): Promise<AuthResponse> {
    await this.delay(500);

    const user = this.getUser();
    if (!user) {
      throw new Error('No hay usuario autenticado');
    }

    // Generate new token
    const token = this.generateToken(user);
    this.setToken(token);

    return {
      success: true,
      data: {
        user,
        token,
      },
      message: 'Token renovado',
    };
  }

  async getCurrentUser(): Promise<User> {
    await this.delay(300);

    const user = this.getUser();
    if (!user) {
      throw new Error('No hay usuario autenticado');
    }

    return user;
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
    
    if (!token || !user) return false;

    // Check token expiration (mock)
    try {
      const tokenData = JSON.parse(atob(token));
      return tokenData.exp > Date.now();
    } catch {
      return false;
    }
  }

  // Get authorization header
  getAuthHeader(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Get mock users for demo purposes
  getMockUsers(): Array<{ email: string; password: string; name: string; role: string }> {
    return [
      { email: 'admin@todoapp.com', password: 'admin123', name: 'Administrador', role: 'admin' },
      { email: 'user@todoapp.com', password: 'user123', name: 'Usuario Demo', role: 'user' },
      { email: 'maria@todoapp.com', password: 'maria123', name: 'María García', role: 'user' },
    ];
  }
}

export const mockAuthService = new MockAuthService();