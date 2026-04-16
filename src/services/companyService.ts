import { apiRequest } from '../api/client';
import { handleApiError } from '../utils/errorHandler';

export const CompanyService = {
  async getCompanies(page = 1, limit = 10, search = '') {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      });

      const response = await apiRequest(`/companies?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  async getCompanyById(id: string) {
    try {
      const response = await apiRequest(`/companies/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  },

  async createCompany(companyData: any) {
    try {
      console.log('📊 Create Company Request:', companyData);
      const token = localStorage.getItem('token');
      const userJson = localStorage.getItem('user');
      const user = userJson ? JSON.parse(userJson) : null;

      console.log('  Token present:', !!token);
      console.log('  User:', user?.email);
      console.log('  User role:', user?.role?.role_name || user?.role || 'NO_ROLE');

      const response = await apiRequest('/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companyData),
      });

      console.log('✅ Company created successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ Create Company Error:', {
        message: error.message,
        status: error.status,
        fullError: error,
      });
      throw new Error(handleApiError(error));
    }
  },

  async updateCompany(id: string, companyData: any) {
    try {
      console.log('✏️ Update Company Request - ID:', id, 'Data:', companyData);
      const response = await apiRequest(`/companies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(companyData),
      });

      console.log('✅ Company updated successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ Update Company Error:', {
        message: error.message,
        status: error.status,
      });
      throw new Error(handleApiError(error));
    }
  },

  async deleteCompany(id: string) {
    try {
      console.log('🗑️ Delete Company Request - ID:', id);
      const response = await apiRequest(`/companies/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('✅ Company deleted successfully');
      return response.data;
    } catch (error: any) {
      console.error('❌ Delete Company Error:', {
        message: error.message,
        status: error.status,
      });
      throw new Error(handleApiError(error));
    }
  },
};
