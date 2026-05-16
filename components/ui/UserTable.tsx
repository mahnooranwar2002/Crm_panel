"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  FiEye,
  FiEdit2,
  FiTrash2,
  FiMail,
  FiPlus,
  FiX,
  FiPhone,
  FiCamera,
  FiShield,
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

  const handleAddUser = async () => {
  if (!addingUser.password || addingUser.password.length < 6) {
    return toast.error("Password must be at least 6 characters");
  }

  const loadToast = toast.loading("Deploying new user..."); // Loading start
  try {
    const payload = {
      ...addingUser,
      role: addingUser.role?._id || addingUser.role,
    };
    await UserService.createUser(payload);
    
    toast.success("User deployed successfully!", { id: loadToast }); // Success
    setAddingUser(null);
    fetchUsers();
  } catch (err: any) {
    toast.error(err.message || "Failed to add user", { id: loadToast }); // Error
  }
};

  const handleUpdateUser = async () => {
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

  return (
    <div className="w-full space-y-6 p-6 bg-slate-50 min-h-screen text-slate-800">
      {/* --- Header --- */}
      <div className="flex justify-between items-center px-2">
        <div>
          <h1 className="text-3xl font-black tracking-tight">User Directory</h1>
          <p className="text-slate-500 font-medium">
            Manage team access and profiles
          </p>
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
              <tr>
                <td
                  colSpan={4}
                  className="p-20 text-center font-bold text-slate-400"
                >
                  Loading Directory...
                </td>
              </tr>
            ) : (
              userData.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-blue-50/30 transition-colors group"
                >
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={getAvatarUrl(user.avatar, user.name)}
                        className="w-12 h-12 rounded-2xl object-cover shadow-sm"
                        alt="avatar"
                      />
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
                      <span className="text-slate-400 text-xs">
                        {user.phone || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${user.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex justify-end gap-2 transition-opacity">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <FiEye size={18} />
                      </button>
                      <button
                        onClick={() => setEditingUser(user)}
                        className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                      >
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

      {/* --- Add/Edit Sidebar --- */}
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
                  {addingUser ? "Add New User" : "Edit User"}
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

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                      value={addingUser?.name || editingUser?.name || ""}
                      onChange={(e) => {
                        if (addingUser)
                          setAddingUser({ ...addingUser, name: e.target.value });
                        else
                          setEditingUser({ ...editingUser, name: e.target.value });
                      }}
                      placeholder="Enter full name"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                      {addingUser
                        ? "Password *"
                        : "Change Password (Leave blank to keep)"}
                    </label>
                    <input
                      type="password"
                      className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                      value={addingUser?.password || editingUser?.password || ""}
                      onChange={(e) => {
                        if (addingUser)
                          setAddingUser({ ...addingUser, password: e.target.value });
                        else
                          setEditingUser({ ...editingUser, password: e.target.value });
                      }}
                      placeholder={
                        addingUser ? "Create a strong password" : "••••••••"
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                      value={addingUser?.email || editingUser?.email || ""}
                      onChange={(e) => {
                        if (addingUser)
                          setAddingUser({ ...addingUser, email: e.target.value });
                        else
                          setEditingUser({ ...editingUser, email: e.target.value });
                      }}
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                      value={addingUser?.phone || editingUser?.phone || ""}
                      onChange={(e) => {
                        if (addingUser)
                          setAddingUser({ ...addingUser, phone: e.target.value });
                        else
                          setEditingUser({ ...editingUser, phone: e.target.value });
                      }}
                      placeholder="+92..."
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                      Assign Role
                    </label>
                    <select
                      className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                      value={
                        addingUser
                          ? addingUser.role?._id || addingUser.role
                          : editingUser?.role?._id || editingUser?.role
                      }
                      onChange={(e) => {
                        if (addingUser)
                          setAddingUser({ ...addingUser, role: e.target.value });
                        else
                          setEditingUser({ ...editingUser, role: e.target.value });
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

                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                      User Status
                    </label>
                    <select
                      className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                      value={
                        addingUser?.status || editingUser?.status || "ACTIVE"
                      }
                      onChange={(e) => {
                        if (addingUser)
                          setAddingUser({ ...addingUser, status: e.target.value });
                        else
                          setEditingUser({ ...editingUser, status: e.target.value });
                      }}
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={addingUser ? handleAddUser : handleUpdateUser}
                  className="w-full py-4 bg-[#21a9ff] hover:bg-[#6dc6fe] text-white rounded-2xl font-black shadow-lg shadow-blue-100 transition-all active:scale-95"
                >
                  {addingUser ? "Deploy New User" : "Update Profile"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* --- View Sidebar --- */}
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

              <div className="flex flex-col items-start gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={getAvatarUrl(selectedUser.avatar, selectedUser.name)}
                    className="w-16 h-16 rounded-[2rem] shadow-sm object-cover"
                    alt="profile"
                  />
                  <div>
                    <p className="text-2xl font-black text-slate-800">
                      {selectedUser.name}
                    </p>
                    <p className="text-[10px] font-black text-[#21a9ff] uppercase mt-1">
                      {selectedUser.role?.role_name || "Member"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 w-full">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
                      Email
                    </p>
                    <p className="font-bold text-slate-800 flex items-center gap-2">
                      <FiMail size={16} /> {selectedUser.email}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
                      Phone
                    </p>
                    <p className="font-bold text-slate-800 flex items-center gap-2">
                      <FiPhone size={16} /> {selectedUser.phone || "Not Provided"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
                      Status
                    </p>
                    <p className="font-bold text-slate-800 flex items-center gap-2">
                      <FiShield size={16} /> {selectedUser.status}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedUser(null)}
                  className="w-full py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};
