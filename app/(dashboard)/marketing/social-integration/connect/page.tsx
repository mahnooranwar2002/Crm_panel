'use client'

import React, { useState } from 'react'
import { FiArrowLeft, FiLock } from 'react-icons/fi'
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa'
import Link from 'next/link'

export default function ConnectSocialPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)

  const platforms = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: FaFacebook,
      color: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
      description: 'Connect your Facebook Business account and import leads from Lead Ads',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: FaInstagram,
      color: 'bg-pink-50 text-pink-600 hover:bg-pink-100',
      description: 'Connect your Instagram Business account for lead collection',
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: FaLinkedin,
      color: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
      description: 'Connect your LinkedIn company account for B2B lead generation',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <Link href="/marketing/social-integration" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
          <FiArrowLeft size={20} />
          Back to Social Integration
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">Connect Social Media Account</h1>
        <p className="text-slate-600 mb-8">Choose a platform to connect and start importing leads</p>

        {!selectedPlatform ? (
          // Platform Selection
          <div className="space-y-4">
            {platforms.map((platform) => {
              const Icon = platform.icon
              return (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className={`w-full p-6 rounded-lg border-2 border-slate-200 transition-all text-left ${platform.color}`}
                >
                  <div className="flex items-start gap-4">
                    <Icon size={32} />
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-slate-900">{platform.name}</h2>
                      <p className="text-slate-600">{platform.description}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        ) : (
          // Connection Process
          <div className="bg-white rounded-lg shadow-sm p-8">
            <button
              onClick={() => setSelectedPlatform(null)}
              className="text-blue-600 hover:text-blue-700 font-medium mb-6"
            >
              ← Choose different platform
            </button>

            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiLock size={32} className="text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Connect {platforms.find((p) => p.id === selectedPlatform)?.name}
                </h2>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  You'll be redirected to {platforms.find((p) => p.id === selectedPlatform)?.name} to authorize this connection. This
                  is secure and required to import your leads.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-slate-900">This will allow us to:</h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    Access your lead generation forms
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    Import lead information automatically
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    Sync new leads on a regular schedule
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    Enrich lead data with social profile information
                  </li>
                </ul>
              </div>

              <div className="flex gap-4 pt-6">
                <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                  Connect with {platforms.find((p) => p.id === selectedPlatform)?.name}
                </button>
                <button
                  onClick={() => setSelectedPlatform(null)}
                  className="px-6 py-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors font-semibold text-slate-900"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
