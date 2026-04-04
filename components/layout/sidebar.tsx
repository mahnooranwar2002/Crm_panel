"use client"
import React from 'react';
import { FiHome, FiChevronLeft } from "react-icons/fi";
import { MdManageAccounts } from "react-icons/md";
import { PiTrendUpDuotone } from "react-icons/pi";

import { FaUsers } from "react-icons/fa6";

import { useSidebar } from "@/hooks/use-sidebar"; 

// Helper function agar aapne utils.ts nahi banaya to:
const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');

export const Sidebar = () => {
  const { isCollapsed, toggle } = useSidebar();

  const menuItems = [
    { icon: FiHome, label: "Dashboard", hot: true },
    { icon: FaUsers , label: "User Management" },
    { icon: MdManageAccounts , label: "Leads Management" },
    { icon: PiTrendUpDuotone, label: "Opportunities" },
    // mazeed items yahan add karein
  ];

  return (
    <aside 
      className={cn(
        "h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col sticky top-0 left-0 z-50",
        isCollapsed ? "w-[70px]" : "w-[260px]"
      )}
    >
      {/* Logo Section */}
      <div className="h-[70px] flex items-center justify-between px-4 border-b border-gray-100">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">W</div>
            <span className="font-bold text-xl text-slate-800">Wholcure CRM</span>
          </div>
        )}
        <button 
          onClick={toggle} 
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
        >
          <FiChevronLeft className={cn("text-xl transition-transform", isCollapsed ? "rotate-180" : "")} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center p-3 rounded-xl cursor-pointer transition-all group",
              index === 0 ? "bg-emerald-50 text-emerald-600" : "text-gray-500 hover:bg-gray-50 hover:text-emerald-500"
            )}
          >
            <item.icon className="text-xl min-w-[20px]" />
            {!isCollapsed && (
              <div className="ml-3 flex items-center justify-between w-full">
                <span className="text-[14px] font-medium">{item.label}</span>
                {item.hot && (
                  <span className="bg-red-100 text-red-500 text-[10px] px-1.5 py-0.5 rounded uppercase font-bold">Hot</span>
                )}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};