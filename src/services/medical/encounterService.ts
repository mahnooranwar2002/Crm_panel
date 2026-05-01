// Hard-coded seed data for encounters
export const ENCOUNTER_SEED_DATA = [
  {
    id: 'ENC-001',
    patient: 'John Smith',
    date: '2026-04-28',
    charge: 150.00,
    status: 'Open',
    encounterType: 'Office Visit',
    provider: 'Dr. Sarah Johnson',
    chiefComplaint: 'Regular check-up',
    diagnosisCodes: ['Z00.00'],
    procedures: ['99213']
  },
  {
    id: 'ENC-002',
    patient: 'Maria Garcia',
    date: '2026-04-27',
    charge: 250.00,
    status: 'Ready for Billing',
    encounterType: 'Procedure',
    provider: 'Dr. Michael Chen',
    chiefComplaint: 'Knee pain evaluation',
    diagnosisCodes: ['M17.11'],
    procedures: ['20610']
  },
  {
    id: 'ENC-003',
    patient: 'Robert Johnson',
    date: '2026-04-26',
    charge: 125.00,
    status: 'Billed',
    encounterType: 'Telehealth',
    provider: 'Dr. Emily Davis',
    chiefComplaint: 'Follow-up consultation',
    diagnosisCodes: ['I10'],
    procedures: ['99214']
  },
  {
    id: 'ENC-004',
    patient: 'Jennifer Lee',
    date: '2026-04-25',
    charge: 300.00,
    status: 'Open',
    encounterType: 'Office Visit',
    provider: 'Dr. James Wilson',
    chiefComplaint: 'Migraine complaint',
    diagnosisCodes: ['G43.909'],
    procedures: ['99215']
  }
];

// Encounter Service - Visit documentation and charge capture
export const encounterService = {
  // Local storage for encounters
  encounters: [...ENCOUNTER_SEED_DATA],

  // Create new encounter
  async createEncounter(encounterData: any) {
    try {
      const newEncounter = {
        id: `ENC-${String(this.encounters.length + 1).padStart(3, '0')}`,
        ...encounterData,
        status: 'Open'
      };
      this.encounters.push(newEncounter);
      return newEncounter;
    } catch (error) {
      throw error;
    }
  },

  // Get all encounters
  async getAllEncounters(filters?: any) {
    try {
      // You can add filtering logic here if needed
      return this.encounters;
    } catch (error) {
      throw error;
    }
  },

  // Get encounter by ID
  async getEncounterById(encounterId: string) {
    try {
      return this.encounters.find(e => e.id === encounterId);
    } catch (error) {
      throw error;
    }
  },

  // Update encounter
  async updateEncounter(encounterId: string, encounterData: any) {
    try {
      const index = this.encounters.findIndex(e => e.id === encounterId);
      if (index !== -1) {
        this.encounters[index] = { ...this.encounters[index], ...encounterData };
        return this.encounters[index];
      }
      throw new Error('Encounter not found');
    } catch (error) {
      throw error;
    }
  },

  // Delete encounter
  async deleteEncounter(encounterId: string) {
    try {
      const index = this.encounters.findIndex(e => e.id === encounterId);
      if (index !== -1) {
        this.encounters.splice(index, 1);
        return { success: true };
      }
      throw new Error('Encounter not found');
    } catch (error) {
      throw error;
    }
  },

  // Mark encounter as ready for billing
  async markReadyForBilling(encounterId: string) {
    try {
      const encounter = this.encounters.find(e => e.id === encounterId);
      if (encounter) {
        encounter.status = 'Ready for Billing';
        return encounter;
      }
      throw new Error('Encounter not found');
    } catch (error) {
      throw error;
    }
  },
};