import { apiRequest } from '../api/client';
import { handleApiError } from '../utils/errorHandler';

export const OpportunityService = {
  async getOpportunities(page = 1, limit = 10, search = '', stage = '') {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(stage && { stage }),
      });

      const response = await apiRequest(`/opportunities?${params.toString()}`);
      return response.data || response;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  async getOpportunityById(id: string) {
    try {
      const response = await apiRequest(`/opportunities/${id}`);
      return response.data || response;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  async createOpportunity(opportunityData: any) {
    try {
      const response = await apiRequest('/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(opportunityData),
      });
      return response.data || response;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  async updateOpportunity(id: string, opportunityData: any) {
    try {
      const response = await apiRequest(`/opportunities/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(opportunityData),
      });
      return response.data || response;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  async deleteOpportunity(id: string) {
    try {
      await apiRequest(`/opportunities/${id}`, { method: 'DELETE' });
      return true;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },
};