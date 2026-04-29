// import { apiClient } from '@/src/api/client';

// // Denial Service - Denial management and tracking
// export const denialService = {
//   // Get all denials
//   getAllDenials: async (filters?: any) => {
//     try {
//       const response = await apiClient.get('/api/medical/denials', { params: filters });
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get denial by ID
//   getDenialById: async (denialId: string) => {
//     try {
//       const response = await apiClient.get(`/api/medical/denials/${denialId}`);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get denial analytics and trends
//   getDenialAnalytics: async (filters?: any) => {
//     try {
//       const response = await apiClient.get('/api/medical/denials/analytics', { params: filters });
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get denial work queue
//   getDenialWorkQueue: async () => {
//     try {
//       const response = await apiClient.get('/api/medical/denials/work-queue');
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },
// };

