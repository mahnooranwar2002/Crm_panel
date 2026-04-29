// import { apiClient } from '@/src/api/client';

// // Encounter Service - Visit documentation and charge capture
// export const encounterService = {
//   // Create new encounter
//   createEncounter: async (encounterData: any) => {
//     try {
//       const response = await apiClient.post('/api/medical/encounters', encounterData);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get all encounters
//   getAllEncounters: async (filters?: any) => {
//     try {
//       const response = await apiClient.get('/api/medical/encounters', { params: filters });
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get encounter by ID
//   getEncounterById: async (encounterId: string) => {
//     try {
//       const response = await apiClient.get(`/api/medical/encounters/${encounterId}`);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Update encounter
//   updateEncounter: async (encounterId: string, encounterData: any) => {
//     try {
//       const response = await apiClient.put(`/api/medical/encounters/${encounterId}`, encounterData);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Mark encounter as ready for billing
//   markReadyForBilling: async (encounterId: string) => {
//     try {
//       const response = await apiClient.post(`/api/medical/encounters/${encounterId}/ready`);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },
// };

