"use client"
import React, { useState, useEffect } from 'react';
import { FiShield, FiEdit3, FiTrash2, FiPlus, FiCheckCircle, FiLock, FiSettings, FiX } from 'react-icons/fi';
import { RoleService } from '@/src/services/roleService';

const RolesTable = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // --- MODAL STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleStatus, setNewRoleStatus] = useState('');

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const data = await RoleService.getRoles(1, 100);
      const rolesArray = data?.roles || [];
      setRoles(rolesArray);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching roles:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Replace with your actual service call
      await RoleService.createRole({ role_name: newRoleName,status:newRoleStatus });
      alert('Role created successfully (Mock)');
      setIsModalOpen(false);
      setNewRoleName('');
      setNewRoleStatus('');
      fetchRoles();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteRole = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await RoleService.deleteRole(id);
        await fetchRoles();
      } catch (err: any) {
        alert('Error: ' + err.message);
      }
    }
  };

  return (
    <div className="w-full space-y-6 animate-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
           Roles & Permissions
          </h1>
          <p className="text-sm text-slate-500 mt-1">Define access levels and security protocols for your team.</p>
        </div>
        {/* OPEN MODAL ON CLICK */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-emerald-100 active:scale-95"
        >
          <FiPlus size={18} />
          <span>Define New Role</span>
        </button>
      </div>

      {/* --- ERROR MESSAGE --- */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg">
          Error: {error}
        </div>
      )}

      {/* --- ROLES GRID/TABLE --- */}
      <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] border border-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-100">
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Role Name</th>
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Scope & Permissions</th>
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center">Users</th>
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center">Status</th>
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] text-right">Settings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={5} className="px-8 py-8 text-center text-slate-500">Loading roles...</td></tr>
              ) : roles.length === 0 ? (
                <tr><td colSpan={5} className="px-8 py-8 text-center text-slate-500">No roles found</td></tr>
              ) : (
                roles.map((role) => (
                  <tr key={role.id} className="hover:bg-indigo-50/20 transition-all duration-300 group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${role.role_name === 'Super Admin' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                          <FiLock size={18} />
                        </div>
                        <span className="font-bold text-slate-800 text-[15px]">{role.role_name || role.name || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-medium text-slate-500 bg-white border border-slate-100 px-3 py-1.5 rounded-lg shadow-sm">
                        {role.permissions || 'N/A'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="text-[13px] font-extrabold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">{role.users_count || 0}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${role.status === 1 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${role.status === 1 ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                          {role.status === 1 ? 'Active' : 'Disabled'}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button title="Edit Permissions" className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-white rounded-xl transition-all hover:shadow-md">
                          <FiSettings size={18} />
                        </button>
                        <button title="Delete Role" onClick={() => handleDeleteRole(role._id)} className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl transition-all hover:shadow-md">
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL OVERLAY --- */}
   {/* --- MODAL OVERLAY --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          
          {/* MODAL CONTAINER */}
          <div className="bg-white w-full max-w-[440px] rounded-[2.5rem] shadow-[0_20px_70px_-10px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-300">
            
            {/* MODAL HEADER */}
            <div className="px-10 pt-10 pb-6 flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">New Role</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-600"
              >
                <FiX size={24} />
              </button>
            </div>
            
            {/* MODAL FORM */}
            <form onSubmit={handleCreateRole} className="px-10 pb-10 space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                  Role Name
                </label>
                <input 
                  type="text"
                  required
                  autoFocus
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="e.g. Content Manager"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-slate-700 font-medium placeholder:text-slate-300"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                  Role Status
                </label>
               <select name="Status" value={newRoleStatus} onChange={(e)=>setNewRoleStatus(e.target.value)} id="roleStatus" className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-slate-700 font-medium placeholder:text-slate-300">
               <option value="#">select the Status</option>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </div>
              
              
              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full bg-[#00a86b] hover:bg-[#008f5d] text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-emerald-200 active:scale-[0.98]"
                >
                  Save Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default RolesTable;