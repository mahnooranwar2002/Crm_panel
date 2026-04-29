// import { apiClient } from '@/src/api/client';

// // Eligibility Service - Real-time insurance eligibility verification
// export const eligibilityService = {
//   // Check patient eligibility
//   checkEligibility: async (eligibilityData: any) => {
//     try {
//       const response = await apiClient.post('/api/medical/eligibility/check', eligibilityData);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get eligibility history for patient
//   getEligibilityHistory: async (patientId: string) => {
//     try {
//       const response = await apiClient.get(`/api/medical/eligibility/${patientId}`);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },
// };

