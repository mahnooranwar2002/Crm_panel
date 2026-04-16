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

  // async createLead(leadData: any) {
  //   try {
  //     const response = await apiRequest('/leads', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(leadData),
  //     });
  //     // Backend returns: { statusCode: 201, data: {...}, message, success }
  //     return response.data;
  //   } catch (error: any) {
  //     throw new Error(handleApiError(error));
  //   }
  // },

  async createLead(leadData: any) {
    try {
      // DEBUG: Check if token and user role are available
      const token = localStorage.getItem('token');
      const userJson = localStorage.getItem('user');
      const user = userJson ? JSON.parse(userJson) : null;
      
      console.log('📊 Create Lead Request:');
      console.log('  Token present:', !!token);
      console.log('  User:', user?.email);
      console.log('  User role:', user?.role?.role_name || user?.role || 'NO_ROLE');
      console.log('  Lead data:', leadData);
      
      const response = await apiRequest('/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
      });
      
      console.log('✅ Lead created successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ Create Lead Error:', {
        message: error.message,
        status: error.status,
        fullError: error,
      });
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