export interface Workflow {
  _id?: string;
  workflow_name: string;
  description?: string;
  status: 'Active' | 'Paused' | 'Draft' | 'Completed';
  trigger_type: 'Lead-Creation' | 'Form-Submission' | 'Tag-Added' | 'Time-Based' | 'Custom';
  action_type: 'Email' | 'SMS' | 'Task' | 'Tag' | 'Multi-Step';
  total_contacts: number;
  processed_contacts: number;
  successful_actions: number;
  failed_actions: number;
  automation_efficiency: number;
  created_by: string;
  created_date: number;
  last_executed?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Hardcoded mock data
let workflowsDatabase: Workflow[] = [
  {
    _id: '1',
    workflow_name: 'Welcome New Leads',
    description: 'Send welcome email and assign score to new leads',
    status: 'Active',
    trigger_type: 'Lead-Creation',
    action_type: 'Email',
    total_contacts: 4523,
    processed_contacts: 4498,
    successful_actions: 4420,
    failed_actions: 78,
    automation_efficiency: 97.3,
    created_by: 'Marketing Manager',
    created_date: new Date('2026-01-15').getTime(),
    last_executed: new Date('2026-04-25').getTime(),
    notes: 'Triggered on all new lead creation',
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-04-25T14:30:00Z',
  },
  {
    _id: '2',
    workflow_name: 'High-Value Prospect Alert',
    description: 'Alert sales team when hot leads are identified',
    status: 'Active',
    trigger_type: 'Tag-Added',
    action_type: 'Task',
    total_contacts: 256,
    processed_contacts: 245,
    successful_actions: 243,
    failed_actions: 2,
    automation_efficiency: 99.2,
    created_by: 'Sales Manager',
    created_date: new Date('2026-02-01').getTime(),
    last_executed: new Date('2026-04-25').getTime(),
    notes: 'Creates sales task for high-value leads',
    createdAt: '2026-02-01T09:30:00Z',
    updatedAt: '2026-04-25T14:30:00Z',
  },
  {
    _id: '3',
    workflow_name: 'Inactive Lead Re-engagement',
    description: 'Re-engage leads inactive for 30+ days',
    status: 'Active',
    trigger_type: 'Time-Based',
    action_type: 'Email',
    total_contacts: 1230,
    processed_contacts: 1156,
    successful_actions: 1045,
    failed_actions: 111,
    automation_efficiency: 90.4,
    created_by: 'Marketing Manager',
    created_date: new Date('2026-03-05').getTime(),
    last_executed: new Date('2026-04-24').getTime(),
    notes: 'Runs daily at 8 AM',
    createdAt: '2026-03-05T08:00:00Z',
    updatedAt: '2026-04-25T14:30:00Z',
  },
  {
    _id: '4',
    workflow_name: 'Customer Feedback Survey',
    description: 'Send survey to customers after purchase',
    status: 'Paused',
    trigger_type: 'Custom',
    action_type: 'Email',
    total_contacts: 892,
    processed_contacts: 892,
    successful_actions: 756,
    failed_actions: 136,
    automation_efficiency: 84.8,
    created_by: 'Customer Success',
    created_date: new Date('2026-03-20').getTime(),
    notes: 'Paused for feedback collection review',
    createdAt: '2026-03-20T11:15:00Z',
    updatedAt: '2026-04-22T13:45:00Z',
  },
  {
    _id: '5',
    workflow_name: 'Product Launch Announcement',
    description: 'Multi-step product launch workflow',
    status: 'Draft',
    trigger_type: 'Custom',
    action_type: 'Multi-Step',
    total_contacts: 0,
    processed_contacts: 0,
    successful_actions: 0,
    failed_actions: 0,
    automation_efficiency: 0,
    created_by: 'Marketing Manager',
    created_date: new Date('2026-04-20').getTime(),
    notes: 'To be launched on May 1st',
    createdAt: '2026-04-20T14:20:00Z',
    updatedAt: '2026-04-20T14:20:00Z',
  },
];

// CRUD Operations
export const WorkflowsService = {
  // Get all workflows
  getAllWorkflows: async (): Promise<Workflow[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...workflowsDatabase]);
      }, 300);
    });
  },

  // Get single workflow
  getWorkflowById: async (id: string): Promise<Workflow | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const workflow = workflowsDatabase.find((w) => w._id === id);
        resolve(workflow || null);
      }, 200);
    });
  },

  // Create new workflow
  createWorkflow: async (workflow: Workflow): Promise<Workflow> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newWorkflow: Workflow = {
          ...workflow,
          _id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        workflowsDatabase.push(newWorkflow);
        resolve(newWorkflow);
      }, 300);
    });
  },

  // Update workflow
  updateWorkflow: async (id: string, updates: Partial<Workflow>): Promise<Workflow | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = workflowsDatabase.findIndex((w) => w._id === id);
        if (index === -1) {
          resolve(null);
          return;
        }
        workflowsDatabase[index] = {
          ...workflowsDatabase[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        resolve(workflowsDatabase[index]);
      }, 300);
    });
  },

  // Delete workflow
  deleteWorkflow: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = workflowsDatabase.findIndex((w) => w._id === id);
        if (index === -1) {
          resolve(false);
          return;
        }
        workflowsDatabase.splice(index, 1);
        resolve(true);
      }, 200);
    });
  },

  // Get active workflows
  getActiveWorkflows: async (): Promise<Workflow[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(workflowsDatabase.filter((w) => w.status === 'Active'));
      }, 300);
    });
  },

  // Get workflows by status
  getWorkflowsByStatus: async (status: Workflow['status']): Promise<Workflow[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(workflowsDatabase.filter((w) => w.status === status));
      }, 300);
    });
  },
};
