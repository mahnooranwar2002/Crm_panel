'use client'

import React from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import Link from 'next/link'

export default function ScoringModelDetailPage({ params }: { params: { id: string } }) {
  const model = {
    id: params.id,
    name: 'Sales-Ready Lead Model',
    threshold: 60,
    description: 'Identifies leads that are ready for sales team engagement',
    rules: [
      { criteria: 'Email opens', points: 5, weight: 'High' },
      { criteria: 'Link clicks', points: 10, weight: 'High' },
      { criteria: 'Demo request', points: 20, weight: 'Critical' },
      { criteria: 'Company size >100', points: 8, weight: 'Medium' },
      { criteria: 'Industry: Technology', points: 10, weight: 'High' },
      { criteria: 'LinkedIn profile', points: 5, weight: 'Low' },
      { criteria: 'Content download', points: 8, weight: 'Medium' },
      { criteria: 'Page views >5', points: 6, weight: 'Medium' },
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Link href="/marketing/lead-scoring/models" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
          <FaArrowLeft size={18} />
          Back to Models
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{model.name}</h1>
          <p className="text-slate-600">{model.description}</p>
        </div>

        {/* Threshold */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Sales-Ready Threshold</h2>
          <div className="flex items-center gap-4">
            <div className="text-5xl font-bold text-blue-600">{model.threshold}</div>
            <div className="text-slate-600">
              <p className="font-medium">Points required for lead to be marked as SQL</p>
              <p className="text-sm">Sales qualified lead - ready for sales team</p>
            </div>
          </div>
        </div>

        {/* Scoring Rules */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Scoring Rules</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Criteria</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Points</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Weight</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Description</th>
                </tr>
              </thead>
              <tbody>
                {model.rules.map((rule, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-900">{rule.criteria}</td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                        +{rule.points}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          rule.weight === 'Critical'
                            ? 'bg-red-100 text-red-700'
                            : rule.weight === 'High'
                              ? 'bg-orange-100 text-orange-700'
                              : rule.weight === 'Medium'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {rule.weight}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-600 text-sm">Auto-calculated</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-200">
            <p className="text-sm text-slate-600">
              Total possible score: <span className="font-semibold text-slate-900">100 points</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}