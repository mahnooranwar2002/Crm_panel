"use client"
import React, { useState, useEffect } from 'react';
import { FiEdit3, FiTrash2, FiPlus, FiLock, FiSettings, FiX } from 'react-icons/fi';
import { RoleService } from '@/src/services/roleService';

const RolesTable = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleStatus, setNewRoleStatus] = useState('1');
  const [newRolePermissions, setNewRolePermissions] = useState<string[]>([]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [editRoleName, setEditRoleName] = useState('');
  const [editRoleStatus, setEditRoleStatus] = useState('1');
  const [editRolePermissions, setEditRolePermissions] = useState<string[]>([]);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await RoleService.getRoles(1, 100);
      
      // FIX: Backend response structure 'response.data.roles' hai
      let rolesArray = [];
      if (response && response.data && Array.isArray(response.data.roles)) {
        rolesArray = response.data.roles;
      } else if (Array.isArray(response)) {
        rolesArray = response;
      } else if (response && Array.isArray(response.roles)) {
        rolesArray = response.roles;
      }
      
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
      await RoleService.createRole({ 
        role_name: newRoleName, 
        status: parseInt(newRoleStatus),
        permissions: newRolePermissions 
      });
      setIsModalOpen(false);
      setNewRoleName('');
      setNewRoleStatus('1');
      setNewRolePermissions([]);
      fetchRoles();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleEditRole = (role: any) => {
    setEditingRole(role);
    setEditRoleName(role.role_name);
    setEditRoleStatus(role.status.toString());
    setEditRolePermissions(Array.isArray(role.permissions) ? role.permissions : []);
    setIsEditModalOpen(true);
  };

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await RoleService.updateRole(editingRole._id, { 
        role_name: editRoleName, 
        status: parseInt(editRoleStatus),
        permissions: editRolePermissions 
      });
      setIsEditModalOpen(false);
      setEditingRole(null);
      fetchRoles();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteRole = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await RoleService.deleteRole(id);
        fetchRoles();
      } catch (err: any) {
        alert('Error: ' + err.message);
      }
    }
  };

  return (
    <div className="w-full space-y-6 animate-in slide-in-from-bottom-4 duration-500 relative">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
           Roles & Permissions
          </h1>
          <p className="text-sm text-slate-500 mt-1">Define access levels and security protocols for your team.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-[#21a9ff] hover:bg-[#6dc6fe] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-blue-100"
        >
          <FiPlus size={18} />
          <span>Define New Role</span>
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg mx-2">
          Error: {error}
        </div>
      )}

      <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] border border-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.03)] overflow-hidden mx-2">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-100">
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Role Name</th>
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Scope & Permissions</th>
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center">Status</th>
                <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] text-right">Settings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-medium">Loading security protocols...</td></tr>
              ) : roles.length === 0 ? (
                <tr><td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-medium">No roles found in the directory</td></tr>
              ) : (
                roles.map((role) => (
                  <tr key={role._id} className="hover:bg-blue-50/30 transition-all duration-300 group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-blue-50 text-[#21a9ff]">
                          <FiLock size={18} />
                        </div>
                        {/* FIX: Field name role_name use karein */}
                        <span className="font-bold text-slate-800 text-[15px]">{role.role_name || 'Unnamed Role'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-wrap gap-1.5">
                        {Array.isArray(role.permissions) && role.permissions.length > 0 ? (
                          role.permissions.map((perm: string, index: number) => (
                            <span key={index} className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100/50">
                              {perm}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">Global Access</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        {/* FIX: status Number check */}
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${Number(role.status) === 1 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${Number(role.status) === 1 ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                          {Number(role.status) === 1 ? 'Active' : 'Disabled'}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEditRole(role)} className="p-2.5 text-slate-400 hover:text-[#21a9ff] hover:bg-white rounded-xl transition-all hover:shadow-md border border-transparent hover:border-slate-100">
                          <FiSettings size={18} />
                        </button>
                        <button onClick={() => handleDeleteRole(role._id)} className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl transition-all hover:shadow-md border border-transparent hover:border-slate-100">
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

      {/* CREATE ROLE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[440px] rounded-[2.5rem] shadow-[0_20px_70px_-10px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-10 pt-10 pb-6 flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">New Role</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-600">
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleCreateRole} className="px-10 pb-10 space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Role Title</label>
                <input type="text" required value={newRoleName} onChange={(e) => setNewRoleName(e.target.value)} placeholder="e.g. Senior Manager" className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-[#21a9ff] focus:bg-white transition-all outline-none text-slate-700 font-medium" />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Initial Status</label>
                <select value={newRoleStatus} onChange={(e)=>setNewRoleStatus(e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none font-medium text-slate-600 cursor-pointer">
                  <option value="1">Active</option>
                  <option value="0">Disabled</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Permissions (comma-separated)</label>
                <input type="text" value={newRolePermissions.join(', ')} onChange={(e) => setNewRolePermissions(e.target.value.split(',').map(p => p.trim()).filter(p => p))} placeholder="Sales, Support, Admin" className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-[#21a9ff] focus:bg-white outline-none font-medium" />
              </div>
              <button type="submit" className="w-full bg-[#21a9ff] hover:bg-[#6dc6fe] text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-100 active:scale-[0.98]">
                Deploy Role
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ROLE MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 text-black z-[999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[440px] rounded-[2.5rem] shadow-[0_20px_70px_-10px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="px-10 pt-10 pb-6 flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Modify Role</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-600">
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleUpdateRole} className="px-10 pb-10 space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Update Title</label>
                <input type="text" required value={editRoleName} onChange={(e) => setEditRoleName(e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-[#21a9ff] outline-none text-slate-700 font-medium" />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Update Status</label>
                <select value={editRoleStatus} onChange={(e)=>setEditRoleStatus(e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none">
                  <option value="1">Active</option>
                  <option value="0">Disabled</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Modify Permissions</label>
                <input type="text" value={editRolePermissions.join(', ')} onChange={(e) => setEditRolePermissions(e.target.value.split(',').map(p => p.trim()).filter(p => p))} className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-[#21a9ff] outline-none font-medium" />
              </div>
              <button type="submit" className="w-full bg-[#21a9ff] hover:bg-[#6dc6fe] text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-100">
                Update Security Profile
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default RolesTable;