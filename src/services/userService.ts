import { apiRequest } from '../api/client';
import { handleApiError } from '../utils/errorHandler';

export const UserService = {
  async getSalesUsers(limit = 100) {
    try {
      const data = await UserService.getUsers(1, limit, '', '', 'Sales');
      return data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },
  async createUser(userData: any) {
    try {
      const response = await apiRequest('/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      // Backend returns: { statusCode: 201, data: {...}, message, success }
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  async getUsers(page = 1, limit = 10, search = '', status = '', role?: string) {
    try {
      const params: any = { page, limit };
      if (search) params.search = search;
      if (status) params.status = status;
      if (role) params.role = role;
      
      const queryString = new URLSearchParams(params).toString();
      const response = await apiRequest(`/users${queryString ? '?' + queryString : ''}`);
      // Backend returns: { statusCode, data: { users: [], pagination: {} }, message, success }
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  async getUserById(id: string) {
    try {
      const response = await apiRequest(`/users/${id}`);
      // Backend returns: { statusCode, data: {...}, message, success }
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  async updateUser(id: string, userData: any) {
    try {
      const response = await apiRequest(`/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      // Backend returns: { statusCode: 200, data: {...}, message, success }
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  async deleteUser(id: string) {
    try {
      const response = await apiRequest(`/users/${id}`, { method: 'DELETE' });
      // Backend returns: { statusCode: 200, data: null, message, success }
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },
};

