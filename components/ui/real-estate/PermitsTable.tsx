'use client';

import React, { useState, useEffect } from 'react';
import { 
  FiPlus, FiEdit2, FiTrash2, FiSearch, 
  FiFilter, FiLoader, FiX, FiFileText, FiCalendar, FiCheckCircle, FiAlertTriangle, FiInfo
} from 'react-icons/fi';
import { permitService } from '@/src/services/real-estate/permitService';
import PermitModal from './modals/PermitModal';
import toast, { Toaster } from 'react-hot-toast';

interface Permit {
  _id?: string;
  project_id?: string;
  permit_type: string;
  permit_number: string;
  issued_date: string;
  expiry_date: string;
  issuing_authority?: string;
  authority?: string;
  description?: string;
  status?: string;
  documents?: string[];
  notes?: string;
}

export default function PermitsTable() {
  const [permits, setPermits] = useState<Permit[]>([]);
  const [filteredPermits, setFilteredPermits] = useState<Permit[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); 
  const [editingPermit, setEditingPermit] = useState<Permit | null>(null);
  const [selectedPermit, setSelectedPermit] = useState<Permit | null>(null); 
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchPermits();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, permits]);

  const fetchPermits = async () => {
  try {
    setLoading(true);
    const res = await permitService.getPermits() as any; // Cast to any
    const data = Array.isArray(res) ? res : res?.data || [];
    setPermits(data);
    setFilteredPermits(data);
  } catch (err) {
    console.error("Error fetching permits:", err);
    toast.error("Failed to load legal clearances");
  } finally {
    setLoading(false);
  }
};

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredPermits(permits);
      return;
    }
    const filtered = permits.filter((p) => 
      p.permit_number?.toLowerCase().includes(query.toLowerCase()) ||
      p.permit_type?.toLowerCase().includes(query.toLowerCase()) ||
      p.issuing_authority?.toLowerCase().includes(query.toLowerCase()) ||
      p.status?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPermits(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently revoke/delete this permit record?')) return;
    try {
      await permitService.deletePermit(id);
      toast.success('Permit authorization cleared');
      fetchPermits();
    } catch (err) {
      toast.error('Failed to eliminate permit reference');
    }
  };

  const handleAddPermit = () => {
    setEditingPermit(null);
    setShowModal(true);
  };

  const handleEditPermit = (permit: Permit) => {
    setEditingPermit(permit);
    setShowModal(true);
  };

  const handleSavePermit = async (permit: Permit) => {
    try {
      setIsSaving(true);
      if (editingPermit && editingPermit._id) {
        await permitService.updatePermit(editingPermit._id, permit);
        toast.success('Permit guidelines adjusted');
      } else {
        await permitService.createPermit(permit);
        toast.success('New regulatory clearance registered');
      }
      setShowModal(false);
      fetchPermits();
    } catch (err) {
      toast.error('Failed to log regulatory parameters');
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'Active':
      case 'Approved': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Applied': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Expired': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Suspended':
      case 'Revoked': return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="w-full bg-[#fcfdfe] min-h-screen p-4 md:p-10 text-slate-900 font-sans relative overflow-x-hidden">
      <Toaster />
      
      <div className="max-w-7xl mx-auto">
        {/* Upper Layout Controls Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Regulatory Permits</h1>
            <p className="text-slate-500 font-medium mt-1">
              Track building codes clearances, zoning approvals, and agency certificates validities.
              <span className="ml-2 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full text-xs font-bold">
                {filteredPermits.length} Registered Records
              </span>
            </p>
          </div>
          <button 
            onClick={handleAddPermit}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            <FiPlus size={20} />
            Apply For Permit
          </button>
        </div>

        {/* Searching Filtering Actions Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by license ID, authority agency, status type..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none shadow-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm">
            <FiFilter /> Filters
          </button>
        </div>

        {/* Core Stock Permits Table layout */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-100/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Permit Details</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Authority Agency</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Status</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Validity Range</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-24 text-center">
                      <div className="flex flex-col items-center">
                        <FiLoader className="animate-spin w-10 h-10 text-blue-600 mb-4" size={32} />
                        <p className="text-slate-400 font-bold tracking-tight">Syncing Legal Certificates Base...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredPermits.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-24 text-center">
                      <div className="flex flex-col items-center opacity-40">
                        <FiFileText size={60} className="text-slate-300 mb-4" />
                        <p className="text-xl font-bold text-slate-900">No Regulatory Records Logs Found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPermits.map((item) => (
                    <tr key={item._id} className="hover:bg-blue-50/40 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                            <FiFileText size={18} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-base">{item.permit_type}</p>                           
                             <p className="text-xs font-mono font-bold text-slate-400 mt-0.5">ID: {item.permit_number}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-slate-700">
                        {item.issuing_authority || 'N/A'}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusClass(item.status || 'Applied')}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-0.5 text-xs font-bold text-slate-600">
                          <span className="flex items-center gap-1"><FiCalendar size={12} className="text-emerald-500" /> Issued: {item.issued_date ? new Date(item.issued_date).toLocaleDateString() : 'N/A'}</span>
                          <span className="flex items-center gap-1"><FiCalendar size={12} className="text-rose-500" /> Expires: {item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <button 
                            onClick={() => setSelectedPermit(item)}
                            className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm"
                            title="Legal Provisions Details"
                          >
                            <FiInfo size={18} />
                          </button>
                          <button 
                            onClick={() => handleEditPermit(item)}
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

      {/* View Sidebar Info Sheet Summary Drawer */}
      {selectedPermit && (
        <div className="fixed inset-0 z-[9999] overflow-hidden">
          <div 
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setSelectedPermit(null)}
          />

          <div className="absolute top-0 right-0 h-full w-full sm:w-[450px] bg-white/95 backdrop-blur-md border-l border-slate-200/50 shadow-2xl flex flex-col text-sm text-slate-900 animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
              <h2 className="text-xl font-bold text-slate-900">Permit Evaluation</h2>
              <button onClick={() => setSelectedPermit(null)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700">
                <FiX size={20} />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Permit Classification</span>
                <p className="font-bold text-slate-800 text-base">{selectedPermit.permit_type}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Permit Number ID</span>
                  <p className="font-mono font-bold text-slate-800 bg-slate-50 px-2 py-1 rounded border border-slate-100 w-fit">{selectedPermit.permit_number}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Current Status</span>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wider border ${getStatusClass(selectedPermit.status || 'Applied')}`}>
                    {selectedPermit.status}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Issuing Agency / Authority</span>
                <p className="font-bold text-slate-700">{selectedPermit.issuing_authority || 'N/A'}</p>              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Authorization Start</span>
                  <p className="font-semibold text-slate-800">{selectedPermit.issued_date ? new Date(selectedPermit.issued_date).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Expiration / Renewal Due</span>
                  <p className="font-semibold text-slate-800">{selectedPermit.expiry_date ? new Date(selectedPermit.expiry_date).toLocaleDateString() : 'N/A'}</p>                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Linked Project Code</span>
                <p className="font-mono font-bold text-slate-600">{selectedPermit.project_id || 'N/A'}</p>
              </div>
              {selectedPermit.description && (
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Scope Specifications</span>
                  <p className="text-slate-600 bg-slate-50 border border-slate-100 p-3 rounded-xl font-medium leading-relaxed">{selectedPermit.description}</p>
                </div>
              )}
              {selectedPermit.notes && (
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Regulatory Directives</span>
                  <p className="text-slate-600 bg-amber-50/50 border border-amber-100/70 p-3 rounded-xl font-medium leading-relaxed">{selectedPermit.notes}</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-white/50">
              <button onClick={() => setSelectedPermit(null)} className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors">
                Close Layout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Connected Action Modal Base component sheet overlay */}
      <PermitModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingPermit(null); }}
        permit={editingPermit || undefined}
        onSave={handleSavePermit}
        loading={isSaving}
      />
    </div>
  );
}