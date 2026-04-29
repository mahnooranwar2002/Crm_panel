// import { apiClient } from '@/src/api/client';

// // Diagnosis Code Service - ICD-10-CM code lookup and validation
// export const diagnosisCodeService = {
//   // Search diagnosis codes
//   searchDiagnosisCodes: async (query: string, filters?: any) => {
//     try {
//       const response = await apiClient.get('/api/medical/diagnosis-codes', {
//         params: { q: query, ...filters },
//       });
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get diagnosis code details
//   getDiagnosisCodeDetails: async (codeId: string) => {
//     try {
//       const response = await apiClient.get(`/api/medical/diagnosis-codes/${codeId}`);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },
// };

