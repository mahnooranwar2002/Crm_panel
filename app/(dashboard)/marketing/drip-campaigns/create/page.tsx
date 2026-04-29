'use client'

import React, { useState } from 'react'
import { FaArrowLeft, FaPlus, FaTrashAlt } from 'react-icons/fa'
import Link from 'next/link'

export default function CreateDripCampaignPage() {
  const [emails, setEmails] = useState<Array<{ id: number; day: number; subject: string; template: string }>>([
    { id: 1, day: 0, subject: 'Welcome!', template: 'Welcome Template' },
  ])
  const [nextId, setNextId] = useState(2)

  const addEmail = () => {
    const maxDay = emails.length > 0 ? Math.max(...emails.map((e) => e.day)) : 0
    setEmails([
      ...emails,
      { id: nextId, day: maxDay + 1, subject: '', template: '' },
    ])
    setNextId(nextId + 1)
  }

  const removeEmail = (id: number) => {
    setEmails(emails.filter((e) => e.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Link href="/marketing/drip-campaigns" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
          <FaArrowLeft size={18} />
          Back to Drip Campaigns
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 mb-8">Create Drip Campaign</h1>

        {/* Form */}
        <form className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          {/* Campaign Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Campaign Name</label>
            <input
              type="text"
              placeholder="e.g., Welcome Email Series"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Trigger */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Trigger Event</label>
            <select className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>New lead added</option>
              <option>Lead score &gt; 50</option>
              <option>Form submission</option>
              <option>Custom event</option>
            </select>
          </div>

          {/* Emails */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-slate-900">Email Sequence</label>
              <button
                type="button"
                onClick={addEmail}
                className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
              >
                <FaPlus size={14} />
                Add Email
              </button>
            </div>

            <div className="space-y-4">
              {emails.map((email, index) => (
                <div key={email.id} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-slate-900">Email {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeEmail(email.id)}
                      className="p-1 hover:bg-red-100 rounded text-red-600 transition-colors"
                    >
                      <FaTrashAlt size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 mb-1 block">Days After Trigger</label>
                      <input
                        type="number"
                        value={email.day}
                        onChange={(e) => {
                           const newEmails = emails.map(em => em.id === email.id ? {...em, day: parseInt(e.target.value) || 0} : em);
                           setEmails(newEmails);
                        }}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 mb-1 block">Subject Line</label>
                      <input
                        type="text"
                        placeholder="Email subject"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Create Drip Campaign
            </button>
            <button
              type="button"
              className="px-6 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors font-semibold text-slate-900"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}