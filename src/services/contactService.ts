import { apiRequest } from '../api/client';

export const ContactService = {
  async getContacts(page = 1, limit = 100) {
    const response = await apiRequest(`/contacts?page=${page}&limit=${limit}`, {
      method: 'GET',
    });
    
    return {
      contacts: response?.data?.contacts || [],
      pagination: response?.data?.pagination || { total: 0, page, limit },
    };
  },

  async getContactById(id: string) {
    const response = await apiRequest(`/contacts/${id}`, {
      method: 'GET',
    });
    return response?.data;
  },

  async createContact(contactData: any) {
    return await apiRequest('/contacts', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  },

  async updateContact(id: string, contactData: any) {
    return await apiRequest(`/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contactData),
    });
  },

  async deleteContact(id: string) {
    return await apiRequest(`/contacts/${id}`, {
      method: 'DELETE',
    });
  },
};
