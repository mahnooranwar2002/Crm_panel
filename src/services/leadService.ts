import { apiRequest } from '@/src/api/client';

export const LeadService = {
  async getLeads(page = 1, limit = 10) {
    // Backend returns { success, data: { leads, pagination }, message }
    const response = await apiRequest(`/leads?page=${page}&limit=${limit}`, {
      method: 'GET',
    });
    return response.data; 
  },

  async getLeadById(id: string) {
    const response = await apiRequest(`/leads/${id}`, {
      method: 'GET',
    });
    return response.data;
  },

  async createLead(leadData: any) {
    const response = await apiRequest('/leads', {
      method: 'POST',
      body: JSON.stringify(leadData),
    });
    return response.data;
  },

  async updateLead(id: string, leadData: any) {
    const response = await apiRequest(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(leadData),
    });
    return response.data;
  },

  async deleteLead(id: string) {
    return await apiRequest(`/leads/${id}`, {
      method: 'DELETE',
    });
  },
};