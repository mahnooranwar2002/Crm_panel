"use client"
import React, { useState, useEffect } from 'react';
import { FiEdit2, FiUser, FiX, FiCamera, FiPhone, FiMapPin } from 'react-icons/fi';
import { AuthService } from '@/src/services/authService';
import { UserService } from '@/src/services/userService';
import { UploadService } from '@/src/services/uploadService';
import { getAvatarUrl } from '@/src/utils/avatarHelper';
import Image from 'next/image';

export const ProfileTable = () => {
    const [userData, setUserData] = useState<any>(null);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const userProfile = await AuthService.getCurrentUser();
            const finalData = userProfile?.user || userProfile?.data || userProfile;
            
            // Cache busting for fresh load
            if (finalData?.avatar && typeof finalData.avatar === 'string') {
                finalData.avatar = `${finalData.avatar.split('?')[0]}?t=${Date.now()}`;
            }
            
            setUserData(finalData);
            window.dispatchEvent(new Event('userUpdated'));
        } catch (err: any) {
            console.error('Error fetching profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setEditingUser({ ...editingUser, avatar: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const updateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setUploading(true);
            let avatarPath = userData?.avatar;

            if (avatarFile) {
                avatarPath = await UploadService.uploadAvatar(avatarFile);
            }
            
            const userId = userData?._id || userData?.id;
            const updatedData = { 
                ...editingUser, 
                avatar: avatarPath 
            };

            if (userId) {
                const response = await UserService.updateUser(userId, updatedData);
                let savedData = response?.user || response?.data || updatedData;
                
                // Cache busting after upload
                if (savedData.avatar && typeof savedData.avatar === 'string' && !savedData.avatar.startsWith('data:')) {
                    savedData.avatar = `${savedData.avatar.split('?')[0]}?t=${Date.now()}`;
                }

                setUserData(savedData);
                window.dispatchEvent(new Event('userUpdated'));
                setEditingUser(null);
                setAvatarFile(null);
                alert('Profile updated successfully!');
            }
        } catch (err: any) {
            alert('Update failed: ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    const getRoleName = (role: any) => {
        if (!role) return 'Member';
        return typeof role === 'object' ? role.role_name : role;
    };

    if (loading) return <div className="p-10 text-center font-bold text-slate-500">Loading Profile...</div>;

    // --- FIX FOR IMAGE DISPLAY ---
    // Agar avatar null hai ya undefined, toh hum initials wala fallback use karenge
    const profileImageUrl = userData?.avatar ? getAvatarUrl(userData.avatar, userData.name) : undefined;

    return (
        <div className="w-full space-y-6 p-4 md:p-6 bg-[#F1F5F9] min-h-screen text-slate-800">
            
            {/* Header Section */}
            <div className="bg-white rounded-md border border-slate-200 shadow-sm p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    {/* Circle Image Container */}
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-emerald-600 flex items-center justify-center text-white text-3xl font-bold shrink-0">
                        {userData?.avatar ? (
                            <Image
                                key={userData?.avatar}
                                src={profileImageUrl!}
                                alt="Profile"
                                width={96}
                                height={96}
                                unoptimized={true}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    // Agar backend link fail ho jaye toh UI-Avatar dikhaye
                                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${userData?.name}&background=059669&color=fff`;
                                }}
                            />
                        ) : (
                            // Agar image hai hi nahi toh initials dikhaye
                            <span className="uppercase">{userData?.name?.substring(0, 2) || 'JD'}</span>
                        )}
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900 capitalize">{userData?.name || 'User Name'}</h3>
                        <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                            <span className="text-emerald-600 font-bold uppercase tracking-wider text-xs">{getRoleName(userData?.role)}</span>
                            <span className="text-slate-300">|</span>
                            <span className="flex items-center gap-1"><FiMapPin size={12}/> {userData?.location || 'Location Not Set'}</span>
                        </p>
                    </div>
                </div>

                <button 
                    onClick={() => setEditingUser({...userData})} 
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-all shadow-md"
                >
                    <FiEdit2 size={14} /> Edit Profile
                </button>
            </div>

            {/* Information Grid */}
            <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
                    <FiUser className="text-emerald-500" />
                    <h3 className="font-bold text-slate-700 uppercase tracking-widest text-xs">Account Information</h3>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
                    <InfoField label="Full Name" value={userData?.name} />
                    <InfoField label="Email Address" value={userData?.email} />
                    <InfoField label="Role / Designation" value={getRoleName(userData?.role)} isHighlight />
                    <InfoField label="Current Location" value={userData?.location} />
                    <InfoField label="Contact Number" value={userData?.phone || userData?.number} />
                </div>
            </div>

            {/* Edit Modal */}
            {editingUser && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !uploading && setEditingUser(null)}></div>
                    <form onSubmit={updateUser} className="relative bg-white w-full max-w-lg rounded-xl shadow-2xl p-6 space-y-4">
                        <div className="flex justify-between items-center border-b pb-4">
                            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Update Profile</h3>
                            <button type="button" onClick={() => setEditingUser(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><FiX size={20} /></button>
                        </div>
                        
                        <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
                            <div className="flex flex-col items-center mb-4">
                                <div className="relative group w-20 h-20 rounded-full overflow-hidden border-2 border-emerald-500 shadow-md bg-slate-100 flex items-center justify-center">
                                    {editingUser.avatar ? (
                                        <img 
                                            key={editingUser.avatar}
                                            src={editingUser.avatar?.startsWith('data:') ? editingUser.avatar : getAvatarUrl(editingUser.avatar, editingUser.name)} 
                                            alt="Preview" 
                                            className="w-full h-full object-cover" 
                                        />
                                    ) : (
                                        <span className="text-emerald-600 font-bold uppercase">{editingUser.name?.substring(0, 2)}</span>
                                    )}
                                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                        <FiCamera className="text-white" size={24} />
                                        <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                                    </label>
                                </div>
                                <span className="text-[10px] text-slate-400 mt-1">Change Photo</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <EditInput label="Full Name" value={editingUser.name} onChange={(val: string) => setEditingUser({...editingUser, name: val})} />
                                <EditInput label="Email" value={editingUser.email} onChange={(val: string) => setEditingUser({...editingUser, email: val})} />
                                <EditInput label="Location" value={editingUser.location} onChange={(val: string) => setEditingUser({...editingUser, location: val})} placeholder="Karachi, Pakistan" />
                                <EditInput label="Contact Number" value={editingUser.phone || editingUser.number} onChange={(val: string) => setEditingUser({...editingUser, phone: val})} placeholder="+92..." />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={uploading}
                            className="w-full py-3 bg-emerald-600 text-white rounded-lg font-bold shadow-lg hover:bg-emerald-700 active:scale-[0.98] transition-all mt-4 disabled:opacity-70"
                        >
                            {uploading ? 'Saving Changes...' : 'Save Profile Data'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

const InfoField = ({ label, value, isHighlight = false }: { label: string, value: string, isHighlight?: boolean }) => (
    <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</label>
        <p className={`text-base font-bold ${isHighlight ? 'text-emerald-600' : 'text-slate-900'}`}>
            {value || 'Not Provided'}
        </p>
    </div>
);

const EditInput = ({ label, value, onChange, placeholder = "" }: any) => (
    <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase">{label}</label>
        <input 
            className="w-full p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm" 
            value={value || ''} 
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)} 
        />
    </div>
);