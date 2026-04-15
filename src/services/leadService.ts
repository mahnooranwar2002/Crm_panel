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
      // Backend returns: { statusCode, data: { leads: [], pagination: {} }, message, success }
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  async getLeadById(id: string) {
    try {
      const response = await apiRequest(`/leads/${id}`);
      // Backend returns: { statusCode, data: {...}, message, success }
      return response.data;
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
      // Backend returns: { statusCode: 201, data: {...}, message, success }
      return response.data;
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
      // Backend returns: { statusCode: 200, data: {...}, message, success }
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  async deleteLead(id: string) {
    try {
      const response = await apiRequest(`/leads/${id}`, { method: 'DELETE' });
      // Backend returns: { statusCode: 200, data: null, message, success }
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },
};