// "use client"
// import React, { useState } from 'react';
// import { FiPlus, FiTrendingUp, FiCalendar, FiDollarSign, FiEdit2, FiTrash2, FiEye, FiX, FiCheckCircle, FiTarget, FiActivity } from 'react-icons/fi';

// // Schema Based Enums
// const STAGES = ['Discovery', 'Proposal', 'Negotiation', 'Closed_Won', 'Closed_Lost'];

// const STAGE_COLORS: any = {
//   Discovery: 'bg-blue-100 text-blue-700 ring-blue-500/20',
//   Proposal: 'bg-purple-100 text-purple-700 ring-purple-500/20',
//   Negotiation: 'bg-amber-100 text-amber-700 ring-amber-500/20',
//   Closed_Won: 'bg-emerald-100 text-emerald-700 ring-emerald-500/20',
//   Closed_Lost: 'bg-rose-100 text-rose-700 ring-rose-500/20',
// };

// const initialOpportunities = [
//   { id: 1, title: 'Website Dev Project', amount: 5000, stage: 'Proposal', probability: 60, close_date: '2026-05-20' },
//   { id: 2, title: 'Mobile App Support', amount: 1200, stage: 'Closed_Won', probability: 100, close_date: '2026-04-15' },
// ];

// const emptyOpp = {
//   title: '',
//   amount: '',
//   stage: 'Discovery',
//   probability: 10,
//   close_date: new Date().toISOString().split('T')[0],
// };

// export const OpportunitiesTable = () => {
//   const [opps, setOpps] = useState(initialOpportunities);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [currentOpp, setCurrentOpp] = useState<any>(emptyOpp);
//   const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');

//   const openModal = (mode: 'create' | 'edit' | 'view', opp: any = emptyOpp) => {
//     setModalMode(mode);
//     setCurrentOpp(opp);
//     setIsModalOpen(true);
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (modalMode === 'create') {
//       setOpps([...opps, { ...currentOpp, id: Date.now(), amount: Number(currentOpp.amount) }]);
//     } else if (modalMode === 'edit') {
//       setOpps(opps.map(o => o.id === currentOpp.id ? currentOpp : o));
//     }
//     setIsModalOpen(false);
//   };

//   const deleteOpp = (id: number) => {
//     if(confirm("Are you sure you want to delete this opportunity?")) {
//       setOpps(opps.filter(o => o.id !== id));
//     }
//   };

//   return (
//     <div className="w-full space-y-6 p-4 bg-slate-50 min-h-screen font-sans">
//       {/* --- HEADER --- */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
//         <div>
//           <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Opportunities</h1>
//           <p className="text-sm text-slate-500 mt-1 font-bold uppercase tracking-wider">Pipeline Management</p>
//         </div>
//         <button onClick={() => openModal('create')} className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-200 active:scale-95">
//           <FiPlus size={18} />
//           <span>New Opportunity</span>
//         </button>
//       </div>

//       {/* --- TABLE --- */}
//       <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.04)] overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest">
//                 <th className="px-6 py-5">Title</th>
//                 <th className="px-6 py-5">Value</th>
//                 <th className="px-6 py-5">Stage</th>
//                 <th className="px-6 py-5">Prob. %</th>
//                 <th className="px-6 py-5 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-50">
//               {opps.map((opp) => (
//                 <tr key={opp.id} className="hover:bg-emerald-50/30 transition-all group">
//                   <td className="px-6 py-5 font-bold text-slate-700">{opp.title}</td>
//                   <td className="px-6 py-5 font-black text-emerald-600">${opp.amount}</td>
//                   <td className="px-6 py-5">
//                     <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ring-1 ${STAGE_COLORS[opp.stage]}`}>
//                       {opp.stage.replace('_', ' ')}
//                     </span>
//                   </td>
//                   <td className="px-6 py-5">
//                     <div className="flex items-center gap-2">
//                        <div className="h-1.5 w-12 bg-slate-100 rounded-full overflow-hidden">
//                         <div className="h-full bg-emerald-500" style={{ width: `${opp.probability}%` }}></div>
//                        </div>
//                        <span className="text-xs font-bold text-slate-500">{opp.probability}%</span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-5 text-right">
//                     <div className="flex items-center justify-end gap-1">
//                       <button onClick={() => openModal('view', opp)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-white rounded-lg transition-all"><FiEye size={18} /></button>
//                       <button onClick={() => openModal('edit', opp)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all"><FiEdit2 size={16} /></button>
//                       <button onClick={() => deleteOpp(opp.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition-all"><FiTrash2 size={18} /></button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* --- MODAL --- */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
//           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
//           <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 animate-in zoom-in duration-200">
//             <div className="flex justify-between items-center mb-6 border-b pb-4">
//               <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
//                 {modalMode === 'view' ? 'Opportunity Details' : modalMode === 'create' ? 'Add New Deal' : 'Edit Deal'}
//               </h3>
//               <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400"><FiX size={20} /></button>
//             </div>

//             {modalMode === 'view' ? (
//               <div className="space-y-6">
//                 <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
//                     <div className="h-16 w-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
//                         <FiTarget size={30} />
//                     </div>
//                     <div>
//                         <h2 className="text-xl font-bold text-slate-800">{currentOpp.title}</h2>
//                         <p className="text-emerald-600 font-black text-lg">${currentOpp.amount}</p>
//                     </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                     <div className="p-4 border rounded-2xl">
//                         <p className="text-[10px] uppercase font-black text-slate-400">Current Stage</p>
//                         <p className="font-bold text-slate-700">{currentOpp.stage}</p>
//                     </div>
//                     <div className="p-4 border rounded-2xl">
//                         <p className="text-[10px] uppercase font-black text-slate-400">Probability</p>
//                         <p className="font-bold text-slate-700">{currentOpp.probability}%</p>
//                     </div>
//                     <div className="p-4 border rounded-2xl col-span-2">
//                         <p className="text-[10px] uppercase font-black text-slate-400">Expected Close Date</p>
//                         <p className="font-bold text-slate-700">{currentOpp.close_date}</p>
//                     </div>
//                 </div>
//                 <button onClick={() => setIsModalOpen(false)} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold">Done</button>
//               </div>
//             ) : (
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="space-y-1">
//                   <label className="text-[10px] font-black text-slate-400 uppercase">Opportunity Title</label>
//                   <input required className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500" value={currentOpp.title} onChange={(e) => setCurrentOpp({...currentOpp, title: e.target.value})} />
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                     <div className="space-y-1">
//                         <label className="text-[10px] font-black text-slate-400 uppercase">Amount ($)</label>
//                         <input type="number" required className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50 outline-none" value={currentOpp.amount} onChange={(e) => setCurrentOpp({...currentOpp, amount: e.target.value})} />
//                     </div>
//                     <div className="space-y-1">
//                         <label className="text-[10px] font-black text-slate-400 uppercase">Probability (%)</label>
//                         <input type="number" max="100" className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50 outline-none" value={currentOpp.probability} onChange={(e) => setCurrentOpp({...currentOpp, probability: e.target.value})} />
//                     </div>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                     <div className="space-y-1">
//                         <label className="text-[10px] font-black text-slate-400 uppercase">Stage</label>
//                         <select className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50 outline-none" value={currentOpp.stage} onChange={(e) => setCurrentOpp({...currentOpp, stage: e.target.value})}>
//                             {STAGES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
//                         </select>
//                     </div>
//                     <div className="space-y-1">
//                         <label className="text-[10px] font-black text-slate-400 uppercase">Close Date</label>
//                         <input type="date" className="w-full p-3 rounded-xl border border-slate-100 bg-slate-50 outline-none" value={currentOpp.close_date} onChange={(e) => setCurrentOpp({...currentOpp, close_date: e.target.value})} />
//                     </div>
//                 </div>
//                 <div className="flex gap-3 pt-4">
//                   <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-xl font-bold">Cancel</button>
//                   <button type="submit" className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700">
//                     {modalMode === 'create' ? 'Create Deal' : 'Save Changes'}
//                   </button>
//                 </div>
//               </form>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

"use client"
import React, { useState } from 'react';
import { FiPlus, FiTarget, FiEdit2, FiTrash2, FiEye, FiX, FiUser, FiCalendar, FiTrendingUp } from 'react-icons/fi';

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

const initialOpportunities = [
  { 
    id: 1, 
    title: 'Website Dev Project', 
    amount: 5000, 
    stage: 'Proposal', 
    probability: 60, 
    close_date: '2026-05-20',
    contactPerson: 'Ali Ahmed',
    assignedUser: 'Hamza Shahid'
  },
];

const emptyOpp = {
  title: '',
  amount: '',
  stage: 'Discovery',
  probability: 10,
  close_date: new Date().toISOString().split('T')[0],
  contactPerson: '',
  assignedUser: '',
};

export const OpportunitiesTable = () => {
  const [opps, setOpps] = useState(initialOpportunities);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOpp, setCurrentOpp] = useState<any>(emptyOpp);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');

  const openModal = (mode: 'create' | 'edit' | 'view', opp: any = emptyOpp) => {
    setModalMode(mode);
    setCurrentOpp(opp);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'create') {
      setOpps([...opps, { ...currentOpp, id: Date.now(), amount: Number(currentOpp.amount) }]);
    } else if (modalMode === 'edit') {
      setOpps(opps.map(o => o.id === currentOpp.id ? currentOpp : o));
    }
    setIsModalOpen(false);
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

      {/* --- TABLE --- */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-5">Deal & Contact</th>
                <th className="px-6 py-5 text-center">Stage</th>
                <th className="px-6 py-5">Value & Prob.</th>
                <th className="px-6 py-5">Assigned User</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {opps.map((opp) => (
                <tr key={opp.id} className="hover:bg-emerald-50/30 transition-all group">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700 text-[15px]">{opp.title}</span>
                      <span className="text-[10px] font-black text-emerald-600 flex items-center gap-1 uppercase tracking-tight">
                        <FiUser size={10}/> Ref: {opp.contactPerson || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ring-1 ${STAGE_COLORS[opp.stage]}`}>
                      {opp.stage.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <span className="font-black text-slate-700">${opp.amount}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-1 w-12 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${opp.probability}%` }}></div>
                        </div>
                        <span className="text-[9px] font-bold text-slate-400">{opp.probability}%</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <img src={getAvatar(opp.assignedUser || 'U')} className="w-7 h-7 rounded-lg shadow-sm border border-slate-200" />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-600 leading-tight">{opp.assignedUser || 'Unassigned'}</span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 uppercase"><FiCalendar size={10}/> {opp.close_date}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openModal('view', opp)} className="p-2 text-slate-300 hover:text-emerald-600 hover:bg-white rounded-lg transition-all"><FiEye size={18} /></button>
                      <button onClick={() => openModal('edit', opp)} className="p-2 text-slate-300 hover:text-blue-600 hover:bg-white rounded-lg transition-all"><FiEdit2 size={16} /></button>
                      <button onClick={() => setOpps(opps.filter(o => o.id !== opp.id))} className="p-2 text-slate-300 hover:text-rose-600 hover:bg-white rounded-lg transition-all"><FiTrash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                {modalMode === 'view' ? 'Deal Overview' : modalMode === 'create' ? 'Add New Opportunity' : 'Update Opportunity'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors"><FiX size={20} /></button>
            </div>

            {modalMode === 'view' ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                    <div className="h-14 w-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                        <FiTarget size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">{currentOpp.title}</h2>
                        <p className="text-emerald-600 font-black text-xl tracking-tight">${currentOpp.amount}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border border-slate-100 bg-slate-50/30 rounded-2xl">
                        <p className="text-[10px] uppercase font-black text-slate-400 mb-2">Deal Owner</p>
                        <div className="flex items-center gap-2">
                           <img src={getAvatar(currentOpp.assignedUser)} className="w-8 h-8 rounded-lg shadow-sm" />
                           <p className="font-bold text-slate-700">{currentOpp.assignedUser}</p>
                        </div>
                    </div>
                    <div className="p-4 border border-slate-100 bg-slate-50/30 rounded-2xl">
                        <p className="text-[10px] uppercase font-black text-slate-400 mb-2">Contact Source</p>
                        <p className="font-bold text-slate-700 flex items-center gap-2"><FiUser className="text-emerald-500" size={14} /> {currentOpp.contactPerson}</p>
                    </div>
                    <div className="p-4 border border-slate-100 rounded-2xl">
                        <p className="text-[10px] uppercase font-black text-slate-400">Current Stage</p>
                        <p className="font-bold text-slate-700">{currentOpp.stage}</p>
                    </div>
                    <div className="p-4 border border-slate-100 rounded-2xl">
                        <p className="text-[10px] uppercase font-black text-slate-400">Closing Date</p>
                        <p className="font-bold text-slate-700">{currentOpp.close_date}</p>
                    </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-full py-3.5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all">Close Details</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Opportunity Title</label>
                  <input required className="w-full p-3.5 rounded-2xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 font-medium" value={currentOpp.title} onChange={(e) => setCurrentOpp({...currentOpp, title: e.target.value})} placeholder="e.g. Website Dev Project" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Person</label>
                        <input required className="w-full p-3.5 rounded-2xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500" value={currentOpp.contactPerson} onChange={(e) => setCurrentOpp({...currentOpp, contactPerson: e.target.value})} placeholder="Lead source" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assign to User</label>
                        <input required className="w-full p-3.5 rounded-2xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500" value={currentOpp.assignedUser} onChange={(e) => setCurrentOpp({...currentOpp, assignedUser: e.target.value})} placeholder="Deal owner" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deal Value ($)</label>
                        <input type="number" required className="w-full p-3.5 rounded-2xl border border-slate-100 bg-slate-50" value={currentOpp.amount} onChange={(e) => setCurrentOpp({...currentOpp, amount: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Probability (%)</label>
                        <input type="number" max="100" className="w-full p-3.5 rounded-2xl border border-slate-100 bg-slate-50" value={currentOpp.probability} onChange={(e) => setCurrentOpp({...currentOpp, probability: e.target.value})} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pipeline Stage</label>
                        <select className="w-full p-3.5 rounded-2xl border border-slate-100 bg-slate-50 outline-none" value={currentOpp.stage} onChange={(e) => setCurrentOpp({...currentOpp, stage: e.target.value})}>
                            {STAGES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expected Close</label>
                        <input type="date" className="w-full p-3.5 rounded-2xl border border-slate-100 bg-slate-50" value={currentOpp.close_date} onChange={(e) => setCurrentOpp({...currentOpp, close_date: e.target.value})} />
                    </div>
                </div>

                <div className="flex gap-3 pt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold uppercase text-xs tracking-widest hover:bg-slate-100">Cancel</button>
                  <button type="submit" className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-100 active:scale-95 transition-all">
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