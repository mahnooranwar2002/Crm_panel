// Hard-coded seed data for permits
const permitsDatabase = [
  {
    _id: "perm-001",
    project_id: "proj-001",
    permit_type: "Building Permit",
    permit_number: "PERM-2026-12345",
    issued_date: "2026-04-15",
    expiry_date: "2026-10-15",
    issuing_authority: "City Building Department",
    status: "Active",
    document_url: "https://example.com/permit-001.pdf",
    conditions: "Must comply with building codes and safety standards",
    notes: "Renewable annually",
    createdAt: new Date("2026-04-15"),
  },
  {
    _id: "perm-002",
    project_id: "proj-001",
    permit_type: "Environmental Permit",
    permit_number: "PERM-2026-12346",
    issued_date: "2026-04-20",
    expiry_date: "2027-04-20",
    issuing_authority: "Environmental Protection Agency",
    status: "Active",
    document_url: "https://example.com/permit-002.pdf",
    conditions: "Comply with environmental regulations",
    notes: "Valid for 1 year",
    createdAt: new Date("2026-04-20"),
  },
  {
    _id: "perm-003",
    project_id: "proj-002",
    permit_type: "Electrical Permit",
    permit_number: "PERM-2026-12347",
    issued_date: "2026-04-18",
    expiry_date: "2026-08-18",
    issuing_authority: "Electrical Board",
    status: "Active",
    document_url: "https://example.com/permit-003.pdf",
    conditions: "Electrical work must be done by certified electricians",
    notes: "Expiring soon - renewal in progress",
    createdAt: new Date("2026-04-18"),
  },
  {
    _id: "perm-004",
    project_id: "proj-004",
    permit_type: "Retail License",
    permit_number: "PERM-2026-12348",
    issued_date: "2026-03-10",
    expiry_date: "2026-05-10",
    issuing_authority: "Commerce Department",
    status: "Expired",
    document_url: "https://example.com/permit-004.pdf",
    conditions: "Maintain business standards",
    notes: "Expired - renewal required immediately",
    createdAt: new Date("2026-03-10"),
  },
  {
    _id: "perm-005",
    project_id: "proj-003",
    permit_type: "Industrial Permit",
    permit_number: "PERM-2026-12349",
    issued_date: "2026-05-01",
    expiry_date: "2027-05-01",
    issuing_authority: "Industrial Board",
    status: "Applied",
    document_url: null,
    conditions: "Pending approval",
    notes: "Under review",
    createdAt: new Date("2026-05-01"),
  },
];

export const permitService = {
  // Get all permits
  getPermits: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(permitsDatabase), 300);
    });
  },

  // Get single permit
  getPermitById: async (id: string) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const permit = permitsDatabase.find(p => p._id === id);
        resolve(permit || null);
      }, 200);
    });
  },

  // Create permit
  createPermit: async (permitData: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newPermit = {
          ...permitData,
          _id: `perm-${Date.now()}`,
          createdAt: new Date(),
        };
        permitsDatabase.push(newPermit);
        resolve(newPermit);
      }, 300);
    });
  },

  // Update permit
  updatePermit: async (id: string, permitData: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = permitsDatabase.findIndex(p => p._id === id);
        if (index !== -1) {
          permitsDatabase[index] = {
            ...permitsDatabase[index],
            ...permitData,
          };
          resolve(permitsDatabase[index]);
        } else {
          resolve(null);
        }
      }, 300);
    });
  },

  // Get expiring permits
  getExpiringPermits: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const today = new Date();
        const expiring = permitsDatabase.filter(p => {
          const expiryDate = new Date(p.expiry_date);
          const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
        });
        resolve(expiring);
      }, 300);
    });
  },

  // Delete permit
  deletePermit: async (id: string) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = permitsDatabase.findIndex(p => p._id === id);
        if (index === -1) {
          reject(new Error('Permit not found'));
          return;
        }
        permitsDatabase.splice(index, 1);
        resolve({ success: true, id });
      }, 300);
    });
  }
};

