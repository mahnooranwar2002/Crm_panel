// Seed data for software projects
const softwareProjectsData = [
  {
    _id: '1',
    projectName: 'E-Commerce Platform',
    technology: 'Web - Next.js + React',
    leadName: 'Mam Mahnoor',
    status: 1,
    workflowDescription: 'Building complete e-commerce platform with payment integration, inventory management, and order tracking. Features added: Product catalog, Shopping cart, Checkout flow, Payment gateway integration, Admin dashboard',
    problemsFacing: [
      'Payment gateway API timeout issues',
      'Database query optimization needed',
      'Mobile responsiveness bugs on iOS Safari'
    ],
    repositoryUrl: 'https://github.com/your-org/ecommerce-platform',
    startDate: '2025-01-15',
    endDate: '2025-06-30',
    projectStatus: 'In Progress',
    comments: [
      'Database schema needs revision for better performance',
      'Consider implementing caching layer for product listings',
      'Security audit required before production deployment'
    ]
  },
  {
    _id: '2',
    projectName: 'CRM Dashboard',
    technology: 'Web - React + TypeScript',
    leadName: 'Mam Mahnoor',
    status: 1,
    workflowDescription: 'Developing comprehensive CRM dashboard for lead management and sales tracking. Features added: Lead pipeline visualization, Sales forecasting, Team performance metrics, Email integration, Contact management',
    problemsFacing: [
      'Real-time data sync delay between frontend and backend',
      'Chart rendering performance with large datasets',
      'Authentication token refresh issues'
    ],
    repositoryUrl: 'https://github.com/your-org/crm-dashboard',
    startDate: '2024-11-01',
    endDate: '2025-05-15',
    projectStatus: 'In Progress',
    comments: [
      'Need WebSocket implementation for real-time updates',
      'API rate limiting affecting dashboard refresh',
      'User feedback: Add dark mode support'
    ]
  },
  {
    _id: '3',
    projectName: 'Mobile App - iOS',
    technology: 'Mobile - React Native',
    leadName: 'Mam Aisha',
    status: 1,
    workflowDescription: 'Developing cross-platform mobile application for iOS and Android. Features added: User authentication, Push notifications, Offline data sync, Camera integration, Location services',
    problemsFacing: [
      'iOS App Store submission pending approval',
      'Android camera permission handling on Android 13+',
      'Battery consumption optimization needed'
    ],
    repositoryUrl: 'https://github.com/your-org/mobile-app',
    startDate: '2024-10-20',
    endDate: '2025-04-30',
    projectStatus: 'Testing',
    comments: [
      'Waiting for Apple App Store review feedback',
      'Implement battery optimization before final release',
      'Add offline mode documentation'
    ]
  },
  {
    _id: '4',
    projectName: 'Analytics Engine',
    technology: 'Web - Node.js + Python',
    leadName: 'Mr. Ahmed',
    status: 1,
    workflowDescription: 'Building real-time analytics processing engine for data visualization. Features added: Data pipeline setup, Real-time metrics calculation, Report generation, Data export functionality, Machine learning integration',
    problemsFacing: [
      'Data processing bottleneck at 10M+ records',
      'Inconsistent metric calculations across time zones',
      'Memory leaks in data streaming module'
    ],
    repositoryUrl: 'https://github.com/your-org/analytics-engine',
    startDate: '2025-01-10',
    endDate: '2025-07-31',
    projectStatus: 'Development',
    comments: [
      'Need to implement distributed processing',
      'Cache strategy for frequently accessed metrics',
      'Documentation needed for API endpoints'
    ]
  },
  {
    _id: '5',
    projectName: 'Admin Portal',
    technology: 'Web - Vue.js',
    leadName: 'Mam Fatima',
    status: 1,
    workflowDescription: 'Creating admin portal for system management and user control. Features added: User management, Role-based access control, System monitoring, Audit logs, Configuration management',
    problemsFacing: [
      'Vue 3 composition API migration incomplete',
      'Form validation library performance issue',
      'Dark mode CSS conflicts'
    ],
    repositoryUrl: 'https://github.com/your-org/admin-portal',
    startDate: '2024-12-01',
    endDate: '2025-03-30',
    projectStatus: 'Completed',
    comments: [
      'Successfully launched to production',
      'Monitor user adoption metrics',
      'Plan Phase 2 for advanced features'
    ]
  }
];

export const SoftwareService = {
  // Get all software projects
  getSoftwareProjects: async (page = 1, limit = 100) => {
    try {
      // In production, this would be an API call
      // const response = await fetch(`/api/software?page=${page}&limit=${limit}`);
      // return response.json();
      
      // For now, return seed data
      return {
        success: true,
        data: softwareProjectsData,
        total: softwareProjectsData.length,
        page,
        limit
      };
    } catch (error) {
      console.error('Error fetching software projects:', error);
      throw error;
    }
  },

  // Get single software project
  getSoftwareProject: async (id: string) => {
    try {
      const project = softwareProjectsData.find(p => p._id === id);
      if (!project) {
        throw new Error('Project not found');
      }
      return {
        success: true,
        data: project
      };
    } catch (error) {
      console.error('Error fetching software project:', error);
      throw error;
    }
  },

  // Create new software project
  createSoftwareProject: async (projectData: any) => {
    try {
      // const response = await fetch('/api/software', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(projectData)
      // });
      // return response.json();

      const newProject = {
        _id: Date.now().toString(),
        ...projectData,
        status: 1
      };
      softwareProjectsData.push(newProject);
      return {
        success: true,
        data: newProject
      };
    } catch (error) {
      console.error('Error creating software project:', error);
      throw error;
    }
  },

  // Update software project
  updateSoftwareProject: async (id: string, projectData: any) => {
    try {
      // const response = await fetch(`/api/software/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(projectData)
      // });
      // return response.json();

      const index = softwareProjectsData.findIndex(p => p._id === id);
      if (index === -1) {
        throw new Error('Project not found');
      }
      softwareProjectsData[index] = { ...softwareProjectsData[index], ...projectData };
      return {
        success: true,
        data: softwareProjectsData[index]
      };
    } catch (error) {
      console.error('Error updating software project:', error);
      throw error;
    }
  },

  // Delete software project
  deleteSoftwareProject: async (id: string) => {
    try {
      // const response = await fetch(`/api/software/${id}`, {
      //   method: 'DELETE'
      // });
      // return response.json();

      const index = softwareProjectsData.findIndex(p => p._id === id);
      if (index === -1) {
        throw new Error('Project not found');
      }
      softwareProjectsData.splice(index, 1);
      return {
        success: true,
        message: 'Project deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting software project:', error);
      throw error;
    }
  }
};
