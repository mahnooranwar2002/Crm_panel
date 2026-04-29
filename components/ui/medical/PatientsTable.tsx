'use client'

import React, { useState } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiUser, FiPhone, FiCalendar, FiMapPin, FiActivity, FiClock } from 'react-icons/fi'

// 1. Patients Table Main Component
export function PatientsTable() {
  const [patients, setPatients] = useState([])

  return (
    <div className="w-full bg-slate-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Patient Management</h1>
            <p className="text-slate-500 font-medium mt-1">Directory of registered patients and their clinical status.</p>
          </div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all font-bold active:scale-95">
            <FiPlus size={20} />
            Register New Patient
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <PatientSearch />
        </div>

        {/* Table Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">MRN</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Patient Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">DOB</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Contact</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center opacity-30">
                        <FiUser size={48} className="mb-2 text-slate-400" />
                        <p className="font-bold text-lg">No records found</p>
                        <p className="text-sm font-medium">Try adjusting your search filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  patients.map((patient: any) => (
                    <tr key={patient.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 font-mono text-sm text-blue-600 font-bold">{patient.mrn}</td>
                      <td className="px-6 py-4 font-bold text-slate-900">{patient.name}</td>
                      <td className="px-6 py-4 text-slate-500 font-medium">{patient.dob}</td>
                      <td className="px-6 py-4 text-slate-500 font-medium">{patient.phone}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button className="text-slate-400 hover:text-blue-600 transition-colors"><FiEdit2 size={18} /></button>
                        <button className="text-slate-400 hover:text-red-600 transition-colors"><FiTrash2 size={18} /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

// 2. Patient Form Component
export function PatientForm() {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Patient Registration</h2>
        <p className="text-slate-500 font-medium">Ensure all demographic information is accurate.</p>
      </div>
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase ml-1">First Name</label>
            <input type="text" placeholder="John" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase ml-1">Last Name</label>
            <input type="text" placeholder="Doe" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase ml-1 flex items-center gap-1"><FiCalendar /> Date of Birth</label>
            <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase ml-1 flex items-center gap-1"><FiPhone /> Phone Number</label>
            <input type="tel" placeholder="+1 (555) 000-0000" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase ml-1 flex items-center gap-1"><FiMapPin /> Physical Address</label>
          <textarea placeholder="Street, City, State, ZIP" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" rows={3}></textarea>
        </div>

        <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-slate-200">
          Complete Registration
        </button>
      </form>
    </div>
  )
}

// 3. Patient Detail Component
export function PatientDetail({ patientId }: { patientId: string }) {
  return (
    <div className="space-y-8 max-w-4xl">
      {/* Patient Profile Header */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center font-black text-3xl shadow-inner border border-blue-100">
              JD
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">John Doe</h2>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">MRN: {patientId}</span>
                <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-600 border border-emerald-100">Active</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1 justify-center text-right border-l border-slate-100 pl-6 hidden md:flex">
            <p className="text-xs font-bold text-slate-400 uppercase">Registered Date</p>
            <p className="font-bold text-slate-800">Oct 24, 2025</p>
          </div>
        </div>
      </div>

      {/* Grid for Insurance & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PatientInsuranceCard />
        
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <FiClock className="text-blue-500" />
            Patient Timeline
          </h2>
          <div className="relative pl-6 border-l-2 border-slate-100 space-y-8">
            <TimelineItem title="New Encounter" date="Today, 2:30 PM" color="bg-blue-500" />
            <TimelineItem title="Claim Submitted" date="Yesterday" color="bg-emerald-500" />
            <TimelineItem title="Initial Registration" date="Oct 24, 2025" color="bg-slate-300" />
          </div>
        </div>
      </div>
    </div>
  )
}

function TimelineItem({ title, date, color }: any) {
  return (
    <div className="relative">
      <div className={`absolute -left-[31px] top-1.5 w-3 h-3 rounded-full border-2 border-white ${color}`}></div>
      <p className="font-bold text-slate-800 text-sm leading-none">{title}</p>
      <p className="text-xs text-slate-400 font-medium mt-1">{date}</p>
    </div>
  )
}

// 4. Patient Search Component
export function PatientSearch() {
  return (
    <div className="relative group max-w-xl">
      <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
      <input
        type="text"
        placeholder="Search by Name, MRN, or Phone..."
        className="w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm font-medium"
      />
    </div>
  )
}

// 5. Patient Insurance Card Component
export function PatientInsuranceCard() {
  return (
    <div className="bg-slate-900 rounded-3xl text-white p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-10 opacity-10">
        <FiActivity size={100} />
      </div>
      <div className="relative z-10">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-400 mb-8">Primary Coverage</h3>
        <div className="space-y-6">
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Payer</p>
            <p className="text-xl font-bold tracking-tight">Blue Cross Blue Shield</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Policy #</p>
              <p className="font-mono font-bold">POL987654321</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Group #</p>
              <p className="font-mono font-bold">GRP-123456</p>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase">Patient Responsibility</span>
            <span className="text-xl font-black text-blue-400">$25.00 Copay</span>
          </div>
        </div>
      </div>
    </div>
  )
}