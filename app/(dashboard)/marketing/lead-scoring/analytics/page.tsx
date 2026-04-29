'use client'

import React from 'react'
import { FaArrowLeft, FaChartBar, FaChartLine } from 'react-icons/fa'
import Link from 'next/link'

export default function ScoringAnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Link href="/marketing/lead-scoring" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
          <FaArrowLeft size={18} />
          Back to Lead Scoring
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Scoring Analytics</h1>
          <p className="text-slate-600">Analyze lead scoring performance and model effectiveness</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Leads Scored', value: '1,900' },
            { label: 'Avg. Lead Score', value: '64' },
            { label: 'SQL Conversion', value: '28%' },
            { label: 'Model Accuracy', value: '94%' },
          ].map((metric) => (
            <div key={metric.label} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <p className="text-slate-600 text-sm font-medium mb-2">{metric.label}</p>
              <p className="text-3xl font-bold text-slate-900">{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Score Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <FaChartBar size={22} className="text-blue-600" />
              Score Distribution
            </h2>
            <div className="space-y-4">
              {[
                { range: '0-20 (Cold)', count: 320, percentage: 17 },
                { range: '21-40 (Warm)', count: 450, percentage: 24 },
                { range: '41-60 (Hot)', count: 580, percentage: 31 },
                { range: '61-80 (SQL)', count: 420, percentage: 22 },
                { range: '81-100 (Very Hot)', count: 130, percentage: 6 },
              ].map((item) => (
                <div key={item.range}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-700 font-medium">{item.range}</span>
                    <span className="text-slate-600 text-sm">{item.count} leads</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conversion Rates */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <FaChartLine size={22} className="text-green-600" />
              Conversion by Score Range
            </h2>
            <div className="space-y-4">
              {[
                { range: '0-20', conversionRate: 2 },
                { range: '21-40', conversionRate: 5 },
                { range: '41-60', conversionRate: 15 },
                { range: '61-80', conversionRate: 35 },
                { range: '81-100', conversionRate: 68 },
              ].map((item) => (
                <div key={item.range}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-700 font-medium">Score {item.range}</span>
                    <span className="text-slate-600 text-sm font-medium">{item.conversionRate}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${item.conversionRate}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Model Performance */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Model Performance Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Model</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Leads Scored</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Conversion Rate</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Sales-Ready Lead Model', status: 'Active', leads: 1250, conversion: 28, accuracy: 94 },
                  { name: 'Enterprise Model', status: 'Active', leads: 450, conversion: 35, accuracy: 96 },
                  { name: 'SMB Model', status: 'Testing', leads: 200, conversion: 22, accuracy: 91 },
                ].map((model) => (
                  <tr key={model.name} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-900">{model.name}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          model.status === 'Active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {model.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-900 font-medium">{model.leads.toLocaleString()}</td>
                    <td className="py-4 px-6 text-slate-900 font-medium">{model.conversion}%</td>
                    <td className="py-4 px-6 text-slate-900 font-medium">{model.accuracy}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}