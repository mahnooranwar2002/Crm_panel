'use client';

import React, { useState, useEffect } from 'react';
import { 
  FiPlus, FiEdit2, FiTrash2, FiSearch, 
  FiFilter, FiBox, FiLoader, FiX, FiInfo, FiDollarSign, FiTruck, FiUsers
} from 'react-icons/fi';
import { resourceService } from '@/src/services/real-estate/resourceService';
import ResourceModal from './modals/ResourceModal';
import toast, { Toaster } from 'react-hot-toast';

interface Resource {
  _id?: string;
  project_id?: string;
  resource_type: "Equipment" | "Material" | "Labor" | "Subcontractor";
  resource_name: string;
  quantity: number;
  unit: string;
  cost_per_unit: number;
  supplier_id?: string;
  allocation_status: "Available" | "Allocated" | "In_Use" | "Returned";
  assigned_to_task?: string;
  date_allocated?: string;
  date_returned?: string;
  cost_total?: number;
  notes?: string;
}

export default function ResourcesTable() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); 
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null); 
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, resources]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      // 'res' ko explicitly 'any' type cast kiya hai taake TS compilation error solve ho sakay
      const res: any = await resourceService.getResources();
      const data = Array.isArray(res) ? res : res?.data || [];
      setResources(data);
      setFilteredResources(data);
    } catch (err) {
      console.error("Error fetching resources:", err);
      toast.error("Failed to load inventory allocation");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredResources(resources);
      return;
    }
    const filtered = resources.filter((r) => 
      r.resource_name?.toLowerCase().includes(query.toLowerCase()) ||
      r.resource_type?.toLowerCase().includes(query.toLowerCase()) ||
      r.allocation_status?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredResources(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this resource record?')) return;
    try {
      await resourceService.deleteResource(id);
      toast.success('Resource record deleted successfully');
      fetchResources();
    } catch (err) {
      toast.error('Failed to clear resource metric');
    }
  };

  const handleAddResource = () => {
    setEditingResource(null);
    setShowModal(true);
  };

  const handleEditResource = (resource: Resource) => {
    setEditingResource(resource);
    setShowModal(true);
  };

  const handleSaveResource = async (resource: Resource) => {
    try {
      setIsSaving(true);
      if (editingResource && editingResource._id) {
        await resourceService.updateResource(editingResource._id, resource);
        toast.success('Resource adjustments updated');
      } else {
        await resourceService.createResource(resource);
        toast.success('New inventory allocation added');
      }
      setShowModal(false);
      fetchResources();
    } catch (err) {
      toast.error('Failed to process inventory changes');
    } finally {
      setIsSaving(false);
    }
  };

  const getResourceIcon = (type: string) => {
    switch(type) {
      case 'Material': return <FiBox size={18} className="text-blue-600" />;
      case 'Equipment': return <FiTruck size={18} className="text-amber-600" />;
      case 'Labor': return <FiUsers size={18} className="text-purple-600" />;
      default: return <FiBox size={18} className="text-slate-600" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'Available': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Allocated': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Under_Maintenance': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Depleted': return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="w-full bg-[#fcfdfe] min-h-screen p-4 md:p-10 text-slate-900 font-sans relative overflow-x-hidden">
      <Toaster />
      
      <div className="max-w-7xl mx-auto">
        {/* Top Header Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Project Resources</h1>
            <p className="text-slate-500 font-medium mt-1">
              Monitor active materials, logistics machinery deployment, and site procurement costs.
              <span className="ml-2 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full text-xs font-bold">
                {filteredResources.length} Items Logged
              </span>
            </p>
          </div>
          <button 
            onClick={handleAddResource}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            <FiPlus size={20} />
            Allocate Resource
          </button>
        </div>

        {/* Action Searching Filtering Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by resource name, type, status..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none shadow-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm">
            <FiFilter /> Filters
          </button>
        </div>

        {/* Core Stock Inventory Table layout */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-100/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Resource Details</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Allocation Status</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Quantity Stocked</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Financial Metrics</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-24 text-center">
                      <div className="flex flex-col items-center">
                        <FiLoader className="animate-spin w-10 h-10 text-blue-600 mb-4" size={32} />
                        <p className="text-slate-400 font-bold tracking-tight">Syncing Procurement Inventory...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredResources.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-24 text-center">
                      <div className="flex flex-col items-center opacity-40">
                        <FiBox size={60} className="text-slate-300 mb-4" />
                        <p className="text-xl font-bold text-slate-900">No Resource Metrics Found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredResources.map((item) => (
                    <tr key={item._id} className="hover:bg-blue-50/40 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                            {getResourceIcon(item.resource_type)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-base">{item.resource_name}</p>
                            <p className="text-xs font-bold text-slate-400 uppercase mt-0.5">Type: {item.resource_type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusClass(item.allocation_status)}`}>
                          {item.allocation_status?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm font-bold text-slate-800">
                          {item.quantity?.toLocaleString()} <span className="text-xs text-slate-400 font-medium">{item.unit || 'Units'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-0.5">
                          <div className="text-sm font-bold text-slate-800 flex items-center gap-0.5">
                            <FiDollarSign size={13} className="text-slate-400" />
                            {((item.cost_total) ? item.cost_total : (item.quantity * item.cost_per_unit))?.toLocaleString()}
                          </div>
                          <div className="text-[11px] font-medium text-slate-400">
                            Rate: ${item.cost_per_unit?.toLocaleString()} / {item.unit || 'Unit'}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <button 
                            onClick={() => setSelectedResource(item)}
                            className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm"
                            title="Specific Metrics"
                          >
                            <FiInfo size={18} />
                          </button>
                          <button 
                            onClick={() => handleEditResource(item)}
                            className="p-2.5 text-slate-400 hover:text-amber-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button 
                            onClick={() => item._id && handleDelete(item._id)}
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

      {/* View Sidebar Sheet Context Drawer Panel */}
      {selectedResource && (
        <div className="fixed inset-0 z-[9999] overflow-hidden">
          <div 
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setSelectedResource(null)}
          />

          <div className="absolute top-0 right-0 h-full w-full sm:w-[450px] bg-white/95 backdrop-blur-md border-l border-slate-200/50 shadow-2xl flex flex-col text-sm text-slate-900 animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
              <h2 className="text-xl font-bold text-slate-900">Resource Summary</h2>
              <button onClick={() => setSelectedResource(null)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700">
                <FiX size={20} />
              </button>
            </div>

            {/* Scrollable Context Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Resource Item</span>
                <p className="font-bold text-slate-800 text-base">{selectedResource.resource_name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Resource Type</span>
                  <p className="font-bold text-slate-800">{selectedResource.resource_type}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Allocation Status</span>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black border ${getStatusClass(selectedResource.allocation_status)}`}>
                    {selectedResource.allocation_status?.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Quantity Stocked</span>
                  <p className="font-bold text-slate-800">{selectedResource.quantity} {selectedResource.unit}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Unit Valuation</span>
                  <p className="font-semibold text-slate-800">${selectedResource.cost_per_unit} / {selectedResource.unit}</p>
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Total Valuation Cost</span>
                <p className="font-black text-lg text-emerald-700">
                  ${(selectedResource.cost_total ? selectedResource.cost_total : (selectedResource.quantity * selectedResource.cost_per_unit))?.toLocaleString()}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Linked Project ID</span>
                  <p className="font-mono font-bold text-slate-700">{selectedResource.project_id || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Supplier ID reference</span>
                  <p className="font-mono font-bold text-slate-700">{selectedResource.supplier_id || 'N/A'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Allocation Date</span>
                  <p className="font-semibold text-slate-800">{selectedResource.date_allocated ? new Date(selectedResource.date_allocated).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Return / Depletion Due</span>
                  <p className="font-semibold text-slate-800">{selectedResource.date_returned ? new Date(selectedResource.date_returned).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
              {selectedResource.notes && (
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Deployment Specifications</span>
                  <p className="text-slate-600 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {selectedResource.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-white/50">
              <button onClick={() => setSelectedResource(null)} className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Integrated Modal Action Sheet Component Interface */}
      <ResourceModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingResource(null); }}
        resource={editingResource || undefined}
        onSave={handleSaveResource}
        loading={isSaving}
      />
    </div>
  );
}