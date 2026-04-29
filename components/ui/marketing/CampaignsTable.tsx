'use client'

import React, { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiLoader, FiEye } from 'react-icons/fi'
import { Campaign, CampaignsService } from '@/src/services/marketing/CampaignsService'

const emptyCampaign: Campaign = {
  campaign_name: '',
  campaign_type: 'Email',
  status: 'Draft',
  start_date: new Date().getTime(),
  target_audience: '',
  target_count: 0,
  recipient_count: 0,
  open_rate: 0,
  click_rate: 0,
  conversion_rate: 0,
  created_by: 'Current User',
  notes: '',
}

const CampaignsTable = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Campaign>(emptyCampaign)
  const [submitting, setSubmitting] = useState(false)
  const [viewingCampaigns, setViewingCampaigns] = useState<Campaign | null>(null)

  useEffect(() => { fetchCampaigns() }, [])

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [showModal])

  const fetchCampaigns = async () => {
    try {
      setLoading(true)
      const data = await CampaignsService.getAllCampaigns()
      setCampaigns(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (isEditing && formData._id) {
        await CampaignsService.updateCampaign(formData._id, formData)
      } else {
        await CampaignsService.createCampaign(formData)
      }
      await fetchCampaigns()
      setShowModal(false)
    } catch (err) {
      alert('Failed to save')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      try {
        await CampaignsService.deleteCampaign(id)
        await fetchCampaigns()
      } catch (err) {
        alert('Failed to delete')
      }
    }
  }

  const getStatusColor = (status: Campaign['status']) => {
    const colors: { [key: string]: string } = {
      'Draft': 'bg-slate-50 text-slate-600',
      'Scheduled': 'bg-yellow-50 text-yellow-600',
      'Active': 'bg-green-50 text-green-600',
      'Completed': 'bg-blue-50 text-blue-600',
      'Paused': 'bg-orange-50 text-orange-600',
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
          <h1 className="text-2xl font-black">Campaigns</h1>
          <p className="text-slate-500 text-sm">Create and manage your marketing campaigns</p>
        </div>
        <button
          onClick={() => { setFormData(emptyCampaign); setIsEditing(false); setShowModal(true); }}
          className="bg-[#21a9ff] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-100 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <FiPlus /> New Campaign
        </button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map(campaign => (
          <div key={campaign._id} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <span className={`${getStatusColor(campaign.status)} px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest`}>{campaign.status}</span>
              <span className="text-xs text-slate-500">{campaign.campaign_type}</span>
            </div>
            <h3 className="font-bold text-lg mb-3">{campaign.campaign_name}</h3>
            <div className="space-y-2 text-sm mb-6">
              <p><span className="text-slate-500">Recipients:</span> <span className="font-semibold">{campaign.recipient_count}/{campaign.target_count}</span></p>
              <p><span className="text-slate-500">Open Rate:</span> <span className="font-semibold text-green-600">{campaign.open_rate}%</span></p>
              <p><span className="text-slate-500">Click Rate:</span> <span className="font-semibold text-blue-600">{campaign.click_rate}%</span></p>
              <p><span className="text-slate-500">Conv. Rate:</span> <span className="font-semibold text-purple-600">{campaign.conversion_rate}%</span></p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setFormData(campaign); setIsEditing(true); setShowModal(true); }}
                className="flex-1 py-2.5 bg-slate-50 rounded-xl flex justify-center text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <FiEdit2 />
              </button>
              <button
                onClick={() => campaign._id && handleDelete(campaign._id)}
                className="flex-1 py-2.5 bg-slate-50 rounded-xl flex justify-center text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <FiTrash2 />
              </button>
              <button
                onClick={() => setViewingCampaigns(campaign)}
                className="flex-1 py-2.5 bg-slate-50 rounded-xl flex justify-center text-slate-500 hover:bg-green-50 hover:text-green-600 transition-colors"
              >
                <FiEye size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ///////////// */}
      {/* VIEW DETAILS MODAL */}
      {viewingCampaigns && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setViewingCampaigns(null)} />
          <div className="relative bg-white/90 backdrop-blur-2xl rounded-[3rem] shadow-2xl w-full max-w-lg border border-white/20 overflow-hidden transform transition-all animate-in zoom-in duration-300">
            <div className="p-10">
              <div className="flex justify-between items-start mb-8">
                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${getStatusColor(viewingCampaigns.status)}`}>
                  {viewingCampaigns.status}
                </span>
                <button onClick={() => setViewingCampaigns(null)} className="p-3 bg-slate-100 text-slate-400 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors">
                  <FiX size={24} />
                </button>
              </div>

              <h2 className="text-4xl font-black text-slate-900 mb-2">{viewingCampaigns.campaign_name}</h2>
              <p className="text-slate-500 font-medium mb-8">Created by {viewingCampaigns.created_by}</p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/50 p-6 rounded-[2rem] border border-white shadow-sm">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Campaign Type</p>
                  <p className="text-lg font-black text-blue-600">{viewingCampaigns.campaign_type}</p>
                </div>
                <div className="bg-white/50 p-6 rounded-[2rem] border border-white shadow-sm flex flex-col justify-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Recipients</p>
                  <p className="text-lg font-black text-slate-700">{viewingCampaigns.recipient_count}/{viewingCampaigns.target_count}</p>
                </div>
              </div>

              <div className="space-y-4 px-2 border-t border-slate-100 pt-6">
                <div className="flex justify-between items-center py-2">
                  <div className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Target Audience</div>
                  <div className="font-black text-slate-700">{viewingCampaigns.target_audience}</div>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Start Date</div>
                  <div className="font-black text-slate-700">{new Date(viewingCampaigns.start_date).toLocaleDateString()}</div>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Open Rate</div>
                  <div className="font-black text-green-600">{viewingCampaigns.open_rate}%</div>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Click Rate</div>
                  <div className="font-black text-blue-600">{viewingCampaigns.click_rate}%</div>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Conversion Rate</div>
                  <div className="font-black text-purple-600">{viewingCampaigns.conversion_rate}%</div>
                </div>
                {viewingCampaigns.notes && (
                  <div className="mt-4 bg-slate-50 p-4 rounded-2xl italic text-sm text-slate-600">"{viewingCampaigns.notes}"</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ///////////// */}

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
              <h2 className="text-xl font-bold">{isEditing ? 'Edit' : 'Create'} Campaign</h2>
              <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <FiX size={20} />
              </button>
            </div>

            <div className="px-8 pb-8 overflow-y-auto max-h-[60vh] space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">Campaign Name</label>
                <input
                  type="text"
                  name="campaign_name"
                  value={formData.campaign_name}
                  onChange={handleInputChange}
                  className={inputBase}
                  placeholder="Enter campaign name"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Type</label>
                  <select name="campaign_type" value={formData.campaign_type} onChange={handleInputChange} className={inputBase}>
                    <option value="Email">Email</option>
                    <option value="SMS">SMS</option>
                    <option value="Social">Social</option>
                    <option value="Push">Push</option>
                    <option value="Multi-Channel">Multi-Channel</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className={inputBase}>
                    <option value="Draft">Draft</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Active">Active</option>
                    <option value="Paused">Paused</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700">Target Audience</label>
                <input
                  type="text"
                  name="target_audience"
                  value={formData.target_audience}
                  onChange={handleInputChange}
                  className={inputBase}
                  placeholder="E.g., Active Customers"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Target Count</label>
                  <input
                    type="number"
                    name="target_count"
                    value={formData.target_count}
                    onChange={handleInputChange}
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Recipients</label>
                  <input
                    type="number"
                    name="recipient_count"
                    value={formData.recipient_count}
                    onChange={handleInputChange}
                    className={inputBase}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Open Rate %</label>
                  <input
                    type="number"
                    step="0.1"
                    name="open_rate"
                    value={formData.open_rate}
                    onChange={handleInputChange}
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Click Rate %</label>
                  <input
                    type="number"
                    step="0.1"
                    name="click_rate"
                    value={formData.click_rate}
                    onChange={handleInputChange}
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Conv. Rate %</label>
                  <input
                    type="number"
                    step="0.1"
                    name="conversion_rate"
                    value={formData.conversion_rate}
                    onChange={handleInputChange}
                    className={inputBase}
                  />
                </div>
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
                Save Campaign
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default CampaignsTable
