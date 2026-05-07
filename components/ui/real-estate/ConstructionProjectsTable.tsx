// 'use client';
// import React, { useState, useEffect } from 'react';
// import { 
//   FiEye, FiEdit2, FiTrash2, FiPlus, FiSearch, FiLoader, FiX
// } from 'react-icons/fi';
// import { constructionProjectService } from '@/src/services/real-estate/constructionProjectService';
// import toast, { Toaster } from 'react-hot-toast';

// interface Project {
//   _id?: string;
//   project_id: string;
//   project_name: string;
//   project_type: string;
//   status: string;
//   start_date: string;
//   end_date: string;
//   progress_percentage: number;
//   budget: number;
//   spent_amount: number;
// }

// const ConstructionProjectsTable = () => {
//   const [projects, setProjects] = useState<Project[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showForm, setShowForm] = useState(false);
//   const [editingProject, setEditingProject] = useState<Project | null>(null);
//   const [formData, setFormData] = useState({
//     project_id: '',
//     project_name: '',
//     project_type: 'New_Build',
//     status: 'Planning',
//     start_date: '',
//     end_date: '',
//     budget: 0,
//     spent_amount: 0,
//     progress_percentage: 0,
//   });

//   const PRIMARY_COLOR = "#21a9ff";

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       fetchProjects(searchTerm);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   const fetchProjects = async (search = '') => {
//     try {
//       setLoading(true);
//       const res = await constructionProjectService.getProjects();
//       let data = Array.isArray(res) ? res : res?.data || [];
      
//       if (search) {
//         data = data.filter((p: Project) => 
//           p.project_name.toLowerCase().includes(search.toLowerCase()) ||
//           p.project_id.toLowerCase().includes(search.toLowerCase())
//         );
//       }
      
//       setProjects(data);
//     } catch (err) {
//       console.error("Error fetching projects:", err);
//       toast.error("Failed to fetch projects");
//       setProjects([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm('Are you sure?')) return;
//     try {
//       await constructionProjectService.deleteProject(id);
//       toast.success('Project deleted successfully');
//       fetchProjects();
//     } catch (err) {
//       toast.error('Failed to delete project');
//     }
//   };

//   const handleAddProject = () => {
//     setEditingProject(null);
//     setFormData({
//       project_id: '',
//       project_name: '',
//       project_type: 'New_Build',
//       status: 'Planning',
//       start_date: '',
//       end_date: '',
//       budget: 0,
//       spent_amount: 0,
//       progress_percentage: 0,
//     });
//     setShowForm(true);
//   };

//   const handleEditProject = (project: Project) => {
//     setEditingProject(project);
//     setFormData(project as any);
//     setShowForm(true);
//   };

//   const handleSaveProject = async () => {
//     if (!formData.project_name) {
//       toast.error('Please fill all required fields');
//       return;
//     }

//     try {
//       if (editingProject) {
//         await constructionProjectService.updateProject(editingProject._id!, formData);
//         toast.success('Project updated successfully');
//       } else {
//         await constructionProjectService.createProject(formData);
//         toast.success('Project created successfully');
//       }
//       setShowForm(false);
//       fetchProjects();
//     } catch (err) {
//       toast.error('Failed to save project');
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch(status) {
//       case 'In_Progress': return '#8b5cf6';
//       case 'Completed': return '#4ade80';
//       case 'Planning': return '#3b82f6';
//       case 'Paused': return '#f59e0b';
//       case 'Cancelled': return '#ef4444';
//       default: return '#6b7280';
//     }
//   };

//   const getProgressColor = (progress: number) => {
//     if (progress >= 80) return '#4ade80';
//     if (progress >= 50) return '#f59e0b';
//     return '#3b82f6';
//   };

//   return (
//     <div style={{ padding: '20px', fontFamily: 'Inter, sans-serif' }}>
//       <Toaster />
      
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//         <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>Construction Projects</h2>
//         <button 
//           onClick={handleAddProject}
//           style={{
//             padding: '10px 20px',
//             backgroundColor: PRIMARY_COLOR,
//             color: 'white',
//             border: 'none',
//             borderRadius: '6px',
//             cursor: 'pointer',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '8px'
//           }}>
//           <FiPlus size={18} /> New Project
//         </button>
//       </div>

//       <div style={{ marginBottom: '20px', position: 'relative' }}>
//         <FiSearch style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }} size={18} />
//         <input
//           type="text"
//           placeholder="Search by project name or ID..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           style={{
//             width: '100%',
//             padding: '10px 10px 10px 40px',
//             border: '1px solid #e5e7eb',
//             borderRadius: '6px',
//             fontSize: '14px'
//           }}
//         />
//       </div>

//       {showForm && (
//         <div style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           backgroundColor: 'rgba(0,0,0,0.5)',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           zIndex: 1000
//         }}>
//           <div style={{
//             backgroundColor: 'white',
//             padding: '30px',
//             borderRadius: '8px',
//             width: '90%',
//             maxWidth: '500px'
//           }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//               <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
//                 {editingProject ? 'Edit Project' : 'Add New Project'}
//               </h3>
//               <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
//                 <FiX size={24} />
//               </button>
//             </div>

//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
//               <div style={{ gridColumn: '1 / -1' }}>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Project Name</label>
//                 <input
//                   type="text"
//                   placeholder="Project name"
//                   value={formData.project_name}
//                   onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
//                   style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '14px' }}
//                 />
//               </div>
//               <div>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Project ID</label>
//                 <input
//                   type="text"
//                   placeholder="PROJ-2026-001"
//                   value={formData.project_id}
//                   onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
//                   style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '14px' }}
//                 />
//               </div>
//               <div>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Type</label>
//                 <select
//                   value={formData.project_type}
//                   onChange={(e) => setFormData({ ...formData, project_type: e.target.value })}
//                   style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '14px' }}
//                 >
//                   <option>New_Build</option>
//                   <option>Renovation</option>
//                   <option>Expansion</option>
//                   <option>Maintenance</option>
//                 </select>
//               </div>
//               <div>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Status</label>
//                 <select
//                   value={formData.status}
//                   onChange={(e) => setFormData({ ...formData, status: e.target.value })}
//                   style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '14px' }}
//                 >
//                   <option>Planning</option>
//                   <option>In_Progress</option>
//                   <option>Paused</option>
//                   <option>Completed</option>
//                   <option>Cancelled</option>
//                 </select>
//               </div>
//               <div>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Start Date</label>
//                 <input
//                   type="date"
//                   value={formData.start_date}
//                   onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
//                   style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '14px' }}
//                 />
//               </div>
//               <div>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>End Date</label>
//                 <input
//                   type="date"
//                   value={formData.end_date}
//                   onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
//                   style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '14px' }}
//                 />
//               </div>
//               <div>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Budget</label>
//                 <input
//                   type="number"
//                   placeholder="0"
//                   value={formData.budget}
//                   onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) })}
//                   style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '14px' }}
//                 />
//               </div>
//               <div>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Spent Amount</label>
//                 <input
//                   type="number"
//                   placeholder="0"
//                   value={formData.spent_amount}
//                   onChange={(e) => setFormData({ ...formData, spent_amount: parseInt(e.target.value) })}
//                   style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '14px' }}
//                 />
//               </div>
//               <div>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Progress (%)</label>
//                 <input
//                   type="number"
//                   placeholder="0"
//                   min="0"
//                   max="100"
//                   value={formData.progress_percentage}
//                   onChange={(e) => setFormData({ ...formData, progress_percentage: parseInt(e.target.value) })}
//                   style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '14px' }}
//                 />
//               </div>
//             </div>

//             <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
//               <button
//                 onClick={() => setShowForm(false)}
//                 style={{
//                   padding: '10px 20px',
//                   backgroundColor: '#f3f4f6',
//                   border: '1px solid #d1d5db',
//                   borderRadius: '6px',
//                   cursor: 'pointer',
//                   fontWeight: '600'
//                 }}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSaveProject}
//                 style={{
//                   padding: '10px 20px',
//                   backgroundColor: PRIMARY_COLOR,
//                   color: 'white',
//                   border: 'none',
//                   borderRadius: '6px',
//                   cursor: 'pointer',
//                   fontWeight: '600'
//                 }}
//               >
//                 Save Project
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {loading ? (
//         <div style={{ textAlign: 'center', padding: '40px' }}>
//           <FiLoader style={{ animation: 'spin 1s linear infinite' }} size={32} color={PRIMARY_COLOR} />
//         </div>
//       ) : projects.length === 0 ? (
//         <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
//           No projects found
//         </div>
//       ) : (
//         <div style={{ overflowX: 'auto' }}>
//           <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//             <thead>
//               <tr style={{ borderBottom: '2px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
//                 <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Project ID</th>
//                 <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Project Name</th>
//                 <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Type</th>
//                 <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Status</th>
//                 <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Progress</th>
//                 <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Budget</th>
//                 <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {projects.map((project) => (
//                 <tr key={project._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
//                   <td style={{ padding: '12px' }}>
//                     <span style={{ fontWeight: '600', color: PRIMARY_COLOR }}>{project.project_id}</span>
//                   </td>
//                   <td style={{ padding: '12px' }}>{project.project_name}</td>
//                   <td style={{ padding: '12px' }}>{project.project_type}</td>
//                   <td style={{ padding: '12px' }}>
//                     <span style={{
//                       padding: '4px 12px',
//                       backgroundColor: getStatusColor(project.status),
//                       color: 'white',
//                       borderRadius: '4px',
//                       fontSize: '12px',
//                       fontWeight: '600'
//                     }}>
//                       {project.status}
//                     </span>
//                   </td>
//                   <td style={{ padding: '12px' }}>
//                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                       <div style={{
//                         width: '100px',
//                         height: '6px',
//                         backgroundColor: '#e5e7eb',
//                         borderRadius: '3px',
//                         overflow: 'hidden'
//                       }}>
//                         <div style={{
//                           width: `${project.progress_percentage}%`,
//                           height: '100%',
//                           backgroundColor: getProgressColor(project.progress_percentage),
//                           transition: 'width 0.3s'
//                         }} />
//                       </div>
//                       <span style={{ fontSize: '12px', fontWeight: '600' }}>{project.progress_percentage}%</span>
//                     </div>
//                   </td>
//                   <td style={{ padding: '12px' }}>
//                     <div style={{ fontSize: '13px' }}>
//                       <div style={{ fontWeight: '600' }}>${project.budget.toLocaleString()}</div>
//                       <div style={{ color: '#6b7280', fontSize: '12px' }}>Spent: ${project.spent_amount.toLocaleString()}</div>
//                     </div>
//                   </td>
//                   <td style={{ padding: '12px', textAlign: 'center' }}>
//                     <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
//                       <button style={{
//                         padding: '6px 12px',
//                         backgroundColor: '#e0f2fe',
//                         color: PRIMARY_COLOR,
//                         border: 'none',
//                         borderRadius: '4px',
//                         cursor: 'pointer'
//                       }}>
//                         <FiEye size={16} />
//                       </button>
//                       <button 
//                         onClick={() => handleEditProject(project)}
//                         style={{
//                           padding: '6px 12px',
//                           backgroundColor: '#fef3c7',
//                           color: '#d97706',
//                           border: 'none',
//                           borderRadius: '4px',
//                           cursor: 'pointer'
//                         }}>
//                         <FiEdit2 size={16} />
//                       </button>
//                       <button onClick={() => project._id && handleDelete(project._id)} style={{
//                         padding: '6px 12px',
//                         backgroundColor: '#fee2e2',
//                         color: '#ef4444',
//                         border: 'none',
//                         borderRadius: '4px',
//                         cursor: 'pointer'
//                       }}>
//                         <FiTrash2 size={16} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ConstructionProjectsTable;

'use client';
import React, { useState, useEffect } from 'react';
import { 
  FiPlus, FiEdit2, FiTrash2, FiSearch, FiBriefcase, 
  FiCalendar, FiPieChart, FiDollarSign, FiFilter, FiX, FiActivity 
} from 'react-icons/fi';
import { constructionProjectService } from '@/src/services/real-estate/constructionProjectService';
import toast, { Toaster } from 'react-hot-toast';

interface Project {
  _id?: string;
  project_id: string;
  project_name: string;
  project_type: string;
  status: string;
  start_date: string;
  end_date: string;
  progress_percentage: number;
  budget: number;
  spent_amount: number;
}

export default function ConstructionProjectsTable() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await constructionProjectService.getProjects();
      setProjects(data);
      setFilteredProjects(data);
    } catch (err) {
      toast.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    const filtered = projects.filter((p) => 
      p.project_name.toLowerCase().includes(query.toLowerCase()) ||
      p.project_id.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProjects(filtered);
  };

  const getStatusStyles = (status: string) => {
    switch(status) {
      case 'In_Progress': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'Completed': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Planning': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Paused': return 'bg-amber-50 text-amber-700 border-amber-100';
      default: return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  return (
    <div className="w-full bg-[#fcfdfe] min-h-screen p-4 md:p-10 text-slate-900 font-sans">
      <Toaster />
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Project Management</h1>
            <p className="text-slate-500 font-medium mt-1">
              Track construction progress, budgets, and timelines across all sites.
              <span className="ml-2 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full text-xs font-bold">
                {filteredProjects.length} Active Projects
              </span>
            </p>
          </div>
          <button 
            onClick={() => { setEditingProject(null); setShowForm(true); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            <FiPlus size={20} />
            New Project
          </button>
        </div>

        {/* Toolbar[cite: 1, 3] */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input
              type="text"
              placeholder="Search by project name or ID..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all shadow-sm font-medium"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm">
            <FiFilter /> Filters
          </button>
        </div>

        {/* Projects Table Card[cite: 1, 3] */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-100/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Project Details</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Timeline</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Progress</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Financials</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-24 text-center">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin w-10 h-10 border-[3px] border-blue-100 border-t-blue-600 rounded-full mb-4"></div>
                        <p className="text-slate-400 font-bold tracking-tight">Syncing Projects...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-24 text-center">
                      <div className="flex flex-col items-center opacity-40">
                        <FiBriefcase size={60} className="text-slate-300 mb-4" />
                        <p className="text-xl font-bold text-slate-900">No Projects Found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((project) => (
                    <tr key={project._id} className="hover:bg-blue-50/40 transition-colors group cursor-default">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-bold text-slate-600 border border-white shadow-sm">
                            <FiBriefcase size={20} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-base">{project.project_name}</p>
                            <p className="text-xs font-bold text-slate-400 uppercase mt-0.5">{project.project_id} • {project.project_type.replace('_', ' ')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <FiCalendar className="text-slate-400" size={14} /> {project.start_date || 'N/A'}
                          </div>
                          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border self-start ${getStatusStyles(project.status)}`}>
                            {project.status.replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-2 min-w-[120px]">
                          <div className="flex justify-between items-center text-[11px] font-black text-slate-400 uppercase tracking-widest">
                            <span>Completion</span>
                            <span className="text-blue-600">{project.progress_percentage}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                            <div 
                              className="h-full bg-blue-600 rounded-full transition-all duration-500" 
                              style={{ width: `${project.progress_percentage}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-0.5">
                          <div className="text-sm font-bold text-slate-900">${project.budget.toLocaleString()}</div>
                          <div className="text-[11px] font-medium text-slate-400">Spent: <span className="text-red-500 font-bold">${project.spent_amount.toLocaleString()}</span></div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm">
                            <FiPieChart size={18} />
                          </button>
                          <button 
                            onClick={() => { setEditingProject(project); setShowForm(true); }}
                            className="p-2.5 text-slate-400 hover:text-amber-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button 
                            onClick={() => project._id && handleDelete(project._id)}
                            className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm"
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
        </div>
      </div>
    </div>
  );

  async function handleDelete(id: string) {
    if (confirm('Permanently delete this project record?')) {
      try {
        await constructionProjectService.deleteProject(id);
        toast.success('Project deleted');
        fetchProjects();
      } catch (err) {
        toast.error('Failed to delete project');
      }
    }
  }
}