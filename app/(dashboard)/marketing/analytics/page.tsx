'use client'

import React from 'react'
import { PiTrendUpDuotone } from "react-icons/pi";
import { FaChartBar } from "react-icons/fa";
import { FaMailBulk } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";



import Link from 'next/link'

export default function AnalyticsDashboardPage() {
  const stats = [
    { label: 'Total Campaigns', value: '24', icon: FaMailBulk },
    { label: 'Total Leads', value: '1,900', icon: FaUsers },
    { label: 'Avg. Open Rate', value: '34.2%', icon: PiTrendUpDuotone },
    { label: 'Total Revenue', value: '$45,230', icon: FaChartBar },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Marketing Analytics</h1>
          <p className="text-slate-600">View comprehensive marketing performance metrics</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
                  <Icon size={24} className="text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              </div>
            )
          })}
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link href="/marketing/analytics/campaigns" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Campaign Analytics</h2>
            <p className="text-slate-600 mb-4">
              Detailed metrics on email and SMS campaigns including open rates, click rates, and conversion metrics
            </p>
            <span className="text-blue-600 font-medium">View Details →</span>
          </Link>

          <Link href="/marketing/analytics/reports" className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-all">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Custom Reports</h2>
            <p className="text-slate-600 mb-4">
              Create and export custom reports for specific campaigns, time periods, or segments
            </p>
            <span className="text-blue-600 font-medium">Build Report →</span>
          </Link>
        </div>

        {/* Performance Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Campaign Performance Overview</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Campaign</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Sent</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Opens</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Clicks</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Conversions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Welcome Email Series', sent: 450, opens: 144, clicks: 36, conversions: 12 },
                  { name: 'Spring Sale', sent: 1200, opens: 384, clicks: 96, conversions: 28 },
                  { name: 'Product Update', sent: 890, opens: 427, clicks: 134, conversions: 45 },
                ].map((campaign) => (
                  <tr key={campaign.name} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-900">{campaign.name}</td>
                    <td className="py-4 px-6 text-slate-600">{campaign.sent}</td>
                    <td className="py-4 px-6 text-slate-900 font-medium">{campaign.opens}</td>
                    <td className="py-4 px-6 text-slate-900 font-medium">{campaign.clicks}</td>
                    <td className="py-4 px-6 text-slate-900 font-medium">{campaign.conversions}</td>
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
