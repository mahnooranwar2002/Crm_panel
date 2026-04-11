"use client"
import React from 'react';
import { FiHome, FiChevronLeft } from "react-icons/fi";
import { MdManageAccounts } from "react-icons/md";
import { PiTrendUpDuotone } from "react-icons/pi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUsers } from "react-icons/fa6";
import { useSidebar } from "@/hooks/use-sidebar"; 
import { HiUserGroup } from "react-icons/hi2";

const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');

export const Sidebar = () => {
  const pathname = usePathname();
  const { isCollapsed, toggle } = useSidebar();

  const menuItems = [
    { icon: FiHome, label: "Dashboard", href: "/home" }, // Dashboard path
    { icon: FaUsers, label: "User Management", href: "/user" }, // Correct path
    { icon: MdManageAccounts, label: "Leads Management", href: "/leads" }, 
    { icon: HiUserGroup, label: "Roles Management", href: "/roles" },
    { icon: PiTrendUpDuotone, label: "Opportunities", href: "/opportunities" },
  ];

  return (
    <aside 
      className={cn(
        "h-screen bg-white border-r border-slate-100 transition-all duration-300 ease-in-out flex flex-col sticky top-0 left-0 z-50 shadow-sm",
        isCollapsed ? "w-[80px]" : "w-[280px]"
      )}
    >
      {/* Logo Section */}
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

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto custom-scrollbar">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href;
          
          return (
            <Link key={index} href={item.href || "#"}>
              <div
                className={cn(
                  "flex items-center p-3.5 rounded-xl cursor-pointer transition-all duration-200 group relative",
                  isActive
                    ? "bg-emerald-50 text-emerald-500 shadow-sm shadow-indigo-50/50"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                {/* Active Indicator Line */}
                {isActive && (
                  <div className="absolute left-0 w-1 h-6 text-emerald-500 rounded-r-full" />
                )}

                <item.icon className={cn(
                  "text-xl min-w-[20px] transition-transform group-hover:scale-110",
                  isActive ? "text-emerald-500" : "text-slate-400 text-emerald-500"
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

                {/* Tooltip for Collapsed State */}
                {isCollapsed && (
                  <div className="absolute left-16 bg-slate-800 text-white text-xs py-1.5 px-3 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[100]">
                    {item.label}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Profile Summary (Optional) */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-50 bg-slate-50/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center font-bold text-xs">
              HS
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-800 truncate">Hamza Shahid</p>
              <p className="text-[10px] text-slate-400 truncate">Admin Account</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};