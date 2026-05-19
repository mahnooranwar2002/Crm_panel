'use client'

import React, { useState, useEffect } from 'react'
import { FiX, FiAlertCircle, FiPlus, FiTrash2 } from 'react-icons/fi'

interface Finding {
  issue: string
  severity: string
  status: string
  solution: string
}

interface Inspection {
  _id?: string
  project_id?: string
  inspection_date: string
  inspector_name?: string
  inspection_type: string
  passed: boolean
  status: string
  findings?: Finding[]
  notes?: string
  photo_urls?: string[]
}

interface InspectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (inspection: Inspection) => void
  inspection?: Inspection
  loading?: boolean
}

const InspectionModal: React.FC<InspectionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  inspection,
  loading = false
}) => {
  const [formData, setFormData] = useState<Inspection>({
    inspection_date: '',
    inspection_type: 'Safety',
    passed: true,
    status: 'Pending',
    project_id: '',
    inspector_name: '',
    notes: '',
    findings: [],
    photo_urls: []
  })

  const [errors, setErrors] = useState<Partial<Record<keyof Inspection, string>>>({})

  useEffect(() => {
    if (inspection) {
      setFormData({
        ...inspection,
        findings: inspection.findings || [],
        photo_urls: inspection.photo_urls || []
      })
    } else {
      setFormData({
        inspection_date: new Date().toISOString().split('T')[0],
        inspection_type: 'Safety',
        passed: true,
        status: 'Pending',
        project_id: '',
        inspector_name: '',
        notes: '',
        findings: [],
        photo_urls: []
      })
    }
    setErrors({})
  }, [inspection, isOpen])

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Inspection, string>> = {}
    if (!formData.inspection_date) newErrors.inspection_date = 'Inspection date is required'
    if (!formData.inspection_type) newErrors.inspection_type = 'Inspection type is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  // Findings Dynamic Field Trackers
  const addFinding = () => {
    setFormData(prev => ({
      ...prev,
      findings: [...(prev.findings || []), { issue: '', severity: 'Medium', status: 'Open', solution: '' }]
    }))
  }

  const removeFinding = (index: number) => {
    setFormData(prev => ({
      ...prev,
      findings: (prev.findings || []).filter((_, i) => i !== index)
    }))
  }

  const handleFindingChange = (index: number, field: keyof Finding, value: string) => {
    setFormData(prev => {
      const updated = [...(prev.findings || [])]
      updated[index] = { ...updated[index], [field]: value }
      return { ...prev, findings: updated }
    })
  }

  const handleSubmit = () => {
    if (validate()) {
      onSave(formData)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      {/* Dim Overlay Glassmorphism Layer */}
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Right Oriented Action Sidebar Panel Sheet */}
      <div className="absolute top-0 right-0 h-full w-full sm:w-[500px] bg-white/95 backdrop-blur-md border-l border-slate-200/50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 text-sm text-slate-900">
        
        {/* Panel Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
          <h2 className="text-xl font-bold text-slate-900">
            {inspection ? 'Edit Inspection Report' : 'Log New Inspection'}
          </h2>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Form Body Fields (Scrollable Layout View) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* Linked Project ID */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Linked Project ID</label>
            <input
              type="text"
              name="project_id"
              value={formData.project_id || ''}
              onChange={handleChange}
              placeholder="PROJ-10045"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
            />
          </div>

          {/* Inspector Audit Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Inspector Auditor Name</label>
            <input
              type="text"
              name="inspector_name"
              value={formData.inspector_name || ''}
              onChange={handleChange}
              placeholder="E.g., Engr. Sarah Khan"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
            />
          </div>

          {/* Inspection Date */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Inspection Audit Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="inspection_date"
              value={formData.inspection_date ? formData.inspection_date.split('T')[0] : ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg outline-none ${
                errors.inspection_date ? 'border-red-500' : 'border-slate-200 focus:border-blue-500'
              }`}
            />
          </div>

          {/* Type & Workflow Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Inspection Type</label>
              <select
                name="inspection_type"
                value={formData.inspection_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white outline-none focus:border-blue-500"
              >
                <option value="Safety">Safety</option>
                <option value="Quality">Quality Control</option>
                <option value="Structural">Structural</option>
                <option value="Environmental">Environmental</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Workflow Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white outline-none focus:border-blue-500"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Failed">Failed</option>
                <option value="Reopened">Reopened</option>
              </select>
            </div>
          </div>

          {/* Compliance Status Checkbox Toggle */}
          <div className="py-2">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                name="passed"
                checked={formData.passed}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-bold text-slate-800">Inspection Overall Passed</span>
                <p className="text-xs text-slate-400 font-medium">Uncheck if major site violations were spotted</p>
              </div>
            </label>
          </div>

          {/* Audit Observations Description Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">General Audit Notes</label>
            <textarea
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              placeholder="Enter safety audit overview statements..."
              rows={2}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Dynamic Photo Media URLs Section */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Media Photo URLs (Line Separated)</label>
            <textarea
              value={formData.photo_urls?.join('\n') || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, photo_urls: e.target.value.split('\n').filter(u => u.trim()) }))}
              placeholder="https://example.com/site-img1.jpg"
              rows={2}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 font-mono text-xs resize-none"
            />
          </div>

          {/* Structural Audit Findings Section */}
          <div className="border-t border-slate-100 pt-4">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700">Specific Discovered Findings ({formData.findings?.length || 0})</label>
              <button 
                onClick={addFinding}
                className="text-xs flex items-center gap-1 text-blue-600 font-bold bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors"
              >
                <FiPlus size={14} /> Add Finding
              </button>
            </div>

            <div className="space-y-3">
              {formData.findings?.map((finding, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 relative group">
                  <button 
                    onClick={() => removeFinding(idx)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <FiTrash2 size={14} />
                  </button>
                  
                  <div>
                    <input 
                      type="text"
                      placeholder="Issue Description (e.g., Missing Scaffolding Guardrails)"
                      value={finding.issue}
                      onChange={(e) => handleFindingChange(idx, 'issue', e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-200 bg-white rounded-md text-xs outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={finding.severity}
                      onChange={(e) => handleFindingChange(idx, 'severity', e.target.value)}
                      className="w-full px-2 py-1.5 border border-slate-200 bg-white rounded-md text-xs outline-none"
                    >
                      <option value="Low">Low Severity</option>
                      <option value="Medium">Medium Severity</option>
                      <option value="High">High Severity</option>
                      <option value="Critical">Critical Breach</option>
                    </select>
                    <input 
                      type="text"
                      placeholder="Proposed Solution"
                      value={finding.solution}
                      onChange={(e) => handleFindingChange(idx, 'solution', e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-200 bg-white rounded-md text-xs outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Drawer Action Sheet Footer Controls */}
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
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default InspectionModal