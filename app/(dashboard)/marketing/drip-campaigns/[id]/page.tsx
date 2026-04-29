'use client'

import React from 'react'
import { FaArrowLeft, FaEdit, FaRegEnvelope, FaUsers, FaChartLine } from 'react-icons/fa'
import Link from 'next/link'

export default function DripCampaignDetailPage({ params }: { params: { id: string } }) {
  const sequence = {
    id: params.id,
    name: 'Welcome Email Series',
    status: 'Active',
    trigger: 'New lead added',
    totalEnrolled: 450,
    completed: 125,
    unsubscribed: 8,
    conversionRate: 28,
    emails: [
      { day: 0, subject: 'Welcome!', openRate: 45, clickRate: 12 },
      { day: 1, subject: 'Product Overview', openRate: 38, clickRate: 8 },
      { day: 3, subject: 'Case Study', openRate: 32, clickRate: 10 },
      { day: 5, subject: 'Special Offer', openRate: 40, clickRate: 15 },
      { day: 7, subject: 'Final Follow-up', openRate: 28, clickRate: 5 },
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Link href="/marketing/drip-campaigns" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
          <FaArrowLeft size={18} />
          Back to Drip Campaigns
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{sequence.name}</h1>
            <p className="text-slate-600">Trigger: {sequence.trigger}</p>
          </div>
          <Link
            href={`/marketing/drip-campaigns/${sequence.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaEdit size={18} />
            Edit
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Status', value: sequence.status, icon: FaRegEnvelope },
            { label: 'Enrolled', value: sequence.totalEnrolled, icon: FaUsers },
            { label: 'Conversion Rate', value: `${sequence.conversionRate}%`, icon: FaChartLine },
            { label: 'Completed', value: sequence.completed, icon: FaRegEnvelope },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
                  <Icon size={24} className="text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            )
          })}
        </div>

        {/* Email Sequence */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Email Sequence</h2>
          <div className="space-y-4">
            {sequence.emails.map((email, index) => (
              <div key={index} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-slate-900">Email {index + 1}</h3>
                    <p className="text-sm text-slate-600">{email.subject}</p>
                    <p className="text-sm text-slate-500 mt-1">Day {email.day}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    Day {email.day}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Open Rate</p>
                    <p className="text-xl font-semibold text-slate-900">{email.openRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Click Rate</p>
                    <p className="text-xl font-semibold text-slate-900">{email.clickRate}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}