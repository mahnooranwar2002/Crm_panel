'use client'

import React, { useState } from 'react'
import { FiAlertCircle, FiX, FiCalendar, FiClock, FiUser, FiPhone, FiBookmark, FiFileText } from 'react-icons/fi'

interface ScheduleVisit {
  property_id?: string
  visit_date: string
  visit_time: string
  visitor_name: string
  visitor_contact: string
  visit_purpose: string
  notes?: string
}

interface ScheduleVisitModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (visit: ScheduleVisit) => void
  loading?: boolean
}

const ScheduleVisitModal: React.FC<ScheduleVisitModalProps> = ({
  isOpen,
  onClose,
  onSave,
  loading = false
}) => {
  const [formData, setFormData] = useState<ScheduleVisit>(
    {
      visit_date: '',
      visit_time: '',
      visitor_name: '',
      visitor_contact: '',
      visit_purpose: 'Inspection'
    }
  )

  const [errors, setErrors] = useState<Partial<ScheduleVisit>>({})

  const validate = (): boolean => {
    const newErrors: Partial<ScheduleVisit> = {}
    if (!formData.visit_date) newErrors.visit_date = 'Date is required'
    if (!formData.visit_time) newErrors.visit_time = 'Time is required'
    if (!formData.visitor_name) newErrors.visitor_name = 'Visitor name is required'
    if (!formData.visitor_contact) newErrors.visitor_contact = 'Contact is required'
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
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof ScheduleVisit]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-end bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Schedule Property Visit</h2>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">Book and manage client or inspection visits</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
          >
            <FiX size={18} className="stroke-[2.5]" />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/50">
          
          {/* Visitor Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Visitor Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                name="visitor_name"
                value={formData.visitor_name}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full pl-11 pr-4 py-3 bg-white border rounded-xl outline-none font-semibold text-slate-700 text-sm transition-all focus:border-slate-900 ${
                  errors.visitor_name ? 'border-red-500 bg-red-50/30 focus:border-red-500' : 'border-slate-200 shadow-xs'
                }`}
              />
            </div>
            {errors.visitor_name && (
              <p className="text-red-500 text-xs font-bold mt-1.5 flex items-center gap-1">
                <FiAlertCircle size={12} /> {errors.visitor_name}
              </p>
            )}
          </div>

          {/* Visitor Contact */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Contact Number</label>
            <div className="relative">
              <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                name="visitor_contact"
                value={formData.visitor_contact}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className={`w-full pl-11 pr-4 py-3 bg-white border rounded-xl outline-none font-semibold text-slate-700 text-sm transition-all focus:border-slate-900 ${
                  errors.visitor_contact ? 'border-red-500 bg-red-50/30 focus:border-red-500' : 'border-slate-200 shadow-xs'
                }`}
              />
            </div>
            {errors.visitor_contact && (
              <p className="text-red-500 text-xs font-bold mt-1.5 flex items-center gap-1">
                <FiAlertCircle size={12} /> {errors.visitor_contact}
              </p>
            )}
          </div>

          {/* Date & Time Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Visit Date</label>
              <div className="relative">
                <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                <input
                  type="date"
                  name="visit_date"
                  value={formData.visit_date}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 bg-white border rounded-xl outline-none font-semibold text-slate-700 text-sm transition-all focus:border-slate-900 ${
                    errors.visit_date ? 'border-red-500 bg-red-50/30 focus:border-red-500' : 'border-slate-200 shadow-xs'
                  }`}
                />
              </div>
              {errors.visit_date && (
                <p className="text-red-500 text-xs font-bold mt-1.5 flex items-center gap-1">
                  <FiAlertCircle size={12} /> Required
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Visit Time</label>
              <div className="relative">
                <FiClock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                <input
                  type="time"
                  name="visit_time"
                  value={formData.visit_time}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 bg-white border rounded-xl outline-none font-semibold text-slate-700 text-sm transition-all focus:border-slate-900 ${
                    errors.visit_time ? 'border-red-500 bg-red-50/30 focus:border-red-500' : 'border-slate-200 shadow-xs'
                  }`}
                />
              </div>
              {errors.visit_time && (
                <p className="text-red-500 text-xs font-bold mt-1.5 flex items-center gap-1">
                  <FiAlertCircle size={12} /> Required
                </p>
              )}
            </div>
          </div>

          {/* Visit Purpose */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Visit Purpose</label>
            <div className="relative">
              <FiBookmark className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              <select
                name="visit_purpose"
                value={formData.visit_purpose}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none font-semibold text-slate-700 text-sm transition-all focus:border-slate-900 shadow-xs appearance-none"
              >
                <option value="Inspection">Inspection</option>
                <option value="Site Visit">Site Visit</option>
                <option value="Client Meeting">Client Meeting</option>
                <option value="Safety Check">Safety Check</option>
                <option value="Quality Review">Quality Review</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l border-r-0 border-t-4 border-b-0 border-l-transparent border-r-transparent border-t-slate-400 w-0 h-0 ml-1"></div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Additional Notes</label>
            <div className="relative">
              <FiFileText className="absolute left-4 top-3.5 text-slate-400 pointer-events-none" size={16} />
              <textarea
                name="notes"
                value={formData.notes || ''}
                onChange={handleChange}
                placeholder="Write any additional requests or notes here..."
                rows={3}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none font-semibold text-slate-700 text-sm transition-all focus:border-slate-900 shadow-xs resize-none"
              />
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 grid grid-cols-2 gap-3 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 border border-slate-200 rounded-xl text-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors active:scale-98"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition-all disabled:opacity-50 shadow-md shadow-slate-200 active:scale-98"
          >
            {loading ? 'Scheduling...' : 'Schedule Visit'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default ScheduleVisitModal