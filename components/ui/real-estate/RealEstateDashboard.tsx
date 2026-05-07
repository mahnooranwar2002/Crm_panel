// import React from 'react'
// import { FiHome, FiDollarSign, FiCalendar, FiTool, FiCheckCircle, FiFileText } from 'react-icons/fi'

// export default function RealEstateDashboard() {
//   const stats = [
//     { icon: FiHome, label: 'Total Properties', value: '24', color: '#21a9ff' },
//     { icon: FiDollarSign, label: 'Total Budget', value: '$2.5M', color: '#4ade80' },
//     { icon: FiCalendar, label: 'Active Projects', value: '8', color: '#8b5cf6' },
//     { icon: FiCheckCircle, label: 'Completed Tasks', value: '45', color: '#f59e0b' }
//   ]

//   return (
//     <div style={{ padding: '20px' }}>
//       <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '10px' }}>Real Estate & Construction Management</h1>
//       <p style={{ color: '#6b7280', marginBottom: '30px' }}>Manage properties, construction projects, and resources</p>

//       <div style={{
//         display: 'grid',
//         gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
//         gap: '20px',
//         marginBottom: '40px'
//       }}>
//         {stats.map((stat, index) => {
//           const IconComponent = stat.icon
//           return (
//             <div key={index} style={{
//               padding: '20px',
//               border: '1px solid #e5e7eb',
//               borderRadius: '8px',
//               backgroundColor: '#f9fafb'
//             }}>
//               <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
//                 <div>
//                   <p style={{ color: '#6b7280', fontSize: '13px', margin: '0 0 8px 0' }}>{stat.label}</p>
//                   <p style={{ fontSize: '24px', fontWeight: '700', margin: '0', color: stat.color }}>{stat.value}</p>
//                 </div>
//                 <IconComponent size={24} color={stat.color} />
//               </div>
//             </div>
//           )
//         })}
//       </div>

//       <div style={{
//         backgroundColor: 'white',
//         padding: '20px',
//         borderRadius: '8px',
//         border: '1px solid #e5e7eb'
//       }}>
//         <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>Quick Start</h2>
//         <div style={{
//           display: 'grid',
//           gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
//           gap: '15px'
//         }}>
//           <button style={{
//             padding: '12px 16px',
//             border: '1px solid #e5e7eb',
//             borderRadius: '6px',
//             textAlign: 'left',
//             cursor: 'pointer',
//             backgroundColor: '#f9fafb',
//             transition: 'all 0.2s'
//           }}>
//             <p style={{ fontWeight: '600', margin: '0 0 4px 0', fontSize: '14px' }}>🏠 Add New Property</p>
//             <p style={{ color: '#6b7280', fontSize: '12px', margin: '0' }}>List a new property</p>
//           </button>
//           <button style={{
//             padding: '12px 16px',
//             border: '1px solid #e5e7eb',
//             borderRadius: '6px',
//             textAlign: 'left',
//             cursor: 'pointer',
//             backgroundColor: '#f9fafb'
//           }}>
//             <p style={{ fontWeight: '600', margin: '0 0 4px 0', fontSize: '14px' }}>🔨 Start New Project</p>
//             <p style={{ color: '#6b7280', fontSize: '12px', margin: '0' }}>Create a construction project</p>
//           </button>
//           <button style={{
//             padding: '12px 16px',
//             border: '1px solid #e5e7eb',
//             borderRadius: '6px',
//             textAlign: 'left',
//             cursor: 'pointer',
//             backgroundColor: '#f9fafb'
//           }}>
//             <p style={{ fontWeight: '600', margin: '0 0 4px 0', fontSize: '14px' }}>📋 Schedule Inspection</p>
//             <p style={{ color: '#6b7280', fontSize: '12px', margin: '0' }}>Book a site inspection</p>
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

'use client'

import React from 'react'
import { 
  FiHome, 
  FiDollarSign, 
  FiCalendar, 
  FiTool, 
  FiCheckCircle, 
  FiFileText,
  FiPlus,
  FiMapPin,
  FiPieChart,
  FiUsers
} from 'react-icons/fi'
import Link from 'next/link'

export default function RealEstateDashboard() {
  // Stats Data
  const stats = [
    { label: 'Total Properties', value: '24', icon: FiHome, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Budget', value: '$2.5M', icon: FiDollarSign, color: 'bg-green-50 text-green-600' },
    { label: 'Active Projects', value: '08', icon: FiCalendar, color: 'bg-purple-50 text-purple-600' },
    { label: 'Completed Tasks', value: '45', icon: FiCheckCircle, color: 'bg-amber-50 text-amber-600' },
    { label: 'Site Visits', value: '12', icon: FiMapPin, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Total Revenue', value: '$840K', icon: FiPieChart, color: 'bg-pink-50 text-pink-600' },
  ]

  const quickActions = [
    { title: 'Add Property', description: 'List a new property unit', icon: FiPlus, href: '/real-estate/properties/create', color: 'blue' },
    { title: 'Start Project', description: 'Create construction plan', icon: FiTool, href: '/real-estate/projects/new', color: 'green' },
    { title: 'Schedule Visit', description: 'Book a site inspection', icon: FiCalendar, href: '/real-estate/visits/book', color: 'purple' },
    { title: 'New Contract', description: 'Generate legal agreement', icon: FiFileText, href: '/real-estate/contracts/new', color: 'amber' },
    { title: 'Manage Tenants', description: 'View and edit tenant info', icon: FiUsers, href: '/real-estate/tenants', color: 'indigo' },
    { title: 'Financial Report', description: 'Check ROI & expenses', icon: FiDollarSign, href: '/real-estate/reports/financial', color: 'pink' },
  ]

  const modules = [
    { title: 'Inventory Management', description: 'Track available units, pricing, and availability status.', link: '/real-estate/inventory' },
    { title: 'Project Tracking', description: 'Monitor construction phases, labor, and milestones.', link: '/real-estate/projects' },
    { title: 'Accounts & Ledger', description: 'Manage payments, invoices, and project expenses.', link: '/real-estate/billing' },
    { title: 'Task Manager', description: 'Assign tasks to contractors and track completion.', link: '/real-estate/tasks' },
  ]

  const colorMap: Record<string, string> = {
    blue: 'hover:border-blue-300 text-blue-600',
    green: 'hover:border-green-300 text-green-600',
    purple: 'hover:border-purple-300 text-purple-600',
    amber: 'hover:border-amber-300 text-amber-600',
    indigo: 'hover:border-indigo-300 text-indigo-600',
    pink: 'hover:border-pink-300 text-pink-600',
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Real Estate & Construction</h1>
          <p className="text-slate-500 font-medium">Manage properties, construction projects, and resources efficiently.</p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-10">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all">
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                  <Icon size={18} />
                </div>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-xl font-bold text-slate-900">{stat.value}</p>
              </div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link key={action.title} href={action.href}>
                  <div className={`bg-white rounded-xl border-2 border-transparent shadow-sm p-6 cursor-pointer transition-all hover:shadow-lg ${colorMap[action.color]}`}>
                    <div className="flex items-center gap-5">
                      <div className="p-4 bg-slate-50 rounded-xl text-slate-700">
                        <Icon size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 text-lg mb-0.5">{action.title}</h3>
                        <p className="text-sm text-slate-500 font-medium">{action.description}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Core Modules Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-800">Operational Modules</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-bold bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
              Configure Portfolio
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-x divide-slate-100">
            {modules.map((m, idx) => (
              <div key={idx} className="p-6 hover:bg-slate-50 transition-colors group">
                <h3 className="font-bold text-slate-900 mb-2">{m.title}</h3>
                <p className="text-sm text-slate-500 mb-4 leading-relaxed">{m.description}</p>
                <Link href={m.link} className="text-blue-600 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                  Open Module <span>→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}