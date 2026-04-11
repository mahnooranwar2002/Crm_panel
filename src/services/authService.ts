import { apiRequest } from '../api/client';
import { handleApiError } from '../utils/errorHandler';

// Fake login for demo
export const AuthService = {
  async login(email: string, password: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Fake successful login
    const fakeToken = 'fake-jwt-token-for-demo';
    localStorage.setItem('authToken', fakeToken);
    
    return {
      success: true,
      token: fakeToken,
      user: {
        id: 'demo-user',
        name: 'Demo User',
        email: email,
        role: 'admin'
      }
    };
  },

  logout() {
    localStorage.removeItem('authToken');
  },

  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  },

  getCurrentUser() {
    return {
      id: 'demo-user',
      name: 'Demo User',
      email: 'demo@example.com',
      role: 'admin'
    };
  }
};

