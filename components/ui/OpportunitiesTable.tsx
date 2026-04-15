"use client"
import React, { useState, useEffect } from 'react';
import { FiPlus, FiTarget, FiEdit2, FiTrash2, FiEye, FiX, FiUser, FiCalendar, FiBriefcase, FiDollarSign, FiTrendingUp } from 'react-icons/fi';
import { OpportunityService } from '@/src/services/opportunityService';

// Helpers & Enums
const STAGES = ['Discovery', 'Proposal', 'Negotiation', 'Closed_Won', 'Closed_Lost'];
const getAvatar = (name: string) => `https://ui-avatars.com/api/?name=${name}&background=random&color=fff&bold=true`;

const STAGE_COLORS: any = {
  Discovery: 'bg-blue-100 text-blue-700 ring-blue-500/20',
  Proposal: 'bg-purple-100 text-purple-700 ring-purple-500/20',
  Negotiation: 'bg-amber-100 text-amber-700 ring-amber-500/20',
  Closed_Won: 'bg-emerald-100 text-emerald-700 ring-emerald-500/20',
  Closed_Lost: 'bg-rose-100 text-rose-700 ring-rose-500/20',
};

const emptyOpp = {
  title: '',
  company: '',
  contactPerson: '',
  assignedUser: '',
  amount: 0,
  probability: 10,
  stage: 'Discovery',
  close_date: new Date().toISOString().split('T')[0],
};

export const OpportunitiesTable = () => {
  const [opps, setOpps] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOpp, setCurrentOpp] = useState<any>(emptyOpp);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch opportunities from API on component mount
  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const data = await OpportunityService.getOpportunities(1, 100);
      // Backend returns: { opportunities: [], pagination: {...} }
      const oppsArray = data?.opportunities || [];
      setOpps(oppsArray);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching opportunities:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (mode: 'create' | 'edit' | 'view', opp: any = emptyOpp) => {
    setModalMode(mode);
    setCurrentOpp(opp);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Clean the opportunity data: remove empty fields to avoid ObjectId cast errors
      const cleanedOpp = Object.fromEntries(
        Object.entries(currentOpp).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
      );

      if (modalMode === 'create') {
        await OpportunityService.createOpportunity(cleanedOpp);
      } else if (modalMode === 'edit') {
        await OpportunityService.updateOpportunity(currentOpp._id, cleanedOpp);
      }
      await fetchOpportunities();
      setIsModalOpen(false);
      setCurrentOpp(emptyOpp);
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this opportunity?')) {
      try {
        await OpportunityService.deleteOpportunity(id);
        await fetchOpportunities();
      } catch (err: any) {
        alert('Error: ' + err.message);
      }
    }
  };

  return (
    <div className="w-full space-y-6 p-4 bg-slate-50 min-h-screen font-sans text-slate-900">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Opportunities</h1>
          <p className="text-sm text-slate-500 mt-1 font-bold uppercase tracking-wider">Full Pipeline Tracker</p>
        </div>
        <button onClick={() => openModal('create')} className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95">
          <FiPlus size={18} />
          <span>New Opportunity</span>
        </button>
      </div>

      {/* --- ERROR MESSAGE --- */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg">
          Error: {error}
        </div>
      )}

      {/* --- TABLE --- */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-5">Deal & Company</th>
                <th className="px-6 py-5 text-center">Stage</th>
                <th className="px-6 py-5">Value & Prob.</th>
                <th className="px-6 py-5">Assigned User</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading opportunities...</td>
                </tr>
              ) : opps.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No opportunities found</td>
                </tr>
              ) : (
                opps.map((opp) => (
                  <tr key={opp._id} className="hover:bg-emerald-50/30 transition-all group">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700 text-[15px]">{opp.title || 'N/A'}</span>
                        <span className="text-[10px] font-black text-slate-400 flex items-center gap-1 uppercase tracking-tight mt-0.5">
                          <FiBriefcase size={10}/> {opp.company || 'Private Client'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ring-1 ${STAGE_COLORS[opp.stage] || STAGE_COLORS['Discovery']}`}>
                        {(opp.stage || 'Discovery').replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="font-black text-slate-700">${opp.amount || 0}</span>
                        <div className="flex items-center gap-2">
                          <div className="h-1 w-12 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${opp.probability || 0}%` }}></div>
                          </div>
                          <span className="text-[9px] font-bold text-slate-400">{opp.probability || 0}%</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <img src={getAvatar(opp.assignedUser || 'U')} className="w-7 h-7 rounded-lg shadow-sm border border-slate-200" alt="user" />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-600 leading-tight">{opp.assignedUser || 'Unassigned'}</span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 uppercase"><FiCalendar size={10}/> {opp.close_date || 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openModal('view', opp)} className="p-2 text-slate-300 hover:text-emerald-600 hover:bg-white rounded-lg transition-all"><FiEye size={18} /></button>
                        <button onClick={() => openModal('edit', opp)} className="p-2 text-slate-300 hover:text-blue-600 hover:bg-white rounded-lg transition-all"><FiEdit2 size={16} /></button>
                        <button onClick={() => handleDelete(opp._id)} className="p-2 text-slate-300 hover:text-rose-600 hover:bg-white rounded-lg transition-all"><FiTrash2 size={18} /></button>
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
          
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-8 animate-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b pb-4 sticky top-0 bg-white z-10">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                {modalMode === 'view' ? 'Deal Overview' : modalMode === 'create' ? 'Add New Opportunity' : 'Update Opportunity'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors"><FiX size={20} /></button>
            </div>

            {modalMode === 'view' ? (
              <div className="space-y-6">
                {/* Title & Amount Card */}
                <div className="flex items-center gap-4 p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                    <div className="h-14 w-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                        <FiTarget size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">{currentOpp.title || 'N/A'}</h2>
                        <p className="text-emerald-600 font-black text-xl tracking-tight">${currentOpp.amount || 0}</p>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Company */}
                    <div className="p-4 border border-slate-100 bg-slate-50/30 rounded-2xl col-span-2">
                        <p className="text-[10px] uppercase font-black text-slate-400 mb-2 flex items-center gap-2"><FiBriefcase className="text-emerald-500" size={14}/> Company</p>
                        <p className="font-bold text-slate-700 text-base">{currentOpp.company || 'N/A'}</p>
                    </div>

                    {/* Contact Person */}
                    <div className="p-4 border border-slate-100 bg-slate-50/30 rounded-2xl">
                        <p className="text-[10px] uppercase font-black text-slate-400 mb-2 flex items-center gap-2"><FiUser className="text-blue-500" size={14}/> Contact Person</p>
                        <p className="font-bold text-slate-700">{currentOpp.contactPerson || 'N/A'}</p>
                    </div>

                    {/* Deal Owner */}
                    <div className="p-4 border border-slate-100 bg-slate-50/30 rounded-2xl">
                        <p className="text-[10px] uppercase font-black text-slate-400 mb-2 flex items-center gap-2"><FiUser className="text-purple-500" size={14}/> Assigned To</p>
                        <div className="flex items-center gap-2">
                           <img src={getAvatar(currentOpp.assignedUser || 'U')} className="w-6 h-6 rounded-lg shadow-sm" alt="user" />
                           <p className="font-bold text-slate-700">{currentOpp.assignedUser || 'Unassigned'}</p>
                        </div>
                    </div>

                    {/* Deal Value */}
                    <div className="p-4 border border-slate-100 bg-slate-50/30 rounded-2xl">
                        <p className="text-[10px] uppercase font-black text-slate-400 mb-2 flex items-center gap-2"><FiDollarSign className="text-emerald-500" size={14}/> Deal Value</p>
                        <p className="font-bold text-slate-700 text-lg">${currentOpp.amount || 0}</p>
                    </div>

                    {/* Probability */}
                    <div className="p-4 border border-slate-100 bg-slate-50/30 rounded-2xl">
                        <p className="text-[10px] uppercase font-black text-slate-400 mb-2 flex items-center gap-2"><FiTrendingUp className="text-orange-500" size={14}/> Probability</p>
                        <div className="flex items-center gap-3">
                          <div className="h-2 flex-1 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500" style={{ width: `${currentOpp.probability || 0}%` }}></div>
                          </div>
                          <p className="font-bold text-slate-700">{currentOpp.probability || 0}%</p>
                        </div>
                    </div>

                    {/* Pipeline Stage */}
                    <div className="p-4 border border-slate-100 bg-slate-50/30 rounded-2xl">
                        <p className="text-[10px] uppercase font-black text-slate-400 mb-2">Pipeline Status</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase ring-1 ${STAGE_COLORS[currentOpp.stage] || STAGE_COLORS['Discovery']}`}>
                          {(currentOpp.stage || 'Discovery').replace('_', ' ')}
                        </span>
                    </div>

                    {/* Expected Close */}
                    <div className="p-4 border border-slate-100 bg-slate-50/30 rounded-2xl">
                        <p className="text-[10px] uppercase font-black text-slate-400 mb-2 flex items-center gap-2"><FiCalendar className="text-blue-500" size={14}/> Expected Close</p>
                        <p className="font-bold text-slate-700">{currentOpp.close_date || 'N/A'}</p>
                    </div>
                </div>

                <button onClick={() => setIsModalOpen(false)} className="w-full py-3.5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all">Close Details</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Row 1: Title & Company */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Opportunity Title</label>
                      <input 
                        required 
                        className="w-full p-3.5 rounded-2xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 font-medium" 
                        value={currentOpp.title || ''} 
                        onChange={(e) => setCurrentOpp({...currentOpp, title: e.target.value})} 
                        placeholder="e.g. Website Dev" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Company Name</label>
                      <input 
                        required 
                        className="w-full p-3.5 rounded-2xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 font-medium" 
                        value={currentOpp.company || ''} 
                        onChange={(e) => setCurrentOpp({...currentOpp, company: e.target.value})} 
                        placeholder="e.g. Acme Corp" 
                      />
                    </div>
                </div>
                
                {/* Row 2: Contact Person & Assigned User */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Person</label>
                        <input 
                          required 
                          className="w-full p-3.5 rounded-2xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 font-medium" 
                          value={currentOpp.contactPerson || ''} 
                          onChange={(e) => setCurrentOpp({...currentOpp, contactPerson: e.target.value})} 
                          placeholder="Contact name" 
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assign to User</label>
                        <input 
                          required 
                          className="w-full p-3.5 rounded-2xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 font-medium" 
                          value={currentOpp.assignedUser || ''} 
                          onChange={(e) => setCurrentOpp({...currentOpp, assignedUser: e.target.value})} 
                          placeholder="Deal owner" 
                        />
                    </div>
                </div>

                {/* Row 3: Deal Value & Probability */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deal Value ($)</label>
                        <input 
                          type="number" 
                          required 
                          className="w-full p-3.5 rounded-2xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500" 
                          value={currentOpp.amount || 0} 
                          onChange={(e) => setCurrentOpp({...currentOpp, amount: parseFloat(e.target.value) || 0})} 
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Probability (%)</label>
                        <input 
                          type="number" 
                          min="0"
                          max="100" 
                          className="w-full p-3.5 rounded-2xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500" 
                          value={currentOpp.probability || 10} 
                          onChange={(e) => setCurrentOpp({...currentOpp, probability: parseInt(e.target.value) || 10})} 
                        />
                    </div>
                </div>

                {/* Row 4: Pipeline Stage & Expected Close */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pipeline Stage</label>
                        <select 
                          className="w-full p-3.5 rounded-2xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500" 
                          value={currentOpp.stage || 'Discovery'} 
                          onChange={(e) => setCurrentOpp({...currentOpp, stage: e.target.value})}
                        >
                            {STAGES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expected Close</label>
                        <input 
                          type="date" 
                          className="w-full p-3.5 rounded-2xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500" 
                          value={currentOpp.close_date || new Date().toISOString().split('T')[0]} 
                          onChange={(e) => setCurrentOpp({...currentOpp, close_date: e.target.value})} 
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    className="flex-1 py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold uppercase text-xs tracking-widest hover:bg-slate-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-100 active:scale-95 transition-all"
                  >
                    {modalMode === 'create' ? 'Create Deal' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OpportunitiesTable;
