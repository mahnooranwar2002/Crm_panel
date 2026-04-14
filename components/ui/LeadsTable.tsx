"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { FiEye, FiEdit2, FiTrash2, FiPlus, FiX, FiBriefcase, FiMail, FiGlobe, FiPhone, FiSearch, FiFilter } from 'react-icons/fi';
import { LeadService } from '@/src/services/leadService';

const STATUS_COLORS: any = {
  New: 'bg-blue-100 text-blue-700 ring-blue-500/20',
  Contacted: 'bg-amber-100 text-amber-700 ring-amber-500/20',
  Qualified: 'bg-purple-100 text-purple-700 ring-purple-500/20',
  Lost: 'bg-rose-100 text-rose-700 ring-rose-500/20',
};

const emptyLead = { firstName: '', lastName: '', email: '', phone: '', company: 'Google', source: 'Ads', status: 'New' };

const LeadsTable = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLead, setCurrentLead] = useState<any>(emptyLead);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const data = await LeadService.getLeads(1, 100, searchTerm, statusFilter);
      // Backend mapping handling
      const leadsArray = Array.isArray(data) ? data : (data.leads || data.data || []);
      setLeads(leadsArray);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => fetchLeads(), 500); // Search debounce
    return () => clearTimeout(delayDebounce);
  }, [fetchLeads]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (modalMode === 'create') {
        await LeadService.createLead(currentLead);
      } else {
        await LeadService.updateLead(currentLead.id || currentLead._id, currentLead);
      }
      setIsModalOpen(false);
      fetchLeads();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await LeadService.deleteLead(id);
      setLeads(prev => prev.filter(l => (l.id !== id && l._id !== id)));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const openModal = (mode: any, lead: any = emptyLead) => {
    setModalMode(mode);
    setCurrentLead(lead);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full space-y-6 p-6 text-black bg-slate-50 min-h-screen font-sans">
      {/* HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Lead Pipeline</h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Real-time Sales Tracking</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search leads..." 
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none w-64 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Lost">Lost</option>
          </select>
          <button onClick={() => openModal('create')} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-200">
            <FiPlus /> Create Lead
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {loading && leads.length === 0 ? (
          <div className="py-20 text-center animate-pulse text-slate-400 font-medium">Loading Pipeline Data...</div>
        ) : error ? (
          <div className="py-20 text-center text-rose-500 font-bold">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-5">Lead Contact</th>
                  <th className="px-6 py-5">Company</th>
                  <th className="px-6 py-5 text-center">Status</th>
                  <th className="px-6 py-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {leads.map((lead) => (
                  <tr key={lead._id || lead.id} className="hover:bg-slate-50/50 transition-all">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shadow-sm uppercase">
                          {lead.firstName[0]}{lead.lastName[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700 text-sm">{lead.firstName} {lead.lastName}</span>
                          <span className="text-[11px] text-slate-400 font-medium">{lead.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-600">
                      <div className="flex items-center gap-2"><FiBriefcase className="text-slate-300"/> {lead.company}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ring-1 ${STATUS_COLORS[lead.status]}`}>
                          {lead.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openModal('view', lead)} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"><FiEye size={18} /></button>
                        <button onClick={() => openModal('edit', lead)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><FiEdit2 size={16} /></button>
                        <button onClick={() => handleDelete(lead._id || lead.id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors"><FiTrash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL (FORM & VIEW) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[2rem] shadow-2xl p-8 overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-800 uppercase italic">
                {modalMode === 'view' ? 'Lead Profile' : modalMode === 'edit' ? 'Edit Details' : 'New Entry'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><FiX /></button>
            </div>

            {modalMode === 'view' ? (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Primary Contact</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center text-lg font-bold">
                      {currentLead.firstName[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{currentLead.firstName} {currentLead.lastName}</h4>
                      <p className="text-sm text-slate-500">{currentLead.email}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Company</p>
                    <p className="text-sm font-bold text-slate-700">{currentLead.company}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Status</p>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded ${STATUS_COLORS[currentLead.status]}`}>{currentLead.status}</span>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input required placeholder="First Name" className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 text-sm" value={currentLead.firstName} onChange={e => setCurrentLead({...currentLead, firstName: e.target.value})} />
                  <input required placeholder="Last Name" className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 text-sm" value={currentLead.lastName} onChange={e => setCurrentLead({...currentLead, lastName: e.target.value})} />
                </div>
                <input required type="email" placeholder="Email Address" className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 text-sm" value={currentLead.email} onChange={e => setCurrentLead({...currentLead, email: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <select className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 text-sm" value={currentLead.company} onChange={e => setCurrentLead({...currentLead, company: e.target.value})}>
                    <option value="Google">Google</option>
                    <option value="Meta">Meta</option>
                    <option value="Amazon">Amazon</option>
                  </select>
                  <select className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 text-sm" value={currentLead.status} onChange={e => setCurrentLead({...currentLead, status: e.target.value})}>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
                <button disabled={submitting} type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-50">
                  {submitting ? 'Syncing...' : 'Confirm Details'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsTable;