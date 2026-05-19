"use client";

import React, { useState, useEffect } from 'react';
import { 
  FiEdit3, 
  FiTrash2, 
  FiPlus, 
  FiCheckCircle, 
  FiX, 
  FiUser, 
  FiCalendar, 
  FiClock, 
  FiLayers, 
  FiEye,
  FiFileText,
  FiInfo
} from 'react-icons/fi';
import { TaskService } from '@/src/services/software/taskService';
import { SoftwareService } from '@/src/services/software/softwareService';
import toast, { Toaster } from 'react-hot-toast';

const TaskDetails = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filterRole, setFilterRole] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterProject, setFilterProject] = useState('All');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    projectId: '',
    projectName: '',
    taskTitle: '',
    assignedTo: '',
    role: 'Developer',
    description: '',
    priority: 'Medium',
    timeline: '',
    submissionDeadline: '',
    assignedBy: '',
    estimatedHours: 0,
    notes: ''
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [editTaskData, setEditTaskData] = useState<any>(null);
  
  // View Details Sidebar State
  const [selectedTask, setSelectedTask] = useState<any | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const projectsRes = await SoftwareService.getSoftwareProjects(1, 100);
      const tasksRes = await TaskService.getAllTasks(1, 100);
      
      let projectsArray = [];
      if (projectsRes?.data?.projects && Array.isArray(projectsRes.data.projects)) {
        projectsArray = projectsRes.data.projects;
      } else if (projectsRes?.data && Array.isArray(projectsRes.data)) {
        projectsArray = projectsRes.data;
      } else if (Array.isArray(projectsRes)) {
        projectsArray = projectsRes;
      }
      
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
      setError(null);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError("Failed to fetch dashboard records");
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchRole = filterRole === 'All' || task.role === filterRole;
    const matchStatus = filterStatus === 'All' || task.status === filterStatus;
    const matchProject = filterProject === 'All' || task.projectName === filterProject;
    return matchRole && matchStatus && matchProject;
  });

  const uniqueProjects = [...new Set(tasks.map(t => t.projectName))];
  const uniqueRoles = [...new Set(tasks.map(t => t.role))];
  const uniqueStatuses = [...new Set(tasks.map(t => t.status))];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'In Progress':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Pending':
        return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      case 'Not Started':
        return 'bg-slate-50 text-slate-600 border-slate-100';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'Critical':
        return 'text-red-600 bg-red-50 border-red-100';
      case 'High':
        return 'text-orange-600 bg-orange-50 border-orange-100';
      case 'Medium':
        return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'Low':
        return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.projectId || !newTask.taskTitle || !newTask.assignedTo || !newTask.description || !newTask.submissionDeadline || !newTask.assignedBy) {
      return toast.error("Please fill in all mandatory fields");
    }
    
    const loadToast = toast.loading("Deploying new task...");
    try {
      await TaskService.createTask(newTask);
      toast.success("Task deployed successfully!", { id: loadToast });
      setIsModalOpen(false);
      setNewTask({
        projectId: '',
        projectName: '',
        taskTitle: '',
        assignedTo: '',
        role: 'Developer',
        description: '',
        priority: 'Medium',
        timeline: '',
        submissionDeadline: '',
        assignedBy: '',
        estimatedHours: 0,
        notes: ''
      });
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to create task", { id: loadToast });
    }
  };

  const handleEditTask = (task: any) => {
    setEditingTask(task);
    setEditTaskData({ ...task });
    setIsEditModalOpen(true);
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadToast = toast.loading("Updating task parameters...");
    try {
      await TaskService.updateTask(editingTask._id, editTaskData);
      toast.success("Task parameters updated! ✨", { id: loadToast });
      setIsEditModalOpen(false);
      setEditingTask(null);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Update failed", { id: loadToast });
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (confirm('Are you sure you want to remove this task from directory?')) {
      try {
        await TaskService.deleteTask(id);
        toast.success("Task removed from directory");
        fetchData();
      } catch (err: any) {
        toast.error(err.message || "Could not delete task");
      }
    }
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen p-6 text-black">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Task Directory
            </h1>
            <p className="text-slate-500 font-medium">Assign and monitor engine tasks across core projects.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all font-bold"
          >
            <FiPlus size={20} /> Assign New Task
          </button>
        </div>

        {/* --- Filters Area --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Filter by Project</label>
            <select 
              value={filterProject} 
              onChange={(e) => setFilterProject(e.target.value)}
              className="w-full px-5 py-3 rounded-2xl border border-slate-200 bg-white outline-none text-slate-700 font-medium text-sm focus:border-indigo-500 transition-all cursor-pointer shadow-sm"
            >
              <option value="All">All Projects</option>
              {uniqueProjects.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Filter by Role</label>
            <select 
              value={filterRole} 
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-5 py-3 rounded-2xl border border-slate-200 bg-white outline-none text-slate-700 font-medium text-sm focus:border-indigo-500 transition-all cursor-pointer shadow-sm"
            >
              <option value="All">All Roles</option>
              {uniqueRoles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Filter by Status</label>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-5 py-3 rounded-2xl border border-slate-200 bg-white outline-none text-slate-700 font-medium text-sm focus:border-indigo-500 transition-all cursor-pointer shadow-sm"
            >
              <option value="All">All Statuses</option>
              {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* --- Table Container --- */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Task Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Hand</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Priority / Scope</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Deadline</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status & Progress</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center opacity-40">
                        <FiCheckCircle size={48} className="mb-2 text-indigo-600" />
                        <p className="font-medium">Syncing Directory...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center opacity-40">
                        <FiCheckCircle size={48} className="mb-2" />
                        <p className="font-medium">No active tasks found matching criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => (
                    <tr key={task._id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 max-w-xs">
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{task.taskTitle}</p>
                          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-wider mt-0.5 inline-flex items-center gap-1">
                            <FiLayers size={10} /> {task.projectName}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200">
                            <FiUser size={14} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{task.assignedTo}</p>
                            <p className="text-[10px] text-slate-400 font-medium tracking-wide">{task.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          {task.estimatedHours > 0 && (
                            <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                              <FiClock size={12} /> {task.estimatedHours}h allocated
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-700 text-sm font-semibold">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <FiCalendar size={14} className="text-slate-400" />
                          <span>{task.submissionDeadline}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2 max-w-[140px]">
                          <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase inline-block border ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className="bg-indigo-600 h-full transition-all duration-500"
                                style={{ width: `${task.completedPercentage || 0}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-black text-slate-400">{task.completedPercentage || 0}%</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button
                          onClick={() => setSelectedTask(task)}
                          className="text-slate-400 hover:text-indigo-600 transition-colors"
                          title="View Details"
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          onClick={() => handleEditTask(task)}
                          className="text-slate-400 hover:text-indigo-600 transition-colors"
                          title="Edit Task"
                        >
                          <FiEdit3 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete Task"
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

      {/* --- View Profile / Details Sidebar --- */}
      {selectedTask && (
        <>
          <div
            className="fixed inset-0 z-[998] bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setSelectedTask(null)}
          />
          <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl z-[999] animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                  <FiFileText className="text-indigo-600" /> Task Specification
                </h2>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-all"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Scope Header */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-2">
                  <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
                    {selectedTask.projectName}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">{selectedTask.taskTitle}</h3>
                </div>

                {/* Grid Parameters */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Operator Name</p>
                    <p className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                      <FiUser size={14} className="text-slate-400" /> {selectedTask.assignedTo}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Role Profile</p>
                    <p className="font-semibold text-slate-600 text-sm">{selectedTask.role}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Priority Level</p>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border inline-block mt-0.5 ${getPriorityColor(selectedTask.priority)}`}>
                      {selectedTask.priority}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Timeline Goal</p>
                    <p className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                      <FiCalendar size={14} className="text-slate-400" /> {selectedTask.submissionDeadline}
                    </p>
                  </div>
                </div>

                {/* Progress Tracking */}
                <div className="space-y-2 border-t border-b border-slate-100 py-4">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Workflow Status</p>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${getStatusColor(selectedTask.status)}`}>
                      {selectedTask.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-full transition-all duration-500"
                        style={{ width: `${selectedTask.completedPercentage || 0}%` }}
                      />
                    </div>
                    <span className="text-xs font-black text-slate-700 min-w-[32px] text-right">{selectedTask.completedPercentage || 0}%</span>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Functional Guidelines</p>
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap bg-slate-50/50 p-4 rounded-xl border border-slate-100 font-medium">
                    {selectedTask.description || "No guideline text provided for this matrix task."}
                  </p>
                </div>

                {/* Additional Logs */}
                <div className="grid grid-cols-1 gap-4 pt-2">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Allocated Scope</p>
                    <p className="text-sm font-bold text-slate-700">{selectedTask.estimatedHours || 0} Professional Hours</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Authorizing Entity</p>
                    <p className="text-sm font-semibold text-slate-600">{selectedTask.assignedBy || "System Admin"}</p>
                  </div>
                  {selectedTask.notes && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Supplementary Log Notes</p>
                      <div className="text-xs text-amber-700 bg-amber-50/60 border border-amber-100 p-3 rounded-xl font-medium flex gap-2 items-start">
                        <FiInfo size={14} className="mt-0.5 shrink-0" />
                        <p className="whitespace-pre-wrap">{selectedTask.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => setSelectedTask(null)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-2xl transition-all shadow-md active:scale-95"
                >
                  Close Specification
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* --- Create / Edit Sidebars --- */}
      {(isModalOpen || (isEditModalOpen && editTaskData)) && (
        <>
          <div
            className="fixed inset-0 z-[998] bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => {
              setIsModalOpen(false);
              setIsEditModalOpen(false);
            }}
          />
          <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl z-[999] animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h2 className="text-2xl font-black text-slate-800">
                  {isModalOpen ? "Assign New Task" : "Modify Task Parameters"}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={isModalOpen ? handleCreateTask : handleUpdateTask} className="space-y-4">
                {isModalOpen && (
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Target Project</label>
                    <select
                      required
                      value={newTask.projectId}
                      onChange={(e) => {
                        const target = projects.find(p => p._id === e.target.value);
                        setNewTask({ ...newTask, projectId: e.target.value, projectName: target?.projectName || '' });
                      }}
                      className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-indigo-500 focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm cursor-pointer"
                    >
                      <option value="">Select Domain</option>
                      {projects.map(p => <option key={p._id} value={p._id}>{p.projectName}</option>)}
                    </select>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Task Scope Title</label>
                  <input
                    type="text"
                    required
                    value={isModalOpen ? newTask.taskTitle : editTaskData.taskTitle}
                    onChange={(e) => isModalOpen ? setNewTask({ ...newTask, taskTitle: e.target.value }) : setEditTaskData({ ...editTaskData, taskTitle: e.target.value })}
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-indigo-500 focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm"
                    placeholder="e.g. Build out micro-service matrix"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Assignee</label>
                    <input
                      type="text"
                      required
                      value={isModalOpen ? newTask.assignedTo : editTaskData.assignedTo}
                      onChange={(e) => isModalOpen ? setNewTask({ ...newTask, assignedTo: e.target.value }) : setEditTaskData({ ...editTaskData, assignedTo: e.target.value })}
                      className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-indigo-500 focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm"
                      placeholder="Operator Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Operational Role</label>
                    <select
                      required
                      value={isModalOpen ? newTask.role : editTaskData.role}
                      onChange={(e) => isModalOpen ? setNewTask({ ...newTask, role: e.target.value }) : setEditTaskData({ ...editTaskData, role: e.target.value })}
                      className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-indigo-500 focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm cursor-pointer"
                    >
                      <option value="Developer">Developer</option>
                      <option value="Designer">Designer</option>
                      <option value="Sales">Sales</option>
                    </select>
                  </div>
                </div>

                {isModalOpen && (
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Functional Requirements</label>
                    <textarea
                      required
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-indigo-500 focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm h-20"
                      placeholder="Write core guidelines..."
                    />
                  </div>
                )}

                {!isModalOpen && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Progress Percentage</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={editTaskData.completedPercentage}
                        onChange={(e) => setEditTaskData({ ...editTaskData, completedPercentage: parseInt(e.target.value) || 0 })}
                        className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-indigo-500 focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Status Status</label>
                      <select
                        value={editTaskData.status}
                        onChange={(e) => setEditTaskData({ ...editTaskData, status: e.target.value })}
                        className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-indigo-500 focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm cursor-pointer"
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Priority Metric</label>
                    <select
                      value={isModalOpen ? newTask.priority : editTaskData.priority}
                      onChange={(e) => isModalOpen ? setNewTask({ ...newTask, priority: e.target.value }) : setEditTaskData({ ...editTaskData, priority: e.target.value })}
                      className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-indigo-500 focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm cursor-pointer"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Allocated Hours</label>
                    <input
                      type="number"
                      value={isModalOpen ? newTask.estimatedHours : editTaskData.estimatedHours}
                      onChange={(e) => isModalOpen ? setNewTask({ ...newTask, estimatedHours: parseInt(e.target.value) || 0 }) : setEditTaskData({ ...editTaskData, estimatedHours: parseInt(e.target.value) || 0 })}
                      className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-indigo-500 focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Submission Deadline</label>
                  <input
                    type="date"
                    required
                    value={isModalOpen ? newTask.submissionDeadline : editTaskData.submissionDeadline}
                    onChange={(e) => isModalOpen ? setNewTask({ ...newTask, submissionDeadline: e.target.value }) : setEditTaskData({ ...editTaskData, submissionDeadline: e.target.value })}
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-indigo-500 focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm text-slate-500"
                  />
                </div>

                {isModalOpen && (
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Authorizing Manager</label>
                    <input
                      type="text"
                      required
                      value={newTask.assignedBy}
                      onChange={(e) => setNewTask({ ...newTask, assignedBy: e.target.value })}
                      className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-indigo-500 focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm"
                      placeholder="e.g. Mam Mahnoor"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Internal Log Notes</label>
                  <textarea
                    value={isModalOpen ? newTask.notes : editTaskData.notes}
                    onChange={(e) => isModalOpen ? setNewTask({ ...newTask, notes: e.target.value }) : setEditTaskData({ ...editTaskData, notes: e.target.value })}
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-indigo-500 focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm h-16"
                    placeholder="Supplementary logs..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-2xl transition-all shadow-lg shadow-indigo-100 active:scale-95"
                >
                  {isModalOpen ? "Deploy New Task" : "Commit Changes"}
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

export default TaskDetails;