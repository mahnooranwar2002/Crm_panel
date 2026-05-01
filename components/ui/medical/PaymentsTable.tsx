'use client'

import React, { useState } from 'react'
import { FiPlus, FiUpload, FiFileText, FiDollarSign, FiCheckCircle, FiSearch, FiCalendar, FiPieChart, FiEdit2, FiTrash2, FiX, FiEye } from 'react-icons/fi'
import { paymentService, PAYMENT_SEED_DATA } from '@/src/services/medical/paymentService'

// 1. Payments Table Main Component
export function PaymentsTable() {
  const [payments, setPayments] = useState(PAYMENT_SEED_DATA)
  const [showModal, setShowModal] = useState(false)
  const [viewCardOpen, setViewCardOpen] = useState(false)
  const [currentPayment, setCurrentPayment] = useState<any>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    claimId: '',
    patient: '',
    amount: '',
    type: 'Insurance Check',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  })

  const handleOpenModal = (payment?: any) => {
    if (payment) {
      setEditingId(payment.id)
      setFormData({
        claimId: payment.claimId,
        patient: payment.patient,
        amount: payment.amount.toString(),
        type: payment.type,
        date: payment.date,
        notes: payment.notes
      })
    } else {
      setEditingId(null)
      setFormData({
        claimId: '',
        patient: '',
        amount: '',
        type: 'Insurance Check',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingId(null)
  }

  const handleViewCard = (payment: any) => {
    setCurrentPayment(payment)
    setViewCardOpen(true)
  }

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    try {
      const dataToSubmit = {
        ...formData,
        amount: parseFloat(formData.amount)
      }

      if (editingId) {
        await paymentService.updatePayment(editingId, dataToSubmit)
      } else {
        await paymentService.recordPayment(dataToSubmit)
      }
      
      const updatedPayments = await paymentService.getAllPayments()
      setPayments(updatedPayments || PAYMENT_SEED_DATA)
      handleCloseModal()
    } catch (error) {
      console.error('Error saving payment:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this payment?')) {
      try {
        await paymentService.deletePayment(id)
        const updatedPayments = await paymentService.getAllPayments()
        setPayments(updatedPayments || PAYMENT_SEED_DATA)
      } catch (error) {
        console.error('Error deleting payment:', error)
      }
    }
  }

  return (
    <div className="w-full bg-slate-50 min-h-screen p-6 text-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Payments & Remittance</h1>
            <p className="text-slate-500 font-medium mt-1">Track insurance ERAs, patient payments, and financial adjustments.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-emerald-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all font-bold active:scale-95">
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
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Claim</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Patient</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Amount</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Method</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Date Posted</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
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
                      <td className="px-6 py-4 font-bold text-blue-600">{payment.claimId}</td>
                      <td className="px-6 py-4 text-slate-700 font-medium">{payment.patient}</td>
                      <td className="px-6 py-4 font-black text-slate-900">${payment.amount.toFixed(2)}</td>
                      <td className="px-6 py-4">
                         <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase">{payment.type}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-medium">{payment.date}</td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button 
                          onClick={() => { setCurrentPayment(payment); setViewCardOpen(true); }}
                          className="text-slate-400 hover:text-green-600 transition-colors"><FiEye size={18} /></button>
                        <button 
                          onClick={() => handleOpenModal(payment)}
                          className="text-slate-400 hover:text-blue-600 transition-colors"><FiEdit2 size={18} /></button>
                        <button 
                          onClick={() => handleDelete(payment.id)}
                          className="text-slate-400 hover:text-red-600 transition-colors"><FiTrash2 size={18} /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 1. VIEW PAYMENT MODAL - Matching Claims Design */}
      {viewCardOpen && currentPayment && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          {/* Solid background overlay instead of blur to prevent navbar bleeding */}
          <div className="absolute inset-0 bg-slate-900/60" onClick={() => setViewCardOpen(false)} />
          
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Payment Details</h3>
              <button onClick={() => setViewCardOpen(false)} className="text-slate-400 hover:text-slate-600">
                <FiX size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                <label className="block text-[10px] font-bold text-emerald-600 uppercase mb-1">Amount Processed</label>
                <p className="text-2xl font-black text-emerald-900">${currentPayment.amount.toFixed(2)}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Patient</label>
                  <p className="font-semibold text-slate-700">{currentPayment.patient}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Payment Type</label>
                  <p className="font-semibold text-slate-700">{currentPayment.type}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Claim ID</label>
                  <p className="font-mono text-slate-700">{currentPayment.claimId}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Date Posted</label>
                  <p className="font-semibold text-slate-700">{currentPayment.date}</p>
                </div>
              </div>

              {currentPayment.notes && (
                <div className="pt-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Notes</label>
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                    "{currentPayment.notes}"
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 text-right border-t border-slate-100">
              <button onClick={() => setViewCardOpen(false)} className="px-5 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. EDIT/RECORD PAYMENT MODAL - Clean & Solid UI */}
      {showModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          {/* Solid dark overlay to hide background noise */}
          <div className="absolute inset-0 bg-slate-900/60" onClick={handleCloseModal} />
          
          <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0">
              <h2 className="text-xl font-bold text-slate-900">
                {editingId ? 'Edit Payment Record' : 'Record New Payment'}
              </h2>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 p-1">
                <FiX size={22} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-5 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Claim ID</label>
                  <input 
                    name="claimId"
                    value={formData.claimId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. CLM-101"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Patient Name</label>
                  <input 
                    name="patient"
                    value={formData.patient}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Amount ($)</label>
                  <input 
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none font-semibold"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Payment Type</label>
                  <select 
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none cursor-pointer">
                    <option>Insurance Check</option>
                    <option>Patient Copay</option>
                    <option>Deductible</option>
                    <option>Contractual Adjustment</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Date Posted</label>
                <input 
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Notes</label>
                <textarea 
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none transition-all"
                  placeholder="Optional notes..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-all">
                  {editingId ? 'Update Record' : 'Record Payment'}
                </button>
                <button type="button" onClick={handleCloseModal} className="flex-1 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    )}


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