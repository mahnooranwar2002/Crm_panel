'use client'

import React, { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiLoader, FiEye } from 'react-icons/fi'
import { LeadScore, LeadScoringService } from '@/src/services/marketing/LeadScoringService'

const emptyLeadScore: LeadScore = {
  lead_id: '',
  lead_name: '',
  email: '',
  company: '',
  engagement_score: 0,
  behavioral_score: 0,
  demographic_score: 0,
  total_score: 0,
  grade: 'C',
  status: 'Cold',
  activities_count: 0,
  email_opens: 0,
  link_clicks: 0,
  page_views: 0,
  form_submissions: 0,
  updated_by: 'Current User',
  notes: '',
}

const LeadScoringTable = () => {
  const [scores, setScores] = useState<LeadScore[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<LeadScore>(emptyLeadScore)
  const [submitting, setSubmitting] = useState(false)
  const [viewingLeadScore, setViewingLeadScore] = useState<LeadScore | null>(null)

  useEffect(() => { fetchScores() }, [])

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [showModal])

  const fetchScores = async () => {
    try {
      setLoading(true)
      const data = await LeadScoringService.getAllLeadScores()
      setScores(data)
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
        await LeadScoringService.updateLeadScore(formData._id, formData)
      } else {
        await LeadScoringService.createLeadScore(formData)
      }
      await fetchScores()
      setShowModal(false)
    } catch (err) {
      alert('Failed to save')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this lead score?')) {
      try {
        await LeadScoringService.deleteLeadScore(id)
        await fetchScores()
      } catch (err) {
        alert('Failed to delete')
      }
    }
  }

  const getGradeColor = (grade: LeadScore['grade']) => {
    const colors: { [key: string]: string } = {
      'A': 'bg-green-50 text-green-600',
      'B': 'bg-blue-50 text-blue-600',
      'C': 'bg-yellow-50 text-yellow-600',
      'D': 'bg-orange-50 text-orange-600',
      'F': 'bg-red-50 text-red-600',
    }
    return colors[grade] || 'bg-slate-50 text-slate-600'
  }

  const getStatusColor = (status: LeadScore['status']) => {
    const colors: { [key: string]: string } = {
      'Hot': 'bg-red-50 text-red-600',
      'Warm': 'bg-orange-50 text-orange-600',
      'Cold': 'bg-blue-50 text-blue-600',
      'Inactive': 'bg-slate-50 text-slate-600',
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
          <h1 className="text-2xl font-black">Lead Scoring</h1>
          <p className="text-slate-500 text-sm">Evaluate and rank lead quality</p>
        </div>
        <button
          onClick={() => { setFormData(emptyLeadScore); setIsEditing(false); setShowModal(true); }}
          className="bg-[#21a9ff] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-100 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <FiPlus /> New Lead Score
        </button>
      </div>

      {/* Scores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scores.map(score => (
          <div key={score._id} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <span className={`${getGradeColor(score.grade)} px-3 py-1 rounded-lg text-[12px] font-black uppercase tracking-widest`}>Grade {score.grade}</span>
              <span className={`${getStatusColor(score.status)} px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest`}>{score.status}</span>
            </div>
            <h3 className="font-bold text-lg mb-1">{score.lead_name}</h3>
            <p className="text-sm text-slate-500 mb-3">{score.company}</p>
            <div className="space-y-2 text-sm mb-6">
              <p><span className="text-slate-500">Total Score:</span> <span className="font-semibold text-lg">{score.total_score.toFixed(1)}</span></p>
              <p><span className="text-slate-500">Engagement:</span> <span className="font-semibold">{score.engagement_score}</span></p>
              <p><span className="text-slate-500">Activities:</span> <span className="font-semibold">{score.activities_count}</span></p>
              <p><span className="text-slate-500">Opens/Clicks:</span> <span className="font-semibold">{score.email_opens}/{score.link_clicks}</span></p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setFormData(score); setIsEditing(true); setShowModal(true); }}
                className="flex-1 py-2.5 bg-slate-50 rounded-xl flex justify-center text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <FiEdit2 />
              </button>
              <button
                onClick={() => score._id && handleDelete(score._id)}
                className="flex-1 py-2.5 bg-slate-50 rounded-xl flex justify-center text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <FiTrash2 />
              </button>
              <button
                onClick={() => setViewingLeadScore(score)}
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
      {viewingLeadScore && (
        <>
          <div
            className="fixed inset-0 z-[998] bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setViewingLeadScore(null)}
          />
          <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl z-[999] animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h2 className="text-2xl font-black text-slate-800">{viewingLeadScore.lead_name}</h2>
                <button
                  onClick={() => setViewingLeadScore(null)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
                  type="button"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${getGradeColor(viewingLeadScore.grade)}`}>
                    Grade {viewingLeadScore.grade}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${getStatusColor(viewingLeadScore.status)}`}>
                    {viewingLeadScore.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Email</p>
                  <p className="font-bold text-slate-700">{viewingLeadScore.email}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Company</p>
                  <p className="font-bold text-slate-800">{viewingLeadScore.company}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Score</p>
                    <p className="font-black text-blue-600">{viewingLeadScore.total_score.toFixed(1)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Activities</p>
                    <p className="font-black text-slate-700">{viewingLeadScore.activities_count}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Engagement</span>
                    <span className="font-black text-green-600">{viewingLeadScore.engagement_score}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Behavioral</span>
                    <span className="font-black text-blue-600">{viewingLeadScore.behavioral_score}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Demographic</span>
                    <span className="font-black text-purple-600">{viewingLeadScore.demographic_score}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Email Opens</span>
                    <span className="font-black text-slate-700">{viewingLeadScore.email_opens}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Link Clicks</span>
                    <span className="font-black text-slate-700">{viewingLeadScore.link_clicks}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Page Views</span>
                    <span className="font-black text-slate-700">{viewingLeadScore.page_views}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-50">
                    <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Form Submissions</span>
                    <span className="font-black text-slate-700">{viewingLeadScore.form_submissions}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Updated By</span>
                    <span className="font-black text-slate-700">{viewingLeadScore.updated_by}</span>
                  </div>
                </div>

                {viewingLeadScore.notes && (
                  <div className="mt-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Notes</p>
                    <p className="text-sm text-slate-700 italic">"{viewingLeadScore.notes}"</p>
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
              <h2 className="text-2xl font-black text-slate-800">{isEditing ? 'Edit' : 'Create'} Lead Score</h2>
              <button type="button" onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                <FiX size={20} />
              </button>
            </div>

            <div className="px-8 pb-8 space-y-4">

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Lead Name</label>
                  <input
                    type="text"
                    name="lead_name"
                    value={formData.lead_name}
                    onChange={handleInputChange}
                    className={inputBase}
                    placeholder="Lead name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={inputBase}
                    placeholder="Email"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className={inputBase}
                    placeholder="Company"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Grade</label>
                  <select name="grade" value={formData.grade} onChange={handleInputChange} className={inputBase}>
                    <option value="A">A (Excellent)</option>
                    <option value="B">B (Good)</option>
                    <option value="C">C (Average)</option>
                    <option value="D">D (Poor)</option>
                    <option value="F">F (Very Poor)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className={inputBase}>
                    <option value="Hot">Hot</option>
                    <option value="Warm">Warm</option>
                    <option value="Cold">Cold</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Total Score</label>
                  <input
                    type="number"
                    step="0.1"
                    name="total_score"
                    value={formData.total_score}
                    onChange={handleInputChange}
                    className={inputBase}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Engagement</label>
                  <input
                    type="number"
                    name="engagement_score"
                    value={formData.engagement_score}
                    onChange={handleInputChange}
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Behavioral</label>
                  <input
                    type="number"
                    name="behavioral_score"
                    value={formData.behavioral_score}
                    onChange={handleInputChange}
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Demographic</label>
                  <input
                    type="number"
                    name="demographic_score"
                    value={formData.demographic_score}
                    onChange={handleInputChange}
                    className={inputBase}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Email Opens</label>
                  <input
                    type="number"
                    name="email_opens"
                    value={formData.email_opens}
                    onChange={handleInputChange}
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-slate-700">Link Clicks</label>
                  <input
                    type="number"
                    name="link_clicks"
                    value={formData.link_clicks}
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
                Save Score
              </button>
            </div>
          </form>
        </>
      )}

    </div>
  )
}

export default LeadScoringTable
