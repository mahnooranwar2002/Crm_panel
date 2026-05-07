'use client'

import React from 'react'
import { 
  FaUsers, 
  FaBriefcase, 
  FaFileMedical, 
  FaFileInvoiceDollar, 
  FaExclamationTriangle, 
  FaChartLine,
  FaPlus,
  FaStethoscope,
  FaShieldAlt,
  FaCalendarCheck
} from 'react-icons/fa'
import { HiOutlineDocumentReport } from 'react-icons/hi'
import Link from 'next/link'

export default function MedicalDashboard() {
  // Stats Data
  const stats = [
    { label: 'Total Patients', value: '1,245', icon: FaUsers, color: 'bg-blue-50 text-blue-600' },
    { label: 'Appointments Today', value: '28', icon: FaCalendarCheck, color: 'bg-green-50 text-green-600' },
    { label: 'Pending Claims', value: '15', icon: FaFileMedical, color: 'bg-amber-50 text-amber-600' },
    { label: 'Monthly Revenue', value: '$125K', icon: FaFileInvoiceDollar, color: 'bg-purple-50 text-purple-600' },
    { label: 'Denials (30d)', value: '8', icon: FaExclamationTriangle, color: 'bg-red-50 text-red-600' },
    { label: 'Days in AR', value: '34.5', icon: FaChartLine, color: 'bg-indigo-50 text-indigo-600' },
  ]

  const quickActions = [
    { title: 'New Patient', description: 'Register a new patient', icon: FaPlus, href: '/medical/patients/create', color: 'blue' },
    { title: 'Book Appointment', description: 'Schedule new visit', icon: FaBriefcase, href: '/medical/appointments/create', color: 'green' },
    { title: 'New Encounter', description: 'Capture clinical charges', icon: FaStethoscope, href: '/medical/encounters/create', color: 'purple' },
    { title: 'Generate Claim', description: 'Submit to insurance', icon: FaFileMedical, href: '/medical/claims/create', color: 'amber' },
    { title: 'Post Payment', description: 'Process ERA & payments', icon: FaFileInvoiceDollar, href: '/medical/payments/post', color: 'indigo' },
    { title: 'Check Eligibility', description: 'Verify insurance coverage', icon: FaShieldAlt, href: '/medical/insurance/eligibility', color: 'pink' },
  ]

  const modules = [
    { title: 'Patient Management', description: 'Records, demographics, and insurance info.', link: '/medical/patients' },
    { title: 'Claims & Billing', description: 'Generate, submit, and track insurance claims.', link: '/medical/claims' },
    { title: 'Revenue Reports', description: 'View analytics and financial insights.', link: '/medical/reports' },
    { title: 'Denials Management', description: 'Review and appeal rejected claims.', link: '/medical/denials' },
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
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Medical Billing & Operations</h1>
          <p className="text-slate-500 font-medium">Manage patients, claims, and clinical workflows efficiently.</p>
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

        {/* Modules Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-800">Core Modules</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-bold bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
              Configure Modules
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