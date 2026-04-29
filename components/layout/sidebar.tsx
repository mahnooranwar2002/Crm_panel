"use client";
import React, { useState, useEffect } from "react";
import { FiHome, FiChevronLeft, FiChevronDown } from "react-icons/fi";
import { MdManageAccounts } from "react-icons/md";
import { PiTrendUpDuotone } from "react-icons/pi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUsers } from "react-icons/fa6";
import { useSidebar } from "@/hooks/use-sidebar";
import { HiUserGroup } from "react-icons/hi2";
import { IoLogoFoursquare } from "react-icons/io";
import { SiEsotericsoftware } from "react-icons/si";
import { RiStockLine, RiMailSendLine } from "react-icons/ri";
import { FaFileMedicalAlt } from "react-icons/fa";
import Image from "next/image";
import logo from "../../src/assets/wholcure.png";
import { getAvatarUrl } from "@/src/utils/avatarHelper";

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

export const Sidebar = () => {
  const pathname = usePathname();
  const { isCollapsed, toggle } = useSidebar();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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
    {
      icon: RiStockLine,
      label: "Finance",
      href: "/financial",
      submenu: [
        { label: "Invoices", href: "/financial/Invoices" },
        { label: "Expenses", href: "/financial/expenses" },
        { label: "Payments", href: "/financial/payments" },
      ],
    },
    {
      icon: RiMailSendLine,
      label: "Marketing",
      href: "/marketing",
      submenu: [
        { label: "Campaigns", href: "/marketing/campaigns" },
        { label: "Drip Campaigns", href: "/marketing/drip-campaigns" },
        { label: "Lead Scoring", href: "/marketing/lead-scoring" },
        { label: "Workflows", href: "/marketing/workflows" },
        { label: "Social Integration", href: "/marketing/social-integration" },
      ],
    },
    {
      icon: FaFileMedicalAlt,
      label: "Medical",
      href: "/medical",
      submenu: [
        { label: "Patients", href: "/medical/patients" },
        { label: "Providers", href: "/medical/providers" },
        { label: "Appointments", href: "/medical/appointments" },
        { label: "Insurance", href: "/medical/insurance" },
        { label: "Eligibility Check", href: "/medical/insurance/eligibility" },
        { label: "Encounters", href: "/medical/encounters" },
        { label: "Claims", href: "/medical/claims" },
        { label: "Payments & ERA", href: "/medical/payments" },
        { label: "Denials", href: "/medical/denials" },
        { label: "Reports", href: "/medical/reports" },
      ],
    },
    { icon: MdManageAccounts, label: "Leads Management", href: "/leads" },
    { icon: HiUserGroup, label: "Roles Management", href: "/roles" },
    {
      icon: SiEsotericsoftware,
      label: "Software",
      href: "/software",
      submenu: [
        { label: "Track All Projects", href: "/software/track-all-projects" },
        { label: "Task Details", href: "/software/task-details" },
        { label: "Project Status", href: "/software/project-status" },
      ],
    },
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
          const hasSubmenu = (item as any).submenu && (item as any).submenu.length > 0;
          const isDropdownOpen = openDropdown === item.label;
          const isSubmenuActive = (item as any).submenu?.some((sub: any) => pathname.startsWith(sub.href));

          if (hasSubmenu) {
            return (
              <div
                key={index}
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
                className="relative"
              >
                <div
                  className={cn(
                    "flex items-center p-3.5 rounded-xl cursor-pointer transition-all duration-200 group relative",
                    isActive || isSubmenuActive
                      ? "bg-[#21a9ff] text-[#fff] shadow-sm shadow-indigo-50/50"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900",
                  )}
                >
                  {(isActive || isSubmenuActive) && (
                    <div className="absolute left-0 w-1 h-6 bg-[#21a9ff] rounded-r-full" />
                  )}
                  
                  {/* Link wrapper for icon and label */}
                  <Link href={item.href} className="flex items-center flex-1 min-w-0">
                    <item.icon
                      className={cn(
                        "text-xl min-w-[20px] transition-transform group-hover:scale-110",
                        isActive || isSubmenuActive
                          ? "text-white"
                          : "text-slate-400 group-hover:text-[#21a9ff]",
                      )}
                    />
                    {!isCollapsed && (
                      <span
                        className={cn(
                          "ml-3 text-[14px] font-semibold tracking-wide",
                          isActive || isSubmenuActive ? "text-[#fff]" : "text-slate-600",
                        )}
                      >
                        {item.label}
                      </span>
                    )}
                  </Link>

                  {/* Chevron - Toggle dropdown */}
                  {!isCollapsed && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpenDropdown(isDropdownOpen ? null : item.label);
                      }}
                      className="ml-2 flex-shrink-0 p-1 hover:bg-slate-200/50 rounded-md transition-all"
                    >
                      <FiChevronDown
                        className={cn(
                          "text-lg transition-transform",
                          isDropdownOpen ? "rotate-180" : "",
                          isActive || isSubmenuActive ? "text-white" : "text-slate-400",
                        )}
                      />
                    </button>
                  )}
                </div>

                {/* Submenu */}
                {!isCollapsed && isDropdownOpen && (
                  <div className="mt-1 space-y-1 border-l-2 border-slate-200 pl-0 ml-8">
                    {(item as any).submenu.map((subitem: any, subindex: number) => {
                      const isSubActive = pathname === subitem.href;
                      return (
                        <Link key={subindex} href={subitem.href}>
                          <div
                            className={cn(
                              "flex items-center p-2.5 rounded-lg cursor-pointer transition-all duration-200 text-sm",
                              isSubActive
                                ? "bg-[#21a9ff] text-white font-semibold"
                                : "text-slate-500 hover:bg-slate-50 hover:text-[#21a9ff]",
                            )}
                          >
                            <span className="ml-2">{subitem.label}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

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
