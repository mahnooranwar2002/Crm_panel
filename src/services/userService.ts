import { apiRequest } from '@/src/api/client';

export const UserService = {
<<<<<<< HEAD
  async getSalesUsers(limit = 100) {
    try {
      const data = await UserService.getUsers(1, limit, '', '', 'Sales');
      return data;
      console.log("Sales Users:", data);
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
=======
  async getUsers(page = 1, limit = 10) {
    // API endpoint par page aur limit bhej rahe hain
    return apiRequest(`/users?page=${page}&limit=${limit}`, {
      method: 'GET',
    });
>>>>>>> origin/commandline
  },

  async createUser(userData: any) {
<<<<<<< HEAD
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
=======
    return apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
>>>>>>> origin/commandline
  },

  async updateUser(id: string, userData: any) {
    return apiRequest(`/users/${id}`, {
      method: 'PATCH',
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