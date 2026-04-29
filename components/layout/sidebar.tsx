"use client";
import React, { useState, useEffect } from "react";
import { FiHome, FiChevronLeft } from "react-icons/fi";
import { MdManageAccounts } from "react-icons/md";
import { PiTrendUpDuotone } from "react-icons/pi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUsers } from "react-icons/fa6";
import { useSidebar } from "@/hooks/use-sidebar";
import { HiUserGroup } from "react-icons/hi2";
import { IoLogoFoursquare } from "react-icons/io";
import Image from "next/image";
import logo from "../../src/assets/wholcure.png";
import { getAvatarUrl } from "@/src/utils/avatarHelper";

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

export const Sidebar = () => {
  const pathname = usePathname();
  const { isCollapsed, toggle } = useSidebar();
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

  const menuItems = [
    { icon: FiHome, label: "Dashboard", href: "/home" },
    { icon: FaUsers, label: "User Management", href: "/user" },
    { icon: MdManageAccounts, label: "Leads Management", href: "/leads" },
    { icon: HiUserGroup, label: "Roles Management", href: "/roles" },
    {
      icon: IoLogoFoursquare,
      label: "Companies Management",
      href: "/companies",
    },
    { icon: PiTrendUpDuotone, label: "Opportunities", href: "/opportunities" },
  ];

  return (
    <aside
      className={cn(
        "h-screen bg-white border-r border-slate-100 transition-all duration-300 ease-in-out flex flex-col sticky top-0 left-0 z-50 shadow-sm",
        isCollapsed ? "w-[80px]" : "w-[280px]",
      )}
    >
      {/* Header / Logo */}
      <div className="h-[70px] flex items-center justify-between px-4 mb-4">
        {!isCollapsed && (
          <div className="flex ml-10 items-center gap-3 pl-2">
            <Image
              src={logo}
              alt="Wholcure Logo"
              width={120}
              height={40}
              className="object-contain"
            />
          </div>
        )}
        <button
          onClick={toggle}
          className={cn(
            "p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-[#21a9ff]",
            isCollapsed ? "mx-auto" : "",
          )}
        >
          <FiChevronLeft
            className={cn(
              "text-xl transition-transform duration-500",
              isCollapsed ? "rotate-180" : "",
            )}
          />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto custom-scrollbar">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <Link key={index} href={item.href}>
              <div
                className={cn(
                  "flex items-center p-3.5 rounded-xl cursor-pointer transition-all duration-200 group relative",
                  isActive
                    ? "bg-[#21a9ff] text-[#fff] shadow-sm shadow-indigo-50/50"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                )}
              >
                {isActive && (
                  <div className="absolute left-0 w-1 h-6 bg-[#21a9ff] rounded-r-full" />
                )}
                <item.icon
                  className={cn(
                    "text-xl min-w-[20px] transition-transform group-hover:scale-110",
                    isActive
                      ? "text-white"
                      : "text-slate-400 group-hover:text-[#21a9ff]",
                  )}
                />
                {!isCollapsed && (
                  <div className="ml-3 flex items-center justify-between w-full">
                    <span
                      className={cn(
                        "text-[14px] font-semibold tracking-wide",
                        isActive ? "text-[#fff]" : "text-slate-600",
                      )}
                    >
                      {item.label}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Profile */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-50 bg-slate-50/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#21a9ff] text-white flex items-center justify-center font-bold text-xs border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
              <img src={getAvatarUrl(userInfo?.avatar, userInfo?.name)} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-800 truncate">
                {userInfo?.name || 'User'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {userInfo?.role?.role_name || userInfo?.role || 'Member'}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
