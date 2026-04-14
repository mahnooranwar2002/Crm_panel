import { apiRequest } from '../api/client';
import { handleApiError } from '../utils/errorHandler';

export const LeadService = {
  async getLeads(page = 1, limit = 10, search = '', status = '', source = '') {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(status && { status }),
        ...(source && { source }),
      });

      const response = await apiRequest(`/leads?${params.toString()}`);
      // Consistent return: hamesha leads array aur meta data return karein
      return response.data || response;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  async getLeadById(id: string) {
    try {
      const response = await apiRequest(`/leads/${id}`);
      return response.data || response;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  async createLead(leadData: any) {
    try {
      const response = await apiRequest('/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
      });
      return response.data || response;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  async updateLead(id: string, leadData: any) {
    try {
      const response = await apiRequest(`/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
      });
      return response.data || response;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  async deleteLead(id: string) {
    try {
      await apiRequest(`/leads/${id}`, { method: 'DELETE' });
      return true;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },
};