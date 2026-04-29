import { apiRequest } from '@/src/api/client';

export const UserService = {
  async getUsers(page = 1, limit = 10) {
    // API endpoint par page aur limit bhej rahe hain
    return apiRequest(`/users?page=${page}&limit=${limit}`, {
      method: 'GET',
    });
  },

  async createUser(userData: any) {
    return apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async updateUser(id: string, userData: any) {
    return apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  async deleteUser(id: string) {
    return apiRequest(`/users/${id}`, {
      method: 'DELETE',
    });
  },

  async getUserById(id: string) {
    return apiRequest(`/users/${id}`, {
      method: 'GET',
    });
  }
};