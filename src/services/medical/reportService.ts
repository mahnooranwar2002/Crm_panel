// import { apiClient } from '@/src/api/client';

// // Report Service - Revenue cycle analytics and reports
// export const reportService = {
//   // Get revenue cycle summary
//   getRevenueCycleSummary: async (filters?: any) => {
//     try {
//       const response = await apiClient.get('/api/medical/reports/revenue-cycle', { params: filters });
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get AR aging report
//   getARAgingReport: async (filters?: any) => {
//     try {
//       const response = await apiClient.get('/api/medical/reports/ar-aging', { params: filters });
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get payer mix analysis
//   getPayerMixReport: async (filters?: any) => {
//     try {
//       const response = await apiClient.get('/api/medical/reports/payer-mix', { params: filters });
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get provider production report
//   getProviderProductionReport: async (filters?: any) => {
//     try {
//       const response = await apiClient.get('/api/medical/reports/provider-production', { params: filters });
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get claim metrics
//   getClaimMetrics: async (filters?: any) => {
//     try {
//       const response = await apiClient.get('/api/medical/reports/claim-metrics', { params: filters });
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Export report
//   exportReport: async (reportType: string, format: string, filters?: any) => {
//     try {
//       const response = await apiClient.get('/api/medical/reports/export', {
//         params: { type: reportType, format, ...filters },
//       });
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },
// };

