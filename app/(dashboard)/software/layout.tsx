'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiPackage, FiCheckSquare, FiBarChart } from 'react-icons/fi';

export default function SoftwareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    {
      label: 'Track All Projects',
      href: '/software/track-all-projects',
      icon: FiPackage,
      description: 'Monitor and manage all software projects'
    },
    {
      label: 'Task Details',
      href: '/software/task-details',
      icon: FiCheckSquare,
      description: 'Assign and track tasks for team members'
    },
    {
      label: 'Project Status',
      href: '/software/project-status',
      icon: FiBarChart,
      description: 'View project status and progress'
    }
  ];

  const isActive = (href: string) => {
    return pathname.includes(href.split('/').pop() || '');
  };

  return (
    <div className="mx-auto max-w-7xl w-full">
      {/* Submenu Navigation */}
      <div className="mb-8 px-2">
        <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] border border-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="flex flex-col md:flex-row gap-2 p-4">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex-1 flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 ${
                    active
                      ? 'bg-gradient-to-r from-[#21a9ff] to-[#6dc6fe] text-white shadow-lg shadow-blue-200'
                      : 'bg-slate-50/50 text-slate-700 hover:bg-slate-100 border border-slate-100'
                  }`}
                >
                  <IconComponent size={20} className="flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-bold text-[14px] leading-tight">{item.label}</div>
                    <div className={`text-[11px] leading-tight ${
                      active ? 'text-blue-100' : 'text-slate-500'
                    }`}>
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Page Content */}
      <div className="w-full">
        {children}
      </div>
    </div>
  );
}