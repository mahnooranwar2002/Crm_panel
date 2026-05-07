'use client'

import React, { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiLoader, FiEye } from 'react-icons/fi'
import { SocialIntegration, SocialIntegrationService } from '@/src/services/marketing/SocialIntegrationService'

const emptySocialIntegration: SocialIntegration = {
  platform: 'Facebook',
  account_name: '',
  connected_date: new Date().getTime(),
  followers_count: 0,
  engagement_rate: 0,
  posts_count: 0,
  avg_likes_per_post: 0,
  avg_comments_per_post: 0,
  avg_shares_per_post: 0,
  connected_by: 'Current User',
  status: 'Connected',
  auto_posting_enabled: false,
  notes: '',
}

const SocialIntegrationTable = () => {
  const [integrations, setIntegrations] = useState<SocialIntegration[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<SocialIntegration>(emptySocialIntegration)
  const [submitting, setSubmitting] = useState(false)
  const [viewingSocialIntegration, setViewingSocialIntegration] = useState<SocialIntegration | null>(null)

  useEffect(() => { fetchIntegrations() }, [])

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [showModal])

  const fetchIntegrations = async () => {
    try {
      setLoading(true)
      const data = await SocialIntegrationService.getAllIntegrations()
      setIntegrations(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (isEditing && formData._id) {
        await SocialIntegrationService.updateIntegration(formData._id, formData)
      } else {
        await SocialIntegrationService.createIntegration(formData)
      }
      await fetchIntegrations()
      setShowModal(false)
    } catch (err) {
      alert('Failed to save')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this integration?')) {
      try {
        await SocialIntegrationService.deleteIntegration(id)
        await fetchIntegrations()
      } catch (err) {
        alert('Failed to delete')
      }
    }
  }

  const getStatusColor = (status: SocialIntegration['status']) => {
    const colors: { [key: string]: string } = {
      'Connected': 'bg-green-50 text-green-600',
      'Disconnected': 'bg-slate-50 text-slate-600',
      'Expired': 'bg-orange-50 text-orange-600',
      'Error': 'bg-red-50 text-red-600',
    }
    return colors[status] || 'bg-slate-50 text-slate-600'
  }

  const inputBase = "w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all placeholder:text-slate-400 bg-white"

  if (loading) {
    return <div className="p-8 text-center"><FiLoader className="animate-spin text-3xl text-slate-400" /></div>
  }

  return (
    <div className="p-8 max-w-7xl mx-auto text-slate-800">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black">Social Integration</h1>
          <p className="text-slate-500 text-sm">Connect and manage social media accounts</p>
        </div>
        <button
          onClick={() => { setFormData(emptySocialIntegration); setIsEditing(false); setShowModal(true); }}
          className="bg-[#21a9ff] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-100 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <FiPlus /> Connect Platform
        </button>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map(integration => (
          <div key={integration._id} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <span className={`${getStatusColor(integration.status)} px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest`}>{integration.status}</span>
              <span className="text-xs text-slate-500 font-semibold">{integration.platform}</span>
            </div>
            <h3 className="font-bold text-lg mb-3">{integration.account_name}</h3>
            <div className="space-y-2 text-sm mb-6">
              <p><span className="text-slate-500">Followers:</span> <span className="font-semibold">{integration.followers_count.toLocaleString()}</span></p>
              <p><span className="text-slate-500">Engagement:</span> <span className="font-semibold text-green-600">{integration.engagement_rate.toFixed(1)}%</span></p>
              <p><span className="text-slate-500">Posts:</span> <span className="font-semibold">{integration.posts_count}</span></p>
              <p><span className="text-slate-500">Avg Engagement:</span> <span className="font-semibold">{integration.avg_likes_per_post} likes</span></p>
              {integration.auto_posting_enabled && <p className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded font-semibold">Auto-posting enabled</p>}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setFormData(integration); setIsEditing(true); setShowModal(true); }}
                className="flex-1 py-2.5 bg-slate-50 rounded-xl flex justify-center text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <FiEdit2 />
              </button>
              <button
                onClick={() => integration._id && handleDelete(integration._id)}
                className="flex-1 py-2.5 bg-slate-50 rounded-xl flex justify-center text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <FiTrash2 />
              </button>
              <button
                onClick={() => setViewingSocialIntegration(integration)}
                className="flex-1 py-2.5 bg-slate-50 rounded-xl flex justify-center text-slate-500 hover:bg-green-50 hover:text-green-600 transition-colors"
              >
                <FiEye size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* //////////////////////// */}
      {/* VIEW DETAILS MODAL */}
      {viewingSocialIntegration && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setViewingSocialIntegration(null)} />
          <div className="relative bg-white/90 backdrop-blur-2xl rounded-[3rem] shadow-2xl w-full max-w-lg border border-white/20 overflow-hidden transform transition-all animate-in zoom-in duration-300">
            <div className="p-10">
              <div className="flex justify-between items-start mb-8">
                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${getStatusColor(viewingSocialIntegration.status)}`}>
                  {viewingSocialIntegration.status}
                </span>
                <button onClick={() => setViewingSocialIntegration(null)} className="p-3 bg-slate-100 text-slate-400 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors">
                  <FiX size={24} />
                </button>
              </div>

              <h2 className="text-4xl font-black text-slate-900 mb-2">{viewingSocialIntegration.account_name}</h2>
              <p className="text-slate-500 font-medium mb-8">Connected by {viewingSocialIntegration.connected_by}</p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/50 p-6 rounded-[2rem] border border-white shadow-sm">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Platform</p>
                  <p className="text-lg font-black text-blue-600">{viewingSocialIntegration.platform}</p>
                </div>
                <div className="bg-white/50 p-6 rounded-[2rem] border border-white shadow-sm flex flex-col justify-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Followers</p>
                  <p className="text-lg font-black text-slate-700">{viewingSocialIntegration.followers_count.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-4 px-2 border-t border-slate-100 pt-6">
                <div className="flex justify-between items-center py-2">
                  <div className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Engagement Rate</div>
                  <div className="font-black text-green-600">{viewingSocialIntegration.engagement_rate.toFixed(1)}%</div>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Posts Count</div>
                  <div className="font-black text-slate-700">{viewingSocialIntegration.posts_count}</div>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Avg Likes/Post</div>
                  <div className="font-black text-blue-600">{viewingSocialIntegration.avg_likes_per_post}</div>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Avg Comments/Post</div>
                  <div className="font-black text-slate-700">{viewingSocialIntegration.avg_comments_per_post}</div>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Avg Shares/Post</div>
                  <div className="font-black text-slate-700">{viewingSocialIntegration.avg_shares_per_post}</div>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Connected Date</div>
                  <div className="font-black text-slate-700">{new Date(viewingSocialIntegration.connected_date).toLocaleDateString()}</div>
                </div>
                {viewingSocialIntegration.auto_posting_enabled && (
                  <div className="flex justify-between items-center py-2">
                    <div className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Auto-Posting</div>
                    <div className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-black">Enabled</div>
                  </div>
                )}
                {viewingSocialIntegration.notes && (
                  <div className="mt-4 bg-slate-50 p-4 rounded-2xl italic text-sm text-slate-600">"{viewingSocialIntegration.notes}"</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* //////////////////////// */}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
            onClick={() => setShowModal(false)}
          />

          <form
            onSubmit={handleSubmit}
            className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden border border-white/20"
          >
            <div className="p-8 pb-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">{isEditing ? 'Edit' : 'Connect'} Social Account</h2>
              <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <FiX size={20} />
              </button>
            </div>

            <div className="px-8 pb-8 overflow-y-auto max-h-[60vh] space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Platform</label>
                  <select name="platform" value={formData.platform} onChange={handleInputChange} className={inputBase}>
                    <option value="Facebook">Facebook</option>
                    <option value="Instagram">Instagram</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Twitter">Twitter</option>
                    <option value="TikTok">TikTok</option>
                    <option value="YouTube">YouTube</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className={inputBase}>
                    <option value="Connected">Connected</option>
                    <option value="Disconnected">Disconnected</option>
                    <option value="Expired">Expired</option>
                    <option value="Error">Error</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">Account Name</label>
                <input
                  type="text"
                  name="account_name"
                  value={formData.account_name}
                  onChange={handleInputChange}
                  className={inputBase}
                  placeholder="Account name"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Followers Count</label>
                  <input
                    type="number"
                    name="followers_count"
                    value={formData.followers_count}
                    onChange={handleInputChange}
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Engagement Rate %</label>
                  <input
                    type="number"
                    step="0.1"
                    name="engagement_rate"
                    value={formData.engagement_rate}
                    onChange={handleInputChange}
                    className={inputBase}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Posts Count</label>
                  <input
                    type="number"
                    name="posts_count"
                    value={formData.posts_count}
                    onChange={handleInputChange}
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Avg Likes/Post</label>
                  <input
                    type="number"
                    name="avg_likes_per_post"
                    value={formData.avg_likes_per_post}
                    onChange={handleInputChange}
                    className={inputBase}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Avg Comments/Post</label>
                  <input
                    type="number"
                    name="avg_comments_per_post"
                    value={formData.avg_comments_per_post}
                    onChange={handleInputChange}
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Avg Shares/Post</label>
                  <input
                    type="number"
                    name="avg_shares_per_post"
                    value={formData.avg_shares_per_post}
                    onChange={handleInputChange}
                    className={inputBase}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="auto_posting"
                  name="auto_posting_enabled"
                  checked={formData.auto_posting_enabled}
                  onChange={handleInputChange}
                  className="w-4 h-4 cursor-pointer"
                />
                <label htmlFor="auto_posting" className="text-sm font-semibold text-slate-700 cursor-pointer">
                  Enable auto-posting
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className={`${inputBase} resize-none`}
                  rows={3}
                  placeholder="Add any notes..."
                />
              </div>
            </div>

            <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 px-6 py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-6 py-3 rounded-xl font-semibold bg-[#21a9ff] text-white hover:bg-blue-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {submitting && <FiLoader className="animate-spin" />}
                Save Integration
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default SocialIntegrationTable
