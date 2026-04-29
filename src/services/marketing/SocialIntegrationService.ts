export interface SocialIntegration {
  _id?: string;
  platform: 'Facebook' | 'Instagram' | 'LinkedIn' | 'Twitter' | 'TikTok' | 'YouTube';
  account_name: string;
  connected_date: number;
  followers_count: number;
  engagement_rate: number;
  posts_count: number;
  avg_likes_per_post: number;
  avg_comments_per_post: number;
  avg_shares_per_post: number;
  last_post_date?: number;
  connected_by: string;
  status: 'Connected' | 'Disconnected' | 'Expired' | 'Error';
  auto_posting_enabled: boolean;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Hardcoded mock data
let socialIntegrationsDatabase: SocialIntegration[] = [
  {
    _id: '1',
    platform: 'LinkedIn',
    account_name: 'Company LinkedIn Page',
    connected_date: new Date('2026-01-10').getTime(),
    followers_count: 15420,
    engagement_rate: 4.8,
    posts_count: 156,
    avg_likes_per_post: 234,
    avg_comments_per_post: 32,
    avg_shares_per_post: 18,
    last_post_date: new Date('2026-04-24').getTime(),
    connected_by: 'Marketing Manager',
    status: 'Connected',
    auto_posting_enabled: true,
    notes: 'B2B focused content strategy',
    createdAt: '2026-01-10T09:00:00Z',
    updatedAt: '2026-04-25T10:30:00Z',
  },
  {
    _id: '2',
    platform: 'Facebook',
    account_name: 'Company Business Page',
    connected_date: new Date('2026-01-10').getTime(),
    followers_count: 28450,
    engagement_rate: 6.2,
    posts_count: 203,
    avg_likes_per_post: 456,
    avg_comments_per_post: 67,
    avg_shares_per_post: 45,
    last_post_date: new Date('2026-04-25').getTime(),
    connected_by: 'Social Media Specialist',
    status: 'Connected',
    auto_posting_enabled: true,
    notes: 'Community engagement high priority',
    createdAt: '2026-01-10T10:15:00Z',
    updatedAt: '2026-04-25T14:45:00Z',
  },
  {
    _id: '3',
    platform: 'Instagram',
    account_name: 'Company Instagram',
    connected_date: new Date('2026-02-01').getTime(),
    followers_count: 12890,
    engagement_rate: 8.5,
    posts_count: 89,
    avg_likes_per_post: 523,
    avg_comments_per_post: 78,
    avg_shares_per_post: 12,
    last_post_date: new Date('2026-04-23').getTime(),
    connected_by: 'Social Media Specialist',
    status: 'Connected',
    auto_posting_enabled: true,
    notes: 'Visual content strategy, high engagement',
    createdAt: '2026-02-01T11:20:00Z',
    updatedAt: '2026-04-25T14:45:00Z',
  },
  {
    _id: '4',
    platform: 'Twitter',
    account_name: 'Company Twitter Account',
    connected_date: new Date('2026-03-15').getTime(),
    followers_count: 8930,
    engagement_rate: 3.4,
    posts_count: 342,
    avg_likes_per_post: 87,
    avg_comments_per_post: 23,
    avg_shares_per_post: 34,
    last_post_date: new Date('2026-04-25').getTime(),
    connected_by: 'Community Manager',
    status: 'Connected',
    auto_posting_enabled: false,
    notes: 'News and updates focus',
    createdAt: '2026-03-15T08:30:00Z',
    updatedAt: '2026-04-25T14:45:00Z',
  },
  {
    _id: '5',
    platform: 'YouTube',
    account_name: 'Company YouTube Channel',
    connected_date: new Date('2026-01-20').getTime(),
    followers_count: 5670,
    engagement_rate: 2.1,
    posts_count: 45,
    avg_likes_per_post: 234,
    avg_comments_per_post: 45,
    avg_shares_per_post: 8,
    last_post_date: new Date('2026-04-20').getTime(),
    connected_by: 'Content Team',
    status: 'Connected',
    auto_posting_enabled: false,
    notes: 'Educational and product demo videos',
    createdAt: '2026-01-20T12:00:00Z',
    updatedAt: '2026-04-25T14:45:00Z',
  },
  {
    _id: '6',
    platform: 'TikTok',
    account_name: 'Company TikTok Account',
    connected_date: new Date('2026-03-01').getTime(),
    followers_count: 3420,
    engagement_rate: 12.3,
    posts_count: 67,
    avg_likes_per_post: 892,
    avg_comments_per_post: 156,
    avg_shares_per_post: 234,
    last_post_date: new Date('2026-04-24').getTime(),
    connected_by: 'Social Media Specialist',
    status: 'Connected',
    auto_posting_enabled: true,
    notes: 'Trending content and viral potential',
    createdAt: '2026-03-01T14:30:00Z',
    updatedAt: '2026-04-25T14:45:00Z',
  },
];

// CRUD Operations
export const SocialIntegrationService = {
  // Get all social integrations
  getAllIntegrations: async (): Promise<SocialIntegration[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...socialIntegrationsDatabase]);
      }, 300);
    });
  },

  // Get single integration
  getIntegrationById: async (id: string): Promise<SocialIntegration | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const integration = socialIntegrationsDatabase.find((s) => s._id === id);
        resolve(integration || null);
      }, 200);
    });
  },

  // Create new integration
  createIntegration: async (integration: SocialIntegration): Promise<SocialIntegration> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newIntegration: SocialIntegration = {
          ...integration,
          _id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        socialIntegrationsDatabase.push(newIntegration);
        resolve(newIntegration);
      }, 300);
    });
  },

  // Update integration
  updateIntegration: async (id: string, updates: Partial<SocialIntegration>): Promise<SocialIntegration | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = socialIntegrationsDatabase.findIndex((s) => s._id === id);
        if (index === -1) {
          resolve(null);
          return;
        }
        socialIntegrationsDatabase[index] = {
          ...socialIntegrationsDatabase[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        resolve(socialIntegrationsDatabase[index]);
      }, 300);
    });
  },

  // Delete integration
  deleteIntegration: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = socialIntegrationsDatabase.findIndex((s) => s._id === id);
        if (index === -1) {
          resolve(false);
          return;
        }
        socialIntegrationsDatabase.splice(index, 1);
        resolve(true);
      }, 200);
    });
  },

  // Get integrations by platform
  getIntegrationsByPlatform: async (platform: SocialIntegration['platform']): Promise<SocialIntegration | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const integration = socialIntegrationsDatabase.find((s) => s.platform === platform);
        resolve(integration || null);
      }, 300);
    });
  },

  // Get all connected integrations
  getConnectedIntegrations: async (): Promise<SocialIntegration[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(socialIntegrationsDatabase.filter((s) => s.status === 'Connected'));
      }, 300);
    });
  },
};
