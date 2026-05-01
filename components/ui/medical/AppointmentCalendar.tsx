'use client'

import React, { useState, useEffect } from 'react'
import { FiPlus, FiCheckCircle, FiClock, FiAlertCircle, FiCalendar, FiUser, FiUserPlus, FiMapPin, FiEdit2, FiTrash2, FiSearch, FiX, FiPhone, FiMail, FiChevronRight, FiFilter, FiMoreVertical, FiBriefcase, FiCheck } from 'react-icons/fi'
import { getAllAppointments, searchAppointments, deleteAppointment, createAppointment, updateAppointment, getAppointmentsCountByStatus, getAppointmentById, type Appointment } from '@/src/services/medical/appointmentService'

// --- 1. APPOINTMENT DETAIL COMPONENT ---
export function AppointmentDetail({ appointmentId }: { appointmentId: string }) {
  const [appointment, setAppointment] = useState<Appointment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)

  useEffect(() => {
    const loadAppointment = async () => {
      try {
        setLoading(true)
        const data = await getAppointmentById(appointmentId)
        if (data) {
          setAppointment(data)
        } else {
          setError('Appointment not found')
        }
      } catch (err) {
        setError('Failed to load appointment')
        console.error('Failed to load appointment:', err)
      } finally {
        setLoading(false)
      }
    }
    loadAppointment()
  }, [appointmentId])

  const handleEditAppointment = async (updatedData: any) => {
    if (!editingAppointment) return
    try {
      const updated = await updateAppointment(editingAppointment.id, updatedData)
      if (updated) {
        setAppointment(updated)
        setEditingAppointment(null)
      }
    } catch (error) {
      console.error('Failed to update appointment:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 font-sans">
        <div className="flex flex-col items-center justify-center py-24">
          <div className="animate-spin w-10 h-10 border-[3px] border-blue-100 border-t-blue-600 rounded-full mb-4"></div>
          <p className="text-slate-400 font-bold tracking-tight">Loading appointment...</p>
        </div>
      </div>
    )
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 font-sans">
        <div className="flex flex-col items-center justify-center py-24">
          <FiAlertCircle size={60} className="text-red-300 mb-4" />
          <p className="text-xl font-bold text-slate-900">{error || 'Appointment not found'}</p>
          <p className="text-slate-500 mt-1 font-medium">The appointment you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Appointment Details</h1>
            <p className="text-slate-500 font-medium mt-1">View and manage appointment information.</p>
          </div>
          <button 
            onClick={() => setEditingAppointment(appointment)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-700 shadow-md shadow-blue-200 transition-all active:scale-95 font-semibold"
          >
            <FiEdit2 size={20} />
            Edit Appointment
          </button>
        </div>

        {/* Appointment Details Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-100/50 p-8">
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-100">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center font-black text-3xl border-2 border-white shadow-inner">
              {appointment.patientName.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 leading-none">{appointment.patientName}</h3>
              <p className="text-blue-600 font-mono font-bold mt-2 text-sm tracking-tighter bg-blue-50 inline-block px-2 py-0.5 rounded-lg border border-blue-100">
                ID: {appointment.patientId}
              </p>
              <p className="text-slate-500 text-xs mt-1">Status: <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${
                appointment.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                appointment.status === 'Scheduled' ? 'bg-blue-50 text-blue-700' :
                appointment.status === 'Confirmed' ? 'bg-green-50 text-green-700' :
                appointment.status === 'Cancelled' ? 'bg-red-50 text-red-700' :
                'bg-slate-100 text-slate-500'
              }`}>{appointment.status}</span></p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Name</span>
              <p className="font-bold text-slate-800 text-sm mt-1">{appointment.patientName}</p>
            </div>
            <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient ID</span>
              <p className="font-bold text-slate-800 text-sm mt-1">{appointment.patientId}</p>
            </div>
            <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Provider Name</span>
              <p className="font-bold text-slate-800 text-sm mt-1">{appointment.providerName}</p>
            </div>
            <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Provider ID</span>
              <p className="font-bold text-slate-800 text-sm mt-1">{appointment.providerId}</p>
            </div>
            <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Appointment Type</span>
              <p className="font-bold text-slate-800 text-sm mt-1">{appointment.appointmentType}</p>
            </div>
            <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</span>
              <p className="font-bold text-slate-800 text-sm mt-1">{new Date(appointment.appointmentDate).toLocaleDateString()}</p>
            </div>
            <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time</span>
              <p className="font-bold text-slate-800 text-sm mt-1">{appointment.startTime} - {appointment.endTime}</p>
            </div>
            <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reason for Visit</span>
              <p className="font-bold text-slate-800 text-sm mt-1">{appointment.reasonForVisit}</p>
            </div>
          </div>

          {appointment.notes && (
            <div className="mt-6 p-5 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Notes</span>
              <p className="text-slate-700 font-medium mt-2">{appointment.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingAppointment && (
        <ModalWrapper title="Update Appointment" onClose={() => setEditingAppointment(null)}>
          <AppointmentForm 
            appointment={editingAppointment} 
            isEdit 
            onSubmit={handleEditAppointment} 
            onClose={() => setEditingAppointment(null)} 
          />
        </ModalWrapper>
      )}
    </div>
  )
}

// --- 2. MAIN APPOINTMENT CALENDAR COMPONENT ---
export function AppointmentCalendar() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [viewingAppointment, setViewingAppointment] = useState<Appointment | null>(null)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [stats, setStats] = useState({ scheduled: 0, confirmed: 0, completed: 0 })

  // Initial Data Fetch
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true)
        const data = await getAllAppointments()
        setAppointments(data)
        setFilteredAppointments(data)
        
        // Load stats
        const scheduled = await getAppointmentsCountByStatus('Scheduled')
        const confirmed = await getAppointmentsCountByStatus('Confirmed')
        const completed = await getAppointmentsCountByStatus('Completed')
        setStats({ scheduled, confirmed, completed })
      } catch (error) {
        console.error('Failed to load appointments:', error)
      } finally {
        setLoading(false)
      }
    }
    loadAppointments()
  }, [])

  // Search Logic
  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.trim() === '') {
      setFilteredAppointments(appointments)
    } else {
      const results = await searchAppointments(query)
      setFilteredAppointments(results)
    }
  }

  // Delete Logic
  const handleDeleteAppointment = async (id: string) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await deleteAppointment(id)
        const updated = appointments.filter(a => a.id !== id)
        setAppointments(updated)
        setFilteredAppointments(updated)
        
        if (viewingAppointment?.id === id) setViewingAppointment(null)
        if (editingAppointment?.id === id) setEditingAppointment(null)
      } catch (error) {
        console.error('Failed to cancel appointment:', error)
      }
    }
  }

  // Create Logic
  const handleCreateAppointment = async (newAppointmentData: any) => {
    try {
      const newAppointment = await createAppointment(newAppointmentData)
      setAppointments(prev => [...prev, newAppointment])
      setFilteredAppointments(prev => [...prev, newAppointment])
      setShowCreateModal(false)
    } catch (error) {
      console.error('Failed to create appointment:', error)
    }
  }

  // Edit Logic
  const handleEditAppointment = async (updatedData: any) => {
    if (!editingAppointment) return
    try {
      const updated = await updateAppointment(editingAppointment.id, updatedData)
      if (updated) {
        const updateList = (list: Appointment[]) => 
          list.map(a => a.id === editingAppointment.id ? updated : a)
        
        setAppointments(updateList(appointments))
        setFilteredAppointments(updateList(filteredAppointments))
        setEditingAppointment(null)
      }
    } catch (error) {
      console.error('Failed to update appointment:', error)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Appointment Scheduling</h1>
            <p className="text-slate-500 font-medium mt-1">Manage and schedule patient appointments efficiently.</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-700 shadow-md shadow-blue-200 transition-all active:scale-95 font-semibold"
          >
            <FiPlus size={20} />
            Book Appointment
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard label="Scheduled" value={stats.scheduled} icon={FiCalendar} color="blue" />
          <StatCard label="Confirmed" value={stats.confirmed} icon={FiCheckCircle} color="green" />
          <StatCard label="Completed" value={stats.completed} icon={FiCheck} color="emerald" />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input
              type="text"
              placeholder="Search by patient name, provider, status, or date..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all shadow-sm font-medium"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-100/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Patient Info</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Provider</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Date & Time</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Type</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Status</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-24 text-center">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin w-10 h-10 border-[3px] border-blue-100 border-t-blue-600 rounded-full mb-4"></div>
                        <p className="text-slate-400 font-bold tracking-tight">Loading appointments...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-24 text-center">
                      <div className="flex flex-col items-center opacity-40">
                        <FiCalendar size={60} className="text-slate-300 mb-4" />
                        <p className="text-xl font-bold text-slate-900">No Appointments Found</p>
                        <p className="text-slate-500 mt-1 font-medium">Try refining your search or schedule a new appointment.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-blue-50/40 transition-colors group cursor-default">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-bold text-slate-600 uppercase text-xs">
                            {appointment.patientName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{appointment.patientName}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{appointment.reasonForVisit}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="font-semibold text-slate-700 text-sm">{appointment.providerName}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{appointment.appointmentType}</p>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-slate-900 text-sm">{new Date(appointment.appointmentDate).toLocaleDateString()}</span>
                          <span className="text-xs text-slate-500 font-mono">{appointment.startTime} - {appointment.endTime}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg w-fit">
                          {appointment.appointmentType}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          appointment.status === 'Completed' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : appointment.status === 'Scheduled'
                            ? 'bg-blue-50 text-blue-700 border-blue-100'
                            : appointment.status === 'Confirmed'
                            ? 'bg-green-50 text-green-700 border-green-100'
                            : appointment.status === 'Cancelled'
                            ? 'bg-red-50 text-red-700 border-red-100'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <button onClick={() => setViewingAppointment(appointment)} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm">
                            <FiUser size={18} />
                          </button>
                          <button onClick={() => setEditingAppointment(appointment)} className="p-2.5 text-slate-400 hover:text-amber-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm">
                            <FiEdit2 size={18} />
                          </button>
                          <button onClick={() => handleDeleteAppointment(appointment.id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm">
                            <FiTrash2 size={18} />
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

        {/* --- MODALS SECTION --- */}
        {showCreateModal && (
          <ModalWrapper title="Book New Appointment" onClose={() => setShowCreateModal(false)}>
            <AppointmentForm 
              onSubmit={handleCreateAppointment} 
              onClose={() => setShowCreateModal(false)} 
            />
          </ModalWrapper>
        )}

        {viewingAppointment && (
          <ModalWrapper title="Appointment Details" onClose={() => setViewingAppointment(null)}>
            <AppointmentView 
              appointment={viewingAppointment} 
              onEdit={() => { 
                setEditingAppointment(viewingAppointment); 
                setViewingAppointment(null); 
              }} 
            />
          </ModalWrapper>
        )}

        {editingAppointment && (
          <ModalWrapper title="Update Appointment" onClose={() => setEditingAppointment(null)}>
            <AppointmentForm 
              appointment={editingAppointment} 
              isEdit 
              onSubmit={handleEditAppointment} 
              onClose={() => setEditingAppointment(null)} 
            />
          </ModalWrapper>
        )}
      </div>
    </div>
  )
}

// --- 2. MODAL WRAPPER ---
function ModalWrapper({ children, title, onClose }: { children: React.ReactNode, title: string, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl transition-opacity duration-300" 
        onClick={onClose} 
        aria-hidden="true"
      />
      
      <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-[2.5rem] shadow-2xl border border-white/20 flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white/50 backdrop-blur-md">
          <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase text-[13px] tracking-[0.05em]">{title}</h2>
          <button 
            onClick={onClose} 
            className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all active:scale-90"
          >
            <FiX size={24} />
          </button>
        </div>
        
        <div className="p-8 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  )
}

// --- 3. APPOINTMENT FORM (CREATE/EDIT) ---
export function AppointmentForm({ appointment, isEdit, onSubmit, onClose }: any) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    patientName: appointment?.patientName || '',
    patientId: appointment?.patientId || '',
    providerName: appointment?.providerName || '',
    providerId: appointment?.providerId || '',
    appointmentDate: appointment?.appointmentDate || '',
    startTime: appointment?.startTime || '',
    endTime: appointment?.endTime || '',
    appointmentType: appointment?.appointmentType || 'Follow-Up',
    status: appointment?.status || 'Scheduled',
    reasonForVisit: appointment?.reasonForVisit || '',
    notes: appointment?.notes || '',
  })

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(formData)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Patient Information */}
      <div>
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Patient Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Patient Name" name="patientName" value={formData.patientName} onChange={handleChange} required />
          <Input label="Patient ID" name="patientId" value={formData.patientId} onChange={handleChange} required />
        </div>
      </div>

      {/* Provider Information */}
      <div>
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Provider Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Provider Name" name="providerName" value={formData.providerName} onChange={handleChange} required />
          <Input label="Provider ID" name="providerId" value={formData.providerId} onChange={handleChange} required />
        </div>
      </div>

      {/* Appointment Details */}
      <div>
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Appointment Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Date" name="appointmentDate" type="date" value={formData.appointmentDate} onChange={handleChange} required />
          <SelectInput label="Type" name="appointmentType" value={formData.appointmentType} onChange={handleChange} options={['New Patient', 'Follow-Up', 'Consultation', 'Procedure', 'Telehealth']} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Input label="Start Time" name="startTime" type="time" value={formData.startTime} onChange={handleChange} required />
          <Input label="End Time" name="endTime" type="time" value={formData.endTime} onChange={handleChange} required />
        </div>
      </div>

      {/* Reason & Notes */}
      <div>
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Reason & Notes</h3>
        <div className="mb-6">
          <Input label="Reason for Visit" name="reasonForVisit" value={formData.reasonForVisit} onChange={handleChange} placeholder="Chief complaint or reason for visit" required />
        </div>
        <div>
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Additional Notes</label>
          <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-medium text-slate-700 resize-none mt-2 focus:border-blue-500 transition-all"></textarea>
        </div>
      </div>

      {/* Status */}
      <div>
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Status</h3>
        <SelectInput label="Status" name="status" value={formData.status} onChange={handleChange} options={['Scheduled', 'Confirmed', 'Checked In', 'In Progress', 'Completed', 'Cancelled', 'No Show']} />
      </div>

      <div className="flex gap-4 pt-6">
        <button type="button" onClick={onClose} className="flex-1 py-4 px-6 border-2 border-slate-100 rounded-2xl font-black text-slate-500 hover:bg-slate-50 transition-all uppercase tracking-widest text-xs">Discard</button>
        <button type="submit" disabled={loading} className="flex-[2] py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black transition-all shadow-xl shadow-blue-200 disabled:opacity-50 uppercase tracking-widest text-xs">
          {loading ? 'Processing...' : isEdit ? 'Save Changes' : 'Book Appointment'}
        </button>
      </div>
    </form>
  )
}

// --- 4. APPOINTMENT VIEW ---
function AppointmentView({ appointment, onEdit }: any) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center font-black text-3xl border-2 border-white shadow-inner">
          {appointment.patientName.split(' ').map((n: string) => n[0]).join('')}
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900 leading-none">{appointment.patientName}</h3>
          <p className="text-blue-600 font-mono font-bold mt-2 text-sm tracking-tighter bg-blue-50 inline-block px-2 py-0.5 rounded-lg border border-blue-100">
            ID: {appointment.patientId}
          </p>
          <p className="text-slate-500 text-xs mt-1">Status: <span className="font-bold text-slate-700">{appointment.status}</span></p>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Appointment Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <DetailCard label="Type" value={appointment.appointmentType} />
          <DetailCard label="Date" value={new Date(appointment.appointmentDate).toLocaleDateString()} />
          <DetailCard label="Time" value={`${appointment.startTime} - ${appointment.endTime}`} />
          <DetailCard label="Provider" value={appointment.providerName} />
          <DetailCard label="Reason" value={appointment.reasonForVisit} />
          <DetailCard label="Status" value={appointment.status} />
        </div>
      </div>

      {appointment.notes && (
        <div>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Notes</h3>
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <p className="text-slate-700 font-medium">{appointment.notes}</p>
          </div>
        </div>
      )}

      <button onClick={onEdit} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all">
        Edit Appointment
      </button>
    </div>
  )
}

// --- HELPER COMPONENTS ---
function Input({ label, icon, ...props }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
        {icon && React.cloneElement(icon, { size: 12 })} {label}
      </label>
      <input 
        {...props} 
        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-700 transition-all placeholder:text-slate-300" 
      />
    </div>
  )
}

function DetailCard({ label, value }: any) {
  return (
    <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      <p className="font-bold text-slate-800 text-sm mt-1">{value}</p>
    </div>
  )
}

function SelectInput({ label, name, value, onChange, options }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <select 
        name={name}
        value={value} 
        onChange={onChange} 
        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-700 transition-all"
      >
        {options.map((opt: string) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  )
}

// Sub-component for Stats
function StatCard({ label, value, icon: Icon, color }: any) {
  const colors: any = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    emerald: 'text-emerald-600 bg-emerald-50',
    amber: 'text-amber-600 bg-amber-50',
  }
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all group">
      <div className={`w-12 h-12 rounded-xl ${colors[color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-extrabold text-slate-900">{value}</p>
    </div>
  )
}