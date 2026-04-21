import { apiRequest } from '../api/client';

export const CompanyService = {
  async getCompanies(page = 1, limit = 10, search = '') {
    return await apiRequest(`/companies?page=${page}&limit=${limit}&search=${search}`);
  },

  async getCompanyById(id: string) {
    return await apiRequest(`/companies/${id}`);
  },

  async createCompany(companyData: any) {
    return await apiRequest('/companies', {
      method: 'POST',
      body: JSON.stringify(companyData),
    });
  },

  async updateCompany(id: string, companyData: any) {
    return await apiRequest(`/companies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(companyData),
    });
  },

  async deleteCompany(id: string) {
    return await apiRequest(`/companies/${id}`, {
      method: 'DELETE',
    });
  },
};