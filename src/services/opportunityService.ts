import { apiRequest } from '../api/client';
import { handleApiError } from '../utils/errorHandler';

export const OpportunityService = {
  async getOpportunities(page = 1, limit = 10, search = '', stage = '') {
    try {
      const params: any = { page, limit };
      if (search) params.search = search;
      if (stage) params.stage = stage;
      
      const queryString = new URLSearchParams(params).toString();
      const response = await apiRequest(`/opportunities${queryString ? '?' + queryString : ''}`);
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  async getOpportunityById(id: string) {
    try {
      const response = await apiRequest(`/opportunities/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },
};

