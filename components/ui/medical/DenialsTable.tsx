'use client'

import React, { useState } from 'react'
import { FiPlus, FiAlertCircle, FiTrendingUp, FiClock, FiFileText, FiChevronRight, FiUpload, FiActivity } from 'react-icons/fi'

// 1. Denials Table Main Component
export function DenialsTable() {
  const [denials, setDenials] = useState([])

  return (
    <div className="w-full bg-slate-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Denial Management</h1>
            <p className="text-slate-500 font-medium mt-1">Monitor rejected claims and manage the appeal process.</p>
          </div>
          <div className="flex gap-3">
             <button className="bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm">
                Export Report
             </button>
             <button className="bg-rose-600 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 hover:bg-rose-700 shadow-lg shadow-rose-100 transition-all font-bold">
                <FiPlus size={20} />
                Add Denial Record
             </button>
          </div>
        </div>

        {/* Top Analytics Summary */}
        <div className="mb-8">
            <DenialAnalytics />
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
             <h2 className="font-bold text-slate-800">Active Denials</h2>
             <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                Live Updates
             </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Denial ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Claim ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Appeal Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Deadline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {denials.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                       <div className="flex flex-col items-center opacity-30">
                         <FiAlertCircle size={48} className="mb-2" />
                         <p className="font-bold text-lg">No active denials found</p>
                         <p className="text-sm">Great job! All claims are currently clear.</p>
                       </div>
                    </td>
                  </tr>
                ) : (
                  denials.map((denial: any) => (
                    <tr key={denial.id} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                      <td className="px-6 py-4 font-mono text-sm text-slate-600">#{denial.id}</td>
                      <td className="px-6 py-4 font-bold text-slate-900">{denial.claimId}</td>
                      <td className="px-6 py-4 text-slate-600 text-sm">{denial.reason}</td>
                      <td className="px-6 py-4 font-bold text-rose-600">${denial.amount}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase bg-amber-50 text-amber-700 border border-amber-100">
                          Not Appealed
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-500">{denial.deadline}</td>
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

// 2. Denial Detail Component
export function DenialDetail({ denialId }: { denialId: string }) {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl">
            <FiAlertCircle size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Denial Details</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Tracking ID: {denialId}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <DetailItem label="Denial Code" value="CO-16" />
          <DetailItem label="Denied Amount" value="$250.00" isRed />
          <DetailItem label="Reason" value="Claim lacks information or documentation" isWide />
          <DetailItem label="Payer Response" value="Additional medical records required for review." isWide />
        </div>
      </div>
      <DenialWorkQueue />
    </div>
  )
}

function DetailItem({ label, value, isRed, isWide }: any) {
    return (
        <div className={isWide ? "sm:col-span-2" : ""}>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <p className={`text-lg font-bold ${isRed ? 'text-rose-600' : 'text-slate-800'}`}>{value}</p>
        </div>
    )
}

// 3. Appeal Form Component
export function AppealForm() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 max-w-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">File Formal Appeal</h2>
        <p className="text-slate-500 font-medium">Prepare your justification and support documents.</p>
      </div>
      <form className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Target Denial ID</label>
          <input type="text" placeholder="DEN-4490" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Appeal Level</label>
          <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none">
            <option>Select Level</option>
            <option>Level 1 - Peer to Peer</option>
            <option>Level 2 - Formal Appeal</option>
            <option>Level 3 - External Review</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Justification Notes</label>
          <textarea placeholder="Explain why this denial should be overturned..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" rows={4}></textarea>
        </div>

        <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center group hover:bg-slate-50 transition-colors cursor-pointer">
           <FiUpload size={24} className="text-slate-400 group-hover:text-blue-500 transition-colors mb-2" />
           <p className="text-sm font-bold text-slate-700">Attach Supporting Medical Records</p>
           <p className="text-xs text-slate-400">PDF, JPG or PNG (Max 10MB)</p>
           <input type="file" className="hidden" />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-[0.98]">
          Submit Official Appeal
        </button>
      </form>
    </div>
  )
}

// 4. Denial Analytics Component
export function DenialAnalytics() {
  const stats = [
    { label: 'Total Denials', value: '8', icon: FiAlertCircle, color: 'text-rose-600 bg-rose-50' },
    { label: 'Pending Appeals', value: '3', icon: FiClock, color: 'text-amber-600 bg-amber-50' },
    { label: 'Denied Amount', value: '$2,500', icon: FiActivity, color: 'text-blue-600 bg-blue-50' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center gap-5">
           <div className={`p-4 rounded-xl ${stat.color}`}>
              <stat.icon size={24} />
           </div>
           <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
           </div>
        </div>
      ))}
    </div>
  )
}

// 5. Denial Work Queue Component
export function DenialWorkQueue() {
  const queue = [
    { id: 'CLM-2026-001', error: 'Missing modifier - CO-16', urgency: 'High' },
    { id: 'CLM-2026-002', error: 'Authorization issue - PR-1', urgency: 'Medium' },
  ]

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-slate-900">Work Queue</h2>
        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold">{queue.length} Tasks</span>
      </div>
      <div className="space-y-4">
        {queue.map((item, i) => (
          <div key={i} className="p-5 border border-slate-100 rounded-2xl flex justify-between items-center hover:border-blue-200 hover:bg-blue-50/20 transition-all group">
            <div className="flex items-center gap-4">
               <div className={`w-2 h-10 rounded-full ${item.urgency === 'High' ? 'bg-rose-500' : 'bg-amber-500'}`}></div>
               <div>
                  <p className="font-bold text-slate-900">{item.id}</p>
                  <p className="text-sm text-slate-500 font-medium">{item.error}</p>
               </div>
            </div>
            <button className="bg-slate-900 text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-black transition-colors flex items-center gap-2">
              Review <FiChevronRight />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}