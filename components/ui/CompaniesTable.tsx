'use client';
import React, { useState, useEffect } from 'react';
import { FiEye, FiEdit2, FiTrash2, FiPlus, FiX, FiBriefcase, FiGlobe, FiMapPin, FiUser, FiAlertCircle, FiSearch } from 'react-icons/fi';
import { CompanyService } from '@/src/services/companyService';
import { AuthService } from '@/src/services/authService';
import { UserService } from '@/src/services/userService';

const STATUS_COLORS: any = {
  New: 'bg-blue-100 text-blue-700 ring-blue-500/20',
  Contacted: 'bg-amber-100 text-amber-700 ring-amber-500/20',
  Qualified: 'bg-purple-100 text-purple-700 ring-purple-500/20',
  Lost: 'bg-rose-100 text-rose-700 ring-rose-500/20',
};

interface Company {
  _id?: string;
  name: string;
  industry: string;
  website: string;
  owner_id?: any;
  address: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role?: any;
}

export const CompaniesTable = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [addingCompany, setAddingCompany] = useState<Company | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [userRole, setUserRole] = useState('');
  const [roleLoaded, setRoleLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const initializeData = async () => {
      await fetchUserRole();
    };
    initializeData();
    fetchCompanies();
    fetchUsers();
  }, []);

  const fetchUserRole = async () => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      const userData = currentUser?.user || currentUser?.data || currentUser;

      let role = '';
      if (userData?.role) {
        if (typeof userData.role === 'object' && userData.role?.role_name) {
          role = userData.role.role_name.trim();
        } else if (typeof userData.role === 'string') {
          role = userData.role.trim();
        }
      }

      console.log('fetchUserRole - Extracted role:', role);
      setUserRole(role);
      setRoleLoaded(true);
    } catch (err: any) {
      console.warn('Failed to fetch role from backend, using localStorage:', err.message);
      const user = AuthService.getUser();
      let role = '';
      if (user?.role) {
        if (typeof user.role === 'object' && user.role?.role_name) {
          role = user.role.role_name.trim();
        } else if (typeof user.role === 'string') {
          role = user.role.trim();
        }
      }
      setUserRole(role);
      setRoleLoaded(true);
    }
  };

  const fetchCompanies = async (page: number = 1, search: string = '') => {
    try {
      setLoading(true);
      const data = await CompanyService.getCompanies(page, 100, search);
      setCompanies(data?.companies || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching companies:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await UserService.getUsers(100);
      setUsers(data?.users || []);
    } catch (err: any) {
      console.error('Error fetching users:', err);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    fetchCompanies(1, value);
  };

  const createCompany = async () => {
    if (!addingCompany?.name || !addingCompany?.industry) {
      alert('Please fill required fields (Name and Industry)');
      return;
    }

    if (!canCreateCompany) {
      alert('Access denied. Only Admin and Manager can create companies.');
      setAddingCompany(null);
      return;
    }

    try {
      setLoading(true);
      await CompanyService.createCompany({
        name: addingCompany.name,
        industry: addingCompany.industry,
        website: addingCompany.website || '',
        address: addingCompany.address || '',
        owner_id: addingCompany.owner_id?._id || '',
      });

      setSuccessMessage('Company created successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setAddingCompany(null);
      fetchCompanies(currentPage, searchTerm);
    } catch (err: any) {
      const errorMsg = err.message || 'Unknown error occurred';
      if (errorMsg.includes('Access denied')) {
        alert('Access denied. Only Admin and Manager can create companies.');
      } else {
        alert('Error: ' + errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateCompany = async () => {
    if (!editingCompany?._id || !editingCompany?.name || !editingCompany?.industry) {
      alert('Please fill required fields');
      return;
    }

    try {
      setLoading(true);
      await CompanyService.updateCompany(editingCompany._id, {
        name: editingCompany.name,
        industry: editingCompany.industry,
        website: editingCompany.website || '',
        address: editingCompany.address || '',
        owner_id: editingCompany.owner_id?._id || '',
      });

      setSuccessMessage('Company updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      setEditingCompany(null);
      fetchCompanies(currentPage, searchTerm);
    } catch (err: any) {
      alert('Error: ' + (err.message || 'Unknown error occurred'));
    } finally {
      setLoading(false);
    }
  };

  const deleteCompany = async (id: string) => {
    if (confirm('Are you sure you want to delete this company?')) {
      try {
        if (!canDeleteCompany) {
          alert('Access denied. Only Admin can delete companies.');
          return;
        }
        await CompanyService.deleteCompany(id);
        setSuccessMessage('Company deleted successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchCompanies(currentPage, searchTerm);
      } catch (err: any) {
        const errorMsg = err.message || 'Unknown error occurred';
        if (errorMsg.includes('Access denied')) {
          alert('Access denied. Only Admin can delete companies.');
        } else {
          alert('Error: ' + errorMsg);
        }
      }
    }
  };

  const canCreateCompany = userRole.toLowerCase() === 'admin' || userRole.toLowerCase() === 'manager';
  const canEditCompany = userRole.toLowerCase() === 'admin' || userRole.toLowerCase() === 'manager';
  const canDeleteCompany = userRole.toLowerCase() === 'admin';

  console.log('CompaniesTable - userRole:', `"${userRole}"`, 'canCreateCompany:', canCreateCompany);

  if (loading && companies.length === 0) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="w-full space-y-6 p-6 text-black bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Companies Management</h1>
          <p className="text-slate-500 font-medium">Role: <span className="font-bold text-indigo-600">{roleLoaded ? userRole : 'Loading...'}</span></p>
        </div>
        {roleLoaded && canCreateCompany && (
          <button
            onClick={() => setAddingCompany({
              name: '',
              industry: '',
              website: '',
              address: '',
            })}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg transition-all"
          >
            <FiPlus /> Add Company
          </button>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 animate-in fade-in">
          <div className="text-green-600 mt-0.5 flex-shrink-0">✓</div>
          <p className="text-green-700 text-sm font-medium">{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
          <FiAlertCircle className="text-rose-600 mt-0.5 flex-shrink-0" size={18} />
          <p className="text-rose-700 text-sm">Error: {error}</p>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-4">
        <div className="relative">
          <FiSearch className="absolute left-4 top-3.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search companies by name or industry..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[11px] font-black uppercase tracking-widest">
            <tr>
              <th className="px-8 py-5">Company Name</th>
              <th className="px-8 py-5">Industry</th>
              <th className="px-8 py-5">Website</th>
              <th className="px-8 py-5">Owner</th>
              <th className="px-8 py-5">Address</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {companies.length > 0 ? (
              companies.map((company) => (
                <tr key={company._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                        <FiBriefcase size={16} />
                      </div>
                      <p className="font-bold text-slate-800">{company.name}</p>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                      {company.industry}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    {company.website ? (
                      <a
                        href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                      >
                        <FiGlobe size={14} /> {company.website}
                      </a>
                    ) : (
                      <span className="text-slate-400 text-sm">-</span>
                    )}
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-2">
                      <FiUser size={14} className="text-slate-400" />
                      <span className="text-sm text-slate-600">{company.owner_id?.name || 'Unassigned'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                      <FiMapPin size={14} className="text-slate-400" />
                      <span className="truncate max-w-xs">{company.address || '-'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedCompany(company)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="View"
                      >
                        <FiEye size={18} />
                      </button>
                      {canEditCompany && (
                        <button
                          onClick={() => setEditingCompany(company)}
                          className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <FiEdit2 size={18} />
                        </button>
                      )}
                      {canDeleteCompany && (
                        <button
                          onClick={() => deleteCompany(company._id || '')}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-8 py-16 text-center">
                  <FiBriefcase className="mx-auto text-slate-300 mb-3" size={40} />
                  <p className="text-slate-500 font-medium">No companies found</p>
                  {searchTerm && <p className="text-slate-400 text-sm">Try adjusting your search</p>}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {(addingCompany || editingCompany || selectedCompany) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            onClick={() => {
              setAddingCompany(null);
              setEditingCompany(null);
              setSelectedCompany(null);
            }}
          ></div>

          <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-800">
                {addingCompany ? '📝 Create New Company' : editingCompany ? '✏️ Edit Company' : '👁️ Company Details'}
              </h2>
              <button
                onClick={() => {
                  setAddingCompany(null);
                  setEditingCompany(null);
                  setSelectedCompany(null);
                }}
                className="p-2 hover:bg-slate-100 rounded-full transition-all"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Add/Edit Form */}
            {(addingCompany || editingCompany) && (
              <div className="space-y-5">
                {/* Company Name */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase ml-1">Company Name *</label>
                  <input
                    className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all"
                    placeholder="Enter company name"
                    value={addingCompany?.name || editingCompany?.name || ''}
                    onChange={(e) =>
                      addingCompany
                        ? setAddingCompany({ ...addingCompany, name: e.target.value })
                        : setEditingCompany({ ...editingCompany!, name: e.target.value })
                    }
                  />
                </div>

                {/* Industry */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase ml-1">Industry *</label>
                  <input
                    className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all"
                    placeholder="e.g., Technology, Finance, Healthcare"
                    value={addingCompany?.industry || editingCompany?.industry || ''}
                    onChange={(e) =>
                      addingCompany
                        ? setAddingCompany({ ...addingCompany, industry: e.target.value })
                        : setEditingCompany({ ...editingCompany!, industry: e.target.value })
                    }
                  />
                </div>

                {/* Website */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase ml-1">Website</label>
                  <div className="relative">
                    <FiGlobe className="absolute left-4 top-3.5 text-slate-400" size={16} />
                    <input
                      className="w-full pl-10 pr-5 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all"
                      placeholder="e.g., www.example.com"
                      value={addingCompany?.website || editingCompany?.website || ''}
                      onChange={(e) =>
                        addingCompany
                          ? setAddingCompany({ ...addingCompany, website: e.target.value })
                          : setEditingCompany({ ...editingCompany!, website: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase ml-1">Address</label>
                  <div className="relative">
                    <FiMapPin className="absolute left-4 top-3.5 text-slate-400" size={16} />
                    <textarea
                      className="w-full pl-10 pr-5 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all resize-none"
                      placeholder="Enter company address"
                      rows={3}
                      value={addingCompany?.address || editingCompany?.address || ''}
                      onChange={(e) =>
                        addingCompany
                          ? setAddingCompany({ ...addingCompany, address: e.target.value })
                          : setEditingCompany({ ...editingCompany!, address: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Company Owner */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase ml-1">Assign Owner</label>
                  <select
                    className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all"
                    value={addingCompany?.owner_id?._id || editingCompany?.owner_id?._id || ''}
                    onChange={(e) => {
                      const selected = users.find((u) => u._id === e.target.value);
                      if (addingCompany) setAddingCompany({ ...addingCompany, owner_id: selected });
                      else setEditingCompany({ ...editingCompany!, owner_id: selected });
                    }}
                  >
                    <option value="">Select Owner</option>
                    {users.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name} ({u.role?.role_name || 'No Role'})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  onClick={addingCompany ? createCompany : updateCompany}
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-400 text-white rounded-xl font-black mt-6 shadow-lg transition-all"
                >
                  {loading ? 'Saving...' : addingCompany ? '✓ Create Company' : '✓ Update Company'}
                </button>
              </div>
            )}

            {/* View Mode */}
            {selectedCompany && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl">
                  <div className="p-3 bg-white rounded-lg shadow-sm text-indigo-600">
                    <FiBriefcase size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase">Company Name</p>
                    <p className="text-2xl font-black text-slate-800">{selectedCompany.name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-xs font-black text-blue-600 uppercase mb-1">Industry</p>
                    <p className="text-sm font-bold text-blue-900">{selectedCompany.industry}</p>
                  </div>

                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-xs font-black text-green-600 uppercase mb-1">Owner</p>
                    <p className="text-sm font-bold text-green-900">{selectedCompany.owner_id?.name || 'Unassigned'}</p>
                  </div>
                </div>

                {selectedCompany.website && (
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                    <p className="text-xs font-black text-purple-600 uppercase mb-2">Website</p>
                    <a
                      href={selectedCompany.website.startsWith('http') ? selectedCompany.website : `https://${selectedCompany.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-700 hover:text-purple-900 font-semibold flex items-center gap-2 break-all"
                    >
                      <FiGlobe size={16} /> {selectedCompany.website}
                    </a>
                  </div>
                )}

                {selectedCompany.address && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-xs font-black text-amber-600 uppercase mb-2">Address</p>
                    <div className="flex items-start gap-2">
                      <FiMapPin size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-amber-900">{selectedCompany.address}</p>
                    </div>
                  </div>
                )}

                {canEditCompany && (
                  <button
                    onClick={() => {
                      setEditingCompany(selectedCompany);
                      setSelectedCompany(null);
                    }}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold mt-4 transition-all"
                  >
                    ✏️ Edit Company
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompaniesTable;
