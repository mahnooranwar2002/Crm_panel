"use client"
import React, { useState, useEffect } from 'react';
import { 
  FiPlus, FiEdit2, FiTrash2, FiEye, FiX, 
  FiCalendar, FiBriefcase, FiUser, FiTarget, FiDollarSign 
} from 'react-icons/fi';
import { OpportunityService } from '@/src/services/opportunityService';
import { ContactService } from '@/src/services/contactService';
import { UserService } from '@/src/services/userService';
import toast, { Toaster } from 'react-hot-toast';

const STAGES = ['Discovery', 'Proposal', 'Negotiation', 'Closed_Won', 'Closed_Lost'];

const STAGE_COLORS: any = {
  Discovery: 'bg-blue-100 text-blue-700 ring-blue-500/20',
  Proposal: 'bg-purple-100 text-purple-700 ring-purple-500/20',
  Negotiation: 'bg-amber-100 text-amber-700 ring-amber-500/20',
  Closed_Won: 'bg-emerald-100 text-emerald-700 ring-emerald-500/20',
  Closed_Lost: 'bg-rose-100 text-rose-700 ring-rose-500/20',
};

const getAvatar = (name: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=random&color=fff&bold=true`;

const emptyOpp = {
  title: '',
  amount: 0,
  probability: 10,
  stage: 'Discovery',
  close_date: new Date().toISOString().split('T')[0],
  contactId: '', // Pure flow mein ab yehi key use hogi
  owner_id: '',
};

export const OpportunitiesTable = () => {
  const [opps, setOpps] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewCardOpen, setViewCardOpen] = useState(false);
  const [currentOpp, setCurrentOpp] = useState<any>(emptyOpp);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const PRIMARY_COLOR = "#21a9ff";

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [oppRes, contactRes, userRes] = await Promise.all([
        OpportunityService.getOpportunities(1, 100),
        ContactService.getContacts(1, 100),
        UserService.getUsers()
      ]);

      const contactsList = contactRes?.contacts || [];
      const usersList = userRes?.data?.users || userRes?.users || [];
      
      console.log("👥 Contacts loaded:", contactsList.length, contactsList);
      console.log("👤 Users loaded:", usersList.length);
      
      setContacts(contactsList);
      setUsers(usersList);

      const mappedOpps = (oppRes?.opportunities || []).map((opp: any) => {
        let cId = '';
        let cName = 'N/A';
        
        if (opp.contactId && typeof opp.contactId === 'object' && opp.contactId._id) {
          cId = opp.contactId._id;
          cName = `${opp.contactId.first_name || ''} ${opp.contactId.last_name || ''}`.trim() || 'N/A';
        } else if (opp.contactId && typeof opp.contactId === 'string') {
          cId = opp.contactId;
          const found = contactsList.find((c: any) => c._id === cId);
          cName = found ? `${found.first_name || ''} ${found.last_name || ''}`.trim() : 'N/A';
        }
        
        const oId = opp.owner_id?._id || (typeof opp.owner_id === 'string' ? opp.owner_id : '');
        
        console.log(`📍 Opp: "${opp.title}" | cId: "${cId}" | Contact Name: "${cName}"`);

        return {
          ...opp,
          contactId: cId || null,
          owner_id: oId,
          companyName: cName,
          assignedUserName: opp.owner_id?.name || usersList.find((u: any) => u._id === oId)?.name || 'Unassigned',
          close_date: opp.close_date ? new Date(opp.close_date).toISOString().split('T')[0] : '',
        };
      });

      setOpps(mappedOpps);
    } catch (err) {
      toast.error("Failed to sync data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentOpp.title || !currentOpp.contactId || !currentOpp.owner_id) {
      toast.error('❌ Required fields missing');
      return;
    }

    // Prepare data for submission - convert close_date to ISO string
    const submitData = {
      ...currentOpp,
      amount: Number(currentOpp.amount),
      probability: Number(currentOpp.probability),
      close_date: currentOpp.close_date 
        ? new Date(currentOpp.close_date).toISOString() 
        : new Date().toISOString(),
    };

    const loadToast = toast.loading(modalMode === 'create' ? 'Creating...' : 'Updating...');
    try {
      if (modalMode === 'create') {
        await OpportunityService.createOpportunity(submitData);
      } else {
        await OpportunityService.updateOpportunity(currentOpp._id, submitData);
      }
      
      toast.success(modalMode === 'create' ? 'Deal Created!' : 'Deal Updated!', { id: loadToast });
      await loadAllData();
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Action Failed', { id: loadToast });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this deal permanently?')) return;
    setDeleting(id);
    try {
      await OpportunityService.deleteOpportunity(id);
      toast.success('Deleted');
      await loadAllData();
    } catch (err) {
      toast.error('Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="w-full space-y-6 p-6 bg-slate-50 min-h-screen">
      <Toaster position="top-right" />
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Opportunities</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Sales Pipeline Tracking</p>
        </div>
        <button 
          onClick={() => { setCurrentOpp(emptyOpp); setModalMode('create'); setIsModalOpen(true); }}
          className="flex items-center gap-2 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg active:scale-95 hover:brightness-110"
          style={{ backgroundColor: PRIMARY_COLOR }}
        >
          <FiPlus size={20} /> New Deal
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[2.5rem] text-black border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[11px] font-black text-slate-400 uppercase border-b border-slate-100">
                <th className="px-8 py-6">Deal Details</th>
                <th className="px-8 py-6 text-center">Stage</th>
                <th className="px-8 py-6">Value</th>
                <th className="px-8 py-6">Owner</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={5} className="p-20 text-center font-bold text-slate-300 uppercase">Syncing...</td></tr>
              ) : opps.map((opp) => (
                <tr key={opp._id} className="hover:bg-blue-50/20 group transition-colors">
                  <td className="px-8 py-6">
                    <div>
                      <p className="font-bold text-slate-700">{opp.title}</p>
                      <p className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1.5 mt-1">
                        <FiUser size={12} /> {opp.companyName}
                      </p>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ring-1 ${STAGE_COLORS[opp.stage]}`}>
                      {opp.stage?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-black text-slate-800">${Number(opp.amount).toLocaleString()}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <img src={getAvatar(opp.assignedUserName)} className="w-8 h-8 rounded-xl" />
                      <span className="text-sm font-bold text-slate-600">{opp.assignedUserName}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setCurrentOpp(opp); setViewCardOpen(true); }} className="p-2 text-slate-400 hover:text-blue-500"><FiEye size={18}/></button>
                      <button onClick={() => { setCurrentOpp(opp); setModalMode('edit'); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-amber-500"><FiEdit2 size={16}/></button>
                      <button onClick={() => handleDelete(opp._id)} disabled={deleting === opp._id} className="p-2 text-slate-400 hover:text-rose-500"><FiTrash2 size={18}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center text-black justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] p-10 relative">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-800 uppercase">{modalMode} Opportunity</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400"><FiX size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-5">
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">Title</label>
                <input required className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 outline-none font-bold"
                  value={currentOpp.title} onChange={e => setCurrentOpp({...currentOpp, title: e.target.value})} />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">Contact *</label>
                <select required className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 outline-none font-bold"
                  value={currentOpp.contactId || ''} onChange={e => {
                    console.log("🔗 Contact selected:", e.target.value);
                    setCurrentOpp({...currentOpp, contactId: e.target.value});
                  }}>
                  <option value="">-- Select a Contact --</option>
                  {contacts && contacts.length > 0 ? (
                    contacts.map(c => <option key={c._id} value={c._id}>{c.first_name} {c.last_name}</option>)
                  ) : (
                    <option disabled>No contacts available</option>
                  )}
                </select>
                {contacts.length === 0 && <p className="text-[10px] text-amber-600 mt-1">⚠️ No contacts loaded</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">Owner</label>
                <select required className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 outline-none font-bold"
                  value={currentOpp.owner_id} onChange={e => setCurrentOpp({...currentOpp, owner_id: e.target.value})}>
                  <option value="">Select Owner</option>
                  {users.map(u => <option key={u._id} value={u._id}>{u.name || u.email}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">Amount ($)</label>
                <input type="number" className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 outline-none font-bold"
                  value={currentOpp.amount} onChange={e => setCurrentOpp({...currentOpp, amount: Number(e.target.value)})} />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">Probability (%)</label>
                <input type="number" min="0" max="100" className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 outline-none font-bold"
                  value={currentOpp.probability} onChange={e => setCurrentOpp({...currentOpp, probability: Number(e.target.value)})} />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">Close Date</label>
                <input type="date" className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 outline-none font-bold"
                  value={currentOpp.close_date} onChange={e => setCurrentOpp({...currentOpp, close_date: e.target.value})} />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">Stage</label>
                <select className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 outline-none font-bold"
                  value={currentOpp.stage} onChange={e => setCurrentOpp({...currentOpp, stage: e.target.value})}>
                  {STAGES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </select>
              </div>

              <button type="submit" className="col-span-2 mt-4 py-4 text-white rounded-2xl font-black uppercase bg-[#21a9ff] shadow-xl">
                Save Opportunity
              </button>
            </form>
          </div>
        </div>
      )}

      {/* VIEW CARD */}
      {viewCardOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] p-10 relative">
            <button onClick={() => setViewCardOpen(false)} className="absolute top-6 right-6 text-slate-400"><FiX size={24} /></button>
            <h3 className="text-xl font-black text-slate-800 uppercase mb-8 flex items-center gap-2">
              <FiEye className="text-blue-500" /> Deal Overview
            </h3>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase">Title</p>
                <p className="font-bold text-slate-700 text-lg">{currentOpp.title}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase">Value</p>
                <p className="font-black text-emerald-600 text-lg">${Number(currentOpp.amount).toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase">Contact</p>
                <p className="font-bold text-slate-700">{currentOpp.companyName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase">Assigned To</p>
                <p className="font-bold text-slate-700">{currentOpp.assignedUserName}</p>
              </div>
              <div className="col-span-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ring-1 ${STAGE_COLORS[currentOpp.stage]}`}>
                  {currentOpp.stage?.replace('_', ' ')}
                </span>
                <p className="text-sm font-bold text-slate-500 flex items-center gap-2">
                  <FiCalendar /> Closing: {currentOpp.close_date}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpportunitiesTable;