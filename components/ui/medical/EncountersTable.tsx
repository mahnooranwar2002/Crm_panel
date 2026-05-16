'use client'

import React, { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFileText, FiUser, FiActivity, FiDollarSign, FiHash, FiX, FiEye } from 'react-icons/fi'
import { encounterService, ENCOUNTER_SEED_DATA } from '@/src/services/medical/encounterService'

// 1. Encounters Table Main Component
export function EncountersTable() {
  const [encounters, setEncounters] = useState<any[]>(ENCOUNTER_SEED_DATA)
  const [showModal, setShowModal] = useState(false)
  const [viewCardOpen, setViewCardOpen] = useState(false)
  const [currentEncounter, setCurrentEncounter] = useState<any>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    patient: '',
    date: '',
    charge: '',
    encounterType: 'Office Visit',
    provider: '',
    chiefComplaint: '',
    diagnosisCodes: '',
    procedures: ''
  })

  const loadEncounters = async () => {
    try {
      const data = await encounterService.getAllEncounters()
      setEncounters(data || ENCOUNTER_SEED_DATA)
    } catch (error) {
      console.error('Error loading encounters:', error)
      setEncounters(ENCOUNTER_SEED_DATA)
    }
  }

  const handleOpenModal = (encounter?: any) => {
    if (encounter) {
      setEditingId(encounter.id)
      setFormData({
        patient: encounter.patient,
        date: encounter.date,
        charge: encounter.charge.toString(),
        encounterType: encounter.encounterType,
        provider: encounter.provider,
        chiefComplaint: encounter.chiefComplaint,
        diagnosisCodes: encounter.diagnosisCodes.join(', '),
        procedures: encounter.procedures.join(', ')
      })
    } else {
      setEditingId(null)
      setFormData({
        patient: '',
        date: '',
        charge: '',
        encounterType: 'Office Visit',
        provider: '',
        chiefComplaint: '',
        diagnosisCodes: '',
        procedures: ''
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingId(null)
  }

  const handleViewCard = (encounter: any) => {
    setCurrentEncounter(encounter)
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
        charge: parseFloat(formData.charge),
        diagnosisCodes: formData.diagnosisCodes.split(',').map(c => c.trim()).filter(c => c),
        procedures: formData.procedures.split(',').map(p => p.trim()).filter(p => p)
      }

      if (editingId) {
        await encounterService.updateEncounter(editingId, dataToSubmit)
      } else {
        await encounterService.createEncounter(dataToSubmit)
      }
      await loadEncounters()
      handleCloseModal()
    } catch (error) {
      console.error('Error saving encounter:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this encounter?')) {
      try {
        await encounterService.deleteEncounter(id)
        await loadEncounters()
      } catch (error) {
        console.error('Error deleting encounter:', error)
      }
    }
  }

  const handleMarkReady = async (id: string) => {
    try {
      await encounterService.markReadyForBilling(id)
      await loadEncounters()
    } catch (error) {
      console.error('Error updating encounter:', error)
    }
  }

  return (
    <div className="w-full bg-slate-50 min-h-screen p-6 text-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Encounters & Charge Capture</h1>
            <p className="text-slate-500 font-medium mt-1">Manage patient visits and capture service charges in real-time.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all font-bold active:scale-95">
            <FiPlus size={20} />
            New Encounter
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Encounter ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date of Service</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Charge</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {encounters.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center opacity-40">
                        <FiActivity size={48} className="mb-2 text-slate-300" />
                        <p className="font-semibold text-slate-600 text-lg">No active encounters found</p>
                        <p className="text-sm">Start by creating a new patient visit.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  encounters.map((encounter: any) => (
                    <tr key={encounter.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 font-mono text-sm text-slate-500">#{encounter.id}</td>
                      <td className="px-6 py-4 font-bold text-slate-900">{encounter.patient}</td>
                      <td className="px-6 py-4 text-slate-600 font-medium">{encounter.date}</td>
                      <td className="px-6 py-4 font-bold text-slate-900">${encounter.charge.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border ${
                          encounter.status === 'Open' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                          encounter.status === 'Ready for Billing' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                          'bg-emerald-50 text-emerald-700 border-emerald-100'
                        }`}>
                          {encounter.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button 
                          onClick={() => { setCurrentEncounter(encounter); setViewCardOpen(true); }}
                          className="text-slate-400 hover:text-green-600 transition-colors"><FiEye size={18} /></button>
                        <button 
                          onClick={() => handleOpenModal(encounter)}
                          className="text-slate-400 hover:text-blue-600 transition-colors"><FiEdit2 size={18} /></button>
                        <button 
                          onClick={() => handleDelete(encounter.id)}
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

      {/* 1. VIEW CARD MODAL (Clean & Simple) */}
      {viewCardOpen && currentEncounter && (
  <div className="fixed inset-0 z-[1000] overflow-hidden">
    {/* Dark Overlay */}
    <div 
      className="absolute inset-0 bg-slate-900/40 transition-opacity" 
      onClick={() => setViewCardOpen(false)} 
    />
    
    <div className="fixed inset-y-0 right-0 max-w-full flex">
      {/* Sidebar Panel */}
      <div className="relative w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200 h-full animate-in slide-in-from-right duration-300">
        
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-5 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Encounter Details</h2>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-tight">Visit Record View</p>
          </div>
          <button onClick={() => setViewCardOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
            <FiX size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Highlighted Charge Section */}
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <label className="block text-[10px] font-bold text-blue-600 uppercase mb-1 tracking-widest">Total Charge</label>
            <p className="text-3xl font-black text-blue-900">${currentEncounter.charge.toFixed(2)}</p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patient Name</label>
              <p className="text-lg font-bold text-slate-800">{currentEncounter.patient}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date of Service</label>
                <p className="text-sm font-semibold text-slate-700">{currentEncounter.date}</p>
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Encounter Type</label>
                <p className="text-sm font-semibold text-slate-700">{currentEncounter.encounterType}</p>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Provider</label>
              <p className="text-sm font-semibold text-slate-700">{currentEncounter.provider}</p>
            </div>

            {/* Optional: Chief Complaint for better view in sidebar */}
            {currentEncounter.chiefComplaint && (
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chief Complaint</label>
                <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-600 italic leading-relaxed">
                  "{currentEncounter.chiefComplaint}"
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-6 border-t border-slate-100 bg-slate-50">
          <button 
            onClick={() => setViewCardOpen(false)} 
            className="w-full bg-white border border-slate-200 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-100 transition-all shadow-sm"
          >
            Close Detail View
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      {/* 2. EDIT MODAL (Clean Background & No Navbar Cut) */}
      {showModal && (
  <div className="fixed inset-0 z-1000 overflow-hidden">
    {/* Background Overlay - Simple Fade */}
    <div 
      className="absolute inset-0 bg-slate-900/40 transition-opacity cursor-pointer" 
      onClick={handleCloseModal} 
    />
    
    <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
      {/* Sidebar Panel */}
      <div className="relative w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200 h-full animate-in slide-in-from-right duration-300">
        
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-5 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {editingId ? 'Edit Encounter' : 'New Encounter'}
            </h2>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-tight">Patient Visit Details</p>
          </div>
          <button onClick={handleCloseModal} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
            <FiX size={24} />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Patient Name</label>
            <input 
              name="patient"
              value={formData.patient}
              onChange={handleInputChange}
              placeholder="Full name"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Provider</label>
            <input 
              name="provider"
              value={formData.provider}
              onChange={handleInputChange}
              placeholder="Dr. Name"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date</label>
              <input 
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Charge ($)</label>
              <input 
                type="number"
                name="charge"
                value={formData.charge}
                onChange={handleInputChange}
                step="0.01"
                placeholder="0.00"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-blue-600"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Chief Complaint</label>
            <textarea 
              name="chiefComplaint"
              value={formData.chiefComplaint}
              onChange={handleInputChange}
              rows={4}
              placeholder="Describe the reason for the visit..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </form>

        {/* Action Buttons (Sticky Footer) */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
          <button type="button" onClick={handleCloseModal} className="flex-1 bg-white border border-slate-200 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-100 transition-all">
            Cancel
          </button>
          <button 
            onClick={(e) => handleSubmit(e)} 
            type="submit" 
            className="flex-2 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 active:scale-95 transition-all">
            {editingId ? 'Update Record' : 'Save Encounter'}
          </button>
        </div>
      </div>
    </div>
  </div>
      )}
    </div>
  )
}

// 2. Encounter Form Component
export function EncounterForm() {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 max-w-4xl mx-auto">
      <form className="space-y-10">
        {/* Section 1: Visit Info */}
        <section>
          <div className="flex items-center gap-2 mb-6 pb-2 border-b border-slate-100">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FiUser size={20} /></div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Visit Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
               <label className="text-xs font-bold text-slate-700 uppercase ml-1">Patient</label>
               <input type="text" placeholder="Search patient..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
            </div>
            <div className="space-y-2">
               <label className="text-xs font-bold text-slate-700 uppercase ml-1">Provider</label>
               <input type="text" placeholder="Assigned physician" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-2">
               <label className="text-xs font-bold text-slate-700 uppercase ml-1">Date of Service</label>
               <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
            </div>
            <div className="space-y-2">
               <label className="text-xs font-bold text-slate-700 uppercase ml-1">Encounter Type</label>
               <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer">
                <option>Office Visit</option>
                <option>Telehealth</option>
                <option>Procedure</option>
              </select>
            </div>
          </div>
          <div className="mt-6 space-y-2">
             <label className="text-xs font-bold text-slate-700 uppercase ml-1">Chief Complaint</label>
             <textarea placeholder="Reason for visit..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" rows={3}></textarea>
          </div>
        </section>

        {/* Section 2: Codes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <section>
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-slate-100">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><FiHash size={20} /></div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Diagnosis Codes</h3>
            </div>
            <DiagnosisCodeSearch />
          </section>

          <section>
            <div className="flex items-center gap-2 mb-6 pb-2 border-b border-slate-100">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><FiActivity size={20} /></div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Procedures</h3>
            </div>
            <ProcedureCodeSearch />
          </section>
        </div>

        {/* Section 3: Summary & Submit */}
        <div className="pt-6">
          <ChargeSummary />
          <button type="submit" className="w-full mt-8 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-slate-200 active:scale-[0.99]">
            Save & Finalize Encounter
          </button>
        </div>
      </form>
    </div>
  )
}

// 3. Diagnosis Code Search Component
export function DiagnosisCodeSearch() {
  return (
    <div className="space-y-4">
      <div className="relative group">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        <input
          type="text"
          placeholder="Search ICD-10 (e.g., I25.10)..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
        />
      </div>
      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-1 italic">
        Press enter to add code to list
      </div>
    </div>
  )
}

// 4. Procedure Code Search Component
export function ProcedureCodeSearch() {
  return (
    <div className="space-y-4">
      <div className="relative group">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
        <input
          type="text"
          placeholder="Search CPT/HCPCS (e.g., 99213)..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
        />
      </div>
      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-1 italic">
        Common: 99213, 99214, 36415
      </div>
    </div>
  )
}

// 5. Charge Summary Component
export function ChargeSummary() {
  return (
    <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10">
         <FiDollarSign size={80} />
      </div>
      <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
        Charge Summary
      </h4>
      <div className="space-y-4 relative z-10">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400 font-medium">Subtotal</span>
          <span className="font-bold tracking-tight text-slate-200">$0.00</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400 font-medium">Adjustments</span>
          <span className="font-bold tracking-tight text-rose-400">-$0.00</span>
        </div>
        <div className="flex justify-between items-center border-t border-slate-700 pt-4 mt-2">
          <span className="text-lg font-bold">Total Charge</span>
          <span className="text-3xl font-black tracking-tighter text-blue-400">$0.00</span>
        </div>
      </div>
    </div>
  )
}

// 6. Superbill Preview Component
export function SuperbillPreview() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-slate-100 text-slate-600 rounded-lg"><FiFileText size={20} /></div>
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Superbill Preview</h3>
      </div>
      <div className="bg-slate-50 p-10 rounded-2xl border-2 border-dashed border-slate-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
             <FiFileText size={32} className="text-slate-300" />
          </div>
          <p className="text-slate-500 font-bold text-sm">Drafting superbill...</p>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Awaiting final diagnosis and procedures</p>
        </div>
      </div>
    </div>
  )
}

// 7. Encounter Detail Component
export function EncounterDetail({ encounterId }: { encounterId: string }) {
  return (
    <div className="space-y-8 max-w-5xl">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-black text-xl">#</div>
            <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Encounter Info</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">ID: {encounterId}</p>
            </div>
        </div>
        <span className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-amber-50 text-amber-700 border border-amber-100 shadow-sm">
          Status: Open
        </span>
      </div>
      <SuperbillPreview />
    </div>
  )
}