"use client"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { FiBell, FiMoon, FiSun, FiSettings, FiFileText, FiClock, FiUser, FiLogOut, FiChevronDown } from "react-icons/fi";
import { AuthService } from '@/src/services/authService';
import { getAvatarUrl } from '@/src/utils/avatarHelper';

export const Navbar = () => {
  const router = useRouter();
  const [profileInfo, setProfileInfo] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  const loadUserData = () => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUserInfo(JSON.parse(storedUser));
        } catch (e) {
          console.error('Error parsing user info:', e);
        }
      }
    }
  };

  useEffect(() => {
    setIsClient(true);
    loadUserData();

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', loadUserData);
      window.addEventListener('userUpdated', loadUserData);

      return () => {
        window.removeEventListener('storage', loadUserData);
        window.removeEventListener('userUpdated', loadUserData);
      };
    }
  }, []);

  const handleLogout = async () => {
    await AuthService.logout();
    router.push('/home');
  };

  if (!isClient) {
    return (
      <header className="h-[70px] bg-white border-b border-gray-200 flex items-center justify-end px-8 sticky top-0 z-[100]">
        <div className="flex items-center gap-5">
          <button className="text-gray-500 hover:text-[#6dc6fe] transition-colors" disabled>
            <FiMoon size={20} />
          </button>
          <button className="p-2 rounded-full text-gray-500 relative" disabled>
            <FiBell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#21a9ff] rounded-full border-2 border-white"></span>
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className="h-[70px] bg-white border-b border-gray-200 flex items-center justify-end px-8 sticky top-0 z-[100]">
      <div className="flex items-center gap-5">
        <button className="text-gray-500 hover:text-[#6dc6fe] transition-colors">
          <FiMoon size={20} />
        </button>
        
        {/* --- Notification Bell --- */}
        <div className="relative">
          <button 
            onClick={() => {
                setIsNotifyOpen(!isNotifyOpen);
                setProfileInfo(false);
            }}
            // Changed emerald-50 to blue-50 and emerald-600 to #21a9ff
            className={`p-2 rounded-full transition-colors relative ${isNotifyOpen ? 'bg-blue-50 text-[#21a9ff]' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <FiBell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#21a9ff] rounded-full border-2 border-white"></span>
          </button>

          {isNotifyOpen && (
            <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
               <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0">
                  <h4 className="font-bold text-slate-800">Notifications</h4>
                  <button className="text-gray-400 hover:text-[#6dc6fe]"><FiSettings size={16}/></button>
               </div>
               
               <div className="max-h-[400px] overflow-y-auto">
                  <div className="p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer flex gap-3 transition-colors">
                     <div className="w-10 h-10 rounded-full bg-[#21a9ff] flex-shrink-0 flex items-center justify-center text-[#fff] font-bold">SW</div>
                     <div className="space-y-1">
                        <p className="text-xs text-slate-700 font-medium leading-snug">
                            Application of <span className="font-bold">Sarah Williams</span> is waiting for your approval
                        </p>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">Today 10:14 PM</p>
                     </div>
                  </div>
               </div>

               <div className="p-3 text-center border-t border-gray-50">
                  <button className="text-xs font-bold text-[#21a9ff] hover:text-[#6dc6fe]">View all notifications</button>
               </div>
            </div>
          )}
        </div>


        {/* --- Profile Dropdown --- */}
        <div className="relative">
          <button 
            onClick={() => {
                setProfileInfo(!profileInfo);
                setIsNotifyOpen(false);
            }}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {/* Changed bg-emerald-500 to bg-[#21a9ff] */}
            <div className="w-9 h-9 rounded-full bg-[#21a9ff] flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0">
              <img src={getAvatarUrl(userInfo?.avatar, userInfo?.name)} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-none">{userInfo?.name || 'User'}</p>
                <p className="text-[10px] text-gray-400">{userInfo?.role?.role_name || userInfo?.role || 'Member'}</p>
            </div>
            <FiChevronDown size={14} className={`text-gray-400 transition-transform ${profileInfo ? 'rotate-180' : ''}`} />
          </button>

          {profileInfo && (
            <div className="absolute top-full right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 animate-in fade-in zoom-in-95 duration-200">
               <div className="px-4 py-2 border-b border-gray-50 mb-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Welcome</p>
               </div>
               
               {/* Hover effects changed from emerald to blue-50 and text-[#21a9ff] */}
               <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-blue-50 hover:text-[#21a9ff] transition-colors">
                  <FiUser size={18} />
                  <Link href="/user/profile">
                  My Profile
                  </Link>
               </button>
               
               <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-blue-50 hover:text-[#21a9ff] transition-colors">
                  <FiSettings size={18} />
                  <span>Settings</span>
               </button>

               <div className="my-1 border-t border-gray-50"></div>

               <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium"
               >
                  <FiLogOut size={18} />
                  <span>Logout</span>
               </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};