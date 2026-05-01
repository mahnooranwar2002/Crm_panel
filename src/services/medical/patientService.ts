// Patient Types
export interface Patient {
  id: string;
  mrn: string; // Medical Record Number
  name: string;
  firstName: string;
  lastName: string;
  dob: string; // Date of Birth (YYYY-MM-DD)
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  gender: 'Male' | 'Female' | 'Other';
  bloodType: string;
  status: 'Active' | 'Inactive' | 'Discharged';
  
  // Insurance Information
  primaryInsuranceId?: string;
  primaryInsuranceName?: string;
  primaryPolicyNumber?: string;
  secondaryInsuranceId?: string;
  secondaryInsuranceName?: string;
  secondaryPolicyNumber?: string;
  
  // Emergency Contact
  emergencyContact: string;
  emergencyPhone: string;
  emergencyRelationship?: string;
  
  // Medical Information
  allergies: string[];
  medicalHistory: string[];
  
  // Provider Information
  primaryProviderId?: string;
  primaryProviderName?: string;
  
  // Additional Info
  occupation?: string;
  maritalStatus?: string;
  
  createdAt: string;
  updatedAt: string;
}

// Hard-coded Seed Data
const SEED_PATIENTS: Patient[] = [
  {
    id: 'PAT001',
    mrn: 'MRN-00001',
    name: 'John Doe',
    firstName: 'John',
    lastName: 'Doe',
    dob: '1985-03-15',
    phone: '+1 (555) 123-4567',
    email: 'john.doe@email.com',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    gender: 'Male',
    bloodType: 'O+',
    status: 'Active',
    primaryInsuranceId: 'INS-123456',
    primaryInsuranceName: 'Blue Cross Blue Shield',
    primaryPolicyNumber: 'POL-987654321',
    secondaryInsuranceId: 'INS-789012',
    secondaryInsuranceName: 'Aetna',
    secondaryPolicyNumber: 'POL-456789012',
    emergencyContact: 'Jane Doe',
    emergencyPhone: '+1 (555) 987-6543',
    emergencyRelationship: 'Spouse',
    allergies: ['Penicillin', 'Sulfa'],
    medicalHistory: ['Hypertension', 'Type 2 Diabetes'],
    primaryProviderId: 'PROV-001',
    primaryProviderName: 'Dr. Sarah Smith',
    occupation: 'Software Engineer',
    maritalStatus: 'Married',
    createdAt: '2025-10-24T10:30:00Z',
    updatedAt: '2025-10-24T10:30:00Z'
  },
  {
    id: 'PAT002',
    mrn: 'MRN-00002',
    name: 'Sarah Johnson',
    firstName: 'Sarah',
    lastName: 'Johnson',
    dob: '1992-07-22',
    phone: '+1 (555) 234-5678',
    email: 'sarah.johnson@email.com',
    address: '456 Oak Avenue',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90001',
    gender: 'Female',
    bloodType: 'A-',
    status: 'Active',
    primaryInsuranceId: 'INS-234567',
    primaryInsuranceName: 'UnitedHealthcare',
    primaryPolicyNumber: 'POL-234567890',
    emergencyContact: 'Michael Johnson',
    emergencyPhone: '+1 (555) 345-6789',
    emergencyRelationship: 'Brother',
    allergies: ['Aspirin', 'Penicillin G'],
    medicalHistory: ['Asthma', 'Seasonal Allergies'],
    primaryProviderId: 'PROV-002',
    primaryProviderName: 'Dr. Robert Miller',
    occupation: 'Marketing Manager',
    maritalStatus: 'Single',
    createdAt: '2025-10-20T14:15:00Z',
    updatedAt: '2025-10-20T14:15:00Z'
  },
  {
    id: 'PAT003',
    mrn: 'MRN-00003',
    name: 'Robert Smith',
    firstName: 'Robert',
    lastName: 'Smith',
    dob: '1978-11-08',
    phone: '+1 (555) 345-6789',
    email: 'robert.smith@email.com',
    address: '789 Pine Road',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60601',
    gender: 'Male',
    bloodType: 'B+',
    status: 'Active',
    primaryInsuranceId: 'INS-345678',
    primaryInsuranceName: 'Cigna',
    primaryPolicyNumber: 'POL-345678901',
    emergencyContact: 'Emily Smith',
    emergencyPhone: '+1 (555) 456-7890',
    emergencyRelationship: 'Daughter',
    allergies: [],
    medicalHistory: ['High Cholesterol', 'Migraine Headaches'],
    primaryProviderId: 'PROV-003',
    primaryProviderName: 'Dr. Jennifer Lee',
    occupation: 'Accountant',
    maritalStatus: 'Married',
    createdAt: '2025-10-18T09:45:00Z',
    updatedAt: '2025-10-18T09:45:00Z'
  },
  {
    id: 'PAT004',
    mrn: 'MRN-00004',
    name: 'Maria Garcia',
    firstName: 'Maria',
    lastName: 'Garcia',
    dob: '1988-05-30',
    phone: '+1 (555) 456-7890',
    email: 'maria.garcia@email.com',
    address: '321 Elm Street',
    city: 'Houston',
    state: 'TX',
    zipCode: '77001',
    gender: 'Female',
    bloodType: 'O-',
    status: 'Active',
    primaryInsuranceId: 'INS-456789',
    primaryInsuranceName: 'Humana',
    primaryPolicyNumber: 'POL-456789123',
    emergencyContact: 'Carlos Garcia',
    emergencyPhone: '+1 (555) 567-8901',
    emergencyRelationship: 'Father',
    allergies: ['Latex', 'Iodine'],
    medicalHistory: ['Arthritis', 'Back Pain'],
    primaryProviderId: 'PROV-004',
    primaryProviderName: 'Dr. Michael Chen',
    occupation: 'Teacher',
    maritalStatus: 'Divorced',
    createdAt: '2025-10-15T11:20:00Z',
    updatedAt: '2025-10-15T11:20:00Z'
  },
  {
    id: 'PAT005',
    mrn: 'MRN-00005',
    name: 'David Lee',
    firstName: 'David',
    lastName: 'Lee',
    dob: '1995-01-12',
    phone: '+1 (555) 567-8901',
    email: 'david.lee@email.com',
    address: '654 Maple Drive',
    city: 'Phoenix',
    state: 'AZ',
    zipCode: '85001',
    gender: 'Male',
    bloodType: 'AB+',
    status: 'Active',
    primaryInsuranceId: 'INS-567890',
    primaryInsuranceName: 'Kaiser Permanente',
    primaryPolicyNumber: 'POL-567890234',
    emergencyContact: 'Lisa Lee',
    emergencyPhone: '+1 (555) 678-9012',
    emergencyRelationship: 'Sister',
    allergies: ['Amoxicillin'],
    medicalHistory: ['Anxiety Disorder'],
    primaryProviderId: 'PROV-005',
    primaryProviderName: 'Dr. Jessica Williams',
    occupation: 'Graphic Designer',
    maritalStatus: 'Single',
    createdAt: '2025-10-12T15:30:00Z',
    updatedAt: '2025-10-12T15:30:00Z'
  }
];

// In-memory storage for patients (simulating database)
let patientsDatabase: Patient[] = [...SEED_PATIENTS];

/**
 * Get all patients
 */
export async function getAllPatients(): Promise<Patient[]> {
  return Promise.resolve([...patientsDatabase]);
}

/**
 * Get patient by ID
 */
export async function getPatientById(id: string): Promise<Patient | null> {
  const patient = patientsDatabase.find(p => p.id === id);
  return Promise.resolve(patient || null);
}

/**
 * Get patient by MRN
 */
export async function getPatientByMRN(mrn: string): Promise<Patient | null> {
  const patient = patientsDatabase.find(p => p.mrn === mrn);
  return Promise.resolve(patient || null);
}

/**
 * Create a new patient
 */
export async function createPatient(patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Promise<Patient> {
  const newPatient: Patient = {
    ...patientData,
    id: `PAT${String(patientsDatabase.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  patientsDatabase.push(newPatient);
  return Promise.resolve(newPatient);
}

/**
 * Update a patient
 */
export async function updatePatient(
  id: string,
  updates: Partial<Omit<Patient, 'id' | 'createdAt'>>
): Promise<Patient | null> {
  const index = patientsDatabase.findIndex(p => p.id === id);
  
  if (index === -1) {
    return Promise.resolve(null);
  }
  
  const updatedPatient: Patient = {
    ...patientsDatabase[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  patientsDatabase[index] = updatedPatient;
  return Promise.resolve(updatedPatient);
}

/**
 * Delete a patient (soft delete - mark as inactive)
 */
export async function deletePatient(id: string): Promise<boolean> {
  const index = patientsDatabase.findIndex(p => p.id === id);
  
  if (index === -1) {
    return Promise.resolve(false);
  }
  
  // Soft delete - mark as Inactive
  patientsDatabase[index].status = 'Inactive';
  patientsDatabase[index].updatedAt = new Date().toISOString();
  
  return Promise.resolve(true);
}

/**
 * Hard delete a patient (remove from database)
 */
export async function hardDeletePatient(id: string): Promise<boolean> {
  const initialLength = patientsDatabase.length;
  patientsDatabase = patientsDatabase.filter(p => p.id !== id);
  
  return Promise.resolve(patientsDatabase.length < initialLength);
}

/**
 * Search patients by name, MRN, or phone
 */
export async function searchPatients(query: string): Promise<Patient[]> {
  const lowerQuery = query.toLowerCase();
  
  return Promise.resolve(
    patientsDatabase.filter(patient =>
      patient.name.toLowerCase().includes(lowerQuery) ||
      patient.mrn.toLowerCase().includes(lowerQuery) ||
      patient.phone.includes(query) ||
      patient.email.toLowerCase().includes(lowerQuery)
    )
  );
}

/**
 * Get patients by status
 */
export async function getPatientsByStatus(status: 'Active' | 'Inactive' | 'Discharged'): Promise<Patient[]> {
  return Promise.resolve(
    patientsDatabase.filter(patient => patient.status === status)
  );
}

/**
 * Update patient status
 */
export async function updatePatientStatus(
  id: string,
  status: 'Active' | 'Inactive' | 'Discharged'
): Promise<Patient | null> {
  return updatePatient(id, { status });
}

/**
 * Add allergies to patient
 */
export async function addPatientAllergy(id: string, allergy: string): Promise<Patient | null> {
  const patient = await getPatientById(id);
  
  if (!patient) {
    return null;
  }
  
  const updatedAllergies = [...new Set([...patient.allergies, allergy])]; // Avoid duplicates
  return updatePatient(id, { allergies: updatedAllergies });
}

/**
 * Remove allergy from patient
 */
export async function removePatientAllergy(id: string, allergy: string): Promise<Patient | null> {
  const patient = await getPatientById(id);
  
  if (!patient) {
    return null;
  }
  
  const updatedAllergies = patient.allergies.filter(a => a !== allergy);
  return updatePatient(id, { allergies: updatedAllergies });
}

/**
 * Add medical history entry
 */
export async function addMedicalHistory(id: string, condition: string): Promise<Patient | null> {
  const patient = await getPatientById(id);
  
  if (!patient) {
    return null;
  }
  
  const updatedHistory = [...new Set([...patient.medicalHistory, condition])]; // Avoid duplicates
  return updatePatient(id, { medicalHistory: updatedHistory });
}

/**
 * Get active patients count
 */
export async function getActivePatientsCount(): Promise<number> {
  return Promise.resolve(
    patientsDatabase.filter(p => p.status === 'Active').length
  );
}

/**
 * Reset database to seed data (for testing)
 */
export async function resetDatabase(): Promise<void> {
  patientsDatabase = [...SEED_PATIENTS];
  return Promise.resolve();
}
