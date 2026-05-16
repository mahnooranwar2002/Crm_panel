'use client';

import React, { useState, useEffect } from 'react';
import { 
  FiPlus, FiEdit2, FiTrash2, FiSearch, 
  FiHome, FiFilter, FiActivity, FiLoader, FiX
} from 'react-icons/fi';
import { propertyService } from '@/src/services/real-estate/propertyService';
import PropertyModal from './modals/PropertyModal';
import toast, { Toaster } from 'react-hot-toast';

interface Property {
  _id?: string;
  property_id?: string;
  address: string;
  city: string;
  state: string;
  zip_code?: string;
  country?: string;
  property_type: string;
  total_area: number;
  area_unit?: string;
  price: number;
  currency?: string;
  owner_name: string;
  owner_contact?: string;
  status?: string;
  description?: string;
}

export default function PropertiesTable() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); 
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null); 
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, properties]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await propertyService.getProperties() as any;
      const data = Array.isArray(res) ? res : res?.data || [];
      setProperties(data);
      setFilteredProperties(data);
    } catch (err) {
      console.error("Error fetching properties:", err);
      toast.error("Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredProperties(properties);
      return;
    }
    const filtered = properties.filter((p) => 
      p.address?.toLowerCase().includes(query.toLowerCase()) ||
      p.property_id?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProperties(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    try {
      await propertyService.deleteProperty(id);
      toast.success('Property deleted successfully');
      fetchProperties();
    } catch (err) {
      toast.error('Failed to delete property');
    }
  };

  const handleAddProperty = () => {
    setEditingProperty(null);
    setShowModal(true);
  };

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property);
    setShowModal(true);
  };

  const handleSaveProperty = async (property: Property) => {
    try {
      setIsSaving(true);
      if (editingProperty && editingProperty._id) {
        await propertyService.updateProperty(editingProperty._id, property);
        toast.success('Property updated successfully');
      } else {
        await propertyService.createProperty(property);
        toast.success('Property created successfully');
      }
      setShowModal(false);
      fetchProperties();
    } catch (err) {
      toast.error('Failed to save property');
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusClass = (status?: string) => {
    switch(status) {
      case 'Available': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Sold': return 'bg-red-50 text-red-700 border-red-100';
      case 'Rented': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Under_Offer': return 'bg-purple-50 text-purple-700 border-purple-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="w-full bg-[#fcfdfe] min-h-screen p-4 md:p-10 text-slate-900 font-sans relative overflow-x-hidden">
      <Toaster />
      
      <div className="max-w-7xl mx-auto">
        {/* Header Title Section */}
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
            onClick={handleAddProperty}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            <FiPlus size={20} />
            Add Property
          </button>
        </div>

        {/* Filtering & Searching */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 focus-within:text-blue-600" size={18} />
            <input
              type="text"
              placeholder="Search by address or Property ID..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none shadow-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm">
            <FiFilter /> Filters
          </button>
        </div>

        {/* Data Table */}
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
                        <FiLoader className="animate-spin w-10 h-10 text-blue-600 mb-4" size={32} />
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
                    <tr key={property._id} className="hover:bg-blue-50/40 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center font-bold text-blue-600 border border-white shadow-sm">
                            <FiHome size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-base">{property.property_id || 'N/A'}</p>
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
                            ${property.price?.toLocaleString()}
                          </div>
                          <div className="text-[11px] font-medium text-slate-400">
                            {property.total_area?.toLocaleString()} {property.area_unit || 'sq ft'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusClass(property.status)}`}>
                          {property.status?.replace('_', ' ') || 'Available'}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <button 
                            onClick={() => setSelectedProperty(property)}
                            className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm"
                            title="View Details"
                          >
                            <FiActivity size={18} />
                          </button>
                          <button 
                            onClick={() => handleEditProperty(property)}
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

      {/* View Sidebar Backdrop Overlay Container Block */}
      {selectedProperty && (
        <div className="fixed inset-0 z-[9999] overflow-hidden">
          <div 
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setSelectedProperty(null)}
          />

          {/* Property Details Sheet (Clean Sidebar Style) */}
          <div className="absolute top-0 right-0 h-full w-full sm:w-[450px] bg-white/95 backdrop-blur-md border-l border-slate-200/50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 text-sm">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
              <h2 className="text-xl font-bold text-slate-900">Property Details</h2>
              <button 
                onClick={() => setSelectedProperty(null)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Fields Details List (Scrollable Area) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Property ID</span>
                <p className="font-bold text-slate-800 text-base">{selectedProperty.property_id || 'N/A'}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Property Type</span>
                <p className="font-bold text-slate-800">{selectedProperty.property_type}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Address</span>
                <p className="font-bold text-slate-800">{selectedProperty.address}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">City</span>
                  <p className="font-bold text-slate-800">{selectedProperty.city}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">State</span>
                  <p className="font-bold text-slate-800">{selectedProperty.state}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Zip Code</span>
                  <p className="font-bold text-slate-800">{selectedProperty.zip_code || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Country</span>
                  <p className="font-bold text-slate-800">{selectedProperty.country || 'USA'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Total Area</span>
                  <p className="font-bold text-slate-800">{selectedProperty.total_area?.toLocaleString()} {selectedProperty.area_unit || 'sq ft'}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Price</span>
                  <p className="font-bold text-emerald-600">${selectedProperty.price?.toLocaleString()}</p>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Status</span>
                <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusClass(selectedProperty.status)}`}>
                  {selectedProperty.status?.replace('_', ' ') || 'Available'}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Owner Name</span>
                <p className="font-bold text-slate-800">{selectedProperty.owner_name}</p>
              </div>

              {selectedProperty.owner_contact && (
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Owner Contact</span>
                  <p className="font-semibold text-slate-600 break-all">{selectedProperty.owner_contact}</p>
                </div>
              )}

              {selectedProperty.description && (
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Description</span>
                  <p className="text-slate-600 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {selectedProperty.description}
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar Action Button */}
            <div className="p-4 border-t border-slate-100 bg-white/50">
              <button 
                onClick={() => setSelectedProperty(null)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Sidebar Sheet Component */}
      <PropertyModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingProperty(null); }}
        property={editingProperty || undefined}
        onSave={handleSaveProperty}
        loading={isSaving}
      />
    </div>
  );
}