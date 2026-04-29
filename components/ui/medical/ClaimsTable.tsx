'use client'

import React, { useState } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiFile, FiCheck, FiAlertCircle, FiUploadCloud, FiSearch } from 'react-icons/fi'

// 1. Claims Table Main Component
export function ClaimsTable() {
  const [claims, setClaims] = useState([])

  return (
    <div className="w-full bg-slate-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Claims Management</h1>
            <p className="text-slate-500 font-medium">Track, manage, and submit medical insurance claims.</p>
          </div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all font-bold">
            <FiPlus size={20} />
            Generate Claim
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Claim ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Submitted</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {claims.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                       <div className="flex flex-col items-center opacity-40">
                         <FiFile size={48} className="mb-2" />
                         <p className="font-medium">No claims found in the database</p>
                       </div>
                    </td>
                  </tr>
                ) : (
                  claims.map((claim: any) => (
                    <tr key={claim.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 font-mono text-sm text-slate-600">#{claim.id}</td>
                      <td className="px-6 py-4 font-bold text-slate-900">{claim.patient}</td>
                      <td className="px-6 py-4 font-bold text-slate-900">${claim.amount}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-lg text-[11px] font-bold uppercase bg-blue-50 text-blue-600 border border-blue-100">
                          Draft
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-sm font-medium">{claim.submitted}</td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button className="text-slate-400 hover:text-blue-600 transition-colors"><FiEdit2 size={18} /></button>
                        <button className="text-slate-400 hover:text-red-600 transition-colors"><FiTrash2 size={18} /></button>
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

// 2. Claim Form Component
export function ClaimForm() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-3xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Generate New Claim</h2>
        <p className="text-slate-500">Enter encounter and insurance details to create a CMS-1500 claim.</p>
      </div>
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Encounter ID</label>
            <input type="text" placeholder="ENC-99213" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Patient Name</label>
            <input type="text" placeholder="Full legal name" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Healthcare Provider</label>
            <input type="text" placeholder="Dr. Sarah Johnson" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Primary Insurance</label>
            <input type="text" placeholder="Blue Cross Blue Shield" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Total Charge ($)</label>
            <input type="number" placeholder="0.00" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Date of Service</label>
            <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
          </div>
        </div>
        <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg active:scale-[0.99]">
          Generate Claim File
        </button>
      </form>
    </div>
  )
}

// 3. Claim Scrubber Component
export function ClaimScrubber() {
  const [scrubResults, setScrubResults] = useState(false)

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
          <FiSearch size={22} />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Claim Scrubber</h2>
      </div>
      
      <form className="space-y-4 mb-8" onSubmit={(e) => { e.preventDefault(); setScrubResults(true) }}>
        <div className="relative">
          <input type="text" placeholder="Enter Claim ID for validation..." className="w-full pl-4 pr-32 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
          <button type="submit" className="absolute right-2 top-2 bottom-2 bg-indigo-600 text-white px-6 rounded-lg font-bold text-sm hover:bg-indigo-700 transition-colors">
            Scrub Claim
          </button>
        </div>
      </form>

      {scrubResults && (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <ValidationItem type="success" text="All required fields present" />
          <ValidationItem type="success" text="Valid NPI and license information" />
          <ValidationItem type="warning" text="Missing modifier - may require correction" />
        </div>
      )}
    </div>
  )
}

function ValidationItem({ type, text }: { type: 'success' | 'warning', text: string }) {
  return (
    <div className={`p-4 rounded-xl border flex items-center gap-3 ${type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-amber-50 border-amber-100 text-amber-800'}`}>
      {type === 'success' ? <FiCheck strokeWidth={3} /> : <FiAlertCircle strokeWidth={3} />}
      <span className="text-sm font-bold">{text}</span>
    </div>
  )
}

// 4. Claim Status Tracker Component
export function ClaimStatusTracker() {
  const steps = [
    { title: 'Draft Created', date: '2026-04-26', status: 'completed' },
    { title: 'Submitted to Payer', date: '2026-04-27', status: 'completed' },
    { title: 'Pending Review', date: 'In Progress', status: 'active' },
  ]

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
      <h2 className="text-xl font-bold text-slate-900 mb-8">Claim Status Tracker</h2>
      <div className="space-y-8">
        {steps.map((step, idx) => (
          <div key={idx} className="flex gap-4 relative">
            {idx !== steps.length - 1 && <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-slate-100 -translate-x-1/2"></div>}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 font-bold ${step.status === 'completed' ? 'bg-emerald-500 text-white' : 'bg-blue-100 text-blue-600'}`}>
              {step.status === 'completed' ? <FiCheck size={16} strokeWidth={3} /> : '...'}
            </div>
            <div>
              <p className="font-bold text-slate-900 leading-tight">{step.title}</p>
              <p className="text-sm text-slate-500 font-medium">{step.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 5. CMS-1500 Preview Component
export function CMS1500Preview() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <FiFile className="text-blue-600" />
          CMS-1500 Preview
        </h2>
        <button className="text-xs font-bold bg-slate-100 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors">Download PDF</button>
      </div>
      <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 border-dashed">
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
           <p className="font-mono text-xs uppercase tracking-widest font-bold mb-2">Health Insurance Claim Form</p>
           <p className="text-sm">Interactive PDF preview loading...</p>
        </div>
      </div>
    </div>
  )
}

// 6. Claim Batch Processor Component
export function ClaimBatchProcessor() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Batch Submission</h2>
      <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer group">
        <div className="bg-white w-12 h-12 rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
          <FiUploadCloud size={24} className="text-blue-600" />
        </div>
        <p className="text-slate-900 font-bold">Drop EDI or XML files here</p>
        <p className="text-slate-500 text-sm mt-1">or click to browse from computer</p>
        <input type="file" multiple className="hidden" />
      </div>
      <button className="w-full mt-6 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100">
        Start Batch Processing
      </button>
    </div>
  )
}

// 7. Claim Detail Component
export function ClaimDetail({ claimId }: { claimId: string }) {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex justify-between items-center">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Claim</p>
          <h2 className="text-2xl font-black text-slate-900">ID: {claimId}</h2>
        </div>
        <span className="px-4 py-2 rounded-xl text-xs font-black uppercase bg-emerald-50 text-emerald-600 border border-emerald-100">
          Submitted
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ClaimStatusTracker />
        <CMS1500Preview />
      </div>
    </div>
  )
}