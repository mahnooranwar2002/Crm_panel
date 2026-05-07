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
              <span className="ml-2 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full text-xs font-bold">
                {filteredPatients.length} Records
              </span>
            </p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            <FiPlus size={20} />
            Register Patient
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input
              type="text"
              placeholder="Search by name, MRN, or phone number..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all shadow-sm font-medium"
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
                        <div className="animate-spin w-10 h-10 border-[3px] border-blue-100 border-t-blue-600 rounded-full mb-4"></div>
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
                    <tr key={patient.id} className="hover:bg-blue-50/40 transition-colors group cursor-default">
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
                        <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
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
                          <button onClick={() => setViewingPatient(patient)} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm">
                            <FiUser size={18} />
                          </button>
                          <button onClick={() => setEditingPatient(patient)} className="p-2.5 text-slate-400 hover:text-amber-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm">
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

      {/* --- MODALS SECTION[cite: 1] --- */}
      {showCreateModal && (
        <ModalWrapper title="Register New Patient" onClose={() => setShowCreateModal(false)}>
          <PatientForm onSubmit={handleCreatePatient} onClose={() => setShowCreateModal(false)} />
        </ModalWrapper>
      )}

      {viewingPatient && (
        <ModalWrapper title="Patient Case File" onClose={() => setViewingPatient(null)}>
          <PatientView patient={viewingPatient} onEdit={() => { setEditingPatient(viewingPatient); setViewingPatient(null); }} />
        </ModalWrapper>
      )}

      {editingPatient && (
        <ModalWrapper title="Modify Patient Records" onClose={() => setEditingPatient(null)}>
          <PatientForm patient={editingPatient} isEdit onSubmit={handleEditPatient} onClose={() => setEditingPatient(null)} />
        </ModalWrapper>
      )}
    </div>
  )
}

// --- 2. MODAL WRAPPER (FOR GLASSUI) ---
function ModalWrapper({ children, title, onClose }: { children: React.ReactNode, title: string, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with heavy blur to hide everything behind[cite: 1] */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={onClose} />
      
      {/* Content Card */}
      <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-[2.5rem] shadow-2xl border border-white/20 flex flex-col">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white/50 backdrop-blur-md">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">{title}</h2>
          <button onClick={onClose} className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all">
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
          <textarea name="address" value={formData.address} onChange={handleChange} rows={2} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-slate-700 resize-none mt-2"></textarea>
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
        <button type="submit" disabled={loading} className="flex-[2] py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black transition-all shadow-xl shadow-blue-200 disabled:opacity-50 uppercase tracking-widest text-xs">
          {loading ? 'Processing...' : isEdit ? 'Save Changes' : 'Confirm Registration'}
        </button>
      </div>
    </form>
  )
}

// --- 4. VIEW COMPONENT[cite: 1] ---
function PatientView({ patient, onEdit }: any) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center font-black text-3xl border-2 border-white shadow-inner">
          {patient.name.split(' ').map((n: string) => n[0]).join('')}
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900 leading-none">{patient.name}</h3>
          <p className="text-blue-600 font-mono font-bold mt-2 text-sm tracking-tighter bg-blue-50 inline-block px-2 py-0.5 rounded-lg border border-blue-100">
            ID: {patient.mrn}
          </p>
          <p className="text-slate-500 text-xs mt-1">Status: <span className="font-bold text-slate-700">{patient.status}</span></p>
        </div>
      </div>

      {/* Demographics */}
      <div>
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Demographics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <DetailCard icon={<FiCalendar />} label="Birthday" value={patient.dob} />
          <DetailCard icon={<FiActivity />} label="Blood Type" value={patient.bloodType || 'Unknown'} />
          <DetailCard label="Gender" value={patient.gender} />
          <DetailCard label="Occupation" value={patient.occupation || 'N/A'} />
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Contact Information</h3>
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-3">
          <div className="flex items-center gap-3">
            <FiPhone className="text-blue-500" />
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</p>
              <p className="font-bold text-slate-700">{patient.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FiMail className="text-blue-500" />
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</p>
              <p className="font-bold text-slate-700">{patient.email || 'Not provided'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FiMapPin className="text-blue-500" />
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Address</p>
              <p className="font-bold text-slate-700">{patient.address}, {patient.city}, {patient.state} {patient.zipCode}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Insurance */}
      <div>
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Insurance Coverage</h3>
        <div className="space-y-4">
          {patient.primaryInsuranceName && (
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-2xl border border-blue-200">
              <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-2">Primary Insurance</p>
              <p className="font-bold text-slate-900 text-sm">{patient.primaryInsuranceName}</p>
              <p className="text-xs text-slate-600 font-mono mt-1">Policy: {patient.primaryPolicyNumber}</p>
            </div>
          )}
          {patient.secondaryInsuranceName && (
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-5 rounded-2xl border border-slate-200">
              <p className="text-xs font-black text-slate-600 uppercase tracking-widest mb-2">Secondary Insurance</p>
              <p className="font-bold text-slate-900 text-sm">{patient.secondaryInsuranceName}</p>
              <p className="text-xs text-slate-600 font-mono mt-1">Policy: {patient.secondaryPolicyNumber}</p>
            </div>
          )}
        </div>
      </div>

      {/* Medical Information */}
      <div>
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Medical History</h3>
        <div className="space-y-3">
          {patient.medicalHistory && patient.medicalHistory.length > 0 ? (
            patient.medicalHistory.map((item: string, idx: number) => (
              <div key={idx} className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-xl border border-amber-100">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                <span className="font-semibold text-slate-700 text-sm">{item}</span>
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-sm">No medical history recorded</p>
          )}
        </div>
      </div>

      {/* Allergies */}
      <div>
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Known Allergies</h3>
        <div className="flex flex-wrap gap-2">
          {patient.allergies && patient.allergies.length > 0 ? (
            patient.allergies.map((allergy: string, idx: number) => (
              <span key={idx} className="bg-red-50 text-red-700 text-xs font-bold px-3 py-1.5 rounded-full border border-red-100">
                {allergy}
              </span>
            ))
          ) : (
            <span className="text-slate-500 text-sm">No allergies recorded</span>
          )}
        </div>
      </div>

      {/* Provider */}
      {patient.primaryProviderName && (
        <div>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Primary Care Provider</h3>
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <p className="font-bold text-slate-900">{patient.primaryProviderName}</p>
            {patient.primaryProviderId && (
              <p className="text-xs text-slate-600 font-mono mt-1">ID: {patient.primaryProviderId}</p>
            )}
          </div>
        </div>
      )}

      {/* Emergency Contact */}
      {patient.emergencyContact && (
        <div>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Emergency Contact</h3>
          <div className="bg-red-50 p-5 rounded-2xl border border-red-100">
            <p className="font-bold text-slate-900">{patient.emergencyContact}</p>
            <div className="flex items-center gap-2 mt-2">
              <FiPhone size={14} className="text-red-600" />
              <p className="text-sm font-semibold text-slate-700">{patient.emergencyPhone}</p>
            </div>
            {patient.emergencyRelationship && (
              <p className="text-xs text-slate-600 mt-2">Relationship: <span className="font-bold">{patient.emergencyRelationship}</span></p>
            )}
          </div>
        </div>
      )}

      <button onClick={onEdit} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all">
        Edit Case Information
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

function DetailCard({ icon, label, value }: any) {
  return (
    <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-blue-500">{icon}</span>
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
        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-700 transition-all"
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
        <div className="animate-spin w-10 h-10 border-[3px] border-blue-100 border-t-blue-600 rounded-full"></div>
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
