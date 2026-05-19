'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { 
  FiEye, FiEdit2, FiTrash2, FiPlus, FiX, 
  FiBriefcase, FiGlobe, FiMapPin, FiSearch, FiLoader
} from 'react-icons/fi';
import { CompanyService } from '@/src/services/companyService';
import { UserService } from '@/src/services/userService';
import { AuthService } from '@/src/services/authService';
import toast, { Toaster } from 'react-hot-toast';

interface Company {
  _id?: string;
  name: string;
  industry: string;
  website: string;
  owner_id?: any;
  address: string;
}

const CompaniesTable = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [userRole, setUserRole] = useState('');
  
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [addingCompany, setAddingCompany] = useState<Company | null>(null);

  const PRIMARY_COLOR = "#21a9ff";
  const SECONDARY_COLOR = "#6dc6fe";

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchUserRole(), fetchCompanies(), fetchUsers()]);
      setLoading(false);
    };
    init();
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm || searchTerm === '') {
        fetchCompanies(searchTerm);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchUserRole = async () => {
    try {
      const res = await AuthService.getCurrentUser();
      const role = res?.role?.role_name || res?.role || res?.data?.role || '';
      console.log("Current User Role:", role);
      setUserRole(role.toString().toLowerCase().trim());
    } catch (err) {
      console.error("Role fetch error", err);
    }
  };

  const fetchCompanies = async (search = '') => {
    try {
      setLoading(true);
      const res = await CompanyService.getCompanies(1, 100, search);

      // Extract companies from response structure: { statusCode, data: { companies/result/...}, message, success }
      let data = [];
      if (Array.isArray(res)) {
        data = res;
      } else if (res?.data && Array.isArray(res.data)) {
        data = res.data;
      } else if (res?.data?.companies && Array.isArray(res.data.companies)) {
        data = res.data.companies;
      } else if (res?.data?.result && Array.isArray(res.data.result)) {
        data = res.data.result;
      } else if (res?.companies && Array.isArray(res.companies)) {
        data = res.companies;
      }

      console.log("✅ Companies fetched:", data);
      setCompanies(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("❌ Error fetching companies:", err);

      // Handle specific mongoose model errors
      if (err.message && err.message.includes("Schema hasn't been registered for model")) {
        console.warn("⚠️ Backend mongoose model issue detected. This is a server-side issue that needs to be fixed.");
        toast.error("Server configuration error. Please contact administrator.");
      } else {
        toast.error("Failed to fetch companies");
      }

      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await UserService.getUsers(1, 100);

      // Extract users from response structure: { statusCode, data: { users }, message, success }
      let userData = [];
      if (Array.isArray(res)) {
        userData = res;
      } else if (res?.data?.users && Array.isArray(res.data.users)) {
        userData = res.data.users;
      } else if (res?.data && Array.isArray(res.data)) {
        userData = res.data;
      } else if (res?.users && Array.isArray(res.users)) {
        userData = res.users;
      }

      console.log("✅ Users fetched:", userData);
      setUsers(Array.isArray(userData) ? userData : []);
    } catch (err: any) {
      console.error("❌ Users fetch error:", err);

      // Handle specific mongoose model errors
      if (err?.message && err.message.includes("Schema hasn't been registered for model")) {
        console.warn("⚠️ Backend mongoose model issue detected. This is a server-side issue that needs to be fixed.");
        toast.error("Server configuration error. Please contact administrator.");
      }

      setUsers([]);
    }
  };

  // Buttons visibility logic
  const canCreate = userRole === 'admin' || userRole === 'manager' || userRole === 'superadmin';

  const handleDelete = useCallback(async (companyId: string) => {
    if (!window.confirm('Are you sure you want to delete this company?')) return;
    
    setDeleting(companyId);
    const loadToast = toast.loading('Deleting...');
    try {
      await CompanyService.deleteCompany(companyId);
      toast.success('Company deleted successfully!', { id: loadToast });
      setSearchTerm('');
      await fetchCompanies('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete company', { id: loadToast });
    } finally {
      setDeleting(null);
    }
  }, []);

  return (
    <div className="w-full p-4 md:p-8 bg-slate-50 min-h-screen text-slate-800">
      <Toaster position="top-right" />

      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Companies</h1>
          <p className="text-slate-500 font-medium mt-1">Manage business accounts and ownership</p>
        </div>
        
        {(canCreate || userRole === '') && (
          <button
            onClick={() => setAddingCompany({ name: '', industry: '', website: '', address: '' })}
            className="flex items-center justify-center gap-2 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all w-full md:w-auto bg-indigo-600"
          >
            <FiPlus size={20} /> Add New Company
          </button>
        )}
      </div>

      {/* --- Search Bar --- */}
      <div className="mb-8 relative">
        <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search companies by name, industry, or website..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all font-medium text-slate-700 text-sm"
        />
      </div>

      {/* --- Table Section --- */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-32 gap-3">
            <FiLoader className="animate-spin text-indigo-600" size={32} />
            <p className="text-lg font-bold text-slate-600">Loading companies...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  <th className="px-6 py-4">Company Info</th>
                  <th className="px-6 py-4">Industry</th>
                  <th className="px-6 py-4">Owner</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {companies.length > 0 ? (
                  companies.map((company) => (
                    <tr key={company._id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100/50">
                            <FiBriefcase size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-base">{company.name}</p>
                            <p className="text-sm text-slate-400 font-medium">
                              {company.website || 'No website'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-bold uppercase border border-slate-200/60 tracking-wide">
                          {company.industry}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100/50 flex items-center justify-center font-bold text-xs uppercase">
                            {(company.owner_id?.name || `${company.owner_id?.firstName || ''} ${company.owner_id?.lastName || ''}` || '?').charAt(0)}
                          </div>
                          <p className="text-sm font-bold text-slate-700">
                            {company.owner_id?.name || `${company.owner_id?.firstName || ''} ${company.owner_id?.lastName || ''}`.trim() || company.owner_id?.email || 'Unassigned'}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => setSelectedCompany(company)} 
                            className="p-2 text-slate-400 hover:text-green-600 transition-colors"
                            title="View details"
                          >
                            <FiEye size={18}/>
                          </button>
                          <button 
                            onClick={() => setEditingCompany(company)} 
                            className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                            title="Edit company"
                          >
                            <FiEdit2 size={18}/>
                          </button>
                          <button 
                            onClick={() => handleDelete(company._id!)} 
                            disabled={deleting === company._id}
                            className="p-2 text-slate-400 hover:text-red-600 transition-colors disabled:opacity-30"
                            title="Delete company"
                          >
                            {deleting === company._id ? <FiLoader className="animate-spin" size={18} /> : <FiTrash2 size={18}/>}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center opacity-40">
                        <FiBriefcase size={48} className="mb-2 text-indigo-600" />
                        <p className="font-medium">No companies found</p>
                        <p className="text-xs text-slate-400 mt-1">Try adding a new company or changing your search.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- View Sidebar --- */}
      {selectedCompany && (
        <>
          <div
            className="fixed inset-0 z-[998] bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setSelectedCompany(null)}
          />
          <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl z-[999] animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h2 className="text-2xl font-black text-slate-800">
                  Company Details
                </h2>
                <button
                  onClick={() => setSelectedCompany(null)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-5 bg-indigo-50 rounded-2xl border border-indigo-100/50 flex items-center gap-4">
                  <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-md">
                    <FiBriefcase size={22} />
                  </div>
                  <div>
                    <p className="text-xl font-black text-indigo-950">{selectedCompany.name}</p>
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-wider mt-0.5">{selectedCompany.industry}</p>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      Owner
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center font-bold text-xs uppercase">
                        {(selectedCompany.owner_id?.name || `${selectedCompany.owner_id?.firstName || ''} ${selectedCompany.owner_id?.lastName || ''}` || '?').charAt(0)}
                      </div>
                      <p className="font-bold text-slate-700 text-sm">
                        {selectedCompany.owner_id?.name || `${selectedCompany.owner_id?.firstName || ''} ${selectedCompany.owner_id?.lastName || ''}`.trim() || selectedCompany.owner_id?.email || 'Unassigned'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      Website
                    </p>
                    <a
                      href={selectedCompany.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 font-bold text-sm hover:underline inline-flex items-center gap-1.5 pt-1"
                    >
                      <FiGlobe /> {selectedCompany.website || 'No website'}
                    </a>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      Address
                    </p>
                    <p className="font-bold text-slate-700 text-sm flex items-start gap-1.5 pt-1">
                      <FiMapPin className="text-slate-400 mt-0.5 shrink-0" /> {selectedCompany.address || 'No address provided'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCompany(null)}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all text-sm mt-4 border border-slate-200/50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* --- Add/Edit Sidebar --- */}
      {(addingCompany || editingCompany) && (
        <>
          <div
            className="fixed inset-0 z-[998] bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => {
              setAddingCompany(null);
              setEditingCompany(null);
            }}
          />
          <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl z-[999] animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h2 className="text-2xl font-black text-slate-800">
                  {addingCompany ? 'New Company' : 'Edit Company'}
                </h2>
                <button
                  onClick={() => {
                    setAddingCompany(null);
                    setEditingCompany(null);
                  }}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-5 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500 outline-none transition-all font-medium text-slate-700 text-sm"
                    value={addingCompany?.name || editingCompany?.name || ''}
                    onChange={(e) =>
                      addingCompany
                        ? setAddingCompany({ ...addingCompany, name: e.target.value })
                        : setEditingCompany({ ...editingCompany!, name: e.target.value })
                    }
                    placeholder="e.g. Google"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Industry
                  </label>
                  <input
                    type="text"
                    className="w-full px-5 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500 outline-none transition-all font-medium text-slate-700 text-sm"
                    value={addingCompany?.industry || editingCompany?.industry || ''}
                    onChange={(e) =>
                      addingCompany
                        ? setAddingCompany({ ...addingCompany, industry: e.target.value })
                        : setEditingCompany({ ...editingCompany!, industry: e.target.value })
                    }
                    placeholder="e.g. Tech"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Website URL
                  </label>
                  <div className="relative">
                    <FiGlobe className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      className="w-full pl-12 pr-6 py-3 rounded-xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500 outline-none transition-all font-medium text-slate-700 text-sm"
                      value={addingCompany?.website || editingCompany?.website || ''}
                      onChange={(e) =>
                        addingCompany
                          ? setAddingCompany({ ...addingCompany, website: e.target.value })
                          : setEditingCompany({ ...editingCompany!, website: e.target.value })
                      }
                      placeholder="www.aura.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Assign to Owner
                  </label>
                  <select
                    className="w-full px-5 py-3 bg-slate-50/50 border border-slate-100 rounded-xl focus:bg-white focus:border-indigo-500 outline-none font-medium text-slate-700 text-sm cursor-pointer"
                    value={addingCompany?.owner_id?._id || editingCompany?.owner_id?._id || ''}
                    onChange={(e) => {
                      const selectedUser = users.find((u) => u._id === e.target.value);
                      if (addingCompany) {
                        setAddingCompany({ ...addingCompany, owner_id: selectedUser || null });
                      } else {
                        setEditingCompany({ ...editingCompany!, owner_id: selectedUser || null });
                      }
                    }}
                  >
                    <option value="">Select an owner</option>
                    {Array.isArray(users) && users.length > 0 ? (
                      users.map((u) => (
                        <option key={u._id} value={u._id}>
                          {u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email || 'Unknown'}
                        </option>
                      ))
                    ) : (
                      <option disabled>No users available</option>
                    )}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Address
                  </label>
                  <textarea
                    className="w-full px-5 py-3 bg-slate-50/50 border border-slate-100 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all font-medium text-slate-700 text-sm resize-none"
                    rows={2}
                    value={addingCompany?.address || editingCompany?.address || ''}
                    onChange={(e) =>
                      addingCompany
                        ? setAddingCompany({ ...addingCompany, address: e.target.value })
                        : setEditingCompany({ ...editingCompany!, address: e.target.value })
                    }
                    placeholder="Street, City, Country"
                  />
                </div>

                <button
                  onClick={addingCompany ? async () => {
                        if (!addingCompany.name || !addingCompany.industry) {
                          toast.error('Please fill in all required fields');
                          return;
                        }
                        const loadToast = toast.loading('Creating...');
                        try {
                          await CompanyService.createCompany({
                            ...addingCompany,
                            owner_id: addingCompany.owner_id?._id,
                          });
                          toast.success('Success!', { id: loadToast });
                          setAddingCompany(null);
                          setSearchTerm('');
                          await fetchCompanies('');
                        } catch (e: any) {
                          toast.error(e.message, { id: loadToast });
                        }
                      }
                    : async () => {
                        if (!editingCompany?.name || !editingCompany?.industry) {
                          toast.error('Please fill in all required fields');
                          return;
                        }
                        const loadToast = toast.loading('Updating...');
                        try {
                          await CompanyService.updateCompany(editingCompany!._id!, {
                            ...editingCompany,
                            owner_id: editingCompany?.owner_id?._id,
                          });
                          toast.success('Updated!', { id: loadToast });
                          setEditingCompany(null);
                          setSearchTerm('');
                          await fetchCompanies('');
                        } catch (e: any) {
                          toast.error(e.message, { id: loadToast });
                        }
                      }
                  }
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-100 text-sm mt-4"
                >
                  Save Company Info
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CompaniesTable;