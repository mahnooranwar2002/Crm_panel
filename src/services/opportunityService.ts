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
      // Backend returns: { statusCode, data: { opportunities: [], pagination: {} }, message, success }
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  async getOpportunityById(id: string) {
    try {
      const response = await apiRequest(`/opportunities/${id}`);
      // Backend returns: { statusCode, data: {...}, message, success }
      return response.data;
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
      // Backend returns: { statusCode: 201, data: {...}, message, success }
      return response.data;
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
      // Backend returns: { statusCode: 200, data: {...}, message, success }
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  async deleteOpportunity(id: string) {
    try {
      const response = await apiRequest(`/opportunities/${id}`, { method: 'DELETE' });
      // Backend returns: { statusCode: 200, data: null, message, success }
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },
};