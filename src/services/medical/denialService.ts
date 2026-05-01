// Hard-coded seed data for denials
export const DENIAL_SEED_DATA = [
  {
    id: 'DEN-001',
    claimId: 'CLM-001',
    reason: 'Missing documentation',
    reasonCode: 'CO-16',
    amount: 150.00,
    appealStatus: 'Not Appealed',
    deadline: '2026-05-28',
    patient: 'John Smith',
    payer: 'Blue Cross',
    status: 'Open'
  },
  {
    id: 'DEN-002',
    claimId: 'CLM-002',
    reason: 'Non-covered service',
    reasonCode: 'CO-50',
    amount: 250.00,
    appealStatus: 'Appealed - Level 1',
    deadline: '2026-05-27',
    patient: 'Maria Garcia',
    payer: 'United Healthcare',
    status: 'Under Review'
  },
  {
    id: 'DEN-003',
    claimId: 'CLM-003',
    reason: 'Duplicate claim',
    reasonCode: 'CO-149',
    amount: 125.00,
    appealStatus: 'Appeal Withdrawn',
    deadline: '2026-05-26',
    patient: 'Robert Johnson',
    payer: 'Aetna',
    status: 'Closed'
  },
  {
    id: 'DEN-004',
    claimId: 'CLM-004',
    reason: 'Authorization required',
    reasonCode: 'CO-01',
    amount: 300.00,
    appealStatus: 'Appealed - Level 2',
    deadline: '2026-05-25',
    patient: 'Jennifer Lee',
    payer: 'Cigna',
    status: 'Open'
  }
];

// Denial Service - Denial management and tracking
export const denialService = {
  // Local storage for denials
  denials: [...DENIAL_SEED_DATA],

  // Get all denials
  async getAllDenials(filters?: any) {
    try {
      return this.denials;
    } catch (error) {
      throw error;
    }
  },

  // Get denial by ID
  async getDenialById(denialId: string) {
    try {
      return this.denials.find(d => d.id === denialId);
    } catch (error) {
      throw error;
    }
  },

  // Create denial
  async createDenial(denialData: any) {
    try {
      const newDenial = {
        id: `DEN-${String(this.denials.length + 1).padStart(3, '0')}`,
        ...denialData,
        status: 'Open'
      };
      this.denials.push(newDenial);
      return newDenial;
    } catch (error) {
      throw error;
    }
  },

  // Update denial
  async updateDenial(denialId: string, denialData: any) {
    try {
      const index = this.denials.findIndex(d => d.id === denialId);
      if (index !== -1) {
        this.denials[index] = { ...this.denials[index], ...denialData };
        return this.denials[index];
      }
      throw new Error('Denial not found');
    } catch (error) {
      throw error;
    }
  },

  // Delete denial
  async deleteDenial(denialId: string) {
    try {
      const index = this.denials.findIndex(d => d.id === denialId);
      if (index !== -1) {
        this.denials.splice(index, 1);
        return { success: true };
      }
      throw new Error('Denial not found');
    } catch (error) {
      throw error;
    }
  },

  // File appeal
  async fileAppeal(denialId: string, appealData: any) {
    try {
      const denial = this.denials.find(d => d.id === denialId);
      if (denial) {
        denial.appealStatus = appealData.appealLevel;
        denial.status = 'Under Review';
        return denial;
      }
      throw new Error('Denial not found');
    } catch (error) {
      throw error;
    }
  },

  // Get denial analytics and trends
  async getDenialAnalytics(filters?: any) {
    try {
      return {
        totalDenials: this.denials.length,
        openDenials: this.denials.filter(d => d.status === 'Open').length,
        underReview: this.denials.filter(d => d.status === 'Under Review').length,
        totalAmount: this.denials.reduce((sum, d) => sum + d.amount, 0)
      };
    } catch (error) {
      throw error;
    }
  },

  // Get denial work queue
  async getDenialWorkQueue() {
    try {
      return this.denials.filter(d => d.status === 'Open' || d.status === 'Under Review');
    } catch (error) {
      throw error;
    }
  },
};