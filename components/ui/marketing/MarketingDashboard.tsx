'use client'

import React from 'react'
import { 
  FaRegEnvelope, 
  FaUsers, 
  FaChartLine, 
  FaBullhorn, 
  FaRobot, 
  FaChartPie, 
  FaShareAlt,
  FaBolt
} from 'react-icons/fa'
import { HiOutlineChartBar } from 'react-icons/hi'
import Link from 'next/link'

export default function MarketingDashboard() {
  // Sample statistics
  const stats = [
    {
      label: 'Total Campaigns',
      value: '24',
      icon: FaBullhorn,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Active Drip Sequences',
      value: '8',
      icon: FaBolt,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      label: 'Leads Scored',
      value: '1,250',
      icon: FaUsers,
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Avg. Open Rate',
      value: '34.2%',
      icon: FaChartLine,
      color: 'bg-orange-50 text-orange-600',
    },
  ]

  const quickActions = [
    {
      title: 'Create Campaign',
      description: 'Create email or SMS campaign',
      icon: FaRegEnvelope,
      href: '/marketing/campaigns/create',
      color: 'blue',
    },
    {
      title: 'Manage Workflows',
      description: 'Set up automation workflows',
      icon: FaRobot,
      href: '/marketing/workflows',
      color: 'purple',
    },
    {
      title: 'Lead Scoring',
      description: 'Configure scoring models',
      icon: FaChartPie,
      href: '/marketing/lead-scoring',
      color: 'green',
    },
    {
      title: 'Social Integration',
      description: 'Connect social platforms',
      icon: FaShareAlt,
      href: '/marketing/social-integration',
      color: 'pink',
    },
    {
      title: 'Drip Campaigns',
      description: 'Manage drip sequences',
      icon: FaBolt,
      href: '/marketing/drip-campaigns',
      color: 'indigo',
    },
    {
      title: 'Analytics',
      description: 'View reports & insights',
      icon: HiOutlineChartBar,
      href: '/marketing/analytics',
      color: 'amber',
    },
  ]

  const recentCampaigns = [
    {
      id: 1,
      name: 'Welcome Email Series',
      type: 'Drip',
      status: 'Active',
      recipients: 450,
      openRate: '32%',
    },
    {
      id: 2,
      name: 'Spring Sale Promotion',
      type: 'Email',
      status: 'Scheduled',
      recipients: 1200,
      openRate: '-',
    },
    {
      id: 3,
      name: 'Product Update SMS',
      type: 'SMS',
      status: 'Active',
      recipients: 890,
      openRate: '48%',
    },
    {
      id: 4,
      name: 'Lead Nurture Sequence',
      type: 'Drip',
      status: 'Active',
      recipients: 320,
      openRate: '28%',
    },
  ]

  const colorMap: Record<string, string> = {
    blue: 'hover:border-blue-300 text-blue-600',
    purple: 'hover:border-purple-300 text-purple-600',
    green: 'hover:border-green-300 text-green-600',
    pink: 'hover:border-pink-300 text-pink-600',
    indigo: 'hover:border-indigo-300 text-indigo-600',
    amber: 'hover:border-amber-300 text-amber-600',
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Marketing Automation</h1>
          <p className="text-slate-500 font-medium">Streamline your campaigns, workflows, and lead intelligence.</p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all">
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mb-4`}>
                  <Icon size={20} />
                </div>
                <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              </div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
             Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link key={action.title} href={action.href}>
                  <div className={`bg-white rounded-xl border-2 border-transparent shadow-sm p-6 cursor-pointer transition-all hover:shadow-lg ${colorMap[action.color]}`}>
                    <div className="flex items-center gap-5">
                      <div className="p-4 bg-slate-50 rounded-xl text-slate-700">
                        <Icon size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 text-lg mb-0.5">{action.title}</h3>
                        <p className="text-sm text-slate-500 font-medium">{action.description}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Recent Campaigns */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-800">Recent Activity</h2>
            <Link href="/marketing/campaigns" className="text-blue-600 hover:text-blue-800 text-sm font-bold bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
              View All Campaigns
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white">
                  <th className="text-left py-4 px-6 font-semibold text-slate-500 text-sm uppercase">Campaign Name</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-500 text-sm uppercase">Channel</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-500 text-sm uppercase">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-500 text-sm uppercase">Reached</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-500 text-sm uppercase">Open Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 text-slate-900 font-bold">{campaign.name}</td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-bold uppercase tracking-tight">
                        {campaign.type}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          campaign.status === 'Active'
                            ? 'bg-green-100 text-green-700'
                            : campaign.status === 'Scheduled'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {campaign.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-medium">{campaign.recipients.toLocaleString()}</td>
                    <td className="py-4 px-6 text-slate-900 font-bold">{campaign.openRate}</td>
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