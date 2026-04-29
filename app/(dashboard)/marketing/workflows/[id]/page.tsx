'use client'

import React from 'react'
import { FaArrowLeft, FaEdit } from 'react-icons/fa'
import Link from 'next/link'

export default function WorkflowDetailPage({ params }: { params: { id: string } }) {
  const workflow = {
    id: params.id,
    name: 'Lead Nurture Workflow',
    description: 'Automatically nurtures new leads through email campaigns',
    status: 'Active',
    trigger: 'new_lead_added',
    totalExecutions: 250,
    successRate: 98,
    steps: [
      { order: 1, type: 'Trigger', action: 'New Lead Added' },
      { order: 2, type: 'Condition', action: 'Check if lead score > 40' },
      { order: 3, type: 'Action', action: 'Send Welcome Email' },
      { order: 4, type: 'Action', action: 'Add "Prospect" Tag' },
      { order: 5, type: 'Action', action: 'Enroll in Drip Campaign' },
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Link href="/marketing/workflows" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
          <FaArrowLeft size={16} />
          Back to Workflows
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{workflow.name}</h1>
            <p className="text-slate-600">{workflow.description}</p>
          </div>
          <Link
            href={`/marketing/workflows/${workflow.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaEdit size={16} />
            Edit
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Status', value: workflow.status },
            { label: 'Total Executions', value: workflow.totalExecutions },
            { label: 'Success Rate', value: `${workflow.successRate}%` },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <p className="text-slate-600 text-sm font-medium mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Workflow Steps */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Workflow Steps</h2>

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 top-8 bottom-0 w-0.5 bg-blue-200"></div>

            {/* Steps */}
            <div className="space-y-6">
              {workflow.steps.map((step) => (
                <div key={step.order} className="flex gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg z-10 relative shadow-lg shadow-blue-200">
                    {step.order}
                  </div>
                  <div className="flex-1 pt-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{step.type}</p>
                    <p className="text-lg font-semibold text-slate-900 mt-1">{step.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trigger Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Trigger Configuration</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <span className="text-slate-700 font-medium text-sm">Event Type</span>
              <span className="text-slate-900 font-mono font-semibold bg-slate-100 px-2 py-1 rounded text-xs">{workflow.trigger}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-slate-700 font-medium text-sm">Status</span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}