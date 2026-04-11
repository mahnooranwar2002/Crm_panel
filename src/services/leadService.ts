import { apiRequest } from '../api/client';
import { handleApiError } from '../utils/errorHandler';

export const LeadService = {
  async getLeads(page = 1, limit = 10, search = '', status = '', source = '') {
    try {
      const params: any = { page, limit };
      if (search) params.search = search;
      if (status) params.status = status;
      if (source) params.source = source;
      
      const queryString = new URLSearchParams(params).toString();
      const response = await apiRequest(`/leads${queryString ? '?' + queryString : ''}`);
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  async getLeadById(id: string) {
    try {
      const response = await apiRequest(`/leads/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },
};

