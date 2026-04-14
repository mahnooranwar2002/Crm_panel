import { apiRequest } from '../api/client';
import { handleApiError } from '../utils/errorHandler';

export const AuthService = {
  async login(email: string, password: string) {
    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
      
      return {
        success: true,
        token: response.token,
        user: response.user,
      };
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  async logout() {
    try {
      await apiRequest('/auth/logout', {
        method: 'POST',
      });
      localStorage.removeItem('authToken');
      return true;
    } catch (error: any) {
      localStorage.removeItem('authToken');
      throw new Error(handleApiError(error));
    }
  },

  isAuthenticated() {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('authToken');
  },

  async getCurrentUser() {
    try {
      const response = await apiRequest('/auth/me');
      return response.user || response;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  async register(userData: any) {
    try {
      const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
      
      return {
        success: true,
        token: response.token,
        user: response.user,
      };
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },
};

