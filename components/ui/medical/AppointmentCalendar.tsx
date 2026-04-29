'use client'

import React, { useState } from 'react'
import { FiPlus, FiCheckCircle, FiClock, FiAlertCircle, FiCalendar, FiUser, FiUserPlus, FiMapPin } from 'react-icons/fi'

// 1. Appointment Calendar Main Component
export function AppointmentCalendar() {
  const [appointments, setAppointments] = useState([])

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Appointment Scheduling</h1>
            <p className="text-slate-500 font-medium mt-1">Organize and manage your patient visits effectively.</p>
          </div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-700 shadow-md shadow-blue-200 transition-all active:scale-95 font-semibold">
            <FiPlus size={20} />
            Book Appointment
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard label="Total Appointments" value="12" icon={FiCalendar} color="blue" />
          <StatCard label="Confirmed" value="10" icon={FiCheckCircle} color="green" />
          <StatCard label="Pending" value="2" icon={FiClock} color="amber" />
        </div>

        {/* Calendar Placeholder */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
             <h2 className="text-lg font-bold text-slate-800">Weekly Schedule</h2>
          </div>
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <div className="p-4 bg-slate-50 rounded-full mb-4">
              <FiCalendar size={48} className="text-slate-300" />
            </div>
            <p className="font-medium">Calendar view is being initialized...</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Sub-component for Stats to keep code clean
function StatCard({ label, value, icon: Icon, color }: any) {
  const colors: any = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
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

// 2. Appointment Form Component
export function AppointmentForm() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">New Appointment</h2>
        <p className="text-slate-500 text-sm">Please fill in the patient and visit details.</p>
      </div>
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Patient Name</label>
            <input type="text" placeholder="John Doe" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Healthcare Provider</label>
            <input type="text" placeholder="Dr. Smith" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Date</label>
            <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Time</label>
            <input type="time" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Appointment Type</label>
          <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none">
            <option>Select Type</option>
            <option>New Patient</option>
            <option>Follow-Up</option>
            <option>Telehealth</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Reason for Visit</label>
          <textarea placeholder="Describe symptoms..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" rows={4}></textarea>
        </div>

        <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-colors shadow-lg active:scale-[0.98]">
          Confirm Booking
        </button>
      </form>
    </div>
  )
}

// 3. Appointment Status Badge Component
export function AppointmentStatusBadge({ status }: { status: string }) {
  const statusConfig: any = {
    scheduled: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', icon: FiClock },
    confirmed: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', icon: FiCheckCircle },
    cancelled: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100', icon: FiAlertCircle },
  }

  const config = statusConfig[status] || statusConfig.scheduled
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-tighter border ${config.bg} ${config.text} ${config.border}`}>
      <Icon size={12} strokeWidth={3} />
      {status}
    </span>
  )
}

// 4. Check-In Modal Component
export function CheckInModal({ appointmentId, onClose }: { appointmentId: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full border border-slate-100 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <FiUserPlus size={24} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Patient Check-In</h2>
        </div>
        
        <div className="space-y-6">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Appointment ID</label>
            <p className="text-lg font-mono font-bold text-slate-800">{appointmentId}</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase">Check-In Time</label>
            <input type="time" defaultValue="14:30" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase">Vital Notes</label>
            <textarea placeholder="Temperature, BP, etc." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" rows={3}></textarea>
          </div>

          <div className="flex gap-4 pt-2">
            <button onClick={onClose} className="flex-1 px-4 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors">
              Cancel
            </button>
            <button className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
              Complete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// 5. Appointment Detail Component
export function AppointmentDetail({ appointmentId }: { appointmentId: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Details</h2>
          <p className="text-slate-500 text-sm uppercase font-bold tracking-widest mt-1">ID: {appointmentId}</p>
        </div>
        <AppointmentStatusBadge status="confirmed" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-slate-50 rounded-xl text-slate-400">
            <FiCalendar size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Date</p>
            <p className="font-bold text-slate-800">April 25, 2026</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-slate-50 rounded-xl text-slate-400">
            <FiClock size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Time Slot</p>
            <p className="font-bold text-slate-800">09:00 AM - 09:30 AM</p>
          </div>
        </div>
      </div>
    </div>
  )
}