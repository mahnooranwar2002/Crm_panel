'use client'

import React, { useState } from 'react'
import { FiAlertCircle, FiX, FiUser, FiMail, FiPhone, FiCalendar, FiDollarSign, FiCheckCircle } from 'react-icons/fi'

interface Tenant {
  tenant_name: string
  property_id?: string
  contact_email: string
  phone_number: string
  move_in_date: string
  move_out_date?: string
  rent_amount: number
  status: string
}

interface ManageTenantsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (tenant: Tenant) => void
  loading?: boolean
}

type TenantErrors = {
  [K in keyof Tenant]?: string
}

const ManageTenantsModal: React.FC<ManageTenantsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  loading = false
}) => {
  const [formData, setFormData] = useState<Tenant>({
    tenant_name: '',
    contact_email: '',
    phone_number: '',
    move_in_date: '',
    rent_amount: 0,
    status: 'Active'
  })

  const [errors, setErrors] = useState<TenantErrors>({})

  const validate = (): boolean => {
    const newErrors: TenantErrors = {}
    if (!formData.tenant_name) newErrors.tenant_name = 'Tenant name is required'
    if (!formData.contact_email) newErrors.contact_email = 'Email is required'
    if (!formData.phone_number) newErrors.phone_number = 'Phone is required'
    if (!formData.move_in_date) newErrors.move_in_date = 'Move-in date is required'
    if (formData.rent_amount <= 0) newErrors.rent_amount = 'Rent must be greater than 0'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }))
    if (errors[name as keyof Tenant]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSave(formData)
      setFormData({
        tenant_name: '',
        contact_email: '',
        phone_number: '',
        move_in_date: '',
        rent_amount: 0,
        status: 'Active'
      })
    }
  }

  if (!isOpen) return null

  return (
    /* Full Screen Background Layout with Rich Glassmorphism Backdrop Blur Effect */
    <div className="fixed inset-0 z-[9999] flex items-center justify-end bg-slate-900/40 backdrop-blur-md">
      <div className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        
        {/* Sticky Glassmorphic Header */}
        <div className="sticky top-0 p-6 border-b border-slate-100/80 flex items-center justify-between bg-white/80 backdrop-blur-md z-10">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Add & Manage Tenant</h2>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">Lease setup and occupant profiling configuration</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
          >
            <FiX size={18} className="stroke-[2.5]" />
          </button>
        </div>

        {/* Scrollable Container Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50/50">
          
          {/* Tenant Name */}
          <div>
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">
              Tenant Full Name
            </label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                name="tenant_name"
                value={formData.tenant_name}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full pl-11 pr-4 py-3.5 bg-white border rounded-2xl outline-none font-bold text-slate-900 text-sm transition-all focus:border-slate-900 ${
                  errors.tenant_name ? 'border-red-500 bg-red-50/30 focus:border-red-500' : 'border-slate-200 shadow-xs'
                }`}
              />
            </div>
            {errors.tenant_name && (
              <p className="text-red-500 text-xs font-bold mt-1.5 flex items-center gap-1">
                <FiAlertCircle size={12} /> {errors.tenant_name}
              </p>
            )}
          </div>

          {/* Email & Phone Split Row Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={`w-full pl-11 pr-4 py-3.5 bg-white border rounded-2xl outline-none font-bold text-slate-900 text-sm transition-all focus:border-slate-900 ${
                    errors.contact_email ? 'border-red-500 bg-red-50/30 focus:border-red-500' : 'border-slate-200 shadow-xs'
                  }`}
                />
              </div>
              {errors.contact_email && (
                <p className="text-red-500 text-xs font-bold mt-1.5 flex items-center gap-1">
                  <FiAlertCircle size={12} /> Required
                </p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Phone Number
              </label>
              <div className="relative">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="+1234567890"
                  className={`w-full pl-11 pr-4 py-3.5 bg-white border rounded-2xl outline-none font-bold text-slate-900 text-sm transition-all focus:border-slate-900 ${
                    errors.phone_number ? 'border-red-500 bg-red-50/30 focus:border-red-500' : 'border-slate-200 shadow-xs'
                  }`}
                />
              </div>
              {errors.phone_number && (
                <p className="text-red-500 text-xs font-bold mt-1.5 flex items-center gap-1">
                  <FiAlertCircle size={12} /> Required
                </p>
              )}
            </div>
          </div>

          {/* Move-in & Move-out Timeline Range Dates Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Move-in Date
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                <input
                  type="date"
                  name="move_in_date"
                  value={formData.move_in_date}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3.5 bg-white border rounded-2xl outline-none font-bold text-slate-900 text-sm transition-all focus:border-slate-900 ${
                    errors.move_in_date ? 'border-red-500 bg-red-50/30 focus:border-red-500' : 'border-slate-200 shadow-xs'
                  }`}
                />
              </div>
              {errors.move_in_date && (
                <p className="text-red-500 text-xs font-bold mt-1.5 flex items-center gap-1">
                  <FiAlertCircle size={12} /> Required
                </p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Move-out Date
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                <input
                  type="date"
                  name="move_out_date"
                  value={formData.move_out_date || ''}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-slate-900 text-sm transition-all focus:border-slate-900 shadow-xs"
                />
              </div>
            </div>
          </div>

          {/* Rent Valuation & Status Field Config Split Row Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Monthly Rent
              </label>
              <div className="relative">
                <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="number"
                  name="rent_amount"
                  value={formData.rent_amount === 0 ? '' : formData.rent_amount}
                  onChange={handleChange}
                  placeholder="1500"
                  className={`w-full pl-11 pr-4 py-3.5 bg-white border rounded-2xl outline-none font-bold text-slate-900 text-sm transition-all focus:border-slate-900 ${
                    errors.rent_amount ? 'border-red-500 bg-red-50/30 focus:border-red-500' : 'border-slate-200 shadow-xs'
                  }`}
                />
              </div>
              {errors.rent_amount && (
                <p className="text-red-500 text-xs font-bold mt-1.5 flex items-center gap-1">
                  <FiAlertCircle size={12} /> {errors.rent_amount}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Status
              </label>
              <div className="relative">
                <FiCheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full pl-11 pr-10 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-slate-900 text-sm transition-all focus:border-slate-900 appearance-none shadow-xs"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Pending">Pending</option>
                  <option value="Terminated">Terminated</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-400 w-0 h-0"></div>
              </div>
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
            {loading ? 'Saving...' : 'Save Tenant'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default ManageTenantsModal