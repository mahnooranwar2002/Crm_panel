"use client"
import React, { useState } from 'react';
import { FiEye, FiEdit2, FiTrash2, FiPlus, FiX, FiBriefcase, FiMail, FiUser, FiGlobe, FiPhone } from 'react-icons/fi';

// Function to generate dynamic avatar URL based on name
const getAvatarUrl = (firstName: string, lastName: string) => {
  return `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=0D9488&color=fff&bold=true`;
};

const STATUS_COLORS: any = {
  New: 'bg-blue-100 text-blue-700 ring-blue-500/20',
  Contacted: 'bg-amber-100 text-amber-700 ring-amber-500/20',
  Qualified: 'bg-purple-100 text-purple-700 ring-purple-500/20',
  Lost: 'bg-rose-100 text-rose-700 ring-rose-500/20',
};

const initialLeads = [
  { id: 1, firstName: 'Arsalan', lastName: 'Khan', email: 'arsalan@example.com', phone: '+92 300 1234567', source: 'Ads', status: 'New', assignedTo: 'Hamza Shahid', company: 'Google' },
  { id: 2, firstName: 'Sarah', lastName: 'Jenkins', email: 'sarah.j@tech.com', phone: '+1 555 010-999', source: 'Referral', status: 'Qualified', assignedTo: 'Ali Ahmed', company: 'Aura Tech' },
];

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
  const [leads, setLeads] = useState(initialLeads);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLead, setCurrentLead] = useState<any>(emptyLead);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');

  const openModal = (mode: 'create' | 'edit' | 'view', lead: any = emptyLead) => {
    setModalMode(mode);
    setCurrentLead(lead);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'create') {
      setLeads([...leads, { ...currentLead, id: leads.length + 1 }]);
    } else if (modalMode === 'edit') {
      setLeads(leads.map(l => l.id === currentLead.id ? currentLead : l));
    }
    setIsModalOpen(false);
  };

  return (
    <div className="w-full space-y-6 p-4 bg-slate-50 min-h-screen font-sans">
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
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-emerald-50/30 transition-all group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      {/* TABLE AVATAR */}
                      <img 
                        src={getAvatarUrl(lead.firstName, lead.lastName)} 
                        alt="avatar" 
                        className="w-10 h-10 rounded-xl object-cover shadow-sm border border-slate-100"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700 text-[15px]">{lead.firstName} {lead.lastName}</span>
                        <span className="text-xs text-slate-400">{lead.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-slate-600 flex items-center gap-1"><FiBriefcase size={12}/> {lead.company}</span>
                      <span className="text-[10px] font-black uppercase text-emerald-500">{lead.source}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex justify-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ${STATUS_COLORS[lead.status]}`}>
                        {lead.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openModal('view', lead)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-white rounded-lg transition-all"><FiEye size={18} /></button>
                      <button onClick={() => openModal('edit', lead)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all"><FiEdit2 size={16} /></button>
                      <button onClick={() => setLeads(leads.filter(l => l.id !== lead.id))} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-all"><FiTrash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL LOGIC --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          {modalMode === 'view' ? (
            /* --- CLEAN VIEW CARD --- */
            <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
              <div className="h-24 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-all"><FiX size={20} /></button>
              <div className="px-8 pb-8 text-center">
                <div className="relative -mt-12 mb-4">
                  <div className="h-24 w-24 bg-white rounded-3xl shadow-lg mx-auto flex items-center justify-center border-4 border-white overflow-hidden">
                    {/* PROFILE VIEW AVATAR */}
                    <img 
                      src={getAvatarUrl(currentLead.firstName, currentLead.lastName)} 
                      alt="Profile Avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-800">{currentLead.firstName} {currentLead.lastName}</h2>
                <p className="text-emerald-600 font-bold text-sm uppercase tracking-widest mt-1">{currentLead.company}</p>
                <div className="mt-6 space-y-4 text-left border-t pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-50 rounded-xl text-slate-400"><FiMail size={18} /></div>
                    <div><p className="text-[10px] uppercase font-black text-slate-400">Email Address</p><p className="text-sm font-bold text-slate-700">{currentLead.email}</p></div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-50 rounded-xl text-slate-400"><FiPhone size={18} /></div>
                    <div><p className="text-[10px] uppercase font-black text-slate-400">Phone Number</p><p className="text-sm font-bold text-slate-700">{currentLead.phone || 'N/A'}</p></div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-50 rounded-xl text-slate-400"><FiGlobe size={18} /></div>
                    <div><p className="text-[10px] uppercase font-black text-slate-400">Source Channel</p><p className="text-sm font-bold text-slate-700">{currentLead.source}</p></div>
                  </div>
                </div>
                {/* <button onClick={() => setIsModalOpen(false)} className="w-full mt-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all">Close Profile</button> */}
              </div>
            </div>
          ) : (
            /* --- CREATE / EDIT FORM --- */
            <form onSubmit={handleSubmit} className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 space-y-4 animate-in fade-in slide-in-from-bottom-4">
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
                  <input type="tel" className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 text-sm" value={currentLead.phone} onChange={(e) => setCurrentLead({...currentLead, phone: e.target.value})} placeholder="+92 ..." />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Company</label>
                  <select className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 text-sm" value={currentLead.company} onChange={(e) => setCurrentLead({...currentLead, company: e.target.value})}>
                    <option value="Google">Google</option>
                    <option value="Aura Tech">Aura Tech</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Dribble">Dribble</option>
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