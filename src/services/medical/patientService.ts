// import { apiClient } from '@/src/api/client';

// // Patient Service - Patient registration and management
// export const patientService = {
//   // Create new patient
//   createPatient: async (patientData: any) => {
//     try {
//       const response = await apiClient.post('/api/medical/patients', patientData);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get all patients
//   getAllPatients: async (filters?: any) => {
//     try {
//       const response = await apiClient.get('/api/medical/patients', { params: filters });
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get patient by ID
//   getPatientById: async (patientId: string) => {
//     try {
//       const response = await apiClient.get(`/api/medical/patients/${patientId}`);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Update patient
//   updatePatient: async (patientId: string, patientData: any) => {
//     try {
//       const response = await apiClient.put(`/api/medical/patients/${patientId}`, patientData);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Deactivate patient
//   deactivatePatient: async (patientId: string) => {
//     try {
//       const response = await apiClient.delete(`/api/medical/patients/${patientId}`);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get patient timeline
//   getPatientTimeline: async (patientId: string) => {
//     try {
//       const response = await apiClient.get(`/api/medical/patients/${patientId}/timeline`);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Bulk import patients
//   importPatients: async (csvFile: File) => {
//     try {
//       const formData = new FormData();
//       formData.append('file', csvFile);
//       const response = await apiClient.post('/api/medical/patients/import', formData);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },
// };

