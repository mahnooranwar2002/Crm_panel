// 'use client';

// import React, { useState, useEffect } from 'react';
// import { 
//   FiPlus, FiEdit2, FiTrash2, FiSearch, 
//   FiFilter, FiLayers, FiLoader, FiX, FiCheckCircle
// } from 'react-icons/fi';
// import { constructionTaskService } from '@/src/services/real-estate/constructionTaskService';
// import TaskModal from './modals/TaskModal';
// import toast, { Toaster } from 'react-hot-toast';

// interface Task {
//   _id?: string;
//   project_id?: string;
//   task_id?: string;
//   task_name: string;
//   description?: string;
//   phase: string;
//   assigned_to?: string;
//   priority: string;
//   status: string;
//   start_date: string;
//   end_date: string;
//   progress_percentage?: number;
//   estimated_hours?: number;
//   actual_hours?: number;
//   notes?: string;
// }

// export default function ConstructionTasksTable() {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false); 
//   const [editingTask, setEditingTask] = useState<Task | null>(null);
//   const [selectedTask, setSelectedTask] = useState<Task | null>(null); 
//   const [isSaving, setIsSaving] = useState(false);

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       handleSearch(searchTerm);
//     }, 300);
//     return () => clearTimeout(timer);
//   }, [searchTerm, tasks]);

//   const fetchTasks = async () => {
//     try {
//       setLoading(true);
//       const res = await constructionTaskService.getTasks();
//       const data = Array.isArray(res) ? res : res?.data || [];
//       setTasks(data);
//       setFilteredTasks(data);
//     } catch (err) {
//       console.error("Error fetching tasks:", err);
//       toast.error("Failed to fetch operational tasks");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = (query: string) => {
//     if (!query.trim()) {
//       setFilteredTasks(tasks);
//       return;
//     }
//     const filtered = tasks.filter((t) => 
//       t.task_name?.toLowerCase().includes(query.toLowerCase()) ||
//       t.task_id?.toLowerCase().includes(query.toLowerCase()) ||
//       t.phase?.toLowerCase().includes(query.toLowerCase())
//     );
//     setFilteredTasks(filtered);
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm('Are you sure you want to permanently delete this task record?')) return;
//     try {
//       await constructionTaskService.deleteTask(id);
//       toast.success('Task removed successfully');
//       fetchTasks();
//     } catch (err) {
//       toast.error('Failed to delete task');
//     }
//   };

//   const handleAddTask = () => {
//     setEditingTask(null);
//     setShowModal(true);
//   };

//   const handleEditTask = (task: Task) => {
//     setEditingTask(task);
//     setShowModal(true);
//   };

//   const handleSaveTask = async (task: Task) => {
//     try {
//       setIsSaving(true);
//       if (editingTask && editingTask._id) {
//         await constructionTaskService.updateTask(editingTask._id, task);
//         toast.success('Task operational details updated');
//       } else {
//         await constructionTaskService.createTask(task);
//         toast.success('New project task created');
//       }
//       setShowModal(false);
//       fetchTasks();
//     } catch (err) {
//       toast.error('Failed to save task details');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const getStatusClass = (status: string) => {
//     switch(status) {
//       case 'Completed': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
//       case 'On_Hold': return 'bg-red-50 text-red-700 border-red-100';
//       case 'In_Progress': return 'bg-amber-50 text-amber-700 border-amber-100';
//       case 'Not_Started': return 'bg-blue-50 text-blue-700 border-blue-100';
//       default: return 'bg-slate-50 text-slate-700 border-slate-100';
//     }
//   };

//   const getPriorityClass = (priority: string) => {
//     switch(priority) {
//       case 'Critical': 
//       case 'High': return 'text-rose-600 bg-rose-50';
//       case 'Medium': return 'text-amber-600 bg-amber-50';
//       default: return 'text-slate-500 bg-slate-50';
//     }
//   };

//   return (
//     <div className="w-full bg-[#fcfdfe] min-h-screen p-4 md:p-10 text-slate-900 font-sans relative overflow-x-hidden">
//       <Toaster />
      
//       <div className="max-w-7xl mx-auto">
//         {/* Header Section */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight text-slate-900">Construction Tasks</h1>
//             <p className="text-slate-500 font-medium mt-1">
//               Oversee engineering checklists, active assignments, and timeline sprints.
//               <span className="ml-2 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full text-xs font-bold">
//                 {filteredTasks.length} Logged
//               </span>
//             </p>
//           </div>
//           <button 
//             onClick={handleAddTask}
//             className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-95"
//           >
//             <FiPlus size={20} />
//             Add Task
//           </button>
//         </div>

//         {/* Filter Controls Searching */}
//         <div className="flex flex-col md:flex-row gap-4 mb-8">
//           <div className="flex-1 relative group">
//             <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
//             <input
//               type="text"
//               placeholder="Search by task name, phase, or ID..."
//               className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none shadow-sm font-medium"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <button className="flex items-center justify-center gap-2 px-6 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm">
//             <FiFilter /> Filters
//           </button>
//         </div>

//         {/* Core Table Grid layout */}
//         <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-100/50 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse">
//               <thead>
//                 <tr className="bg-slate-50/50 border-b border-slate-100">
//                   <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Task & Phase</th>
//                   <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Execution Timeline</th>
//                   <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Priority</th>
//                   <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Sprints Metrics</th>
//                   <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] text-right">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-50">
//                 {loading ? (
//                   <tr>
//                     <td colSpan={5} className="px-8 py-24 text-center">
//                       <div className="flex flex-col items-center">
//                         <FiLoader className="animate-spin w-10 h-10 text-blue-600 mb-4" size={32} />
//                         <p className="text-slate-400 font-bold tracking-tight">Syncing Checklist Tasks...</p>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : filteredTasks.length === 0 ? (
//                   <tr>
//                     <td colSpan={5} className="px-8 py-24 text-center">
//                       <div className="flex flex-col items-center opacity-40">
//                         <FiLayers size={60} className="text-slate-300 mb-4" />
//                         <p className="text-xl font-bold text-slate-900">No Operational Tasks Logged</p>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredTasks.map((task) => (
//                     <tr key={task._id} className="hover:bg-blue-50/40 transition-colors group">
//                       <td className="px-8 py-5">
//                         <div className="flex items-center gap-4">
//                           <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center font-bold text-blue-600 border border-white shadow-sm">
//                             <FiLayers size={18} />
//                           </div>
//                           <div>
//                             <p className="font-bold text-slate-900 text-base">{task.task_name}</p>
//                             <p className="text-xs font-bold text-slate-400 uppercase mt-0.5">{task.task_id || 'N/A'} • Phase: {task.phase}</p>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-6 py-5">
//                         <div className="flex flex-col text-xs font-semibold text-slate-600">
//                           <span>Start: {task.start_date ? new Date(task.start_date).toLocaleDateString() : 'N/A'}</span>
//                           <span className="text-slate-400 font-medium">Target: {task.end_date ? new Date(task.end_date).toLocaleDateString() : 'N/A'}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-5">
//                         <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getPriorityClass(task.priority)}`}>
//                           {task.priority || 'Medium'}
//                         </span>
//                       </td>
//                       <td className="px-6 py-5">
//                         <div className="flex flex-col gap-1.5 w-32">
//                           <span className={`w-fit px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${getStatusClass(task.status)}`}>
//                             {task.status?.replace('_', ' ')}
//                           </span>
//                           <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
//                             <div 
//                               className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" 
//                               style={{ width: `${task.progress_percentage || 0}%` }}
//                             />
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-8 py-5 text-right">
//                         <div className="flex justify-end items-center gap-2">
//                           <button 
//                             onClick={() => setSelectedTask(task)}
//                             className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm"
//                             title="View Specifics"
//                           >
//                             <FiCheckCircle size={18} />
//                           </button>
//                           <button 
//                             onClick={() => handleEditTask(task)}
//                             className="p-2.5 text-slate-400 hover:text-amber-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm"
//                           >
//                             <FiEdit2 size={18} />
//                           </button>
//                           <button 
//                             onClick={() => task._id && handleDelete(task._id)}
//                             className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm"
//                           >
//                             <FiTrash2 size={18} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* View Sidebar Sheet Context Drawer Panel */}
//       {selectedTask && (
//         <div className="fixed inset-0 z-[9999] overflow-hidden">
//           <div 
//             className="absolute inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity duration-300"
//             onClick={() => setSelectedTask(null)}
//           />

//           <div className="absolute top-0 right-0 h-full w-full sm:w-[450px] bg-white/95 backdrop-blur-md border-l border-slate-200/50 shadow-2xl flex flex-col text-sm text-slate-900 animate-in slide-in-from-right duration-200">
//             {/* Drawer Header */}
//             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
//               <h2 className="text-xl font-bold text-slate-900">Task Overview</h2>
//               <button onClick={() => setSelectedTask(null)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700">
//                 <FiX size={20} />
//               </button>
//             </div>

//             {/* Scrollable Content Fields View */}
//             <div className="flex-1 overflow-y-auto p-6 space-y-5">
//               <div>
//                 <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Task Name</span>
//                 <p className="font-bold text-slate-800 text-base">{selectedTask.task_name}</p>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Task ID</span>
//                   <p className="font-mono font-bold text-slate-700">{selectedTask.task_id || 'N/A'}</p>
//                 </div>
//                 <div>
//                   <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Phase</span>
//                   <p className="font-bold text-slate-800">{selectedTask.phase}</p>
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Priority</span>
//                   <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold ${getPriorityClass(selectedTask.priority)}`}>
//                     {selectedTask.priority || 'Medium'}
//                   </span>
//                 </div>
//                 <div>
//                   <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Assigned Personnel</span>
//                   <p className="font-semibold text-slate-800">{selectedTask.assigned_to || 'Unassigned'}</p>
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Start Date</span>
//                   <p className="font-semibold text-slate-800">{selectedTask.start_date ? new Date(selectedTask.start_date).toLocaleDateString() : 'N/A'}</p>
//                 </div>
//                 <div>
//                   <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">End Target</span>
//                   <p className="font-semibold text-slate-800">{selectedTask.end_date ? new Date(selectedTask.end_date).toLocaleDateString() : 'N/A'}</p>
//                 </div>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Estimated Clock Hours</span>
//                   <p className="font-bold text-slate-800">{selectedTask.estimated_hours || 0} hrs</p>
//                 </div>
//                 <div>
//                   <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Logged Actual Hours</span>
//                   <p className="font-bold text-slate-800">{selectedTask.actual_hours || 0} hrs</p>
//                 </div>
//               </div>
//               <div>
//                 <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Progress Metric</span>
//                 <p className="font-bold text-slate-800 mb-1">{selectedTask.progress_percentage || 0}%</p>
//                 <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
//                   <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${selectedTask.progress_percentage || 0}%` }} />
//                 </div>
//               </div>
//               <div>
//                 <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Current Status</span>
//                 <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusClass(selectedTask.status)}`}>
//                   {selectedTask.status?.replace('_', ' ')}
//                 </span>
//               </div>
//               {selectedTask.description && (
//                 <div>
//                   <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Task Scope Details</span>
//                   <p className="text-slate-600 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
//                     {selectedTask.description}
//                   </p>
//                 </div>
//               )}
//               {selectedTask.notes && (
//                 <div>
//                   <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Engineer Operational Notes</span>
//                   <p className="text-slate-600 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
//                     {selectedTask.notes}
//                   </p>
//                 </div>
//               )}
//             </div>

//             <div className="p-4 border-t border-slate-100 bg-white/50">
//               <button onClick={() => setSelectedTask(null)} className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors">
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Task Modal Container Connector */}
//       <TaskModal
//         isOpen={showModal}
//         onClose={() => { setShowModal(false); setEditingTask(null); }}
//         task={editingTask || undefined}
//         onSave={handleSaveTask}
//         loading={isSaving}
//       />
//     </div>
//   );
// }

'use client';

import React, { useState, useEffect } from 'react';
import { 
  FiPlus, FiEdit2, FiTrash2, FiSearch, 
  FiFilter, FiLayers, FiLoader, FiX, FiCheckCircle
} from 'react-icons/fi';
import { constructionTaskService } from '@/src/services/real-estate/constructionTaskService';
import TaskModal from './modals/TaskModal';
import toast, { Toaster } from 'react-hot-toast';

interface Task {
  _id?: string;
  project_id?: string;
  task_id?: string;
  task_name: string;
  description?: string;
  phase: string;
  assigned_to?: string;
  priority: string;
  status: string;
  start_date: string;
  end_date: string;
  progress_percentage?: number;
  estimated_hours?: number;
  actual_hours?: number;
  notes?: string;
}

export default function ConstructionTasksTable() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); 
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null); 
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, tasks]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await constructionTaskService.getTasks() as any;
      const data = Array.isArray(res) ? res : res?.data || [];
      setTasks(data);
      setFilteredTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      toast.error("Failed to fetch operational tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredTasks(tasks);
      return;
    }
    const filtered = tasks.filter((t) => 
      t.task_name?.toLowerCase().includes(query.toLowerCase()) ||
      t.task_id?.toLowerCase().includes(query.toLowerCase()) ||
      t.phase?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTasks(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this task record?')) return;
    try {
      await constructionTaskService.deleteTask(id);
      toast.success('Task removed successfully');
      fetchTasks();
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleSaveTask = async (task: Task) => {
    try {
      setIsSaving(true);
      if (editingTask && editingTask._id) {
        await constructionTaskService.updateTask(editingTask._id, task);
        toast.success('Task operational details updated');
      } else {
        await constructionTaskService.createTask(task);
        toast.success('New project task created');
      }
      setShowModal(false);
      fetchTasks();
    } catch (err) {
      toast.error('Failed to save task details');
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'On_Hold': return 'bg-red-50 text-red-700 border-red-100';
      case 'In_Progress': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Not_Started': return 'bg-blue-50 text-blue-700 border-blue-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const getPriorityClass = (priority: string) => {
    switch(priority) {
      case 'Critical': 
      case 'High': return 'text-rose-600 bg-rose-50';
      case 'Medium': return 'text-amber-600 bg-amber-50';
      default: return 'text-slate-500 bg-slate-50';
    }
  };

  return (
    <div className="w-full bg-[#fcfdfe] min-h-screen p-4 md:p-10 text-slate-900 font-sans relative overflow-x-hidden">
      <Toaster />
      
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Construction Tasks</h1>
            <p className="text-slate-500 font-medium mt-1">
              Oversee engineering checklists, active assignments, and timeline sprints.
              <span className="ml-2 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full text-xs font-bold">
                {filteredTasks.length} Logged
              </span>
            </p>
          </div>
          <button 
            onClick={handleAddTask}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            <FiPlus size={20} />
            Add Task
          </button>
        </div>

        {/* Filter Controls Searching */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by task name, phase, or ID..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none shadow-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm">
            <FiFilter /> Filters
          </button>
        </div>

        {/* Core Table Grid layout */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-100/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Task & Phase</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Execution Timeline</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Priority</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Sprints Metrics</th>
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-24 text-center">
                      <div className="flex flex-col items-center">
                        <FiLoader className="animate-spin w-10 h-10 text-blue-600 mb-4" size={32} />
                        <p className="text-slate-400 font-bold tracking-tight">Syncing Checklist Tasks...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-24 text-center">
                      <div className="flex flex-col items-center opacity-40">
                        <FiLayers size={60} className="text-slate-300 mb-4" />
                        <p className="text-xl font-bold text-slate-900">No Operational Tasks Logged</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => (
                    <tr key={task._id} className="hover:bg-blue-50/40 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center font-bold text-blue-600 border border-white shadow-sm">
                            <FiLayers size={18} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-base">{task.task_name}</p>
                            <p className="text-xs font-bold text-slate-400 uppercase mt-0.5">{task.task_id || 'N/A'} • Phase: {task.phase}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col text-xs font-semibold text-slate-600">
                          <span>Start: {task.start_date ? new Date(task.start_date).toLocaleDateString() : 'N/A'}</span>
                          <span className="text-slate-400 font-medium">Target: {task.end_date ? new Date(task.end_date).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getPriorityClass(task.priority)}`}>
                          {task.priority || 'Medium'}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1.5 w-32">
                          <span className={`w-fit px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${getStatusClass(task.status)}`}>
                            {task.status?.replace('_', ' ')}
                          </span>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" 
                              style={{ width: `${task.progress_percentage || 0}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <button 
                            onClick={() => setSelectedTask(task)}
                            className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm"
                            title="View Specifics"
                          >
                            <FiCheckCircle size={18} />
                          </button>
                          <button 
                            onClick={() => handleEditTask(task)}
                            className="p-2.5 text-slate-400 hover:text-amber-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button 
                            onClick={() => task._id && handleDelete(task._id)}
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

      {/* View Sidebar Sheet Context Drawer Panel */}
      {selectedTask && (
        <div className="fixed inset-0 z-[9999] overflow-hidden">
          <div 
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setSelectedTask(null)}
          />

          <div className="absolute top-0 right-0 h-full w-full sm:w-[450px] bg-white/95 backdrop-blur-md border-l border-slate-200/50 shadow-2xl flex flex-col text-sm text-slate-900 animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
              <h2 className="text-xl font-bold text-slate-900">Task Overview</h2>
              <button onClick={() => setSelectedTask(null)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700">
                <FiX size={20} />
              </button>
            </div>

            {/* Scrollable Content Fields View */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Task Name</span>
                <p className="font-bold text-slate-800 text-base">{selectedTask.task_name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Task ID</span>
                  <p className="font-mono font-bold text-slate-700">{selectedTask.task_id || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Phase</span>
                  <p className="font-bold text-slate-800">{selectedTask.phase}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Priority</span>
                  <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold ${getPriorityClass(selectedTask.priority)}`}>
                    {selectedTask.priority || 'Medium'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Assigned Personnel</span>
                  <p className="font-semibold text-slate-800">{selectedTask.assigned_to || 'Unassigned'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Start Date</span>
                  <p className="font-semibold text-slate-800">{selectedTask.start_date ? new Date(selectedTask.start_date).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">End Target</span>
                  <p className="font-semibold text-slate-800">{selectedTask.end_date ? new Date(selectedTask.end_date).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Estimated Clock Hours</span>
                  <p className="font-bold text-slate-800">{selectedTask.estimated_hours || 0} hrs</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Logged Actual Hours</span>
                  <p className="font-bold text-slate-800">{selectedTask.actual_hours || 0} hrs</p>
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Progress Metric</span>
                <p className="font-bold text-slate-800 mb-1">{selectedTask.progress_percentage || 0}%</p>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${selectedTask.progress_percentage || 0}%` }} />
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Current Status</span>
                <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusClass(selectedTask.status)}`}>
                  {selectedTask.status?.replace('_', ' ')}
                </span>
              </div>
              {selectedTask.description && (
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Task Scope Details</span>
                  <p className="text-slate-600 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {selectedTask.description}
                  </p>
                </div>
              )}
              {selectedTask.notes && (
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">Engineer Operational Notes</span>
                  <p className="text-slate-600 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {selectedTask.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-white/50">
              <button onClick={() => setSelectedTask(null)} className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Modal Container Connector */}
      <TaskModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingTask(null); }}
        task={editingTask || undefined}
        onSave={handleSaveTask}
        loading={isSaving}
      />
    </div>
  );
}