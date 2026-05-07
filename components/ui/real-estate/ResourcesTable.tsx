// 'use client';
// import React, { useState, useEffect } from 'react';
// import { 
//   FiEye, FiEdit2, FiTrash2, FiPlus, FiSearch, FiLoader, FiX
// } from 'react-icons/fi';
// import { resourceService } from '@/src/services/real-estate/resourceService';
// import toast, { Toaster } from 'react-hot-toast';

// interface Resource {
//   _id?: string;
//   resource_type: string;
//   resource_name: string;
//   quantity: number;
//   unit: string;
//   allocation_status: string;
//   cost_per_unit: number;
//   cost_total: number;
// }

// const ResourcesTable = () => {
//   const [resources, setResources] = useState<Resource[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showForm, setShowForm] = useState(false);
//   const [editingResource, setEditingResource] = useState<Resource | null>(null);
//   const [formData, setFormData] = useState({
//     resource_type: 'Equipment',
//     resource_name: '',
//     quantity: 0,
//     unit: 'Units',
//     cost_per_unit: 0,
//     allocation_status: 'Available',
//   });

//   const PRIMARY_COLOR = "#21a9ff";

//   useEffect(() => {
//     fetchResources();
//   }, []);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       fetchResources(searchTerm);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   const fetchResources = async (search = '') => {
//     try {
//       setLoading(true);
//       const res = await resourceService.getResources();
//       let data = Array.isArray(res) ? res : res?.data || [];
      
//       if (search) {
//         data = data.filter((r: Resource) => 
//           r.resource_name.toLowerCase().includes(search.toLowerCase())
//         );
//       }
      
//       setResources(data);
//     } catch (err) {
//       console.error("Error fetching resources:", err);
//       toast.error("Failed to fetch resources");
//       setResources([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm('Are you sure?')) return;
//     try {
//       await resourceService.deleteResource(id);
//       toast.success('Resource deleted successfully');
//       fetchResources();
//     } catch (err) {
//       toast.error('Failed to delete resource');
//     }
//   };

//   const handleAddResource = () => {
//     setEditingResource(null);
//     setFormData({
//       resource_type: 'Equipment',
//       resource_name: '',
//       quantity: 0,
//       unit: 'Units',
//       cost_per_unit: 0,
//       allocation_status: 'Available',
//     });
//     setShowForm(true);
//   };

//   const handleEditResource = (resource: Resource) => {
//     setEditingResource(resource);
//     setFormData(resource as any);
//     setShowForm(true);
//   };

//   const handleSaveResource = async () => {
//     if (!formData.resource_name) {
//       toast.error('Please fill all required fields');
//       return;
//     }

//     try {
//       const data = {
//         ...formData,
//         cost_total: formData.quantity * formData.cost_per_unit
//       };

//       if (editingResource) {
//         await resourceService.updateResource(editingResource._id!, data);
//         toast.success('Resource updated successfully');
//       } else {
//         await resourceService.createResource(data);
//         toast.success('Resource created successfully');
//       }
//       setShowForm(false);
//       fetchResources();
//     } catch (err) {
//       toast.error('Failed to save resource');
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch(status) {
//       case 'Available': return '#4ade80';
//       case 'In_Use': return '#8b5cf6';
//       case 'Allocated': return '#3b82f6';
//       case 'Returned': return '#6b7280';
//       default: return '#6b7280';
//     }
//   };

//   const getResourceTypeColor = (type: string) => {
//     switch(type) {
//       case 'Equipment': return '#f59e0b';
//       case 'Material': return '#10b981';
//       case 'Labor': return '#8b5cf6';
//       case 'Subcontractor': return '#3b82f6';
//       default: return '#6b7280';
//     }
//   };

//   return (
//     <div style={{ padding: '20px', fontFamily: 'Inter, sans-serif' }}>
//       <Toaster />
      
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//         <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>Site Resources</h2>
//         <button 
//           onClick={handleAddResource}
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
//           <FiPlus size={18} /> Add Resource
//         </button>
//       </div>

//       <div style={{ marginBottom: '20px', position: 'relative' }}>
//         <FiSearch style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }} size={18} />
//         <input
//           type="text"
//           placeholder="Search by resource name..."
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
//                 {editingResource ? 'Edit Resource' : 'Add New Resource'}
//               </h3>
//               <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
//                 <FiX size={24} />
//               </button>
//             </div>

//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
//               <div>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Type</label>
//                 <select
//                   value={formData.resource_type}
//                   onChange={(e) => setFormData({ ...formData, resource_type: e.target.value })}
//                   style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '14px' }}
//                 >
//                   <option>Equipment</option>
//                   <option>Material</option>
//                   <option>Labor</option>
//                   <option>Subcontractor</option>
//                 </select>
//               </div>
//               <div>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Status</label>
//                 <select
//                   value={formData.allocation_status}
//                   onChange={(e) => setFormData({ ...formData, allocation_status: e.target.value })}
//                   style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '14px' }}
//                 >
//                   <option>Available</option>
//                   <option>Allocated</option>
//                   <option>In_Use</option>
//                   <option>Returned</option>
//                 </select>
//               </div>
//               <div style={{ gridColumn: '1 / -1' }}>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Resource Name</label>
//                 <input
//                   type="text"
//                   placeholder="Resource name"
//                   value={formData.resource_name}
//                   onChange={(e) => setFormData({ ...formData, resource_name: e.target.value })}
//                   style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '14px' }}
//                 />
//               </div>
//               <div>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Quantity</label>
//                 <input
//                   type="number"
//                   placeholder="0"
//                   value={formData.quantity}
//                   onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
//                   style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '14px' }}
//                 />
//               </div>
//               <div>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Unit</label>
//                 <input
//                   type="text"
//                   placeholder="Units, m³, sq ft, etc"
//                   value={formData.unit}
//                   onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
//                   style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '14px' }}
//                 />
//               </div>
//               <div>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Cost per Unit</label>
//                 <input
//                   type="number"
//                   placeholder="0"
//                   value={formData.cost_per_unit}
//                   onChange={(e) => setFormData({ ...formData, cost_per_unit: parseInt(e.target.value) })}
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
//                 onClick={handleSaveResource}
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
//                 Save Resource
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {loading ? (
//         <div style={{ textAlign: 'center', padding: '40px' }}>
//           <FiLoader style={{ animation: 'spin 1s linear infinite' }} size={32} color={PRIMARY_COLOR} />
//         </div>
//       ) : resources.length === 0 ? (
//         <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
//           No resources found
//         </div>
//       ) : (
//         <div style={{ overflowX: 'auto' }}>
//           <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//             <thead>
//               <tr style={{ borderBottom: '2px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
//                 <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Resource Name</th>
//                 <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Type</th>
//                 <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Quantity</th>
//                 <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Status</th>
//                 <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Cost/Unit</th>
//                 <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Total Cost</th>
//                 <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {resources.map((resource) => (
//                 <tr key={resource._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
//                   <td style={{ padding: '12px', fontWeight: '600' }}>{resource.resource_name}</td>
//                   <td style={{ padding: '12px' }}>
//                     <span style={{
//                       padding: '4px 12px',
//                       backgroundColor: getResourceTypeColor(resource.resource_type),
//                       color: 'white',
//                       borderRadius: '4px',
//                       fontSize: '12px',
//                       fontWeight: '600'
//                     }}>
//                       {resource.resource_type}
//                     </span>
//                   </td>
//                   <td style={{ padding: '12px' }}>
//                     {resource.quantity} {resource.unit}
//                   </td>
//                   <td style={{ padding: '12px' }}>
//                     <span style={{
//                       padding: '4px 12px',
//                       backgroundColor: getStatusColor(resource.allocation_status),
//                       color: 'white',
//                       borderRadius: '4px',
//                       fontSize: '12px',
//                       fontWeight: '600'
//                     }}>
//                       {resource.allocation_status}
//                     </span>
//                   </td>
//                   <td style={{ padding: '12px' }}>${resource.cost_per_unit.toLocaleString()}</td>
//                   <td style={{ padding: '12px', fontWeight: '600' }}>${resource.cost_total.toLocaleString()}</td>
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
//                         onClick={() => handleEditResource(resource)}
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
//                       <button onClick={() => resource._id && handleDelete(resource._id)} style={{
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

// export default ResourcesTable;

'use client';
import React, { useState, useEffect } from 'react';
import { 
  FiEye, FiEdit2, FiTrash2, FiPlus, FiSearch, FiLoader, 
  FiX, FiBox, FiTruck, FiUsers, FiDollarSign, FiInfo 
} from 'react-icons/fi';
import { resourceService } from '@/src/services/real-estate/resourceService';
import toast, { Toaster } from 'react-hot-toast';

interface Resource {
  _id?: string;
  resource_type: string;
  resource_name: string;
  quantity: number;
  unit: string;
  allocation_status: string;
  cost_per_unit: number;
  cost_total: number;
}

const ResourcesTable = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  
  const [formData, setFormData] = useState({
    resource_type: 'Equipment',
    resource_name: '',
    quantity: 0,
    unit: 'Units',
    cost_per_unit: 0,
    allocation_status: 'Available',
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const data = await resourceService.getResources();
      setResources(data);
      setFilteredResources(data);
    } catch (err) {
      toast.error("Failed to fetch resources");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = resources.filter((r) => 
      r.resource_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.resource_type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredResources(filtered);
  }, [searchTerm, resources]);

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently remove this resource from inventory?')) return;
    try {
      await resourceService.deleteResource(id);
      toast.success('Resource removed');
      fetchResources();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleSaveResource = async () => {
    if (!formData.resource_name) {
      toast.error('Resource name is required');
      return;
    }
    try {
      const payload = {
        ...formData,
        cost_total: formData.quantity * formData.cost_per_unit
      };
      if (editingResource) {
        await resourceService.updateResource(editingResource._id!, payload as any);
        toast.success('Resource updated');
      } else {
        await resourceService.createResource(payload as any);
        toast.success('Resource added');
      }
      setShowForm(false);
      fetchResources();
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const getStatusStyle = (status: string) => {
    const styles: any = {
      'Available': 'bg-emerald-50 text-emerald-600 border-emerald-100',
      'In_Use': 'bg-indigo-50 text-indigo-600 border-indigo-100',
      'Allocated': 'bg-blue-50 text-blue-600 border-blue-100',
      'Returned': 'bg-slate-50 text-slate-500 border-slate-100',
    };
    return styles[status] || 'bg-slate-50 text-slate-500';
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'Equipment': return <FiTruck className="text-amber-500" />;
      case 'Labor': return <FiUsers className="text-purple-500" />;
      case 'Material': return <FiBox className="text-emerald-500" />;
      default: return <FiInfo className="text-blue-500" />;
    }
  };

  return (
    <div className="w-full bg-[#fcfdfe] min-h-screen p-4 md:p-10 text-slate-900 font-sans">
      <Toaster />
      
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Site Resources</h1>
            <p className="text-slate-500 font-medium mt-1">Inventory management for equipment, labor, and construction materials.</p>
          </div>
          <button 
            onClick={() => { setEditingResource(null); setFormData({} as any); setShowForm(true); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            <FiPlus size={20} /> Add Resource
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            placeholder="Search by resource name or category..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all shadow-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Resources Table Card */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-100/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Resource</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Quantity & Unit</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Status</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Financials</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <FiLoader className="animate-spin mx-auto text-blue-600" size={30} />
                    </td>
                  </tr>
                ) : filteredResources.map((resource) => (
                  <tr key={resource._id} className="hover:bg-blue-50/40 transition-colors group cursor-default">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-lg border border-slate-100 shadow-sm">
                          {getTypeIcon(resource.resource_type)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{resource.resource_name}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{resource.resource_type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700">{resource.quantity}</span>
                        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">{resource.unit}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border tracking-wider ${getStatusStyle(resource.allocation_status)}`}>
                        {resource.allocation_status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <p className="text-sm font-black text-slate-900">${resource.cost_total.toLocaleString()}</p>
                        <p className="text-[10px] font-medium text-slate-400 tracking-tight">${resource.cost_per_unit} per unit</p>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => { setEditingResource(resource); setFormData(resource as any); setShowForm(true); }} className="p-2.5 text-slate-400 hover:text-amber-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm">
                          <FiEdit2 size={16} />
                        </button>
                        <button onClick={() => resource._id && handleDelete(resource._id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Glassmorphism Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white/90 backdrop-blur-xl border border-white w-full max-w-xl rounded-[2.5rem] shadow-2xl p-8 md:p-10">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-slate-900">{editingResource ? 'Edit Resource' : 'Register Resource'}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <FiX size={24} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-5 mb-8">
              <div className="col-span-2">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Resource Name</label>
                <input 
                  className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 outline-none font-bold"
                  value={formData.resource_name}
                  onChange={(e) => setFormData({...formData, resource_name: e.target.value})}
                  placeholder="Enter name..."
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Category</label>
                <select 
                  className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none font-bold appearance-none"
                  value={formData.resource_type}
                  onChange={(e) => setFormData({...formData, resource_type: e.target.value})}
                >
                  <option>Equipment</option>
                  <option>Material</option>
                  <option>Labor</option>
                  <option>Subcontractor</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Status</label>
                <select 
                  className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none font-bold appearance-none"
                  value={formData.allocation_status}
                  onChange={(e) => setFormData({...formData, allocation_status: e.target.value})}
                >
                  <option>Available</option>
                  <option>Allocated</option>
                  <option>In_Use</option>
                  <option>Returned</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Quantity</label>
                <input 
                  type="number"
                  className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none font-bold"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Cost Per Unit</label>
                <div className="relative">
                  <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="number"
                    className="w-full pl-10 pr-5 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none font-bold"
                    value={formData.cost_per_unit}
                    onChange={(e) => setFormData({...formData, cost_per_unit: parseInt(e.target.value)})}
                  />
                </div>
              </div>
            </div>

            <button 
              onClick={handleSaveResource}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-200 active:scale-[0.98]"
            >
              Update Inventory Record
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourcesTable;