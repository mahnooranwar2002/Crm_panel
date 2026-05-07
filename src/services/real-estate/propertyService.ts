// Hard-coded seed data for properties
const propertiesDatabase = [
  {
    _id: "prop-001",
    property_id: "PROP-2026-001",
    address: "123 Main Street, Downtown",
    city: "Austin",
    state: "TX",
    zip_code: "78701",
    country: "USA",
    latitude: 30.2672,
    longitude: -97.7431,
    property_type: "Commercial",
    total_area: 50000,
    area_unit: "sq ft",
    price: 5000000,
    currency: "USD",
    owner_name: "John Doe",
    owner_contact: "john@example.com",
    status: "Available",
    listing_date: "2026-04-01",
    description: "Modern office complex with parking",
    amenities: [
      { name: "Parking", description: "500+ spaces" },
      { name: "Gym", description: "Equipped gym" }
    ],
    images: [],
    documents: [],
    createdAt: new Date("2026-04-01"),
    updatedAt: new Date("2026-04-01"),
  },
  {
    _id: "prop-002",
    property_id: "PROP-2026-002",
    address: "456 Oak Avenue, Midtown",
    city: "Austin",
    state: "TX",
    zip_code: "78702",
    country: "USA",
    latitude: 30.2773,
    longitude: -97.7533,
    property_type: "Residential",
    total_area: 3500,
    area_unit: "sq ft",
    price: 850000,
    currency: "USD",
    owner_name: "Jane Smith",
    owner_contact: "jane@example.com",
    status: "Sold",
    listing_date: "2026-03-15",
    description: "Beautiful family home with garden",
    amenities: [
      { name: "Pool", description: "Olympic size" },
      { name: "Garden", description: "2 acre garden" }
    ],
    images: [],
    documents: [],
    createdAt: new Date("2026-03-15"),
    updatedAt: new Date("2026-03-15"),
  },
  {
    _id: "prop-003",
    property_id: "PROP-2026-003",
    address: "789 Pine Road, North District",
    city: "Austin",
    state: "TX",
    zip_code: "78703",
    country: "USA",
    latitude: 30.3072,
    longitude: -97.7231,
    property_type: "Industrial",
    total_area: 120000,
    area_unit: "sq ft",
    price: 3200000,
    currency: "USD",
    owner_name: "ABC Manufacturing",
    owner_contact: "abc@manufacturing.com",
    status: "Available",
    listing_date: "2026-04-10",
    description: "Large warehouse with loading dock",
    amenities: [
      { name: "Loading Dock", description: "Multiple docks" },
      { name: "Security", description: "24/7 security" }
    ],
    images: [],
    documents: [],
    createdAt: new Date("2026-04-10"),
    updatedAt: new Date("2026-04-10"),
  },
  {
    _id: "prop-004",
    property_id: "PROP-2026-004",
    address: "321 Elm Street, South End",
    city: "Austin",
    state: "TX",
    zip_code: "78704",
    country: "USA",
    latitude: 30.2372,
    longitude: -97.7731,
    property_type: "Commercial",
    total_area: 25000,
    area_unit: "sq ft",
    price: 2500000,
    currency: "USD",
    owner_name: "Retail Corp",
    owner_contact: "retail@corp.com",
    status: "Rented",
    listing_date: "2026-02-20",
    description: "Prime retail location",
    amenities: [
      { name: "High Traffic", description: "Main street location" },
      { name: "Parking", description: "200 spaces" }
    ],
    images: [],
    documents: [],
    createdAt: new Date("2026-02-20"),
    updatedAt: new Date("2026-02-20"),
  },
];

interface Amenity {
  name: string;
  description: string;
}

interface Property {
  _id: string;
  property_id: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  latitude: number;
  longitude: number;
  property_type: string;
  total_area: number;
  area_unit: string;
  price: number;
  currency: string;
  owner_name: string;
  owner_contact: string;
  status: string;
  listing_date: string;
  description: string;
  amenities: Amenity[];
  images: string[];
  documents: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const propertyService = {
  // Get all properties
  getProperties: async (): Promise<Property[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(propertiesDatabase), 300);
    });
  },

  // Get single property
  getPropertyById: async (id: string): Promise<Property | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const property = propertiesDatabase.find(p => p._id === id);
        resolve(property || null);
      }, 200);
    });
  },

  // Create property
  createProperty: async (propertyData: any): Promise<Property> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newProperty = {
          ...propertyData,
          _id: `prop-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        propertiesDatabase.push(newProperty);
        resolve(newProperty);
      }, 300);
    });
  },

  // Update property
  updateProperty: async (id: string, propertyData: any): Promise<Property | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = propertiesDatabase.findIndex(p => p._id === id);
        if (index !== -1) {
          propertiesDatabase[index] = {
            ...propertiesDatabase[index],
            ...propertyData,
            updatedAt: new Date(),
          };
          resolve(propertiesDatabase[index]);
        } else {
          resolve(null);
        }
      }, 300);
    });
  },

  // Delete property
  deleteProperty: async (id: string): Promise<{ success: boolean; deletedProperty?: Property }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = propertiesDatabase.findIndex(p => p._id === id);
        if (index !== -1) {
          const deleted = propertiesDatabase.splice(index, 1);
          resolve({ success: true, deletedProperty: deleted[0] });
        } else {
          resolve({ success: false });
        }
      }, 300);
    });
  },

  // Get properties nearby (geolocation)
  getNearbyProperties: async (latitude: number, longitude: number, radius: number = 5): Promise<Property[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const nearby = propertiesDatabase.filter(p => {
          const distance = Math.sqrt(
            Math.pow(p.latitude - latitude, 2) + Math.pow(p.longitude - longitude, 2)
          );
          return distance <= radius;
        });
        resolve(nearby);
      }, 300);
    });
  }
};
