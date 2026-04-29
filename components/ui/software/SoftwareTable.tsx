"use client"
import React, { useState, useEffect } from 'react';
import { FiEdit3, FiTrash2, FiPlus, FiCode, FiSettings, FiX, FiGithub, FiCalendar, FiAlertCircle, FiMessageSquare, FiUser, FiZap } from 'react-icons/fi';
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
      
      let projectsArray: React.SetStateAction<any[]> = [];
      if (response && response.data && response.data.projects && Array.isArray(response.data.projects)) {
        projectsArray = response.data.projects;
      } else if (response && response.projects && Array.isArray(response.projects)) {
        projectsArray = response.projects;
      } else if (response && response.data && Array.isArray(response.data)) {
        projectsArray = response.data;
      } else if (Array.isArray(response)) {
        projectsArray = response;
      }
      
      setProjects(projectsArray);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching projects:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadToast = toast.loading("Creating new project...");
    try {
      await SoftwareService.createSoftwareProject(newProject);
      
      toast.success("Project created successfully!", { id: loadToast });
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
    } catch (err: any) {
      toast.error(err.message || "Failed to create project", { id: loadToast });
    }
  };

  const handleEditProject = (project: any) => {
    setEditingProject(project);
    setEditProjectData({ ...project });
    setIsEditModalOpen(true);
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadToast = toast.loading("Updating project...");
    try {
      await SoftwareService.updateSoftwareProject(editingProject._id, editProjectData);

      toast.success("Project updated successfully! ✨", { id: loadToast });
      setIsEditModalOpen(false);
      setEditingProject(null);
      fetchProjects();
    } catch (err: any) {
      toast.error(err.message || "Update failed", { id: loadToast });
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await SoftwareService.deleteSoftwareProject(id);
        toast.success("Project deleted successfully");
        fetchProjects();
      } catch (err: any) {
        toast.error("Error: " + err.message);
      }
    }
  };

  const viewProjectDetails = (project: any) => {
    setSelectedProjectDetails(project);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="w-full text-black space-y-6 animate-in slide-in-from-bottom-4 duration-500 relative">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <FiCode className="text-blue-500" />
            Software Project Tracking
          </h1>
          <p className="text-sm text-slate-500 mt-1">Monitor development workflows, track team progress, and manage project timelines.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-[#21a9ff] hover:bg-[#6dc6fe] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-blue-100"
        >
          <FiPlus size={18} />
          <span>New Project</span>
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg mx-2">
          Error: {error}
        </div>
      )}

      <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] border border-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.03)] overflow-hidden mx-2">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-100">
                <th className="px-6 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Project Name</th>
                <th className="px-6 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Lead Name</th>
                <th className="px-6 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Technology</th>
                <th className="px-6 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-6 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Timeline</th>
                <th className="px-6 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-20 text-center text-slate-400 font-medium">Loading projects...</td></tr>
              ) : projects.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-20 text-center text-slate-400 font-medium">No projects found</td></tr>
              ) : (
                projects.map((project) => (
                  <tr key={project._id} className="hover:bg-blue-50/30 transition-all duration-300 group cursor-pointer">
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-blue-50 text-[#21a9ff]">
                          <FiCode size={18} />
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 text-[15px] block">{project.projectName}</span>
                          <span className="text-xs text-slate-500">{project.projectStatus}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2">
                        <FiUser size={16} className="text-slate-400" />
                        <span className="font-semibold text-slate-700">{project.leadName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-md border border-green-100/50">
                          {project.technology}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit ${
                        project.projectStatus === 'Completed' 
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                          : project.projectStatus === 'Testing'
                          ? 'bg-yellow-50 text-yellow-600 border border-yellow-100'
                          : 'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          project.projectStatus === 'Completed' 
                            ? 'bg-emerald-500' 
                            : project.projectStatus === 'Testing'
                            ? 'bg-yellow-500'
                            : 'bg-blue-500 animate-pulse'
                        }`}></span>
                        {project.projectStatus}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-1 text-xs text-slate-600">
                        <FiCalendar size={14} />
                        <span>{project.startDate} → {project.endDate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 transition-opacity">
                        <button 
                          onClick={() => viewProjectDetails(project)}
                          className="p-2.5 text-slate-400 hover:text-[#21a9ff] hover:bg-white rounded-xl transition-all hover:shadow-md border border-transparent hover:border-slate-100"
                          title="View Details"
                        >
                          <FiZap size={18} />
                        </button>
                        <button 
                          onClick={() => handleEditProject(project)}
                          className="p-2.5 text-slate-400 hover:text-[#21a9ff] hover:bg-white rounded-xl transition-all hover:shadow-md border border-transparent hover:border-slate-100"
                          title="Edit Project"
                        >
                          <FiEdit3 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteProject(project._id)}
                          className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl transition-all hover:shadow-md border border-transparent hover:border-slate-100"
                          title="Delete Project"
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
      {/* CREATE PROJECT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[540px] rounded-[2.5rem] shadow-[0_20px_70px_-10px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <div className="px-10 pt-10 pb-6 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Create Project</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-600">
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleCreateProject} className="px-10 pb-10 space-y-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Project Name</label>
                <input type="text" required value={newProject.projectName} onChange={(e) => setNewProject({...newProject, projectName: e.target.value})} placeholder="e.g. E-Commerce Platform" className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-[#21a9ff] focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm" />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Lead Name</label>
                <input type="text" required value={newProject.leadName} onChange={(e) => setNewProject({...newProject, leadName: e.target.value})} placeholder="e.g. Mam Mahnoor" className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-[#21a9ff] focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm" />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Technology Stack</label>
                <input type="text" required value={newProject.technology} onChange={(e) => setNewProject({...newProject, technology: e.target.value})} placeholder="e.g. Web - Next.js + React" className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-[#21a9ff] focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm" />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Workflow Description</label>
                <textarea value={newProject.workflowDescription} onChange={(e) => setNewProject({...newProject, workflowDescription: e.target.value})} placeholder="Describe the work being done and features added..." className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-[#21a9ff] focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm h-20" />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Repository URL</label>
                <input type="text" value={newProject.repositoryUrl} onChange={(e) => setNewProject({...newProject, repositoryUrl: e.target.value})} placeholder="https://github.com/..." className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-[#21a9ff] focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Start Date</label>
                  <input type="date" required value={newProject.startDate} onChange={(e) => setNewProject({...newProject, startDate: e.target.value})} className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-[#21a9ff] focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">End Date</label>
                  <input type="date" required value={newProject.endDate} onChange={(e) => setNewProject({...newProject, endDate: e.target.value})} className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-[#21a9ff] focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Project Status</label>
                <select value={newProject.projectStatus} onChange={(e) => setNewProject({...newProject, projectStatus: e.target.value})} className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none font-medium text-slate-600 cursor-pointer text-sm">
                  <option value="Development">Development</option>
                  <option value="Testing">Testing</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-[#21a9ff] hover:bg-[#6dc6fe] text-white font-black py-3 rounded-2xl transition-all shadow-xl shadow-blue-100 active:scale-[0.98]">
                Create Project
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PROJECT MODAL */}
      {isEditModalOpen && editProjectData && (
        <div className="fixed inset-0 text-black z-[999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[540px] rounded-[2.5rem] shadow-[0_20px_70px_-10px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <div className="px-10 pt-10 pb-6 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Update Project</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-600">
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleUpdateProject} className="px-10 pb-10 space-y-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Project Name</label>
                <input type="text" required value={editProjectData.projectName} onChange={(e) => setEditProjectData({...editProjectData, projectName: e.target.value})} className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-[#21a9ff] focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm" />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Lead Name</label>
                <input type="text" required value={editProjectData.leadName} onChange={(e) => setEditProjectData({...editProjectData, leadName: e.target.value})} className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-[#21a9ff] focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm" />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Technology Stack</label>
                <input type="text" required value={editProjectData.technology} onChange={(e) => setEditProjectData({...editProjectData, technology: e.target.value})} className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-[#21a9ff] focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm" />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Workflow Description</label>
                <textarea value={editProjectData.workflowDescription} onChange={(e) => setEditProjectData({...editProjectData, workflowDescription: e.target.value})} placeholder="Describe the work being done and features added..." className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-[#21a9ff] focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm h-20" />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Repository URL</label>
                <input type="text" value={editProjectData.repositoryUrl} onChange={(e) => setEditProjectData({...editProjectData, repositoryUrl: e.target.value})} placeholder="https://github.com/..." className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-[#21a9ff] focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Start Date</label>
                  <input type="date" required value={editProjectData.startDate} onChange={(e) => setEditProjectData({...editProjectData, startDate: e.target.value})} className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-[#21a9ff] focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">End Date</label>
                  <input type="date" required value={editProjectData.endDate} onChange={(e) => setEditProjectData({...editProjectData, endDate: e.target.value})} className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-[#21a9ff] focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Project Status</label>
                <select value={editProjectData.projectStatus} onChange={(e) => setEditProjectData({...editProjectData, projectStatus: e.target.value})} className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none font-medium text-slate-600 cursor-pointer text-sm">
                  <option value="Development">Development</option>
                  <option value="Testing">Testing</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-[#21a9ff] hover:bg-[#6dc6fe] text-white font-black py-3 rounded-2xl transition-all shadow-xl shadow-blue-100 active:scale-[0.98]">
                Update Project
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PROJECT DETAILS MODAL */}
      {isDetailsModalOpen && selectedProjectDetails && (
        <div className="fixed inset-0 text-black z-[999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[680px] rounded-[2.5rem] shadow-[0_20px_70px_-10px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <div className="px-10 pt-10 pb-6 flex justify-between items-center sticky top-0 bg-white border-b border-slate-100">
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">{selectedProjectDetails.projectName}</h2>
                <p className="text-sm text-slate-500 mt-1">Project Details & Progress</p>
              </div>
              <button onClick={() => setIsDetailsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-600">
                <FiX size={24} />
              </button>
            </div>
            <div className="px-10 py-8 space-y-6">
              {/* Lead Info */}
              <div className="flex items-start gap-4 pb-4 border-b border-slate-100">
                <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                  <FiUser size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Track Lead</p>
                  <p className="text-lg font-black text-slate-800">{selectedProjectDetails.leadName}</p>
                </div>
              </div>

              {/* Technology & Timeline */}
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Technology</p>
                  <p className="text-sm font-bold text-slate-700 mt-1">{selectedProjectDetails.technology}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Timeline</p>
                  <p className="text-sm font-bold text-slate-700 mt-1 flex items-center gap-1">
                    <FiCalendar size={14} />
                    {selectedProjectDetails.startDate} → {selectedProjectDetails.endDate}
                  </p>
                </div>
              </div>

              {/* Workflow Description */}
              <div className="pb-4 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Workflow & Features</p>
                <p className="text-sm text-slate-700 leading-relaxed">{selectedProjectDetails.workflowDescription}</p>
              </div>

              {/* Problems Facing */}
              <div className="pb-4 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                  <FiAlertCircle size={14} className="text-rose-500" />
                  Problems Facing
                </p>
                <div className="space-y-2">
                  {selectedProjectDetails.problemsFacing && selectedProjectDetails.problemsFacing.length > 0 ? (
                    selectedProjectDetails.problemsFacing.map((problem: string, idx: number) => (
                      <div key={idx} className="bg-rose-50 border border-rose-100 rounded-lg px-3 py-2 text-sm text-rose-700">
                        • {problem}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 italic">No known issues</p>
                  )}
                </div>
              </div>

              {/* Repository */}
              <div className="pb-4 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                  <FiGithub size={14} />
                  Repository
                </p>
                {selectedProjectDetails.repositoryUrl ? (
                  <a href={selectedProjectDetails.repositoryUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline break-all font-medium">
                    {selectedProjectDetails.repositoryUrl}
                  </a>
                ) : (
                  <p className="text-sm text-slate-500 italic">No repository linked</p>
                )}
              </div>

              {/* Comments & Suggestions */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                  <FiMessageSquare size={14} className="text-green-500" />
                  Comments & Suggestions
                </p>
                <div className="space-y-2">
                  {selectedProjectDetails.comments && selectedProjectDetails.comments.length > 0 ? (
                    selectedProjectDetails.comments.map((comment: string, idx: number) => (
                      <div key={idx} className="bg-green-50 border border-green-100 rounded-lg px-3 py-2 text-sm text-green-700">
                        💡 {comment}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 italic">No comments yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default SoftwareTable;