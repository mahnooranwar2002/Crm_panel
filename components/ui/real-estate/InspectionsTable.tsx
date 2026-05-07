'use client';
import React, { useState, useEffect } from 'react';
import { 
  FiEye, FiEdit2, FiTrash2, FiPlus, FiSearch, FiLoader, 
  FiX, FiCalendar, FiUser, FiClipboard, FiShield, FiCheckCircle, FiAlertCircle 
} from 'react-icons/fi';
import { inspectionService } from '@/src/services/real-estate/inspectionService';
import toast, { Toaster } from 'react-hot-toast';

interface Inspection {
  _id?: string;
  inspection_date: string;
  inspection_type: string;
  status: string;
  passed: boolean;
  inspector_name?: string;
  findings?: any[];
}

const InspectionsTable = () => {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [filteredInspections, setFilteredInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingInspection, setEditingInspection] = useState<Inspection | null>(null);
  
  const [formData, setFormData] = useState({
    inspection_date: new Date().toISOString().split('T')[0],
    inspection_type: 'Safety',
    passed: true,
    status: 'Pending',
    inspector_name: '',
    findings: [] as any[],
  });

  useEffect(() => {
    fetchInspections();
  }, []);

  const fetchInspections = async () => {
    try {
      setLoading(true);
      const data = await inspectionService.getInspections();
      setInspections(data);
      setFilteredInspections(data);
    } catch (err) {
      toast.error("Failed to fetch inspections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = inspections.filter((i) => 
      i.inspection_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.inspector_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInspections(filtered);
  }, [searchTerm, inspections]);

  const handleSaveInspection = async () => {
    if (!formData.inspection_date) {
      toast.error('Inspection date is required');
      return;
    }
    try {
      if (editingInspection) {
        await inspectionService.updateInspection(editingInspection._id!, formData);
        toast.success('Inspection updated successfully');
      } else {
        await inspectionService.createInspection(formData);
        toast.success('Inspection created successfully');
      }
      setShowForm(false);
      fetchInspections();
    } catch (err) {
      toast.error('Failed to save inspection');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: any = {
      'Approved': 'bg-emerald-50 text-emerald-600 border-emerald-100',
      'Failed': 'bg-rose-50 text-rose-600 border-rose-100',
      'Pending': 'bg-amber-50 text-amber-600 border-amber-100',
      'Reopened': 'bg-purple-50 text-purple-600 border-purple-100',
    };
    return styles[status] || 'bg-slate-50 text-slate-500';
  };

  return (
    <div className="w-full bg-[#fcfdfe] min-h-screen p-4 md:p-10 font-sans">
      <Toaster />
      
      <div className="max-w-7xl mx-auto">
        {/* Header Section[cite: 6] */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Site Inspections</h1>
            <p className="text-slate-500 font-medium mt-1">Audit logs for safety, quality, and compliance standards.</p>
          </div>
          <button 
            onClick={() => { setEditingInspection(null); setShowForm(true); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            <FiPlus size={20} /> New Inspection
          </button>
        </div>

        {/* Search Bar[cite: 6] */}
        <div className="mb-8 relative group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            placeholder="Search by type or inspector name..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all shadow-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Inspections Table Card[cite: 6] */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-100/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Audit Details</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Inspector</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Result</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Status</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <FiLoader className="animate-spin mx-auto text-blue-600" size={30} />
                    </td>
                  </tr>
                ) : filteredInspections.map((inspection) => (
                  <tr key={inspection._id} className="hover:bg-blue-50/40 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-blue-600 border border-slate-100">
                          <FiShield size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{inspection.inspection_type}</p>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                            <FiCalendar size={12} />
                            {new Date(inspection.inspection_date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-black">
                          {inspection.inspector_name?.charAt(0) || 'N'}
                        </div>
                        <span className="text-sm font-bold text-slate-700">{inspection.inspector_name || 'Not Assigned'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {inspection.passed ? (
                        <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm">
                          <FiCheckCircle /> Passed
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-rose-600 font-bold text-sm">
                          <FiAlertCircle /> Failed
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border tracking-wider ${getStatusBadge(inspection.status)}`}>
                        {inspection.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm">
                          <FiEye size={16} />
                        </button>
                        <button onClick={() => { setEditingInspection(inspection); setFormData(inspection as any); setShowForm(true); }} className="p-2.5 text-slate-400 hover:text-amber-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm">
                          <FiEdit2 size={16} />
                        </button>
                        <button onClick={() => inspection._id && inspectionService.deleteInspection(inspection._id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm">
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Glassmorphism Form Modal[cite: 6] */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white/95 backdrop-blur-xl border border-white w-full max-w-xl rounded-[2.5rem] shadow-2xl p-8 md:p-10">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-slate-900">{editingInspection ? 'Update Inspection' : 'Log New Audit'}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <FiX size={24} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-5 mb-8">
              <div className="col-span-2">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Inspector Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    className="w-full pl-11 pr-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 outline-none font-bold"
                    value={formData.inspector_name}
                    onChange={(e) => setFormData({...formData, inspector_name: e.target.value})}
                    placeholder="e.g. John Doe"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Audit Date</label>
                <input 
                  type="date"
                  className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none font-bold"
                  value={formData.inspection_date}
                  onChange={(e) => setFormData({...formData, inspection_date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Audit Type</label>
                <select 
                  className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none font-bold appearance-none"
                  value={formData.inspection_type}
                  onChange={(e) => setFormData({...formData, inspection_type: e.target.value})}
                >
                  <option>Safety</option>
                  <option>Quality</option>
                  <option>Progress</option>
                  <option>Compliance</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Final Result</label>
                <select 
                  className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none font-bold appearance-none"
                  value={formData.passed ? 'Passed' : 'Failed'}
                  onChange={(e) => setFormData({...formData, passed: e.target.value === 'Passed'})}
                >
                  <option value="Passed">Passed</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Status</label>
                <select 
                  className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none font-bold appearance-none"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Failed</option>
                  <option>Reopened</option>
                </select>
              </div>
            </div>

            <button 
              onClick={handleSaveInspection}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-200 active:scale-[0.98]"
            >
              Submit Inspection Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InspectionsTable;