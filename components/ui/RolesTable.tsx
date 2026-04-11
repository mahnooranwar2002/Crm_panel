"use client"
import React, { useState } from 'react';
import { FiShield, FiEdit3, FiTrash2, FiPlus, FiCheckCircle, FiLock, FiSettings } from 'react-icons/fi';

// Dummy Roles Data based on RBAC documentation
const initialRoles = [
  { id: 1, role_name: 'Super Admin', status: 1, permissions: 'All Access', users_count: 2 },
  { id: 2, role_name: 'Sales Manager', status: 1, permissions: 'View, Edit, Delete', users_count: 5 },
  { id: 3, role_name: 'Sales Agent', status: 1, permissions: 'View, Edit (Own)', users_count: 12 },
  { id: 4, role_name: 'Support Executive', status: 0, permissions: 'View Only', users_count: 4 },
];

const RolesTable = () => {
  const [roles, setRoles] = useState(initialRoles);

  return (
    <div className="w-full space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
           Roles & Permissions
          </h1>
          <p className="text-sm text-slate-500 mt-1">Define access levels and security protocols for your team.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-200 active:scale-95">
                  <FiPlus size={18} />
          <span>Define New Role</span>
        </button>
      </div>

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
              {roles.map((role) => (
                <tr key={role.id} className="hover:bg-indigo-50/20 transition-all duration-300 group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${role.role_name === 'Super Admin' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                        <FiLock size={18} />
                      </div>
                      <span className="font-bold text-slate-800 text-[15px]">{role.role_name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-medium text-slate-500 bg-white border border-slate-100 px-3 py-1.5 rounded-lg shadow-sm">
                      {role.permissions}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="text-[13px] font-extrabold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                      {role.users_count}
                    </span>
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
                      <button title="Delete Role" className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl transition-all hover:shadow-md">
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
};

export default RolesTable;