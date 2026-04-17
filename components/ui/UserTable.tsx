"use client";
import React, { useState, useEffect, useRef } from "react";
import { FiEye, FiEdit2, FiTrash2, FiMail, FiPlus, FiX, FiPhone, FiCamera, FiShield } from "react-icons/fi";
import { UserService } from "@/src/services/userService";
import { RoleService } from "@/src/services/roleService";
import { getAvatarUrl } from "@/src/utils/avatarHelper";

export const UserTable = () => {
  const [userData, setUserData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<any[]>([]);
  
  // Modals state
  const [addingUser, setAddingUser] = useState<any | null>(null);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await UserService.getUsers(1, 100);
      const usersArray = response?.data?.users || response?.users || [];
      setUserData(usersArray);
    } catch (err: any) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await RoleService.getRoles(1, 100);
      setRoles(response?.data?.roles || response?.roles || []);
    } catch (err) {
      console.error("Roles fetch error");
    }
  };

  const handleAddUser = async () => {
    try {
      const payload = {
        ...addingUser,
        role: addingUser.role?._id || addingUser.role, // ObjectId string
        password: "DefaultPassword123" 
      };
      await UserService.createUser(payload);
      setAddingUser(null);
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateUser = async () => {
    try {
      const payload = {
        ...editingUser,
        role: editingUser.role?._id || editingUser.role // Ensure ID string
      };
      await UserService.updateUser(editingUser._id, payload);
      setEditingUser(null);
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await UserService.deleteUser(id);
        fetchUsers();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="w-full space-y-6 p-6 bg-slate-50 min-h-screen text-slate-800">
      {/* --- Header --- */}
      <div className="flex justify-between items-center px-2">
        <div>
          <h1 className="text-3xl font-black tracking-tight">User Directory</h1>
          <p className="text-slate-500 font-medium">Manage team access and profiles</p>
        </div>
        <button 
          onClick={() => setAddingUser({ name: "", email: "", status: "ACTIVE", role: "", phone: "" })}
          className="bg-[#21a9ff] hover:bg-[#6dc6fe] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95"
        >
          <FiPlus /> Add New User
        </button>
      </div>

      {/* --- Table --- */}
      <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100 mx-2">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[11px] font-black uppercase text-slate-400 tracking-widest">
            <tr>
              <th className="px-8 py-5">User & Role</th>
              <th className="px-8 py-5">Contact</th>
              <th className="px-8 py-5 text-center">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan={4} className="p-20 text-center font-bold text-slate-400">Loading Directory...</td></tr>
            ) : userData.map((user) => (
              <tr key={user._id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-8 py-4">
                  <div className="flex items-center gap-4">
                    <img src={getAvatarUrl(user.avatar, user.name)} className="w-12 h-12 rounded-2xl object-cover shadow-sm" alt="avatar" />
                    <div>
                      <p className="font-bold text-slate-800">{user.name}</p>
                      <p className="text-[10px] font-black text-[#21a9ff] uppercase">
                        {user.role?.role_name || "No Role Assigned"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-4">
                   <div className="flex flex-col text-sm font-medium">
                      <span className="text-slate-600">{user.email}</span>
                      <span className="text-slate-400 text-xs">{user.phone || 'N/A'}</span>
                   </div>
                </td>
                <td className="px-8 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${user.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-8 py-4 text-right">
                   <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={() => setSelectedUser(user)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><FiEye size={18}/></button>
                     <button onClick={() => setEditingUser(user)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg"><FiEdit2 size={18}/></button>
                     <button onClick={() => handleDelete(user._id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><FiTrash2 size={18}/></button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- ADD / EDIT MODAL --- */}
      {(addingUser || editingUser) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => {setAddingUser(null); setEditingUser(null)}}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-800">{addingUser ? "Create New User" : "Modify Profile"}</h2>
              <button onClick={() => {setAddingUser(null); setEditingUser(null)}} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><FiX size={20}/></button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Full Name</label>
                  <input 
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 ring-[#21a9ff] transition-all outline-none"
                    value={addingUser?.name || editingUser?.name || ""}
                    onChange={e => addingUser ? setAddingUser({...addingUser, name: e.target.value}) : setEditingUser({...editingUser, name: e.target.value})}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Email</label>
                  <input 
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 ring-[#21a9ff] transition-all outline-none"
                    value={addingUser?.email || editingUser?.email || ""}
                    onChange={e => addingUser ? setAddingUser({...addingUser, email: e.target.value}) : setEditingUser({...editingUser, email: e.target.value})}
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Phone</label>
                  <input 
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 ring-[#21a9ff] transition-all outline-none"
                    value={addingUser?.phone || editingUser?.phone || ""}
                    onChange={e => addingUser ? setAddingUser({...addingUser, phone: e.target.value}) : setEditingUser({...editingUser, phone: e.target.value})}
                    placeholder="+92..."
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Assign Role</label>
                  <select 
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 ring-[#21a9ff] outline-none appearance-none"
                    value={addingUser ? (addingUser.role?._id || addingUser.role) : (editingUser?.role?._id || editingUser?.role)}
                    onChange={e => addingUser ? setAddingUser({...addingUser, role: e.target.value}) : setEditingUser({...editingUser, role: e.target.value})}
                  >
                    <option value="">Select Role</option>
                    {roles.map(r => <option key={r._id} value={r._id}>{r.role_name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">User Status</label>
                  <select 
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 ring-[#21a9ff] outline-none"
                    value={addingUser?.status || editingUser?.status || "ACTIVE"}
                    onChange={e => addingUser ? setAddingUser({...addingUser, status: e.target.value}) : setEditingUser({...editingUser, status: e.target.value})}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={addingUser ? handleAddUser : handleUpdateUser}
                className="w-full py-4 bg-[#21a9ff] hover:bg-[#6dc6fe] text-white rounded-[1.5rem] font-black mt-4 shadow-xl shadow-blue-100 transition-all active:scale-95"
              >
                {addingUser ? "Deploy New User" : "Update Profile"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- VIEW MODAL --- */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setSelectedUser(null)}></div>
          <div className="relative bg-white w-full max-w-sm rounded-[3rem] shadow-2xl p-10 animate-in zoom-in-95 duration-200 text-center">
             <div className="flex justify-end absolute top-6 right-6">
               <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><FiX size={20}/></button>
             </div>
             
             <div className="flex flex-col items-center">
                <img src={getAvatarUrl(selectedUser.avatar, selectedUser.name)} className="w-32 h-32 rounded-[2.5rem] shadow-2xl mb-6 border-4 border-white" alt="profile" />
                <h3 className="text-2xl font-black text-slate-800">{selectedUser.name}</h3>
                <p className="text-[#21a9ff] font-black text-xs uppercase tracking-widest mb-8">{selectedUser.role?.role_name || "Member"}</p>
                
                <div className="w-full space-y-3">
                   <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl text-left">
                      <div className="bg-white p-2 rounded-xl text-slate-400 shadow-sm"><FiMail/></div>
                      <div><p className="text-[9px] font-black text-slate-400 uppercase">Email</p><p className="font-bold text-slate-700 text-sm">{selectedUser.email}</p></div>
                   </div>
                   <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl text-left">
                      <div className="bg-white p-2 rounded-xl text-slate-400 shadow-sm"><FiPhone/></div>
                      <div><p className="text-[9px] font-black text-slate-400 uppercase">Phone</p><p className="font-bold text-slate-700 text-sm">{selectedUser.phone || "Not Provided"}</p></div>
                   </div>
                   <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl text-left">
                      <div className="bg-white p-2 rounded-xl text-slate-400 shadow-sm"><FiShield/></div>
                      <div><p className="text-[9px] font-black text-slate-400 uppercase">Status</p><p className="font-bold text-emerald-600 text-sm">{selectedUser.status}</p></div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};