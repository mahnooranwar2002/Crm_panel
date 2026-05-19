export type VerificationStatus = 'Active' | 'Inactive' | 'Pending_Verification';

export interface InsurancePlan {
  id: string;
  payer: string;
  type: string; 
  name: string;
  payerId: string;
  status: string;
}

// --- Expanded Seed Data ---
let mockPlans: InsurancePlan[] = [
  { id: '1', payer: 'Aetna', type: 'Commercial', name: 'Aetna Open Access', payerId: '60054', status: 'Active' },
  { id: '2', payer: 'Blue Cross Blue Shield', type: 'Commercial', name: 'BCBS PPO Gold', payerId: '00302', status: 'Active' },
  { id: '3', payer: 'Medicare', type: 'Government', name: 'Medicare Part B', payerId: 'CMS01', status: 'Active' },
  { id: '4', payer: 'UnitedHealthcare', type: 'Commercial', name: 'UHC Choice Plus', payerId: '87726', status: 'Active' },
  { id: '5', payer: 'Cigna', type: 'Commercial', name: 'Cigna Global Health', payerId: '62308', status: 'Active' },
  { id: '6', payer: 'Kaiser Permanente', type: 'HMO', name: 'Kaiser Select', payerId: '95603', status: 'Active' },
  { id: '7', payer: 'Humana', type: 'Commercial', name: 'Humana Gold Plus', payerId: '61101', status: 'Inactive' },
  { id: '8', payer: 'Medicaid (NY)', type: 'Government', name: 'NY State Medicaid', payerId: 'NY882', status: 'Active' },
  { id: '9', payer: 'TRICARE', type: 'Military', name: 'Tricare Prime', payerId: 'TR001', status: 'Active' },
  { id: '10', payer: 'Molina Healthcare', type: 'Government', name: 'Molina Marketplace', payerId: 'MLN44', status: 'Active' },
  { id: '11', payer: 'Anthem', type: 'Commercial', name: 'Anthem Blue Access', payerId: 'ANT01', status: 'Active' },
  { id: '12', payer: 'WellCare', type: 'Government', name: 'WellCare Value HMO', payerId: 'WC993', status: 'Pending' }
];

export const insuranceService = {
  
  // --- Payer Directory CRUD ---
  
  getAllPlans: async (): Promise<InsurancePlan[]> => {
    // Artificial delay for UI testing
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockPlans];
  },

  createPlan: async (planData: Omit<InsurancePlan, 'id'>) => {
    const newPlan = { ...planData, id: Math.random().toString(36).substr(2, 9) };
    mockPlans = [newPlan, ...mockPlans];
    return newPlan;
  },

  updatePlan: async (id: string, updatedData: Partial<InsurancePlan>) => {
    mockPlans = mockPlans.map(p => p.id === id ? { ...p, ...updatedData } : p);
    return mockPlans.find(p => p.id === id);
  },

deletePlan: async (id: string) => {
    mockPlans = mockPlans.filter(p => p.id !== id);
    return { success: true };
  },

  getPlanById: async (id: string): Promise<InsurancePlan | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockPlans.find(p => p.id === id);
  },

  // --- Live Eligibility Simulation ---
  checkEligibility: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Random result generate karne ke liye logic
    const isActive = Math.random() > 0.2; // 80% chance of being active
    
    return {
      status: isActive ? 'Active' : 'Inactive',
      copay: isActive ? '$30.00' : '$0.00',
      deductible: isActive ? '$2,000.00' : '$0.00',
      outOfPocket: isActive ? '$6,500.00' : '$0.00',
      payerId: data.payerId || '60054',
      verificationDate: new Date().toISOString(),
      message: isActive ? 'Coverage confirmed via EDI' : 'Subscriber not found or policy expired'
    };
  }
};