// Hard-coded seed data for construction projects
const projectsDatabase = [
  {
    _id: "proj-001",
    project_id: "PROJ-2026-001",
    project_name: "Downtown Complex Phase 1",
    property_id: "prop-001",
    project_type: "New_Build",
    description: "Construction of new office complex",
    contractor_id: "contractor-001",
    project_manager_id: "pm-001",
    start_date: "2026-05-01",
    end_date: "2026-12-31",
    actual_end_date: null,
    budget: 2500000,
    spent_amount: 125000,
    currency: "USD",
    status: "In_Progress",
    progress_percentage: 15,
    site_manager_id: "sm-001",
    team_members: ["user-001", "user-002", "user-003"],
    createdAt: new Date("2026-04-01"),
    updatedAt: new Date("2026-04-22"),
  },
  {
    _id: "proj-002",
    project_id: "PROJ-2026-002",
    project_name: "Residential Renovation",
    property_id: "prop-002",
    project_type: "Renovation",
    description: "Complete renovation of residential property",
    contractor_id: "contractor-002",
    project_manager_id: "pm-002",
    start_date: "2026-04-15",
    end_date: "2026-09-30",
    actual_end_date: null,
    budget: 450000,
    spent_amount: 89000,
    currency: "USD",
    status: "In_Progress",
    progress_percentage: 35,
    site_manager_id: "sm-002",
    team_members: ["user-004", "user-005"],
    createdAt: new Date("2026-03-20"),
    updatedAt: new Date("2026-04-20"),
  },
  {
    _id: "proj-003",
    project_id: "PROJ-2026-003",
    project_name: "Industrial Warehouse Expansion",
    property_id: "prop-003",
    project_type: "Expansion",
    description: "Expansion of existing warehouse facility",
    contractor_id: "contractor-003",
    project_manager_id: "pm-003",
    start_date: "2026-06-01",
    end_date: "2026-11-30",
    actual_end_date: null,
    budget: 1800000,
    spent_amount: 0,
    currency: "USD",
    status: "Planning",
    progress_percentage: 5,
    site_manager_id: "sm-003",
    team_members: ["user-006", "user-007", "user-008"],
    createdAt: new Date("2026-04-05"),
    updatedAt: new Date("2026-04-05"),
  },
  {
    _id: "proj-004",
    project_id: "PROJ-2026-004",
    project_name: "Retail Store Refurbishment",
    property_id: "prop-004",
    project_type: "Maintenance",
    description: "Refurbishment of retail space",
    contractor_id: "contractor-001",
    project_manager_id: "pm-004",
    start_date: "2026-05-15",
    end_date: "2026-07-15",
    actual_end_date: null,
    budget: 280000,
    spent_amount: 42000,
    currency: "USD",
    status: "In_Progress",
    progress_percentage: 45,
    site_manager_id: "sm-004",
    team_members: ["user-009", "user-010"],
    createdAt: new Date("2026-04-12"),
    updatedAt: new Date("2026-04-19"),
  },
];

interface Project {
  _id: string;
  project_id: string;
  project_name: string;
  property_id: string;
  project_type: string;
  description: string;
  contractor_id: string;
  project_manager_id: string;
  start_date: string;
  end_date: string;
  actual_end_date: string | null;
  budget: number;
  spent_amount: number;
  currency: string;
  status: string;
  progress_percentage: number;
  site_manager_id: string;
  team_members: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectTimeline {
  project_id: string;
  start_date: string;
  end_date: string;
  progress: number;
}

export const constructionProjectService = {
  // Get all projects
  getProjects: async (): Promise<Project[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(projectsDatabase), 300);
    });
  },

  // Get single project
  getProjectById: async (id: string): Promise<Project | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const project = projectsDatabase.find(p => p._id === id);
        resolve(project || null);
      }, 200);
    });
  },

  // Create project
  createProject: async (projectData: any): Promise<Project> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newProject = {
          ...projectData,
          _id: `proj-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        projectsDatabase.push(newProject);
        resolve(newProject);
      }, 300);
    });
  },

  // Update project
  updateProject: async (id: string, projectData: any): Promise<Project | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = projectsDatabase.findIndex(p => p._id === id);
        if (index !== -1) {
          projectsDatabase[index] = {
            ...projectsDatabase[index],
            ...projectData,
            updatedAt: new Date(),
          };
          resolve(projectsDatabase[index]);
        } else {
          resolve(null);
        }
      }, 300);
    });
  },

  // Delete project
  deleteProject: async (id: string): Promise<{ success: boolean; deletedProject?: Project }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = projectsDatabase.findIndex(p => p._id === id);
        if (index !== -1) {
          const deleted = projectsDatabase.splice(index, 1);
          resolve({ success: true, deletedProject: deleted[0] });
        } else {
          resolve({ success: false });
        }
      }, 300);
    });
  },

  // Get project timeline (Gantt chart data)
  getProjectTimeline: async (id: string): Promise<ProjectTimeline | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const project = projectsDatabase.find(p => p._id === id);
        if (project) {
          resolve({
            project_id: project.project_id,
            start_date: project.start_date,
            end_date: project.end_date,
            progress: project.progress_percentage,
          });
        } else {
          resolve(null);
        }
      }, 200);
    });
  }
};
