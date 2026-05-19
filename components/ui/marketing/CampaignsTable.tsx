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
      {/* VIEW DETAILS SIDEBAR */}
      {viewingCampaigns && (
        <>
          <div
            className="fixed inset-0 z-[998] bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setViewingCampaigns(null)}
          />
          <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl z-[999] animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h2 className="text-2xl font-black text-slate-800">{viewingCampaigns.campaign_name}</h2>
                <button
                  onClick={() => setViewingCampaigns(null)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <span className={`${getStatusColor(viewingCampaigns.status)} px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest`}>
                    {viewingCampaigns.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Campaign Type</p>
                  <p className="font-bold text-slate-800 text-lg">{viewingCampaigns.campaign_type}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Created By</p>
                  <p className="font-bold text-slate-700">{viewingCampaigns.created_by}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Target Audience</p>
                  <p className="font-bold text-slate-700">{viewingCampaigns.target_audience}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Target Count</p>
                    <p className="font-bold text-slate-700">{viewingCampaigns.target_count}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Recipients</p>
                    <p className="font-bold text-slate-700">{viewingCampaigns.recipient_count}</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Performance Metrics</p>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Open Rate</span>
                    <span className="font-bold text-green-600">{viewingCampaigns.open_rate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Click Rate</span>
                    <span className="font-bold text-blue-600">{viewingCampaigns.click_rate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Conversion Rate</span>
                    <span className="font-bold text-purple-600">{viewingCampaigns.conversion_rate}%</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Start Date</p>
                  <p className="font-bold text-slate-700">{new Date(viewingCampaigns.start_date).toLocaleDateString()}</p>
                </div>

                {viewingCampaigns.notes && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Notes</p>
                    <p className="text-sm text-slate-700 italic">"{viewingCampaigns.notes}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      {/* ///////////// */}

      {/* CREATE/EDIT SIDEBAR */}
      {showModal && (
        <>
          <div
            className="fixed inset-0 z-[998] bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowModal(false)}
          />
          <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl z-[999] animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h2 className="text-2xl font-black text-slate-800">{isEditing ? 'Edit' : 'Create'} Campaign</h2>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Campaign Name</label>
                  <input
                    type="text"
                    name="campaign_name"
                    value={formData.campaign_name}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-[#21a9ff] focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm"
                    placeholder="Enter campaign name"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Type</label>
                    <select
                      name="campaign_type"
                      value={formData.campaign_type}
                      onChange={handleInputChange}
                      className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none font-medium text-slate-600 cursor-pointer text-sm focus:border-[#21a9ff] focus:bg-white transition-all"
                    >
                      <option value="Email">Email</option>
                      <option value="SMS">SMS</option>
                      <option value="Social">Social</option>
                      <option value="Push">Push</option>
                      <option value="Multi-Channel">Multi-Channel</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none font-medium text-slate-600 cursor-pointer text-sm focus:border-[#21a9ff] focus:bg-white transition-all"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Active">Active</option>
                      <option value="Paused">Paused</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Target Audience</label>
                  <input
                    type="text"
                    name="target_audience"
                    value={formData.target_audience}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-[#21a9ff] focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm"
                    placeholder="E.g., Active Customers"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Target Count</label>
                    <input
                      type="number"
                      name="target_count"
                      value={formData.target_count}
                      onChange={handleInputChange}
                      className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-[#21a9ff] focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Recipients</label>
                    <input
                      type="number"
                      name="recipient_count"
                      value={formData.recipient_count}
                      onChange={handleInputChange}
                      className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-[#21a9ff] focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Open %</label>
                    <input
                      type="number"
                      step="0.1"
                      name="open_rate"
                      value={formData.open_rate}
                      onChange={handleInputChange}
                      className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-[#21a9ff] focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Click %</label>
                    <input
                      type="number"
                      step="0.1"
                      name="click_rate"
                      value={formData.click_rate}
                      onChange={handleInputChange}
                      className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-[#21a9ff] focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Conv. %</label>
                    <input
                      type="number"
                      step="0.1"
                      name="conversion_rate"
                      value={formData.conversion_rate}
                      onChange={handleInputChange}
                      className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-[#21a9ff] focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-[#21a9ff] focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm resize-none h-20"
                    placeholder="Add any notes..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#21a9ff] hover:bg-[#6dc6fe] text-white font-black py-3 rounded-2xl transition-all shadow-xl shadow-blue-100 active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {submitting && <FiLoader className="animate-spin" />}
                  {isEditing ? 'Update Campaign' : 'Create Campaign'}
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default CampaignsTable
