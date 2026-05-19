export interface Campaign {
  _id?: string;
  campaign_name: string;
  campaign_type: 'Email' | 'SMS' | 'Social' | 'Push' | 'Multi-Channel';
  status: 'Draft' | 'Scheduled' | 'Active' | 'Completed' | 'Paused';
  start_date: number;
  end_date?: number;
  target_audience: string;
  target_count: number;
  recipient_count: number;
  open_rate: number;
  click_rate: number;
  conversion_rate: number;
  budget?: number;
  created_by: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Hardcoded mock data
let campaignsDatabase: Campaign[] = [
  {
    _id: '1',
    campaign_name: 'Spring Product Launch',
    campaign_type: 'Email',
    status: 'Active',
    start_date: new Date('2026-04-15').getTime(),
    end_date: new Date('2026-05-15').getTime(),
    target_audience: 'Active Customers',
    target_count: 2500,
    recipient_count: 2340,
    open_rate: 38.5,
    click_rate: 12.3,
    conversion_rate: 4.7,
    budget: 5000,
    created_by: 'Marketing Manager',
    notes: 'Focused on new product announcement',
    createdAt: '2026-04-15T08:00:00Z',
    updatedAt: '2026-04-25T10:30:00Z',
  },
  {
    _id: '2',
    campaign_name: 'Seasonal Discount Campaign',
    campaign_type: 'Multi-Channel',
    status: 'Completed',
    start_date: new Date('2026-04-01').getTime(),
    end_date: new Date('2026-04-21').getTime(),
    target_audience: 'Previous Buyers',
    target_count: 1800,
    recipient_count: 1750,
    open_rate: 42.1,
    click_rate: 15.8,
    conversion_rate: 6.2,
    budget: 3000,
    created_by: 'Marketing Manager',
    notes: 'Easter & Spring promotions',
    createdAt: '2026-04-01T09:15:00Z',
    updatedAt: '2026-04-21T17:45:00Z',
  },
  {
    _id: '3',
    campaign_name: 'Webinar Invitation Series',
    campaign_type: 'Email',
    status: 'Draft',
    start_date: new Date('2026-05-01').getTime(),
    target_audience: 'Leads with Engagement',
    target_count: 1200,
    recipient_count: 0,
    open_rate: 0,
    click_rate: 0,
    conversion_rate: 0,
    budget: 2000,
    created_by: 'Content Team',
    notes: 'Educational webinar series',
    createdAt: '2026-04-20T11:20:00Z',
    updatedAt: '2026-04-20T11:20:00Z',
  },
  {
    _id: '4',
    campaign_name: 'Customer Retention Campaign',
    campaign_type: 'SMS',
    status: 'Scheduled',
    start_date: new Date('2026-05-01').getTime(),
    end_date: new Date('2026-05-30').getTime(),
    target_audience: 'At-Risk Customers',
    target_count: 500,
    recipient_count: 0,
    open_rate: 0,
    click_rate: 0,
    conversion_rate: 0,
    budget: 800,
    created_by: 'Customer Success',
    notes: 'Re-engagement SMS campaign',
    createdAt: '2026-04-18T14:50:00Z',
    updatedAt: '2026-04-18T14:50:00Z',
  },
];

// CRUD Operations
export const CampaignsService = {
  // Get all campaigns
  getAllCampaigns: async (): Promise<Campaign[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...campaignsDatabase]);
      }, 300);
    });
  },

  // Get single campaign
  getCampaignById: async (id: string): Promise<Campaign | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const campaign = campaignsDatabase.find((c) => c._id === id);
        resolve(campaign || null);
      }, 200);
    });
  },

  // Create new campaign
  createCampaign: async (campaign: Campaign): Promise<Campaign> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newCampaign: Campaign = {
          ...campaign,
          _id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        campaignsDatabase.push(newCampaign);
        resolve(newCampaign);
      }, 300);
    });
  },

  // Update campaign
  updateCampaign: async (id: string, updates: Partial<Campaign>): Promise<Campaign | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = campaignsDatabase.findIndex((c) => c._id === id);
        if (index === -1) {
          resolve(null);
          return;
        }
        campaignsDatabase[index] = {
          ...campaignsDatabase[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        resolve(campaignsDatabase[index]);
      }, 300);
    });
  },

  // Delete campaign
  deleteCampaign: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = campaignsDatabase.findIndex((c) => c._id === id);
        if (index === -1) {
          resolve(false);
          return;
        }
        campaignsDatabase.splice(index, 1);
        resolve(true);
      }, 200);
    });
  },

  // Get campaigns by status
  getCampaignsByStatus: async (status: Campaign['status']): Promise<Campaign[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(campaignsDatabase.filter((c) => c.status === status));
      }, 300);
    });
  },
};
