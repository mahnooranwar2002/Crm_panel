// Provider Types
export interface Provider {
  id: string;
  providerId: string; // Provider identifier (PROV-XXXX)
  firstName: string;
  lastName: string;
  npiNumber: string; // National Provider Identifier
  taxonomyCode?: string; // Provider specialty code
  specialty: string; // Medical specialty (e.g., Family Medicine, Cardiology)
  licenseNumber: string; // State medical license
  licenseState: string; // State where licensed
  phone: string;
  email: string;
  facilityAddress: string;
  facilityCity: string;
  facilityState: string;
  facilityZipCode: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  createdAt: string;
  updatedAt: string;
}

// Hard-coded Seed Data
const SEED_PROVIDERS: Provider[] = [
  {
    id: 'PROV001',
    providerId: 'PROV-2026-001',
    firstName: 'Sarah',
    lastName: 'Smith',
    npiNumber: '1234567890',
    taxonomyCode: '207Q00000X',
    specialty: 'Family Medicine',
    licenseNumber: 'MD-98765',
    licenseState: 'CA',
    phone: '+1 (555) 123-4567',
    email: 's.smith@clinic.com',
    facilityAddress: '123 Medical Plaza Drive',
    facilityCity: 'San Francisco',
    facilityState: 'CA',
    facilityZipCode: '94102',
    status: 'Active',
    createdAt: '2025-10-01T10:30:00Z',
    updatedAt: '2025-10-01T10:30:00Z'
  },
  {
    id: 'PROV002',
    providerId: 'PROV-2026-002',
    firstName: 'Robert',
    lastName: 'Miller',
    npiNumber: '1234567891',
    taxonomyCode: '208600000X',
    specialty: 'Cardiology',
    licenseNumber: 'MD-87654',
    licenseState: 'NY',
    phone: '+1 (555) 234-5678',
    email: 'r.miller@heartcare.com',
    facilityAddress: '456 Cardio Center',
    facilityCity: 'New York',
    facilityState: 'NY',
    facilityZipCode: '10001',
    status: 'Active',
    createdAt: '2025-10-02T14:15:00Z',
    updatedAt: '2025-10-02T14:15:00Z'
  },
  {
    id: 'PROV003',
    providerId: 'PROV-2026-003',
    firstName: 'Jennifer',
    lastName: 'Lee',
    npiNumber: '1234567892',
    taxonomyCode: '207R00000X',
    specialty: 'Pediatrics',
    licenseNumber: 'MD-76543',
    licenseState: 'TX',
    phone: '+1 (555) 345-6789',
    email: 'j.lee@kidshealth.com',
    facilityAddress: '789 Children\'s Hospital',
    facilityCity: 'Houston',
    facilityState: 'TX',
    facilityZipCode: '77001',
    status: 'Active',
    createdAt: '2025-10-03T09:45:00Z',
    updatedAt: '2025-10-03T09:45:00Z'
  },
  {
    id: 'PROV004',
    providerId: 'PROV-2026-004',
    firstName: 'Michael',
    lastName: 'Chen',
    npiNumber: '1234567893',
    taxonomyCode: '207LP2000X',
    specialty: 'Orthopedics',
    licenseNumber: 'MD-65432',
    licenseState: 'FL',
    phone: '+1 (555) 456-7890',
    email: 'm.chen@ortho.com',
    facilityAddress: '321 Bone & Joint Center',
    facilityCity: 'Miami',
    facilityState: 'FL',
    facilityZipCode: '33101',
    status: 'Active',
    createdAt: '2025-10-04T11:20:00Z',
    updatedAt: '2025-10-04T11:20:00Z'
  },
  {
    id: 'PROV005',
    providerId: 'PROV-2026-005',
    firstName: 'Jessica',
    lastName: 'Williams',
    npiNumber: '1234567894',
    taxonomyCode: '207NA0000X',
    specialty: 'Neurology',
    licenseNumber: 'MD-54321',
    licenseState: 'IL',
    phone: '+1 (555) 567-8901',
    email: 'j.williams@neuro.com',
    facilityAddress: '654 Neuro Institute',
    facilityCity: 'Chicago',
    facilityState: 'IL',
    facilityZipCode: '60601',
    status: 'Active',
    createdAt: '2025-10-05T15:30:00Z',
    updatedAt: '2025-10-05T15:30:00Z'
  },
  {
    id: 'PROV006',
    providerId: 'PROV-2026-006',
    firstName: 'David',
    lastName: 'Johnson',
    npiNumber: '1234567895',
    taxonomyCode: '207ZZ0100Y',
    specialty: 'Psychiatry',
    licenseNumber: 'MD-43210',
    licenseState: 'WA',
    phone: '+1 (555) 678-9012',
    email: 'd.johnson@mentalhealth.com',
    facilityAddress: '987 Wellness Center',
    facilityCity: 'Seattle',
    facilityState: 'WA',
    facilityZipCode: '98101',
    status: 'Active',
    createdAt: '2025-10-06T13:00:00Z',
    updatedAt: '2025-10-06T13:00:00Z'
  }
];

// In-memory storage for providers (simulating database)
let providersDatabase: Provider[] = [...SEED_PROVIDERS];

/**
 * Get all providers
 */
export async function getAllProviders(): Promise<Provider[]> {
  return Promise.resolve([...providersDatabase]);
}

/**
 * Get provider by ID
 */
export async function getProviderById(id: string): Promise<Provider | null> {
  const provider = providersDatabase.find(p => p.id === id);
  return Promise.resolve(provider || null);
}

/**
 * Get provider by NPI number
 */
export async function getProviderByNPI(npiNumber: string): Promise<Provider | null> {
  const provider = providersDatabase.find(p => p.npiNumber === npiNumber);
  return Promise.resolve(provider || null);
}

/**
 * Create a new provider
 */
export async function createProvider(providerData: Omit<Provider, 'id' | 'createdAt' | 'updatedAt'>): Promise<Provider> {
  const newProvider: Provider = {
    ...providerData,
    id: `PROV${String(providersDatabase.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  providersDatabase.push(newProvider);
  return Promise.resolve(newProvider);
}

/**
 * Update a provider
 */
export async function updateProvider(
  id: string,
  updates: Partial<Omit<Provider, 'id' | 'createdAt'>>
): Promise<Provider | null> {
  const index = providersDatabase.findIndex(p => p.id === id);
  
  if (index === -1) {
    return Promise.resolve(null);
  }
  
  const updatedProvider: Provider = {
    ...providersDatabase[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  providersDatabase[index] = updatedProvider;
  return Promise.resolve(updatedProvider);
}

/**
 * Delete a provider (soft delete - mark as inactive)
 */
export async function deleteProvider(id: string): Promise<boolean> {
  const index = providersDatabase.findIndex(p => p.id === id);
  
  if (index === -1) {
    return Promise.resolve(false);
  }
  
  // Soft delete - mark as Inactive
  providersDatabase[index].status = 'Inactive';
  providersDatabase[index].updatedAt = new Date().toISOString();
  
  return Promise.resolve(true);
}

/**
 * Hard delete a provider (remove from database)
 */
export async function hardDeleteProvider(id: string): Promise<boolean> {
  const initialLength = providersDatabase.length;
  providersDatabase = providersDatabase.filter(p => p.id !== id);
  
  return Promise.resolve(providersDatabase.length < initialLength);
}

/**
 * Search providers by name, specialty, or NPI
 */
export async function searchProviders(query: string): Promise<Provider[]> {
  const lowerQuery = query.toLowerCase();
  
  return Promise.resolve(
    providersDatabase.filter(provider =>
      provider.firstName.toLowerCase().includes(lowerQuery) ||
      provider.lastName.toLowerCase().includes(lowerQuery) ||
      provider.specialty.toLowerCase().includes(lowerQuery) ||
      provider.npiNumber.includes(query) ||
      provider.email.toLowerCase().includes(lowerQuery)
    )
  );
}

/**
 * Get providers by status
 */
export async function getProvidersByStatus(status: 'Active' | 'Inactive' | 'Suspended'): Promise<Provider[]> {
  return Promise.resolve(
    providersDatabase.filter(provider => provider.status === status)
  );
}

/**
 * Get providers by specialty
 */
export async function getProvidersBySpecialty(specialty: string): Promise<Provider[]> {
  return Promise.resolve(
    providersDatabase.filter(provider => provider.specialty.toLowerCase().includes(specialty.toLowerCase()))
  );
}

/**
 * Update provider status
 */
export async function updateProviderStatus(
  id: string,
  status: 'Active' | 'Inactive' | 'Suspended'
): Promise<Provider | null> {
  return updateProvider(id, { status });
}

/**
 * Get active providers count
 */
export async function getActiveProvidersCount(): Promise<number> {
  return Promise.resolve(
    providersDatabase.filter(p => p.status === 'Active').length
  );
}

/**
 * Reset database to seed data (for testing)
 */
export async function resetDatabase(): Promise<void> {
  providersDatabase = [...SEED_PROVIDERS];
  return Promise.resolve();
}
