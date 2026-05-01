// 'use client'

// import React, { useState, useEffect } from 'react'
// import { FiPlus, FiEdit2, FiTrash2, FiShield, FiX, FiEye, FiCheckCircle, FiAlertCircle, FiSearch, FiHash } from 'react-icons/fi'
// import { insuranceService, InsurancePlan } from '@/src/services/medical/insuranceService'

// // --- InsurancePlanDetail Component ---
// export function InsurancePlanDetail({ planId }: { planId: string }) {
//   const [plan, setPlan] = useState<InsurancePlan | null>(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const loadPlan = async () => {
//       try {
//         setLoading(true)
//         const data = await insuranceService.getPlanById(planId)
//         setPlan(data || null)
//       } catch (error) {
//         console.error("Error loading plan:", error)
//       } finally {
//         setLoading(false)
//       }
//     }
//     if (planId) {
//       loadPlan()
//     }
//   }, [planId])

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center p-12">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
//       </div>
//     )
//   }

//   if (!plan) {
//     return (
//       <div className="flex flex-col items-center justify-center p-12 text-center">
//         <FiShield className="text-slate-300 mb-4" size={48} />
//         <h3 className="text-lg font-bold text-slate-700">Plan Not Found</h3>
//         <p className="text-sm text-slate-500">The insurance plan could not be found.</p>
//       </div>
//     )
//   }

//   return (
//     <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
//       <div className="flex items-start gap-4 mb-6">
//         <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
//           <FiShield size={24} />
//         </div>
//         <div>
//           <h2 className="text-xl font-bold text-slate-900">{plan.payer}</h2>
//           <p className="text-sm text-slate-500">{plan.name}</p>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Payer ID</label>
//           <p className="text-sm font-mono font-bold text-slate-700 bg-slate-50 px-3 py-2 rounded-lg">{plan.payerId}</p>
//         </div>
//         <div>
//           <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Type</label>
//           <p className="text-sm font-semibold text-slate-700">{plan.type}</p>
//         </div>
//         <div>
//           <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Status</label>
//           <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
//             plan.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
//           }`}>
//             {plan.status}
//           </span>
//         </div>
//         <div>
//           <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Plan ID</label>
//           <p className="text-sm font-mono text-slate-500">{plan.id}</p>
//         </div>
//       </div>
//     </div>
//   )
// }

// // --- EligibilityChecker Component ---
// export function EligibilityChecker() {
//   const [ patients, setPatients] = useState<any[]>([])
//   const [selectedPatient, setSelectedPatient] = useState('')
//   const [insurancePlans, setInsurancePlans] = useState<InsurancePlan[]>([])
//   const [selectedPlan, setSelectedPlan] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [eligibilityResult, setEligibilityResult] = useState<any>(null)
//   const [loadingPlans, setLoadingPlans] = useState(true)

//   // Load insurance plans for dropdown
//   useEffect(() => {
//     const loadPlans = async () => {
//       try {
//         const data = await insuranceService.getAllPlans()
//         setInsurancePlans(data || [])
//       } catch (error) {
//         console.error("Error loading plans:", error)
//       } finally {
//         setLoadingPlans(false)
//       }
//     }
//     loadPlans()
//   }, [])

//   const checkEligibility = async () => {
//     if (!selectedPatient || !selectedPlan) {
//       alert('Please select both patient and insurance plan')
//       return
//     }

//     setLoading(true)
//     setEligibilityResult(null)

//     try {
//       // Simulate API call - In production, call actual eligibility API
//       await new Promise(resolve => setTimeout(resolve, 1500))
      
//       // Mock response
//       setEligibilityResult({
//         eligible: true,
//         coverage: 'Active',
//         copay: '$25',
//         deductible: '$500 remaining',
//         effectiveDate: '2024-01-01',
//         lastVerified: new Date().toISOString().split('T')[0]
//       })
//     } catch (error) {
//       console.error("Eligibility check failed:", error)
//       setEligibilityResult({
//         eligible: false,
//         error: 'Unable to verify eligibility'
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
//       <h2 className="text-xl font-bold text-slate-900 mb-6">Verify Patient Eligibility</h2>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//         {/* Patient Selection */}
//         <div>
//           <label className="block text-sm font-bold text-slate-700 mb-2">Patient</label>
//           <select
//             value={selectedPatient}
//             onChange={(e) => setSelectedPatient(e.target.value)}
//             className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//           >
//             <option value="">Select Patient</option>
//             <option value="P001">John Doe</option>
//             <option value="P002">Jane Smith</option>
//             <option value="P003">Robert Johnson</option>
//           </select>
//         </div>

//         {/* Insurance Plan Selection */}
//         <div>
//           <label className="block text-sm font-bold text-slate-700 mb-2">Insurance Plan</label>
//           <select
//             value={selectedPlan}
//             onChange={(e) => setSelectedPlan(e.target.value)}
//             disabled={loadingPlans}
//             className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//           >
//             <option value="">Select Insurance Plan</option>
//             {insurancePlans.map(plan => (
//               <option key={plan.id} value={plan.id}>
//                 {plan.payer} - {plan.name}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Check Button */}
//       <button
//         onClick={checkEligibility}
//         disabled={loading || !selectedPatient || !selectedPlan}
//         className="w-full bg-indigo-600 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all font-bold"
//       >
//         {loading ? (
//           <>Checking...</>
//         ) : (
//           <>
//             <FiSearch size={20} />
//             Check Eligibility
//           </>
//         )}
//       </button>

//       {/* Results */}
//       {eligibilityResult && (
//         <div className={`mt-6 p-6 rounded-xl border ${
//           eligibilityResult.eligible 
//             ? 'bg-emerald-50 border-emerald-200' 
//             : 'bg-red-50 border-red-200'
//         }`}>
//           {eligibilityResult.eligible ? (
//             <div className="flex items-start gap-4">
//               <FiCheckCircle className="text-emerald-600 mt-1" size={24} />
//               <div>
//                 <h3 className="text-lg font-bold text-emerald-900">Eligible</h3>
//                 <div className="mt-3 space-y-2 text-sm">
//                   <p className="flex justify-between">
//                     <span className="text-slate-600">Coverage:</span>
//                     <span className="font-bold text-slate-900">{eligibilityResult.coverage}</span>
//                   </p>
//                   <p className="flex justify-between">
//                     <span className="text-slate-600">Copay:</span>
//                     <span className="font-bold text-slate-900">{eligibilityResult.copay}</span>
//                   </p>
//                   <p className="flex justify-between">
//                     <span className="text-slate-600">Deductible:</span>
//                     <span className="font-bold text-slate-900">{eligibilityResult.deductible}</span>
//                   </p>
//                   <p className="flex justify-between">
//                     <span className="text-slate-600">Effective Date:</span>
//                     <span className="font-bold text-slate-900">{eligibilityResult.effectiveDate}</span>
//                   </p>
//                   <p className="flex justify-between">
//                     <span className="text-slate-600">Last Verified:</span>
//                     <span className="font-bold text-slate-900">{eligibilityResult.lastVerified}</span>
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="flex items-start gap-4">
//               <FiAlertCircle className="text-red-600 mt-1" size={24} />
//               <div>
//                 <h3 className="text-lg font-bold text-red-900">Not Eligible</h3>
//                 <p className="text-sm text-red-700 mt-2">{eligibilityResult.error}</p>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   )
// }

// export function InsurancePlansTable() {
//   const [plans, setPlans] = useState<InsurancePlan[]>([])
//   const [loading, setLoading] = useState(true)
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [currentPlan, setCurrentPlan] = useState<InsurancePlan | null>(null)
  
//   // Naya State: Sirf View Card Modal ke liye
//   const [isViewModalOpen, setIsViewModalOpen] = useState(false)

//   // 1. Fetch Data
//   const loadPlans = async () => {
//     try {
//       setLoading(true)
//       const data = await insuranceService.getAllPlans()
//       setPlans(data || [])
//     } catch (error) {
//       console.error("Data load nahi ho saka:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   // FIXED: Ye missing tha tumhare code mein
//   useEffect(() => { 
//     loadPlans() 
//   }, [])

//   const handleDelete = async (id: string) => {
//     if (confirm('Are you sure you want to delete this payer?')) {
//       await insuranceService.deletePlan(id)
//       await loadPlans()
//     }
//   }

//   const handleOpenModal = (plan?: InsurancePlan) => {
//     setCurrentPlan(plan || null)
//     setIsModalOpen(true)
//   }

//   // View Card function
//   const handleViewCard = (plan: InsurancePlan) => {
//     setCurrentPlan(plan)
//     setIsViewModalOpen(true)
//   }

//   return (
//     <div className="w-full bg-slate-50 min-h-screen p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//           <div>
//             <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Insurance Directory</h1>
//             <p className="text-slate-500 font-medium mt-1">Manage master payer lists and associated insurance plans.</p>
//           </div>
//           <button 
//             onClick={() => handleOpenModal()}
//             className="bg-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all font-bold active:scale-95"
//           >
//             <FiPlus size={20} />
//             Add New Payer
//           </button>
//         </div>

//         {/* Table Container */}
//         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full text-left">
//               <thead>
//                 <tr className="bg-slate-50/50 border-b border-slate-100">
//                   <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Payer Name</th>
//                   <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
//                   <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Plan Name</th>
//                   <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
//                   <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {loading ? (
//                    <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-400 font-bold animate-pulse">Synchronizing with Payer Database...</td></tr>
//                 ) : plans.length === 0 ? (
//                   <tr>
//                     <td colSpan={5} className="px-6 py-20 text-center">
//                       <div className="flex flex-col items-center opacity-30">
//                         <FiShield size={48} className="mb-2 text-slate-400" />
//                         <p className="font-bold text-lg text-slate-600">No insurance plans registered</p>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   plans.map((plan) => (
//                     <tr key={plan.id} className="hover:bg-slate-50 transition-colors group">
//                       <td className="px-6 py-4 font-bold text-slate-900">
//                         <div className="flex items-center gap-2">
//                            <div className={`w-2 h-2 rounded-full ${plan.status === 'Active' ? 'bg-emerald-400' : 'bg-slate-300'}`}></div>
//                            {plan.payer}
//                            <span className="text-[10px] text-slate-400 font-medium ml-1">#{plan.payerId}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 text-slate-500 font-medium text-sm">{plan.type}</td>
//                       <td className="px-6 py-4 text-slate-900 font-medium">{plan.name}</td>
//                       <td className="px-6 py-4">
//                         <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
//                           plan.status === 'Active' 
//                           ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
//                           : 'bg-slate-50 text-slate-500 border-slate-100'
//                         }`}>
//                           {plan.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-right space-x-2">
//                         {/* VIEW CARD BUTTON */}
//                         <button 
//                           onClick={() => handleViewCard(plan)}
//                           className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
//                           title="View Digital Card"
//                         >
//                           <FiEye size={18} />
//                         </button>

//                         <button 
//                           onClick={() => handleOpenModal(plan)}
//                           className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
//                         >
//                           <FiEdit2 size={18} />
//                         </button>
                        
//                         <button 
//                           onClick={() => handleDelete(plan.id)}
//                           className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
//                         >
//                           <FiTrash2 size={18} />
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* CRUD FORM MODAL */}
//       {isModalOpen && (
//         <InsurancePlanForm 
//           plan={currentPlan} 
//           onClose={() => setIsModalOpen(false)} 
//           onSuccess={() => { setIsModalOpen(false); loadPlans(); }} 
//         />
//       )}

//       {/* MATURE VIEW CARD MODAL (Total Takeover) */}
//       {isViewModalOpen && currentPlan && (
//         <MatureViewCard 
//           plan={currentPlan} 
//           onClose={() => setIsViewModalOpen(false)} 
//         />
//       )}
//     </div>
//   )
// }

// // --- Mature View Card Component (Clean Details View) ---
// function MatureViewCard({ plan, onClose }: { plan: InsurancePlan, onClose: () => void }) {
//     return (
//         <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
//             {/* Soft Backdrop */}
//             <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            
//             {/* Details Container */}
//             <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                
//                 {/* Header with Color Accent */}
//                 <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
//                     <div>
//                         <h3 className="text-xl font-bold text-slate-900">Plan Details</h3>
//                         <p className="text-xs text-slate-500 font-medium">Full insurance entity information</p>
//                     </div>
//                     <button 
//                         onClick={onClose} 
//                         className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
//                     >
//                         <FiX size={20} />
//                     </button>
//                 </div>

//                 {/* Content List */}
//                 <div className="p-8 space-y-6">
                    
//                     {/* Payer Info */}
//                     <div className="flex items-start gap-4">
//                         <div className="mt-1 p-2 bg-blue-50 text-blue-600 rounded-lg">
//                             <FiShield size={18} />
//                         </div>
//                         <div>
//                             <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Payer Name</label>
//                             <p className="text-lg font-bold text-slate-900 leading-tight">{plan.payer}</p>
//                         </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-6">
//                         {/* Payer ID */}
//                         <div className="pl-12">
//                             <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Payer ID</label>
//                             <p className="text-sm font-mono font-bold text-slate-700 bg-slate-50 px-2 py-1 rounded inline-block">
//                                 {plan.payerId}
//                             </p>
//                         </div>
                        
//                         {/* Type */}
//                         <div>
//                             <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Insurance Type</label>
//                             <p className="text-sm font-bold text-slate-700 italic">{plan.type}</p>
//                         </div>
//                     </div>

//                     <hr className="border-slate-100" />

//                     {/* Plan Name */}
//                     <div className="pl-12">
//                         <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Associated Plan</label>
//                         <p className="text-base font-semibold text-slate-900">{plan.name}</p>
//                     </div>

//                     {/* Status */}
//                     <div className="pl-12">
//                         <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Status</label>
//                         <div className="mt-1 flex items-center gap-2">
//                             <span className={`w-2 h-2 rounded-full ${plan.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
//                             <span className={`text-xs font-black uppercase tracking-wider ${plan.status === 'Active' ? 'text-emerald-600' : 'text-slate-500'}`}>
//                                 {plan.status}
//                             </span>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Footer Action */}
//                 <div className="bg-slate-50 p-4 border-t border-slate-100 text-center">
//                     <button 
//                         onClick={onClose}
//                         className="w-full py-3 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
//                     >
//                         Close Preview
//                     </button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// // --- Internal Form Component for CRUD (Glass UI Modal) ---
// function InsurancePlanForm({ plan, onClose, onSuccess }: { plan: InsurancePlan | null, onClose: () => void, onSuccess: () => void }) {
//   const [loading, setLoading] = useState(false)
//   const [formData, setFormData] = useState({
//     payer: plan?.payer || '',
//     payerId: plan?.payerId || '',
//     type: plan?.type || 'Commercial',
//     name: plan?.name || '',
//     status: plan?.status || 'Active',
//   })

//   const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value })

//   const handleSubmit = async (e: any) => {
//     e.preventDefault()
//     setLoading(true)
//     try {
//       if (plan) {
//         await insuranceService.updatePlan(plan.id, formData)
//       } else {
//         await insuranceService.createPlan(formData as any)
//       }
//       onSuccess()
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       {/* Payer Information */}
//       <div>
//         <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Payer Information</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <Input label="Payer Name" name="payer" value={formData.payer} onChange={handleChange} placeholder="e.g., Aetna" required icon={<FiShield />} />
//           <Input label="Payer ID" name="payerId" value={formData.payerId} onChange={handleChange} placeholder="e.g., 60054" required icon={<FiHash />} />
//         </div>
//       </div>

//       {/* Plan Details */}
//       <div>
//         <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Plan Details</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <SelectInput label="Insurance Type" name="type" value={formData.type} onChange={handleChange} options={['Commercial', 'Government', 'HMO', 'Military', 'Medicare', 'Medicaid']} />
//           <Input label="Plan Name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Aetna Open Access" required />
//         </div>
//       </div>

//       {/* Status */}
//       <div>
//         <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Payer Status</h3>
//         <SelectInput label="Status" name="status" value={formData.status} onChange={handleChange} options={['Active', 'Inactive', 'Pending']} />
//       </div>

//       <div className="flex gap-4 pt-4">
//         <button type="button" onClick={onClose} className="flex-1 py-4 px-6 border-2 border-slate-100 rounded-2xl font-black text-slate-500 hover:bg-slate-50 transition-all uppercase tracking-widest text-xs">Discard</button>
//         <button type="submit" disabled={loading} className="flex-[2] py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black transition-all shadow-xl shadow-indigo-200 disabled:opacity-50 uppercase tracking-widest text-xs">
//           {loading ? 'Processing...' : plan ? 'Save Changes' : 'Create Plan'}
//         </button>
//       </div>
//     </form>
//   )
// }

// // --- Helper Components (Same as ProvidersTable) ---
// function Input({ label, icon, ...props }: any) {
//   return (
//     <div className="space-y-2">
//       <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
//         {icon && React.cloneElement(icon, { size: 12 })} {label}
//       </label>
//       <input 
//         {...props} 
//         className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-700 transition-all placeholder:text-slate-300" 
//       />
//     </div>
//   )
// }

// function SelectInput({ label, name, value, onChange, options }: any) {
//   return (
//     <div className="space-y-2">
//       <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
//       <select 
//         name={name}
//         value={value} 
//         onChange={onChange} 
//         className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-700 transition-all"
//       >
//         {options.map((opt: string) => (
//           <option key={opt} value={opt}>{opt}</option>
//         ))}
//       </select>
//     </div>
//   )
// }

'use client'

import React, { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiShield, FiX, FiEye, FiCheckCircle, FiAlertCircle, FiSearch, FiHash } from 'react-icons/fi'
import { insuranceService, InsurancePlan } from '@/src/services/medical/insuranceService'

// --- InsurancePlanDetail Component ---
export function InsurancePlanDetail({ planId }: { planId: string }) {
  const [plan, setPlan] = useState<InsurancePlan | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPlan = async () => {
      try {
        setLoading(true)
        const data = await insuranceService.getPlanById(planId)
        setPlan(data || null)
      } catch (error) {
        console.error("Error loading plan:", error)
      } finally {
        setLoading(false)
      }
    }
    if (planId) { loadPlan() }
  }, [planId])

  if (loading) return <div className="flex items-center justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>
  if (!plan) return <div className="flex flex-col items-center justify-center p-12 text-center"><FiShield className="text-slate-300 mb-4" size={48} /><h3 className="text-lg font-bold text-slate-700">Plan Not Found</h3></div>

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><FiShield size={24} /></div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">{plan.payer}</h2>
          <p className="text-sm text-slate-500">{plan.name}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Payer ID</label><p className="text-sm font-mono font-bold text-slate-700 bg-slate-50 px-3 py-2 rounded-lg">{plan.payerId}</p></div>
        <div><label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Type</label><p className="text-sm font-semibold text-slate-700">{plan.type}</p></div>
        <div><label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Status</label><span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${plan.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-50'}`}>{plan.status}</span></div>
      </div>
    </div>
  )
}

// --- EligibilityChecker Component ---
export function EligibilityChecker() {
  const [selectedPatient, setSelectedPatient] = useState('')
  const [insurancePlans, setInsurancePlans] = useState<InsurancePlan[]>([])
  const [selectedPlan, setSelectedPlan] = useState('')
  const [loading, setLoading] = useState(false)
  const [eligibilityResult, setEligibilityResult] = useState<any>(null)
  const [loadingPlans, setLoadingPlans] = useState(true)

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const data = await insuranceService.getAllPlans()
        setInsurancePlans(data || [])
      } catch (error) { console.error("Error loading plans:", error) }
      finally { setLoadingPlans(false) }
    }
    loadPlans()
  }, [])

  const checkEligibility = async () => {
    if (!selectedPatient || !selectedPlan) return alert('Select patient and plan')
    setLoading(true); setEligibilityResult(null)
    try {
      await new Promise(r => setTimeout(r, 1500))
      setEligibilityResult({ eligible: true, coverage: 'Active', copay: '$25', deductible: '$500', effectiveDate: '2024-01-01', lastVerified: '2026-05-01' })
    } catch { setEligibilityResult({ eligible: false, error: 'Verification failed' }) }
    finally { setLoading(false) }
  }

  return (
    <div className="bg-white rounded-2xl border text-black border-slate-200 shadow-sm p-6">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Verify Patient Eligibility</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <select value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">Select Patient</option><option value="P001">John Doe</option>
        </select>
        <select value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)} disabled={loadingPlans} className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">Select Insurance Plan</option>
          {insurancePlans.map(p => <option key={p.id} value={p.id}>{p.payer} - {p.name}</option>)}
        </select>
      </div>
      <button onClick={checkEligibility} disabled={loading} className="w-full bg-indigo-600 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-indigo-700 transition-all">
        {loading ? 'Checking...' : <><FiSearch /> Check Eligibility</>}
      </button>
      {eligibilityResult && (
        <div className={`mt-6 p-6 rounded-xl border ${eligibilityResult.eligible ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex gap-4">
            {eligibilityResult.eligible ? <FiCheckCircle className="text-emerald-600" size={24} /> : <FiAlertCircle className="text-red-600" size={24} />}
            <div>
              <h3 className={`font-bold ${eligibilityResult.eligible ? 'text-emerald-900' : 'text-red-900'}`}>{eligibilityResult.eligible ? 'Eligible' : 'Not Eligible'}</h3>
              {eligibilityResult.eligible && <p className="text-sm mt-2 text-slate-600">Copay: {eligibilityResult.copay} | Deductible: {eligibilityResult.deductible}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// --- MAIN TABLE COMPONENT ---
export function InsurancePlansTable() {
  const [plans, setPlans] = useState<InsurancePlan[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [currentPlan, setCurrentPlan] = useState<InsurancePlan | null>(null)

  const loadPlans = async () => {
    try {
      setLoading(true)
      const data = await insuranceService.getAllPlans()
      setPlans(data || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { loadPlans() }, [])

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
      await insuranceService.deletePlan(id)
      loadPlans()
    }
  }

  const handleOpenModal = (plan?: InsurancePlan) => {
    setCurrentPlan(plan || null)
    setIsModalOpen(true)
  }

  const handleViewCard = (plan: InsurancePlan) => {
    setCurrentPlan(plan)
    setIsViewModalOpen(true)
  }

  return (
    <div className="w-full bg-slate-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Insurance Directory</h1>
            <p className="text-slate-500 font-medium">Manage master payer lists and insurance plans.</p>
          </div>
          <button onClick={() => handleOpenModal()} className="bg-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-indigo-700 shadow-lg transition-all font-bold active:scale-95">
            <FiPlus size={20} /> Add New Payer
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Payer Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Plan Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-400 font-bold animate-pulse">Loading...</td></tr>
              ) : plans.map((plan) => (
                <tr key={plan.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${plan.status === 'Active' ? 'bg-emerald-400' : 'bg-slate-300'}`}></div>
                      {plan.payer} <span className="text-[10px] text-slate-400">#{plan.payerId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{plan.type}</td>
                  <td className="px-6 py-4 text-slate-900 font-medium">{plan.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${plan.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-50 text-slate-500'}`}>
                      {plan.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => handleViewCard(plan)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><FiEye size={18} /></button>
                    <button onClick={() => handleOpenModal(plan)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><FiEdit2 size={18} /></button>
                    <button onClick={() => handleDelete(plan.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><FiTrash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ADD / EDIT MODAL WRAPPER --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{currentPlan ? 'Edit Insurance Payer' : 'Add New Payer'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><FiX size={24} /></button>
            </div>
            <InsurancePlanForm 
              plan={currentPlan} 
              onClose={() => setIsModalOpen(false)} 
              onSuccess={() => { setIsModalOpen(false); loadPlans(); }} 
            />
          </div>
        </div>
      )}

      {/* --- VIEW CARD MODAL --- */}
      {isViewModalOpen && currentPlan && (
        <MatureViewCard plan={currentPlan} onClose={() => setIsViewModalOpen(false)} />
      )}
    </div>
  )
}

// --- Mature View Card Component ---
function MatureViewCard({ plan, onClose }: { plan: InsurancePlan, onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            
            {/* Card Container */}
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="bg-indigo-600 px-8 py-6 flex justify-between items-center text-white">
                    <div>
                        <h3 className="text-xl font-bold">Insurance Digital Card</h3>
                        <p className="text-indigo-100 text-xs opacity-80">Full coverage details for this payer</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8">
                    {/* Section 1: Primary Info */}
                    <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
                        <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
                            <FiShield size={32} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Company / Payer</label>
                            <h2 className="text-2xl font-black text-slate-900 leading-tight">{plan.payer}</h2>
                        </div>
                    </div>

                    {/* Section 2: Grid Details */}
                    <div className="grid grid-cols-2 gap-y-8 gap-x-4">
                        {/* Plan Name - Full Width */}
                        <div className="col-span-2">
                            <label className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                <FiCheckCircle size={12} className="text-indigo-500" /> Plan Name
                            </label>
                            <p className="text-lg font-bold text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                {plan.name}
                            </p>
                        </div>

                        {/* Payer ID */}
                        <div>
                            <label className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                <FiHash size={12} className="text-indigo-500" /> Payer ID
                            </label>
                            <p className="text-md font-mono font-bold text-slate-700">{plan.payerId}</p>
                        </div>

                        {/* Insurance Type */}
                        <div>
                            <label className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                <FiSearch size={12} className="text-indigo-500" /> Plan Type
                            </label>
                            <p className="text-md font-bold text-slate-700">{plan.type}</p>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                Current Status
                            </label>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                plan.status === 'Active' 
                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                            }`}>
                                {plan.status}
                            </span>
                        </div>

                        {/* Internal ID (Optional but helpful) */}
                        <div>
                            <label className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                Record ID
                            </label>
                            <p className="text-[10px] font-mono text-slate-400 truncate max-w-[120px]">{plan.id}</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-slate-50 p-6 border-t border-slate-100">
                    <button 
                        onClick={onClose}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all active:scale-[0.98] shadow-xl shadow-slate-200"
                    >
                        Dismiss View
                    </button>
                </div>
            </div>
        </div>
    )
}

// --- InsurancePlanForm Component ---
function InsurancePlanForm({ plan, onClose, onSuccess }: { plan: InsurancePlan | null, onClose: () => void, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    payer: plan?.payer || '',
    payerId: plan?.payerId || '',
    type: plan?.type || 'Commercial',
    name: plan?.name || '',
    status: plan?.status || 'Active',
  })

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (plan) { await insuranceService.updatePlan(plan.id, formData) } 
      else { await insuranceService.createPlan(formData as any) }
      onSuccess()
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Payer Name" name="payer" value={formData.payer} onChange={handleChange} placeholder="e.g., Aetna" required icon={<FiShield />} />
        <Input label="Payer ID" name="payerId" value={formData.payerId} onChange={handleChange} placeholder="e.g., 60054" required icon={<FiHash />} />
        <SelectInput label="Insurance Type" name="type" value={formData.type} onChange={handleChange} options={['Commercial', 'Government', 'HMO', 'Military', 'Medicare', 'Medicaid']} />
        <Input label="Plan Name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Aetna Open Access" required />
      </div>
      <SelectInput label="Status" name="status" value={formData.status} onChange={handleChange} options={['Active', 'Inactive', 'Pending']} />
      <div className="flex gap-4 pt-4">
        <button type="button" onClick={onClose} className="flex-1 py-4 px-6 border-2 border-slate-100 rounded-2xl font-black text-slate-500 uppercase text-xs">Discard</button>
        <button type="submit" disabled={loading} className="flex-[2] py-4 px-6 bg-indigo-600 text-white rounded-2xl font-black shadow-xl uppercase text-xs">
          {loading ? 'Processing...' : plan ? 'Save Changes' : 'Create Plan'}
        </button>
      </div>
    </form>
  )
}

// --- Reusable UI Helpers ---
function Input({ label, icon, ...props }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
        {icon && React.cloneElement(icon, { size: 12 })} {label}
      </label>
      <input {...props} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-700 transition-all" />
    </div>
  )
}

function SelectInput({ label, name, value, onChange, options }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <select name={name} value={value} onChange={onChange} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none font-bold text-slate-700 transition-all">
        {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  )
}