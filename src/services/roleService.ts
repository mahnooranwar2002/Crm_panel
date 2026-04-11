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
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  async getRoleById(id: string) {
    try {
      const response = await apiRequest(`/roles/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },
};

