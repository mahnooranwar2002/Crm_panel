// Hard-coded seed data for ERA (Electronic Remittance Advice)
export const ERA_SEED_DATA = [
  {
    id: 'ERA-001',
    fileName: 'ERA_20260428_BCBS.835',
    payer: 'Blue Cross Blue Shield',
    amount: 2500.00,
    claimsCount: 5,
    status: 'Parsed',
    uploadDate: '2026-04-28',
    processedDate: '2026-04-28',
    records: 5
  },
  {
    id: 'ERA-002',
    fileName: 'ERA_20260427_UHC.835',
    payer: 'United Healthcare',
    amount: 3200.00,
    claimsCount: 8,
    status: 'Parsed',
    uploadDate: '2026-04-27',
    processedDate: '2026-04-27',
    records: 8
  },
  {
    id: 'ERA-003',
    fileName: 'ERA_20260426_AETNA.835',
    payer: 'Aetna',
    amount: 1850.00,
    claimsCount: 4,
    status: 'Pending',
    uploadDate: '2026-04-26',
    processedDate: null,
    records: 0
  },
  {
    id: 'ERA-004',
    fileName: 'ERA_20260425_CIGNA.835',
    payer: 'Cigna',
    amount: 2100.00,
    claimsCount: 6,
    status: 'Parsed',
    uploadDate: '2026-04-25',
    processedDate: '2026-04-25',
    records: 6
  }
];

// ERA Service - Electronic Remittance Advice (835) import and processing
export const eraService = {
  // Local storage for ERAs
  eras: [...ERA_SEED_DATA],

  // Import ERA 835 file
  async importERA(eraData: any) {
    try {
      const newERA = {
        id: `ERA-${String(this.eras.length + 1).padStart(3, '0')}`,
        ...eraData,
        status: 'Pending',
        uploadDate: new Date().toISOString().split('T')[0]
      };
      this.eras.push(newERA);
      return newERA;
    } catch (error) {
      throw error;
    }
  },

  // Get all ERAs
  async getAllERAs(filters?: any) {
    try {
      return this.eras;
    } catch (error) {
      throw error;
    }
  },

  // Get ERA by ID
  async getERAById(eraId: string) {
    try {
      return this.eras.find(e => e.id === eraId);
    } catch (error) {
      throw error;
    }
  },

  // Update ERA
  async updateERA(eraId: string, eraData: any) {
    try {
      const index = this.eras.findIndex(e => e.id === eraId);
      if (index !== -1) {
        this.eras[index] = { ...this.eras[index], ...eraData };
        return this.eras[index];
      }
      throw new Error('ERA not found');
    } catch (error) {
      throw error;
    }
  },

  // Delete ERA
  async deleteERA(eraId: string) {
    try {
      const index = this.eras.findIndex(e => e.id === eraId);
      if (index !== -1) {
        this.eras.splice(index, 1);
        return { success: true };
      }
      throw new Error('ERA not found');
    } catch (error) {
      throw error;
    }
  },

  // Parse ERA file
  async parseERA(eraId: string) {
    try {
      const era = this.eras.find(e => e.id === eraId);
      if (era) {
        era.status = 'Parsed';
        era.processedDate = new Date().toISOString().split('T')[0];
        return era;
      }
      throw new Error('ERA not found');
    } catch (error) {
      throw error;
    }
  },
};