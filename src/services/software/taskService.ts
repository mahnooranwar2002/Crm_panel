import { apiRequest } from '@/src/api/client';

export const TaskService = {
  // Get all tasks
  getAllTasks: async (page = 1, limit = 100) => {
    try {
      const response = await apiRequest(`/software/tasks?page=${page}&limit=${limit}`);
      return response;
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  // Get tasks by project
  getTasksByProject: async (projectName: string) => {
    try {
      const response = await apiRequest(`/software/tasks/project/${projectName}`);
      return response;
    } catch (error: any) {
      console.error('Error fetching project tasks:', error);
      throw error;
    }
  },

  // Get tasks by role
  getTasksByRole: async (role: string) => {
    try {
      const response = await apiRequest(`/software/tasks/role/${role}`);
      return response;
    } catch (error: any) {
      console.error('Error fetching role tasks:', error);
      throw error;
    }
  },

  // Get tasks by status
  getTasksByStatus: async (status: string) => {
    try {
      const response = await apiRequest(`/software/tasks/status/${status}`);
      return response;
    } catch (error: any) {
      console.error('Error fetching status tasks:', error);
      throw error;
    }
  },

  // Create new task
  createTask: async (taskData: any) => {
    try {
      const response = await apiRequest('/software/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData)
      });
      return response;
    } catch (error: any) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Update task
  updateTask: async (id: string, taskData: any) => {
    try {
      const response = await apiRequest(`/software/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(taskData)
      });
      return response;
    } catch (error: any) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  // Delete task
  deleteTask: async (id: string) => {
    try {
      const response = await apiRequest(`/software/tasks/${id}`, {
        method: 'DELETE'
      });
      return response;
    } catch (error: any) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
};
