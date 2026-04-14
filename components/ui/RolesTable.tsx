"use client"
import React, { useState, useEffect } from 'react';
import { FiShield, FiEdit3, FiTrash2, FiPlus, FiLock, FiSettings, FiCheckCircle } from 'react-icons/fi';
import { RoleService } from '@/src/services/roleService';

// Define a type for your Role for better DX
interface Role {
  id: string | number;
  role_name: string;
  permissions: string;
  users_count: number;
  status: number;
}

const RolesTable = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const data = await RoleService.getRoles(1, 100);
      const rolesArray = Array.isArray(data) ? data : data?.roles || [];
      setRoles(rolesArray);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (role: Role | null = null) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const deleteRole = async (id: any) => {
    if (window.confirm('Are you sure you want to delete this role? This might affect assigned users.')) {
      try {
        await RoleService.deleteRole(id);
        setRoles(roles.filter(r => r.id !== id)); // Optimistic UI update
      } catch (err: any) {
        alert('Error: ' + err.message);
      }
    }
  };

  return (
    <div className="w-full text-black space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <FiShield className="text-emerald-600" /> Roles & Permissions
          </h1>
          <p className="text-sm text-slate-500 mt-1">Define access levels and security protocols for your team.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-200 active:scale-95"
        >
          <FiPlus size={18} />
          <span>Define New Role</span>
        </button>
      </div>

      {/* --- TABLE CONTAINER --- */}
      <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] border border-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.03)] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-600"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <p className="text-rose-600 font-medium bg-rose-50 px-4 py-2 rounded-lg">{error}</p>
            <button onClick={fetchRoles} className="text-sm font-bold text-emerald-600 hover:underline">Retry Connection</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/60 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Role Name</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Permissions Scope</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Active Users</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {roles.map((role) => (
                  <tr key={role.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${role.role_name.toLowerCase().includes('admin') ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                          <FiLock size={16} />
                        </div>
                        <span className="font-bold text-slate-700">{role.role_name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.split(',').slice(0, 3).map((p, i) => (
                          <span key={i} className="text-[11px] font-semibold text-slate-500 bg-white border border-slate-100 px-2 py-1 rounded-md shadow-sm">
                            {p.trim()}
                          </span>
                        ))}
                        {role.permissions.split(',').length > 3 && (
                          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                            +{role.permissions.split(',').length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="text-xs font-black text-slate-600 bg-slate-100 w-8 h-8 inline-flex items-center justify-center rounded-full">
                        {role.users_count}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${role.status === 1 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${role.status === 1 ? 'bg-emerald-500 animate-pulse' : 'bg-rose-400'}`}></span>
                        {role.status === 1 ? 'Active' : 'Disabled'}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenModal(role)}
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                        >
                          <FiSettings size={18} />
                        </button>
                        <button 
                          onClick={() => deleteRole(role.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RolesTable;