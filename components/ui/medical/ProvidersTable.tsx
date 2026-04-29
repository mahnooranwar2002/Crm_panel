'use client'

import React, { useState } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiCalendar, FiStar, FiTrendingUp, FiMail, FiPhone, FiTarget } from 'react-icons/fi'
import { BsShieldCheck } from "react-icons/bs";

// 1. Providers Table Main Component
export function ProvidersTable() {
  const [providers, setProviders] = useState([])

  return (
    <div className="w-full bg-slate-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Providers Directory</h1>
            <p className="text-slate-500 font-medium mt-1">Manage clinician profiles, NPI records, and performance metrics.</p>
          </div>
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all font-bold active:scale-95">
            <FiPlus size={20} />
            Onboard New Provider
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">ID & Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">NPI Number</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Specialization</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Compliance</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {providers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center opacity-30">
                        <BsShieldCheck size={48} className="mb-2 text-slate-400" />
                        <p className="font-bold text-lg text-slate-600">No active providers found</p>
                        <p className="text-sm">Start by onboarding your first clinician.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  providers.map((provider: any) => (
                    <tr key={provider.id} className="hover:bg-indigo-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-xs uppercase">
                                {provider.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 leading-none">{provider.name}</p>
                                <p className="text-[10px] font-mono text-slate-400 mt-1">{provider.id}</p>
                            </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-sm text-slate-600">{provider.npi}</td>
                      <td className="px-6 py-4 text-slate-600 font-medium">{provider.specialty}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
                          Credentialed
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button className="text-slate-400 hover:text-indigo-600 transition-colors"><FiEdit2 size={18} /></button>
                        <button className="text-slate-400 hover:text-rose-600 transition-colors"><FiTrash2 size={18} /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

// 2. Provider Form Component
export function ProviderForm() {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 max-w-2xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><BsShieldCheck size={24} /></div>
        <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Provider Onboarding</h2>
            <p className="text-slate-500 font-medium">Verify credentials and license before saving.</p>
        </div>
      </div>
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input type="text" placeholder="First Name" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
          <input type="text" placeholder="Last Name" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input type="text" placeholder="NPI Number (10 digits)" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
          <input type="text" placeholder="State License #" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>

        <div className="relative">
          <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="email" placeholder="Professional Email" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>

        <div className="relative">
          <FiTarget className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Specialty (e.g. Cardiology)" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>

        <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95">
          Verify & Register Provider
        </button>
      </form>
    </div>
  )
}

// 3. Provider Schedule Component
export function ProviderSchedule() {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FiCalendar className="text-indigo-500" />
            Shift Availability
        </h2>
        <button className="text-indigo-600 font-bold text-sm hover:underline">Manage Slots</button>
      </div>
      <div className="grid grid-cols-7 gap-2">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <div key={i} className="flex flex-col items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase mb-2">{day}</span>
                  <div className={`w-2 h-2 rounded-full ${i < 5 ? 'bg-emerald-400' : 'bg-slate-200'}`}></div>
              </div>
          ))}
      </div>
      <p className="mt-6 text-sm text-slate-500 font-medium italic">Showing default weekly rotation. No conflicts detected.</p>
    </div>
  )
}

// 4. Provider Performance Component
export function ProviderPerformance() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      <StatCard label="Claims Processed" value="245" sub="Monthly volume" icon={<FiStar className="text-blue-500" />} />
      <StatCard label="Total Collections" value="$45,600" sub="+12.5% vs last month" icon={<FiTrendingUp className="text-emerald-500" />} />
      <StatCard label="Clean Claim Rate" value="94.2%" sub="High compliance" icon={<FiTarget className="text-purple-500" />} />
    </div>
  )
}

function StatCard({ label, value, sub, icon }: any) {
    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-slate-50 rounded-lg group-hover:scale-110 transition-transform">{icon}</div>
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase">Live</span>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{label}</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{value}</p>
            <p className="text-xs text-slate-400 mt-2 font-medium">{sub}</p>
        </div>
    )
}

// 5. Provider Detail Component
export function ProviderDetail({ providerId }: { providerId: string }) {
  return (
    <div className="space-y-8 max-w-5xl">
      <div className="bg-slate-900 rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
            <div className="w-24 h-24 rounded-3xl bg-indigo-500 flex items-center justify-center text-4xl font-black shadow-lg shadow-indigo-500/50">SS</div>
            <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
                    <h2 className="text-3xl font-black tracking-tight">Dr. Sarah Smith</h2>
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-indigo-500/20 text-indigo-200 border border-indigo-500/30">Primary Care</span>
                </div>
                <div className="flex flex-wrap justify-center md:justify-start gap-6 opacity-60 text-sm font-medium">
                    <span className="flex items-center gap-1"><FiTarget size={14}/> NPI: 1234567890</span>
                    <span className="flex items-center gap-1"><FiPhone size={14}/> (555) 000-0000</span>
                    <span className="flex items-center gap-1"><BsShieldCheck size={14}/> ID: {providerId}</span>
                </div>
            </div>
            <div className="pt-6 md:pt-0 border-t md:border-t-0 md:border-l border-white/10 pl-0 md:pl-8">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 text-center md:text-left">Status</p>
                <p className="text-xl font-bold flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div> Full Access</p>
            </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ProviderSchedule />
        <div className="bg-white rounded-3xl border border-slate-200 p-8 flex flex-col justify-center shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
                <button className="p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 text-indigo-600 font-bold text-sm transition-colors text-center">Edit Privileges</button>
                <button className="p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 text-indigo-600 font-bold text-sm transition-colors text-center">Export Claims</button>
            </div>
        </div>
      </div>

      <ProviderPerformance />
    </div>
  )
}