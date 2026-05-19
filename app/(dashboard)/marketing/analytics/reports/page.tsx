'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { FaDownload } from "react-icons/fa";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { IoFilter } from "react-icons/io5";

export default function CustomReportsPage() {
  const [reportType, setReportType] = useState('summary')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Link href="/marketing/analytics" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
          <MdOutlineKeyboardArrowLeft size={20} />
          Back to Analytics
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Custom Reports</h1>
          <p className="text-slate-600">Create and export custom marketing reports</p>
        </div>

        {/* Report Builder */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Report Builder</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Report Type */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="summary">Campaign Summary</option>
                <option value="detailed">Detailed Analytics</option>
                <option value="roi">ROI Analysis</option>
                <option value="leadScore">Lead Scoring Report</option>
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Date Range</label>
              <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>This month</option>
                <option>This year</option>
              </select>
            </div>

            {/* Campaign Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Campaign</label>
              <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Campaigns</option>
                <option>Welcome Series</option>
                <option>Spring Sale</option>
                <option>Product Update</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
              <IoFilter size={20} />
              Generate Report
            </button>
            <button className="flex items-center gap-2 px-6 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors font-semibold text-slate-900">
              <FaDownload size={20} />
              Export
            </button>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Reports</h2>
          <div className="space-y-3">
            {[
              { name: 'April 2026 Campaign Summary', created: '2026-04-22', status: 'Ready' },
              { name: 'Q1 2026 Performance Report', created: '2026-04-15', status: 'Ready' },
              { name: 'Lead Scoring Accuracy Report', created: '2026-04-10', status: 'Ready' },
            ].map((report) => (
              <div key={report.name} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <div>
                  <p className="font-semibold text-slate-900">{report.name}</p>
                  <p className="text-sm text-slate-600">Created: {report.created}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    {report.status}
                  </span>
                  <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <FaDownload size={18} />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
