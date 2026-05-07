'use client'

import React, { useState } from 'react'
import { FiPlus, FiUpload, FiFileText, FiCheckCircle, FiClock, FiTrash2, FiEdit2, FiX, FiDownloadCloud, FiEye } from 'react-icons/fi'
import { eraService, ERA_SEED_DATA } from '@/src/services/medical/eraService'

// 1. ERA Table Main Component
export function ERATable() {
  const [eras, setERAs] = useState(ERA_SEED_DATA)
  const [showModal, setShowModal] = useState(false)
  const [viewCardOpen, setViewCardOpen] = useState(false)
  const [currentERA, setCurrentERA] = useState<any>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    fileName: '',
    payer: '',
    amount: '',
    claimsCount: '',
    records: ''
  })

  const handleOpenModal = (era?: any) => {
    if (era) {
      setEditingId(era.id)
      setFormData({
        fileName: era.fileName,
        payer: era.payer,
        amount: era.amount.toString(),
        claimsCount: era.claimsCount.toString(),
        records: era.records.toString()
      })
    } else {
      setEditingId(null)
      setFormData({
        fileName: '',
        payer: '',
        amount: '',
        claimsCount: '',
        records: ''
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingId(null)
  }

  const handleViewCard = (era: any) => {
    setCurrentERA(era)
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
        amount: parseFloat(formData.amount),
        claimsCount: parseInt(formData.claimsCount),
        records: parseInt(formData.records)
      }

      if (editingId) {
        await eraService.updateERA(editingId, dataToSubmit)
      } else {
        await eraService.importERA(dataToSubmit)
      }

      const updatedERAs = await eraService.getAllERAs()
      setERAs(updatedERAs || ERA_SEED_DATA)
      handleCloseModal()
    } catch (error) {
      console.error('Error saving ERA:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this ERA?')) {
      try {
        await eraService.deleteERA(id)
        const updatedERAs = await eraService.getAllERAs()
        setERAs(updatedERAs || ERA_SEED_DATA)
      } catch (error) {
        console.error('Error deleting ERA:', error)
      }
    }
  }

  const handleParseERA = async (id: string) => {
    try {
      await eraService.parseERA(id)
      const updatedERAs = await eraService.getAllERAs()
      setERAs(updatedERAs || ERA_SEED_DATA)
    } catch (error) {
      console.error('Error parsing ERA:', error)
    }
  }

  const getStatusColor = (status: string) => {
    return status === 'Parsed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
  }

  return (
    <div className="w-full bg-slate-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">ERA 835 Processing</h1>
            <p className="text-slate-500 font-medium mt-1">Import, parse, and process Electronic Remittance Advice files.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all font-bold active:scale-95">
            <FiUpload size={20} />
            Import ERA File
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">ERA ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">File Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Payer</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Amount</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Claims</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Upload Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {eras.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center opacity-30">
                        <FiFileText size={48} className="mb-2 text-slate-400" />
                        <p className="font-bold text-lg text-slate-600">No ERA files uploaded</p>
                        <p className="text-sm">Import your first 835 file to get started.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  eras.map((era: any) => (
                    <tr key={era.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-mono text-sm text-slate-500">#{era.id}</td>
                      <td className="px-6 py-4 font-medium text-slate-700">{era.fileName}</td>
                      <td className="px-6 py-4 font-bold text-slate-900">{era.payer}</td>
                      <td className="px-6 py-4 font-black text-slate-900">${era.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 text-center font-bold text-blue-600">{era.claimsCount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase border ${getStatusColor(era.status)}`}>
                          {era.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-medium">{era.uploadDate}</td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button 
                          onClick={() => { setCurrentERA(era); setViewCardOpen(true); }}
                          className="text-slate-400 hover:text-green-600 transition-colors"><FiEye size={18} /></button>
                        {era.status === 'Pending' && (
                          <button 
                            onClick={() => handleParseERA(era.id)}
                            className="text-slate-400 hover:text-indigo-600 transition-colors" title="Parse ERA">
                            <FiCheckCircle size={18} />
                          </button>
                        )}
                        <button 
                          onClick={() => handleOpenModal(era)}
                          className="text-slate-400 hover:text-blue-600 transition-colors"><FiEdit2 size={18} /></button>
                        <button 
                          onClick={() => handleDelete(era.id)}
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

      {/* VIEW CARD MODAL */}
      {viewCardOpen && currentERA && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setViewCardOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-slate-900">ERA Details</h3>
                <p className="text-xs text-slate-500 font-medium">Electronic Remittance Advice information</p>
              </div>
              <button onClick={() => setViewCardOpen(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
                <FiX size={20} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <FiFileText size={18} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Amount</label>
                  <p className="text-3xl font-black text-slate-900">${currentERA.amount.toFixed(2)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="pl-12">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">File Name</label>
                  <p className="text-sm font-bold text-slate-700">{currentERA.fileName}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</label>
                  <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase ${currentERA.status === 'Parsed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {currentERA.status}
                  </span>
                </div>
              </div>
              <hr className="border-slate-100" />
              <div className="pl-12">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Payer Name</label>
                <p className="text-sm font-medium text-slate-700">{currentERA.payer}</p>
              </div>
              <div className="grid grid-cols-2 gap-6 pl-12">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Claims Count</label>
                  <p className="text-lg font-black text-blue-600">{currentERA.claimsCount}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Records Parsed</label>
                  <p className="text-lg font-black text-slate-900">{currentERA.records}</p>
                </div>
              </div>
              <div className="pl-12">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Upload Date</label>
                <p className="text-sm font-medium text-slate-700">{currentERA.uploadDate}</p>
              </div>
            </div>
            <div className="bg-slate-50 p-4 border-t border-slate-100 text-center">
              <button onClick={() => setViewCardOpen(false)} className="w-full py-3 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[99999] p-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl">
            <div className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-white/20 px-8 py-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                {editingId ? 'Edit ERA' : 'Import ERA 835 File'}
              </h2>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase ml-1">File Name</label>
                <input 
                  type="text"
                  name="fileName"
                  value={formData.fileName}
                  onChange={handleInputChange}
                  placeholder="e.g., ERA_20260428_BCBS.835"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase ml-1">Payer Name</label>
                  <input 
                    type="text"
                    name="payer"
                    value={formData.payer}
                    onChange={handleInputChange}
                    placeholder="e.g., Blue Cross Blue Shield"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase ml-1">Total Amount ($)</label>
                  <input 
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase ml-1">Number of Claims</label>
                  <input 
                    type="number"
                    name="claimsCount"
                    value={formData.claimsCount}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase ml-1">Records Parsed</label>
                  <input 
                    type="number"
                    name="records"
                    value={formData.records}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-6">
                <button 
                  type="submit"
                  className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-all">
                  {editingId ? 'Update ERA' : 'Import ERA File'}
                </button>
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-slate-200 text-slate-900 py-3 rounded-xl font-bold hover:bg-slate-300 transition-all">
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
