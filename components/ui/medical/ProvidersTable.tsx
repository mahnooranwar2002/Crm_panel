'use client'

import React, { useState, useEffect } from 'react'
import { 
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiUser, FiPhone, 
  FiCalendar, FiMapPin, FiActivity, FiClock, FiX, FiMail, 
  FiChevronRight, FiFilter, FiMoreVertical, FiBriefcase, FiHash 
} from 'react-icons/fi'
import { 
  getAllProviders, searchProviders, deleteProvider, createProvider, updateProvider, type Provider 
} from '@/src/services/medical/providerService'

// --- 1. MAIN PROVIDERS MANAGEMENT COMPONENT ---
export function ProvidersTable() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [viewingProvider, setViewingProvider] = useState<Provider | null>(null)
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null)

  // Initial Data Fetch: Load clinical providers on mount
  useEffect(() => {
    const loadProviders = async () => {
      try {
        setLoading(true)
        const data = await getAllProviders()
        setProviders(data)
        setFilteredProviders(data)
      } catch (error) {
        console.error('Failed to synchronize provider records:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProviders()
  }, [])

  // Search Logic: Filters by Name, Specialty, or NPI
  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.trim() === '') {
      setFilteredProviders(providers)
    } else {
      // API call to search providers based on medical identifiers
      const results = await searchProviders(query)
      setFilteredProviders(results)
    }
  }

  // Delete Logic: Permanent removal of provider credentials[cite: 3]
  const handleDeleteProvider = async (id: string) => {
    if (confirm('Are you sure you want to delete this provider record? This action will remove all associated credentialing data.')) {
      try {
        await deleteProvider(id)
        const updated = providers.filter(p => p.id !== id)
        setProviders(updated)
        setFilteredProviders(updated)
        
        // Clear selection states if the deleted provider was active[cite: 3]
        if (viewingProvider?.id === id) setViewingProvider(null)
        if (editingProvider?.id === id) setEditingProvider(null)
      } catch (error) {
        console.error('Failed to remove provider record:', error)
      }
    }
  }

  // Create Logic: Register a new clinical provider[cite: 3]
  const handleCreateProvider = async (newProviderData: any) => {
    try {
      const newProvider = await createProvider(newProviderData)
      setProviders(prev => [...prev, newProvider])
      setFilteredProviders(prev => [...prev, newProvider])
      setShowCreateModal(false)
    } catch (error) {
      console.error('Failed to register new provider:', error)
    }
  }

  // Edit Logic: Update existing provider profiles and specialties[cite: 3]
  const handleEditProvider = async (updatedData: any) => {
    if (!editingProvider) return
    try {
      const updated = await updateProvider(editingProvider.id, updatedData)
      if (updated) {
        const updateList = (list: Provider[]) => 
          list.map(p => p.id === editingProvider.id ? updated : p)
        
        setProviders(updateList(providers))
        setFilteredProviders(updateList(filteredProviders))
        setEditingProvider(null)
      }
    } catch (error) {
      console.error('Failed to update provider credentials:', error)
    }
  }

  return (
    // <div className="w-full bg-[#fcfdfe] min-h-screen p-4 md:p-10 text-slate-900">
    //   <div className="max-w-7xl mx-auto">
        
    //     {/* Header Section */}
    //     <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
    //       <div>
    //         <h1 className="text-3xl font-bold tracking-tight text-slate-900">Provider Management</h1>
    //         <p className="text-slate-500 font-medium mt-1">
    //           Centralized directory for clinical records and provider statuses.
    //           <span className="ml-2 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full text-xs font-bold">
    //             {filteredProviders.length} Records
    //           </span>
    //         </p>
    //       </div>
    //       <button 
    //         onClick={() => setShowCreateModal(true)}
    //         className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-95"
    //       >
    //         <FiPlus size={20} />
    //         Register Provider
    //       </button>
    //     </div>

    <div className="w-full bg-[#fcfdfe] min-h-screen p-4 md:p-10 text-slate-900">
  <div className="max-w-7xl mx-auto">
    
    {/* Header Section */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Provider Management</h1>
        <p className="text-slate-500 font-medium mt-1">
          Manage clinical staff, credentials, and department assignments.
          <span className="ml-2 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full text-xs font-bold">
            {filteredProviders.length} Registered Providers
          </span>
        </p>
      </div>
      <button 
        onClick={() => setShowCreateModal(true)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-95"
      >
        <FiPlus size={20} />
        Register New Provider
      </button>
    </div>

        {/* Toolbar */}
<div className="flex flex-col md:flex-row gap-4 mb-8">
  <div className="flex-1 relative group">
    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
    <input
      type="text"
      // MRN ko hata kar NPI aur Specialty add kiya gaya hai
      placeholder="Search by name, specialty, or NPI number..." 
      className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all shadow-sm font-medium"
      value={searchQuery}
      onChange={(e) => handleSearch(e.target.value)}
    />
  </div>
  <button className="flex items-center justify-center gap-2 px-6 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95">
    <FiFilter /> Filters
  </button>
</div>

        {/* Table Card */}
<div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-100/50 overflow-hidden">
  <div className="overflow-x-auto">
    <table className="w-full text-left">
      <thead>
        <tr className="bg-slate-50/50 border-b border-slate-100">
          <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Provider Details</th>
          <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">NPI / License</th>
          <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Contact Info</th>
          <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Status</th>
          <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {loading ? (
          <tr>
            <td colSpan={5} className="px-8 py-24 text-center">
              <div className="flex flex-col items-center">
                <div className="animate-spin w-10 h-10 border-[3px] border-blue-100 border-t-blue-600 rounded-full mb-4"></div>
                <p className="text-slate-400 font-bold tracking-tight">Synchronizing clinical data...</p>
              </div>
            </td>
          </tr>
        ) : filteredProviders.length === 0 ? (
          <tr>
            <td colSpan={5} className="px-8 py-24 text-center">
              <div className="flex flex-col items-center opacity-40">
                <FiUser size={60} className="text-slate-300 mb-4" />
                <p className="text-xl font-bold text-slate-900">No Provider Records Found</p>
                <p className="text-slate-500 mt-1 font-medium">Try refining your search or register a new profile.</p>
              </div>
            </td>
          </tr>
        ) : (
          filteredProviders.map((provider) => (
            <tr key={provider.id} className="hover:bg-blue-50/40 transition-colors group cursor-default">
              <td className="px-8 py-5">
                <div className="flex items-center gap-4">
                  {/* Provider Initials Avatar */}
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-bold text-slate-600 border border-white shadow-sm uppercase">
                    {(provider.firstName[0] || '') + (provider.lastName[0] || '')}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-base">{provider.firstName} {provider.lastName}</p>
                    <p className="text-xs font-bold text-blue-600 uppercase mt-0.5 tracking-tight">
                      {provider.specialty || 'General Practitioner'}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 w-fit">
                    NPI: {provider.npiNumber || 'Pending'}
                  </span>
                  {provider.licenseNumber && (
                    <span className="text-[10px] text-slate-400 font-bold ml-1 uppercase">Lic: {provider.licenseNumber}</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <FiPhone className="text-slate-400" size={14} /> {provider.phone}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-medium text-slate-400">
                    <FiMail className="text-slate-300" size={14} /> {provider.email || 'N/A'}
                  </div>
                </div>
              </td>
              <td className="px-6 py-5">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                  provider.status === 'Active' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                    : 'bg-slate-100 text-slate-500 border-slate-200'
                }`}>
                  {provider.status}
                </span>
              </td>
              <td className="px-8 py-5 text-right">
                <div className="flex justify-end items-center gap-2">
                  <button onClick={() => setViewingProvider(provider)} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm">
                    <FiUser size={18} />
                  </button>
                  <button onClick={() => setEditingProvider(provider)} className="p-2.5 text-slate-400 hover:text-amber-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm">
                    <FiEdit2 size={18} />
                  </button>
                  <button onClick={() => handleDeleteProvider(provider.id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm">
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
        <ModalWrapper title="Register New Provider" onClose={() => setShowCreateModal(false)}>
          <ProviderForm 
            onSubmit={handleCreateProvider} 
            onClose={() => setShowCreateModal(false)} 
          />
        </ModalWrapper>
      )}

      {viewingProvider && (
        <ModalWrapper title="Provider Professional Profile" onClose={() => setViewingProvider(null)}>
          <ProviderView 
            provider={viewingProvider} 
            onEdit={() => { 
              setEditingProvider(viewingProvider); 
              setViewingProvider(null); 
            }} 
          />
        </ModalWrapper>
      )}

      {editingProvider && (
        <ModalWrapper title="Update Provider Credentials" onClose={() => setEditingProvider(null)}>
          <ProviderForm 
            provider={editingProvider} 
            isEdit 
            onSubmit={handleEditProvider} 
            onClose={() => setEditingProvider(null)} 
          />
        </ModalWrapper>
      )}
    </div>
  </div>
  )
}

// --- 2. MODAL WRAPPER (FOR GLASSUI) ---
function ModalWrapper({ children, title, onClose }: { children: React.ReactNode, title: string, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with heavy blur for focus */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl transition-opacity duration-300" 
        onClick={onClose} 
        aria-hidden="true"
      />
      
      {/* Content Card with Glass UI effects */}
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
        
        {/* Scrollable Content Area */}
        <div className="p-8 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  )
}

// --- 3. REUSABLE FORM COMPONENT (CREATE/EDIT) ---
export function ProviderForm({ provider, isEdit, onSubmit, onClose }: any) {
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
      firstName: provider?.firstName || '',
      lastName: provider?.lastName || '',
      specialty: provider?.specialty || '',
      npiNumber: provider?.npiNumber || '',
      taxonomyCode: provider?.taxonomyCode || '',
      licenseNumber: provider?.licenseNumber || '',
      licenseState: provider?.licenseState || 'CA',
      phone: provider?.phone || '',
      email: provider?.email || '',
      facilityAddress: provider?.facilityAddress || '',
      facilityCity: provider?.facilityCity || '',
      facilityState: provider?.facilityState || 'CA',
      facilityZipCode: provider?.facilityZipCode || '',
      status: provider?.status || 'Active',
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
      {/* Personal Information */}
      <div>
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
          <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required />
        </div>
      </div>
      
      {/* Specialty & Credentials */}
      <div>
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Medical Credentials</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Specialty" name="specialty" value={formData.specialty} onChange={handleChange} placeholder="e.g., Cardiology" required />
          <Input label="NPI Number" name="npiNumber" value={formData.npiNumber} onChange={handleChange} placeholder="National Provider Identifier" required icon={<FiHash />} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Input label="License Number" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} required />
          <Input label="License State" name="licenseState" value={formData.licenseState} onChange={handleChange} maxLength="2" required />
        </div>
        <div className="mt-6">
          <Input label="Taxonomy Code" name="taxonomyCode" value={formData.taxonomyCode} onChange={handleChange} placeholder="e.g., 207Q00000X" />
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} required icon={<FiPhone />} />
          <Input label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} required icon={<FiMail />} />
        </div>
      </div>

      {/* Facility Address */}
      <div>
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Facility Address</h3>
        <div className="mb-6">
          <Input label="Street Address" name="facilityAddress" value={formData.facilityAddress} onChange={handleChange} required icon={<FiMapPin />} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input label="City" name="facilityCity" value={formData.facilityCity} onChange={handleChange} required />
          <Input label="State" name="facilityState" value={formData.facilityState} onChange={handleChange} maxLength="2" required />
          <Input label="ZIP Code" name="facilityZipCode" value={formData.facilityZipCode} onChange={handleChange} required />
        </div>
      </div>

      {/* Status */}
      <div>
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Provider Status</h3>
        <SelectInput label="Status" name="status" value={formData.status} onChange={handleChange} options={['Active', 'Inactive', 'Suspended']} />
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

// --- 4. VIEW COMPONENT ---
function ProviderView({ provider, onEdit }: any) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-6">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center font-black text-3xl border-2 border-white shadow-inner">
          {(provider.firstName[0] || '') + (provider.lastName[0] || '')}
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900 leading-none">{provider.firstName} {provider.lastName}</h3>
          <p className="text-blue-600 font-mono font-bold mt-2 text-sm tracking-tighter bg-blue-50 inline-block px-2 py-0.5 rounded-lg border border-blue-100">
            ID: {provider.providerId}
          </p>
          <p className="text-slate-500 text-xs mt-1">Status: <span className="font-bold text-slate-700">{provider.status}</span></p>
        </div>
      </div>

      {/* Medical Credentials */}
      <div>
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Medical Credentials</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <DetailCard icon={<FiBriefcase />} label="Specialty" value={provider.specialty} />
          <DetailCard icon={<FiHash />} label="NPI" value={provider.npiNumber} />
          <DetailCard label="License" value={provider.licenseNumber} />
          <DetailCard label="License State" value={provider.licenseState} />
          <DetailCard label="Taxonomy" value={provider.taxonomyCode || 'N/A'} />
          <DetailCard icon={<FiActivity />} label="Status" value={provider.status} />
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
              <p className="font-bold text-slate-700">{provider.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FiMail className="text-blue-500" />
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</p>
              <p className="font-bold text-slate-700">{provider.email || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Facility Address */}
      <div>
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Facility Address</h3>
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
          <div className="flex items-start gap-3">
            <FiMapPin className="text-blue-500 mt-1" />
            <div>
              <p className="font-bold text-slate-900">{provider.facilityAddress}</p>
              <p className="text-sm text-slate-600 mt-1">{provider.facilityCity}, {provider.facilityState} {provider.facilityZipCode}</p>
            </div>
          </div>
        </div>
      </div>

      <button onClick={onEdit} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all">
        Edit Provider Information
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

// --- 5. STANDALONE PROVIDER DETAIL COMPONENT (FOR PAGE USE) ---
export function ProviderDetail({ providerId }: { providerId: string }) {
  const [provider, setProvider] = useState<Provider | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProvider = async () => {
      try {
        setLoading(true)
        const providers = await getAllProviders()
        const found = providers.find((p: Provider) => p.id === providerId)
        if (found) {
          setProvider(found)
        } else {
          setError('Provider not found')
        }
      } catch (err) {
        setError('Failed to load provider')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadProvider()
  }, [providerId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-10 h-10 border-[3px] border-blue-100 border-t-blue-600 rounded-full"></div>
      </div>
    )
  }

  if (error || !provider) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <FiUser size={60} className="text-slate-300 mb-4" />
        <p className="text-xl font-bold text-slate-900">{error || 'Provider not found'}</p>
      </div>
    )
  }

  return (
    <div className="w-full bg-[#fcfdfe] min-h-screen p-4 md:p-10 text-slate-900">
      <div className="max-w-4xl mx-auto">
        <ProviderView provider={provider} onEdit={() => {}} />
      </div>
    </div>
  )
}
