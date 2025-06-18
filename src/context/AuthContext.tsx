import React, { createContext, useContext, useReducer, useCallback, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginCredentials, RegisterData } from '../types/auth';
import { authService } from '../services/auth.service';
import { mockAuthService } from '../services/auth.service.mock';
import { config } from '../services';
import { showToast, toastMessages } from '../utils/toast';

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User };

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading true to check existing auth
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    
    default:
      return state;
  }
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Get the appropriate auth service
  const getAuthService = () => config.useMockAuth ? mockAuthService : authService;

  const login = useCallback(async (credentials: LoginCredentials) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const authSvc = getAuthService();
      const response = await authSvc.login(credentials);
      
      if (response.success) {
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: { 
            user: response.data.user, 
            token: response.data.token 
          } 
        });
        showToast.success(`¡Bienvenido, ${response.data.user.name}!`);
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error de autenticación';
      dispatch({ type: 'SET_ERROR', payload: message });
      showToast.error(message);
      throw error;
    }
  }, []);

  const register = useCallback(async (userData: RegisterData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const authSvc = getAuthService();
      const response = await authSvc.register(userData);
      
      if (response.success) {
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: { 
            user: response.data.user, 
            token: response.data.token 
          } 
        });
        showToast.success(`¡Cuenta creada exitosamente! Bienvenido, ${response.data.user.name}!`);
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error en el registro';
      dispatch({ type: 'SET_ERROR', payload: message });
      showToast.error(message);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const authSvc = getAuthService();
      await authSvc.logout();
      dispatch({ type: 'LOGOUT' });
      showToast.info('Sesión cerrada correctamente');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state
      dispatch({ type: 'LOGOUT' });
      showToast.warning('Sesión cerrada localmente');
    }
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const authSvc = getAuthService();
      const response = await authSvc.refreshToken();
      
      if (response.success) {
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: { 
            user: response.data.user, 
            token: response.data.token 
          } 
        });
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      dispatch({ type: 'LOGOUT' });
      throw error;
    }
  }, []);

  const checkAuth = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const authSvc = getAuthService();
      
      if (authSvc.isAuthenticated()) {
        const user = authSvc.getUser();
        const token = authSvc.getToken();
        
        if (user && token) {
          dispatch({ 
            type: 'LOGIN_SUCCESS', 
            payload: { user, token } 
          });
          return;
        }
      }
      
      // No valid authentication found
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Auth check failed:', error);
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshToken,
    clearError,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}