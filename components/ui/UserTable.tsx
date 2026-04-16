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
  FiUser,
  FiShield,
} from "react-icons/fi";
import { UserService } from "@/src/services/userService";
import { RoleService } from "@/src/services/roleService";
import { UploadService } from "@/src/services/uploadService";
import { getAvatarUrl, getInitials } from "@/src/utils/avatarHelper";

// --- Fallback Data ---


interface User {
  _id?: string;
  id?: string;
  name: string;
  role?: any;
  status: string;
  email: string;
  phone?: string;
  avatar?: any;
}

const emptyUser: User = {
  name: "",
  status: "ACTIVE",
  email: "",
  phone: "",
  role: "",
  avatar: null,
};

export const UserTable = () => {
  const [userData, setUserData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [addingUser, setAddingUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [addingFile, setAddingFile] = useState<File | null>(null);
  const [editingFile, setEditingFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await UserService.getUsers(1, 100);
      setUserData(data?.users?.length ? data.users :"abc");
      console.log("Fetched Users:", );
      setError(null);
    } catch (err: any) {
      console.error("Using Fallback Data due to error:", err);
   
      setError("Note: Showing fallback data (Backend unreachable)");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await RoleService.getRoles(1, 100);
      setRoles(data?.roles || [{ _id: "admin", role_name: "Admin" }, { _id: "manager", role_name: "Manager" }, { _id: "sales", role_name: "Sales" }]);
    } catch (err) {
      setRoles([{ _id: "admin", role_name: "Admin" }, { _id: "manager", role_name: "Manager" }, { _id: "sales", role_name: "Sales" }]);
    }
  };

  // Image Handling
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'add' | 'edit') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'add' && addingUser) {
          setAddingFile(file);
          setAddingUser({ ...addingUser, avatar: reader.result });
        }
        if (type === 'edit' && editingUser) {
          setEditingFile(file);
          setEditingUser({ ...editingUser, avatar: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const addUser = async () => {
    if (!addingUser?.name || !addingUser?.email) {
      alert("Please fill in required fields (Name and Email)");
      return;
    }
    try {
      setUploading(true);
      let avatarPath = "";

      // Upload avatar if file exists
      if (addingFile) {
        avatarPath = await UploadService.uploadAvatar(addingFile);
      }

      await UserService.createUser({
        name: addingUser.name,
        email: addingUser.email,
        phone: addingUser.phone,
        role: addingUser.role,
        status: addingUser.status,
        avatar: avatarPath || null,
      });
      setAddingUser(null);
      setAddingFile(null);
      fetchUsers();
    } catch (err: any) {
      console.error("Error adding user:", err);
      alert("Error: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const updateUser = async () => {
    if (!editingUser?._id || !editingUser?.name || !editingUser?.email) {
      alert("Please fill in required fields");
      return;
    }
    try {
      setUploading(true);
      let avatarPath = editingUser.avatar;

      // Upload avatar if new file exists
      if (editingFile) {
        avatarPath = await UploadService.uploadAvatar(editingFile);
      }

      await UserService.updateUser(editingUser._id, {
        name: editingUser.name,
        email: editingUser.email,
        phone: editingUser.phone,
        role: editingUser.role,
        status: editingUser.status,
        avatar: avatarPath,
      });
      setEditingUser(null);
      setEditingFile(null);
      fetchUsers();
    } catch (err: any) {
      console.error("Error updating user:", err);
      alert("Error: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const deleteUser = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await UserService.deleteUser(id);
        fetchUsers();
      } catch (err: any) {
        // Local delete for fallback
        setUserData(userData.filter(u => u._id !== id));
      }
    }
  };

  const getStatusStyles = (status: string) => {
    return status === "ACTIVE" 
      ? { wrapper: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" }
      : { wrapper: "bg-rose-100 text-rose-700", dot: "bg-rose-500" };
  };

  return (
    <div className="w-full space-y-6 p-6 text-black bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">User Directory</h1>
          <p className="text-slate-500 font-medium">Manage your team and roles</p>
        </div>
        <button
          onClick={() => setAddingUser(emptyUser)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg transition-all active:scale-95"
        >
          <FiPlus /> Add New User
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[11px] font-black uppercase tracking-widest">
            <tr>
              <th className="px-8 py-5">User</th>
              <th className="px-8 py-5">Contact</th>
              <th className="px-8 py-5 text-center">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {userData.map((user) => (
              <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl shadow-inner flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden flex-shrink-0">
                      <img src={getAvatarUrl(user.avatar, user.name)} alt={user.name} className="w-full h-full object-cover" />
                    </div>

                    <div>
                      <p className="font-bold text-slate-800">{user.name}</p>
                      <p className="text-xs font-bold text-indigo-500 uppercase tracking-tighter">
                        {user.role?.role_name || user.role || "Member"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-4">
                  <div className="text-sm font-semibold text-slate-600 flex flex-col">
                    <span className="flex items-center gap-1"><FiMail size={12}/> {user.email}</span>
                    <span className="flex items-center gap-1 text-slate-400 font-medium"><FiPhone size={12}/> {user.phone}</span>
                  </div>
                </td>
                <td className="px-8 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${getStatusStyles(user.status).wrapper}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-8 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setSelectedUser(user)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><FiEye size={18}/></button>
                    <button onClick={() => setEditingUser(user)} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg"><FiEdit2 size={18}/></button>
                    <button onClick={() => deleteUser(user._id!)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><FiTrash2 size={18}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- MODALS (Add / Edit / View) --- */}
      {(addingUser || editingUser || selectedUser) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => {setAddingUser(null); setEditingUser(null); setSelectedUser(null)}}></div>
          
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-800">
                {addingUser ? "Create User" : editingUser ? "Edit User" : "User Profile"}
              </h2>
              <button onClick={() => {setAddingUser(null); setEditingUser(null); setSelectedUser(null)}} className="p-2 hover:bg-slate-100 rounded-full"><FiX size={20}/></button>
            </div>

            {/* Content for Add/Edit */}
            {(addingUser || editingUser) && (
              <div className="space-y-4">
                {/* Avatar Picker */}
                <div className="flex justify-center mb-6">
                  <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <div 
                      className="w-24 h-24 rounded-[2rem] ring-4 ring-slate-50 shadow-xl flex items-center justify-center text-white font-bold text-xl bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden"
                    >
                      <img src={getAvatarUrl((addingUser?.avatar || editingUser?.avatar) as string, addingUser?.name || editingUser?.name || 'User')} alt="Avatar" className="w-full h-full object-cover" />
                    </div>

                    <div className="absolute inset-0 bg-black/40 rounded-[2rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <FiCamera className="text-white" size={24} />
                    </div>
                    <input 
                      type="file" 
                      hidden 
                      ref={fileInputRef} 
                      accept="image/*" 
                      onChange={(e) => handleImageChange(e, addingUser ? 'add' : 'edit')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Full Name</label>
                    <input 
                      className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 ring-indigo-500" 
                      value={addingUser?.name || editingUser?.name || ""}
                      onChange={(e) => addingUser ? setAddingUser({...addingUser, name: e.target.value}) : setEditingUser({...editingUser!, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Email</label>
                    <input 
                      className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl" 
                      value={addingUser?.email || editingUser?.email || ""}
                      onChange={(e) => addingUser ? setAddingUser({...addingUser, email: e.target.value}) : setEditingUser({...editingUser!, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Phone</label>
                    <input 
                      className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl" 
                      value={addingUser?.phone || editingUser?.phone || ""}
                      onChange={(e) => addingUser ? setAddingUser({...addingUser, phone: e.target.value}) : setEditingUser({...editingUser!, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Role</label>
                    <select 
                      className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl"
                      value={addingUser?.role || editingUser?.role?.role_name || editingUser?.role || ""}
                      onChange={(e) => addingUser ? setAddingUser({...addingUser, role: e.target.value}) : setEditingUser({...editingUser!, role: e.target.value})}
                    >
                      <option value="">Select Role</option>
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Sales">Sales</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Status</label>
                    <select 
                      className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl"
                      value={addingUser?.status || editingUser?.status || ""}
                      onChange={(e) => addingUser ? setAddingUser({...addingUser, status: e.target.value}) : setEditingUser({...editingUser!, status: e.target.value})}
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </div>
                </div>

                <button 
                  onClick={addingUser ? addUser : updateUser}
                  disabled={uploading}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white rounded-[1.5rem] font-black mt-4 shadow-lg shadow-indigo-100 transition-all active:scale-95"
                >
                  {uploading ? "Uploading..." : (addingUser ? "Save New User" : "Update Records")}
                </button>
              </div>
            )}

            {/* Content for View (Card Modal) */}
            {selectedUser && (
              <div className="flex flex-col items-center text-center">
                <div 
                  className="w-32 h-32 rounded-[2.5rem] mb-4 ring-8 ring-slate-50 shadow-2xl flex items-center justify-center text-white font-black text-4xl bg-gradient-to-br from-emerald-500 to-teal-600 overflow-hidden"
                >
                  {getInitials(selectedUser.name)}
                </div>

                <h3 className="text-2xl font-black text-slate-800">{selectedUser.name}</h3>
                <span className="text-indigo-500 font-black uppercase text-xs tracking-widest mb-6">
                  {selectedUser.role?.role_name || selectedUser.role}
                </span>

                <div className="w-full grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                    <div className="bg-white p-2 rounded-xl shadow-sm text-slate-400"><FiMail/></div>
                    <div className="text-left"><p className="text-[10px] font-black text-slate-400 uppercase">Email</p><p className="font-bold text-slate-700">{selectedUser.email}</p></div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                    <div className="bg-white p-2 rounded-xl shadow-sm text-slate-400"><FiPhone/></div>
                    <div className="text-left"><p className="text-[10px] font-black text-slate-400 uppercase">Phone</p><p className="font-bold text-slate-700">{selectedUser.phone || "Not Provided"}</p></div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                    <div className="bg-white p-2 rounded-xl shadow-sm text-slate-400"><FiShield/></div>
                    <div className="text-left"><p className="text-[10px] font-black text-slate-400 uppercase">Status</p><p className="font-bold text-emerald-600">{selectedUser.status}</p></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};