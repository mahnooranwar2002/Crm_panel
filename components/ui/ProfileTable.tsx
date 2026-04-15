"use client"
import React, { useState, useEffect } from 'react';
import { FiEdit2, FiUser, FiX, FiLink } from 'react-icons/fi';
import { UserService } from '@/src/services/userService';

export const ProfileTable = () => {
    const [userData, setUserData] = useState<any>(null);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch current user profile on component mount
    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            // Get users list from API - backend returns { users: [], pagination: {...} }
            const data = await UserService.getUsers(1, 1);
            const usersArray = data?.users || [];
            if (usersArray.length > 0) {
                setUserData(usersArray[0]);
            } else {
                // Fallback to empty user data
                setUserData({
                    _id: null,
                    name: "User",
                    role: "Team Member",
                    location: "N/A",
                    email: "user@example.com",
                    status: "ACTIVE"
                });
            }
            setError(null);
        } catch (err: any) {
            console.error('Error fetching user profile:', err);
            setError(err.message);
            // Set default user data on error
            setUserData({
                _id: null,
                name: "User",
                role: "Team Member",
                location: "N/A",
                email: "user@example.com",
                status: "ACTIVE"
            });
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userId = userData?._id || userData?.id;
            if (userId) {
                // Clean the user data: remove empty fields
                const cleanedUser = Object.fromEntries(
                    Object.entries(editingUser).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
                );
                await UserService.updateUser(userId, cleanedUser);
                setUserData(editingUser);
            } else {
                // If no ID, just update local state
                setUserData(editingUser);
            }
            setEditingUser(null);
        } catch (err: any) {
            alert('Error: ' + err.message);
        }
    };

    if (loading) {
        return <div className="w-full p-4 text-center">Loading profile...</div>;
    }

    if (!userData) {
        return <div className="w-full p-4 text-center">No user data available</div>;
    }

    return (
        <div className="w-full space-y-6 p-4 md:p-6 bg-[#F1F5F9] min-h-screen">
            
            {/* --- ERROR MESSAGE --- */}
            {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg">
                    Error: {error}
                </div>
            )}
            
            {/* --- 1. Top Profile Header Card --- */}
            <div className="bg-white rounded-sm border border-slate-200 shadow-sm p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md bg-emerald-600 flex-shrink-0 flex items-center justify-center text-white text-2xl font-bold">
                            {/* Name ke initials display honge */}
                            {userData.name ? userData.name.split(' ').map((n: string) => n[0]).join('') : 'U'}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-black">{userData.name || 'N/A'}</h3>
                        <p className="text-sm font-medium text-slate-500">
                            {userData.role || 'N/A'} <span className="mx-2">|</span> {userData.location || 'N/A'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setEditingUser(userData)} // Modal open karne ke liye
                        className="flex items-center gap-2 px-5 py-2 text-sm font-bold bg-white border border-slate-200 rounded-md hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all text-slate-700 shadow-sm"
                    >
                        <FiEdit2 size={14} /> Edit Profile
                    </button>
                </div>
            </div>

            {/* --- EDIT MODAL --- */}
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
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><FiLink size={12} /> Profile Photo URL</label>
                                <input className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm" value={editingUser.image || ''} onChange={(e) => setEditingUser({ ...editingUser, image: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                                <input className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm" value={editingUser.name || ''} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Role</label>
                                <input className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm" value={editingUser.role || ''} onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                                <input className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm" value={editingUser.email || ''} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account Status</label>
                                <select className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm" value={editingUser.status || 'Active'} onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value })}>
                                    <option value="Active">Active</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                            <div className="space-y-1 col-span-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</label>
                                <input className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm" value={editingUser.location || ''} onChange={(e) => setEditingUser({ ...editingUser, location: e.target.value })} />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-6">
                            <button type="button" onClick={() => setEditingUser(null)} className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-xl font-bold hover:bg-slate-100 transition-all">Cancel</button>
                            <button type="submit" className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 active:scale-95 transition-all">Save Changes</button>
                        </div>
                    </form>
                </div>
            )}

            {/* --- 2. Information Card --- */}
            <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-7 py-4 border-b border-slate-100">
                    <h3 className="font-semibold text-black flex items-center gap-2">
                        <FiUser className="text-slate-400" /> Personal Information
                    </h3>
                </div>

                <div className="p-7">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                        <div className="border-l-2 border-transparent hover:border-emerald-500 pl-4 transition-all">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Full Name</label>
                            <p className="text-black font-semibold text-base">{userData.name || 'N/A'}</p>
                        </div>

                        <div className="border-l-2 border-transparent hover:border-emerald-500 pl-4 transition-all">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Email Address</label>
                            <p className="text-black font-semibold text-base">{userData.email || 'N/A'}</p>
                        </div>

                        <div className="border-l-2 border-transparent hover:border-emerald-500 pl-4 transition-all">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Role / Designation</label>
                            <p className="text-black font-semibold text-base">{userData.role || 'N/A'}</p>
                        </div>

                        <div className="border-l-2 border-transparent hover:border-emerald-500 pl-4 transition-all">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Location</label>
                            <p className="text-black font-semibold text-base">{userData.location || 'N/A'}</p>
                        </div>

                        <div className="md:col-span-2 border-l-2 border-transparent hover:border-emerald-500 pl-4 transition-all">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Account Status</label>
                            <p className="text-black font-medium text-base leading-relaxed">{userData.status || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};