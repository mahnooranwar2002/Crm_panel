// Appointment Types
export interface Appointment {
  id: string;
  appointmentId: string; // APT-XXXX
  patientId: string;
  patientName: string;
  providerId: string;
  providerName: string;
  appointmentDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  appointmentType: 'New Patient' | 'Follow-Up' | 'Consultation' | 'Procedure' | 'Telehealth';
  status: 'Scheduled' | 'Confirmed' | 'Checked In' | 'In Progress' | 'Completed' | 'Cancelled' | 'No Show';
  reasonForVisit: string;
  notes?: string;
  checkedInAt?: string;
  checkedOutAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Hard-coded Seed Data
const SEED_APPOINTMENTS: Appointment[] = [
  {
    id: 'APT001',
    appointmentId: 'APT-2026-001',
    patientId: 'PAT001',
    patientName: 'John Doe',
    providerId: 'PROV001',
    providerName: 'Dr. Sarah Smith',
    appointmentDate: '2026-05-15',
    startTime: '09:00',
    endTime: '09:30',
    appointmentType: 'Follow-Up',
    status: 'Scheduled',
    reasonForVisit: 'Annual physical exam',
    notes: 'Patient requested early morning slot',
    createdAt: '2026-04-20T10:30:00Z',
    updatedAt: '2026-04-20T10:30:00Z'
  },
  {
    id: 'APT002',
    appointmentId: 'APT-2026-002',
    patientId: 'PAT002',
    patientName: 'Sarah Johnson',
    providerId: 'PROV002',
    providerName: 'Dr. Robert Miller',
    appointmentDate: '2026-05-16',
    startTime: '10:00',
    endTime: '10:45',
    appointmentType: 'Consultation',
    status: 'Confirmed',
    reasonForVisit: 'Chest pain evaluation',
    notes: 'Preliminary EKG required',
    createdAt: '2026-04-21T11:15:00Z',
    updatedAt: '2026-04-21T11:15:00Z'
  },
  {
    id: 'APT003',
    appointmentId: 'APT-2026-003',
    patientId: 'PAT003',
    patientName: 'Michael Chen',
    providerId: 'PROV003',
    providerName: 'Dr. Jennifer Lee',
    appointmentDate: '2026-05-17',
    startTime: '02:00',
    endTime: '02:30',
    appointmentType: 'New Patient',
    status: 'Checked In',
    reasonForVisit: 'Initial pediatric assessment',
    notes: 'First visit - complete medical history needed',
    checkedInAt: '2026-05-17T13:55:00Z',
    createdAt: '2026-04-22T09:45:00Z',
    updatedAt: '2026-05-17T13:55:00Z'
  },
  {
    id: 'APT004',
    appointmentId: 'APT-2026-004',
    patientId: 'PAT004',
    patientName: 'Emily Rodriguez',
    providerId: 'PROV004',
    providerName: 'Dr. Michael Chen',
    appointmentDate: '2026-05-18',
    startTime: '03:30',
    endTime: '04:00',
    appointmentType: 'Procedure',
    status: 'Completed',
    reasonForVisit: 'Minor orthopedic procedure',
    notes: 'Post-operative care instructions provided',
    checkedInAt: '2026-05-18T15:25:00Z',
    checkedOutAt: '2026-05-18T16:15:00Z',
    createdAt: '2026-04-23T14:20:00Z',
    updatedAt: '2026-05-18T16:15:00Z'
  },
  {
    id: 'APT005',
    appointmentId: 'APT-2026-005',
    patientId: 'PAT005',
    patientName: 'David Wilson',
    providerId: 'PROV005',
    providerName: 'Dr. Jessica Williams',
    appointmentDate: '2026-05-19',
    startTime: '11:00',
    endTime: '11:30',
    appointmentType: 'Telehealth',
    status: 'Scheduled',
    reasonForVisit: 'Neurological consultation',
    notes: 'Video consultation - ensure camera and microphone working',
    createdAt: '2026-04-24T10:00:00Z',
    updatedAt: '2026-04-24T10:00:00Z'
  },
  {
    id: 'APT006',
    appointmentId: 'APT-2026-006',
    patientId: 'PAT006',
    patientName: 'Jessica Martinez',
    providerId: 'PROV006',
    providerName: 'Dr. David Johnson',
    appointmentDate: '2026-05-20',
    startTime: '04:00',
    endTime: '04:30',
    appointmentType: 'Follow-Up',
    status: 'Cancelled',
    reasonForVisit: 'Psychiatric medication review',
    notes: 'Rescheduled due to patient request',
    createdAt: '2026-04-25T08:30:00Z',
    updatedAt: '2026-04-28T09:00:00Z'
  },
  {
    id: 'APT007',
    appointmentId: 'APT-2026-007',
    patientId: 'PAT001',
    patientName: 'John Doe',
    providerId: 'PROV001',
    providerName: 'Dr. Sarah Smith',
    appointmentDate: '2026-05-21',
    startTime: '08:30',
    endTime: '09:00',
    appointmentType: 'Follow-Up',
    status: 'No Show',
    reasonForVisit: 'Blood pressure check',
    notes: 'Patient did not appear for appointment',
    createdAt: '2026-04-26T12:15:00Z',
    updatedAt: '2026-05-21T09:15:00Z'
  },
  {
    id: 'APT008',
    appointmentId: 'APT-2026-008',
    patientId: 'PAT002',
    patientName: 'Sarah Johnson',
    providerId: 'PROV002',
    providerName: 'Dr. Robert Miller',
    appointmentDate: '2026-05-22',
    startTime: '11:30',
    endTime: '12:00',
    appointmentType: 'Consultation',
    status: 'In Progress',
    reasonForVisit: 'Cardiology follow-up',
    notes: 'Stress test results to review',
    checkedInAt: '2026-05-22T11:25:00Z',
    createdAt: '2026-04-27T13:45:00Z',
    updatedAt: '2026-05-22T11:25:00Z'
  }
];

// In-memory storage for appointments (simulating database)
let appointmentsDatabase: Appointment[] = [...SEED_APPOINTMENTS];

/**
 * Get all appointments
 */
export async function getAllAppointments(): Promise<Appointment[]> {
  return Promise.resolve([...appointmentsDatabase]);
}

/**
 * Get appointment by ID
 */
export async function getAppointmentById(id: string): Promise<Appointment | null> {
  const appointment = appointmentsDatabase.find(a => a.id === id);
  return Promise.resolve(appointment || null);
}

/**
 * Search appointments by patient name, provider name, status, or date
 */
export async function searchAppointments(query: string): Promise<Appointment[]> {
  const lowerQuery = query.toLowerCase();
  
  return Promise.resolve(
    appointmentsDatabase.filter(apt =>
      apt.patientName.toLowerCase().includes(lowerQuery) ||
      apt.providerName.toLowerCase().includes(lowerQuery) ||
      apt.status.toLowerCase().includes(lowerQuery) ||
      apt.appointmentDate.includes(query) ||
      apt.reasonForVisit.toLowerCase().includes(lowerQuery)
    )
  );
}

/**
 * Create a new appointment
 */
export async function createAppointment(
  appointmentData: Omit<Appointment, 'id' | 'appointmentId' | 'createdAt' | 'updatedAt'>
): Promise<Appointment> {
  const newAppointment: Appointment = {
    ...appointmentData,
    id: `APT${String(appointmentsDatabase.length + 1).padStart(3, '0')}`,
    appointmentId: `APT-2026-${String(appointmentsDatabase.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  appointmentsDatabase.push(newAppointment);
  return Promise.resolve(newAppointment);
}

/**
 * Update an appointment
 */
export async function updateAppointment(
  id: string,
  updates: Partial<Omit<Appointment, 'id' | 'appointmentId' | 'createdAt'>>
): Promise<Appointment | null> {
  const index = appointmentsDatabase.findIndex(a => a.id === id);
  
  if (index === -1) {
    return Promise.resolve(null);
  }
  
  const updatedAppointment: Appointment = {
    ...appointmentsDatabase[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  appointmentsDatabase[index] = updatedAppointment;
  return Promise.resolve(updatedAppointment);
}

/**
 * Delete an appointment (soft delete - mark as Cancelled)
 */
export async function deleteAppointment(id: string): Promise<boolean> {
  const index = appointmentsDatabase.findIndex(a => a.id === id);
  
  if (index === -1) {
    return Promise.resolve(false);
  }
  
  // Soft delete - mark as Cancelled
  appointmentsDatabase[index].status = 'Cancelled';
  appointmentsDatabase[index].updatedAt = new Date().toISOString();
  
  return Promise.resolve(true);
}

/**
 * Hard delete an appointment (remove from database)
 */
export async function hardDeleteAppointment(id: string): Promise<boolean> {
  const initialLength = appointmentsDatabase.length;
  appointmentsDatabase = appointmentsDatabase.filter(a => a.id !== id);
  
  return Promise.resolve(appointmentsDatabase.length < initialLength);
}

/**
 * Get appointments by status
 */
export async function getAppointmentsByStatus(
  status: 'Scheduled' | 'Confirmed' | 'Checked In' | 'In Progress' | 'Completed' | 'Cancelled' | 'No Show'
): Promise<Appointment[]> {
  return Promise.resolve(
    appointmentsDatabase.filter(apt => apt.status === status)
  );
}

/**
 * Get appointments by date
 */
export async function getAppointmentsByDate(date: string): Promise<Appointment[]> {
  return Promise.resolve(
    appointmentsDatabase.filter(apt => apt.appointmentDate === date)
  );
}

/**
 * Get appointments by patient ID
 */
export async function getAppointmentsByPatientId(patientId: string): Promise<Appointment[]> {
  return Promise.resolve(
    appointmentsDatabase.filter(apt => apt.patientId === patientId)
  );
}

/**
 * Get appointments by provider ID
 */
export async function getAppointmentsByProviderId(providerId: string): Promise<Appointment[]> {
  return Promise.resolve(
    appointmentsDatabase.filter(apt => apt.providerId === providerId)
  );
}

/**
 * Update appointment status
 */
export async function updateAppointmentStatus(
  id: string,
  status: 'Scheduled' | 'Confirmed' | 'Checked In' | 'In Progress' | 'Completed' | 'Cancelled' | 'No Show'
): Promise<Appointment | null> {
  return updateAppointment(id, { status });
}

/**
 * Get total appointments count
 */
export async function getTotalAppointmentsCount(): Promise<number> {
  return Promise.resolve(appointmentsDatabase.length);
}

/**
 * Get appointments count by status
 */
export async function getAppointmentsCountByStatus(
  status: 'Scheduled' | 'Confirmed' | 'Checked In' | 'In Progress' | 'Completed' | 'Cancelled' | 'No Show'
): Promise<number> {
  return Promise.resolve(appointmentsDatabase.filter(a => a.status === status).length);
}

/**
 * Check-in appointment
 */
export async function checkInAppointment(id: string): Promise<Appointment | null> {
  return updateAppointment(id, {
    status: 'Checked In',
    checkedInAt: new Date().toISOString()
  });
}

/**
 * Check-out appointment
 */
export async function checkOutAppointment(id: string): Promise<Appointment | null> {
  return updateAppointment(id, {
    status: 'Completed',
    checkedOutAt: new Date().toISOString()
  });
}

/**
 * Reset database to seed data (for testing)
 */
export async function resetDatabase(): Promise<void> {
  appointmentsDatabase = [...SEED_APPOINTMENTS];
  return Promise.resolve();
}

