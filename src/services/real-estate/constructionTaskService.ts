// Hard-coded seed data for construction tasks
const tasksDatabase = [
  {
    _id: "task-001",
    project_id: "proj-001",
    task_id: "TASK-001",
    task_name: "Foundation laying",
    description: "Excavate and lay foundation",
    phase: "Foundation",
    assigned_to: "user-001",
    priority: "High",
    status: "In_Progress",
    start_date: "2026-05-15",
    end_date: "2026-05-30",
    progress_percentage: 45,
    estimated_hours: 200,
    actual_hours: 95,
    dependencies: [],
    dependencies_completed: true,
    notes: "Waiting for materials delivery",
    createdAt: new Date("2026-05-01"),
  },
  {
    _id: "task-002",
    project_id: "proj-001",
    task_id: "TASK-002",
    task_name: "Steel structure erection",
    description: "Erect main steel structure",
    phase: "Structural",
    assigned_to: "user-002",
    priority: "Critical",
    status: "Not_Started",
    start_date: "2026-06-01",
    end_date: "2026-07-15",
    progress_percentage: 0,
    estimated_hours: 350,
    actual_hours: 0,
    dependencies: ["TASK-001"],
    dependencies_completed: false,
    notes: "Waiting for foundation completion",
    createdAt: new Date("2026-05-01"),
  },
  {
    _id: "task-003",
    project_id: "proj-002",
    task_id: "TASK-003",
    task_name: "Wall renovation",
    description: "Remove and rebuild interior walls",
    phase: "Interior",
    assigned_to: "user-004",
    priority: "Medium",
    status: "In_Progress",
    start_date: "2026-04-20",
    end_date: "2026-05-20",
    progress_percentage: 60,
    estimated_hours: 120,
    actual_hours: 72,
    dependencies: [],
    dependencies_completed: true,
    notes: "On schedule",
    createdAt: new Date("2026-04-15"),
  },
  {
    _id: "task-004",
    project_id: "proj-002",
    task_id: "TASK-004",
    task_name: "Electrical wiring",
    description: "Install new electrical system",
    phase: "MEP",
    assigned_to: "user-005",
    priority: "High",
    status: "On_Hold",
    start_date: "2026-05-25",
    end_date: "2026-06-15",
    progress_percentage: 0,
    estimated_hours: 80,
    actual_hours: 0,
    dependencies: ["TASK-003"],
    dependencies_completed: false,
    notes: "Awaiting wall renovation completion",
    createdAt: new Date("2026-04-15"),
  },
  {
    _id: "task-005",
    project_id: "proj-004",
    task_id: "TASK-005",
    task_name: "Flooring installation",
    description: "Install new flooring",
    phase: "Finishing",
    assigned_to: "user-009",
    priority: "Medium",
    status: "In_Progress",
    start_date: "2026-05-20",
    end_date: "2026-06-10",
    progress_percentage: 70,
    estimated_hours: 60,
    actual_hours: 42,
    dependencies: [],
    dependencies_completed: true,
    notes: "Material arrived, work proceeding",
    createdAt: new Date("2026-04-12"),
  },
];

interface Task {
  _id: string;
  project_id: string;
  task_id: string;
  task_name: string;
  description: string;
  phase: string;
  assigned_to: string;
  priority: string;
  status: string;
  start_date: string;
  end_date: string;
  progress_percentage: number;
  estimated_hours: number;
  actual_hours: number;
  dependencies: string[];
  dependencies_completed: boolean;
  notes: string;
  createdAt: Date;
}

export const constructionTaskService = {
  // Get all tasks
  getTasks: async (): Promise<Task[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(tasksDatabase), 300);
    });
  },

  // Get single task
  getTaskById: async (id: string): Promise<Task | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const task = tasksDatabase.find(t => t._id === id);
        resolve(task || null);
      }, 200);
    });
  },

  // Create task
  createTask: async (taskData: any): Promise<Task> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTask = {
          ...taskData,
          _id: `task-${Date.now()}`,
          createdAt: new Date(),
        };
        tasksDatabase.push(newTask);
        resolve(newTask);
      }, 300);
    });
  },

  // Update task
  updateTask: async (id: string, taskData: any): Promise<Task | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = tasksDatabase.findIndex(t => t._id === id);
        if (index !== -1) {
          tasksDatabase[index] = {
            ...tasksDatabase[index],
            ...taskData,
          };
          resolve(tasksDatabase[index]);
        } else {
          resolve(null);
        }
      }, 300);
    });
  },

  // Delete task
  deleteTask: async (id: string): Promise<{ success: boolean; deletedTask?: Task }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = tasksDatabase.findIndex(t => t._id === id);
        if (index !== -1) {
          const deleted = tasksDatabase.splice(index, 1);
          resolve({ success: true, deletedTask: deleted[0] });
        } else {
          resolve({ success: false });
        }
      }, 300);
    });
  }
};
