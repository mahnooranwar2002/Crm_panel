// import { apiClient } from '@/src/api/client';

// // ERA Service - Electronic Remittance Advice (835) import and processing
// export const eraService = {
//   // Import ERA 835 file
//   importERA: async (eraFile: File) => {
//     try {
//       const formData = new FormData();
//       formData.append('file', eraFile);
//       const response = await apiClient.post('/api/medical/era/import', formData);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Parse ERA file
//   parseERA: async (eraId: string) => {
//     try {
//       const response = await apiClient.post(`/api/medical/era/${eraId}/parse`);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },
// };

