// import { apiClient } from '@/src/api/client';

// // Payment Service - Payment recording and posting
// export const paymentService = {
//   // Record new payment
//   recordPayment: async (paymentData: any) => {
//     try {
//       const response = await apiClient.post('/api/medical/payments', paymentData);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get all payments
//   getAllPayments: async (filters?: any) => {
//     try {
//       const response = await apiClient.get('/api/medical/payments', { params: filters });
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Apply payment to claim
//   applyPayment: async (paymentId: string, applyData: any) => {
//     try {
//       const response = await apiClient.post(`/api/medical/payments/${paymentId}/apply`, applyData);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get unapplied payments
//   getUnappliedPayments: async () => {
//     try {
//       const response = await apiClient.get('/api/medical/payments/unapplied');
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Generate patient statement
//   generatePatientStatement: async (statementData: any) => {
//     try {
//       const response = await apiClient.post('/api/medical/statements/generate', statementData);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },
// };

