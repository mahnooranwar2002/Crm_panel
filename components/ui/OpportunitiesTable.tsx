"use client";
import React, { useState, useEffect, useCallback } from "react";
import { FiPlus, FiTarget, FiEdit2, FiTrash2, FiEye, FiX, FiUser, FiCalendar, FiBriefcase, FiPhone, FiSearch, FiFilter } from "react-icons/fi";
import { OpportunityService } from "@/src/services/opportunityService";

const STAGES = ["Discovery", "Proposal", "Negotiation", "Closed_Won", "Closed_Lost"];
const STAGE_COLORS: any = {
  Discovery: "bg-blue-100 text-blue-700 ring-blue-500/20",
  Proposal: "bg-purple-100 text-purple-700 ring-purple-500/20",
  Negotiation: "bg-amber-100 text-amber-700 ring-amber-500/20",
  Closed_Won: "bg-emerald-100 text-emerald-700 ring-emerald-500/20",
  Closed_Lost: "bg-rose-100 text-rose-700 ring-rose-500/20",
};

const getAvatar = (name: string) => `https://ui-avatars.com/api/?name=${name || "U"}&background=random&color=fff&bold=true`;

const emptyOpp = { title: "", amount: "", stage: "Discovery", probability: 10, close_date: new Date().toISOString().split("T")[0], contactPerson: "", assignedUser: "", companyName: "", companyNumber: "" };

export const OpportunitiesTable = () => {
  const [opps, setOpps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOpp, setCurrentOpp] = useState<any>(emptyOpp);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");

  const fetchOpportunities = useCallback(async () => {
    try {
      setLoading(true);
      const data = await OpportunityService.getOpportunities(1, 100, searchTerm, stageFilter);
      const oppsArray = Array.isArray(data) ? data : (data?.opportunities || data?.data || []);
      setOpps(oppsArray);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, stageFilter]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => fetchOpportunities(), 500);
    return () => clearTimeout(delayDebounce);
  }, [fetchOpportunities]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const oppId = currentOpp.id || currentOpp._id;
      if (modalMode === "create") {
        await OpportunityService.createOpportunity(currentOpp);
      } else {
        await OpportunityService.updateOpportunity(oppId, currentOpp);
      }
      setIsModalOpen(false);
      fetchOpportunities();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: any) => {
    if (!window.confirm('Confirm deletion of this deal?')) return;
    try {
      await OpportunityService.deleteOpportunity(id);
      setOpps(prev => prev.filter(o => (o.id !== id && o._id !== id)));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const openModal = (mode: "create" | "edit" | "view", opp: any = emptyOpp) => {
    setModalMode(mode);
    setCurrentOpp(opp);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full space-y-6 p-6 text-black bg-slate-50 min-h-screen font-sans">
      {/* HEADER & FILTERS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Opportunities</h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Full Pipeline Tracker</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search deals..." 
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none w-64 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
          >
            <option value="">All Stages</option>
            {STAGES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
          <button onClick={() => openModal("create")} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95">
            <FiPlus size={18} /> New Deal
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        {loading && opps.length === 0 ? (
          <div className="py-20 text-center animate-pulse text-slate-400 font-bold uppercase tracking-tighter">Loading Pipeline Data...</div>
        ) : error ? (
          <div className="py-20 text-center text-rose-500 font-bold uppercase italic">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
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
                {opps.map((opp) => (
                  <tr key={opp.id || opp._id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700 text-[15px]">{opp.title}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tight flex items-center gap-1">
                            <FiBriefcase size={10} /> {opp.companyName || "N/A"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ring-1 ${STAGE_COLORS[opp.stage]}`}>
                        {opp.stage.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="font-black text-slate-800 tracking-tight">${Number(opp.amount).toLocaleString()}</span>
                        <div className="flex items-center gap-2">
                          <div className="h-1 w-12 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${opp.probability}%` }}></div>
                          </div>
                          <span className="text-[9px] font-bold text-slate-400">{opp.probability}%</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <img src={getAvatar(opp.assignedUser)} className="w-8 h-8 rounded-xl shadow-sm border border-slate-100" alt="avatar" />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-600">{opp.assignedUser || "Unassigned"}</span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 uppercase font-medium">
                            <FiCalendar size={10} /> {opp.close_date}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openModal("view", opp)} className="p-2 text-slate-300 hover:text-emerald-600 hover:bg-white rounded-lg transition-all"><FiEye size={18} /></button>
                        <button onClick={() => openModal("edit", opp)} className="p-2 text-slate-300 hover:text-blue-600 hover:bg-white rounded-lg transition-all"><FiEdit2 size={16} /></button>
                        <button onClick={() => handleDelete(opp.id || opp._id)} className="p-2 text-slate-300 hover:text-rose-600 hover:bg-white rounded-lg transition-all"><FiTrash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 overflow-y-auto max-h-[95vh] border border-white/20">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-50">
              <h3 className="text-xl font-black text-slate-800 uppercase italic tracking-tight">
                {modalMode === "view" ? "Deal Analytics" : modalMode === "create" ? "Add Opportunity" : "Modify Deal"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors"><FiX size={20}/></button>
            </div>

            {modalMode === "view" ? (
              <div className="space-y-6">
                <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 relative overflow-hidden">
                   <div className="relative z-10">
                    <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">Projected Value</p>
                    <h2 className="text-3xl font-black text-slate-800">${Number(currentOpp.amount).toLocaleString()}</h2>
                    <p className="text-sm font-bold text-slate-500 mt-2">{currentOpp.title}</p>
                   </div>
                   <FiTarget className="absolute -right-4 -bottom-4 text-emerald-100 w-32 h-32" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Company', value: currentOpp.companyName, icon: <FiBriefcase/> },
                    { label: 'Owner', value: currentOpp.assignedUser, icon: <FiUser/> },
                    { label: 'Pipeline Stage', value: currentOpp.stage.replace('_', ' '), icon: <FiTarget/> },
                    { label: 'Close Date', value: currentOpp.close_date, icon: <FiCalendar/> }
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                      <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
                        <span className="text-emerald-500">{item.icon}</span> {item.value || '---'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Opportunity Title</label>
                  <input required className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-bold" value={currentOpp.title} onChange={e => setCurrentOpp({...currentOpp, title: e.target.value})} placeholder="e.g. Enterprise CRM Dev" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Company</label>
                    <input className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 text-sm" value={currentOpp.companyName} onChange={e => setCurrentOpp({...currentOpp, companyName: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Value ($)</label>
                    <input type="number" required className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 text-sm font-black text-emerald-600" value={currentOpp.amount} onChange={e => setCurrentOpp({...currentOpp, amount: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Pipeline Stage</label>
                    <select className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 text-sm font-bold outline-none" value={currentOpp.stage} onChange={e => setCurrentOpp({...currentOpp, stage: e.target.value})}>
                      {STAGES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Probability (%)</label>
                    <input type="number" max="100" className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 text-sm" value={currentOpp.probability} onChange={e => setCurrentOpp({...currentOpp, probability: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Assigned User</label>
                    <input required className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 text-sm" value={currentOpp.assignedUser} onChange={e => setCurrentOpp({...currentOpp, assignedUser: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Expected Close</label>
                    <input type="date" required className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 text-sm" value={currentOpp.close_date} onChange={e => setCurrentOpp({...currentOpp, close_date: e.target.value})} />
                  </div>
                </div>

                <button disabled={submitting} type="submit" className="w-full py-5 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 disabled:opacity-50 mt-6 active:scale-95">
                  {submitting ? 'Syncing Pipeline...' : 'Commit Deal'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};