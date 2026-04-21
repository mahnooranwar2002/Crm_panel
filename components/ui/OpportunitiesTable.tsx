"use client"
import React, { useState, useEffect } from 'react';
import { 
  FiPlus, FiEdit2, FiTrash2, FiEye, FiX, 
  FiCalendar, FiBriefcase, FiUser, FiTarget, FiDollarSign 
} from 'react-icons/fi';
import { OpportunityService } from '@/src/services/opportunityService';
import { CompanyService } from '@/src/services/companyService';
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

const getAvatar = (name: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&bold=true`;

const emptyOpp = {
  title: '',
  amount: 0,
  probability: 10,
  stage: 'Discovery',
  close_date: new Date().toISOString().split('T')[0],
  contact_id: '',
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
      const [oppRes, companyRes, userRes] = await Promise.all([
        OpportunityService.getOpportunities(1, 100),
        CompanyService.getCompanies(1, 100),
        UserService.getUsers()
      ]);

      // API structure checking
      const companies = companyRes?.data?.companies || companyRes?.companies || [];
      const usersList = userRes?.data?.users || userRes?.users || [];
      
      setContacts(companies);
      setUsers(usersList);

      const mappedOpps = (oppRes?.opportunities || []).map((opp: any) => {
        // Extract IDs - handle both string and object formats
        const contactId = typeof opp.contact_id === 'string' ? opp.contact_id : (opp.contact_id?._id || '');
        const ownerId = typeof opp.owner_id === 'string' ? opp.owner_id : (opp.owner_id?._id || '');
        
        // DEBUG: Log null values
        if (!contactId || contactId === 'null') {
          console.warn(`⚠️ Opportunity "${opp.title}" has NULL contact_id in database!`);
        }
        if (!ownerId || ownerId === 'null') {
          console.warn(`⚠️ Opportunity "${opp.title}" has NULL owner_id in database!`);
        }
        
        return {
          ...opp,
          // Store raw string IDs for form binding
          contact_id: contactId,
          owner_id: ownerId,
          // Store names for display
          assignedUserName: getUserNameFromList(ownerId, usersList),
          companyName: getCompanyNameFromList(contactId, companies),
          close_date: opp.close_date ? new Date(opp.close_date).toISOString().split('T')[0] : '',
        };
      });

      setOpps(mappedOpps);
    } catch (err) {
      console.error('Load data error:', err);
      toast.error("Failed to sync data");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get company name from list
  const getCompanyNameFromList = (contactId: string, companiesList: any[]) => {
    if (!contactId) return 'N/A';
    const company = companiesList.find(c => c._id === contactId);
    return company?.name || 'N/A';
  };

  // Helper function to get user name from list
  const getUserNameFromList = (userId: string, usersList: any[]) => {
    if (!userId) return 'Unassigned';
    const user = usersList.find(u => u._id === userId);
    return user?.name || 'Unassigned';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // STRICT VALIDATION - ensure required fields are NOT empty/null
    const titleTrimmed = currentOpp.title?.trim() || '';
    const companyIdTrimmed = (currentOpp.contact_id?.toString() || '').trim();
    const ownerIdTrimmed = (currentOpp.owner_id?.toString() || '').trim();

    if (!titleTrimmed) {
      toast.error('❌ Title is required');
      return;
    }
    if (!companyIdTrimmed) {
      toast.error('❌ Please select a company from dropdown');
      console.warn('VALIDATION FAILED: contact_id is empty', { contact_id: currentOpp.contact_id });
      return;
    }
    if (!ownerIdTrimmed) {
      toast.error('❌ Please select an owner/user from dropdown');
      console.warn('VALIDATION FAILED: owner_id is empty', { owner_id: currentOpp.owner_id });
      return;
    }

    const loadToast = toast.loading(modalMode === 'create' ? 'Creating...' : 'Updating...');
    try {
      // Build payload with STRICT enforcement - no null/undefined values
      const payload = {
        title: titleTrimmed,
        amount: Number(currentOpp.amount) || 0,
        probability: Number(currentOpp.probability) || 10,
        stage: currentOpp.stage || 'Discovery',
        close_date: currentOpp.close_date || new Date().toISOString().split('T')[0],
        contact_id: companyIdTrimmed, // FORCE: Must be valid, non-empty string
        owner_id: ownerIdTrimmed,     // FORCE: Must be valid, non-empty string
      };

      console.log('✅ PAYLOAD VALIDATION SUCCESS:');
      console.log('Contact ID:', payload.contact_id, `(length: ${payload.contact_id.length})`);
      console.log('Owner ID:', payload.owner_id, `(length: ${payload.owner_id.length})`);
      console.log('Full Payload:', JSON.stringify(payload, null, 2));

      let response;
      if (modalMode === 'create') {
        response = await OpportunityService.createOpportunity(payload);
      } else {
        response = await OpportunityService.updateOpportunity(currentOpp._id, payload);
      }
      
      // LOG BACKEND RESPONSE TO VERIFY DATA WAS SAVED
      console.log('🔍 BACKEND RESPONSE:', response);
      console.log('📦 Response contact_id:', response?.data?.contact_id || response?.contact_id);
      console.log('📦 Response owner_id:', response?.data?.owner_id || response?.owner_id);
      
      // Check if backend returned null IDs
      const backendContactId = response?.data?.contact_id || response?.contact_id;
      const backendOwnerId = response?.data?.owner_id || response?.owner_id;
      
      if (!backendContactId || !backendOwnerId) {
        console.error('❌ BACKEND BUG: Backend returned null IDs!');
        console.error('Sent contact_id:', payload.contact_id, '→ Backend returned:', backendContactId);
        console.error('Sent owner_id:', payload.owner_id, '→ Backend returned:', backendOwnerId);
        toast.error('⚠️ Check backend - IDs might be null in database!', { id: loadToast });
      } else {
        toast.success(modalMode === 'create' ? '✅ Created!' : '✅ Updated!', { id: loadToast });
      }
      
      await loadAllData();
      setIsModalOpen(false);
      setCurrentOpp(emptyOpp);
    } catch (err: any) {
      console.error('❌ SUBMIT ERROR:', err);
      toast.error(err.message || 'Action Failed', { id: loadToast });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this opportunity?')) return;
    setDeleting(id);
    const loadToast = toast.loading('Deleting...');
    try {
      await OpportunityService.deleteOpportunity(id);
      toast.success('Deleted!', { id: loadToast });
      await loadAllData();
    } catch (err: any) {
      toast.error('Delete failed', { id: loadToast });
    } finally {
      setDeleting(null);
    }
  };

  // Check if form is valid (all required fields filled)
  const isFormValid = () => {
    return currentOpp.title?.trim() && 
           currentOpp.contact_id?.toString().trim() && 
           currentOpp.owner_id?.toString().trim();
  };

  const openModal = (mode: 'create' | 'edit', opp: any = emptyOpp) => {
    setModalMode(mode);
    setCurrentOpp(opp);
    setIsModalOpen(true);
  };

  const openViewCard = (opp: any) => {
    setCurrentOpp(opp);
    setViewCardOpen(true);
  };

  // Get company name dynamically from selected contact_id
  const getCompanyName = (contactId: string) => {
    return getCompanyNameFromList(contactId, contacts);
  };

  // Get user name dynamically from selected owner_id
  const getUserName = (userId: string) => {
    return getUserNameFromList(userId, users);
  };

  return (
    <div className="w-full space-y-6 p-6 bg-slate-50 min-h-screen">
      <Toaster position="top-right" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Opportunities</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Sales Pipeline Tracking</p>
        </div>
        <button 
          onClick={() => {
            setCurrentOpp(emptyOpp);
            openModal('create');
          }}
          className="flex items-center gap-2 text-white hover:brightness-110 px-6 py-3 rounded-2xl font-bold transition-all shadow-lg active:scale-95"
          style={{ backgroundColor: PRIMARY_COLOR }}
        >
          <FiPlus size={20} />
          <span>New Deal</span>
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="px-8 py-6">Deal Details</th>
                <th className="px-8 py-6 text-center">Stage</th>
                <th className="px-8 py-6">Value & Prob.</th>
                <th className="px-8 py-6">Owner</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={5} className="p-20 text-center font-bold text-slate-300 uppercase">Loading...</td></tr>
              ) : opps.length === 0 ? (
                <tr><td colSpan={5} className="p-20 text-center font-bold text-slate-300 uppercase">No opportunities</td></tr>
              ) : (
                opps.map((opp) => {
                  const hasNullIds = !opp.contact_id || !opp.owner_id;
                  return (
                    <tr key={opp._id} className={`transition-colors ${
                      hasNullIds 
                        ? 'bg-red-50/50 hover:bg-red-50' 
                        : 'hover:bg-blue-50/20'
                    } group`}>
                      <td className="px-8 py-6">
                        <div className="flex items-start gap-2">
                          {hasNullIds && <span className="text-red-500 font-black text-lg mt-1">⚠️</span>}
                          <div>
                            <p className="font-bold text-slate-700 text-base">{opp.title}</p>
                            <p className={`text-[10px] font-black uppercase flex items-center gap-1.5 mt-1 ${
                              !opp.contact_id ? 'text-red-600' : 'text-slate-400'
                            }`}>
                              <FiBriefcase size={12} className={!opp.contact_id ? 'text-red-400' : 'text-slate-300'}/> 
                              {getCompanyName(opp.contact_id)}
                              {!opp.contact_id && ' (BACKEND NULL)'}
                            </p>
                          </div>
                        </div>
                      </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ring-1 ${STAGE_COLORS[opp.stage]}`}>
                        {opp.stage?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-black text-slate-800 text-lg">${(opp.amount || 0).toLocaleString()}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${opp.probability || 0}%` }}></div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">{opp.probability || 0}%</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`flex items-center gap-3 ${!opp.owner_id ? 'opacity-60' : ''}`}>
                        <img src={getAvatar(getUserName(opp.owner_id))} className="w-8 h-8 rounded-xl" alt="avatar" />
                        <div className="flex flex-col">
                          <span className={`text-sm font-bold ${
                            !opp.owner_id ? 'text-red-600' : 'text-slate-600'
                          }`}>
                            {getUserName(opp.owner_id)}
                            {!opp.owner_id && ' (BACKEND NULL)'}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><FiCalendar size={11}/> {opp.close_date}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openViewCard(opp)} className="p-2.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all" title="View"><FiEye size={18}/></button>
                        <button onClick={() => openModal('edit', opp)} className="p-2.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-all" title="Edit"><FiEdit2 size={16}/></button>
                        <button onClick={() => handleDelete(opp._id)} disabled={deleting === opp._id} className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all disabled:opacity-50" title="Delete"><FiTrash2 size={18}/></button>
                      </div>
                    </td>
                  </tr>
                    );
                  })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW CARD */}
      {viewCardOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8 sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-black text-slate-800 uppercase">Opportunity Details</h2>
              <button onClick={() => setViewCardOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><FiX size={24} /></button>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Deal Title</p>
                <p className="text-2xl font-black text-slate-900">{currentOpp.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2"><FiBriefcase size={14} /> Company</p>
                  <p className="text-lg font-bold text-slate-700">{getCompanyName(currentOpp.contact_id)}</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Stage</p>
                  <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase ring-1 ${STAGE_COLORS[currentOpp.stage]}`}>
                    {currentOpp.stage?.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2"><FiDollarSign size={14} /> Deal Value</p>
                  <p className="text-2xl font-black text-emerald-600">${(currentOpp.amount || 0).toLocaleString()}</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2"><FiTarget size={14} /> Probability</p>
                  <div className="flex items-center gap-3">
                    <div className="h-2 flex-1 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${currentOpp.probability || 0}%` }}></div>
                    </div>
                    <p className="text-xl font-black text-slate-700 w-12 text-right">{currentOpp.probability || 0}%</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2"><FiUser size={14} /> Assigned Owner</p>
                  <p className="text-lg font-bold text-slate-700">{getUserName(currentOpp.owner_id)}</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2"><FiCalendar size={14} /> Expected Close</p>
                  <p className="text-lg font-bold text-slate-700">{currentOpp.close_date || 'Not set'}</p>
                </div>
              </div>

              <button onClick={() => setViewCardOpen(false)} className="w-full py-4 text-white rounded-2xl font-black shadow-xl hover:brightness-110 transition-all" style={{ backgroundColor: PRIMARY_COLOR }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md overflow-y-auto">
          <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-10 my-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-800 uppercase">{modalMode === 'create' ? 'Create' : 'Edit'} Opportunity</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><FiX size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2 space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Opportunity Title *</label>
                  <input required className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-slate-700"
                    value={currentOpp.title} onChange={e => setCurrentOpp({...currentOpp, title: e.target.value})} placeholder="e.g. Enterprise Deal" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Related Company *</label>
                  <select className={`w-full p-4 rounded-2xl border-2 outline-none font-bold text-slate-700 appearance-none transition-all ${
                    currentOpp.contact_id 
                      ? 'border-emerald-400 bg-emerald-50' 
                      : 'border-slate-100 bg-slate-50'
                  }`}
                    value={currentOpp.contact_id} onChange={e => {
                      const selectedId = e.target.value;
                      console.log('📍 Selected company ID:', selectedId);
                      setCurrentOpp({...currentOpp, contact_id: selectedId});
                    }}>
                    <option value="">-- Select Company --</option>
                    {contacts.length > 0 ? contacts.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    )) : <option disabled>No companies available</option>}
                  </select>
                  {currentOpp.contact_id && (
                    <p className="text-xs text-emerald-600 font-bold mt-1">✅ Selected: {getCompanyName(currentOpp.contact_id)}</p>
                  )}
                  {!currentOpp.contact_id && (
                    <p className="text-xs text-rose-600 font-bold mt-1">⚠️ Required - choose a company</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assignee (Owner) *</label>
                  <select className={`w-full p-4 rounded-2xl border-2 outline-none font-bold text-slate-700 appearance-none transition-all ${
                    currentOpp.owner_id 
                      ? 'border-emerald-400 bg-emerald-50' 
                      : 'border-slate-100 bg-slate-50'
                  }`}
                    value={currentOpp.owner_id} onChange={e => {
                      const selectedId = e.target.value;
                      console.log('👤 Selected owner ID:', selectedId);
                      setCurrentOpp({...currentOpp, owner_id: selectedId});
                    }}>
                    <option value="">-- Select User --</option>
                    {users.length > 0 ? users.map(u => (
                      <option key={u._id} value={u._id}>{u.name || u.email}</option>
                    )) : <option disabled>No users available</option>}
                  </select>
                  {currentOpp.owner_id && (
                    <p className="text-xs text-emerald-600 font-bold mt-1">✅ Selected: {getUserName(currentOpp.owner_id)}</p>
                  )}
                  {!currentOpp.owner_id && (
                    <p className="text-xs text-rose-600 font-bold mt-1">⚠️ Required - choose an owner</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Deal Value ($)</label>
                  <input type="number" className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 outline-none font-bold text-slate-700"
                    value={currentOpp.amount} onChange={e => setCurrentOpp({...currentOpp, amount: e.target.value})} placeholder="0" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pipeline Stage</label>
                  <select className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 outline-none font-bold text-slate-700 appearance-none"
                    value={currentOpp.stage} onChange={e => setCurrentOpp({...currentOpp, stage: e.target.value})}>
                    {STAGES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Probability ({currentOpp.probability}%)</label>
                  <input type="range" min="0" max="100" className="w-full h-10 accent-blue-500"
                    value={currentOpp.probability} onChange={e => setCurrentOpp({...currentOpp, probability: e.target.value})} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Expected Close Date</label>
                  <input type="date" className="w-full p-4 rounded-2xl border border-slate-100 bg-slate-50 outline-none font-bold text-slate-700"
                    value={currentOpp.close_date} onChange={e => setCurrentOpp({...currentOpp, close_date: e.target.value})} />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={!isFormValid()}
                className={`w-full py-4 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl transition-all ${
                  isFormValid() 
                    ? 'hover:brightness-110 cursor-pointer' 
                    : 'opacity-50 cursor-not-allowed'
                }`} 
                style={{ backgroundColor: PRIMARY_COLOR }}>
                {isFormValid() ? (
                  <>{modalMode === 'create' ? '✅ Create Opportunity' : '✅ Update Opportunity'}</>
                ) : (
                  <>⚠️ {modalMode === 'create' ? 'Select Company & Owner' : 'Select Company & Owner'}</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpportunitiesTable;