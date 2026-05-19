'use client'

import React, { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiLoader, FiEye } from 'react-icons/fi'
import { DripCampaign, DripCampaignsService } from '@/src/services/marketing/DripCampaignsService'

const emptyDripCampaign: DripCampaign = {
  campaign_name: '',
  status: 'Draft',
  total_sequences: 0,
  active_contacts: 0,
  completed_contacts: 0,
  opened_emails: 0,
  clicked_links: 0,
  converted_contacts: 0,
  trigger_type: 'Time-Based',
  frequency: '1 day',
  start_date: new Date().getTime(),
  created_by: 'Current User',
  notes: '',
}

const DripCampaignsTable = () => {
  const [campaigns, setCampaigns] = useState<DripCampaign[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<DripCampaign>(emptyDripCampaign)
  const [submitting, setSubmitting] = useState(false)
  const [viewingDripCampaign, setViewingDripCampaign] = useState<DripCampaign | null>(null)

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
      const data = await DripCampaignsService.getAllDripCampaigns()
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
        await DripCampaignsService.updateDripCampaign(formData._id, formData)
      } else {
        await DripCampaignsService.createDripCampaign(formData)
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
        await DripCampaignsService.deleteDripCampaign(id)
        await fetchCampaigns()
      } catch (err) {
        alert('Failed to delete')
      }
    }
  }

  const getStatusColor = (status: DripCampaign['status']) => {
    const colors: { [key: string]: string } = {
      'Draft': 'bg-slate-50 text-slate-600',
      'Active': 'bg-green-50 text-green-600',
      'Paused': 'bg-orange-50 text-orange-600',
      'Completed': 'bg-blue-50 text-blue-600',
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
          <h1 className="text-2xl font-black">Drip Campaigns</h1>
          <p className="text-slate-500 text-sm">Automated email sequences for lead nurturing</p>
        </div>
        <button
          onClick={() => { setFormData(emptyDripCampaign); setIsEditing(false); setShowModal(true); }}
          className="bg-[#21a9ff] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-100 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <FiPlus /> New Drip Campaign
        </button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map(campaign => (
          <div key={campaign._id} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <span className={`${getStatusColor(campaign.status)} px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest`}>{campaign.status}</span>
              <span className="text-xs text-slate-500">{campaign.trigger_type}</span>
            </div>
            <h3 className="font-bold text-lg mb-3">{campaign.campaign_name}</h3>
            <div className="space-y-2 text-sm mb-6">
              <p><span className="text-slate-500">Sequences:</span> <span className="font-semibold">{campaign.total_sequences}</span></p>
              <p><span className="text-slate-500">Active Contacts:</span> <span className="font-semibold text-green-600">{campaign.active_contacts}</span></p>
              <p><span className="text-slate-500">Completed:</span> <span className="font-semibold">{campaign.completed_contacts}</span></p>
              <p><span className="text-slate-500">Converted:</span> <span className="font-semibold text-blue-600">{campaign.converted_contacts}</span></p>
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
                onClick={() => setViewingDripCampaign(campaign)}
                className="flex-1 py-2.5 bg-slate-50 rounded-xl flex justify-center text-slate-500 hover:bg-green-50 hover:text-green-600 transition-colors"
              >
                <FiEye size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ////////////////////// */}
      {/* VIEW DETAILS SIDEBAR */}
      {viewingDripCampaign && (
        <>
          <div
            className="fixed inset-0 z-[998] bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setViewingDripCampaign(null)}
          />
          <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl z-[999] animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h2 className="text-2xl font-black text-slate-800">{viewingDripCampaign.campaign_name}</h2>
                <button
                  onClick={() => setViewingDripCampaign(null)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
                  type="button"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${getStatusColor(viewingDripCampaign.status)}`}>
                  {viewingDripCampaign.status}
                </span>

                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Created By</p>
                  <p className="font-bold text-slate-700">{viewingDripCampaign.created_by}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Trigger Type</p>
                  <p className="font-bold text-blue-600 text-lg">{viewingDripCampaign.trigger_type}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Frequency</p>
                  <p className="font-bold text-slate-700 text-lg">{viewingDripCampaign.frequency}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Sequences</p>
                    <p className="font-bold text-slate-700">{viewingDripCampaign.total_sequences}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Contacts</p>
                    <p className="font-bold text-green-600">{viewingDripCampaign.active_contacts}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Completed Contacts</p>
                    <p className="font-bold text-blue-600">{viewingDripCampaign.completed_contacts}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Converted Contacts</p>
                    <p className="font-bold text-purple-600">{viewingDripCampaign.converted_contacts}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Opened Emails</p>
                    <p className="font-bold text-slate-700">{viewingDripCampaign.opened_emails}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Clicked Links</p>
                    <p className="font-bold text-slate-700">{viewingDripCampaign.clicked_links}</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Start Date</p>
                    <p className="font-bold text-slate-700">{new Date(viewingDripCampaign.start_date).toLocaleDateString()}</p>
                  </div>
                </div>

                {viewingDripCampaign.notes && (
                  <div className="mt-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Notes</p>
                    <p className="text-sm text-slate-700 italic">"{viewingDripCampaign.notes}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      {/* ////////////////////// */}

      {/* Modal */}
      {showModal && (
        <>
          <div
            className="fixed inset-0 z-[9998] bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowModal(false)}
          />

          <form
            onSubmit={handleSubmit}
            className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl z-[9999] animate-in slide-in-from-right duration-300 overflow-y-auto"
          >
            <div className="p-8 pb-4 flex justify-between items-center border-b border-slate-100">
              <h2 className="text-2xl font-black text-slate-800">{isEditing ? 'Edit' : 'Create'} Drip Campaign</h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="px-8 pb-8 space-y-4">
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
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className={inputBase}>
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                    <option value="Paused">Paused</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Trigger Type</label>
                  <select name="trigger_type" value={formData.trigger_type} onChange={handleInputChange} className={inputBase}>
                    <option value="Time-Based">Time-Based</option>
                    <option value="Event-Based">Event-Based</option>
                    <option value="Behavior-Based">Behavior-Based</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Frequency</label>
                  <select name="frequency" value={formData.frequency} onChange={handleInputChange} className={inputBase}>
                    <option value="1 day">1 day</option>
                    <option value="3 days">3 days</option>
                    <option value="1 week">1 week</option>
                    <option value="2 weeks">2 weeks</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Total Sequences</label>
                  <input
                    type="number"
                    name="total_sequences"
                    value={formData.total_sequences}
                    onChange={handleInputChange}
                    className={inputBase}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Active Contacts</label>
                  <input
                    type="number"
                    name="active_contacts"
                    value={formData.active_contacts}
                    onChange={handleInputChange}
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Completed Contacts</label>
                  <input
                    type="number"
                    name="completed_contacts"
                    value={formData.completed_contacts}
                    onChange={handleInputChange}
                    className={inputBase}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Converted Contacts</label>
                  <input
                    type="number"
                    name="converted_contacts"
                    value={formData.converted_contacts}
                    onChange={handleInputChange}
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Opened Emails</label>
                  <input
                    type="number"
                    name="opened_emails"
                    value={formData.opened_emails}
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

            <div className="p-8 pt-4 bg-slate-50 border-t border-slate-100 flex gap-3 sticky bottom-0">
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
        </>
      )}
    </div>
  )
}

export default DripCampaignsTable
