'use client'

import React, { useState, useEffect } from 'react'
import { FiX, FiAlertCircle } from 'react-icons/fi'

interface Task {
  _id?: string
  project_id?: string
  task_id?: string
  task_name: string
  description?: string
  phase: string
  assigned_to?: string
  priority: string
  status: string
  start_date: string
  end_date: string
  progress_percentage?: number
  estimated_hours?: number
  actual_hours?: number
  notes?: string
}

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (task: Task) => void
  task?: Task
  loading?: boolean
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  task,
  loading = false
}) => {
  const [formData, setFormData] = useState<Task>({
    task_name: '',
    phase: '',
    priority: 'Medium',
    status: 'Not_Started',
    start_date: '',
    end_date: '',
    progress_percentage: 0,
    description: '',
    notes: '',
    assigned_to: '',
    estimated_hours: 0,
    actual_hours: 0
  })

  const [errors, setErrors] = useState<Partial<Record<keyof Task, string>>>({})

  useEffect(() => {
    if (task) {
      setFormData(task)
    } else {
      setFormData({
        task_name: '',
        phase: '',
        priority: 'Medium',
        status: 'Not_Started',
        start_date: '',
        end_date: '',
        progress_percentage: 0,
        description: '',
        notes: '',
        assigned_to: '',
        estimated_hours: 0,
        actual_hours: 0
      })
    }
    setErrors({})
  }, [task, isOpen])

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Task, string>> = {}
    if (!formData.task_name) newErrors.task_name = 'Task name is required'
    if (!formData.phase) newErrors.phase = 'Phase selection or name is required'
    if (!formData.start_date) newErrors.start_date = 'Start date is required'
    if (!formData.end_date) newErrors.end_date = 'End date is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }))
  }

  const handleSubmit = () => {
    if (validate()) {
      onSave(formData)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      {/* Dim Overlay Backdrop Layer with Premium Glassmorphism */}
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Right Aligned Task Sidebar Panel Sheet Layout */}
      <div className="absolute top-0 right-0 h-full w-full sm:w-[450px] bg-white/95 backdrop-blur-md border-l border-slate-200/50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 text-sm text-slate-900">
        
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
          <h2 className="text-xl font-bold text-slate-900">
            {task ? 'Edit Construction Task' : 'Add New Task'}
          </h2>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Form Fields Body (Scrollable View) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* Task Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Task Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="task_name"
              value={formData.task_name}
              onChange={handleChange}
              placeholder="E.g., Foundation Excavation"
              className={`w-full px-3 py-2 border rounded-lg outline-none transition-all ${
                errors.task_name ? 'border-red-500 bg-red-50/50' : 'border-slate-200 focus:border-blue-500'
              }`}
            />
            {errors.task_name && (
              <p className="text-red-500 text-xs font-medium mt-1 flex items-center gap-1">
                <FiAlertCircle size={12} /> {errors.task_name}
              </p>
            )}
          </div>

          {/* Project ID Context Reference */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Linked Project ID</label>
            <input
              type="text"
              name="project_id"
              value={formData.project_id || ''}
              onChange={handleChange}
              placeholder="PROJ-10023"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
            />
          </div>

          {/* Construction Phase & Assigned Personnel */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Phase <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="phase"
                value={formData.phase}
                onChange={handleChange}
                placeholder="Substructure"
                className={`w-full px-3 py-2 border rounded-lg outline-none ${
                  errors.phase ? 'border-red-500' : 'border-slate-200 focus:border-blue-500'
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Assigned To</label>
              <input
                type="text"
                name="assigned_to"
                value={formData.assigned_to || ''}
                onChange={handleChange}
                placeholder="Contractor Team B"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Priority & Status Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white outline-none focus:border-blue-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white outline-none focus:border-blue-500"
              >
                <option value="Not_Started">Not Started</option>
                <option value="In_Progress">In Progress</option>
                <option value="On_Hold">On Hold</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Timeline Range Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date ? formData.start_date.split('T')[0] : ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg outline-none ${
                  errors.start_date ? 'border-red-500' : 'border-slate-200 focus:border-blue-500'
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date ? formData.end_date.split('T')[0] : ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg outline-none ${
                  errors.end_date ? 'border-red-500' : 'border-slate-200 focus:border-blue-500'
                }`}
              />
            </div>
          </div>

          {/* Progress Percentage */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Progress Percentage (%)</label>
            <input
              type="number"
              name="progress_percentage"
              value={formData.progress_percentage || 0}
              onChange={handleChange}
              min="0"
              max="100"
              placeholder="35"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
            />
          </div>

          {/* Working Hours Tracking Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Estimated Hours</label>
              <input
                type="number"
                name="estimated_hours"
                value={formData.estimated_hours || 0}
                onChange={handleChange}
                placeholder="40"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Actual Hours</label>
              <input
                type="number"
                name="actual_hours"
                value={formData.actual_hours || 0}
                onChange={handleChange}
                placeholder="12"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Detailed Specifications Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              placeholder="Excavate and prepare lay down markers for site inspection..."
              rows={2}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Engineering Core Site Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Operational Notes</label>
            <textarea
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              placeholder="Weather alerts might affect foundation drying process..."
              rows={2}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Modal Sheet Action Controls Footer */}
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
            {loading ? 'Saving...' : 'Save Task'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskModal