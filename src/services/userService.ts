import { apiRequest } from '../api/client';
import { handleApiError } from '../utils/errorHandler';

export const UserService = {
  async createUser(userData: any) {
    try {
      const response = await apiRequest('/users', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

    async getUsers(page = 1, limit = 10, search = '', status = '') {
    try {
      const params: any = { page, limit };
      if (search) params.search = search;
      if (status) params.status = status;
      
      const queryString = new URLSearchParams(params).toString();
      const response = await apiRequest(`/users${queryString ? '?' + queryString : ''}`);
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  async getUserById(id: string) {
    try {
      const response = await apiRequest(`/users/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  async updateUser(id: string, userData: any) {
    try {
      const response = await apiRequest(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      });
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  async deleteUser(id: string) {
    try {
      await apiRequest(`/users/${id}`, { method: 'DELETE' });
      return true;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },
};

