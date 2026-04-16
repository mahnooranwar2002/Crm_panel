"use client";
import React, { useState, useEffect } from 'react';
import { FiEye, FiEdit2, FiTrash2, FiPlus, FiX, FiBriefcase, FiMail, FiUser, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { LeadService } from '@/src/services/leadService';
import { AuthService } from '@/src/services/authService';
import { UserService } from '@/src/services/userService';

const STATUS_COLORS: any = {
  New: 'bg-blue-100 text-blue-700 ring-blue-500/20',
  Contacted: 'bg-amber-100 text-amber-700 ring-amber-500/20',
  Qualified: 'bg-purple-100 text-purple-700 ring-purple-500/20',
  Lost: 'bg-rose-100 text-rose-700 ring-rose-500/20',
};

interface Lead {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  source: string;
  status: string;
  assignedTo?: any;
}

export const LeadsTable = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [addingLead, setAddingLead] = useState<Lead | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [userRole, setUserRole] = useState('');
  const [roleLoaded, setRoleLoaded] = useState(false);

  useEffect(() => {
    const initializeData = async () => {
      await fetchUserRole();
    };
    initializeData();
    fetchLeads();
    fetchUsers();
  }, []);

  const fetchUserRole = async () => {
    try {
      // Fetch fresh user data from backend
      const currentUser = await AuthService.getCurrentUser();
      const userData = currentUser?.user || currentUser?.data || currentUser;
      
      // Extract role - handle various formats
      let role = '';
      if (userData?.role) {
        if (typeof userData.role === 'object' && userData.role?.role_name) {
          role = userData.role.role_name.trim();
        } else if (typeof userData.role === 'string') {
          role = userData.role.trim();
        }
      }
      
      console.log('fetchUserRole - Raw userData:', userData);
      console.log('fetchUserRole - Extracted role:', role);
      setUserRole(role);
      setRoleLoaded(true);
    } catch (err: any) {
      // Fallback to localStorage if backend call fails
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
      console.log('fetchUserRole fallback - localStorage user:', user);
      console.log('fetchUserRole fallback - Extracted role:', role);
      setUserRole(role);
      setRoleLoaded(true);
    }
  };

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await LeadService.getLeads(1, 100);
      setLeads(data?.leads || []);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching leads:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await UserService.getSalesUsers(100);
      setUsers(data?.users || []);
    } catch (err: any) {
      console.error('Error fetching sales users:', err);
    }
  };

  const addLead = async () => {
    // Double check permission before sending request
    if (!canCreateLead) {
      alert('Access denied. Only Admin and Manager can create leads.');
      setAddingLead(null);
      return;
    }

    if (!addingLead?.firstName || !addingLead?.email) {
      alert('Please fill required fields');
      return;
    }

    try {
      setLoading(true);
      await LeadService.createLead({
        firstName: addingLead.firstName,
        lastName: addingLead.lastName || '',
        email: addingLead.email,
        company: addingLead.company,
        source: addingLead.source,
        status: addingLead.status,
        assignedTo: addingLead.assignedTo,
      });
      setAddingLead(null);
      fetchLeads();
    } catch (err: any) {
      const errorMsg = err.message || 'Unknown error occurred';
      if (errorMsg.includes('Access denied') || errorMsg.includes('Only Admin')) {
        alert('Access denied. Only Admin and Manager can create leads.');
      } else {
        alert('Error: ' + errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateLead = async () => {
    if (!editingLead?._id || !editingLead?.firstName) {
      alert('Please fill required fields');
      return;
    }

    try {
      setLoading(true);
      
      // For Sales users, only allow status update on assigned leads
      if (isSalesUser) {
        // Check if this lead is assigned to the current user
        await LeadService.updateLead(editingLead._id, {
          status: editingLead.status,
        });
      } else {
        // Admin and Manager can update all fields
        await LeadService.updateLead(editingLead._id, {
          firstName: editingLead.firstName,
          lastName: editingLead.lastName || '',
          email: editingLead.email,
          company: editingLead.company,
          source: editingLead.source,
          status: editingLead.status,
          assignedTo: editingLead.assignedTo,
        });
      }
      
      setEditingLead(null);
      fetchLeads();
    } catch (err: any) {
      const errorMsg = err.message || 'Unknown error occurred';
      if (errorMsg.includes('Access denied') || errorMsg.includes('assigned to you')) {
        alert('You can only update leads assigned to you.');
      } else {
        alert('Error: ' + errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteLead = async (id: string) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      try {
        if (!canDeleteLead) {
          alert('Access denied. Only Admin can delete leads.');
          return;
        }
        await LeadService.deleteLead(id);
        fetchLeads();
      } catch (err: any) {
        const errorMsg = err.message || 'Unknown error occurred';
        if (errorMsg.includes('Access denied') || errorMsg.includes('Only Admin')) {
          alert('Access denied. Only Admin can delete leads.');
        } else {
          alert('Error: ' + errorMsg);
        }
      }
    }
  };

  const canCreateLead = userRole.toLowerCase() === 'admin' || userRole.toLowerCase() === 'manager';
  const canDeleteLead = userRole.toLowerCase() === 'admin';
  const canAssignLead = userRole.toLowerCase() === 'admin' || userRole.toLowerCase() === 'manager';
  const isSalesUser = userRole.toLowerCase() === 'sales';

  // Debug logging
  console.log('LeadsTable - userRole:', `"${userRole}"`, 'userRole.length:', userRole.length, 'canCreateLead:', canCreateLead);

  if (loading && leads.length === 0) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="w-full space-y-6 p-6 text-black bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Leads Management</h1>
          <p className="text-slate-500 font-medium">Role: <span className="font-bold text-indigo-600">{roleLoaded ? userRole : 'Loading...'}</span></p>
        </div>
        {roleLoaded && canCreateLead && (
          <button
            onClick={() => setAddingLead({
              firstName: '',
              lastName: '',
              email: '',
              company: '',
              source: 'Ads',
              status: 'New',
            } as Lead)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg transition-all"
          >
            <FiPlus /> Add New Lead
          </button>
        )}
      </div>

      {/* Role Info */}
      {isSalesUser && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
          <FiAlertCircle className="text-blue-600 mt-0.5 flex-shrink-0" size={18} />
          <p className="text-blue-700 text-sm">
            You can only see and update leads assigned to you.
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
          <FiAlertCircle className="text-rose-600 mt-0.5 flex-shrink-0" size={18} />
          <p className="text-rose-700 text-sm">Error: {error}</p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[11px] font-black uppercase tracking-widest">
            <tr>
              <th className="px-8 py-5">Lead Name</th>
              <th className="px-8 py-5">Contact</th>
              <th className="px-8 py-5">Company</th>
              <th className="px-8 py-5">Status</th>
              {(canAssignLead || userRole === 'Admin') && <th className="px-8 py-5">Assigned To</th>}
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {leads.map((lead) => (
              <tr key={lead._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-4">
                  <p className="font-bold text-slate-800">{lead.firstName} {lead.lastName}</p>
                </td>
                <td className="px-8 py-4">
                  <div className="text-sm font-semibold text-slate-600 flex flex-col">
                    <span className="flex items-center gap-1"><FiMail size={12}/> {lead.email}</span>
                  </div>
                </td>
                <td className="px-8 py-4">
                  <span className="text-sm font-medium text-slate-600">{lead.company}</span>
                </td>
                <td className="px-8 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${STATUS_COLORS[lead.status]}`}>
                    {lead.status}
                  </span>
                </td>
                {(canAssignLead || userRole === 'Admin') && (
                  <td className="px-8 py-4 text-sm">
                    <span className="text-slate-600">{lead.assignedTo?.name || 'Unassigned'}</span>
                  </td>
                )}
                <td className="px-8 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setSelectedLead(lead)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><FiEye size={18}/></button>
                    {!isSalesUser && (
                      <button onClick={() => setEditingLead(lead)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg"><FiEdit2 size={18}/></button>
                    )}
                    {isSalesUser && (
                      <button onClick={() => setEditingLead(lead)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg" title="Update Status"><FiCheckCircle size={18}/></button>
                    )}
                    {canDeleteLead && (
                      <button onClick={() => deleteLead(lead._id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><FiTrash2 size={18}/></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {(addingLead || editingLead || selectedLead) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => {setAddingLead(null); setEditingLead(null); setSelectedLead(null)}}></div>
          
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-800">
                {addingLead ? "Create Lead" : editingLead ? (isSalesUser ? "Update Status" : "Edit Lead") : "Lead Details"}
              </h2>
              <button onClick={() => {setAddingLead(null); setEditingLead(null); setSelectedLead(null)}} className="p-2 hover:bg-slate-100 rounded-full"><FiX size={20}/></button>
            </div>

            {/* Add/Edit Form */}
            {(addingLead || editingLead) && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">First Name *</label>
                    <input 
                      className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl" 
                      value={addingLead?.firstName || editingLead?.firstName || ""}
                      onChange={(e) => addingLead ? setAddingLead({...addingLead, firstName: e.target.value}) : setEditingLead({...editingLead!, firstName: e.target.value})}
                      disabled={isSalesUser}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Last Name</label>
                    <input 
                      className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl" 
                      value={addingLead?.lastName || editingLead?.lastName || ""}
                      onChange={(e) => addingLead ? setAddingLead({...addingLead, lastName: e.target.value}) : setEditingLead({...editingLead!, lastName: e.target.value})}
                      disabled={isSalesUser}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Email</label>
                    <input 
                      className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl" 
                      value={addingLead?.email || editingLead?.email || ""}
                      onChange={(e) => addingLead ? setAddingLead({...addingLead, email: e.target.value}) : setEditingLead({...editingLead!, email: e.target.value})}
                      disabled={isSalesUser}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Company</label>
                    <input 
                      className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl" 
                      value={addingLead?.company || editingLead?.company || ""}
                      onChange={(e) => addingLead ? setAddingLead({...addingLead, company: e.target.value}) : setEditingLead({...editingLead!, company: e.target.value})}
                      disabled={isSalesUser}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Source</label>
                    <select 
                      className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl"
                      value={addingLead?.source || editingLead?.source || ""}
                      onChange={(e) => addingLead ? setAddingLead({...addingLead, source: e.target.value}) : setEditingLead({...editingLead!, source: e.target.value})}
                      disabled={isSalesUser}
                    >
                      <option value="Ads">Ads</option>
                      <option value="Referral">Referral</option>
                      <option value="Website">Website</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Status</label>
                    <select 
                      className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl"
                      value={addingLead?.status || editingLead?.status || ""}
                      onChange={(e) => addingLead ? setAddingLead({...addingLead, status: e.target.value}) : setEditingLead({...editingLead!, status: e.target.value})}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </div>
                  {canAssignLead && (
                    <div className="col-span-2 space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Assign To</label>
                      <select 
                        className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl"
                        value={addingLead?.assignedTo?._id || editingLead?.assignedTo?._id || ""}
                        onChange={(e) => {
                          const selected = users.find(u => u._id === e.target.value);
                          if (addingLead) setAddingLead({...addingLead, assignedTo: selected});
                          else setEditingLead({...editingLead!, assignedTo: selected});
                        }}
                      >
                        <option value="">Unassigned</option>
                        {users.filter(u => u.role?.role_name === 'Sales').map(u => (
                          <option key={u._id} value={u._id}>{u.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <button 
                  onClick={addingLead ? addLead : updateLead}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.5rem] font-black mt-4 shadow-lg"
                >
                  {addingLead ? "Create Lead" : "Update Lead"}
                </button>
              </div>
            )}

            {/* View Mode */}
            {selectedLead && (
              <div className="flex flex-col items-center text-center">
                <div className="w-full grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                    <div className="bg-white p-2 rounded-xl shadow-sm text-slate-400"><FiBriefcase/></div>
                    <div className="text-left"><p className="text-[10px] font-black text-slate-400 uppercase">Name</p><p className="font-bold text-slate-700">{selectedLead.firstName} {selectedLead.lastName}</p></div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                    <div className="bg-white p-2 rounded-xl shadow-sm text-slate-400"><FiMail/></div>
                    <div className="text-left"><p className="text-[10px] font-black text-slate-400 uppercase">Email</p><p className="font-bold text-slate-700">{selectedLead.email}</p></div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                    <div className="bg-white p-2 rounded-xl shadow-sm text-slate-400"><FiBriefcase/></div>
                    <div className="text-left"><p className="text-[10px] font-black text-slate-400 uppercase">Company</p><p className="font-bold text-slate-700">{selectedLead.company}</p></div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                    <div className="bg-white p-2 rounded-xl shadow-sm text-slate-400"><FiCheckCircle/></div>
                    <div className="text-left"><p className="text-[10px] font-black text-slate-400 uppercase">Status</p><p className={`font-bold ${STATUS_COLORS[selectedLead.status]?.split(' ')[1]}`}>{selectedLead.status}</p></div>
                  </div>
                  {canAssignLead && (
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                      <div className="bg-white p-2 rounded-xl shadow-sm text-slate-400"><FiUser/></div>
                      <div className="text-left"><p className="text-[10px] font-black text-slate-400 uppercase">Assigned To</p><p className="font-bold text-slate-700">{selectedLead.assignedTo?.name || 'Unassigned'}</p></div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsTable;
