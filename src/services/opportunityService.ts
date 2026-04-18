const STATIC_OPPORTUNITIES = [
  {
    _id: 'opp-1',
    title: 'Premium Health Plan',
    company: 'Wholcure Health',
    contactPerson: 'Sara Ahmed',
    assignedUser: 'Adeel Hassan',
    amount: 12400,
    probability: 68,
    stage: 'Negotiation',
    close_date: '2026-06-18',
  },
  {
    _id: 'opp-2',
    title: 'Retail Expansion',
    company: 'Nova Labs',
    contactPerson: 'Bilal Shah',
    assignedUser: 'Ayesha Khan',
    amount: 8200,
    probability: 52,
    stage: 'Proposal',
    close_date: '2026-05-14',
  },
  {
    _id: 'opp-3',
    title: 'Corporate Wellness',
    company: 'GreenCare',
    contactPerson: 'Fatima Noor',
    assignedUser: 'Hamza Ali',
    amount: 5700,
    probability: 34,
    stage: 'Discovery',
    close_date: '2026-06-01',
  },
];

export const OpportunityService = {
  async getOpportunities(page = 1, limit = 10) {
    return {
      opportunities: STATIC_OPPORTUNITIES.slice(0, limit),
      pagination: { total: STATIC_OPPORTUNITIES.length, page, limit },
    };
  },

  async getOpportunityById(id: string) {
    return STATIC_OPPORTUNITIES.find((opp) => opp._id === id) || STATIC_OPPORTUNITIES[0];
  },

  async createOpportunity(opportunityData: any) {
    return { ...opportunityData, _id: `opp-${Date.now()}` };
  },

  async updateOpportunity(id: string, opportunityData: any) {
    return { ...opportunityData, _id: id };
  },

  async deleteOpportunity(_id: string) {
    return null;
  },
};