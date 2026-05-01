// Hard-coded seed data for claims
export const CLAIMS_SEED_DATA = [
  {
    id: 'CLM-001',
    patient: 'John Smith',
    amount: 150.00,
    status: 'Draft',
    submitted: '2026-04-28',
    insurance: 'Blue Cross Blue Shield',
    provider: 'Dr. Sarah Johnson',
    encounterID: 'ENC-001',
    claimStatus: 'Draft Created'
  },
  {
    id: 'CLM-002',
    patient: 'Maria Garcia',
    amount: 250.00,
    status: 'Submitted',
    submitted: '2026-04-27',
    insurance: 'United Healthcare',
    provider: 'Dr. Michael Chen',
    encounterID: 'ENC-002',
    claimStatus: 'Pending Review'
  },
  {
    id: 'CLM-003',
    patient: 'Robert Johnson',
    amount: 125.00,
    status: 'Approved',
    submitted: '2026-04-26',
    insurance: 'Aetna',
    provider: 'Dr. Emily Davis',
    encounterID: 'ENC-003',
    claimStatus: 'Approved'
  },
  {
    id: 'CLM-004',
    patient: 'Jennifer Lee',
    amount: 300.00,
    status: 'Denied',
    submitted: '2026-04-25',
    insurance: 'Cigna',
    provider: 'Dr. James Wilson',
    encounterID: 'ENC-004',
    claimStatus: 'Denied - Requires Correction'
  }
];

const claims = [...CLAIMS_SEED_DATA];

// Claim Service - Claims generation, submission, and tracking
export const claimService = {
  // Local storage for claims
  claims,

  // Create new claim
  createClaim: async (claimData: any) => {
    try {
      const newClaim = {
        id: `CLM-${String(claims.length + 1).padStart(3, '0')}`,
        ...claimData,
        status: 'Draft',
        claimStatus: 'Draft Created'
      };
      claims.push(newClaim);
      return newClaim;
    } catch (error) {
      throw error;
    }
  },

  // Get all claims
  getAllClaims: async (filters?: any) => {
    try {
      return claims;
    } catch (error) {
      throw error;
    }
  },

  // Get claim by ID
  getClaimById: async (claimId: string) => {
    try {
      return claims.find(c => c.id === claimId);
    } catch (error) {
      throw error;
    }
  },

  // Update claim
  updateClaim: async (claimId: string, claimData: any) => {
    try {
      const index = claims.findIndex(c => c.id === claimId);
      if (index !== -1) {
        claims[index] = { ...claims[index], ...claimData };
        return claims[index];
      }
      throw new Error('Claim not found');
    } catch (error) {
      throw error;
    }
  },

  // Delete claim
  deleteClaim: async (claimId: string) => {
    try {
      const index = claims.findIndex(c => c.id === claimId);
      if (index !== -1) {
        claims.splice(index, 1);
        return { success: true };
      }
      throw new Error('Claim not found');
    } catch (error) {
      throw error;
    }
  },

  // Submit claim to clearinghouse
  submitClaim: async (claimId: string) => {
    try {
      const claim = claims.find(c => c.id === claimId);
      if (claim) {
        claim.status = 'Submitted';
        claim.claimStatus = 'Submitted to Payer';
        return claim;
      }
      throw new Error('Claim not found');
    } catch (error) {
      throw error;
    }
  },

  // Resubmit corrected claim
  resubmitClaim: async (claimId: string, claimData: any) => {
    try {
      const index = claims.findIndex(c => c.id === claimId);
      if (index !== -1) {
        claims[index] = { ...claims[index], ...claimData, status: 'Submitted' };
        return claims[index];
      }
      throw new Error('Claim not found');
    } catch (error) {
      throw error;
    }
  },

  // Check claim status with payer
  checkClaimStatus: async (claimId: string) => {
    try {
      const claim = claims.find(c => c.id === claimId);
      if (claim) {
        return { claimId, status: claim.claimStatus };
      }
      throw new Error('Claim not found');
    } catch (error) {
      throw error;
    }
  },

  // Batch submit multiple claims
  batchSubmitClaims: async (claimIds: string[]) => {
    try {
      const updatedClaims = claims.filter(c => claimIds.includes(c.id));
      updatedClaims.forEach(c => {
        c.status = 'Submitted';
        c.claimStatus = 'Submitted to Payer';
      });
      return updatedClaims;
    } catch (error) {
      throw error;
    }
  },
};


