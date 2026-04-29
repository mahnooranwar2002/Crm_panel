'use client'

import React, { useState } from 'react'
import { FaArrowLeft, FaPlus, FaTrashAlt } from 'react-icons/fa'
import Link from 'next/link'

export default function CreateWorkflowPage() {
  const [steps, setSteps] = useState<
    Array<{ id: number; type: string; action: string; condition?: string }>
  >([{ id: 1, type: 'trigger', action: 'new_lead' }])
  const [nextId, setNextId] = useState(2)

  const addStep = () => {
    setSteps([...steps, { id: nextId, type: 'action', action: '' }])
    setNextId(nextId + 1)
  }

  const removeStep = (id: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter((s) => s.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Link href="/marketing/workflows" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 group transition-all">
          <FaArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Workflows</span>
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 mb-8">Create Workflow</h1>

        {/* Form */}
        <form className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-8" onSubmit={(e) => e.preventDefault()}>
          {/* Workflow Name */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Workflow Name</label>
              <input
                type="text"
                placeholder="e.g., Lead Nurture Workflow"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
              <textarea
                placeholder="Describe what this workflow does..."
                rows={3}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all"
              />
            </div>
          </div>

          {/* Workflow Steps */}
          <div>
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
              <label className="text-lg font-bold text-slate-900">Automation Steps</label>
              <button
                type="button"
                onClick={addStep}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all text-sm font-bold"
              >
                <FaPlus size={14} />
                Add Step
              </button>
            </div>

            <div className="space-y-6 relative">
              {steps.map((step, index) => (
                <div key={step.id} className="relative p-6 border border-slate-200 rounded-xl bg-slate-50/50 hover:border-blue-200 transition-colors">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md shadow-blue-100">
                        {index + 1}
                      </span>
                      <span className="font-bold text-slate-800">Step Detail</span>
                    </div>
                    {steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStep(step.id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-all"
                        title="Remove Step"
                      >
                        <FaTrashAlt size={16} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-wider">Logic Type</label>
                      <select className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer">
                        <option value="trigger">Trigger (Event Start)</option>
                        <option value="action">Action (Execute Task)</option>
                        <option value="condition">Condition (If/Then)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-wider">Perform Action</label>
                      <select className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer">
                        <option>Send Email Campaign</option>
                        <option>Send SMS Notification</option>
                        <option>Apply Segment Tag</option>
                        <option>Increment Lead Score</option>
                        <option>Assign to Sales Rep</option>
                        <option>Create Follow-up Task</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-slate-100">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-200"
            >
              Launch Workflow
            </button>
            <button
              type="button"
              className="px-8 py-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-bold text-slate-600"
            >
              Save as Draft
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}