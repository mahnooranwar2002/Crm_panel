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
  FiMapPin,
  FiLink,
} from "react-icons/fi";
import { UserService } from "@/src/services/userService";
import { RoleService } from "@/src/services/roleService";

// Types for better development experience
interface User {
  _id?: string;
  id?: string;
  name: string;
  role?: string | any;
  status: string;
  email: string;
  phone?: string;
  avatar?: string;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

const emptyUser: User = {
  name: "",
  status: "ACTIVE",
  email: "",
  phone: "",
  avatar: "",
};

export const UserTable = () => {
  const [userData, setUserData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [addingUser, setAddingUser] = useState<any>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const fetchRoles = async () => {
    try {
      setLoading(true);
      const data = await RoleService.getRoles(1, 100);
      const rolesArray = data?.roles || [];
      setRoles(rolesArray);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching roles:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await UserService.getUsers(1, 100);
      // Backend returns: { users: [], pagination: {...} }
      const usersArray = data?.users || [];
      setUserData(usersArray);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "ACTIVE":
      case "Active":
        return {
          wrapper: "bg-emerald-100 text-emerald-700",
          dot: "bg-emerald-500",
        };
      case "INACTIVE":
      case "Offline":
      case "Offline":
        return { wrapper: "bg-rose-100 text-rose-700", dot: "bg-rose-500" };
      default:
        return { wrapper: "bg-slate-100 text-slate-700", dot: "bg-slate-500" };
    }
  };

  const deleteUser = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await UserService.deleteUser(id);
        await fetchUsers();
      } catch (err: any) {
        alert("Error: " + err.message);
      }
    }
  };

  const updateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      // Clean the user data: remove empty fields
      const cleanedUser = Object.fromEntries(
        Object.entries(editingUser).filter(
          ([_, value]) => value !== "" && value !== null && value !== undefined,
        ),
      );
      const userId = editingUser._id || editingUser.id;
      if (!userId) {
        alert("Error: User ID not found");
        return;
      }
      await UserService.updateUser(userId, cleanedUser);
      await fetchUsers();
      setEditingUser(null);
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Clean the user data: remove empty fields
      const cleanedUser = Object.fromEntries(
        Object.entries(addingUser).filter(
          ([_, value]) => value !== "" && value !== null && value !== undefined,
        ),
      );
      await UserService.createUser(cleanedUser);
      await fetchUsers();
      setAddingUser(null);
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="w-full space-y-6 relative p-4 text-black bg-slate-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            User Management
          </h1>
          <p className="text-sm text-slate-500 mt-1 uppercase font-bold">
            Manage team members and account permissions.
          </p>
        </div>
        <button
          onClick={() => setAddingUser(emptyUser)}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-200 active:scale-95"
        >
          <FiPlus size={18} />
          <span>Add New User</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-rose-600 font-semibold">{error}</p>
              <button
                onClick={fetchUsers}
                className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-left border-b border-slate-100">
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    User Details
                  </th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Contact Info
                  </th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">
                    Status
                  </th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {userData.map((user) => {
                  const styles = getStatusStyles(user.status);
                  return (
                    <tr
                      key={user._id || user.id}
                      className="hover:bg-emerald-50/30 transition-all duration-200 group"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <img
                            src={
                              user.avatar ||
                              `https://ui-avatars.com/api/?name=${user.name}&background=random`
                            }
                            className="h-11 w-11 rounded-2xl object-cover ring-4 ring-slate-50 shadow-sm"
                            alt={user.name}
                          />
                          <div>
                            <p className="font-bold text-slate-800 text-[15px] leading-tight">
                              {user.name}
                            </p>
                            <p className="text-[10px] text-emerald-500 font-black uppercase mt-1 tracking-wider">
                              {typeof user.role.role_name === "string"
                                ? user.role.role_name
                                : user.role?.name || "No Role"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2.5 text-slate-600">
                          <FiMail size={14} className="text-slate-400" />
                          <span className="text-sm font-semibold">
                            {user.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-center">
                          <span
                            className={`inline-flex items-center gap-2 py-1.5 px-3.5 rounded-full text-[10px] font-black uppercase tracking-widest ${styles.wrapper}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${styles.dot}`}
                            ></span>
                            {user.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                          >
                            <FiEye size={20} />
                          </button>
                          <button
                            onClick={() => setEditingUser(user)}
                            className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button
                            onClick={() =>
                              deleteUser(user._id || user.id || "")
                            }
                            className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                          >
                            <FiTrash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- ADD USER MODAL --- */}
      {addingUser && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setAddingUser(null)}
          ></div>
          <form
            onSubmit={addUser}
            className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-10 space-y-6 animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-slate-50 pb-6">
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                  Create New User
                </h3>
                <p className="text-sm text-slate-400 font-medium">
                  Add a new member to your workspace
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAddingUser(null)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-all"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Full Name
                </label>
                <input
                  required
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                  value={addingUser.name}
                  onChange={(e) =>
                    setAddingUser({ ...addingUser, name: e.target.value })
                  }
                  placeholder="e.g. Ali Ahmed"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                  value={addingUser.email}
                  onChange={(e) =>
                    setAddingUser({ ...addingUser, email: e.target.value })
                  }
                  placeholder="ali@example.com"
                />
              </div>

              {/* Password (Required for new users) */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Password
                </label>
                <input
                  required
                  type="password"
                  title="Password will be hashed on server"
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                  value={addingUser.password || ""}
                  onChange={(e) =>
                    setAddingUser({ ...addingUser, password: e.target.value })
                  }
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Full Name
                </label>
                <input
                  required
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                  value={addingUser.avatar}
                  onChange={(e) =>
                    setAddingUser({ ...addingUser, avatar: e.target.value })
                  }
                  placeholder="e.g. Ali Ahmed"
                />
              </div>
              {/* Phone */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                  value={addingUser.phone || ""}
                  onChange={(e) =>
                    setAddingUser({ ...addingUser, phone: e.target.value })
                  }
                  placeholder="+92..."
                />
              </div>

              {/* Role (Dynamic dropdown suggestion) */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Assign Role
                </label>
                <select
                  required
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all appearance-none"
                  value={addingUser.role || ""}
                  onChange={(e) =>
                    setAddingUser({ ...addingUser, role: e.target.value })
                  }
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option
                      key={role._id || role.id}
                      value={role._id || role.id}
                    >
                      {role.role_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Account Status
                </label>
                <select
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all appearance-none"
                  value={addingUser.status}
                  onChange={(e) =>
                    setAddingUser({ ...addingUser, status: e.target.value })
                  }
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setAddingUser(null)}
                className="flex-1 py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-xl shadow-emerald-100 hover:bg-emerald-700 active:scale-95 transition-all"
              >
                Save User Record
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
