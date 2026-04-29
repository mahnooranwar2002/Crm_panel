// import { apiClient } from '@/src/api/client';

// // Appeal Service - Denial appeals management
// export const appealService = {
//   // File appeal for denied claim
//   fileAppeal: async (denialId: string, appealData: any) => {
//     try {
//       const response = await apiClient.post(`/api/medical/denials/${denialId}/appeal`, appealData);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Update appeal
//   updateAppeal: async (appealId: string, appealData: any) => {
//     try {
//       const response = await apiClient.put(`/api/medical/appeals/${appealId}`, appealData);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },
// };

