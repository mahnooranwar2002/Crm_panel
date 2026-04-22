// Seed data for project tasks
const tasksData = [
  {
    _id: '1',
    projectName: 'E-Commerce Platform',
    taskTitle: 'Setup Payment Gateway Integration',
    assignedTo: 'Developer - Ali Khan',
    role: 'Developer',
    description: 'Integrate Stripe payment gateway with checkout flow',
    priority: 'High',
    timeline: '2025-02-15',
    submissionDeadline: '2025-02-20',
    status: 'In Progress',
    assignedBy: 'Mam Mahnoor',
    estimatedHours: 16,
    completedPercentage: 65,
    notes: 'Need to handle error cases and webhook setup'
  },
  {
    _id: '2',
    projectName: 'E-Commerce Platform',
    taskTitle: 'Design Product Listing Pages',
    assignedTo: 'Designer - Sara Ahmed',
    role: 'Designer',
    description: 'Create responsive product listing UI with filters and sorting',
    priority: 'High',
    timeline: '2025-02-10',
    submissionDeadline: '2025-02-18',
    status: 'In Progress',
    assignedBy: 'Mam Mahnoor',
    estimatedHours: 24,
    completedPercentage: 45,
    notes: 'Include mobile-first design approach'
  },
  {
    _id: '3',
    projectName: 'E-Commerce Platform',
    taskTitle: 'Create Sales Strategy for Product Launch',
    assignedTo: 'Sales - Fatima Siddiqui',
    role: 'Sales',
    description: 'Develop go-to-market strategy and promotional campaign',
    priority: 'Medium',
    timeline: '2025-02-20',
    submissionDeadline: '2025-03-05',
    status: 'Not Started',
    assignedBy: 'Mam Mahnoor',
    estimatedHours: 12,
    completedPercentage: 0,
    notes: 'Coordinate with marketing team for promotional content'
  },
  {
    _id: '4',
    projectName: 'CRM Dashboard',
    taskTitle: 'Implement Real-time Data Sync',
    assignedTo: 'Developer - Hassan Malik',
    role: 'Developer',
    description: 'Add WebSocket support for real-time updates',
    priority: 'High',
    timeline: '2025-02-25',
    submissionDeadline: '2025-03-10',
    status: 'Pending',
    assignedBy: 'Mr. Ahmed',
    estimatedHours: 20,
    completedPercentage: 20,
    notes: 'Research WebSocket libraries and implement fallback mechanism'
  },
  {
    _id: '5',
    projectName: 'CRM Dashboard',
    taskTitle: 'Create Sales Dashboard Mockups',
    assignedTo: 'Designer - Zainab Ali',
    role: 'Designer',
    description: 'Design sales funnel visualization and metrics dashboard',
    priority: 'Medium',
    timeline: '2025-02-15',
    submissionDeadline: '2025-02-25',
    status: 'In Progress',
    assignedBy: 'Mr. Ahmed',
    estimatedHours: 18,
    completedPercentage: 75,
    notes: 'Include interactive charts and responsive design'
  },
  {
    _id: '6',
    projectName: 'CRM Dashboard',
    taskTitle: 'Develop Lead Follow-up Workflow',
    assignedTo: 'Sales - Ayesha Khan',
    role: 'Sales',
    description: 'Create automated lead follow-up sequence and email templates',
    priority: 'High',
    timeline: '2025-02-28',
    submissionDeadline: '2025-03-15',
    status: 'Not Started',
    assignedBy: 'Mr. Ahmed',
    estimatedHours: 10,
    completedPercentage: 0,
    notes: 'Ensure compliance with email regulations'
  },
  {
    _id: '7',
    projectName: 'Mobile App - iOS',
    taskTitle: 'Implement Push Notification System',
    assignedTo: 'Developer - Usman Farooq',
    role: 'Developer',
    description: 'Setup Firebase Cloud Messaging and implement push notifications',
    priority: 'High',
    timeline: '2025-02-20',
    submissionDeadline: '2025-03-05',
    status: 'In Progress',
    assignedBy: 'Mam Aisha',
    estimatedHours: 14,
    completedPercentage: 50,
    notes: 'Handle notification permissions across iOS versions'
  },
  {
    _id: '8',
    projectName: 'Analytics Engine',
    taskTitle: 'Build Data Pipeline Infrastructure',
    assignedTo: 'Developer - Omar Hassan',
    role: 'Developer',
    description: 'Setup Apache Kafka for data streaming and processing',
    priority: 'Critical',
    timeline: '2025-02-15',
    submissionDeadline: '2025-03-01',
    status: 'Pending',
    assignedBy: 'Mr. Ahmed',
    estimatedHours: 32,
    completedPercentage: 10,
    notes: 'Critical path item - blocks other development'
  }
];

export const TaskService = {
  // Get all tasks
  getAllTasks: async (page = 1, limit = 100) => {
    try {
      return {
        success: true,
        data: tasksData,
        total: tasksData.length,
        page,
        limit
      };
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  // Get tasks by project
  getTasksByProject: async (projectName: string) => {
    try {
      const filteredTasks = tasksData.filter(t => t.projectName === projectName);
      return {
        success: true,
        data: filteredTasks,
        total: filteredTasks.length
      };
    } catch (error) {
      console.error('Error fetching project tasks:', error);
      throw error;
    }
  },

  // Get tasks by role
  getTasksByRole: async (role: string) => {
    try {
      const filteredTasks = tasksData.filter(t => t.role === role);
      return {
        success: true,
        data: filteredTasks,
        total: filteredTasks.length
      };
    } catch (error) {
      console.error('Error fetching role tasks:', error);
      throw error;
    }
  },

  // Get tasks by status
  getTasksByStatus: async (status: string) => {
    try {
      const filteredTasks = tasksData.filter(t => t.status === status);
      return {
        success: true,
        data: filteredTasks,
        total: filteredTasks.length
      };
    } catch (error) {
      console.error('Error fetching status tasks:', error);
      throw error;
    }
  },

  // Create new task
  createTask: async (taskData: any) => {
    try {
      const newTask = {
        _id: Date.now().toString(),
        ...taskData,
        completedPercentage: 0,
        status: 'Not Started'
      };
      tasksData.push(newTask);
      return {
        success: true,
        data: newTask
      };
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Update task
  updateTask: async (id: string, taskData: any) => {
    try {
      const index = tasksData.findIndex(t => t._id === id);
      if (index === -1) {
        throw new Error('Task not found');
      }
      tasksData[index] = { ...tasksData[index], ...taskData };
      return {
        success: true,
        data: tasksData[index]
      };
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  // Delete task
  deleteTask: async (id: string) => {
    try {
      const index = tasksData.findIndex(t => t._id === id);
      if (index === -1) {
        throw new Error('Task not found');
      }
      tasksData.splice(index, 1);
      return {
        success: true,
        message: 'Task deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
};
