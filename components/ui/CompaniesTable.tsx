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
    <div className="w-full p-4 md:p-8 bg-[#f8fafc] min-h-screen text-slate-800">
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
            className="flex items-center justify-center gap-2 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:scale-105 active:scale-95 transition-all w-full md:w-auto"
            style={{ backgroundColor: PRIMARY_COLOR }}
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
          className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-[#21a9ff] focus:outline-none transition-all font-medium text-slate-700"
        />
      </div>

      {/* --- Table Section --- */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-32 gap-3">
            <FiLoader className="animate-spin" size={32} style={{ color: PRIMARY_COLOR }} />
            <p className="text-lg font-bold text-slate-600">Loading companies...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[12px] font-black uppercase tracking-[0.15em] text-slate-400 border-b border-slate-100">
                  <th className="px-10 py-6">Company Info</th>
                  <th className="px-10 py-6">Industry</th>
                  <th className="px-10 py-6">Owner</th>
                  <th className="px-10 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-600">
                {companies.length > 0 ? (
                  companies.map((company) => (
                    <tr key={company._id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-slate-100 rounded-xl group-hover:bg-white transition-colors" style={{ color: PRIMARY_COLOR }}>
                            <FiBriefcase size={20} />
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-800 text-lg">{company.name}</p>
                            <p className="text-sm text-slate-400 font-medium">
                              {company.website || 'No website'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-wider">
                          {company.industry}
                        </span>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#6dc6fe]/20 flex items-center justify-center text-[#21a9ff] font-bold text-xs uppercase">
                            {(company.owner_id?.name || `${company.owner_id?.firstName || ''} ${company.owner_id?.lastName || ''}` || '?').charAt(0)}
                          </div>
                          <p className="text-sm font-bold text-slate-700">
                            {company.owner_id?.name || `${company.owner_id?.firstName || ''} ${company.owner_id?.lastName || ''}`.trim() || company.owner_id?.email || 'Unassigned'}
                          </p>
                        </div>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <div className="flex justify-end gap-3">
                          <button 
                            onClick={() => setSelectedCompany(company)} 
                            className="p-3 text-slate-400 hover:text-[#21a9ff] hover:bg-white rounded-xl shadow-sm transition-all"
                            title="View details"
                          >
                            <FiEye size={20}/>
                          </button>
                          <button 
                            onClick={() => setEditingCompany(company)} 
                            className="p-3 text-slate-400 hover:text-amber-500 hover:bg-white rounded-xl shadow-sm transition-all"
                            title="Edit company"
                          >
                            <FiEdit2 size={20}/>
                          </button>
                          <button 
                            onClick={() => handleDelete(company._id!)} 
                            disabled={deleting === company._id}
                            className="p-3 text-slate-400 hover:text-red-500 hover:bg-white rounded-xl shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete company"
                          >
                            {deleting === company._id ? <FiLoader className="animate-spin" size={20} /> : <FiTrash2 size={20}/>}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-10 py-32 text-center">
                      <div className="flex flex-col items-center justify-center opacity-40">
                        <FiBriefcase size={60} className="mb-4" />
                        <p className="text-xl font-bold">No companies found</p>
                        <p className="text-sm">Try adding a new company or changing your search.</p>
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
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                    Company Name
                  </p>
                  <p className="text-xl font-black text-slate-900">
                    {selectedCompany.name}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                      Industry
                    </p>
                    <p className="text-lg font-bold text-slate-700">
                      {selectedCompany.industry}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                      Owner
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#6dc6fe]/20 flex items-center justify-center text-[#21a9ff] font-bold text-xs uppercase">
                        {(selectedCompany.owner_id?.name || `${selectedCompany.owner_id?.firstName || ''} ${selectedCompany.owner_id?.lastName || ''}` || '?').charAt(0)}
                      </div>
                      <p className="font-bold text-slate-700">
                        {selectedCompany.owner_id?.name || `${selectedCompany.owner_id?.firstName || ''} ${selectedCompany.owner_id?.lastName || ''}`.trim() || selectedCompany.owner_id?.email || 'Unassigned'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                    <FiGlobe /> Website
                  </p>
                  <a
                    href={selectedCompany.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-900 font-bold hover:underline"
                  >
                    {selectedCompany.website || 'No website'}
                  </a>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                    <FiMapPin /> Address
                  </p>
                  <p className="text-lg font-bold text-slate-700">
                    {selectedCompany.address || 'No address provided'}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedCompany(null)}
                  className="w-full py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold transition-all"
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
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold"
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
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold"
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
                      className="w-full pl-12 pr-6 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold"
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
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none appearance-none font-bold"
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
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold resize-none"
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
                  onClick={
                    addingCompany
                      ? async () => {
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
                  className="w-full py-4 bg-[#21a9ff] hover:bg-[#6dc6fe] text-white rounded-2xl font-black shadow-lg shadow-blue-100 transition-all active:scale-95"
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