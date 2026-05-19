"use client"
import React, { useState, useEffect } from 'react';
import { FiEdit3, FiTrash2, FiPlus, FiLock, FiSettings, FiX, FiEye } from 'react-icons/fi';
import { RoleService } from '@/src/services/roleService';
import toast, { Toaster } from 'react-hot-toast';

const RolesTable = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modals & Sidebars state
  const [selectedRole, setSelectedRole] = useState<any | null>(null);
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
      setRoles(response?.data?.roles || response?.roles || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) {
      toast.error('Role name is required');
      return;
    }
    const loadToast = toast.loading('Creating new security profile...');
    try {
      await RoleService.createRole({
        role_name: newRoleName,
        status: newRoleStatus,
        permissions: newRolePermissions
      });
      toast.success('Role added to registry', { id: loadToast });
      setIsModalOpen(false);
      setNewRoleName('');
      setNewRoleStatus('1');
      setNewRolePermissions([]);
      fetchRoles();
    } catch (err: any) {
      toast.error(err.message || 'Creation failed', { id: loadToast });
    }
  };

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editRoleName.trim()) {
      toast.error('Role name is required');
      return;
    }
    const loadToast = toast.loading('Updating security policy...');
    try {
      await RoleService.updateRole(editingRole._id, {
        role_name: editRoleName,
        status: editRoleStatus,
        permissions: editRolePermissions
      });
      toast.success('Permissions updated successfully! ✨', { id: loadToast });
      setIsEditModalOpen(false);
      fetchRoles();
    } catch (err: any) {
      toast.error(err.message || 'Update failed', { id: loadToast });
    }
  };

  const handleDeleteRole = async (id: string) => {
    if (confirm('Are you sure you want to delete this role configuration?')) {
      const loadToast = toast.loading('Purging role registry...');
      try {
        await RoleService.deleteRole(id);
        toast.success('Role safely discarded', { id: loadToast });
        fetchRoles();
      } catch (err: any) {
        toast.error(err.message || 'Could not delete role', { id: loadToast });
      }
    }
  };

  const openEditModal = (role: any) => {
    setEditingRole(role);
    setEditRoleName(role.role_name);
    setEditRoleStatus(role.status?.toString() || '1');
    setEditRolePermissions(role.permissions || []);
    setIsEditModalOpen(true);
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen p-6 text-black">
      <div className="max-w-7xl mx-auto">
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Access Control & Roles</h1>
            <p className="text-slate-500 font-medium">Configure security credentials and platform permissions.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all font-bold"
          >
            <FiPlus size={20} /> Create Custom Role
          </button>
        </div>

        {/* --- Table Container --- */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role Designation</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Scope / Permissions</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center opacity-40">
                        <FiLock size={48} className="mb-2 text-indigo-600 animate-pulse" />
                        <p className="font-medium">Syncing Security Levels...</p>
                      </div>
                    </td>
                  </tr>
                ) : roles.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center opacity-40">
                        <FiLock size={48} className="mb-2" />
                        <p className="font-medium">No system access profiles registered</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  roles.map((role) => (
                    <tr key={role._id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                            <FiSettings size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{role.role_name}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{role._id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-md">
                        <div className="flex flex-wrap gap-1.5">
                          {role.permissions && role.permissions.length > 0 ? (
                            role.permissions.slice(0, 4).map((perm: string, index: number) => (
                              <span key={index} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold tracking-wide uppercase border border-slate-200/50">
                                {perm}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm font-medium text-slate-400 italic">No direct scope</span>
                          )}
                          {role.permissions && role.permissions.length > 4 && (
                            <span className="text-[10px] font-bold text-slate-400 self-center pl-1">
                              +{role.permissions.length - 4} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase border ${
                          role.status === 1 || role.status === "1"
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                            : 'bg-red-50 text-red-600 border-red-100'
                        }`}>
                          {role.status === 1 || role.status === "1" ? "Active" : "Disabled"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button
                          onClick={() => setSelectedRole(role)}
                          className="text-slate-400 hover:text-green-600 transition-colors"
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          onClick={() => openEditModal(role)}
                          className="text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          <FiEdit3 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteRole(role._id)}
                          className="text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- View Role Sidebar Card --- */}
      {selectedRole && (
        <>
          <div
            className="fixed inset-0 z-[998] bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setSelectedRole(null)}
          />
          <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl z-[999] animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h2 className="text-2xl font-black text-slate-800">Role Details</h2>
                <button
                  onClick={() => setSelectedRole(null)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="space-y-5">
                <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 flex items-center gap-4">
                  <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-md shadow-indigo-100">
                    <FiLock size={24} />
                  </div>
                  <div>
                    <p className="text-xl font-black text-indigo-950">{selectedRole.role_name}</p>
                    <p className="text-[10px] font-mono text-indigo-600 mt-0.5">ID: {selectedRole._id}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Policy Status</label>
                    <div>
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase inline-block border ${
                        selectedRole.status === 1 || selectedRole.status === "1"
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : 'bg-red-50 text-red-600 border-red-100'
                      }`}>
                        {selectedRole.status === 1 || selectedRole.status === "1" ? "Active" : "Disabled"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Assigned Scope & Permissions</label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {selectedRole.permissions && selectedRole.permissions.length > 0 ? (
                        selectedRole.permissions.map((perm: string, index: number) => (
                          <span key={index} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-[11px] font-bold border border-slate-200 uppercase tracking-wide">
                            {perm}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm font-medium text-slate-400 italic">No custom scopes defined for this configuration.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* --- Add / Edit Sidebar Form Window --- */}
      {(isModalOpen || isEditModalOpen) && (
        <>
          <div
            className="fixed inset-0 z-[998] bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => {
              setIsModalOpen(false);
              setIsEditModalOpen(false);
            }}
          />
          <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl z-[999] animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h2 className="text-2xl font-black text-slate-800">
                  {isModalOpen ? "Create Custom Role" : "Modify Security Policy"}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={isModalOpen ? handleCreateRole : handleUpdateRole} className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Role Designation Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. System Administrator"
                    value={isModalOpen ? newRoleName : editRoleName}
                    onChange={(e) => isModalOpen ? setNewRoleName(e.target.value) : setEditRoleName(e.target.value)}
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-indigo-500 focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Security Policy Status
                  </label>
                  <select
                    value={isModalOpen ? newRoleStatus : editRoleStatus}
                    onChange={(e) => isModalOpen ? setNewRoleStatus(e.target.value) : setEditRoleStatus(e.target.value)}
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none font-medium text-slate-600 cursor-pointer text-sm focus:border-indigo-500 focus:bg-white transition-all"
                  >
                    <option value="1">Active</option>
                    <option value="0">Disabled</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Permissions / Scope (Comma Separated)
                  </label>
                  <input
                    type="text"
                    placeholder="read:users, write:claims, delete:leads"
                    value={isModalOpen ? newRolePermissions.join(', ') : editRolePermissions.join(', ')}
                    onChange={(e) => {
                      const tokens = e.target.value.split(',').map(p => p.trim()).filter(p => p);
                      isModalOpen ? setNewRolePermissions(tokens) : setEditRolePermissions(tokens);
                    }}
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-indigo-500 focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-2xl transition-all shadow-lg shadow-indigo-100 active:scale-95 mt-4"
                >
                  {isModalOpen ? "Deploy New Configuration" : "Update Profile"}
                </button>
              </form>
            </div>
          </div>
        </>
      )}

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default RolesTable;