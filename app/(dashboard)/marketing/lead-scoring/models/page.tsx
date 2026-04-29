'use client'

import React from 'react'
import { FaArrowLeft, FaPlus, FaEdit } from 'react-icons/fa'
import Link from 'next/link'

export default function ScoringModelsPage() {
  const models = [
    {
      id: 1,
      name: 'Sales-Ready Lead Model',
      threshold: 60,
      rules: 8,
      leadsQualified: 350,
    },
    {
      id: 2,
      name: 'Enterprise Model',
      threshold: 70,
      rules: 10,
      leadsQualified: 125,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Link href="/marketing/lead-scoring" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
          <FaArrowLeft size={18} />
          Back to Lead Scoring
        </Link>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Scoring Models</h1>
          <Link
            href="/marketing/lead-scoring/models"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus size={16} />
            Create Model
          </Link>
        </div>

        {/* Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {models.map((model) => (
            <div key={model.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">{model.name}</h2>
                <Link
                  href={`/marketing/lead-scoring/models/${model.id}`}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-blue-600"
                >
                  <FaEdit size={18} />
                </Link>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-slate-50">
                  <span className="text-slate-600">Sales-Ready Threshold</span>
                  <span className="font-semibold text-slate-900">{model.threshold} points</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-50">
                  <span className="text-slate-600">Scoring Rules</span>
                  <span className="font-semibold text-slate-900">{model.rules}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-600">Leads Qualified</span>
                  <span className="font-semibold text-slate-900">{model.leadsQualified.toLocaleString()}</span>
                </div>
              </div>

              <Link
                href={`/marketing/lead-scoring/models/${model.id}`}
                className="block w-full mt-6 py-2 px-4 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-center"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}