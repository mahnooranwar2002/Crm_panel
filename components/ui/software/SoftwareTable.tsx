"use client"
import React, { useState, useEffect } from 'react';
import { 
  FiEdit3, 
  FiTrash2, 
  FiPlus, 
  FiCode, 
  FiSettings, 
  FiX, 
  FiGithub, 
  FiCalendar, 
  FiMessageSquare, 
  FiUser, 
  FiZap,
  FiLayers
} from 'react-icons/fi';
import { SoftwareService } from '@/src/services/software/softwareService';
import toast, { Toaster } from 'react-hot-toast';

const SoftwareTable = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    projectName: '',
    leadName: '',
    technology: '',
    workflowDescription: '',
    problemsFacing: [],
    repositoryUrl: '',
    startDate: '',
    endDate: '',
    projectStatus: 'Development',
    comments: []
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [editProjectData, setEditProjectData] = useState<any>(null);
  
  const [selectedProjectDetails, setSelectedProjectDetails] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await SoftwareService.getSoftwareProjects(1, 100);
      
      let projectsArray = [];
      if (response?.data?.projects && Array.isArray(response.data.projects)) {
        projectsArray = response.data.projects;
      } else if (response?.data && Array.isArray(response.data)) {
        projectsArray = response.data;
      } else if (Array.isArray(response)) {
        projectsArray = response;
      }
      
      setProjects(projectsArray);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch software projects');
      toast.error('Could not populate projects catalog');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await SoftwareService.createSoftwareProject(newProject);
      if (response) {
        toast.success('Software Project Deployed Successfully');
        setIsModalOpen(false);
        setNewProject({
          projectName: '',
          leadName: '',
          technology: '',
          workflowDescription: '',
          problemsFacing: [],
          repositoryUrl: '',
          startDate: '',
          endDate: '',
          projectStatus: 'Development',
          comments: []
        });
        fetchProjects();
      }
    } catch (err: any) {
      toast.error(err.message || 'Error deploying project');
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await SoftwareService.updateSoftwareProject(editingProject._id || editingProject.id, editProjectData);
      if (response) {
        toast.success('Project Configuration Updated');
        setIsEditModalOpen(false);
        setEditingProject(null);
        fetchProjects();
      }
    } catch (err: any) {
      toast.error(err.message || 'Update operation failed');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Are you absolutely sure you want to decommission this project blueprint?')) {
      try {
        await SoftwareService.deleteSoftwareProject(id);
        toast.success('Project purged from directory');
        fetchProjects();
      } catch (err: any) {
        toast.error(err.message || 'Purge request rejected');
      }
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'production':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
      case 'development':
      case 'testing':
      case 'active':
        return 'bg-indigo-50 text-indigo-700 border border-indigo-100';
      case 'pending':
      case 'maintenance':
        return 'bg-amber-50 text-amber-700 border border-amber-100';
      default:
        return 'bg-slate-50 text-slate-600 border border-slate-200';
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-slate-50 min-h-screen p-8 flex items-center justify-center">
        <div className="text-slate-400 font-medium tracking-wide">Loading software instances matrix...</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50 min-h-screen p-6 font-sans antialiased">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <FiCode className="text-indigo-600" />
              Software Core Blueprints
            </h1>
            <p className="text-slate-500 font-medium mt-1">Manage active repositories, tech stacks, and team operational status.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black px-6 py-3.5 rounded-2xl transition-all shadow-lg shadow-indigo-100 active:scale-95 text-sm"
          >
            <FiPlus size={16} />
            Deploy Project
          </button>
        </div>

        {/* UserTable Style Clean Layout Container */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Project Architecture</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Lead Architect</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tech Stack</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Workflow Health</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions Matrix</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {projects.length > 0 ? (
                  projects.map((project, idx) => (
                    <tr key={project._id || project.id || idx} className="hover:bg-slate-50/40 transition-colors group">
                      
                      {/* Avatar initial + Title description cell */}
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm border border-indigo-100">
                            {project.projectName ? project.projectName.charAt(0).toUpperCase() : 'P'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{project.projectName || 'Unnamed System'}</p>
                            <p className="text-xs text-slate-400 font-medium truncate max-w-[200px] mt-0.5">
                              {project.workflowDescription || 'No system descriptor provided.'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Lead Column */}
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <FiUser size={14} className="text-slate-400" />
                          <span className="text-sm font-semibold text-slate-600">{project.leadName || 'Unallocated'}</span>
                        </div>
                      </td>

                      {/* Stack Badge cell */}
                      <td className="px-8 py-5">
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-md text-[11px] font-bold tracking-tight">
                          {project.technology || 'General Software'}
                        </span>
                      </td>

                      {/* Status row cell */}
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusBadgeClass(project.projectStatus)}`}>
                          {project.projectStatus || 'Active'}
                        </span>
                      </td>

                      {/* Action Triggers matrix */}
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedProjectDetails(project);
                              setIsDetailsModalOpen(true);
                            }}
                            title="Inspect View"
                            className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 rounded-xl transition-all"
                          >
                            <FiZap size={14} />
                          </button>
                          <button
                            onClick={() => {
                              setEditingProject(project);
                              setEditProjectData({ ...project });
                              setIsEditModalOpen(true);
                            }}
                            title="Modify Config"
                            className="p-2 text-slate-400 hover:text-amber-600 bg-slate-50 hover:bg-amber-50 border border-transparent hover:border-amber-100 rounded-xl transition-all"
                          >
                            <FiEdit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project._id || project.id)}
                            title="Decommission Blueprint"
                            className="p-2 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-xl transition-all"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-12 text-center text-sm text-slate-400 font-medium">
                      No software dynamic blueprints registered in this terminal yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ==================================================================================== */}
        {/* MODALS LAYER WITH FULL VIEWPORT BLUR & OVERLAY FIXES                                  */}
        {/* ==================================================================================== */}

        {/* 1. Create Modal Drawer Element */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[9999] flex justify-end">
            {/* Full-screen Backdrop layer fixing the displacement blur layout bugs */}
            <div 
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
              onClick={() => setIsModalOpen(false)} 
            />
            
            {/* Right Side Drawer layout */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-8 flex flex-col justify-between overflow-y-auto border-l border-slate-100 z-10">
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <FiLayers className="text-indigo-600" /> Deploy Architecture
                  </h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-all">
                    <FiX size={18} />
                  </button>
                </div>

                <form onSubmit={handleCreateProject} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Project Identifier Name</label>
                    <input
                      type="text" required
                      className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none font-medium text-slate-800 text-sm focus:border-indigo-500 focus:bg-white transition-all"
                      placeholder="e.g. Wholcure CRM"
                      value={newProject.projectName}
                      onChange={(e) => setNewProject({...newProject, projectName: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Lead Architect Name</label>
                    <input
                      type="text" required
                      className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none font-medium text-slate-800 text-sm focus:border-indigo-500 focus:bg-white transition-all"
                      placeholder="e.g. Hamza Shahid"
                      value={newProject.leadName}
                      onChange={(e) => setNewProject({...newProject, leadName: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Core Technology Stack</label>
                    <input
                      type="text" required
                      className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none font-medium text-slate-800 text-sm focus:border-indigo-500 focus:bg-white transition-all"
                      placeholder="e.g. Next.js 14 / NestJS"
                      value={newProject.technology}
                      onChange={(e) => setNewProject({...newProject, technology: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Workflow Description</label>
                    <textarea
                      rows={3}
                      className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none font-medium text-slate-800 text-sm focus:border-indigo-500 focus:bg-white transition-all resize-none"
                      placeholder="Outline core deployment purpose..."
                      value={newProject.workflowDescription}
                      onChange={(e) => setNewProject({...newProject, workflowDescription: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Repository Link</label>
                    <input
                      type="url"
                      className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none font-medium text-slate-800 text-sm focus:border-indigo-500 focus:bg-white transition-all"
                      placeholder="https://github.com/..."
                      value={newProject.repositoryUrl}
                      onChange={(e) => setNewProject({...newProject, repositoryUrl: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Start Interval</label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none font-medium text-slate-600 text-sm focus:border-indigo-500 focus:bg-white transition-all"
                        value={newProject.startDate}
                        onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Target End</label>
                      <input
                        type="date"
                        className="w-full px-4 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none font-medium text-slate-600 text-sm focus:border-indigo-500 focus:bg-white transition-all"
                        value={newProject.endDate}
                        onChange={(e) => setNewProject({...newProject, endDate: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Workflow Pipeline Status</label>
                    <select
                      className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none font-medium text-slate-600 cursor-pointer text-sm focus:border-indigo-500 focus:bg-white transition-all"
                      value={newProject.projectStatus}
                      onChange={(e) => setNewProject({...newProject, projectStatus: e.target.value})}
                    >
                      <option value="Development">Development</option>
                      <option value="Testing">Testing</option>
                      <option value="Production">Production</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3.5 rounded-2xl transition-all shadow-lg shadow-indigo-100 active:scale-95 text-sm mt-4"
                  >
                    Deploy Initiative Blueprints
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* 2. Edit Modal Layout */}
        {isEditModalOpen && editProjectData && (
          <div className="fixed inset-0 z-[9999] flex justify-end">
            {/* Full-screen Backdrop Layer */}
            <div 
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
              onClick={() => setIsEditModalOpen(false)} 
            />
            
            {/* Edit Drawer Box Container */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-8 flex flex-col justify-between overflow-y-auto border-l border-slate-100 z-10">
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <FiSettings className="text-amber-500" /> Alter System Parameters
                  </h2>
                  <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-all">
                    <FiX size={18} />
                  </button>
                </div>

                <form onSubmit={handleUpdateProject} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Project Identifier Name</label>
                    <input
                      type="text" required
                      className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none font-medium text-slate-800 text-sm focus:border-indigo-500 focus:bg-white transition-all"
                      value={editProjectData.projectName}
                      onChange={(e) => setEditProjectData({...editProjectData, projectName: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Lead Architect Name</label>
                    <input
                      type="text" required
                      className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none font-medium text-slate-800 text-sm focus:border-indigo-500 focus:bg-white transition-all"
                      value={editProjectData.leadName}
                      onChange={(e) => setEditProjectData({...editProjectData, leadName: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Core Technology Stack</label>
                    <input
                      type="text" required
                      className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none font-medium text-slate-800 text-sm focus:border-indigo-500 focus:bg-white transition-all"
                      value={editProjectData.technology}
                      onChange={(e) => setEditProjectData({...editProjectData, technology: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Workflow Description</label>
                    <textarea
                      rows={3}
                      className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none font-medium text-slate-800 text-sm focus:border-indigo-500 focus:bg-white transition-all resize-none"
                      value={editProjectData.workflowDescription}
                      onChange={(e) => setEditProjectData({...editProjectData, workflowDescription: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Repository Link</label>
                    <input
                      type="url"
                      className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none font-medium text-slate-800 text-sm focus:border-indigo-500 focus:bg-white transition-all"
                      value={editProjectData.repositoryUrl}
                      onChange={(e) => setEditProjectData({...editProjectData, repositoryUrl: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Workflow Pipeline Status</label>
                    <select
                      className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none font-medium text-slate-600 cursor-pointer text-sm focus:border-indigo-500 focus:bg-white transition-all"
                      value={editProjectData.projectStatus}
                      onChange={(e) => setEditProjectData({...editProjectData, projectStatus: e.target.value})}
                    >
                      <option value="Development">Development</option>
                      <option value="Testing">Testing</option>
                      <option value="Production">Production</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black py-3.5 rounded-2xl transition-all shadow-lg shadow-amber-100 active:scale-95 text-sm mt-4"
                  >
                    Commit Configuration Alters
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* 3. Detailed Inspection Drawer popup */}
        {isDetailsModalOpen && selectedProjectDetails && (
          <div className="fixed inset-0 z-[9999] flex justify-end">
            {/* Full-screen Backdrop Layer */}
            <div 
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
              onClick={() => setIsDetailsModalOpen(false)} 
            />
            
            {/* View Details Drawer Box */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl p-8 flex flex-col justify-between overflow-y-auto border-l border-slate-100 z-10">
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <FiCalendar className="text-indigo-600" /> Blueprint Deep Analytics
                  </h2>
                  <button onClick={() => setIsDetailsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-all">
                    <FiX size={18} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Architecture Identity</p>
                    <p className="text-lg font-black text-slate-800">{selectedProjectDetails.projectName}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Assigned Architect</p>
                    <p className="text-sm font-semibold text-slate-600">{selectedProjectDetails.leadName || 'Unallocated Lead'}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Workflow Profile</p>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium bg-slate-50 border border-slate-100 rounded-2xl p-4 mt-2">
                      {selectedProjectDetails.workflowDescription || 'No description assigned.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Deployment Start</p>
                      <p className="text-sm font-bold text-slate-700">{selectedProjectDetails.startDate || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Target Delivery</p>
                      <p className="text-sm font-bold text-slate-700">{selectedProjectDetails.endDate || 'N/A'}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 flex items-center gap-2">
                      <FiGithub size={14} className="text-indigo-500" /> Source Version Endpoint
                    </p>
                    {selectedProjectDetails.repositoryUrl ? (
                      <a 
                        href={selectedProjectDetails.repositoryUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm text-indigo-600 hover:text-indigo-800 font-bold break-all transition-colors underline decoration-2 decoration-indigo-100"
                      >
                        {selectedProjectDetails.repositoryUrl}
                      </a>
                    ) : (
                      <p className="text-sm text-slate-400 italic font-medium">No external source sync linked.</p>
                    )}
                  </div>

                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
                      <FiMessageSquare size={14} className="text-emerald-500" /> Executive Metadata / Comments
                    </p>
                    <div className="space-y-2">
                      {selectedProjectDetails.comments && selectedProjectDetails.comments.length > 0 ? (
                        selectedProjectDetails.comments.map((comment: string, idx: number) => (
                          <div key={idx} className="bg-emerald-50/60 border border-emerald-100 rounded-xl px-4 py-3 text-sm text-emerald-800 font-medium">
                            💡 {comment}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-400 italic font-medium">No comments cataloged.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default SoftwareTable;