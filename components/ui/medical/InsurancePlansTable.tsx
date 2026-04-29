'use client'

import React, { useState } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiShield, FiCheckCircle, FiSearch, FiLink, FiCalendar, FiUserCheck } from 'react-icons/fi'

// 1. Insurance Plans Table Main Component
export function InsurancePlansTable() {
  const [plans, setPlans] = useState([])

  return (
    <div className="w-full bg-slate-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Insurance Directory</h1>
            <p className="text-slate-500 font-medium mt-1">Manage master payer lists and associated insurance plans.</p>
          </div>
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all font-bold active:scale-95">
            <FiPlus size={20} />
            Add New Payer
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Payer Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Plan Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {plans.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center opacity-30">
                        <FiShield size={48} className="mb-2 text-slate-400" />
                        <p className="font-bold text-lg text-slate-600">No insurance plans registered</p>
                        <p className="text-sm text-slate-500 font-medium">Add payers to start linking patients.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  plans.map((plan: any) => (
                    <tr key={plan.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                        {plan.payer}
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-medium text-sm">{plan.type}</td>
                      <td className="px-6 py-4 text-slate-900 font-medium">{plan.name}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-100 tracking-wider">
                          Active
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

// 2. Eligibility Checker Component
export function EligibilityChecker() {
  const [checking, setChecking] = useState(false)

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-2xl">
      <div className="bg-slate-900 p-8 text-white">
        <div className="flex items-center gap-3 mb-2">
           <FiUserCheck className="text-blue-400" size={24} />
           <h2 className="text-2xl font-bold tracking-tight">Insurance Eligibility</h2>
        </div>
        <p className="text-slate-400 text-sm">Real-time verification with clearinghouse API.</p>
      </div>
      
      <div className="p-8">
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setChecking(true) }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
               <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Patient Name</label>
               <input type="text" placeholder="John Doe" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
            </div>
            <div className="space-y-2">
               <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Date of Birth</label>
               <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
               <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Payer</label>
               <input type="text" placeholder="e.g. Aetna" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
            </div>
            <div className="space-y-2">
               <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Policy #</label>
               <input type="text" placeholder="XYZ12345678" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2">
            {checking ? (
              <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Verifying...</span>
            ) : 'Check Live Eligibility'}
          </button>
        </form>

        {checking && (
          <div className="mt-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-6">
              <div className="flex items-center gap-2 mb-4 text-emerald-700">
                <FiCheckCircle size={20} strokeWidth={3} />
                <h3 className="font-black uppercase tracking-wider text-sm">Eligibility Verified: ACTIVE</h3>
              </div>
              <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                <ResultItem label="Copay" value="$25.00" />
                <ResultItem label="Deductible" value="$1,500.00" />
                <ResultItem label="Out-of-Pocket" value="$5,000.00" />
                <ResultItem label="Payer ID" value="60054" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ResultItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="border-b border-emerald-100 pb-2">
      <p className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-black text-emerald-900">{value}</p>
    </div>
  )
}

// 3. Patient Insurance Form Component
export function PatientInsuranceForm() {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><FiLink size={20} /></div>
        <h2 className="text-xl font-bold text-slate-900">Link Patient Insurance</h2>
      </div>
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none font-medium">
                <option>Select Patient</option>
            </select>
            <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none font-medium">
                <option>Select Plan</option>
            </select>
        </div>
        
        <div className="relative group">
          <FiShield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Policy / Member ID" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>

        <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none font-medium">
          <option>Relationship to Subscriber</option>
          <option>Self</option>
          <option>Spouse</option>
          <option>Child</option>
        </select>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
            <input type="date" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="relative">
            <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
            <input type="date" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>

        <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-slate-100">
          Save Coverage Link
        </button>
      </form>
    </div>
  )
}

// 4. Insurance Plan Detail Component
export function InsurancePlanDetail({ planId }: { planId: string }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 max-w-xl">
      <div className="flex justify-between items-start mb-8">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Plan Specifications</h2>
        <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-600 border border-emerald-100">Active</span>
      </div>
      <div className="grid grid-cols-2 gap-y-8">
        <DetailBlock label="Payer Name" value="Blue Cross Blue Shield" />
        <DetailBlock label="Plan Name" value="BCBS PPO Gold" />
        <DetailBlock label="Plan Type" value="Commercial" />
        <DetailBlock label="Network ID" value="PPO-9920" />
      </div>
    </div>
  )
}

function DetailBlock({ label, value }: { label: string, value: string }) {
    return (
        <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
            <p className="font-bold text-slate-800">{value}</p>
        </div>
    )
}