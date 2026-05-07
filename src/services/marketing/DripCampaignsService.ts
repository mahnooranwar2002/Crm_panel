export interface DripCampaign {
  _id?: string;
  campaign_name: string;
  status: 'Active' | 'Paused' | 'Completed' | 'Draft';
  total_sequences: number;
  active_contacts: number;
  completed_contacts: number;
  opened_emails: number;
  clicked_links: number;
  converted_contacts: number;
  trigger_type: 'Time-Based' | 'Event-Based' | 'Behavior-Based';
  frequency: '1 day' | '3 days' | '1 week' | '2 weeks' | 'Custom';
  start_date: number;
  last_sent?: number;
  created_by: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Hardcoded mock data
let dripCampaignsDatabase: DripCampaign[] = [
  {
    _id: '1',
    campaign_name: 'New Lead Onboarding',
    status: 'Active',
    total_sequences: 5,
    active_contacts: 342,
    completed_contacts: 1205,
    opened_emails: 8234,
    clicked_links: 2156,
    converted_contacts: 289,
    trigger_type: 'Time-Based',
    frequency: '1 day',
    start_date: new Date('2026-02-01').getTime(),
    last_sent: new Date('2026-04-25').getTime(),
    created_by: 'Marketing Manager',
    notes: 'Automated welcome series for new leads',
    createdAt: '2026-02-01T09:00:00Z',
    updatedAt: '2026-04-25T15:30:00Z',
  },
  {
    _id: '2',
    campaign_name: 'Product Feature Education',
    status: 'Active',
    total_sequences: 8,
    active_contacts: 567,
    completed_contacts: 892,
    opened_emails: 6234,
    clicked_links: 1834,
    converted_contacts: 156,
    trigger_type: 'Event-Based',
    frequency: '3 days',
    start_date: new Date('2026-03-15').getTime(),
    last_sent: new Date('2026-04-24').getTime(),
    created_by: 'Content Team',
    notes: 'Educational series about product features',
    createdAt: '2026-03-15T10:30:00Z',
    updatedAt: '2026-04-24T12:00:00Z',
  },
  {
    _id: '3',
    campaign_name: 'Cart Abandonment Sequence',
    status: 'Active',
    total_sequences: 3,
    active_contacts: 189,
    completed_contacts: 756,
    opened_emails: 5234,
    clicked_links: 1567,
    converted_contacts: 412,
    trigger_type: 'Behavior-Based',
    frequency: '1 day',
    start_date: new Date('2026-01-10').getTime(),
    last_sent: new Date('2026-04-25').getTime(),
    created_by: 'E-commerce Team',
    notes: 'Recovery sequence for abandoned carts',
    createdAt: '2026-01-10T08:15:00Z',
    updatedAt: '2026-04-25T09:45:00Z',
  },
  {
    _id: '4',
    campaign_name: 'Upgrade Upsell Series',
    status: 'Paused',
    total_sequences: 4,
    active_contacts: 0,
    completed_contacts: 234,
    opened_emails: 2156,
    clicked_links: 678,
    converted_contacts: 89,
    trigger_type: 'Behavior-Based',
    frequency: '1 week',
    start_date: new Date('2026-03-01').getTime(),
    created_by: 'Sales Team',
    notes: 'Upsell sequence for existing customers',
    createdAt: '2026-03-01T11:20:00Z',
    updatedAt: '2026-04-20T14:00:00Z',
  },
];

// CRUD Operations
export const DripCampaignsService = {
  // Get all drip campaigns
  getAllDripCampaigns: async (): Promise<DripCampaign[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...dripCampaignsDatabase]);
      }, 300);
    });
  },

  // Get single drip campaign
  getDripCampaignById: async (id: string): Promise<DripCampaign | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const campaign = dripCampaignsDatabase.find((c) => c._id === id);
        resolve(campaign || null);
      }, 200);
    });
  },

  // Create new drip campaign
  createDripCampaign: async (campaign: DripCampaign): Promise<DripCampaign> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newCampaign: DripCampaign = {
          ...campaign,
          _id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        dripCampaignsDatabase.push(newCampaign);
        resolve(newCampaign);
      }, 300);
    });
  },

  // Update drip campaign
  updateDripCampaign: async (id: string, updates: Partial<DripCampaign>): Promise<DripCampaign | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = dripCampaignsDatabase.findIndex((c) => c._id === id);
        if (index === -1) {
          resolve(null);
          return;
        }
        dripCampaignsDatabase[index] = {
          ...dripCampaignsDatabase[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        resolve(dripCampaignsDatabase[index]);
      }, 300);
    });
  },

  // Delete drip campaign
  deleteDripCampaign: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = dripCampaignsDatabase.findIndex((c) => c._id === id);
        if (index === -1) {
          resolve(false);
          return;
        }
        dripCampaignsDatabase.splice(index, 1);
        resolve(true);
      }, 200);
    });
  },

  // Get active drip campaigns
  getActiveDripCampaigns: async (): Promise<DripCampaign[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(dripCampaignsDatabase.filter((c) => c.status === 'Active'));
      }, 300);
    });
  },
};
