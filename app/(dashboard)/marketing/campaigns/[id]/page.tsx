'use client'

import React from 'react'
import { CgMoreVerticalR } from "react-icons/cg";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { FiEdit2 } from 'react-icons/fi';
import { FaMailBulk } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { PiTrendUpDuotone } from "react-icons/pi";
import { IoCalendar } from "react-icons/io5";
import Link from 'next/link'

export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  // Mock data - in real app, fetch based on params.id
  const campaign = {
    id: params.id,
    name: 'Welcome Email Series',
    type: 'Drip',
    status: 'Active',
    description: 'Automated welcome sequence for new leads',
    createdAt: '2026-04-15',
    recipients: 450,
    sent: 450,
    openRate: 32,
    clickRate: 8,
    bounceRate: 2,
    unsubscribeRate: 0.5,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Link href="/marketing/campaigns" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
          <MdOutlineKeyboardArrowLeft size={20} />
          Back to Campaigns
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{campaign.name}</h1>
            <p className="text-slate-600">{campaign.description}</p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/marketing/campaigns/${campaign.id}/edit`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiEdit2 size={20} />
              Edit
            </Link>
            <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
              <CgMoreVerticalR size={20} className="text-slate-600" />
            </button>
          </div>
        </div>

        {/* Campaign Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Status', value: campaign.status, icon: FaMailBulk, color: 'bg-green-100 text-green-600' },
            { label: 'Recipients', value: campaign.recipients, icon: FaUsers, color: 'bg-blue-100 text-blue-600' },
            { label: 'Open Rate', value: `${campaign.openRate}%`, icon: PiTrendUpDuotone, color: 'bg-purple-100 text-purple-600' },
            { label: 'Click Rate', value: `${campaign.clickRate}%`, icon: FaMailBulk, color: 'bg-orange-100 text-orange-600' },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon size={20} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            )
          })}
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Detailed Metrics */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Performance Metrics</h2>
            <div className="space-y-4">
              {[
                { label: 'Sent', value: campaign.sent },
                { label: 'Opened', value: Math.round((campaign.sent * campaign.openRate) / 100) },
                { label: 'Clicked', value: Math.round((campaign.sent * campaign.clickRate) / 100) },
                { label: 'Bounced', value: Math.round((campaign.sent * campaign.bounceRate) / 100) },
                { label: 'Unsubscribed', value: Math.round((campaign.sent * campaign.unsubscribeRate) / 100) },
              ].map((metric) => (
                <div key={metric.label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <span className="text-slate-700 font-medium">{metric.label}</span>
                  <span className="text-slate-900 font-semibold">{metric.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Campaign Timeline</h2>
            <div className="space-y-6">
              {[
                { status: 'Created', date: campaign.createdAt, icon: FaMailBulk },
                { status: 'Scheduled', date: '2026-04-20', icon: IoCalendar },
                { status: 'Active', date: '2026-04-21', icon: PiTrendUpDuotone },
              ].map((event, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <event.icon size={20} className="text-blue-600" />
                    </div>
                    {index < 2 && <div className="w-0.5 h-12 bg-blue-200 mt-2"></div>}
                  </div>
                  <div className="pt-2">
                    <p className="font-semibold text-slate-900">{event.status}</p>
                    <p className="text-slate-600 text-sm">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Email Template Preview */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Email Preview</h2>
          <div className="bg-slate-50 rounded-lg p-8 border border-slate-200">
            <p className="text-slate-600 text-center italic">Email template preview would display here</p>
          </div>
        </div>
      </div>
    </div>
  )
}
