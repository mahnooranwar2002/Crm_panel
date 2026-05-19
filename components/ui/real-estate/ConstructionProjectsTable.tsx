'use client';

import React, { useState, useEffect } from 'react';
import { 
  FiPlus, FiEdit2, FiTrash2, FiSearch, 
  FiFilter, FiActivity, FiLoader, FiX, FiPieChart
} from 'react-icons/fi';
import { constructionProjectService } from '@/src/services/real-estate/constructionProjectService';
import ProjectModal from './modals/ProjectModal';
import toast, { Toaster } from 'react-hot-toast';

interface Project {
  _id?: string;
  project_id?: string;
  project_name: string;
  property_id?: string;
  project_type: string;
  description?: string;
  contractor_id?: string;
  project_manager_id?: string;
  start_date: string;
  end_date: string;
  actual_end_date?: string;
  budget: number;
  spent_amount?: number;
  currency?: string;
  status?: string;
  progress_percentage?: number;
  site_manager_id?: string;
}

export default function ConstructionProjectsTable() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); 
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null); 
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, projects]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await constructionProjectService.getProjects() as any;
      const data = Array.isArray(res) ? res : res?.data || [];
      setProjects(data);
      setFilteredProjects(data);
    } catch (err) {
      console.error("Error fetching projects:", err);
      toast.error("Failed to fetch construction projects");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredProjects(projects);
      return;
    }
    const filtered = projects.filter((p) => 
      p.project_name?.toLowerCase().includes(query.toLowerCase()) ||
      p.project_id?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProjects(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this project record?')) return;
    try {
      await constructionProjectService.deleteProject(id);
      toast.success('Project deleted successfully');
      fetchProjects();
    } catch (err) {
      toast.error('Failed to delete project');
    }
  };

  const handleAddProject = () => {
    setEditingProject(null);
    setShowModal(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowModal(true);
  };

  const handleSaveProject = async (project: Project) => {
    try {
      setIsSaving(true);
      if (editingProject && editingProject._id) {
        await constructionProjectService.updateProject(editingProject._id, project);
        toast.success('Project updated successfully');
      } else {
        await constructionProjectService.createProject(project);
        toast.success('Project created successfully');
      }
      setShowModal(false);
      fetchProjects();
    } catch (err) {
      toast.error('Failed to save project');
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusClass = (status?: string) => {
    switch(status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'On_Hold': return 'bg-red-50 text-red-700 border-red-100';
      case 'In_Progress': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Planning': return 'bg-blue-50 text-blue-700 border-blue-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="w-full bg-[#fcfdfe] min-h-screen p-4 md:p-10 text-slate-900 font-sans relative overflow-x-hidden">
      <Toaster />
      
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Construction Projects</h1>
            <p className="text-slate-500 font-medium mt-1">
              Track building construction, budgets, and operational progress phases.
              <span className="ml-2 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full text-xs font-bold">
                {filteredProjects.length} Active
              </span>
            </p>
          </div>
          <button 
            onClick={handleAddProject}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            <FiPlus size={20} />
            Add Project
          </button>
        </div>

        {/* Searching Filtering */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by project name or ID..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none shadow-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm">
            <FiFilter /> Filters
          </button>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-100/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Project Details</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Timeline</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Budget & Cost</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Progress</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-24 text-center">
                      <div className="flex flex-col items-center">
                        <FiLoader className="animate-spin w-10 h-10 text-blue-600 mb-4" size={32} />
                        <p className="text-slate-400 font-bold tracking-tight">Loading Projects...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-24 text-center">
                      <div className="flex flex-col items-center opacity-40">
                        <FiActivity size={60} className="text-slate-300 mb-4" />
                        <p className="text-xl font-bold text-slate-900">No Projects Found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((project) => (
                    <tr key={project._id} className="hover:bg-blue-50/40 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center font-bold text-blue-600 border border-white shadow-sm">
                            <FiActivity size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-base">{project.project_name}</p>
                            <p className="text-xs font-bold text-slate-400 uppercase mt-0.5">{project.project_id || 'N/A'} • {project.project_type?.replace('_', ' ')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col text-xs font-semibold text-slate-600">
                          <span>Start: {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'N/A'}</span>
                          <span className="text-slate-400 font-medium">End: {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-0.5">
                          <div className="text-sm font-bold text-slate-800">
                            ${project.budget?.toLocaleString()}
                          </div>
                          <div className="text-[11px] font-medium text-slate-400">
                            Spent: ${project.spent_amount?.toLocaleString() || '0'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1.5 w-32">
                          <span className={`w-fit px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${getStatusClass(project.status)}`}>
                            {project.status?.replace('_', ' ')}
                          </span>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" 
                              style={{ width: `${project.progress_percentage || 0}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <button 
                            onClick={() => setSelectedProject(project)}
                            className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm"
                            title="View Details"
                          >
                            <FiPieChart size={18} />
                          </button>
                          <button 
                            onClick={() => handleEditProject(project)}
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

      {/* View Details Drawer Sidebar */}
      {selectedProject && (
        <div className="fixed inset-0 z-[9999] overflow-hidden">
          <div 
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setSelectedProject(null)}
          />

          <div className="absolute top-0 right-0 h-full w-full sm:w-[450px] bg-white/95 backdrop-blur-md border-l border-slate-200/50 shadow-2xl flex flex-col text-sm text-slate-900 animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
              <h2 className="text-xl font-bold text-slate-900">Project Specifics</h2>
              <button onClick={() => setSelectedProject(null)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700">
                <FiX size={20} />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Project Name</span>
                <p className="font-bold text-slate-800 text-base">{selectedProject.project_name}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Project ID</span>
                <p className="font-mono font-bold text-slate-700">{selectedProject.project_id || 'N/A'}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Type</span>
                <p className="font-bold text-slate-800">{selectedProject.project_type?.replace('_', ' ')}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Start Date</span>
                  <p className="font-semibold text-slate-800">{selectedProject.start_date ? new Date(selectedProject.start_date).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">End Date</span>
                  <p className="font-semibold text-slate-800">{selectedProject.end_date ? new Date(selectedProject.end_date).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Total Budget</span>
                  <p className="font-bold text-slate-800">${selectedProject.budget?.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Total Spent</span>
                  <p className="font-bold text-amber-600">${selectedProject.spent_amount?.toLocaleString() || '0'}</p>
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Completion Progress</span>
                <p className="font-bold text-slate-800 mb-1">{selectedProject.progress_percentage || 0}%</p>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${selectedProject.progress_percentage || 0}%` }} />
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Project Status</span>
                <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusClass(selectedProject.status)}`}>
                  {selectedProject.status?.replace('_', ' ')}
                </span>
              </div>
              {selectedProject.description && (
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Scope Description</span>
                  <p className="text-slate-600 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {selectedProject.description}
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-white/50">
              <button onClick={() => setSelectedProject(null)} className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Project Component Modal Wrapper Link */}
      <ProjectModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingProject(null); }}
        project={editingProject || undefined}
        onSave={handleSaveProject}
        loading={isSaving}
      />
    </div>
  );
}