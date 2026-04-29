import { apiRequest } from '../../api/client';

export const SoftwareService = {
  // Get all software projects
  getSoftwareProjects: async (page = 1, limit = 100) => {
    try {
      const response = await apiRequest(`/software/projects?page=${page}&limit=${limit}`);
      return response;
    } catch (error) {
      console.error('Error fetching software projects:', error);
      throw error;
    }
  },

  // Get single software project
  getSoftwareProject: async (id: string) => {
    try {
      const response = await apiRequest(`/software/projects/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching software project:', error);
      throw error;
    }
  },

  // Create new software project
  createSoftwareProject: async (projectData: any) => {
    try {
      const response = await apiRequest('/software/projects', {
        method: 'POST',
        body: JSON.stringify(projectData)
      });
      return response;
    } catch (error) {
      console.error('Error creating software project:', error);
      throw error;
    }
  },

  // Update software project
  updateSoftwareProject: async (id: string, projectData: any) => {
    try {
      const response = await apiRequest(`/software/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(projectData)
      });
      return response;
    } catch (error) {
      console.error('Error updating software project:', error);
      throw error;
    }
  },

  // Delete software project
  deleteSoftwareProject: async (id: string) => {
    try {
      const response = await apiRequest(`/software/projects/${id}`, {
        method: 'DELETE'
      });
      return response;
    } catch (error) {
      console.error('Error deleting software project:', error);
      throw error;
    }
  }
};
