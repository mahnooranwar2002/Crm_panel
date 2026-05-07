import { apiRequest } from '../api/client';

export const RoleService = {
  async getRoles(page = 1, limit = 10) {
    const response = await apiRequest(`/roles?page=${page}&limit=${limit}`);
    return response;
  },

  async getRoleById(id: string) {
    const response = await apiRequest(`/roles/${id}`);
    return response;
  },

  async createRole(roleData: any) {
    const response = await apiRequest('/roles', {
      method: 'POST',
      body: JSON.stringify(roleData),
    });
    return response;
  },

  async updateRole(id: string, roleData: any) {
    const response = await apiRequest(`/roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(roleData),
    });
    return response;
  },

  async deleteRole(id: string) {
    const response = await apiRequest(`/roles/${id}`, {
      method: 'DELETE',
    });
    return response;
  },
};

