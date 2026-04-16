import { apiRequest } from '../api/client';
import { handleApiError } from '../utils/errorHandler';

export const AuthService = {
  async signup(data: { name: string; email: string; password: string; phone?: string; role: string; avatar?: string | null }) {
    try {
      console.log('📝 Signup attempt with data:', { ...data, password: '***' });
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Signup failed:', error);
        throw new Error(error.message || 'Signup failed');
      }

      const result = await response.json();
      const { token, user } = result.data;

      if (token && user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        console.log('✅ User signed up successfully:', {
          email: user.email,
          role: user.role?.role_name || user.role || 'NO_ROLE',
        });
      }

      return { token, user };
    } catch (error: any) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  async login(email: string, password: string) {
    try {
      console.log('🔐 Login attempt for:', email);
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Login failed:', error);
        throw new Error(error.message || 'Login failed');
      }

      const result = await response.json();
      const { token, user } = result.data;

      if (token && user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        console.log('✅ User logged in successfully:', {
          email: user.email,
          role: user.role?.role_name || user.role || 'NO_ROLE',
          userId: user._id,
        });
        console.log('📦 User object stored:', user);
      }

      return { token, user };
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async getAvailableRoles() {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE_URL}/auth/roles`);

      if (!response.ok) {
        throw new Error('Failed to fetch roles');
      }

      const result = await response.json();
      return result.data || [];
    } catch (error: any) {
      console.error('Error fetching roles:', error);
      return [];
    }
  },

  async logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  isAuthenticated() {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  },

  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },

  getUser() {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  setAuthData(token: string, user: any) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
  },

  async getCurrentUser() {
    try {
      const response = await apiRequest('/auth/me');
      return response.user || response;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },
};

