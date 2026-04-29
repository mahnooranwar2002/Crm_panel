// import { apiClient } from '@/src/api/client';

// // Insurance Service - Insurance plans and payer management
// export const insuranceService = {
//   // Create new insurance plan
//   createInsurancePlan: async (insuranceData: any) => {
//     try {
//       const response = await apiClient.post('/api/medical/insurance', insuranceData);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get all insurance plans
//   getAllInsurancePlans: async (filters?: any) => {
//     try {
//       const response = await apiClient.get('/api/medical/insurance', { params: filters });
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get insurance plan by ID
//   getInsurancePlanById: async (planId: string) => {
//     try {
//       const response = await apiClient.get(`/api/medical/insurance/${planId}`);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Update insurance plan
//   updateInsurancePlan: async (planId: string, insuranceData: any) => {
//     try {
//       const response = await apiClient.put(`/api/medical/insurance/${planId}`, insuranceData);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },
// };

