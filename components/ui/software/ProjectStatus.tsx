"use client"
import React, { useState, useEffect } from 'react';
import { FiBarChart, FiTrendingUp, FiAlertTriangle, FiCheckCircle, FiClock, FiUsers } from 'react-icons/fi';
import { SoftwareService } from '@/src/services/software/softwareService';
import { TaskService } from '@/src/services/software/taskService';

const ProjectStatus = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const projectsRes = await SoftwareService.getSoftwareProjects(1, 100);
      const tasksRes = await TaskService.getAllTasks(1, 100);
      
      // Handle projects response structure: response.data.projects
      let projectsArray = [];
      if (projectsRes?.data?.projects && Array.isArray(projectsRes.data.projects)) {
        projectsArray = projectsRes.data.projects;
      } else if (projectsRes?.data && Array.isArray(projectsRes.data)) {
        projectsArray = projectsRes.data;
      } else if (Array.isArray(projectsRes)) {
        projectsArray = projectsRes;
      }
      
      // Handle tasks response structure
      let tasksArray = [];
      if (tasksRes?.data?.tasks && Array.isArray(tasksRes.data.tasks)) {
        tasksArray = tasksRes.data.tasks;
      } else if (tasksRes?.data && Array.isArray(tasksRes.data)) {
        tasksArray = tasksRes.data;
      } else if (Array.isArray(tasksRes)) {
        tasksArray = tasksRes;
      }
      
      setProjects(projectsArray);
      setTasks(tasksArray);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getProjectStatus = (project: any) => {
    const projectTasks = tasks.filter(t => t.projectName === project.projectName);
    
    if (projectTasks.length === 0) return 'No Tasks';
    
    const completedTasks = projectTasks.filter(t => t.status === 'Completed').length;
    const inProgressTasks = projectTasks.filter(t => t.status === 'In Progress').length;
    const pendingTasks = projectTasks.filter(t => t.status === 'Pending').length;
    const notStartedTasks = projectTasks.filter(t => t.status === 'Not Started').length;

    const completionRate = (completedTasks / projectTasks.length) * 100;

    if (completionRate === 100) return 'Completed';
    if (pendingTasks > inProgressTasks * 0.5) return 'Postponed';
    if (notStartedTasks > projectTasks.length * 0.3) return 'Pending';
    if (inProgressTasks > 0 || completedTasks > 0) return 'Going Good';
    
    return 'Pending';
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Going Good':
        return { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700', icon: '✓' };
      case 'Postponed':
        return { bg: 'bg-orange-50', border: 'border-orange-100', text: 'text-orange-700', icon: '⏸' };
      case 'Pending':
        return { bg: 'bg-yellow-50', border: 'border-yellow-100', text: 'text-yellow-700', icon: '⏳' };
      default:
        return { bg: 'bg-slate-50', border: 'border-slate-100', text: 'text-slate-700', icon: '○' };
    }
  };

  const getProjectStats = (projectName: string) => {
    const projectTasks = tasks.filter(t => t.projectName === projectName);
    
    return {
      total: projectTasks.length,
      completed: projectTasks.filter(t => t.status === 'Completed').length,
      inProgress: projectTasks.filter(t => t.status === 'In Progress').length,
      pending: projectTasks.filter(t => t.status === 'Pending').length,
      notStarted: projectTasks.filter(t => t.status === 'Not Started').length,
      completionRate: projectTasks.length > 0 ? Math.round((projectTasks.filter(t => t.status === 'Completed').length / projectTasks.length) * 100) : 0,
      developers: [...new Set(projectTasks.filter(t => t.role === 'Developer').map(t => t.assignedTo))].length,
      designers: [...new Set(projectTasks.filter(t => t.role === 'Designer').map(t => t.assignedTo))].length,
      sales: [...new Set(projectTasks.filter(t => t.role === 'Sales').map(t => t.assignedTo))].length
    };
  };

  if (loading) {
    return (
      <div className="w-full text-black space-y-6 px-2">
        <div className="text-center py-20 text-slate-400">Loading project status...</div>
      </div>
    );
  }

  return (
    <div className="w-full text-black space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      
      <div className="px-2">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            {/* Fixed the spacing error here */}
            <FiBarChart className="text-blue-500" />
            Project Status Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">Monitor project health, progress, and team performance across all initiatives.</p>
        </div>
      </div>

      {/* Status Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-2">
        {projects.map((project) => {
          const status = getProjectStatus(project);
          const stats = getProjectStats(project.projectName);
          const statusColor = getStatusColor(status);

          return (
            <div key={project._id} className="bg-white/70 backdrop-blur-xl rounded-[2rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)] overflow-hidden hover:shadow-lg transition-all duration-300">
              {/* Project Header */}
              <div className={`${statusColor.bg} border-b ${statusColor.border} px-6 py-6`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-800">{project.projectName}</h3>
                    <p className="text-xs text-slate-600 mt-1">Lead: {project.leadName}</p>
                  </div>
                  <div className={`${statusColor.bg} ${statusColor.text} px-4 py-2 rounded-xl font-black text-sm border ${statusColor.border}`}>
                    {statusColor.icon} {status}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="px-6 py-6 border-b border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase">Overall Progress</span>
                  <span className="text-lg font-black text-slate-800">{stats.completionRate}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-[#21a9ff] to-[#6dc6fe] h-3 rounded-full transition-all"
                    style={{ width: `${stats.completionRate}%` }}
                  ></div>
                </div>
              </div>

              {/* Task Statistics */}
              <div className="px-6 py-6 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase mb-3">Task Breakdown</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                    <div className="text-2xl font-black text-emerald-600">{stats.completed}</div>
                    <div className="text-xs text-emerald-700 font-bold mt-1">Completed</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                    <div className="text-2xl font-black text-blue-600">{stats.inProgress}</div>
                    <div className="text-xs text-blue-700 font-bold mt-1">In Progress</div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-100">
                    <div className="text-2xl font-black text-yellow-600">{stats.pending}</div>
                    <div className="text-xs text-yellow-700 font-bold mt-1">Pending</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                    <div className="text-2xl font-black text-slate-600">{stats.notStarted}</div>
                    <div className="text-xs text-slate-700 font-bold mt-1">Not Started</div>
                  </div>
                </div>
              </div>

              {/* Team Stats */}
              <div className="px-6 py-6 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase mb-3">Team Allocation</p>
                <div className="space-y-2">
                  {stats.developers > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">Developers</span>
                      <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">{stats.developers} {stats.developers === 1 ? 'member' : 'members'}</span>
                    </div>
                  )}
                  {stats.designers > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">Designers</span>
                      <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">{stats.designers} {stats.designers === 1 ? 'member' : 'members'}</span>
                    </div>
                  )}
                  {stats.sales > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">Sales</span>
                      <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">{stats.sales} {stats.sales === 1 ? 'member' : 'members'}</span>
                    </div>
                  )}
                  {(stats.developers === 0 && stats.designers === 0 && stats.sales === 0) && (
                    <p className="text-xs text-slate-500 italic">No tasks assigned yet</p>
                  )}
                </div>
              </div>

              {/* Timeline */}
              <div className="px-6 py-6">
                <p className="text-xs font-bold text-slate-500 uppercase mb-3">Project Timeline</p>
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <FiClock size={14} />
                  <span>{project.startDate}</span>
                  <span className="text-slate-400">→</span>
                  <span>{project.endDate}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Statistics */}
      {projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-2 mt-8">
          <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Total Projects</p>
                <p className="text-3xl font-black text-slate-800 mt-2">{projects.length}</p>
              </div>
              <div className="p-4 rounded-xl bg-blue-50 text-blue-600">
                <FiBarChart size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Total Tasks</p>
                <p className="text-3xl font-black text-slate-800 mt-2">{tasks.length}</p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 text-emerald-600">
                <FiCheckCircle size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">Avg. Progress</p>
                <p className="text-3xl font-black text-slate-800 mt-2">
                  {Math.round(
                    projects.reduce((sum, p) => sum + getProjectStats(p.projectName).completionRate, 0) / projects.length
                  )}%
                </p>
              </div>
              <div className="p-4 rounded-xl bg-yellow-50 text-yellow-600">
                <FiTrendingUp size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">On Track</p>
                <p className="text-3xl font-black text-slate-800 mt-2">
                  {projects.filter(p => getProjectStatus(p) === 'Going Good').length}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-green-50 text-green-600">
                <FiCheckCircle size={28} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectStatus;