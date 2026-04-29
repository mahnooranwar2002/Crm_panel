'use client'

import React, { useState } from 'react'
import { FiPlus, FiUpload, FiFileText, FiDollarSign, FiCheckCircle, FiSearch, FiCalendar, FiPieChart } from 'react-icons/fi'

// 1. Payments Table Main Component
export function PaymentsTable() {
  const [payments, setPayments] = useState([])

  return (
    <div className="w-full bg-slate-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Payments & Remittance</h1>
            <p className="text-slate-500 font-medium mt-1">Track insurance ERAs, patient payments, and financial adjustments.</p>
          </div>
          <button className="bg-emerald-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all font-bold active:scale-95">
            <FiPlus size={20} />
            Record New Payment
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Transaction ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Related Claim</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Amount</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Method</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Date Posted</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center opacity-30">
                        <FiPieChart size={48} className="mb-2 text-slate-400" />
                        <p className="font-bold text-lg text-slate-600">No transactions recorded</p>
                        <p className="text-sm">Payment history will appear here once posted.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  payments.map((payment: any) => (
                    <tr key={payment.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-mono text-sm text-slate-500">#{payment.id}</td>
                      <td className="px-6 py-4 font-bold text-blue-600 cursor-pointer hover:underline">{payment.claimId}</td>
                      <td className="px-6 py-4 font-black text-slate-900">${payment.amount}</td>
                      <td className="px-6 py-4">
                         <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase">{payment.type}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-medium">{payment.date}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          Posted
                        </span>
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

// 2. ERA Parser Component
export function ERAParser() {
  const [file, setFile] = useState<File | null>(null)
  const [parsing, setParsing] = useState(false)

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
      <div className="bg-indigo-600 p-8 text-white relative">
        <FiUpload className="absolute right-8 top-1/2 -translate-y-1/2 opacity-20" size={60} />
        <h2 className="text-2xl font-bold tracking-tight">ERA 835 Importer</h2>
        <p className="text-indigo-100 text-sm mt-1 font-medium italic">Automate claim adjudication with 835 files.</p>
      </div>

      <div className="p-8">
        <div 
          className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
            file ? 'border-indigo-400 bg-indigo-50/30' : 'border-slate-200 hover:border-indigo-300'
          }`}
        >
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            accept=".835,.txt,.dat"
            className="hidden"
            id="era-file"
          />
          <label htmlFor="era-file" className="cursor-pointer group">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
               <FiFileText size={32} className="text-indigo-500" />
            </div>
            <p className="text-slate-600 font-bold mb-1">
              {file ? file.name : 'Drop your 835 file here'}
            </p>
            <p className="text-xs text-slate-400 font-medium">Supports .835, .txt, and .dat formats</p>
          </label>
        </div>

        <button 
          onClick={() => { setParsing(true); setTimeout(() => setParsing(false), 2000) }}
          className="w-full mt-6 bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          disabled={!file || parsing}
        >
          {parsing ? (
            <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Parsing ANSI 835...</span>
          ) : 'Start Batch Processing'}
        </button>

        {parsing && (
          <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
             <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Parse Summary</h3>
                    <FiCheckCircle className="text-emerald-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Payments Found</p>
                        <p className="text-2xl font-black text-slate-900 tracking-tighter">15</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total Remit</p>
                        <p className="text-2xl font-black text-emerald-600 tracking-tighter">$45,600</p>
                    </div>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  )
}

// 3. Payment Posting Form Component
export function PaymentPostingForm() {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><FiDollarSign size={20} /></div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Manual Payment Posting</h2>
      </div>
      
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Claim Reference</label>
            <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Search Claim ID..." className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Post Amount</label>
            <input type="number" placeholder="0.00" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-lg" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1 font-mono">Payment Type</label>
            <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium appearance-none outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
              <option>Insurance Check</option>
              <option>Patient Copay</option>
              <option>Deductible</option>
              <option>Contractual Adjustment</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Service Date</label>
            <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Internal Notes</label>
          <textarea placeholder="Reason for adjustment or check details..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" rows={3}></textarea>
        </div>

        <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-black transition-all shadow-xl shadow-slate-100 active:scale-[0.98]">
          Post to Ledger
        </button>
      </form>
    </div>
  )
}

// 4. Patient Statement Generator Component
export function PatientStatementGenerator() {
  return (
    <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-10 opacity-10">
        <FiPieChart size={120} />
      </div>
      <div className="relative z-10">
        <h2 className="text-2xl font-black tracking-tight mb-2">Statement Generator</h2>
        <p className="text-slate-400 text-sm mb-8 font-medium">Consolidate patient balance and billing history.</p>
        
        <form className="space-y-5">
          <div className="space-y-1">
            <input type="text" placeholder="Patient Search..." className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:border-blue-400 outline-none text-white transition-all" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="date" className="w-full pl-10 pr-3 py-3 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-slate-300 outline-none" />
            </div>
            <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="date" className="w-full pl-10 pr-3 py-3 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-slate-300 outline-none" />
            </div>
          </div>

          <select className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm font-bold text-slate-300 outline-none appearance-none cursor-pointer">
            <option>Format: PDF Document</option>
            <option>Format: Email Statement</option>
            <option>Format: Printer Ready</option>
          </select>

          <button type="submit" className="w-full bg-blue-500 text-white py-4 rounded-2xl font-black hover:bg-blue-600 transition-all shadow-lg shadow-blue-900/50">
            Generate Statement
          </button>
        </form>
      </div>
    </div>
  )
}