"use client"
import React, { useState } from 'react';
import { FiEye, FiEdit2, FiTrash2, FiMail, FiPlus, FiX, FiPhone, FiMapPin, FiLink } from 'react-icons/fi';

const users = [
  { id: 1, name: 'Lindsey Curtis', role: 'Web Designer', status: 'Active', image: 'https://i.pravatar.cc/150?u=1', email: 'lindsey@example.com', phone: '+92 300 1234567', location: 'Karachi, Pakistan' },
  { id: 2, name: 'Kaiya George', role: 'Project Manager', status: 'Pending', image: 'https://i.pravatar.cc/150?u=2', email: 'kaiya@example.com', phone: '+92 311 7654321', location: 'Lahore, Pakistan' },
  { id: 3, name: 'Zain Geidt', role: 'Content Writer', status: 'Active', image: 'https://i.pravatar.cc/150?u=3', email: 'zain@example.com', phone: '+92 345 0000000', location: 'Islamabad, Pakistan' },
  { id: 4, name: 'Hamza Shahid', role: 'Full Stack Developer', status: 'Active', image: 'https://i.pravatar.cc/150?u=4', email: 'hamza@example.com', phone: '+92 321 9999999', location: 'Karachi, Pakistan' },
];

export const UserTable = () => {
  const [userData, setUserData] = useState(users);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editingUser, setEditingUser] = useState<any>(null);

  const deleteUser = (id: number) => {
    if(window.confirm("Are you sure?")) {
      setUserData(userData.filter(user => user.id !== id));
    }
  };

  const updateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setUserData(userData.map(u => u.id === editingUser.id ? editingUser : u));
    setEditingUser(null); 
  };

  return (
    <div className="w-full space-y-6 relative">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">User Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage team members and account permissions.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-indigo-200 active:scale-95">
          <FiPlus size={18} />
          <span>Add New User</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-left border-b border-slate-100">
                <th className="px-6 py-5 text-[12px] font-bold text-slate-500 uppercase tracking-widest">User Details</th>
                <th className="px-6 py-5 text-[12px] font-bold text-slate-500 uppercase tracking-widest">Contact Info</th>
                <th className="px-6 py-5 text-[12px] font-bold text-slate-500 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-5 text-[12px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {userData.map((user) => (
                <tr key={user.id} className="hover:bg-indigo-50/30 transition-all duration-200 group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <img src={user.image} className="h-11 w-11 rounded-full object-cover ring-4 ring-slate-50 shadow-sm" alt="" />
                      <div>
                        <p className="font-bold text-slate-800 text-[15px] leading-tight">{user.name}</p>
                        <p className="text-[11px] text-emerald-500 font-bold uppercase mt-1 tracking-wider">{user.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2.5 text-slate-600">
                      <FiMail size={14} className="text-slate-400" />
                      <span className="text-sm font-medium">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center">
                      <span className={`inline-flex items-center gap-2 py-1.5 px-3.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest ${user.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setSelectedUser(user)} className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-indigo-50 rounded-xl transition-all">
                        <FiEye size={20} />
                      </button>
                      <button onClick={() => setEditingUser(user)} className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                        <FiEdit2 size={18} />
                      </button>
                      <button onClick={() => deleteUser(user.id)} className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- VIEW MODAL (Original) --- */}
      {selectedUser && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4" onClick={() => setSelectedUser(null)}>
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"></div>
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="h-24 bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
            <button onClick={() => setSelectedUser(null)} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors"><FiX size={20} /></button>
            <div className="px-8 pb-8">
              <div className="relative -mt-12 mb-4"><img src={selectedUser.image} className="h-24 w-24 rounded-3xl object-cover border-4 border-white shadow-lg mx-auto" alt="" /></div>
              <div className="text-center space-y-1 mb-6">
                <h2 className="text-2xl font-bold text-slate-800">{selectedUser.name}</h2>
                <p className="text-emerald-600 font-bold text-sm uppercase tracking-widest">{selectedUser.role}</p>
                <div className="pt-2 flex justify-center">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${selectedUser.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{selectedUser.status} Member</span>
                </div>
              </div>
              <hr className="border-slate-100 my-6" />
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-slate-600"><div className="p-2 bg-slate-50 rounded-lg text-slate-400"><FiMail size={18} /></div><div><p className="text-[10px] uppercase font-bold text-slate-400">Email Address</p><p className="text-sm font-semibold">{selectedUser.email}</p></div></div>
                <div className="flex items-center gap-4 text-slate-600"><div className="p-2 bg-slate-50 rounded-lg text-slate-400"><FiPhone size={18} /></div><div><p className="text-[10px] uppercase font-bold text-slate-400">Phone Number</p><p className="text-sm font-semibold">{selectedUser.phone}</p></div></div>
                <div className="flex items-center gap-4 text-slate-600"><div className="p-2 bg-slate-50 rounded-lg text-slate-400"><FiMapPin size={18} /></div><div><p className="text-[10px] uppercase font-bold text-slate-400">Location</p><p className="text-sm font-semibold">{selectedUser.location}</p></div></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- EDIT MODAL (Full Details) --- */}
      {editingUser && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditingUser(null)}></div>
          <form onSubmit={updateUser} className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 space-y-4 animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Edit Profile</h3>
              <button type="button" onClick={() => setEditingUser(null)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-all"><FiX size={20} /></button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1 col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><FiLink size={12}/> Profile Photo URL</label>
                <input className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm" value={editingUser.image} onChange={(e) => setEditingUser({...editingUser, image: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                <input className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm" value={editingUser.name} onChange={(e) => setEditingUser({...editingUser, name: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Designation / Role</label>
                <input className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm" value={editingUser.role} onChange={(e) => setEditingUser({...editingUser, role: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                <input className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm" value={editingUser.email} onChange={(e) => setEditingUser({...editingUser, email: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account Status</label>
                <select className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm" value={editingUser.status} onChange={(e) => setEditingUser({...editingUser, status: e.target.value})}>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              {/* <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</label>
                <input className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm" value={editingUser.phone} onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</label>
                <input className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm" value={editingUser.location} onChange={(e) => setEditingUser({...editingUser, location: e.target.value})} />
              </div> */}
            </div>

            <div className="flex gap-3 pt-6">
              <button type="button" onClick={() => setEditingUser(null)} className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-xl font-bold hover:bg-slate-100 transition-all">Cancel</button>
              <button type="submit" className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 active:scale-95 transition-all">Save Changes</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};