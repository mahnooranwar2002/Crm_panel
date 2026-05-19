// Hard-coded seed data for inspections
const inspectionsDatabase = [
  {
    _id: "insp-001",
    project_id: "proj-001",
    inspection_date: "2026-05-20",
    inspector_name: "Inspector John",
    inspection_type: "Safety",
    findings: [
      { issue: "Missing safety harnesses", severity: "High", status: "Open", solution: "Provide harnesses to all workers" },
      { issue: "Debris on site", severity: "Medium", status: "Resolved", solution: "Cleaned site" }
    ],
    passed: false,
    status: "Failed",
    photo_urls: [],
    notes: "Safety violations detected - immediate action required",
    createdAt: new Date("2026-05-20"),
  },
  {
    _id: "insp-002",
    project_id: "proj-001",
    inspection_date: "2026-05-22",
    inspector_name: "Inspector Sarah",
    inspection_type: "Quality",
    findings: [
      { issue: "Foundation dimensions correct", severity: "Low", status: "Approved", solution: "N/A" }
    ],
    passed: true,
    status: "Approved",
    photo_urls: [],
    notes: "Foundation work meets quality standards",
    createdAt: new Date("2026-05-22"),
  },
  {
    _id: "insp-003",
    project_id: "proj-002",
    inspection_date: "2026-05-15",
    inspector_name: "Inspector Mike",
    inspection_type: "Progress",
    findings: [
      { issue: "Work progress on schedule", severity: "Low", status: "Approved", solution: "Continue work" }
    ],
    passed: true,
    status: "Approved",
    photo_urls: [],
    notes: "Project progressing as planned",
    createdAt: new Date("2026-05-15"),
  },
  {
    _id: "insp-004",
    project_id: "proj-004",
    inspection_date: "2026-05-25",
    inspector_name: "Inspector David",
    inspection_type: "Compliance",
    findings: [
      { issue: "Building permits verified", severity: "Low", status: "Approved", solution: "N/A" },
      { issue: "Environmental compliance OK", severity: "Low", status: "Approved", solution: "N/A" }
    ],
    passed: true,
    status: "Approved",
    photo_urls: [],
    notes: "All regulatory requirements met",
    createdAt: new Date("2026-05-25"),
  },
];

interface Finding {
  issue: string;
  severity: string;
  status: string;
  solution: string;
}

interface Inspection {
  _id: string;
  project_id: string;
  inspection_date: string;
  inspector_name: string;
  inspection_type: string;
  findings: Finding[];
  passed: boolean;
  status: string;
  photo_urls: string[];
  notes: string;
  createdAt: Date;
}

export const inspectionService = {
  // Get all inspections
  getInspections: async (): Promise<Inspection[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(inspectionsDatabase), 300);
    });
  },

  // Get single inspection
  getInspectionById: async (id: string): Promise<Inspection | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const inspection = inspectionsDatabase.find(i => i._id === id);
        resolve(inspection || null);
      }, 200);
    });
  },

  // Create inspection
  createInspection: async (inspectionData: any): Promise<Inspection> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newInspection = {
          ...inspectionData,
          _id: `insp-${Date.now()}`,
          createdAt: new Date(),
        };
        inspectionsDatabase.push(newInspection);
        resolve(newInspection);
      }, 300);
    });
  },

  // Update inspection
  updateInspection: async (id: string, inspectionData: any): Promise<Inspection | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = inspectionsDatabase.findIndex(i => i._id === id);
        if (index !== -1) {
          inspectionsDatabase[index] = {
            ...inspectionsDatabase[index],
            ...inspectionData,
          };
          resolve(inspectionsDatabase[index]);
        } else {
          resolve(null);
        }
      }, 300);
    });
  },

  // Delete inspection
  deleteInspection: async (id: string): Promise<{ success: boolean; deletedInspection?: Inspection }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = inspectionsDatabase.findIndex(i => i._id === id);
        if (index !== -1) {
          const deleted = inspectionsDatabase.splice(index, 1);
          resolve({ success: true, deletedInspection: deleted[0] });
        } else {
          resolve({ success: false });
        }
      }, 300);
    });
  }
};
