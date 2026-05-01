'use client'

import React, { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiFile, FiCheck, FiAlertCircle, FiUploadCloud, FiSearch, FiX, FiEye } from 'react-icons/fi'
import { claimService, CLAIMS_SEED_DATA } from '@/src/services/medical/claimService'

// 1. Claims Table Main Component
export function ClaimsTable() {
  const [claims, setClaims] = useState<any[]>(CLAIMS_SEED_DATA)
  const [showModal, setShowModal] = useState(false)
  const [viewCardOpen, setViewCardOpen] = useState(false)
  const [currentClaim, setCurrentClaim] = useState<any>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    patient: '',
    amount: '',
    insurance: '',
    provider: '',
    encounterID: '',
    status: 'Draft',
    submitted: ''
  })

  const loadClaims = async () => {
    try {
      const data = await claimService.getAllClaims()
      setClaims(data || CLAIMS_SEED_DATA)
    } catch (error) {
      console.error('Error loading claims:', error)
      setClaims(CLAIMS_SEED_DATA)
    }
  }

  const handleOpenModal = (claim?: any) => {
    if (claim) {
      setEditingId(claim.id)
      setFormData({
        patient: claim.patient,
        amount: claim.amount.toString(),
        insurance: claim.insurance,
        provider: claim.provider,
        encounterID: claim.encounterID,
        status: claim.status,
        submitted: claim.submitted
      })
    } else {
      setEditingId(null)
      setFormData({
        patient: '',
        amount: '',
        insurance: '',
        provider: '',
        encounterID: '',
        status: 'Draft',
        submitted: new Date().toISOString().split('T')[0]
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingId(null)
  }

  const handleViewCard = (claim: any) => {
    setCurrentClaim(claim)
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
        await claimService.updateClaim(editingId, dataToSubmit)
      } else {
        await claimService.createClaim(dataToSubmit)
      }
      await loadClaims()
      handleCloseModal()
    } catch (error) {
      console.error('Error saving claim:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this claim?')) {
      try {
        await claimService.deleteClaim(id)
        await loadClaims()
      } catch (error) {
        console.error('Error deleting claim:', error)
      }
    }
  }

  const handleSubmitClaim = async (id: string) => {
    try {
      await claimService.submitClaim(id)
      await loadClaims()
    } catch (error) {
      console.error('Error submitting claim:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft':
        return 'bg-blue-50 text-blue-600 border-blue-100'
      case 'Submitted':
        return 'bg-amber-50 text-amber-600 border-amber-100'
      case 'Approved':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100'
      case 'Denied':
        return 'bg-red-50 text-red-600 border-red-100'
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100'
    }
  }

  return (
    <div className="w-full bg-slate-50 min-h-screen p-6 text-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Claims Management</h1>
            <p className="text-slate-500 font-medium">Track, manage, and submit medical insurance claims.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all font-bold">
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
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Insurance</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Submitted</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {claims.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
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
                      <td className="px-6 py-4 font-bold text-slate-900">${claim.amount.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase border ${getStatusColor(claim.status)}`}>
                          {claim.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-sm">{claim.insurance}</td>
                      <td className="px-6 py-4 text-slate-500 text-sm font-medium">{claim.submitted}</td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button 
                          onClick={() => { setCurrentClaim(claim); setViewCardOpen(true); }}
                          className="text-slate-400 hover:text-green-600 transition-colors"><FiEye size={18} /></button>
                        <button 
                          onClick={() => handleOpenModal(claim)}
                          className="text-slate-400 hover:text-blue-600 transition-colors"><FiEdit2 size={18} /></button>
                        <button 
                          onClick={() => handleDelete(claim.id)}
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

      {/* 1. VIEW CARD MODAL - Simple & Clean */}
      {viewCardOpen && currentClaim && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          {/* Simple dark overlay */}
          <div className="absolute inset-0 bg-slate-900/60" onClick={() => setViewCardOpen(false)} />
          
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Claim Details</h3>
              <button onClick={() => setViewCardOpen(false)} className="text-slate-400 hover:text-slate-600">
                <FiX size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <label className="block text-[10px] font-bold text-blue-600 uppercase mb-1">Claim Amount</label>
                <p className="text-2xl font-black text-blue-900">${currentClaim.amount.toFixed(2)}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Patient</label>
                  <p className="font-semibold text-slate-700">{currentClaim.patient}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Status</label>
                  <p className="font-semibold text-slate-700">{currentClaim.status}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Insurance</label>
                  <p className="font-semibold text-slate-700">{currentClaim.insurance}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase">Submitted</label>
                  <p className="font-semibold text-slate-700">{currentClaim.submitted}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 text-right border-t border-slate-100">
              <button onClick={() => setViewCardOpen(false)} className="px-5 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-100">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. EDIT/NEW MODAL - UI Clean Fix */}
      {showModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          {/* Overlay fix - No blur for cleaner look */}
          <div className="absolute inset-0 bg-slate-900/60" onClick={handleCloseModal} />
          
          <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
            
            {/* Clean White Header */}
            <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-white z-10">
              <h2 className="text-xl font-bold text-slate-900">
                {editingId ? 'Edit Claim' : 'Generate New Claim'}
              </h2>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 p-1">
                <FiX size={22} />
              </button>
            </div>

            {/* Scrollable Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-5 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Encounter ID</label>
                  <input 
                    name="encounterID"
                    value={formData.encounterID}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Patient Name</label>
                  <input 
                    name="patient"
                    value={formData.patient}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Healthcare Provider</label>
                  <input 
                    name="provider"
                    value={formData.provider}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Primary Insurance</label>
                  <input 
                    name="insurance"
                    value={formData.insurance}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
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
                  <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Date</label>
                  <input 
                    type="date"
                    name="submitted"
                    value={formData.submitted}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Status</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none cursor-pointer">
                  <option>Draft</option>
                  <option>Submitted</option>
                  <option>Approved</option>
                  <option>Denied</option>
                </select>
              </div>

              {/* Action Buttons inside form */}
              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-all">
                  {editingId ? 'Update Claim' : 'Generate Claim'}
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
  )
}

// 2. Claim Form Component
export function ClaimForm() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 ">
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