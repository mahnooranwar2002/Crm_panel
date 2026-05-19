"use client";

import React, { useState, useEffect } from "react";
import {
  FiEye,
  FiEdit2,
  FiTrash2,
  FiMail,
  FiPlus,
  FiX,
  FiPhone,
  FiShield,
  FiUser,
} from "react-icons/fi";
import { UserService } from "@/src/services/userService";
import { RoleService } from "@/src/services/roleService";
import { getAvatarUrl } from "@/src/utils/avatarHelper";
import toast, { Toaster } from 'react-hot-toast';

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

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addingUser.password || addingUser.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    const loadToast = toast.loading("Deploying new user...");
    try {
      const payload = {
        ...addingUser,
        role: addingUser.role?._id || addingUser.role,
      };
      await UserService.createUser(payload);
      
      toast.success("User deployed successfully!", { id: loadToast });
      setAddingUser(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Failed to add user", { id: loadToast });
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadToast = toast.loading("Updating profile...");
    try {
      const payload = { ...editingUser, role: editingUser.role?._id || editingUser.role };
      if (!payload.password) delete payload.password;

      await UserService.updateUser(editingUser._id, payload);
      
      toast.success("Profile updated! ✨", { id: loadToast });
      setEditingUser(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Update failed", { id: loadToast });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await UserService.deleteUser(id);
        toast.success("User removed from directory");
        fetchUsers();
      } catch (err: any) {
        toast.error(err.message || "Could not delete user");
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'INACTIVE':
        return 'bg-red-50 text-red-600 border-red-100';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen p-6 text-black">
      <div className="max-w-7xl mx-auto">
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">User Directory</h1>
            <p className="text-slate-500 font-medium">Manage team access and profiles.</p>
          </div>
          <button
            onClick={() =>
              setAddingUser({
                name: "",
                email: "",
                status: "ACTIVE",
                role: "",
                phone: "",
                password: "",
              })
            }
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all font-bold"
          >
            <FiPlus size={20} /> Add New User
          </button>
        </div>

        {/* --- Table Container --- */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center opacity-40">
                        <FiUser size={48} className="mb-2" />
                        <p className="font-medium">Loading Directory...</p>
                      </div>
                    </td>
                  </tr>
                ) : userData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center opacity-40">
                        <FiUser size={48} className="mb-2" />
                        <p className="font-medium">No users found in the directory</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  userData.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={getAvatarUrl(user.avatar, user.name)}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-100 shadow-sm"
                            alt="avatar"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{user.name}</p>
                            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-wider mt-0.5">
                              {user.role?.role_name || "No Role Assigned"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700 text-sm">{user.email}</td>
                      <td className="px-6 py-4 text-slate-500 text-sm font-medium">{user.phone || "—"}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase border ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="text-slate-400 hover:text-green-600 transition-colors"
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          onClick={() => setEditingUser(user)}
                          className="text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
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

      {/* --- View User Sidebar --- */}
      {selectedUser && (
        <>
          <div
            className="fixed inset-0 z-[998] bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setSelectedUser(null)}
          />
          <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl z-[999] animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h2 className="text-2xl font-black text-slate-800">User Details</h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 flex items-center gap-4">
                  <img
                    src={getAvatarUrl(selectedUser.avatar, selectedUser.name)}
                    className="w-14 h-14 rounded-xl object-cover border border-indigo-200/60 shadow-sm"
                    alt="profile"
                  />
                  <div>
                    <p className="text-xl font-black text-indigo-950">{selectedUser.name}</p>
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-wider mt-0.5">
                      {selectedUser.role?.role_name || "No Role Assigned"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Email Address</label>
                    <p className="font-bold text-slate-700 flex items-center gap-2 text-sm">
                      <FiMail className="text-slate-400" /> {selectedUser.email}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Phone Number</label>
                    <p className="font-bold text-slate-700 flex items-center gap-2 text-sm">
                      <FiPhone className="text-slate-400" /> {selectedUser.phone || "Not Provided"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">User Status</label>
                    <div>
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase inline-block border ${getStatusColor(selectedUser.status)}`}>
                        {selectedUser.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* --- Add / Edit User Sidebar Form --- */}
      {(addingUser || editingUser) && (
        <>
          <div
            className="fixed inset-0 z-[998] bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => {
              setAddingUser(null);
              setEditingUser(null);
            }}
          />
          <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl z-[999] animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h2 className="text-2xl font-black text-slate-800">
                  {addingUser ? "Add New User" : "Edit User Profile"}
                </h2>
                <button
                  onClick={() => {
                    setAddingUser(null);
                    setEditingUser(null);
                  }}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={addingUser ? handleAddUser : handleUpdateUser} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-indigo-500 focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm"
                    value={addingUser?.name || editingUser?.name || ""}
                    onChange={(e) => {
                      if (addingUser) setAddingUser({ ...addingUser, name: e.target.value });
                      else setEditingUser({ ...editingUser, name: e.target.value });
                    }}
                    placeholder="e.g. John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-indigo-500 focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm"
                    value={addingUser?.email || editingUser?.email || ""}
                    onChange={(e) => {
                      if (addingUser) setAddingUser({ ...addingUser, email: e.target.value });
                      else setEditingUser({ ...editingUser, email: e.target.value });
                    }}
                    placeholder="email@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-indigo-500 focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm"
                    value={addingUser?.phone || editingUser?.phone || ""}
                    onChange={(e) => {
                      if (addingUser) setAddingUser({ ...addingUser, phone: e.target.value });
                      else setEditingUser({ ...editingUser, phone: e.target.value });
                    }}
                    placeholder="+92..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    {addingUser ? "Password *" : "Change Password (Leave blank to keep)"}
                  </label>
                  <input
                    type="password"
                    required={!!addingUser}
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-indigo-500 focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm"
                    value={addingUser?.password || editingUser?.password || ""}
                    onChange={(e) => {
                      if (addingUser) setAddingUser({ ...addingUser, password: e.target.value });
                      else setEditingUser({ ...editingUser, password: e.target.value });
                    }}
                    placeholder={addingUser ? "Create strong password" : "••••••••"}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Assign Role
                  </label>
                  <select
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none font-medium text-slate-600 cursor-pointer text-sm focus:border-indigo-500 focus:bg-white transition-all"
                    value={
                      addingUser
                        ? addingUser.role?._id || addingUser.role
                        : editingUser?.role?._id || editingUser?.role
                    }
                    onChange={(e) => {
                      if (addingUser) setAddingUser({ ...addingUser, role: e.target.value });
                      else setEditingUser({ ...editingUser, role: e.target.value });
                    }}
                  >
                    <option value="">Select Role</option>
                    {roles.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.role_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    User Status
                  </label>
                  <select
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none font-medium text-slate-600 cursor-pointer text-sm focus:border-indigo-500 focus:bg-white transition-all"
                    value={addingUser?.status || editingUser?.status || "ACTIVE"}
                    onChange={(e) => {
                      if (addingUser) setAddingUser({ ...addingUser, status: e.target.value });
                      else setEditingUser({ ...editingUser, status: e.target.value });
                    }}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-2xl transition-all shadow-lg shadow-indigo-100 active:scale-95"
                >
                  {addingUser ? "Deploy New User" : "Update Profile"}
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