"use client"
import React, { useEffect, useState } from 'react';
import { FiHome, FiChevronLeft } from "react-icons/fi";
import { MdManageAccounts } from "react-icons/md";
import { PiTrendUpDuotone } from "react-icons/pi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUsers } from "react-icons/fa6";
import { useSidebar } from "@/hooks/use-sidebar"; 
import { HiUserGroup } from "react-icons/hi2";
import { IoLogoFoursquare } from "react-icons/io";
import { getAvatarUrl } from '@/src/utils/avatarHelper';

const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

export const Sidebar = () => {
  const pathname = usePathname();
  const { isCollapsed, toggle } = useSidebar();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Function to load user data
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
    setIsMounted(true);
    loadUserData();

    // Listen for storage changes (in case profile updates in another tab/window)
    window.addEventListener('storage', loadUserData);
    
    // Optional: Custom event if you update profile in the same tab
    window.addEventListener('userUpdated', loadUserData);

    return () => {
      window.removeEventListener('storage', loadUserData);
      window.removeEventListener('userUpdated', loadUserData);
    };
  }, []);

  const menuItems = [
    { icon: FiHome, label: "Dashboard", href: "/home" },
    { icon: FaUsers, label: "User Management", href: "/user" },
    { icon: MdManageAccounts, label: "Leads Management", href: "/leads" }, 
    { icon: HiUserGroup, label: "Roles Management", href: "/roles" },
    { icon: IoLogoFoursquare, label: "Companies Management", href: "/companies" },
    { icon: PiTrendUpDuotone, label: "Opportunities", href: "/opportunities" },
  ];

  if (!isMounted) {
    return (
      <aside className="h-screen bg-white border-r border-slate-100 flex flex-col sticky top-0 left-0 z-50 w-[280px]">
        <div className="h-[70px] flex items-center px-6">
           <div className="w-9 h-9 bg-emerald-500 rounded-xl" />
        </div>
        <div className="flex-1 px-3 space-y-1.5" />
        <div className="p-4 border-t border-slate-50 text-slate-400 text-sm text-center">Loading...</div>
      </aside>
    );
  }

  return (
    <aside 
      className={cn(
        "h-screen bg-white border-r border-slate-100 transition-all duration-300 ease-in-out flex flex-col sticky top-0 left-0 z-50 shadow-sm",
        isCollapsed ? "w-[80px]" : "w-[280px]"
      )}
    >
      <div className="h-[70px] flex items-center justify-between px-4 mb-4">
        {!isCollapsed && (
          <div className="flex items-center gap-3 pl-2">
            <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-100">
              W
            </div>
            <span className="font-extrabold text-lg text-slate-800 tracking-tight">Wholcure CRM</span>
          </div>
        )}
        <button 
          onClick={toggle} 
          className={cn(
            "p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-emerald-500",
            isCollapsed ? "mx-auto" : ""
          )}
        >
          <FiChevronLeft className={cn("text-xl transition-transform duration-500", isCollapsed ? "rotate-180" : "")} />
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto custom-scrollbar">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <Link key={index} href={item.href}>
              <div
                className={cn(
                  "flex items-center p-3.5 rounded-xl cursor-pointer transition-all duration-200 group relative",
                  isActive
                    ? "bg-emerald-50 text-emerald-500 shadow-sm shadow-indigo-50/50"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 w-1 h-6 bg-emerald-500 rounded-r-full" />
                )}
                <item.icon className={cn(
                  "text-xl min-w-[20px] transition-transform group-hover:scale-110",
                  isActive ? "text-emerald-500" : "text-slate-400 group-hover:text-emerald-500"
                )} />
                {!isCollapsed && (
                  <div className="ml-3 flex items-center justify-between w-full">
                    <span className={cn(
                      "text-[14px] font-semibold tracking-wide",
                      isActive ? "text-emerald-500" : "text-slate-600"
                    )}>
                      {item.label}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer Section - Image logic improved */}
      {!isCollapsed && userInfo && (
        <div className="p-4 border-t border-slate-50 bg-slate-50/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center font-bold text-xs border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
              {/* Added key={userInfo.avatar} to force re-render when image changes */}
              <img 
                key={userInfo?.avatar}
                src={getAvatarUrl(userInfo?.avatar, userInfo?.name)} 
                alt="Profile" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${userInfo?.name || 'User'}&background=10b981&color=fff`;
                }}
              />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-800 truncate">{userInfo.name || 'User'}</p>
              <p className="text-[10px] text-slate-400 truncate">{userInfo.role?.role_name || userInfo.role || 'User'}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};