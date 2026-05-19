'use client';

import React, { useState, useEffect } from 'react';
import { FiX, FiAlertCircle, FiPlus, FiTrash2 } from 'react-icons/fi';

interface Permit {
  _id?: string;
  project_id?: string;
  permit_type: string;
  permit_number: string;
  issued_date: string;
  expiry_date: string;
  issuing_authority?: string;
  description?: string;
  status?: string;
  documents?: string[];
  notes?: string;
}

interface PermitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (permit: Permit) => void;
  permit?: Permit;
  loading?: boolean;
}

const PermitModal: React.FC<PermitModalProps> = ({
  isOpen,
  onClose,
  onSave,
  permit,
  loading = false
}) => {
  const [formData, setFormData] = useState<Permit>({
    permit_type: 'Building Permit',
    permit_number: '',
    issued_date: '',
    expiry_date: '',
    status: 'Applied',
    project_id: '',
    issuing_authority: '',
    description: '',
    notes: '',
    documents: []
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Permit, string>>>({});

  useEffect(() => {
    if (permit) {
      setFormData({
        ...permit,
        documents: permit.documents || []
      });
    } else {
      setFormData({
        permit_type: 'Building Permit',
        permit_number: '',
        issued_date: '',
        expiry_date: '',
        status: 'Applied',
        project_id: '',
        issuing_authority: '',
        description: '',
        notes: '',
        documents: []
      });
    }
    setErrors({});
  }, [permit, isOpen]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Permit, string>> = {};
    if (!formData.permit_number.trim()) newErrors.permit_number = 'Permit number is required';
    if (!formData.issued_date) newErrors.issued_date = 'Issued date is required';
    if (!formData.expiry_date) newErrors.expiry_date = 'Expiry date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      {/* Backdrop Glassmorphism Overlay */}
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Right Drawer Panel Sheet */}
      <div className="absolute top-0 right-0 h-full w-full sm:w-[460px] bg-white/95 backdrop-blur-md border-l border-slate-200/50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 text-sm text-slate-900">
        
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
          <h2 className="text-xl font-bold text-slate-900">
            {permit ? 'Edit Regulatory Permit' : 'Register New Permit'}
          </h2>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Scrollable Form Fields Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* Linked Project ID */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Linked Project ID</label>            <input
              type="text"
              name="project_id"
              value={formData.project_id || ''}
              onChange={handleChange}
              placeholder="PROJ-9902"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
            />
          </div>

          {/* Permit Number */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Permit ID / Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="permit_number"
              value={formData.permit_number}
              onChange={handleChange}
              placeholder="E.g., KDA-BR-2026-88"
              className={`w-full px-3 py-2 border rounded-lg outline-none transition-all ${
                errors.permit_number ? 'border-red-500 bg-red-50/50' : 'border-slate-200 focus:border-blue-500'
              }`}
            />
            {errors.permit_number && (
              <p className="text-red-500 text-xs font-medium mt-1 flex items-center gap-1">
                <FiAlertCircle size={12} /> {errors.permit_number}
              </p>
            )}
          </div>

          {/* Permit Type & Current Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Permit Type</label>
              <select
                name="permit_type"
                value={formData.permit_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white outline-none focus:border-blue-500"
              >
                <option value="Building Permit">Building Permit</option>                <option value="Environmental Permit">Environmental</option>                <option value="Zoning Variance">Zoning Variance</option>                <option value="Occupancy Certificate">Occupancy Cert</option>              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white outline-none focus:border-blue-500"
              >
                <option value="Applied">Applied</option>
                <option value="Approved">Approved</option>
                <option value="Active">Active</option>
                <option value="Expired">Expired</option>                <option value="Suspended">Suspended</option>                <option value="Revoked">Revoked</option>              </select>
            </div>
          </div>

          {/* Issuing Authority */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Issuing Authority</label>
            <input
              type="text"
              name="issuing_authority"
              value={formData.issuing_authority || ''}
              onChange={handleChange}
              placeholder="E.g., Sindh Building Control Authority (SBCA)"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
            />
          </div>

          {/* Validity Timeline Ranges */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Issued Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="issued_date"
                value={formData.issued_date ? formData.issued_date.split('T')[0] : ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg outline-none ${
                  errors.issued_date ? 'border-red-500' : 'border-slate-200 focus:border-blue-500'
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Expiry Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="expiry_date"
                value={formData.expiry_date ? formData.expiry_date.split('T')[0] : ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg outline-none ${
                  errors.expiry_date ? 'border-red-500' : 'border-slate-200 focus:border-blue-500'
                }`}
              />
            </div>
          </div>

          {/* Description details */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Scope / Description</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              placeholder="Enter compliance rules description..."
              rows={2}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Regulatory Notes</label>
            <textarea
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              placeholder="Enter special legal directives or compliance milestones..."
              rows={2}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 grid grid-cols-2 gap-3 bg-white/50">
          <button
            onClick={onClose}
            className="w-full py-2.5 border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 shadow-md shadow-blue-100"
          >
            {loading ? 'Processing...' : 'Save Permit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermitModal;