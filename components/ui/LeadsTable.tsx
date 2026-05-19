"use client";
import React, { useState, useEffect } from "react";
import {
  FiEye,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiX,
  FiBriefcase,
  FiMail,
  FiCheckCircle,
} from "react-icons/fi";
import { LeadService } from "@/src/services/leadService";
import toast, { Toaster } from 'react-hot-toast';

interface Lead {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  source: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

const STATUS_COLORS: { [key: string]: string } = {
  New: "bg-blue-50 text-blue-600 border-blue-100",
  Contacted: "bg-amber-50 text-amber-600 border-amber-100",
  Qualified: "bg-purple-50 text-purple-600 border-purple-100",
  Lost: "bg-red-50 text-red-600 border-red-100",
  Won: "bg-emerald-50 text-emerald-600 border-emerald-100",
};

const SOURCE_OPTIONS = ["Ads", "Referral", "Website", "Email", "Phone", "Event"];
const STATUS_OPTIONS = ["New", "Contacted", "Qualified", "Lost", "Won"];

const emptyLead: Lead = {
  firstName: "",
  lastName: "",
  email: "",
  company: "",
  source: "Ads",
  status: "New",
};

export const LeadsTable = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [addingLead, setAddingLead] = useState<Lead | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await LeadService.getLeads(1, 100);
      setLeads(data?.leads || []);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching leads:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addingLead?.firstName || !addingLead?.email) {
      toast.error("Please fill required fields (First Name & Email)");
      return;
    }

    const loadToast = toast.loading("Saving new lead...");
    try {
      const createdLead = await LeadService.createLead(addingLead);
      setLeads((prev) => [createdLead, ...prev]);
      setAddingLead(null);
      
      toast.success("Lead created successfully! 🎯", { id: loadToast });
      fetchLeads();
    } catch (err: any) {
      toast.error("Error: " + err.message, { id: loadToast });
    }
  };

  const handleEditLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead?._id || !editingLead?.firstName || !editingLead?.email) {
      toast.error("Please fill required fields");
      return;
    }

    const loadToast = toast.loading("Updating lead details...");
    try {
      await LeadService.updateLead(editingLead._id, editingLead);
      setLeads((prev) =>
        prev.map((lead) => (lead._id === editingLead._id ? editingLead : lead))
      );
      setEditingLead(null);
      
      toast.success("Lead updated successfully", { id: loadToast });
      fetchLeads();
    } catch (err: any) {
      toast.error("Error: " + err.message, { id: loadToast });
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      const loadToast = toast.loading("Removing lead...");
      try {
        await LeadService.deleteLead(id);
        setLeads((prev) => prev.filter((lead) => lead._id !== id));
        toast.success("Lead deleted successfully", { id: loadToast });
      } catch (err: any) {
        toast.error("Error: " + err.message, { id: loadToast });
      }
    }
  };

  const getStatusColor = (status: string) => STATUS_COLORS[status] || STATUS_COLORS["New"];

  return (
    <div className="w-full bg-slate-50 min-h-screen p-6 text-black">
      <div className="max-w-7xl mx-auto">
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Leads Management</h1>
            <p className="text-slate-500 font-medium">Track and manage your sales leads.</p>
          </div>
          <button
            onClick={() => setAddingLead(emptyLead)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all font-bold"
          >
            <FiPlus size={20} /> Add New Lead
          </button>
        </div>

        {/* --- Error Message --- */}
        {error && (
          <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-xl text-red-700 font-medium">
            Error: {error}
          </div>
        )}

        {/* --- Table Container --- */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Lead Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center opacity-40">
                        <FiBriefcase size={48} className="mb-2" />
                        <p className="font-medium">Loading Leads...</p>
                      </div>
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center opacity-40">
                        <FiBriefcase size={48} className="mb-2" />
                        <p className="font-medium">No leads found in the dashboard</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {lead.firstName} {lead.lastName}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                          <FiMail className="text-slate-400" size={14} /> {lead.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-sm font-medium">{lead.company || "—"}</td>
                      <td className="px-6 py-4 text-slate-500 text-sm font-medium">{lead.source}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase border ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="text-slate-400 hover:text-green-600 transition-colors"
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          onClick={() => setEditingLead(lead)}
                          className="text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteLead(lead._id!)}
                          className="text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- View Lead Sidebar --- */}
      {selectedLead && (
        <>
          <div
            className="fixed inset-0 z-[998] bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setSelectedLead(null)}
          />
          <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl z-[999] animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h2 className="text-2xl font-black text-slate-800">Lead Details</h2>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                  <label className="block text-[10px] font-bold text-indigo-600 uppercase mb-1">Company</label>
                  <p className="text-xl font-black text-indigo-900">{selectedLead.company || "Individual Lead"}</p>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Full Name</label>
                  <p className="font-bold text-slate-700">{selectedLead.firstName} {selectedLead.lastName || ""}</p>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Email Address</label>
                  <p className="font-bold text-slate-700 flex items-center gap-2 text-sm">
                    <FiMail className="text-slate-400" /> {selectedLead.email}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Source</label>
                  <p className="font-bold text-slate-700">{selectedLead.source}</p>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</label>
                  <div>
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase inline-block border ${getStatusColor(selectedLead.status)}`}>
                      {selectedLead.status}
                    </span>
                  </div>
                </div>

                {selectedLead.createdAt && (
                  <div className="space-y-1 pt-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Created Date</label>
                    <p className="text-sm font-medium text-slate-600">
                      {new Date(selectedLead.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* --- Add / Edit Lead Sidebar Form --- */}
      {(addingLead || editingLead) && (
        <>
          <div
            className="fixed inset-0 z-[998] bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => {
              setAddingLead(null);
              setEditingLead(null);
            }}
          />
          <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl z-[999] animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h2 className="text-2xl font-black text-slate-800">
                  {addingLead ? "Add New Lead" : "Edit Lead Details"}
                </h2>
                <button
                  onClick={() => {
                    setAddingLead(null);
                    setEditingLead(null);
                  }}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={addingLead ? handleAddLead : handleEditLead} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={addingLead?.firstName || editingLead?.firstName || ""}
                    onChange={(e) => {
                      if (addingLead) setAddingLead({ ...addingLead, firstName: e.target.value });
                      if (editingLead) setEditingLead({ ...editingLead, firstName: e.target.value });
                    }}
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-indigo-500 focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={addingLead?.lastName || editingLead?.lastName || ""}
                    onChange={(e) => {
                      if (addingLead) setAddingLead({ ...addingLead, lastName: e.target.value });
                      if (editingLead) setEditingLead({ ...editingLead, lastName: e.target.value });
                    }}
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-indigo-500 focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={addingLead?.email || editingLead?.email || ""}
                    onChange={(e) => {
                      if (addingLead) setAddingLead({ ...addingLead, email: e.target.value });
                      if (editingLead) setEditingLead({ ...editingLead, email: e.target.value });
                    }}
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-indigo-500 focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Company
                  </label>
                  <input
                    type="text"
                    value={addingLead?.company || editingLead?.company || ""}
                    onChange={(e) => {
                      if (addingLead) setAddingLead({ ...addingLead, company: e.target.value });
                      if (editingLead) setEditingLead({ ...editingLead, company: e.target.value });
                    }}
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-indigo-500 focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Source
                  </label>
                  <select
                    value={addingLead?.source || editingLead?.source || "Ads"}
                    onChange={(e) => {
                      if (addingLead) setAddingLead({ ...addingLead, source: e.target.value });
                      if (editingLead) setEditingLead({ ...editingLead, source: e.target.value });
                    }}
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none font-medium text-slate-600 cursor-pointer text-sm focus:border-indigo-500 focus:bg-white transition-all"
                  >
                    {SOURCE_OPTIONS.map((source) => (
                      <option key={source} value={source}>
                        {source}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Status
                  </label>
                  <select
                    value={addingLead?.status || editingLead?.status || "New"}
                    onChange={(e) => {
                      if (addingLead) setAddingLead({ ...addingLead, status: e.target.value });
                      if (editingLead) setEditingLead({ ...editingLead, status: e.target.value });
                    }}
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none font-medium text-slate-600 cursor-pointer text-sm focus:border-indigo-500 focus:bg-white transition-all"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-2xl transition-all shadow-lg shadow-indigo-100 active:scale-95"
                >
                  {addingLead ? "Create Lead" : "Update Details"}
                </button>
              </form>
            </div>
          </div>
        </>
      )}

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default LeadsTable;