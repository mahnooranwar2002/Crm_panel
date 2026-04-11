"use client";
import React, { useState } from "react";
import {
  FiPlus,
  FiTarget,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiX,
  FiUser,
  FiCalendar,
  FiBriefcase,
  FiPhone,
} from "react-icons/fi";

// Helpers & Enums
const STAGES = [
  "Discovery",
  "Proposal",
  "Negotiation",
  "Closed_Won",
  "Closed_Lost",
];
const getAvatar = (name: string) =>
  `https://ui-avatars.com/api/?name=${name || "U"}&background=random&color=fff&bold=true`;

const STAGE_COLORS: any = {
  Discovery: "bg-blue-100 text-blue-700 ring-blue-500/20",
  Proposal: "bg-purple-100 text-purple-700 ring-purple-500/20",
  Negotiation: "bg-amber-100 text-amber-700 ring-amber-500/20",
  Closed_Won: "bg-emerald-100 text-emerald-700 ring-emerald-500/20",
  Closed_Lost: "bg-rose-100 text-rose-700 ring-rose-500/20",
};

const initialOpportunities = [
  {
    id: 1,
    title: "Website Dev Project",
    amount: 5000,
    stage: "Proposal",
    probability: 60,
    close_date: "2026-05-20",
    contactPerson: "Ali Ahmed",
    assignedUser: "Hamza Shahid",
    companyName: "Tech Solutions",
    companyNumber: "+92 300 1234567",
  },
];

const emptyOpp = {
  title: "",
  amount: "",
  stage: "Discovery",
  probability: 10,
  close_date: new Date().toISOString().split("T")[0],
  contactPerson: "",
  assignedUser: "",
  companyName: "",
  companyNumber: "",
};

export const OpportunitiesTable = () => {
  const [opps, setOpps] = useState(initialOpportunities);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOpp, setCurrentOpp] = useState<any>(emptyOpp);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create",
  );

  const openModal = (mode: "create" | "edit" | "view", opp: any = emptyOpp) => {
    setModalMode(mode);
    setCurrentOpp(opp);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === "create") {
      setOpps([
        ...opps,
        { ...currentOpp, id: Date.now(), amount: Number(currentOpp.amount) },
      ]);
    } else if (modalMode === "edit") {
      setOpps(opps.map((o) => (o.id === currentOpp.id ? currentOpp : o)));
    }
    setIsModalOpen(false);
  };

  return (
    <div className="w-full space-y-6 p-4 bg-slate-50 min-h-screen font-sans text-slate-900">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
            Opportunities
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-bold uppercase tracking-wider">
            Full Pipeline Tracker
          </p>
        </div>
        <button
          onClick={() => openModal("create")}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95"
        >
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
                <th className="px-6 py-5">Deal & Company</th>
                <th className="px-6 py-5 text-center">Stage</th>
                <th className="px-6 py-5">Value & Prob.</th>
                <th className="px-6 py-5">Assigned User</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {opps.map((opp) => (
                <tr
                  key={opp.id}
                  className="hover:bg-emerald-50/30 transition-all group"
                >
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1.5">
                      {" "}
                      {/* Gap barha diya taakay saaf dikhay */}
                      <span className="font-bold text-slate-700 text-[15px] leading-none">
                        {opp.title}
                      </span>
                      <div className="flex flex-col gap-0.5">
                        {/* Company Name - Strong green for branding */}
                        <span className="text-[10px] font-black text-emerald-600 flex items-center gap-1 uppercase tracking-tight">
                          <FiBriefcase size={10} />{" "}
                          {opp.companyName || "No Company"}
                        </span>

                        {/* Company Number - Subtitle style (Light & Clean) */}
                        <span className="text-[9px] font-medium text-slate-700 flex items-center gap-1 ml-[1px]">
                          <FiPhone size={9} className="opacity-70" />
                          {opp.companyNumber || "No Number"}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ring-1 ${STAGE_COLORS[opp.stage]}`}
                    >
                      {opp.stage.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <span className="font-black text-slate-700">
                        ${opp.amount}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="h-1 w-12 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500"
                            style={{ width: `${opp.probability}%` }}
                          ></div>
                        </div>
                        <span className="text-[9px] font-bold text-slate-400">
                          {opp.probability}%
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <img
                        src={getAvatar(opp.assignedUser)}
                        className="w-7 h-7 rounded-lg shadow-sm border border-slate-200"
                        alt="avatar"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-600 leading-tight">
                          {opp.assignedUser || "Unassigned"}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 uppercase">
                          <FiCalendar size={10} /> {opp.close_date}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openModal("view", opp)}
                        className="p-2 text-slate-300 hover:text-emerald-600 hover:bg-white rounded-lg transition-all"
                      >
                        <FiEye size={18} />
                      </button>
                      <button
                        onClick={() => openModal("edit", opp)}
                        className="p-2 text-slate-300 hover:text-blue-600 hover:bg-white rounded-lg transition-all"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() =>
                          setOpps(opps.filter((o) => o.id !== opp.id))
                        }
                        className="p-2 text-slate-300 hover:text-rose-600 hover:bg-white rounded-lg transition-all"
                      >
                        <FiTrash2 size={18} />
                      </button>
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
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>

          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 animate-in zoom-in duration-200 overflow-y-auto max-h-[95vh]">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                {modalMode === "view"
                  ? "Deal Overview"
                  : modalMode === "create"
                    ? "Add New Opportunity"
                    : "Update Opportunity"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            {modalMode === "view" ? (
              <div className="space-y-6">
                {/* Header Card */}
                <div className="flex items-center gap-4 p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                  <div className="h-14 w-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-100">
                    <FiTarget size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 leading-tight">
                      {currentOpp.title}
                    </h2>
                    <p className="text-emerald-600 font-black text-xl tracking-tight mt-0.5">
                      ${currentOpp.amount}
                    </p>
                  </div>
                </div>

                {/* Info Grid - Styled with borders like the bottom boxes */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Company Name Box */}
                  <div className="p-4 border border-slate-100 bg-slate-50/30 rounded-2xl group hover:border-emerald-200 transition-colors">
                    <p className="text-[10px] uppercase font-black text-slate-400 mb-2 tracking-widest">
                      Company Name
                    </p>
                    <div className="flex items-center gap-2">
                      <FiBriefcase className="text-emerald-500" size={14} />
                      <p className="font-bold text-slate-700 truncate">
                        {currentOpp.companyName || "---"}
                      </p>
                    </div>
                  </div>

                  {/* Company Number Box */}
                  <div className="p-4 border border-slate-100 bg-slate-50/30 rounded-2xl group hover:border-emerald-200 transition-colors">
                    <p className="text-[10px] uppercase font-black text-slate-400 mb-2 tracking-widest">
                      Company Number
                    </p>
                    <div className="flex items-center gap-2">
                      <FiPhone className="text-emerald-500" size={14} />
                      <p className="font-bold text-slate-700">
                        {currentOpp.companyNumber || "---"}
                      </p>
                    </div>
                  </div>

                  {/* Deal Owner Box */}
                  <div className="p-4 border border-slate-100 bg-slate-50/30 rounded-2xl">
                    <p className="text-[10px] uppercase font-black text-slate-400 mb-2 tracking-widest">
                      Deal Owner
                    </p>
                    <div className="flex items-center gap-2">
                      <img
                        src={getAvatar(currentOpp.assignedUser)}
                        className="w-7 h-7 rounded-lg shadow-sm border border-slate-200"
                        alt="owner"
                      />
                      <p className="font-bold text-slate-700 text-sm">
                        {currentOpp.assignedUser}
                      </p>
                    </div>
                  </div>

                  {/* Contact Source Box */}
                  <div className="p-4 border border-slate-100 bg-slate-50/30 rounded-2xl">
                    <p className="text-[10px] uppercase font-black text-slate-400 mb-2 tracking-widest">
                      Contact Source
                    </p>
                    <div className="flex items-center gap-2">
                      <FiUser className="text-emerald-500" size={14} />
                      <p className="font-bold text-slate-700 text-sm">
                        {currentOpp.contactPerson}
                      </p>
                    </div>
                  </div>

                  {/* Current Stage Box */}
                  <div className="p-4 border border-slate-100 rounded-2xl bg-white shadow-sm shadow-slate-100/50">
                    <p className="text-[10px] uppercase font-black text-slate-400 mb-1">
                      Current Stage
                    </p>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase ring-1 ring-emerald-500/20">
                      {currentOpp.stage.replace("_", " ")}
                    </span>
                  </div>

                  {/* Closing Date Box */}
                  <div className="p-4 border border-slate-100 rounded-2xl bg-white shadow-sm shadow-slate-100/50">
                    <p className="text-[10px] uppercase font-black text-slate-400 mb-1">
                      Closing Date
                    </p>
                    <p className="font-bold text-slate-700 flex items-center gap-1.5">
                      <FiCalendar size={13} className="text-slate-400" />
                      {currentOpp.close_date}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl active:scale-[0.98]"
                >
                  Close Details
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Opportunity Title
                  </label>
                  <input
                    required
                    className="w-full p-3.5 rounded-2xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    value={currentOpp.title}
                    onChange={(e) =>
                      setCurrentOpp({ ...currentOpp, title: e.target.value })
                    }
                    placeholder="e.g. Website Dev Project"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Company Name
                    </label>
                    <input
                      className="w-full p-3.5 rounded-2xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500"
                      value={currentOpp.companyName}
                      onChange={(e) =>
                        setCurrentOpp({
                          ...currentOpp,
                          companyName: e.target.value,
                        })
                      }
                      placeholder="Company Name"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Company Number
                    </label>
                    <input
                      className="w-full p-3.5 rounded-2xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500"
                      value={currentOpp.companyNumber}
                      onChange={(e) =>
                        setCurrentOpp({
                          ...currentOpp,
                          companyNumber: e.target.value,
                        })
                      }
                      placeholder="Contact No"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Contact Person
                    </label>
                    <input
                      required
                      className="w-full p-3.5 rounded-2xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500"
                      value={currentOpp.contactPerson}
                      onChange={(e) =>
                        setCurrentOpp({
                          ...currentOpp,
                          contactPerson: e.target.value,
                        })
                      }
                      placeholder="Lead source"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Assign to User
                    </label>
                    <input
                      required
                      className="w-full p-3.5 rounded-2xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-emerald-500"
                      value={currentOpp.assignedUser}
                      onChange={(e) =>
                        setCurrentOpp({
                          ...currentOpp,
                          assignedUser: e.target.value,
                        })
                      }
                      placeholder="Deal owner"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Deal Value ($)
                    </label>
                    <input
                      type="number"
                      required
                      className="w-full p-3.5 rounded-2xl border border-slate-100 bg-slate-50"
                      value={currentOpp.amount}
                      onChange={(e) =>
                        setCurrentOpp({ ...currentOpp, amount: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Probability (%)
                    </label>
                    <input
                      type="number"
                      max="100"
                      className="w-full p-3.5 rounded-2xl border border-slate-100 bg-slate-50"
                      value={currentOpp.probability}
                      onChange={(e) =>
                        setCurrentOpp({
                          ...currentOpp,
                          probability: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Pipeline Stage
                    </label>
                    <select
                      className="w-full p-3.5 rounded-2xl border border-slate-100 bg-slate-50 outline-none"
                      value={currentOpp.stage}
                      onChange={(e) =>
                        setCurrentOpp({ ...currentOpp, stage: e.target.value })
                      }
                    >
                      {STAGES.map((s) => (
                        <option key={s} value={s}>
                          {s.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Expected Close
                    </label>
                    <input
                      type="date"
                      className="w-full p-3.5 rounded-2xl border border-slate-100 bg-slate-50"
                      value={currentOpp.close_date}
                      onChange={(e) =>
                        setCurrentOpp({
                          ...currentOpp,
                          close_date: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold uppercase text-xs tracking-widest hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-100 active:scale-95 transition-all"
                  >
                    {modalMode === "create" ? "Create Deal" : "Save Changes"}
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
