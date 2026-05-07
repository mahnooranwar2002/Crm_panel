'use client'

import React, { useState } from 'react'
import { MdOutlineKeyboardArrowLeft } from "react-icons/md"; 
import { FaMailBulk } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { FiCalendar} from 'react-icons/fi'; 
import { IoSendSharp } from "react-icons/io5";
import Link from 'next/link'

export default function CreateCampaignPage() {
  const [campaignType, setCampaignType] = useState<'email' | 'sms' | 'drip' | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    recipients: '',
    content: '',
    scheduledDate: '',
    scheduledTime: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Creating campaign:', { campaignType, ...formData })
    // API call would go here
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Link href="/marketing/campaigns" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
          <MdOutlineKeyboardArrowLeft size={20} />
          Back to Campaigns
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 mb-8">Create New Campaign</h1>

        {!campaignType ? (
          // Campaign Type Selection
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                type: 'email',
                title: 'Email Campaign',
                description: 'Send targeted emails to your leads',
                icon: FaMailBulk,
              },
              {
                type: 'sms',
                title: 'SMS Campaign',
                description: 'Send text messages to your audience',
                icon: FaUsers,
              },
              {
                type: 'drip',
                title: 'Drip Campaign',
                description: 'Automated sequence of emails',
                icon: FiCalendar,
              },
            ].map((option) => {
              const Icon = option.icon
              return (
                <button
                  key={option.type}
                  onClick={() => setCampaignType(option.type as any)}
                  className="bg-white rounded-lg shadow-sm p-8 hover:shadow-md transition-all border-2 border-transparent hover:border-blue-300"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-blue-100 rounded-lg">
                      <Icon size={32} className="text-blue-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-900">{option.title}</h2>
                    <p className="text-slate-600 text-center">{option.description}</p>
                  </div>
                </button>
              )
            })}
          </div>
        ) : (
          // Campaign Form
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-8">
            <div className="mb-8">
              <button
                type="button"
                onClick={() => setCampaignType(null)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Change campaign type
              </button>
            </div>

            <div className="space-y-6">
              {/* Campaign Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Campaign Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Spring Sale Email Series"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Subject Line */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Subject Line</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g., Don't miss our Spring Sale!"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Recipients */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Recipients</label>
                <select
                  name="recipients"
                  value={formData.recipients}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select recipient list...</option>
                  <option value="all">All Leads (1,250)</option>
                  <option value="hot">Hot Leads (320)</option>
                  <option value="warm">Warm Leads (580)</option>
                  <option value="facebook">Facebook Leads (450)</option>
                </select>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Content</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Write your campaign content here..."
                  rows={8}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Schedule */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Date</label>
                  <input
                    type="date"
                    name="scheduledDate"
                    value={formData.scheduledDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Time</label>
                  <input
                    type="time"
                    name="scheduledTime"
                    value={formData.scheduledTime}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  <IoSendSharp size={20} />
                  Create Campaign
                </button>
                <button
                  type="button"
                  onClick={() => setCampaignType(null)}
                  className="px-6 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors font-semibold text-slate-900"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
