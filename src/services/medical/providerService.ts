// import { apiClient } from '@/src/api/client';

// // Provider Service - Provider directory and management
// export const providerService = {
//   // Create new provider
//   createProvider: async (providerData: any) => {
//     try {
//       const response = await apiClient.post('/api/medical/providers', providerData);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get all providers
//   getAllProviders: async (filters?: any) => {
//     try {
//       const response = await apiClient.get('/api/medical/providers', { params: filters });
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get provider by ID
//   getProviderById: async (providerId: string) => {
//     try {
//       const response = await apiClient.get(`/api/medical/providers/${providerId}`);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Update provider
//   updateProvider: async (providerId: string, providerData: any) => {
//     try {
//       const response = await apiClient.put(`/api/medical/providers/${providerId}`, providerData);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get provider schedule
//   getProviderSchedule: async (providerId: string) => {
//     try {
//       const response = await apiClient.get(`/api/medical/providers/${providerId}/schedule`);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get provider performance metrics
//   getProviderPerformance: async (providerId: string) => {
//     try {
//       const response = await apiClient.get(`/api/medical/providers/${providerId}/performance`);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },
// };

