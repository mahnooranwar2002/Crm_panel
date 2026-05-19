'use client'

import React, { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiLoader, FiEye } from 'react-icons/fi'
import { Workflow, WorkflowsService } from '@/src/services/marketing/WorkflowsService'

const emptyWorkflow: Workflow = {
  workflow_name: '',
  description: '',
  status: 'Draft',
  trigger_type: 'Lead-Creation',
  action_type: 'Email',
  total_contacts: 0,
  processed_contacts: 0,
  successful_actions: 0,
  failed_actions: 0,
  automation_efficiency: 0,
  created_by: 'Current User',
  created_date: new Date().getTime(),
  notes: '',
}

const WorkflowsTable = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Workflow>(emptyWorkflow)
  const [submitting, setSubmitting] = useState(false)
  const [viewingWorkflow, setViewingWorkflow] = useState<Workflow | null>(null)

  useEffect(() => { fetchWorkflows() }, [])

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [showModal])

  const fetchWorkflows = async () => {
    try {
      setLoading(true)
      const data = await WorkflowsService.getAllWorkflows()
      setWorkflows(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (isEditing && formData._id) {
        await WorkflowsService.updateWorkflow(formData._id, formData)
      } else {
        await WorkflowsService.createWorkflow(formData)
      }
      await fetchWorkflows()
      setShowModal(false)
    } catch (err) {
      alert('Failed to save')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this workflow?')) {
      try {
        await WorkflowsService.deleteWorkflow(id)
        await fetchWorkflows()
      } catch (err) {
        alert('Failed to delete')
      }
    }
  }

  const getStatusColor = (status: Workflow['status']) => {
    const colors: { [key: string]: string } = {
      'Draft': 'bg-slate-50 text-slate-600',
      'Active': 'bg-green-50 text-green-600',
      'Paused': 'bg-orange-50 text-orange-600',
      'Completed': 'bg-blue-50 text-blue-600',
    }
    return colors[status] || 'bg-slate-50 text-slate-600'
  }

  const inputBase = "w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all placeholder:text-slate-400 bg-white"

  if (loading) {
    return <div className="p-8 text-center"><FiLoader className="animate-spin text-3xl text-slate-400" /></div>
  }

  return (
    <div className="p-8 max-w-7xl mx-auto text-slate-800">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black">Workflows</h1>
          <p className="text-slate-500 text-sm">Automate marketing processes and actions</p>
        </div>
        <button
          onClick={() => { setFormData(emptyWorkflow); setIsEditing(false); setShowModal(true); }}
          className="bg-[#21a9ff] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-100 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <FiPlus /> New Workflow
        </button>
      </div>

      {/* Workflows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {workflows.map(workflow => (
          <div key={workflow._id} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <span className={`${getStatusColor(workflow.status)} px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest`}>{workflow.status}</span>
              <span className="text-xs text-slate-500">{workflow.trigger_type}</span>
            </div>
            <h3 className="font-bold text-lg mb-2">{workflow.workflow_name}</h3>
            {workflow.description && <p className="text-sm text-slate-500 mb-4">{workflow.description}</p>}
            <div className="space-y-2 text-sm mb-6">
              <p><span className="text-slate-500">Action:</span> <span className="font-semibold">{workflow.action_type}</span></p>
              <p><span className="text-slate-500">Total Contacts:</span> <span className="font-semibold">{workflow.total_contacts}</span></p>
              <p><span className="text-slate-500">Processed:</span> <span className="font-semibold text-green-600">{workflow.processed_contacts}</span></p>
              <p><span className="text-slate-500">Efficiency:</span> <span className="font-semibold text-blue-600">{workflow.automation_efficiency.toFixed(1)}%</span></p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setFormData(workflow); setIsEditing(true); setShowModal(true); }}
                className="flex-1 py-2.5 bg-slate-50 rounded-xl flex justify-center text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <FiEdit2 />
              </button>
              <button
                onClick={() => workflow._id && handleDelete(workflow._id)}
                className="flex-1 py-2.5 bg-slate-50 rounded-xl flex justify-center text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <FiTrash2 />
              </button>
              <button
                onClick={() => setViewingWorkflow(workflow)}
                className="flex-1 py-2.5 bg-slate-50 rounded-xl flex justify-center text-slate-500 hover:bg-green-50 hover:text-green-600 transition-colors"
              >
                <FiEye size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ///////////////////// */}
      {/* VIEW DETAILS SIDEBAR */}
      {viewingWorkflow && (
        <>
          <div
            className="fixed inset-0 z-[998] bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setViewingWorkflow(null)}
          />
          <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl z-[999] animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h2 className="text-2xl font-black text-slate-800">{viewingWorkflow.workflow_name}</h2>
                <button
                  onClick={() => setViewingWorkflow(null)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
                  type="button"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${getStatusColor(viewingWorkflow.status)}`}>
                  {viewingWorkflow.status}
                </span>
              </div>

              <p className="text-slate-500 font-medium">Created by {viewingWorkflow.created_by}</p>


              {viewingWorkflow.description && (
                <p className="text-sm text-slate-600 mb-6 bg-slate-50 p-3 rounded-xl">{viewingWorkflow.description}</p>
              )}

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/50 p-6 rounded-[2rem] border border-white shadow-sm">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Trigger Type</p>
                  <p className="text-lg font-black text-blue-600">{viewingWorkflow.trigger_type}</p>
                </div>
                <div className="bg-white/50 p-6 rounded-[2rem] border border-white shadow-sm flex flex-col justify-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Action Type</p>
                  <p className="text-lg font-black text-slate-700">{viewingWorkflow.action_type}</p>
                </div>
              </div>

              <div className="space-y-4 px-2 border-t border-slate-100 pt-6">
                <div className="flex justify-between items-center py-2">
                  <div className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Total Contacts</div>
                  <div className="font-black text-slate-700">{viewingWorkflow.total_contacts}</div>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Processed Contacts</div>
                  <div className="font-black text-green-600">{viewingWorkflow.processed_contacts}</div>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Successful Actions</div>
                  <div className="font-black text-blue-600">{viewingWorkflow.successful_actions}</div>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Failed Actions</div>
                  <div className="font-black text-red-600">{viewingWorkflow.failed_actions}</div>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Automation Efficiency</div>
                  <div className="font-black text-purple-600">{viewingWorkflow.automation_efficiency.toFixed(1)}%</div>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Created Date</div>
                  <div className="font-black text-slate-700">{new Date(viewingWorkflow.created_date).toLocaleDateString()}</div>
                </div>
                {viewingWorkflow.notes && (
                  <div className="mt-4 bg-slate-50 p-4 rounded-2xl italic text-sm text-slate-600">“{viewingWorkflow.notes}”</div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      {/* ///////////////////// */}

      {/* Modal */}
      {showModal && (
        <>
          <div
            className="fixed inset-0 z-[9998] bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowModal(false)}
          />

          <form
            onSubmit={handleSubmit}
            className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl z-[9999] animate-in slide-in-from-right duration-300 overflow-y-auto"
          >
            <div className="p-8 pb-4 flex justify-between items-center border-b border-slate-100">
              <h2 className="text-2xl font-black text-slate-800">{isEditing ? 'Edit' : 'Create'} Workflow</h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="px-8 pb-8 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">Workflow Name</label>
                <input
                  type="text"
                  name="workflow_name"
                  value={formData.workflow_name}
                  onChange={handleInputChange}
                  className={inputBase}
                  placeholder="Workflow name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  className={`${inputBase} resize-none`}
                  rows={2}
                  placeholder="Describe the workflow..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className={inputBase}>
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                    <option value="Paused">Paused</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Trigger Type</label>
                  <select name="trigger_type" value={formData.trigger_type} onChange={handleInputChange} className={inputBase}>
                    <option value="Lead-Creation">Lead Creation</option>
                    <option value="Form-Submission">Form Submission</option>
                    <option value="Tag-Added">Tag Added</option>
                    <option value="Time-Based">Time-Based</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Action Type</label>
                  <select name="action_type" value={formData.action_type} onChange={handleInputChange} className={inputBase}>
                    <option value="Email">Email</option>
                    <option value="SMS">SMS</option>
                    <option value="Task">Task</option>
                    <option value="Tag">Tag</option>
                    <option value="Multi-Step">Multi-Step</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Total Contacts</label>
                  <input
                    type="number"
                    name="total_contacts"
                    value={formData.total_contacts}
                    onChange={handleInputChange}
                    className={inputBase}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Processed</label>
                  <input
                    type="number"
                    name="processed_contacts"
                    value={formData.processed_contacts}
                    onChange={handleInputChange}
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Success</label>
                  <input
                    type="number"
                    name="successful_actions"
                    value={formData.successful_actions}
                    onChange={handleInputChange}
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Failed</label>
                  <input
                    type="number"
                    name="failed_actions"
                    value={formData.failed_actions}
                    onChange={handleInputChange}
                    className={inputBase}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">Automation Efficiency %</label>
                <input
                  type="number"
                  step="0.1"
                  name="automation_efficiency"
                  value={formData.automation_efficiency}
                  onChange={handleInputChange}
                  className={inputBase}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className={`${inputBase} resize-none`}
                  rows={3}
                  placeholder="Add any notes..."
                />
              </div>
            </div>

            <div className="p-8 pt-4 bg-slate-50 border-t border-slate-100 flex gap-3 sticky bottom-0">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 px-6 py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 rounded-xl font-semibold bg-[#21a9ff] text-white hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {submitting && <FiLoader className="animate-spin" />}
                Save Workflow
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  )
}

export default WorkflowsTable
