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
  New: "bg-blue-100 text-blue-700 border border-blue-200",
  Contacted: "bg-amber-100 text-amber-700 border border-amber-200",
  Qualified: "bg-purple-100 text-purple-700 border border-purple-200",
  Lost: "bg-rose-100 text-rose-700 border border-rose-200",
  Won: "bg-emerald-100 text-emerald-700 border border-emerald-200",
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
      alert("Please fill required fields (First Name & Email)");
      return;
    }
    try {
      const createdLead = await LeadService.createLead(addingLead);
      setLeads((prev) => [createdLead, ...prev]);
      setAddingLead(null);
      alert("Lead created successfully");
      fetchLeads();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleEditLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead?._id || !editingLead?.firstName || !editingLead?.email) {
      alert("Please fill required fields");
      return;
    }
    try {
      await LeadService.updateLead(editingLead._id, editingLead);
      setLeads((prev) =>
        prev.map((lead) => (lead._id === editingLead._id ? editingLead : lead))
      );
      setEditingLead(null);
      alert("Lead updated successfully");
      fetchLeads();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      try {
        await LeadService.deleteLead(id);
        setLeads((prev) => prev.filter((lead) => lead._id !== id));
        alert("Lead deleted successfully");
      } catch (err: any) {
        alert("Error: " + err.message);
      }
    }
  };

  const getStatusColor = (status: string) => STATUS_COLORS[status] || STATUS_COLORS["New"];

  return (
    <div className="w-full space-y-6 p-6 text-black bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Leads Management
          </h1>
          <p className="text-slate-500 font-medium">
            Track and manage your sales leads
          </p>
        </div>
        <button
          onClick={() => setAddingLead(emptyLead)}
          className="flex items-center gap-2 bg-[#21a9ff] hover:bg-[#6dc6fe] text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95"
        >
          <FiPlus /> Add New Lead
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 font-medium">
          Error: {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[11px] font-black uppercase tracking-widest">
            <tr>
              <th className="px-8 py-5">Lead Name</th>
              <th className="px-8 py-5">Email</th>
              <th className="px-8 py-5">Company</th>
              <th className="px-8 py-5">Source</th>
              <th className="px-8 py-5 text-center">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-8 py-8 text-center text-slate-500">
                  Loading leads...
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-8 py-8 text-center text-slate-500">
                  No leads found
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-4">
                    <p className="font-bold text-slate-800">
                      {lead.firstName} {lead.lastName}
                    </p>
                  </td>
                  <td className="px-8 py-4">
                    <div className="text-sm font-semibold text-slate-600 flex items-center gap-1">
                      <FiMail size={14} /> {lead.email}
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className="text-sm font-medium text-slate-600">
                      {lead.company}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <span className="text-sm font-medium text-slate-600">
                      {lead.source}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase inline-block ${getStatusColor(
                        lead.status
                      )}`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <FiEye size={18} />
                      </button>
                      <button
                        onClick={() => setEditingLead(lead)}
                        className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteLead(lead._id!)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {(addingLead || editingLead) && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-800">
                {addingLead ? "Add New Lead" : "Edit Lead"}
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
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
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
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
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={addingLead?.email || editingLead?.email || ""}
                  onChange={(e) => {
                    if (addingLead) setAddingLead({ ...addingLead, email: e.target.value });
                    if (editingLead) setEditingLead({ ...editingLead, email: e.target.value });
                  }}
                  className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
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
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Source
                  </label>
                  <select
                    value={addingLead?.source || editingLead?.source || "Ads"}
                    onChange={(e) => {
                      if (addingLead) setAddingLead({ ...addingLead, source: e.target.value });
                      if (editingLead) setEditingLead({ ...editingLead, source: e.target.value });
                    }}
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                  >
                    {SOURCE_OPTIONS.map((source) => (
                      <option key={source} value={source}>
                        {source}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                  Status
                </label>
                <select
                  value={addingLead?.status || editingLead?.status || "New"}
                  onChange={(e) => {
                    if (addingLead) setAddingLead({ ...addingLead, status: e.target.value });
                    if (editingLead) setEditingLead({ ...editingLead, status: e.target.value });
                  }}
                  className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
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
                className="w-full py-4 bg-[#21a9ff] hover:bg-[#6dc6fe] text-white rounded-2xl font-black mt-6 shadow-lg shadow-blue-100 transition-all active:scale-95"
              >
                {addingLead ? "Create Lead" : "Update Lead"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-800">Lead Details</h2>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
                    First Name
                  </p>
                  <p className="font-bold text-slate-800">{selectedLead.firstName}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
                    Last Name
                  </p>
                  <p className="font-bold text-slate-800">{selectedLead.lastName || "N/A"}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
                  Email
                </p>
                <p className="font-bold text-slate-800 flex items-center gap-2">
                  <FiMail size={16} /> {selectedLead.email}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
                    Company
                  </p>
                  <p className="font-bold text-slate-800">{selectedLead.company}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
                    Source
                  </p>
                  <p className="font-bold text-slate-800">{selectedLead.source}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2">
                  Status
                </p>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase inline-block ${getStatusColor(
                    selectedLead.status
                  )}`}
                >
                  {selectedLead.status}
                </span>
              </div>

              {selectedLead.createdAt && (
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
                    Created
                  </p>
                  <p className="text-sm text-slate-600">
                    {new Date(selectedLead.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}

              <button
                onClick={() => setSelectedLead(null)}
                className="w-full py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsTable;