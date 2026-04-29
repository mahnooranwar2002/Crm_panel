// import { apiClient } from '@/src/api/client';

// // Appointment Service - Appointment scheduling and management
// export const appointmentService = {
//   // Create new appointment
//   createAppointment: async (appointmentData: any) => {
//     try {
//       const response = await apiClient.post('/api/medical/appointments', appointmentData);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get all appointments / calendar view
//   getAllAppointments: async (filters?: any) => {
//     try {
//       const response = await apiClient.get('/api/medical/appointments', { params: filters });
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Get appointment by ID
//   getAppointmentById: async (appointmentId: string) => {
//     try {
//       const response = await apiClient.get(`/api/medical/appointments/${appointmentId}`);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Update appointment
//   updateAppointment: async (appointmentId: string, appointmentData: any) => {
//     try {
//       const response = await apiClient.put(`/api/medical/appointments/${appointmentId}`, appointmentData);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Cancel appointment
//   cancelAppointment: async (appointmentId: string) => {
//     try {
//       const response = await apiClient.delete(`/api/medical/appointments/${appointmentId}`);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Check-in patient
//   checkInPatient: async (appointmentId: string, checkInData?: any) => {
//     try {
//       const response = await apiClient.post(`/api/medical/appointments/${appointmentId}/checkin`, checkInData);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Check-out patient
//   checkOutPatient: async (appointmentId: string, checkOutData?: any) => {
//     try {
//       const response = await apiClient.post(`/api/medical/appointments/${appointmentId}/checkout`, checkOutData);
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },

//   // Send appointment reminders
//   sendReminders: async () => {
//     try {
//       const response = await apiClient.post('/api/medical/appointments/reminders');
//       return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },
// };

