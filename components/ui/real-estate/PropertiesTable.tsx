// 'use client';
// import React, { useState, useEffect } from 'react';
// import { 
//   FiEye, FiEdit2, FiTrash2, FiPlus, FiSearch, FiLoader, FiX
// } from 'react-icons/fi';
// import { propertyService } from '@/src/services/real-estate/propertyService';
// import toast, { Toaster } from 'react-hot-toast';

// interface Property {
//   _id?: string;
//   property_id: string;
//   address: string;
//   city: string;
//   state: string;
//   property_type: string;
//   total_area: number;
//   price: number;
//   status: string;
//   owner_name: string;
// }

// const PropertiesTable = () => {
//   const [properties, setProperties] = useState<Property[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
//   const [showDetail, setShowDetail] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [editingProperty, setEditingProperty] = useState<Property | null>(null);
//   const [formData, setFormData] = useState({
//     property_id: '',
//     address: '',
//     city: '',
//     state: '',
//     property_type: 'Commercial',
//     total_area: 0,
//     price: 0,
//     status: 'Available',
//     owner_name: '',
//     owner_contact: '',
//   });

//   const PRIMARY_COLOR = "#21a9ff";

//   useEffect(() => {
//     fetchProperties();
//   }, []);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       fetchProperties(searchTerm);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   const fetchProperties = async (search = '') => {
//     try {
//       setLoading(true);
//       const res = await propertyService.getProperties();
//       let data = Array.isArray(res) ? res : res?.data || [];
      
//       if (search) {
//         data = data.filter((p: Property) => 
//           p.address.toLowerCase().includes(search.toLowerCase()) ||
//           p.property_id.toLowerCase().includes(search.toLowerCase())
//         );
//       }
      
//       setProperties(data);
//     } catch (err) {
//       console.error("Error fetching properties:", err);
//       toast.error("Failed to fetch properties");
//       setProperties([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm('Are you sure?')) return;
//     try {
//       await propertyService.deleteProperty(id);
//       toast.success('Property deleted successfully');
//       fetchProperties();
//     } catch (err) {
//       toast.error('Failed to delete property');
//     }
//   };

//   const handleAddProperty = () => {
//     setEditingProperty(null);
//     setFormData({
//       property_id: '',
//       address: '',
//       city: '',
//       state: '',
//       property_type: 'Commercial',
//       total_area: 0,
//       price: 0,
//       status: 'Available',
//       owner_name: '',
//       owner_contact: '',
//     });
//     setShowForm(true);
//   };

//   const handleEditProperty = (property: Property) => {
//     setEditingProperty(property);
//     setFormData(property as any);
//     setShowForm(true);
//   };

//   const handleSaveProperty = async () => {
//     if (!formData.address || !formData.owner_name) {
//       toast.error('Please fill all required fields');
//       return;
//     }

//     try {
//       if (editingProperty) {
//         await propertyService.updateProperty(editingProperty._id!, formData);
//         toast.success('Property updated successfully');
//       } else {
//         await propertyService.createProperty(formData);
//         toast.success('Property created successfully');
//       }
//       setShowForm(false);
//       fetchProperties();
//     } catch (err) {
//       toast.error('Failed to save property');
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch(status) {
//       case 'Available': return '#4ade80';
//       case 'Sold': return '#ef4444';
//       case 'Rented': return '#f59e0b';
//       case 'Under_Offer': return '#8b5cf6';
//       default: return '#6b7280';
//     }
//   };

//   return (
//     <div style={{ padding: '20px', fontFamily: 'Inter, sans-serif' }}>
//       <Toaster />
      
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//         <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>Properties</h2>
//         <button 
//           onClick={handleAddProperty}
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
//           <FiPlus size={18} /> Add Property
//         </button>
//       </div>

//       <div style={{ marginBottom: '20px', position: 'relative' }}>
//         <FiSearch style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }} size={18} />
//         <input
//           type="text"
//           placeholder="Search by address or property ID..."
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
//             maxWidth: '600px',
//             maxHeight: '90vh',
//             overflowY: 'auto'
//           }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//               <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
//                 {editingProperty ? 'Edit Property' : 'Add New Property'}
//               </h3>
//               <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
//                 <FiX size={24} />
//               </button>
//             </div>

//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
//               <div>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Property ID</label>
//                 <input
//                   type="text"
//                   placeholder="e.g., PROP-2026-001"
//                   value={formData.property_id}
//                   onChange={(e) => setFormData({ ...formData, property_id: e.target.value })}
//                   style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '14px' }}
//                 />
//               </div>
//               <div>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Owner Name</label>
//                 <input
//                   type="text"
//                   placeholder="Owner name"
//                   value={formData.owner_name}
//                   onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
//                   style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '14px' }}
//                 />
//               </div>
//               <div style={{ gridColumn: '1 / -1' }}>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Address</label>
//                 <input
//                   type="text"
//                   placeholder="Full address"
//                   value={formData.address}
//                   onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//                   style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '14px' }}
//                 />
//               </div>
//               <div>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>City</label>
//                 <input
//                   type="text"
//                   placeholder="City"
//                   value={formData.city}
//                   onChange={(e) => setFormData({ ...formData, city: e.target.value })}
//                   style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '14px' }}
//                 />
//               </div>
//               <div>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>State</label>
//                 <input
//                   type="text"
//                   placeholder="State"
//                   value={formData.state}
//                   onChange={(e) => setFormData({ ...formData, state: e.target.value })}
//                   style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '14px' }}
//                 />
//               </div>
//               <div>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Property Type</label>
//                 <select
//                   value={formData.property_type}
//                   onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
//                   style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '14px' }}
//                 >
//                   <option>Commercial</option>
//                   <option>Residential</option>
//                   <option>Industrial</option>
//                   <option>Mixed-Use</option>
//                   <option>Land</option>
//                 </select>
//               </div>
//               <div>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Total Area (sq ft)</label>
//                 <input
//                   type="number"
//                   placeholder="Area"
//                   value={formData.total_area}
//                   onChange={(e) => setFormData({ ...formData, total_area: parseInt(e.target.value) })}
//                   style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '14px' }}
//                 />
//               </div>
//               <div>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Price ($)</label>
//                 <input
//                   type="number"
//                   placeholder="Price"
//                   value={formData.price}
//                   onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
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
//                   <option>Available</option>
//                   <option>Sold</option>
//                   <option>Rented</option>
//                   <option>Under_Offer</option>
//                   <option>Off_Market</option>
//                 </select>
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
//                 onClick={handleSaveProperty}
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
//                 Save Property
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {loading ? (
//         <div style={{ textAlign: 'center', padding: '40px' }}>
//           <FiLoader style={{ animation: 'spin 1s linear infinite' }} size={32} color={PRIMARY_COLOR} />
//         </div>
//       ) : properties.length === 0 ? (
//         <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
//           No properties found
//         </div>
//       ) : (
//         <div style={{ overflowX: 'auto' }}>
//           <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//             <thead>
//               <tr style={{ borderBottom: '2px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
//                 <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Property ID</th>
//                 <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Address</th>
//                 <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Type</th>
//                 <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Status</th>
//                 <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Price</th>
//                 <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Owner</th>
//                 <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {properties.map((property) => (
//                 <tr key={property._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
//                   <td style={{ padding: '12px' }}>
//                     <span style={{ fontWeight: '600', color: PRIMARY_COLOR }}>{property.property_id}</span>
//                   </td>
//                   <td style={{ padding: '12px' }}>
//                     {property.address}
//                   </td>
//                   <td style={{ padding: '12px' }}>{property.property_type}</td>
//                   <td style={{ padding: '12px' }}>
//                     <span style={{
//                       padding: '4px 12px',
//                       backgroundColor: getStatusColor(property.status),
//                       color: 'white',
//                       borderRadius: '4px',
//                       fontSize: '12px',
//                       fontWeight: '600'
//                     }}>
//                       {property.status}
//                     </span>
//                   </td>
//                   <td style={{ padding: '12px', fontWeight: '600' }}>${property.price.toLocaleString()}</td>
//                   <td style={{ padding: '12px' }}>{property.owner_name}</td>
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
//                         onClick={() => handleEditProperty(property)}
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
//                       <button onClick={() => property._id && handleDelete(property._id)} style={{
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

// export default PropertiesTable;


'use client';
import React, { useState, useEffect } from 'react';
import { 
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiMapPin, 
  FiHome, FiDollarSign, FiUser, FiFilter, FiX, FiActivity 
} from 'react-icons/fi';
import { propertyService } from '@/src/services/real-estate/propertyService';
import toast, { Toaster } from 'react-hot-toast';

interface Property {
  _id?: string;
  property_id: string;
  address: string;
  city: string;
  state: string;
  property_type: string;
  total_area: number;
  price: number;
  status: string;
  owner_name: string;
}

export default function PropertiesTable() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // Initial Load[cite: 2]
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const data = await propertyService.getProperties();
      setProperties(data);
      setFilteredProperties(data);
    } catch (err) {
      toast.error("Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  // Search Logic
  const handleSearch = (query: string) => {
    setSearchTerm(query);
    const filtered = properties.filter((p) => 
      p.address.toLowerCase().includes(query.toLowerCase()) ||
      p.property_id.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProperties(filtered);
  };

  return (
    <div className="w-full bg-[#fcfdfe] min-h-screen p-4 md:p-10 text-slate-900 font-sans">
      <Toaster />
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Property Inventory</h1>
            <p className="text-slate-500 font-medium mt-1">
              Manage your real estate listings and ownership details.
              <span className="ml-2 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full text-xs font-bold">
                {filteredProperties.length} Listings
              </span>
            </p>
          </div>
          <button 
            onClick={() => { setEditingProperty(null); setShowForm(true); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            <FiPlus size={20} />
            Add Property
          </button>
        </div>

        {/* Search Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input
              type="text"
              placeholder="Search by address or Property ID..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all shadow-sm font-medium"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm">
            <FiFilter /> Filters
          </button>
        </div>

        {/* Properties Table Card */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-100/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Property Details</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Location</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Value & Area</th>
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
                        <p className="text-slate-400 font-bold tracking-tight">Loading Inventory...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredProperties.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-24 text-center">
                      <div className="flex flex-col items-center opacity-40">
                        <FiHome size={60} className="text-slate-300 mb-4" />
                        <p className="text-xl font-bold text-slate-900">No Properties Found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProperties.map((property) => (
                    <tr key={property._id} className="hover:bg-blue-50/40 transition-colors group cursor-default">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center font-bold text-blue-600 border border-white shadow-sm">
                            <FiHome size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-base">{property.property_id}</p>
                            <p className="text-xs font-bold text-slate-400 uppercase mt-0.5">{property.property_type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <p className="text-sm font-semibold text-slate-700 truncate max-w-[200px]">{property.address}</p>
                          <p className="text-[11px] font-medium text-slate-400">{property.city}, {property.state}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1 text-sm font-bold text-emerald-600">
                            ${property.price.toLocaleString()}
                          </div>
                          <div className="text-[11px] font-medium text-slate-400">
                            {property.total_area} sq ft
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          property.status === 'Available' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : 'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                          {property.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm">
                            <FiActivity size={18} />
                          </button>
                          <button 
                            onClick={() => { setEditingProperty(property); setShowForm(true); }}
                            className="p-2.5 text-slate-400 hover:text-amber-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button 
                            onClick={() => property._id && handleDelete(property._id)}
                            className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm"
                          >
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
      
      {/* Modal logic goes here, using the same ModalWrapper from PatientTable */}
    </div>
  );

  async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this property?')) {
      try {
        await propertyService.deleteProperty(id);
        toast.success('Property deleted');
        fetchProperties();
      } catch (err) {
        toast.error('Delete failed');
      }
    }
  }
}