'use client'

import React, { useState } from 'react'
import { FiArrowLeft, FiSearch, FiFilter, FiDownload } from 'react-icons/fi'
import Link from 'next/link'

export default function SocialLeadsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const leads = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@company.com',
      company: 'Tech Solutions Inc',
      source: 'Facebook',
      date: '2026-04-22',
      status: 'New',
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@business.com',
      company: 'Digital Agency',
      source: 'Instagram',
      date: '2026-04-21',
      status: 'Contacted',
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike.chen@startup.io',
      company: 'StartUp Co',
      source: 'Facebook',
      date: '2026-04-20',
      status: 'New',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Link href="/marketing/social-integration" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
          <FiArrowLeft size={20} />
          Back to Social Integration
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Imported Social Leads</h1>
            <p className="text-slate-600">View and manage leads imported from social media platforms</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <FiDownload size={20} />
            Export
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-3 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
            <FiFilter size={20} />
            Filter
          </button>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Name</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Email</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Company</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Source</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Date</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {leads
                  .filter((lead) => lead.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((lead) => (
                    <tr key={lead.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-6 font-medium text-slate-900">{lead.name}</td>
                      <td className="py-4 px-6 text-slate-600">{lead.email}</td>
                      <td className="py-4 px-6 text-slate-600">{lead.company}</td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {lead.source}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-600 text-sm">{lead.date}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            lead.status === 'New'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {lead.status}
                        </span>
                      </td>
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
