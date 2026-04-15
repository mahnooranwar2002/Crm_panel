"use client"
import React, { useState, useEffect } from 'react';
import { FiEye, FiEdit2, FiTrash2, FiPlus, FiX, FiBriefcase, FiMail, FiUser, FiGlobe, FiPhone } from 'react-icons/fi';
import { LeadService } from '@/src/services/leadService';

const STATUS_COLORS: any = {
  New: 'bg-blue-100 text-blue-700 ring-blue-500/20',
  Contacted: 'bg-amber-100 text-amber-700 ring-amber-500/20',
  Qualified: 'bg-purple-100 text-purple-700 ring-purple-500/20',
  Lost: 'bg-rose-100 text-rose-700 ring-rose-500/20',
};

// Image placeholder utility
const getAvatar = (name: string) => `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`;

const emptyLead = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: 'Google',
  source: 'Ads',
  status: 'New',
  assignedTo: '',
};

const LeadsTable = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLead, setCurrentLead] = useState<any>(emptyLead);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch leads from API on component mount
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await LeadService.getLeads(1, 100);
      const leadsArray = data?.leads || [];
      setLeads(leadsArray);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching leads:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (mode: 'create' | 'edit' | 'view', lead: any = emptyLead) => {
    setModalMode(mode);
    setCurrentLead(lead);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cleanedLead = Object.fromEntries(
        Object.entries(currentLead).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
      );

      if (modalMode === 'create') {
        await LeadService.createLead(cleanedLead);
      } else if (modalMode === 'edit') {
        await LeadService.updateLead(currentLead._id, cleanedLead);
      }
      await fetchLeads();
      setIsModalOpen(false);
      setCurrentLead(emptyLead);
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await LeadService.deleteLead(id);
        await fetchLeads();
      } catch (err: any) {
        alert('Error: ' + err.message);
      }
    }
  };

  return (
    <div className="w-full space-y-6 p-4 bg-slate-50 min-h-screen">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Lead Management</h1>
          <p className="text-sm text-slate-500 mt-1 font-bold uppercase tracking-wider">Sales & Pipeline Tracker</p>
        </div>
        <button onClick={() => openModal('create')} className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-200 active:scale-95">
          <FiPlus size={18} />
          <span>Create New Lead</span>
        </button>
      </div>

      {/* --- ERROR MESSAGE --- */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg">
          Error: {error}
        </div>
      )}

      {/* --- TABLE --- */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-5">Lead Details</th>
                <th className="px-6 py-5">Company & Source</th>
                <th className="px-6 py-5 text-center">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">Loading leads...</td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No leads found</td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-emerald-50/30 transition-all group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <img src={getAvatar(`${lead.firstName} ${lead.lastName}`)} className="h-10 w-10 rounded-xl shadow-sm" alt="avatar" />
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700 text-[15px]">{lead.firstName} {lead.lastName}</span>
                          <span className="text-xs text-slate-400">{lead.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-semibold text-slate-600 flex items-center gap-1"><FiBriefcase size={12}/> {lead.company || 'N/A'}</span>
                        <span className="text-[10px] font-black uppercase text-emerald-500">{lead.source || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ${STATUS_COLORS[lead.status] || STATUS_COLORS['New']}`}>
                          {lead.status || 'New'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openModal('view', lead)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-white rounded-lg transition-all"><FiEye size={18} /></button>
                        <button onClick={() => openModal('edit', lead)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all"><FiEdit2 size={16} /></button>
                        <button onClick={() => handleDelete(lead._id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-all"><FiTrash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          {modalMode === 'view' ? (
            <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
              <div className="h-24 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-all"><FiX size={20} /></button>
              <div className="px-8 pb-8 text-center">
                <div className="relative -mt-12 mb-4">
                  <div className="h-24 w-24 bg-white rounded-3xl shadow-lg mx-auto flex items-center justify-center border-4 border-white overflow-hidden">
                    <img src={getAvatar(`${currentLead.firstName} ${currentLead.lastName}`)} alt="profile" className="w-full h-full object-cover" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-800">{currentLead.firstName} {currentLead.lastName}</h2>
                <p className="text-emerald-600 font-bold text-sm uppercase tracking-widest mt-1">{currentLead.company || 'N/A'}</p>
                
                <div className="mt-6 space-y-4 text-left border-t pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-50 rounded-xl text-slate-400"><FiMail size={18} /></div>
                    <div><p className="text-[10px] uppercase font-black text-slate-400">Email Address</p><p className="text-sm font-bold text-slate-700">{currentLead.email || 'N/A'}</p></div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-50 rounded-xl text-slate-400"><FiPhone size={18} /></div>
                    <div><p className="text-[10px] uppercase font-black text-slate-400">Phone Number</p><p className="text-sm font-bold text-slate-700">{currentLead.phone || 'N/A'}</p></div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-50 rounded-xl text-slate-400"><FiBriefcase size={18} /></div>
                    <div><p className="text-[10px] uppercase font-black text-slate-400">Company</p><p className="text-sm font-bold text-slate-700">{currentLead.company || 'N/A'}</p></div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-50 rounded-xl text-slate-400"><FiGlobe size={18} /></div>
                    <div><p className="text-[10px] uppercase font-black text-slate-400">Source Channel</p><p className="text-sm font-bold text-slate-700">{currentLead.source || 'N/A'}</p></div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-50 rounded-xl text-slate-400"><FiUser size={18} /></div>
                    <div><p className="text-[10px] uppercase font-black text-slate-400">Assigned To</p><p className="text-sm font-bold text-slate-700">{currentLead.assignedTo || 'Unassigned'}</p></div>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-full mt-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all">Close Profile</button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 space-y-4">
              <div className="flex justify-between items-center border-b pb-4">
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{modalMode === 'create' ? 'New Lead Entry' : 'Update Lead Info'}</h3>
                <button type="button" onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400"><FiX size={20} /></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">First Name</label>
                  <input required className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 text-sm" value={currentLead.firstName} onChange={(e) => setCurrentLead({...currentLead, firstName: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Last Name</label>
                  <input required className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 text-sm" value={currentLead.lastName} onChange={(e) => setCurrentLead({...currentLead, lastName: e.target.value})} />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Email Address</label>
                  <input required type="email" className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 text-sm" value={currentLead.email} onChange={(e) => setCurrentLead({...currentLead, email: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Phone Number</label>
                  <input type="tel" className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="+92..." value={currentLead.phone} onChange={(e) => setCurrentLead({...currentLead, phone: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Company</label>
                  <input className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 text-sm" value={currentLead.company} onChange={(e) => setCurrentLead({...currentLead, company: e.target.value})} placeholder="e.g. Google" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Assigned To</label>
                  <input className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 text-sm" value={currentLead.assignedTo} onChange={(e) => setCurrentLead({...currentLead, assignedTo: e.target.value})} placeholder="User name" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Source</label>
                  <select className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 text-sm" value={currentLead.source} onChange={(e) => setCurrentLead({...currentLead, source: e.target.value})}>
                    <option value="Ads">Ads</option>
                    <option value="Referral">Referral</option>
                    <option value="Cold Call">Cold Call</option>
                    <option value="Website">Website</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Status</label>
                  <select className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 text-sm" value={currentLead.status} onChange={(e) => setCurrentLead({...currentLead, status: e.target.value})}>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-xl font-bold hover:bg-slate-100">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all">
                  {modalMode === 'create' ? 'Save Lead' : 'Update Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default LeadsTable;
