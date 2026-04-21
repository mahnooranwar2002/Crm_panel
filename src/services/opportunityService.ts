import { apiRequest } from '../api/client';

export const OpportunityService = {
  async getOpportunities(page = 1, limit = 10) {
    // Backend API call
    const response = await apiRequest(`/opportunities?page=${page}&limit=${limit}`, {
      method: 'GET',
    });
    
    // Agar backend direct data.opportunities bhej raha hai:
    return {
      opportunities: response?.data?.opportunities || response?.opportunities || [],
      pagination: response?.data?.pagination || { total: 0, page, limit },
    };
  },

  async getOpportunityById(id: string) {
    const response = await apiRequest(`/opportunities/${id}`, {
      method: 'GET',
    });
    return response.data;
  },

  async createOpportunity(opportunityData: any) {
    return await apiRequest('/opportunities', {
      method: 'POST',
      body: JSON.stringify(opportunityData),
    });
  },

  async updateOpportunity(id: string, opportunityData: any) {
    return await apiRequest(`/opportunities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(opportunityData),
    });
  },

  async deleteOpportunity(id: string) {
    return await apiRequest(`/opportunities/${id}`, {
      method: 'DELETE',
    });
  },
};