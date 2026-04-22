"use client"
import React, { useState, useEffect } from 'react';
import { FiEdit3, FiTrash2, FiPlus, FiCheckCircle, FiAlertCircle, FiX, FiUser, FiCalendar, FiTrendingUp, FiClock } from 'react-icons/fi';
import { TaskService } from '@/src/services/taskService';
import toast, { Toaster } from 'react-hot-toast';

const TaskDetails = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filterRole, setFilterRole] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterProject, setFilterProject] = useState('All');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
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

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await TaskService.getAllTasks(1, 100);
      
      let tasksArray: any[] = [];
      if (response && response.data && Array.isArray(response.data)) {
        tasksArray = response.data;
      } else if (Array.isArray(response)) {
        tasksArray = response;
      }
      
      setTasks(tasksArray);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching tasks:', err);
      setError(err.message);
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
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
      case 'In Progress':
        return 'bg-blue-50 text-blue-600 border border-blue-100';
      case 'Pending':
        return 'bg-yellow-50 text-yellow-600 border border-yellow-100';
      case 'Not Started':
        return 'bg-slate-50 text-slate-600 border border-slate-100';
      default:
        return 'bg-slate-50 text-slate-600 border border-slate-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'Critical':
        return 'text-red-600 bg-red-50';
      case 'High':
        return 'text-orange-600 bg-orange-50';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'Low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-slate-600 bg-slate-50';
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadToast = toast.loading("Creating new task...");
    try {
      await TaskService.createTask(newTask);
      
      toast.success("Task created successfully!", { id: loadToast });
      setIsModalOpen(false);
      setNewTask({
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
      fetchTasks();
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
    const loadToast = toast.loading("Updating task...");
    try {
      await TaskService.updateTask(editingTask._id, editTaskData);

      toast.success("Task updated successfully! ✨", { id: loadToast });
      setIsEditModalOpen(false);
      setEditingTask(null);
      fetchTasks();
    } catch (err: any) {
      toast.error(err.message || "Update failed", { id: loadToast });
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await TaskService.deleteTask(id);
        toast.success("Task deleted successfully");
        fetchTasks();
      } catch (err: any) {
        toast.error("Error: " + err.message);
      }
    }
  };

  return (
    <div className="w-full text-black space-y-6 animate-in slide-in-from-bottom-4 duration-500 relative">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <FiCheckCircle className="text-blue-500" />
            Task Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">Assign and manage tasks for developers, designers, and sales team.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-[#21a9ff] hover:bg-[#6dc6fe] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-blue-100"
        >
          <FiPlus size={18} />
          <span>Assign Task</span>
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg mx-2">
          Error: {error}
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 px-2">
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-500 uppercase">Filter by Project</label>
          <select 
            value={filterProject} 
            onChange={(e) => setFilterProject(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-white focus:border-[#21a9ff] outline-none text-slate-700 font-medium text-sm"
          >
            <option value="All">All Projects</option>
            {uniqueProjects.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-500 uppercase">Filter by Role</label>
          <select 
            value={filterRole} 
            onChange={(e) => setFilterRole(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-white focus:border-[#21a9ff] outline-none text-slate-700 font-medium text-sm"
          >
            <option value="All">All Roles</option>
            {uniqueRoles.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-500 uppercase">Filter by Status</label>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-white focus:border-[#21a9ff] outline-none text-slate-700 font-medium text-sm"
          >
            <option value="All">All Status</option>
            {uniqueStatuses.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] border border-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.03)] overflow-hidden mx-2">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-100">
                <th className="px-6 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Task Title</th>
                <th className="px-6 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Assigned To</th>
                <th className="px-6 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Project</th>
                <th className="px-6 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Priority</th>
                <th className="px-6 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Deadline</th>
                <th className="px-6 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Progress</th>
                <th className="px-6 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-6 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={8} className="px-6 py-20 text-center text-slate-400 font-medium">Loading tasks...</td></tr>
              ) : filteredTasks.length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-20 text-center text-slate-400 font-medium">No tasks found</td></tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr key={task._id} className="hover:bg-blue-50/30 transition-all duration-300 group">
                    <td className="px-6 py-6">
                      <div>
                        <span className="font-bold text-slate-800 text-[14px] block">{task.taskTitle}</span>
                        <span className="text-xs text-slate-500 mt-1">{task.description.substring(0, 50)}...</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2">
                        <FiUser size={16} className="text-slate-400" />
                        <span className="font-semibold text-slate-700 text-sm">{task.assignedTo}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-xs font-bold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                        {task.projectName}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2 text-sm text-slate-700">
                        <FiCalendar size={14} className="text-slate-400" />
                        <span>{task.submissionDeadline}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-[#21a9ff] to-[#6dc6fe] h-2 rounded-full transition-all"
                          style={{ width: `${task.completedPercentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-slate-500 font-bold mt-1">{task.completedPercentage}%</span>
                    </td>
                    <td className="px-6 py-6">
                      <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(task.status)}`}>
                        {task.status}
                      </div>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEditTask(task)}
                          className="p-2.5 text-slate-400 hover:text-[#21a9ff] hover:bg-white rounded-xl transition-all hover:shadow-md border border-transparent hover:border-slate-100"
                          title="Edit Task"
                        >
                          <FiEdit3 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteTask(task._id)}
                          className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl transition-all hover:shadow-md border border-transparent hover:border-slate-100"
                          title="Delete Task"
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

      {/* CREATE TASK MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[540px] rounded-[2.5rem] shadow-[0_20px_70px_-10px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <div className="px-10 pt-10 pb-6 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Assign New Task</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-600">
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleCreateTask} className="px-10 pb-10 space-y-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Project Name</label>
                <select required value={newTask.projectName} onChange={(e) => setNewTask({...newTask, projectName: e.target.value})} className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-[#21a9ff] focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm cursor-pointer">
                  <option value="">Select Project</option>
                  <option value="E-Commerce Platform">E-Commerce Platform</option>
                  <option value="CRM Dashboard">CRM Dashboard</option>
                  <option value="Mobile App - iOS">Mobile App - iOS</option>
                  <option value="Analytics Engine">Analytics Engine</option>
                  <option value="Admin Portal">Admin Portal</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Task Title</label>
                <input type="text" required value={newTask.taskTitle} onChange={(e) => setNewTask({...newTask, taskTitle: e.target.value})} placeholder="e.g. Setup Payment Gateway" className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-[#21a9ff] focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Assign To (Name)</label>
                  <input type="text" required value={newTask.assignedTo} onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})} placeholder="e.g. Ali Khan" className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-[#21a9ff] focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Role</label>
                  <select required value={newTask.role} onChange={(e) => setNewTask({...newTask, role: e.target.value})} className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-[#21a9ff] focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm cursor-pointer">
                    <option value="Developer">Developer</option>
                    <option value="Designer">Designer</option>
                    <option value="Sales">Sales</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Description</label>
                <textarea value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})} placeholder="Task description and details..." className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-[#21a9ff] focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm h-20" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Priority</label>
                  <select value={newTask.priority} onChange={(e) => setNewTask({...newTask, priority: e.target.value})} className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-[#21a9ff] focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm cursor-pointer">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Est. Hours</label>
                  <input type="number" value={newTask.estimatedHours} onChange={(e) => setNewTask({...newTask, estimatedHours: parseInt(e.target.value) || 0})} placeholder="Hours" className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-[#21a9ff] focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Start Date</label>
                  <input type="date" value={newTask.timeline} onChange={(e) => setNewTask({...newTask, timeline: e.target.value})} className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-[#21a9ff] focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Submission Deadline</label>
                  <input type="date" required value={newTask.submissionDeadline} onChange={(e) => setNewTask({...newTask, submissionDeadline: e.target.value})} className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-[#21a9ff] focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Assigned By (Manager)</label>
                <input type="text" value={newTask.assignedBy} onChange={(e) => setNewTask({...newTask, assignedBy: e.target.value})} placeholder="e.g. Mam Mahnoor" className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-[#21a9ff] focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm" />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Additional Notes</label>
                <textarea value={newTask.notes} onChange={(e) => setNewTask({...newTask, notes: e.target.value})} placeholder="Any additional notes or requirements..." className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-[#21a9ff] focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm h-16" />
              </div>

              <button type="submit" className="w-full bg-[#21a9ff] hover:bg-[#6dc6fe] text-white font-black py-3 rounded-2xl transition-all shadow-xl shadow-blue-100 active:scale-[0.98]">
                Assign Task
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TASK MODAL */}
      {isEditModalOpen && editTaskData && (
        <div className="fixed inset-0 text-black z-[999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-[540px] rounded-[2.5rem] shadow-[0_20px_70px_-10px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <div className="px-10 pt-10 pb-6 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Update Task</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-600">
                <FiX size={24} />
              </button>
            </div>
            <form onSubmit={handleUpdateTask} className="px-10 pb-10 space-y-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Task Title</label>
                <input type="text" required value={editTaskData.taskTitle} onChange={(e) => setEditTaskData({...editTaskData, taskTitle: e.target.value})} className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-[#21a9ff] focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm" />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Assigned To</label>
                <input type="text" required value={editTaskData.assignedTo} onChange={(e) => setEditTaskData({...editTaskData, assignedTo: e.target.value})} className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-[#21a9ff] focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm" />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Completion Progress (%)</label>
                <input type="number" min="0" max="100" value={editTaskData.completedPercentage} onChange={(e) => setEditTaskData({...editTaskData, completedPercentage: parseInt(e.target.value) || 0})} className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-[#21a9ff] focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm" />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Status</label>
                <select value={editTaskData.status} onChange={(e) => setEditTaskData({...editTaskData, status: e.target.value})} className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-[#21a9ff] focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm cursor-pointer">
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Submission Deadline</label>
                <input type="date" required value={editTaskData.submissionDeadline} onChange={(e) => setEditTaskData({...editTaskData, submissionDeadline: e.target.value})} className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-[#21a9ff] focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm" />
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Notes</label>
                <textarea value={editTaskData.notes} onChange={(e) => setEditTaskData({...editTaskData, notes: e.target.value})} className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-[#21a9ff] focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm h-20" />
              </div>

              <button type="submit" className="w-full bg-[#21a9ff] hover:bg-[#6dc6fe] text-white font-black py-3 rounded-2xl transition-all shadow-xl shadow-blue-100 active:scale-[0.98]">
                Update Task
              </button>
            </form>
          </div>
        </div>
      )}

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default TaskDetails;
