export interface LeadScore {
  _id?: string;
  lead_id: string;
  lead_name: string;
  email: string;
  company: string;
  engagement_score: number;
  behavioral_score: number;
  demographic_score: number;
  total_score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  status: 'Hot' | 'Warm' | 'Cold' | 'Inactive';
  last_activity?: number;
  activities_count: number;
  email_opens: number;
  link_clicks: number;
  page_views: number;
  form_submissions: number;
  updated_by: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Hardcoded mock data
let leadScoresDatabase: LeadScore[] = [
  {
    _id: '1',
    lead_id: 'LEAD-001',
    lead_name: 'Sarah Johnson',
    email: 'sarah.johnson@techcorp.com',
    company: 'Tech Corp',
    engagement_score: 85,
    behavioral_score: 78,
    demographic_score: 88,
    total_score: 83.7,
    grade: 'A',
    status: 'Hot',
    last_activity: new Date('2026-04-24').getTime(),
    activities_count: 34,
    email_opens: 12,
    link_clicks: 8,
    page_views: 24,
    form_submissions: 3,
    updated_by: 'Scoring Engine',
    notes: 'High intent, ready for sales outreach',
    createdAt: '2026-04-01T09:00:00Z',
    updatedAt: '2026-04-25T14:20:00Z',
  },
  {
    _id: '2',
    lead_id: 'LEAD-002',
    lead_name: 'Michael Chen',
    email: 'michael.chen@innovate.io',
    company: 'Innovate Solutions',
    engagement_score: 62,
    behavioral_score: 58,
    demographic_score: 71,
    total_score: 63.7,
    grade: 'B',
    status: 'Warm',
    last_activity: new Date('2026-04-20').getTime(),
    activities_count: 18,
    email_opens: 6,
    link_clicks: 3,
    page_views: 12,
    form_submissions: 1,
    updated_by: 'Scoring Engine',
    notes: 'Showing moderate interest, nurture needed',
    createdAt: '2026-04-05T10:30:00Z',
    updatedAt: '2026-04-25T14:20:00Z',
  },
  {
    _id: '3',
    lead_id: 'LEAD-003',
    lead_name: 'Jennifer Williams',
    email: 'jenny@globalent.com',
    company: 'Global Enterprise',
    engagement_score: 45,
    behavioral_score: 40,
    demographic_score: 55,
    total_score: 46.7,
    grade: 'C',
    status: 'Cold',
    last_activity: new Date('2026-04-10').getTime(),
    activities_count: 8,
    email_opens: 2,
    link_clicks: 1,
    page_views: 5,
    form_submissions: 0,
    updated_by: 'Scoring Engine',
    notes: 'Low engagement, needs more nurturing',
    createdAt: '2026-04-08T14:15:00Z',
    updatedAt: '2026-04-25T14:20:00Z',
  },
  {
    _id: '4',
    lead_id: 'LEAD-004',
    lead_name: 'David Martinez',
    email: 'david@startupxyz.com',
    company: 'Startup XYZ',
    engagement_score: 28,
    behavioral_score: 32,
    demographic_score: 25,
    total_score: 28.3,
    grade: 'D',
    status: 'Cold',
    last_activity: new Date('2026-03-28').getTime(),
    activities_count: 2,
    email_opens: 0,
    link_clicks: 0,
    page_views: 2,
    form_submissions: 0,
    updated_by: 'Scoring Engine',
    notes: 'Minimal engagement, consider re-targeting',
    createdAt: '2026-04-12T11:45:00Z',
    updatedAt: '2026-04-25T14:20:00Z',
  },
  {
    _id: '5',
    lead_id: 'LEAD-005',
    lead_name: 'Lisa Anderson',
    email: 'lisa@defunct.io',
    company: 'Defunct Company',
    engagement_score: 5,
    behavioral_score: 8,
    demographic_score: 3,
    total_score: 5.3,
    grade: 'F',
    status: 'Inactive',
    last_activity: new Date('2026-02-15').getTime(),
    activities_count: 0,
    email_opens: 0,
    link_clicks: 0,
    page_views: 0,
    form_submissions: 0,
    updated_by: 'Scoring Engine',
    notes: 'Inactive lead, remove from campaigns',
    createdAt: '2026-04-15T08:00:00Z',
    updatedAt: '2026-04-25T14:20:00Z',
  },
];

// CRUD Operations
export const LeadScoringService = {
  // Get all lead scores
  getAllLeadScores: async (): Promise<LeadScore[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...leadScoresDatabase]);
      }, 300);
    });
  },

  // Get single lead score
  getLeadScoreById: async (id: string): Promise<LeadScore | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const score = leadScoresDatabase.find((s) => s._id === id);
        resolve(score || null);
      }, 200);
    });
  },

  // Create new lead score
  createLeadScore: async (score: LeadScore): Promise<LeadScore> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newScore: LeadScore = {
          ...score,
          _id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        leadScoresDatabase.push(newScore);
        resolve(newScore);
      }, 300);
    });
  },

  // Update lead score
  updateLeadScore: async (id: string, updates: Partial<LeadScore>): Promise<LeadScore | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = leadScoresDatabase.findIndex((s) => s._id === id);
        if (index === -1) {
          resolve(null);
          return;
        }
        leadScoresDatabase[index] = {
          ...leadScoresDatabase[index],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        resolve(leadScoresDatabase[index]);
      }, 300);
    });
  },

  // Delete lead score
  deleteLeadScore: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = leadScoresDatabase.findIndex((s) => s._id === id);
        if (index === -1) {
          resolve(false);
          return;
        }
        leadScoresDatabase.splice(index, 1);
        resolve(true);
      }, 200);
    });
  },

  // Get hot leads
  getHotLeads: async (): Promise<LeadScore[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(leadScoresDatabase.filter((s) => s.status === 'Hot' || s.grade === 'A'));
      }, 300);
    });
  },

  // Get leads by status
  getLeadsByStatus: async (status: LeadScore['status']): Promise<LeadScore[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(leadScoresDatabase.filter((s) => s.status === status));
      }, 300);
    });
  },

  // Get leads by grade
  getLeadsByGrade: async (grade: LeadScore['grade']): Promise<LeadScore[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(leadScoresDatabase.filter((s) => s.grade === grade));
      }, 300);
    });
  },
};
