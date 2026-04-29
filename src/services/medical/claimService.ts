// import { apiClient } from '@/src/api/client';

// // Claim Service - Claims generation, submission, and tracking
// export const claimService = {
//   // Create new claim
//   createClaim: async (claimData: any) => {
//     try {
//       const response = await apiClient.post('/api/medical/claims', claimData);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get all claims
//   getAllClaims: async (filters?: any) => {
//     try {
//       const response = await apiClient.get('/api/medical/claims', { params: filters });
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get claim by ID
//   getClaimById: async (claimId: string) => {
//     try {
//       const response = await apiClient.get(`/api/medical/claims/${claimId}`);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Update claim
//   updateClaim: async (claimId: string, claimData: any) => {
//     try {
//       const response = await apiClient.put(`/api/medical/claims/${claimId}`, claimData);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Submit claim to clearinghouse
//   submitClaim: async (claimId: string) => {
//     try {
//       const response = await apiClient.post(`/api/medical/claims/${claimId}/submit`);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Resubmit corrected claim
//   resubmitClaim: async (claimId: string, claimData: any) => {
//     try {
//       const response = await apiClient.post(`/api/medical/claims/${claimId}/resubmit`, claimData);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Check claim status with payer
//   checkClaimStatus: async (claimId: string) => {
//     try {
//       const response = await apiClient.get(`/api/medical/claims/${claimId}/status`);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Batch submit multiple claims
//   batchSubmitClaims: async (claimIds: string[]) => {
//     try {
//       const response = await apiClient.post('/api/medical/claims/batch-submit', { claimIds });
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },
// };

