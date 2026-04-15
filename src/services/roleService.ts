import { apiRequest } from '../api/client';
import { handleApiError } from '../utils/errorHandler';

export const RoleService = {
  async getRoles(page = 1, limit = 10, search = '', status = '') {
    try {
      const params: any = { page, limit };
      if (search) params.search = search;
      if (status !== '') params.status = status;
      
      const queryString = new URLSearchParams(params).toString();
      const response = await apiRequest(`/roles${queryString ? '?' + queryString : ''}`);
      // Backend returns: { statusCode, data: { roles: [], pagination: {} }, message, success }
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  async getRoleById(id: string) {
    try {
      const response = await apiRequest(`/roles/${id}`);
      // Backend returns: { statusCode, data: {...}, message, success }
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  async createRole(roleData: any) {
    try {
      const response = await apiRequest('/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roleData),
      });
      // Backend returns: { statusCode: 201, data: {...}, message, success }
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  async updateRole(id: string, roleData: any) {
    try {
      const response = await apiRequest(`/roles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roleData),
      });
      // Backend returns: { statusCode: 200, data: {...}, message, success }
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  async deleteRole(id: string) {
    try {
      const response = await apiRequest(`/roles/${id}`, { method: 'DELETE' });
      // Backend returns: { statusCode: 200, data: null, message, success }
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },
};

