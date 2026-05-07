// Resource Interface for Type Safety
export interface Resource {
  _id: string;
  project_id: string;
  resource_type: "Equipment" | "Material" | "Labor" | "Subcontractor";
  resource_name: string;
  quantity: number;
  unit: string;
  cost_per_unit: number;
  supplier_id: string;
  allocation_status: "Available" | "Allocated" | "In_Use" | "Returned";
  assigned_to_task: string | null;
  date_allocated: string | null;
  date_returned: string | null;
  cost_total: number;
  notes: string;
  createdAt: Date;
}

// Hard-coded seed data for resources
const resourcesDatabase: Resource[] = [
  {
    _id: "res-001",
    project_id: "proj-001",
    resource_type: "Equipment",
    resource_name: "Excavator CAT 320",
    quantity: 2,
    unit: "Units",
    cost_per_unit: 500,
    supplier_id: "supplier-001",
    allocation_status: "In_Use",
    assigned_to_task: "task-001",
    date_allocated: "2026-05-15",
    date_returned: null,
    cost_total: 1000,
    notes: "Equipment in good condition",
    createdAt: new Date("2026-05-01"),
  },
  {
    _id: "res-002",
    project_id: "proj-001",
    resource_type: "Material",
    resource_name: "Concrete (Cubic Meters)",
    quantity: 500,
    unit: "m³",
    cost_per_unit: 150,
    supplier_id: "supplier-002",
    allocation_status: "Allocated",
    assigned_to_task: "task-001",
    date_allocated: "2026-05-10",
    date_returned: null,
    cost_total: 75000,
    notes: "Ready for use",
    createdAt: new Date("2026-05-01"),
  },
  {
    _id: "res-003",
    project_id: "proj-001",
    resource_type: "Labor",
    resource_name: "Skilled Workers",
    quantity: 10,
    unit: "Persons",
    cost_per_unit: 50,
    supplier_id: "supplier-003",
    allocation_status: "In_Use",
    assigned_to_task: "task-001",
    date_allocated: "2026-05-15",
    date_returned: null,
    cost_total: 500,
    notes: "Experienced crew",
    createdAt: new Date("2026-05-01"),
  },
  {
    _id: "res-004",
    project_id: "proj-002",
    resource_type: "Equipment",
    resource_name: "Brick Laying Machine",
    quantity: 1,
    unit: "Units",
    cost_per_unit: 1200,
    supplier_id: "supplier-001",
    allocation_status: "Available",
    assigned_to_task: null,
    date_allocated: null,
    date_returned: null,
    cost_total: 1200,
    notes: "Ready for allocation",
    createdAt: new Date("2026-04-15"),
  },
  {
    _id: "res-005",
    project_id: "proj-004",
    resource_type: "Material",
    resource_name: "Ceramic Tiles",
    quantity: 2000,
    unit: "sq ft",
    cost_per_unit: 5,
    supplier_id: "supplier-004",
    allocation_status: "In_Use",
    assigned_to_task: "task-005",
    date_allocated: "2026-05-20",
    date_returned: null,
    cost_total: 10000,
    notes: "Premium quality tiles",
    createdAt: new Date("2026-04-12"),
  },
  {
    _id: "res-006",
    project_id: "proj-002",
    resource_type: "Subcontractor",
    resource_name: "Electrical Contractor Ltd",
    quantity: 1,
    unit: "Company",
    cost_per_unit: 8000,
    supplier_id: "supplier-005",
    allocation_status: "Available",
    assigned_to_task: null,
    date_allocated: null,
    date_returned: null,
    cost_total: 8000,
    notes: "Certified electricians",
    createdAt: new Date("2026-04-15"),
  },
];

export const resourceService = {
  // Get all resources
  getResources: async (): Promise<Resource[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(resourcesDatabase), 300);
    });
  },

  // Get single resource
  getResourceById: async (id: string): Promise<Resource | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const resource = resourcesDatabase.find((r) => r._id === id);
        resolve(resource || null);
      }, 200);
    });
  },

  // Create resource
  createResource: async (resourceData: Partial<Resource>): Promise<Resource> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newResource: Resource = {
          ...resourceData as Resource,
          _id: `res-${Date.now()}`,
          createdAt: new Date(),
        };
        resourcesDatabase.push(newResource);
        resolve(newResource);
      }, 300);
    });
  },

  // Update resource
  updateResource: async (id: string, resourceData: Partial<Resource>): Promise<Resource | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = resourcesDatabase.findIndex((r) => r._id === id);
        if (index !== -1) {
          resourcesDatabase[index] = {
            ...resourcesDatabase[index],
            ...resourceData,
          };
          resolve(resourcesDatabase[index]);
        } else {
          resolve(null);
        }
      }, 300);
    });
  },

  // Delete resource
  deleteResource: async (id: string): Promise<{ success: boolean; deletedResource?: Resource }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = resourcesDatabase.findIndex((r) => r._id === id);
        if (index !== -1) {
          const deleted = resourcesDatabase.splice(index, 1);
          resolve({ success: true, deletedResource: deleted[0] });
        } else {
          resolve({ success: false });
        }
      }, 300);
    });
  },

  // Allocate resource - Fixed Type Error
  allocateResource: async (id: string, allocationData: { task_id: string }): Promise<Resource | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = resourcesDatabase.findIndex((r) => r._id === id);
        if (index !== -1) {
          resourcesDatabase[index] = {
            ...resourcesDatabase[index],
            allocation_status: "Allocated",
            assigned_to_task: allocationData.task_id,
            // Fixed: Converted Date object to ISO string
            date_allocated: new Date().toISOString(),
          };
          resolve(resourcesDatabase[index]);
        } else {
          resolve(null);
        }
      }, 300);
    });
  },

  // Return resource - Fixed Type Error
  returnResource: async (id: string): Promise<Resource | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = resourcesDatabase.findIndex((r) => r._id === id);
        if (index !== -1) {
          resourcesDatabase[index] = {
            ...resourcesDatabase[index],
            allocation_status: "Available",
            assigned_to_task: null,
            // Fixed: Converted Date object to ISO string
            date_returned: new Date().toISOString(),
          };
          resolve(resourcesDatabase[index]);
        } else {
          resolve(null);
        }
      }, 300);
    });
  },
};