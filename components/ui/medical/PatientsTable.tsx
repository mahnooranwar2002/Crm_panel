'use client'

import React, { useState, useEffect } from 'react'
import { 
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiUser, FiPhone, 
  FiCalendar, FiMapPin, FiActivity, FiClock, FiX, FiMail, 
  FiChevronRight, FiFilter, FiMoreVertical 
} from 'react-icons/fi'
import { 
  getAllPatients, searchPatients, deletePatient, createPatient, type Patient 
} from '@/src/services/medical/patientService'

// --- 1. MAIN PATIENTS TABLE COMPONENT ---
export function PatientsTable() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)

  // Load data on mount[cite: 1]
  useEffect(() => {
    const loadPatients = async () => {
      try {
        setLoading(true)
        const data = await getAllPatients()
        setPatients(data)
        setFilteredPatients(data)
      } catch (error) {
        console.error('Failed to load patients:', error)
      } finally {
        setLoading(false)
      }
    }
    loadPatients()
  }, [])

  // Search Logic[cite: 1]
  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.trim() === '') {
      setFilteredPatients(patients)
    } else {
      const results = await searchPatients(query)
      setFilteredPatients(results)
    }
  }

  // Delete Logic[cite: 1]
  const handleDeletePatient = async (id: string) => {
    if (confirm('Are you sure you want to delete this patient record permanently?')) {
      try {
        await deletePatient(id)
        const updated = patients.filter(p => p.id !== id)
        setPatients(updated)
        setFilteredPatients(updated)
        setViewingPatient(null)
        setEditingPatient(null)
      } catch (error) {
        console.error('Failed to delete patient:', error)
      }
    }
  }

  // Create Logic[cite: 1]
  const handleCreatePatient = async (newPatientData: any) => {
    try {
      const newPatient = await createPatient(newPatientData)
      setPatients(prev => [...prev, newPatient])
      setFilteredPatients(prev => [...prev, newPatient])
      setShowCreateModal(false)
    } catch (error) {
      console.error('Failed to create patient:', error)
    }
  }

  // Edit Logic[cite: 1]
  const handleEditPatient = async (updatedData: any) => {
    if (!editingPatient) return
    try {
      const updatedPatient = { ...editingPatient, ...updatedData }
      const updateList = (list: Patient[]) => list.map(p => p.id === editingPatient.id ? updatedPatient : p)
      setPatients(updateList(patients))
      setFilteredPatients(updateList(filteredPatients))
      setEditingPatient(null)
    } catch (error) {
      console.error('Failed to update patient:', error)
    }
  }

  return (
    <div className="w-full bg-[#fcfdfe] min-h-screen p-4 md:p-10 text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Patient Management</h1>
            <p className="text-slate-500 font-medium mt-1">
              Centralized directory for clinical records and patient statuses.
              <span className="ml-2 text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full text-xs font-bold">
                {filteredPatients.length} Records
              </span>
            </p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 active:scale-95"
          >
            <FiPlus size={20} />
            Register Patient
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="text"
              placeholder="Search by name, MRN, or phone number..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none transition-all shadow-sm font-medium"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm">
            <FiFilter /> Filters
          </button>
        </div>

        {/* Table Card[cite: 1] */}
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-100/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Patient Details</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">MRN</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Contact Info</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Clinical Status</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-24 text-center">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin w-10 h-10 border-[3px] border-indigo-100 border-t-indigo-600 rounded-full mb-4"></div>
                        <p className="text-slate-400 font-bold tracking-tight">Synchronizing data...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-24 text-center">
                      <div className="flex flex-col items-center opacity-40">
                        <FiUser size={60} className="text-slate-300 mb-4" />
                        <p className="text-xl font-bold text-slate-900">No Patient Records Found</p>
                        <p className="text-slate-500 mt-1 font-medium">Try refining your search or add a new profile.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-indigo-50/40 transition-colors group cursor-default">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-bold text-slate-600 border border-white shadow-sm">
                            {patient.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-base">{patient.name}</p>
                            <p className="text-xs font-bold text-slate-400 uppercase mt-0.5">{patient.gender} • {patient.dob}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                          {patient.mrn}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <FiPhone className="text-slate-400" size={14} /> {patient.phone}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
                            <FiMail className="text-slate-300" size={14} /> {patient.email || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          patient.status === 'Active' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}>
                          {patient.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <button onClick={() => setViewingPatient(patient)} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm">
                            <FiUser size={18} />
                          </button>
                          <button onClick={() => setEditingPatient(patient)} className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm">
                            <FiEdit2 size={18} />
                          </button>
                          <button onClick={() => handleDeletePatient(patient.id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm">
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
      </div>

      {/* --- VIEW PATIENT SIDEBAR --- */}
      {viewingPatient && (
        <>
          <div className="fixed inset-0 z-[998] bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setViewingPatient(null)} />
          <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl z-[999] animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h2 className="text-2xl font-black text-slate-800">Patient Details</h2>
                <button onClick={() => setViewingPatient(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                  <FiX size={24} />
                </button>
              </div>
              <PatientView patient={viewingPatient} onEdit={() => { setEditingPatient(viewingPatient); setViewingPatient(null); }} />
            </div>
          </div>
        </>
      )}

      {/* --- EDIT/CREATE PATIENT SIDEBAR --- */}
      {(showCreateModal || editingPatient) && (
        <>
          <div className="fixed inset-0 z-[998] bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => { setShowCreateModal(false); setEditingPatient(null); }} />
          <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl z-[999] animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h2 className="text-2xl font-black text-slate-800">{editingPatient ? 'Edit Patient' : 'Register Patient'}</h2>
                <button onClick={() => { setShowCreateModal(false); setEditingPatient(null); }} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                  <FiX size={24} />
                </button>
              </div>
              <PatientForm patient={editingPatient} isEdit={!!editingPatient} onSubmit={editingPatient ? handleEditPatient : handleCreatePatient} onClose={() => { setShowCreateModal(false); setEditingPatient(null); }} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}



// --- 3. REUSABLE FORM COMPONENT (CREATE/EDIT)[cite: 1] ---
export function PatientForm({ patient, isEdit, onSubmit, onClose }: any) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: patient?.firstName || '',
    lastName: patient?.lastName || '',
    dob: patient?.dob || '',
    phone: patient?.phone || '',
    email: patient?.email || '',
    gender: patient?.gender || 'Male',
    bloodType: patient?.bloodType || 'O+',
    address: patient?.address || '',
    city: patient?.city || '',
    state: patient?.state || '',
    zipCode: patient?.zipCode || '',
    occupation: patient?.occupation || '',
    maritalStatus: patient?.maritalStatus || 'Single',
    primaryInsuranceName: patient?.primaryInsuranceName || '',
    primaryPolicyNumber: patient?.primaryPolicyNumber || '',
    secondaryInsuranceName: patient?.secondaryInsuranceName || '',
    secondaryPolicyNumber: patient?.secondaryPolicyNumber || '',
    primaryProviderName: patient?.primaryProviderName || '',
    emergencyContact: patient?.emergencyContact || '',
    emergencyPhone: patient?.emergencyPhone || '',
    emergencyRelationship: patient?.emergencyRelationship || '',
  })

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit({ ...formData, name: `${formData.firstName} ${formData.lastName}` })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Personal Information */}
      <div>
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
          <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
        </div>
      </div>
      
      {/* Demographics */}
      <div>
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Demographics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} required icon={<FiCalendar />} />
          <SelectInput label="Gender" name="gender" value={formData.gender} onChange={handleChange} options={['Male', 'Female', 'Other']} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Input label="Occupation" name="occupation" value={formData.occupation} onChange={handleChange} />
          <SelectInput label="Marital Status" name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} options={['Single', 'Married', 'Divorced', 'Widowed']} />
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Primary Phone" name="phone" value={formData.phone} onChange={handleChange} required icon={<FiPhone />} />
          <Input label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} icon={<FiMail />} />
        </div>
        <div className="mt-6">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Residential Address</label>
          <textarea name="address" value={formData.address} onChange={handleChange} rows={2} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none font-bold text-slate-700 resize-none mt-2"></textarea>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6">
          <Input label="City" name="city" value={formData.city} onChange={handleChange} />
          <Input label="State" name="state" value={formData.state} onChange={handleChange} maxLength="2" />
          <Input label="ZIP Code" name="zipCode" value={formData.zipCode} onChange={handleChange} />
        </div>
      </div>

      {/* Medical Information */}
      <div>
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Medical Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectInput label="Blood Type" name="bloodType" value={formData.bloodType} onChange={handleChange} options={['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']} />
          <Input label="Primary Care Provider" name="primaryProviderName" value={formData.primaryProviderName} onChange={handleChange} placeholder="Dr. Name" />
        </div>
      </div>

      {/* Insurance Information */}
      <div>
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Insurance Information</h3>
        <div className="space-y-6">
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Primary Insurance</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              <Input label="Insurance Name" name="primaryInsuranceName" value={formData.primaryInsuranceName} onChange={handleChange} placeholder="e.g., Blue Cross Blue Shield" />
              <Input label="Policy Number" name="primaryPolicyNumber" value={formData.primaryPolicyNumber} onChange={handleChange} placeholder="e.g., POL-987654321" />
            </div>
          </div>
          <div>
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Secondary Insurance</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              <Input label="Insurance Name" name="secondaryInsuranceName" value={formData.secondaryInsuranceName} onChange={handleChange} placeholder="e.g., Aetna" />
              <Input label="Policy Number" name="secondaryPolicyNumber" value={formData.secondaryPolicyNumber} onChange={handleChange} placeholder="e.g., POL-456789012" />
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div>
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Emergency Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input label="Contact Name" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} />
          <Input label="Phone Number" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange} icon={<FiPhone />} />
          <SelectInput label="Relationship" name="emergencyRelationship" value={formData.emergencyRelationship} onChange={handleChange} options={['Spouse', 'Parent', 'Sibling', 'Child', 'Friend', 'Other']} />
        </div>
      </div>

      <div className="flex gap-4 pt-6">
        <button type="button" onClick={onClose} className="flex-1 py-4 px-6 border-2 border-slate-100 rounded-2xl font-black text-slate-500 hover:bg-slate-50 transition-all uppercase tracking-widest text-xs">Discard</button>
        <button type="submit" disabled={loading} className="flex-[2] py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black transition-all shadow-xl shadow-indigo-200 disabled:opacity-50 uppercase tracking-widest text-xs">
          {loading ? 'Processing...' : isEdit ? 'Save Changes' : 'Confirm Registration'}
        </button>
      </div>
    </form>
  )
}

// --- 4. VIEW COMPONENT[cite: 1] ---
function PatientView({ patient, onEdit }: any) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-2xl">
          {patient.name.split(' ').map((n: string) => n[0]).join('')}
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-900 leading-none">{patient.name}</h3>
          <p className="text-indigo-600 font-mono text-xs font-bold mt-1">MRN: {patient.mrn}</p>
          <p className="text-slate-500 text-xs mt-1">{patient.status}</p>
        </div>
      </div>

      {/* Demographics */}
      <div className="space-y-3">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Date of Birth</p>
          <p className="font-bold text-slate-700">{patient.dob}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Gender</p>
          <p className="font-bold text-slate-700">{patient.gender}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Blood Type</p>
          <p className="font-bold text-slate-700">{patient.bloodType || 'Not specified'}</p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-3">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Phone</p>
          <p className="font-bold text-slate-700">{patient.phone}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Email</p>
          <p className="font-bold text-slate-700">{patient.email || 'Not provided'}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Address</p>
          <p className="font-bold text-slate-700 text-sm">{patient.address}, {patient.city}, {patient.state} {patient.zipCode}</p>
        </div>
      </div>

      {/* Insurance */}
      {patient.primaryInsuranceName && (
        <div className="space-y-3">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Primary Insurance</p>
            <p className="font-bold text-slate-700">{patient.primaryInsuranceName}</p>
            <p className="text-xs text-slate-500 font-mono mt-1">Policy: {patient.primaryPolicyNumber}</p>
          </div>
          {patient.secondaryInsuranceName && (
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Secondary Insurance</p>
              <p className="font-bold text-slate-700">{patient.secondaryInsuranceName}</p>
              <p className="text-xs text-slate-500 font-mono mt-1">Policy: {patient.secondaryPolicyNumber}</p>
            </div>
          )}
        </div>
      )}

      {/* Medical Information */}
      {patient.medicalHistory && patient.medicalHistory.length > 0 && (
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Medical History</p>
          <div className="space-y-2">
            {patient.medicalHistory.map((item: string, idx: number) => (
              <div key={idx} className="text-sm font-semibold text-slate-700">• {item}</div>
            ))}
          </div>
        </div>
      )}

      {/* Allergies */}
      {patient.allergies && patient.allergies.length > 0 && (
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Known Allergies</p>
          <div className="text-sm text-slate-700">
            {patient.allergies.join(', ')}
          </div>
        </div>
      )}

      {/* Provider */}
      {patient.primaryProviderName && (
        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Primary Care Provider</p>
          <p className="font-bold text-slate-700">{patient.primaryProviderName}</p>
        </div>
      )}

      {/* Emergency Contact */}
      {patient.emergencyContact && (
        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Emergency Contact</p>
          <p className="font-bold text-slate-700">{patient.emergencyContact}</p>
          <p className="text-xs text-slate-600 mt-1">{patient.emergencyPhone}</p>
        </div>
      )}

      <button onClick={onEdit} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold uppercase text-xs hover:bg-indigo-700 transition-all mt-4">
        Edit Information
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
        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-700 transition-all placeholder:text-slate-300" 
      />
    </div>
  )
}

function DetailCard({ icon, label, value }: any) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-indigo-500">{icon}</span>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      </div>
      <p className="font-bold text-slate-800 text-sm">{value}</p>
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
        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-700 transition-all"
      >
        {options.map((opt: string) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  )
}

// --- 5. STANDALONE PATIENT DETAIL COMPONENT (FOR PAGE USE) ---
export function PatientDetail({ patientId }: { patientId: string }) {
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPatient = async () => {
      try {
        setLoading(true)
        const patients = await getAllPatients()
        const found = patients.find((p: Patient) => p.id === patientId)
        if (found) {
          setPatient(found)
        } else {
          setError('Patient not found')
        }
      } catch (err) {
        setError('Failed to load patient')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadPatient()
  }, [patientId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-10 h-10 border-[3px] border-indigo-100 border-t-indigo-600 rounded-full"></div>
      </div>
    )
  }

  if (error || !patient) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <FiUser size={60} className="text-slate-300 mb-4" />
        <p className="text-xl font-bold text-slate-900">{error || 'Patient not found'}</p>
      </div>
    )
  }

  return (
    <div className="w-full bg-[#fcfdfe] min-h-screen p-4 md:p-10 text-slate-900">
      <div className="max-w-4xl mx-auto">
        <PatientView patient={patient} onEdit={() => {}} />
      </div>
    </div>
  )
}
