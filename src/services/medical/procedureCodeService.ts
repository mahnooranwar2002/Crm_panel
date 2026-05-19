// import { apiClient } from '@/src/api/client';

// // Procedure Code Service - CPT/HCPCS code lookup and fee schedule
// export const procedureCodeService = {
//   // Search procedure codes
//   searchProcedureCodes: async (query: string, filters?: any) => {
//     try {
//       const response = await apiClient.get('/api/medical/procedure-codes', {
//         params: { q: query, ...filters },
//       });
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get procedure code details with fee schedule
//   getProcedureCodeDetails: async (codeId: string) => {
//     try {
//       const response = await apiClient.get(`/api/medical/procedure-codes/${codeId}`);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },
// };

