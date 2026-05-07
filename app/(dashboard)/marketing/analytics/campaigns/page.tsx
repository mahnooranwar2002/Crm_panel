'use client'

import React from 'react'
import { FaDownload } from "react-icons/fa";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";

import Link from 'next/link'

export default function CampaignAnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Link href="/marketing/analytics" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
          <MdOutlineKeyboardArrowLeft size={20} />
          Back to Analytics
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Campaign Analytics</h1>
            <p className="text-slate-600">Detailed performance metrics for all campaigns</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <FaDownload size={20} />
            Export Report
          </button>
        </div>

        {/* Campaign Comparison */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Campaign Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Campaign</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Type</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Recipients</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Open Rate</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Click Rate</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">Bounce Rate</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-700">ROI</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Welcome Series', type: 'Drip', recipients: 450, openRate: '32%', clickRate: '8%', bounceRate: '2%', roi: '245%' },
                  { name: 'Spring Sale', type: 'Email', recipients: 1200, openRate: '32%', clickRate: '8%', bounceRate: '1.5%', roi: '320%' },
                  { name: 'Product Update', type: 'SMS', recipients: 890, openRate: '48%', clickRate: '15%', bounceRate: '0.5%', roi: '180%' },
                  { name: 'Re-engagement', type: 'Drip', recipients: 320, openRate: '28%', clickRate: '6%', bounceRate: '3%', roi: '150%' },
                ].map((campaign) => (
                  <tr key={campaign.name} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-900">{campaign.name}</td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {campaign.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-600">{campaign.recipients.toLocaleString()}</td>
                    <td className="py-4 px-6 text-slate-600 font-medium">{campaign.openRate}</td>
                    <td className="py-4 px-6 text-slate-600 font-medium">{campaign.clickRate}</td>
                    <td className="py-4 px-6 text-slate-600 font-medium">{campaign.bounceRate}</td>
                    <td className="py-4 px-6 text-green-600 font-semibold">{campaign.roi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Email Performance Trends */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Email Performance Trends</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { metric: 'Avg. Open Rate', value: '34.2%', trend: '+2.5%' },
              { metric: 'Avg. Click Rate', value: '10.3%', trend: '+1.2%' },
              { metric: 'Avg. Bounce Rate', value: '1.8%', trend: '-0.3%' },
              { metric: 'Conversion Rate', value: '2.1%', trend: '+0.8%' },
            ].map((item) => (
              <div key={item.metric} className="p-4 border border-slate-200 rounded-lg">
                <p className="text-sm text-slate-600 mb-2">{item.metric}</p>
                <p className="text-2xl font-bold text-slate-900 mb-1">{item.value}</p>
                <p className="text-sm text-green-600 font-medium">{item.trend}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
