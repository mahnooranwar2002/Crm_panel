import { apiRequest } from '../api/client';

export const OpportunityService = {
  async getOpportunities(page = 1, limit = 10) {
    const response = await apiRequest(`/opportunities?page=${page}&limit=${limit}`, {
      method: 'GET',
    });
    
    // Backend returns { success: true, data: { opportunities: [], pagination: {} } }
    return {
      opportunities: response?.data?.opportunities || [],
      pagination: response?.data?.pagination || { total: 0, page, limit },
    };
  },

  async getOpportunityById(id: string) {
    const response = await apiRequest(`/opportunities/${id}`, {
      method: 'GET',
    });
    return response?.data;
  },

  async createOpportunity(opportunityData: any) {
    if (!opportunityData.contactId || opportunityData.contactId === '') {
      throw new Error('Contact ID is required');
    }
    
    const payload = {
      title: opportunityData.title?.trim(),
      amount: Number(opportunityData.amount),
      probability: Number(opportunityData.probability),
      stage: opportunityData.stage,
      contactId: opportunityData.contactId.toString().trim(),
      owner_id: opportunityData.owner_id.toString().trim(),
      close_date: opportunityData.close_date,
    };
    
    console.log("🚀 CREATE Payload:", JSON.stringify(payload, null, 2));

    return await apiRequest('/opportunities', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateOpportunity(id: string, opportunityData: any) {
    if (!opportunityData.contactId || opportunityData.contactId === '') {
      throw new Error('Contact ID is required');
    }
    
    const payload = {
      title: opportunityData.title?.trim(),
      amount: Number(opportunityData.amount),
      probability: Number(opportunityData.probability),
      stage: opportunityData.stage,
      contactId: opportunityData.contactId.toString().trim(),
      owner_id: opportunityData.owner_id.toString().trim(),
      close_date: opportunityData.close_date,
    };
    
    console.log("🚀 UPDATE Payload:", JSON.stringify(payload, null, 2));
    
    return await apiRequest(`/opportunities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async deleteOpportunity(id: string) {
    return await apiRequest(`/opportunities/${id}`, {
      method: 'DELETE',
    });
  },
};