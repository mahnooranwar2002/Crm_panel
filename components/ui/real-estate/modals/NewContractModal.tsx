'use client'

import React, { useState } from 'react'
import { FiAlertCircle, FiX, FiFileText, FiBriefcase, FiUser, FiPhone, FiCalendar, FiDollarSign } from 'react-icons/fi'

interface Contract {
  contract_type: string
  contract_title: string
  property_id?: string
  project_id?: string
  party_name: string
  party_contact: string
  start_date: string
  end_date: string
  contract_value: number
  terms?: string
  notes?: string
}

interface NewContractModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (contract: Contract) => void
  loading?: boolean
}

const NewContractModal: React.FC<NewContractModalProps> = ({
  isOpen,
  onClose,
  onSave,
  loading = false
}) => {
  const [formData, setFormData] = useState<Contract>({
    contract_type: 'Lease',
    contract_title: '',
    party_name: '',
    party_contact: '',
    start_date: '',
    end_date: '',
    contract_value: 0
  })

  const [errors, setErrors] = useState<Partial<Contract>>({})

  const validate = (): boolean => {
    const newErrors: Partial<Contract> = {}
    if (!formData.contract_title) newErrors.contract_title = 'Contract title is required'
    if (!formData.party_name) newErrors.party_name = 'Party name is required'
    if (!formData.party_contact) newErrors.party_contact = 'Contact is required'
    if (!formData.start_date) newErrors.start_date = 'Start date is required'
    if (!formData.end_date) newErrors.end_date = 'End date is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSave(formData)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: name === 'contract_value' ? Number(value) : value }))
    if (errors[name as keyof Contract]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  if (!isOpen) return null

  return (
    /* Full screen background layout overlay with rich backdrop blur styling */
    <div className="fixed inset-0 z-[9999] flex items-center justify-end bg-slate-900/40 backdrop-blur-md">
      <div className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        
        {/* Sticky Glassmorphic Header */}
        <div className="sticky top-0 p-6 border-b border-slate-100/80 flex items-center justify-between bg-white/80 backdrop-blur-md z-10">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Create New Contract</h2>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">Draft and manage real estate legal agreements</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
          >
            <FiX size={18} className="stroke-[2.5]" />
          </button>
        </div>

        {/* Scrollable Container Content with Soft Rounded Grid Structure */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/50">
          
          {/* Contract Title */}
          <div>
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">
              Contract Title
            </label>
            <div className="relative">
              <FiFileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                name="contract_title"
                value={formData.contract_title}
                onChange={handleChange}
                placeholder="Commercial Lease Agreement"
                className={`w-full pl-11 pr-4 py-3.5 bg-white border rounded-2xl outline-none font-bold text-slate-900 text-sm transition-all focus:border-slate-900 ${
                  errors.contract_title ? 'border-red-500 bg-red-50/30 focus:border-red-500' : 'border-slate-200 shadow-xs'
                }`}
              />
            </div>
            {errors.contract_title && (
              <p className="text-red-500 text-xs font-bold mt-1.5 flex items-center gap-1">
                <FiAlertCircle size={12} /> {errors.contract_title}
              </p>
            )}
          </div>

          {/* Contract Type Selector */}
          <div>
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">
              Contract Type
            </label>
            <div className="relative">
              <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              <select
                name="contract_type"
                value={formData.contract_type}
                onChange={handleChange}
                className="w-full pl-11 pr-10 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-slate-900 text-sm transition-all focus:border-slate-900 appearance-none shadow-xs"
              >
                <option value="Lease">Lease</option>
                <option value="Sale">Sale</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Contractor">Contractor Agreement</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-400 w-0 h-0"></div>
            </div>
          </div>

          {/* Party Name */}
          <div>
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">
              Associated Party Full Name
            </label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                name="party_name"
                value={formData.party_name}
                onChange={handleChange}
                placeholder="Jane Smith"
                className={`w-full pl-11 pr-4 py-3.5 bg-white border rounded-2xl outline-none font-bold text-slate-900 text-sm transition-all focus:border-slate-900 ${
                  errors.party_name ? 'border-red-500 bg-red-50/30 focus:border-red-500' : 'border-slate-200 shadow-xs'
                }`}
              />
            </div>
            {errors.party_name && (
              <p className="text-red-500 text-xs font-bold mt-1.5 flex items-center gap-1">
                <FiAlertCircle size={12} /> {errors.party_name}
              </p>
            )}
          </div>

          {/* Party Contact */}
          <div>
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">
              Party Contact Number
            </label>
            <div className="relative">
              <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                name="party_contact"
                value={formData.party_contact}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className={`w-full pl-11 pr-4 py-3.5 bg-white border rounded-2xl outline-none font-bold text-slate-900 text-sm transition-all focus:border-slate-900 ${
                  errors.party_contact ? 'border-red-500 bg-red-50/30 focus:border-red-500' : 'border-slate-200 shadow-xs'
                }`}
              />
            </div>
            {errors.party_contact && (
              <p className="text-red-500 text-xs font-bold mt-1.5 flex items-center gap-1">
                <FiAlertCircle size={12} /> {errors.party_contact}
              </p>
            )}
          </div>

          {/* Timeline Range Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Start Date
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3.5 bg-white border rounded-2xl outline-none font-bold text-slate-900 text-sm transition-all focus:border-slate-900 ${
                    errors.start_date ? 'border-red-500 bg-red-50/30 focus:border-red-500' : 'border-slate-200 shadow-xs'
                  }`}
                />
              </div>
              {errors.start_date && (
                <p className="text-red-500 text-xs font-bold mt-1.5 flex items-center gap-1">
                  <FiAlertCircle size={12} /> Required
                </p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">
                End Date
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3.5 bg-white border rounded-2xl outline-none font-bold text-slate-900 text-sm transition-all focus:border-slate-900 ${
                    errors.end_date ? 'border-red-500 bg-red-50/30 focus:border-red-500' : 'border-slate-200 shadow-xs'
                  }`}
                />
              </div>
              {errors.end_date && (
                <p className="text-red-500 text-xs font-bold mt-1.5 flex items-center gap-1">
                  <FiAlertCircle size={12} /> Required
                </p>
              )}
            </div>
          </div>

          {/* Valuation Field */}
          <div>
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">
              Contract Value
            </label>
            <div className="relative">
              <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="number"
                name="contract_value"
                value={formData.contract_value || ''}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-slate-900 text-sm transition-all focus:border-slate-900 shadow-xs"
              />
            </div>
          </div>

          {/* Terms Spec textarea */}
          <div>
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">
              Contract Terms
            </label>
            <div className="relative">
              <FiFileText className="absolute left-4 top-3.5 text-slate-400 pointer-events-none" size={16} />
              <textarea
                name="terms"
                value={formData.terms || ''}
                onChange={handleChange}
                placeholder="Key terms and conditions specifications..."
                rows={2}
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-slate-700 text-sm transition-all focus:border-slate-900 shadow-xs resize-none"
              />
            </div>
          </div>

          {/* Notes Input Spec textarea */}
          <div>
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">
              Additional Notes
            </label>
            <div className="relative">
              <FiFileText className="absolute left-4 top-3.5 text-slate-400 pointer-events-none" size={16} />
              <textarea
                name="notes"
                value={formData.notes || ''}
                onChange={handleChange}
                placeholder="Write any additional internal notes or legal details here..."
                rows={2}
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-slate-700 text-sm transition-all focus:border-slate-900 shadow-xs resize-none"
              />
            </div>
          </div>

        </div>

        {/* Sticky Glassmorphic Footer Actions */}
        <div className="sticky bottom-0 p-4 border-t border-slate-100 grid grid-cols-2 gap-3 bg-white/90 backdrop-blur-md">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 border border-slate-200 rounded-2xl text-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors active:scale-98"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3.5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50 shadow-md shadow-slate-200 active:scale-98"
          >
            {loading ? 'Drafting...' : 'Confirm Contract Details'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default NewContractModal