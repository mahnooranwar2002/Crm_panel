const STATIC_COMPANIES = [
  { _id: 'company-1', name: 'Wholcure Health', industry: 'Healthcare', website: 'www.wholcure.com', owner_id: { name: 'Adeel Hassan' }, address: 'Karachi, Pakistan' },
  { _id: 'company-2', name: 'Nova Labs', industry: 'Biotech', website: 'www.novalabs.com', owner_id: { name: 'Sara Ahmed' }, address: 'Lahore, Pakistan' },
  { _id: 'company-3', name: 'GreenCare', industry: 'Wellness', website: 'www.greencare.io', owner_id: { name: 'Bilal Shah' }, address: 'Islamabad, Pakistan' },
];

export const CompanyService = {
  async getCompanies(page = 1, limit = 10, search = '') {
    const filtered = STATIC_COMPANIES.filter((company) => !search || company.name.toLowerCase().includes(search.toLowerCase()));
    return {
      companies: filtered.slice(0, limit),
      pagination: { total: filtered.length, page, limit },
    };
  },

  async getCompanyById(id: string) {
    return STATIC_COMPANIES.find((company) => company._id === id) || STATIC_COMPANIES[0];
  },

  async createCompany(companyData: any) {
    return { ...companyData, _id: `company-${Date.now()}` };
  },

  async updateCompany(id: string, companyData: any) {
    return { ...companyData, _id: id };
  },

  async deleteCompany(_id: string) {
    return null;
  },
};
