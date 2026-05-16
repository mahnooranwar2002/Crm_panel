'use client'

import React, { useState } from 'react'
import { FiPlus, FiAlertCircle, FiTrendingUp, FiClock, FiFileText, FiChevronRight, FiUpload, FiActivity, FiEdit2, FiTrash2, FiX, FiEye } from 'react-icons/fi'
import { denialService, DENIAL_SEED_DATA } from '@/src/services/medical/denialService'

// 1. Denials Table Main Component
export function DenialsTable() {
  const [denials, setDenials] = useState(DENIAL_SEED_DATA)
  const [showModal, setShowModal] = useState(false)
  const [viewCardOpen, setViewCardOpen] = useState(false)
  const [currentDenial, setCurrentDenial] = useState<any>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    claimId: '',
    reason: '',
    reasonCode: '',
    amount: '',
    patient: '',
    payer: '',
    deadline: '',
    appealStatus: 'Not Appealed'
  })

  const handleOpenModal = (denial?: any) => {
    if (denial) {
      setEditingId(denial.id)
      setFormData({
        claimId: denial.claimId,
        reason: denial.reason,
        reasonCode: denial.reasonCode,
        amount: denial.amount.toString(),
        patient: denial.patient,
        payer: denial.payer,
        deadline: denial.deadline,
        appealStatus: denial.appealStatus
      })
    } else {
      setEditingId(null)
      setFormData({
        claimId: '',
        reason: '',
        reasonCode: '',
        amount: '',
        patient: '',
        payer: '',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        appealStatus: 'Not Appealed'
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingId(null)
  }

  const handleViewCard = (denial: any) => {
    setCurrentDenial(denial)
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
        await denialService.updateDenial(editingId, dataToSubmit)
      } else {
        await denialService.createDenial(dataToSubmit)
      }

      const updatedDenials = await denialService.getAllDenials()
      setDenials(updatedDenials || DENIAL_SEED_DATA)
      handleCloseModal()
    } catch (error) {
      console.error('Error saving denial:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this denial?')) {
      try {
        await denialService.deleteDenial(id)
        const updatedDenials = await denialService.getAllDenials()
        setDenials(updatedDenials || DENIAL_SEED_DATA)
      } catch (error) {
        console.error('Error deleting denial:', error)
      }
    }
  }

  const getAppealStatusColor = (status: string) => {
    if (status.includes('Not Appealed')) return 'bg-amber-50 text-amber-700 border-amber-100'
    if (status.includes('Level 1')) return 'bg-blue-50 text-blue-700 border-blue-100'
    if (status.includes('Level 2')) return 'bg-purple-50 text-purple-700 border-purple-100'
    return 'bg-emerald-50 text-emerald-700 border-emerald-100'
  }

  return (
    <div className="w-full bg-slate-50 min-h-screen p-6 text-black">
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
             <button 
               onClick={() => handleOpenModal()}
               className="bg-rose-600 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 hover:bg-rose-700 shadow-lg shadow-rose-100 transition-all font-bold">
                <FiPlus size={20} />
                Add Denial Record
             </button>
          </div>
        </div>

        {/* Top Analytics Summary */}
        <div className="mb-8">
            <DenialAnalytics denials={denials} />
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
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {denials.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
                       <div className="flex flex-col items-center opacity-30">
                         <FiAlertCircle size={48} className="mb-2" />
                         <p className="font-bold text-lg">No active denials found</p>
                         <p className="text-sm">Great job! All claims are currently clear.</p>
                       </div>
                    </td>
                  </tr>
                ) : (
                  denials.map((denial: any) => (
                    <tr key={denial.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 font-mono text-sm text-slate-600">#{denial.id}</td>
                      <td className="px-6 py-4 font-bold text-slate-900">{denial.claimId}</td>
                      <td className="px-6 py-4 text-slate-600 text-sm">{denial.reason}</td>
                      <td className="px-6 py-4 font-bold text-rose-600">${denial.amount.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border ${getAppealStatusColor(denial.appealStatus)}`}>
                          {denial.appealStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-500">{denial.deadline}</td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button 
                          onClick={() => { setCurrentDenial(denial); setViewCardOpen(true); }}
                          className="text-slate-400 hover:text-green-600 transition-colors"><FiEye size={18} /></button>
                        <button 
                          onClick={() => handleOpenModal(denial)}
                          className="text-slate-400 hover:text-blue-600 transition-colors"><FiEdit2 size={18} /></button>
                        <button 
                          onClick={() => handleDelete(denial.id)}
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

      {/* 1. VIEW DENIAL SIDEBAR */}
      {viewCardOpen && currentDenial && (
        <>
          <div
            className="fixed inset-0 z-[998] bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setViewCardOpen(false)}
          />
          <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl z-[999] animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h2 className="text-2xl font-black text-slate-800">Denial Details</h2>
                <button
                  onClick={() => setViewCardOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 flex items-center gap-4">
                  <div className="p-2 bg-white rounded-lg text-rose-600 shadow-sm">
                    <FiAlertCircle size={20} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-rose-600 uppercase mb-0.5">Denial Amount</label>
                    <p className="text-2xl font-black text-rose-900">${currentDenial.amount.toFixed(2)}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Claim ID</label>
                  <p className="font-mono text-sm font-bold text-slate-700">{currentDenial.claimId}</p>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Reason Code</label>
                  <p className="font-bold text-slate-700">{currentDenial.reasonCode}</p>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Patient</label>
                  <p className="font-semibold text-slate-700">{currentDenial.patient}</p>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Payer</label>
                  <p className="font-semibold text-slate-700">{currentDenial.payer}</p>
                </div>

                <div className="pt-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Denial Reason</label>
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed">
                    {currentDenial.reason}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Appeal Status</label>
                  <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase ${getAppealStatusColor(currentDenial.appealStatus)}`}>
                    {currentDenial.appealStatus}
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Deadline</label>
                  <p className="text-sm font-bold text-slate-700">{currentDenial.deadline}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 2. ADD/EDIT DENIAL SIDEBAR */}
      {showModal && (
        <>
          <div
            className="fixed inset-0 z-[998] bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={handleCloseModal}
          />
          <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl z-[999] animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h2 className="text-2xl font-black text-slate-800">
                  {editingId ? 'Edit Denial' : 'Add Denial'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Claim ID</label>
                  <input 
                    name="claimId"
                    value={formData.claimId}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm"
                    placeholder="e.g. CLM-202"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Patient Name</label>
                  <input 
                    name="patient"
                    value={formData.patient}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Denial Reason</label>
                  <input 
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    placeholder="e.g. Missing Documentation"
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Reason Code</label>
                  <input 
                    name="reasonCode"
                    value={formData.reasonCode}
                    onChange={handleInputChange}
                    placeholder="e.g. CO-16"
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Denied Amount ($)</label>
                  <input 
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    step="0.01"
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Insurance Payer</label>
                  <input 
                    name="payer"
                    value={formData.payer}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Appeal Deadline</label>
                  <input 
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Appeal Status</label>
                  <select 
                    name="appealStatus"
                    value={formData.appealStatus}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none font-medium text-slate-600 cursor-pointer text-sm focus:border-blue-500 focus:bg-white transition-all">
                    <option>Not Appealed</option>
                    <option>Appealed - Level 1</option>
                    <option>Appealed - Level 2</option>
                    <option>Appealed - Level 3</option>
                    <option>Appeal Withdrawn</option>
                  </select>
                </div>

                <button type="submit" className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-3 rounded-2xl transition-all shadow-lg shadow-rose-100 active:scale-95">
                  {editingId ? 'Update Record' : 'Add Denial'}
                </button>
              </form>
            </div>
          </div>
        </>
      )}
      </div>
)}      

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
export function DenialAnalytics({ denials }: { denials: any[] }) {
  const stats = [
    { label: 'Total Denials', value: denials.length.toString(), icon: FiAlertCircle, color: 'text-rose-600 bg-rose-50' },
    { label: 'Pending Appeals', value: denials.filter(d => d.status === 'Open' || d.status === 'Under Review').length.toString(), icon: FiClock, color: 'text-amber-600 bg-amber-50' },
    { label: 'Denied Amount', value: '$' + denials.reduce((sum, d) => sum + d.amount, 0).toFixed(2), icon: FiActivity, color: 'text-blue-600 bg-blue-50' },
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