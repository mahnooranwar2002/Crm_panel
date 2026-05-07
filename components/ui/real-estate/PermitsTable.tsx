// 'use client';
// import React, { useState, useEffect } from 'react';
// import { 
//   FiEye, FiEdit2, FiTrash2, FiPlus, FiSearch, FiLoader, FiAlertTriangle, FiX
// } from 'react-icons/fi';
// import { permitService } from '@/src/services/real-estate/permitService';
// import toast, { Toaster } from 'react-hot-toast';

// interface Permit {
//   _id?: string;
//   permit_type: string;
//   permit_number: string;
//   status: string;
//   issued_date: string;
//   expiry_date: string;
//   issuing_authority: string;
// }

// const PermitsTable = () => {
//   const [permits, setPermits] = useState<Permit[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showForm, setShowForm] = useState(false);
//   const [editingPermit, setEditingPermit] = useState<Permit | null>(null);
//   const [formData, setFormData] = useState({
//     permit_type: '',
//     permit_number: '',
//     status: 'Applied',
//     issued_date: '',
//     expiry_date: '',
//     issuing_authority: '',
//   });

//   const PRIMARY_COLOR = "#21a9ff";

//   useEffect(() => {
//     fetchPermits();
//   }, []);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       fetchPermits(searchTerm);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   const fetchPermits = async (search = '') => {
//     try {
//       setLoading(true);
//       const res:any = await permitService.getPermits();
//       let data = Array.isArray(res) ? res : res?.data || [];
      
//       if (search) {
//         data = data.filter((p: Permit) => 
//           p.permit_number.toLowerCase().includes(search.toLowerCase()) ||
//           p.permit_type.toLowerCase().includes(search.toLowerCase())
//         );
//       }
      
//       setPermits(data);
//     } catch (err) {
//       console.error("Error fetching permits:", err);
//       toast.error("Failed to fetch permits");
//       setPermits([]);
//     } finally {
//       setLoading(false);
//     }
//   };

// //   const handleDelete = async (id: string) => {
// //     if (!confirm('Are you sure?')) return;
// //     try {
// //       await permitService.deletePermit(id);
// //       toast.success('Permit deleted successfully');
// //       fetchPermits();
// //     } catch (err) {
// //       toast.error('Failed to delete permit');
// //     }
// //   };
// const handleDelete = async (id: string | undefined) => {
//   // 1. Check agar ID exist karti hai
//   if (!id) {
//     toast.error("Invalid Permit ID");
//     return;
//   }

//   // 2. Browser confirm dialog
//   if (!window.confirm('Are you sure you want to delete this permit?')) return;

//   try {
//     setLoading(true); // Delete ke waqt loading dikhayen
//     await permitService.deletePermit(id);
    
//     toast.success('Permit deleted successfully');
    
//     // 3. Local state ko foran update karen (bagair API call ke intezar ke)
//     setPermits((prev) => prev.filter(p => p._id !== id));
    
//     // Optional: Refresh from server
//     // fetchPermits(); 
//   } catch (err: any) {
//     console.error("Delete Error:", err);
//     // 4. Detailed error message dikhayen
//     const errorMsg = err.response?.data?.message || 'Failed to delete permit';
//     toast.error(errorMsg);
//   } finally {
//     setLoading(false);
//   }
// };

//   const handleAddPermit = () => {
//     setEditingPermit(null);
//     setFormData({
//       permit_type: '',
//       permit_number: '',
//       status: 'Applied',
//       issued_date: '',
//       expiry_date: '',
//       issuing_authority: '',
//     });
//     setShowForm(true);
//   };

//   const handleEditPermit = (permit: Permit) => {
//     setEditingPermit(permit);
//     setFormData(permit as any);
//     setShowForm(true);
//   };

//   const handleSavePermit = async () => {
//     if (!formData.permit_number || !formData.permit_type) {
//       toast.error('Please fill all required fields');
//       return;
//     }

//     try {
//       if (editingPermit) {
//         await permitService.updatePermit(editingPermit._id!, formData);
//         toast.success('Permit updated successfully');
//       } else {
//         await permitService.createPermit(formData);
//         toast.success('Permit created successfully');
//       }
//       setShowForm(false);
//       fetchPermits();
//     } catch (err) {
//       toast.error('Failed to save permit');
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch(status) {
//       case 'Active': return '#4ade80';
//       case 'Applied': return '#3b82f6';
//       case 'Approved': return '#10b981';
//       case 'Expired': return '#ef4444';
//       case 'Suspended': return '#f59e0b';
//       default: return '#6b7280';
//     }
//   };

//   const isExpiringSoon = (expiryDate: string) => {
//     const today = new Date();
//     const expiry = new Date(expiryDate);
//     const daysUntilExpiry = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
//     return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
//   };

//   const isExpired = (expiryDate: string) => {
//     return new Date(expiryDate) < new Date();
//   };

//   return (
//     <div style={{ padding: '20px', fontFamily: 'Inter, sans-serif' }}>
//       <Toaster />
      
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//         <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>Construction Permits</h2>
//         <button 
//           onClick={handleAddPermit}
//           style={{
//             padding: '10px 20px',
//             backgroundColor: PRIMARY_COLOR,
//             color: 'white',
//             border: 'none',
//             borderRadius: '6px',
//             cursor: 'pointer',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '8px'
//           }}>
//           <FiPlus size={18} /> Add Permit
//         </button>
//       </div>

//       <div style={{ marginBottom: '20px', position: 'relative' }}>
//         <FiSearch style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }} size={18} />
//         <input
//           type="text"
//           placeholder="Search by permit number or type..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           style={{
//             width: '100%',
//             padding: '10px 10px 10px 40px',
//             border: '1px solid #e5e7eb',
//             borderRadius: '6px',
//             fontSize: '14px'
//           }}
//         />
//       </div>

//       {showForm && (
//         <div style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           backgroundColor: 'rgba(0,0,0,0.5)',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           zIndex: 1000
//         }}>
//           <div style={{
//             backgroundColor: 'white',
//             padding: '30px',
//             borderRadius: '8px',
//             width: '90%',
//             maxWidth: '500px'
//           }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//               <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
//                 {editingPermit ? 'Edit Permit' : 'Add New Permit'}
//               </h3>
//               <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
//                 <FiX size={24} />
//               </button>
//             </div>

//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
//               <div>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Permit Number</label>
//                 <input
//                   type="text"
//                   placeholder="PERMIT-001"
//                   value={formData.permit_number}
//                   onChange={(e) => setFormData({ ...formData, permit_number: e.target.value })}
//                   style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '14px' }}
//                 />
//               </div>
//               <div>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Type</label>
//                 <input
//                   type="text"
//                   placeholder="Building, Safety, etc"
//                   value={formData.permit_type}
//                   onChange={(e) => setFormData({ ...formData, permit_type: e.target.value })}
//                   style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '14px' }}
//                 />
//               </div>
//               <div>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Status</label>
//                 <select
//                   value={formData.status}
//                   onChange={(e) => setFormData({ ...formData, status: e.target.value })}
//                   style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '14px' }}
//                 >
//                   <option>Applied</option>
//                   <option>Approved</option>
//                   <option>Active</option>
//                   <option>Expired</option>
//                   <option>Suspended</option>
//                 </select>
//               </div>
//               <div>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Authority</label>
//                 <input
//                   type="text"
//                   placeholder="Issuing authority"
//                   value={formData.issuing_authority}
//                   onChange={(e) => setFormData({ ...formData, issuing_authority: e.target.value })}
//                   style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '14px' }}
//                 />
//               </div>
//               <div>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Issued Date</label>
//                 <input
//                   type="date"
//                   value={formData.issued_date}
//                   onChange={(e) => setFormData({ ...formData, issued_date: e.target.value })}
//                   style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '14px' }}
//                 />
//               </div>
//               <div>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Expiry Date</label>
//                 <input
//                   type="date"
//                   value={formData.expiry_date}
//                   onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
//                   style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '14px' }}
//                 />
//               </div>
//             </div>

//             <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
//               <button
//                 onClick={() => setShowForm(false)}
//                 style={{
//                   padding: '10px 20px',
//                   backgroundColor: '#f3f4f6',
//                   border: '1px solid #d1d5db',
//                   borderRadius: '6px',
//                   cursor: 'pointer',
//                   fontWeight: '600'
//                 }}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSavePermit}
//                 style={{
//                   padding: '10px 20px',
//                   backgroundColor: PRIMARY_COLOR,
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '6px',
//                   cursor: 'pointer',
//                   fontWeight: '600'
//                 }}
//               >
//                 Save Permit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {loading ? (
//         <div style={{ textAlign: 'center', padding: '40px' }}>
//           <FiLoader style={{ animation: 'spin 1s linear infinite' }} size={32} color={PRIMARY_COLOR} />
//         </div>
//       ) : permits.length === 0 ? (
//         <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
//           No permits found
//         </div>
//       ) : (
//         <div style={{ overflowX: 'auto' }}>
//           <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//             <thead>
//               <tr style={{ borderBottom: '2px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
//                 <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Permit Number</th>
//                 <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Type</th>
//                 <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Status</th>
//                 <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Issued Date</th>
//                 <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Expiry Date</th>
//                 <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Authority</th>
//                 <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {permits.map((permit) => (
//                 <tr key={permit._id} style={{ 
//                   borderBottom: '1px solid #e5e7eb',
//                   backgroundColor: isExpired(permit.expiry_date) ? '#fee2e2' : isExpiringSoon(permit.expiry_date) ? '#fef3c7' : 'transparent'
//                 }}>
//                   <td style={{ padding: '12px', fontWeight: '600' }}>
//                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                       {isExpired(permit.expiry_date) && <FiAlertTriangle size={16} color="#ef4444" />}
//                       {isExpiringSoon(permit.expiry_date) && <FiAlertTriangle size={16} color="#f59e0b" />}
//                       {permit.permit_number}
//                     </div>
//                   </td>
//                   <td style={{ padding: '12px' }}>{permit.permit_type}</td>
//                   <td style={{ padding: '12px' }}>
//                     <span style={{
//                       padding: '4px 12px',
//                       backgroundColor: getStatusColor(permit.status),
//                       color: 'white',
//                       borderRadius: '4px',
//                       fontSize: '12px',
//                       fontWeight: '600'
//                     }}>
//                       {permit.status}
//                     </span>
//                   </td>
//                   <td style={{ padding: '12px', fontSize: '13px' }}>
//                     {new Date(permit.issued_date).toLocaleDateString()}
//                   </td>
//                   <td style={{ padding: '12px', fontSize: '13px', fontWeight: '600', color: isExpired(permit.expiry_date) ? '#ef4444' : isExpiringSoon(permit.expiry_date) ? '#f59e0b' : '#000' }}>
//                     {new Date(permit.expiry_date).toLocaleDateString()}
//                   </td>
//                   <td style={{ padding: '12px', fontSize: '13px' }}>{permit.issuing_authority}</td>
//                   <td style={{ padding: '12px', textAlign: 'center' }}>
//                     <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
//                       <button style={{
//                         padding: '6px 12px',
//                         backgroundColor: '#e0f2fe',
//                         color: PRIMARY_COLOR,
//                         border: 'none',
//                         borderRadius: '4px',
//                         cursor: 'pointer'
//                       }}>
//                         <FiEye size={16} />
//                       </button>
//                       <button 
//                         onClick={() => handleEditPermit(permit)}
//                         style={{
//                           padding: '6px 12px',
//                           backgroundColor: '#fef3c7',
//                           color: '#d97706',
//                           border: 'none',
//                           borderRadius: '4px',
//                           cursor: 'pointer'
//                         }}>
//                         <FiEdit2 size={16} />
//                       </button>
//                       <button onClick={() => permit._id && handleDelete(permit._id)} style={{
//                         padding: '6px 12px',
//                         backgroundColor: '#fee2e2',
//                         color: '#ef4444',
//                         border: 'none',
//                         borderRadius: '4px',
//                         cursor: 'pointer'
//                       }}>
//                         <FiTrash2 size={16} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PermitsTable;

'use client';
import React, { useState, useEffect } from 'react';
import { 
  FiEye, FiEdit2, FiTrash2, FiPlus, FiSearch, FiLoader, 
  FiAlertTriangle, FiX, FiFileText, FiCalendar, FiMapPin, FiCheckCircle 
} from 'react-icons/fi';
import { permitService } from '@/src/services/real-estate/permitService';
import toast, { Toaster } from 'react-hot-toast';

interface Permit {
  _id?: string;
  permit_type: string;
  permit_number: string;
  status: string;
  issued_date: string;
  expiry_date: string;
  issuing_authority: string;
}

const PermitsTable = () => {
  const [permits, setPermits] = useState<Permit[]>([]);
  const [filteredPermits, setFilteredPermits] = useState<Permit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingPermit, setEditingPermit] = useState<Permit | null>(null);
  
  const [formData, setFormData] = useState({
    permit_type: '',
    permit_number: '',
    status: 'Applied',
    issued_date: '',
    expiry_date: '',
    issuing_authority: '',
  });

  useEffect(() => {
    fetchPermits();
  }, []);

  const fetchPermits = async () => {
    try {
      setLoading(true);
      const res: any = await permitService.getPermits();
      const data = Array.isArray(res) ? res : res?.data || [];
      setPermits(data);
      setFilteredPermits(data);
    } catch (err) {
      toast.error("Failed to fetch permits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = permits.filter((p) => 
      p.permit_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.permit_type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPermits(filtered);
  }, [searchTerm, permits]);

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to delete this permit?')) return;

    try {
      setLoading(true);
      await permitService.deletePermit(id);
      toast.success('Permit deleted successfully');
      setPermits((prev) => prev.filter(p => p._id !== id));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete permit');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePermit = async () => {
    if (!formData.permit_number || !formData.permit_type) {
      toast.error('Please fill all required fields');
      return;
    }
    try {
      if (editingPermit) {
        await permitService.updatePermit(editingPermit._id!, formData);
        toast.success('Permit updated');
      } else {
        await permitService.createPermit(formData);
        toast.success('Permit created');
      }
      setShowForm(false);
      fetchPermits();
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: any = {
      'Active': 'bg-emerald-50 text-emerald-600 border-emerald-100',
      'Applied': 'bg-blue-50 text-blue-600 border-blue-100',
      'Approved': 'bg-teal-50 text-teal-600 border-teal-100',
      'Expired': 'bg-rose-50 text-rose-600 border-rose-100',
      'Suspended': 'bg-amber-50 text-amber-600 border-amber-100',
    };
    return styles[status] || 'bg-slate-50 text-slate-500';
  };

  const isExpiringSoon = (date: string) => {
    const days = Math.floor((new Date(date).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    return days <= 30 && days > 0;
  };

  const isExpired = (date: string) => new Date(date) < new Date();

  return (
    <div className="w-full bg-[#fcfdfe] min-h-screen p-4 md:p-10 font-sans">
      <Toaster />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Construction Permits</h1>
            <p className="text-slate-500 font-medium mt-1">Track regulatory approvals and upcoming expiration dates.</p>
          </div>
          <button 
            onClick={() => { setEditingPermit(null); setShowForm(true); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            <FiPlus size={20} /> Add Permit
          </button>
        </div>

        {/* Search */}
        <div className="mb-8 relative group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            placeholder="Search by permit ID or type..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 outline-none transition-all shadow-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Permits Table Card */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-100/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Permit ID & Type</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Authority</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Status</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Expiry Date</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan={5} className="px-8 py-20 text-center"><FiLoader className="animate-spin mx-auto text-blue-600" size={30} /></td></tr>
                ) : filteredPermits.map((permit) => {
                  const expired = isExpired(permit.expiry_date);
                  const soon = isExpiringSoon(permit.expiry_date);
                  
                  return (
                    <tr key={permit._id} className={`transition-colors hover:bg-slate-50/80 ${expired ? 'bg-rose-50/30' : soon ? 'bg-amber-50/30' : ''}`}>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm 
                            ${expired ? 'bg-rose-100 border-rose-200 text-rose-600' : 'bg-slate-50 border-slate-100 text-blue-600'}`}>
                            {expired || soon ? <FiAlertTriangle size={20} /> : <FiFileText size={20} />}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{permit.permit_number}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{permit.permit_type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                          <FiMapPin className="text-slate-400" />
                          {permit.issuing_authority}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border tracking-wider ${getStatusBadge(permit.status)}`}>
                          {permit.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className={`flex flex-col ${expired ? 'text-rose-600' : soon ? 'text-amber-600' : 'text-slate-900'}`}>
                          <span className="text-sm font-bold flex items-center gap-1">
                            <FiCalendar size={14} className="opacity-50" />
                            {new Date(permit.expiry_date).toLocaleDateString()}
                          </span>
                          {soon && <span className="text-[10px] font-black uppercase tracking-tighter mt-0.5">Expiring Soon</span>}
                          {expired && <span className="text-[10px] font-black uppercase tracking-tighter mt-0.5">Permit Expired</span>}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setEditingPermit(permit); setFormData(permit as any); setShowForm(true); }} className="p-2.5 text-slate-400 hover:text-amber-600 hover:bg-white rounded-xl transition-all">
                            <FiEdit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(permit._id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-xl transition-all">
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                        {/* Always visible mobile-friendly version */}
                        <div className="flex justify-end gap-2 group-hover:hidden">
                           <FiEye className="text-slate-300" />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white/95 backdrop-blur-xl border border-white w-full max-w-xl rounded-[2.5rem] shadow-2xl p-8 md:p-10">
             <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-slate-900">{editingPermit ? 'Update Permit' : 'Register New Permit'}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-full">
                <FiX size={24} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-5 mb-8 text-slate-900">
               <div className="col-span-2">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Permit Identification Number</label>
                <input 
                  className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 outline-none font-bold"
                  value={formData.permit_number}
                  onChange={(e) => setFormData({...formData, permit_number: e.target.value})}
                  placeholder="e.g. BLD-2026-X89"
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Expiry Date</label>
                <input 
                  type="date"
                  className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none font-bold"
                  value={formData.expiry_date}
                  onChange={(e) => setFormData({...formData, expiry_date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Status</label>
                <select 
                  className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none font-bold appearance-none text-slate-900"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option>Applied</option>
                  <option>Approved</option>
                  <option>Active</option>
                  <option>Expired</option>
                  <option>Suspended</option>
                </select>
              </div>
            </div>

            <button 
              onClick={handleSavePermit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg active:scale-[0.98]"
            >
              Confirm Permit Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PermitsTable;