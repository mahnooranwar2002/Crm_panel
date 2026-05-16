'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { FiPlus, FiEdit2, FiX, FiEye } from 'react-icons/fi'
import { Appointment, getAllAppointments, createAppointment, updateAppointment } from '@/src/services/medical/appointmentService'

function AppointmentSidebarForm({
  initial,
  onClose,
  onSuccess,
}: {
  initial: Partial<Appointment> | null
  onClose: () => void
  onSuccess: () => void
}) {
  const isEdit = !!initial?.id

  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    patientName: initial?.patientName ?? '',
    providerName: initial?.providerName ?? '',
    appointmentDate: initial?.appointmentDate ?? '',
    startTime: initial?.startTime ?? '',
    endTime: initial?.endTime ?? '',
    appointmentType: (initial?.appointmentType as any) ?? 'New Patient',
    reasonForVisit: initial?.reasonForVisit ?? '',
    status: (initial?.status as any) ?? 'Scheduled',
    notes: initial?.notes ?? '',
  })

  const canSubmit = useMemo(() => {
    return (
      form.patientName.trim().length > 0 &&
      form.providerName.trim().length > 0 &&
      form.appointmentDate.trim().length > 0 &&
      form.startTime.trim().length > 0 &&
      form.endTime.trim().length > 0 &&
      form.reasonForVisit.trim().length > 0
    )
  }, [form])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    setLoading(true)
    try {
      if (isEdit && initial?.id) {
        await updateAppointment(initial.id, {
          patientName: form.patientName,
          providerName: form.providerName,
          appointmentDate: form.appointmentDate,
          startTime: form.startTime,
          endTime: form.endTime,
          appointmentType: form.appointmentType,
          reasonForVisit: form.reasonForVisit,
          status: form.status,
          notes: form.notes || undefined,
        } as any)
      } else {
        // createAppointment expects: Omit<Appointment, 'id' | 'appointmentId' | 'createdAt' | 'updatedAt'>
        await createAppointment({
          patientId: 'PAT001',
          patientName: form.patientName,
          providerId: 'PROV001',
          providerName: form.providerName,
          appointmentDate: form.appointmentDate,
          startTime: form.startTime,
          endTime: form.endTime,
          appointmentType: form.appointmentType,
          status: form.status,
          reasonForVisit: form.reasonForVisit,
          notes: form.notes || undefined,
        } as any)
      }
      onSuccess()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Patient Name</label>
        <input
          name="patientName"
          value={form.patientName}
          onChange={handleChange}
          className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-700 transition-all"
          placeholder="e.g., John Doe"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Provider Name</label>
        <input
          name="providerName"
          value={form.providerName}
          onChange={handleChange}
          className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-700 transition-all"
          placeholder="e.g., Dr. Sarah Smith"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
          <input
            type="date"
            name="appointmentDate"
            value={form.appointmentDate}
            onChange={handleChange}
            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-700 transition-all"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-700 transition-all"
          >
            {['Scheduled', 'Confirmed', 'Checked In', 'In Progress', 'Completed', 'Cancelled', 'No Show'].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Start Time</label>
          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-700 transition-all"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">End Time</label>
          <input
            type="time"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-700 transition-all"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Reason for Visit</label>
        <textarea
          name="reasonForVisit"
          value={form.reasonForVisit}
          onChange={handleChange}
          rows={3}
          className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-700 transition-all resize-none"
          placeholder="e.g., Annual physical exam"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Appointment Type</label>
        <select
          name="appointmentType"
          value={form.appointmentType}
          onChange={handleChange}
          className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-700 transition-all"
        >
          {['New Patient', 'Follow-Up', 'Consultation', 'Procedure', 'Telehealth'].map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Notes (optional)</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={2}
          className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-700 transition-all resize-none"
          placeholder="Any extra details"
        />
      </div>

      <div className="flex gap-4 pt-6">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-4 px-6 border-2 border-slate-100 rounded-2xl font-black text-slate-500 hover:bg-slate-50 transition-all uppercase tracking-widest text-xs"
        >
          Discard
        </button>
        <button
          type="submit"
          disabled={loading || !canSubmit}
          className="flex-[2] py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black transition-all shadow-xl shadow-indigo-200 disabled:opacity-50 uppercase tracking-widest text-xs"
        >
          {loading ? 'Processing...' : isEdit ? 'Save Changes' : 'Confirm Appointment'}
        </button>
      </div>
    </form>
  )
}

export function AppointmentTable() {
  const [showSidebar, setShowSidebar] = useState(false)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [editing, setEditing] = useState<Appointment | null>(null)

  const loadAppointments = async () => {
    const data = await getAllAppointments()
    setAppointments(data)
  }

  useEffect(() => {
    loadAppointments()
  }, [])

  return (
    <div className="w-full bg-slate-50 min-h-screen p-6 text-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Appointments</h1>
            <p className="text-slate-500 font-medium mt-1">Schedule, manage, and track patient appointments.</p>
          </div>
          <button
            onClick={() => {
              setEditing(null)
              setShowSidebar(true)
            }}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all font-bold active:scale-95"
          >
            <FiPlus size={20} />
            Schedule Appointment
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Appointment ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Provider</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-slate-400 font-bold">
                      No appointments scheduled
                    </td>
                  </tr>
                ) : (
                  appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50/60 transition-colors group">
                      <td className="px-6 py-4 font-mono text-xs font-bold text-slate-700">{apt.appointmentId}</td>
                      <td className="px-6 py-4 font-bold text-slate-900">{apt.patientName}</td>
                      <td className="px-6 py-4 text-slate-700">{apt.appointmentDate}</td>
                      <td className="px-6 py-4 text-slate-700">{apt.startTime}</td>
                      <td className="px-6 py-4 text-slate-700">{apt.providerName}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="View"
                            onClick={() => setShowSidebar(true)}
                          >
                            <FiEye size={18} />
                          </button>
                          <button
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="Edit"
                            onClick={() => {
                              setEditing(apt)
                              setShowSidebar(true)
                            }}
                          >
                            <FiEdit2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showSidebar && (
        <>
          <div
            className="fixed inset-0 z-[998] bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => {
              setShowSidebar(false)
              setEditing(null)
            }}
          />
          <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl z-[999] animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h2 className="text-2xl font-black text-slate-800">{editing ? 'Edit Appointment' : 'Schedule Appointment'}</h2>
                <button
                  onClick={() => {
                    setShowSidebar(false)
                    setEditing(null)
                  }}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
                >
                  <FiX size={24} />
                </button>
              </div>

              <AppointmentSidebarForm
                initial={editing}
                onClose={() => {
                  setShowSidebar(false)
                  setEditing(null)
                }}
                onSuccess={async () => {
                  await loadAppointments()
                  setShowSidebar(false)
                  setEditing(null)
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default AppointmentTable

