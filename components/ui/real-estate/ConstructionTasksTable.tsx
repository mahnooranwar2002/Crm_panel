// 'use client';
// import React, { useState, useEffect } from 'react';
// import { 
//   FiEye, FiEdit2, FiTrash2, FiPlus, FiSearch, FiLoader, FiX
// } from 'react-icons/fi';
// import { constructionTaskService } from '@/src/services/real-estate/constructionTaskService';
// import toast, { Toaster } from 'react-hot-toast';

// interface Task {
//   _id?: string;
//   task_id: string;
//   task_name: string;
//   phase: string;
//   status: string;
//   priority: string;
//   progress_percentage: number;
//   start_date: string;
//   end_date: string;
// }

// const ConstructionTasksTable = () => {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showForm, setShowForm] = useState(false);
//   const [editingTask, setEditingTask] = useState<Task | null>(null);
//   const [formData, setFormData] = useState({
//     task_id: '',
//     task_name: '',
//     phase: '',
//     status: 'Not_Started',
//     priority: 'Medium',
//     progress_percentage: 0,
//     start_date: '',
//     end_date: '',
//     estimated_hours: 0,
//     actual_hours: 0,
//   });

//   const PRIMARY_COLOR = "#21a9ff";

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       fetchTasks(searchTerm);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   const fetchTasks = async (search = '') => {
//     try {
//       setLoading(true);
//       const res = await constructionTaskService.getTasks();
//       let data = Array.isArray(res) ? res : res?.data || [];
      
//       if (search) {
//         data = data.filter((t: Task) => 
//           t.task_name.toLowerCase().includes(search.toLowerCase()) ||
//           t.task_id.toLowerCase().includes(search.toLowerCase())
//         );
//       }
      
//       setTasks(data);
//     } catch (err) {
//       console.error("Error fetching tasks:", err);
//       toast.error("Failed to fetch tasks");
//       setTasks([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm('Are you sure?')) return;
//     try {
//       await constructionTaskService.deleteTask(id);
//       toast.success('Task deleted successfully');
//       fetchTasks();
//     } catch (err) {
//       toast.error('Failed to delete task');
//     }
//   };

//   const handleAddTask = () => {
//     setEditingTask(null);
//     setFormData({
//       task_id: '',
//       task_name: '',
//       phase: '',
//       status: 'Not_Started',
//       priority: 'Medium',
//       progress_percentage: 0,
//       start_date: '',
//       end_date: '',
//       estimated_hours: 0,
//       actual_hours: 0,
//     });
//     setShowForm(true);
//   };

//   const handleEditTask = (task: Task) => {
//     setEditingTask(task);
//     setFormData(task as any);
//     setShowForm(true);
//   };

//   const handleSaveTask = async () => {
//     if (!formData.task_name) {
//       toast.error('Please fill all required fields');
//       return;
//     }

//     try {
//       if (editingTask) {
//         await constructionTaskService.updateTask(editingTask._id!, formData);
//         toast.success('Task updated successfully');
//       } else {
//         await constructionTaskService.createTask(formData);
//         toast.success('Task created successfully');
//       }
//       setShowForm(false);
//       fetchTasks();
//     } catch (err) {
//       toast.error('Failed to save task');
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch(status) {
//       case 'In_Progress': return '#8b5cf6';
//       case 'Completed': return '#4ade80';
//       case 'Not_Started': return '#3b82f6';
//       case 'On_Hold': return '#f59e0b';
//       case 'Blocked': return '#ef4444';
//       default: return '#6b7280';
//     }
//   };

//   const getPriorityColor = (priority: string) => {
//     switch(priority) {
//       case 'Critical': return '#ef4444';
//       case 'High': return '#f59e0b';
//       case 'Medium': return '#3b82f6';
//       case 'Low': return '#10b981';
//       default: return '#6b7280';
//     }
//   };

//   return (
//     <div style={{ padding: '20px', fontFamily: 'Inter, sans-serif' }}>
//       <Toaster />
      
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//         <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>Construction Tasks</h2>
//         <button 
//           onClick={handleAddTask}
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
//           <FiPlus size={18} /> New Task
//         </button>
//       </div>

//       <div style={{ marginBottom: '20px', position: 'relative' }}>
//         <FiSearch style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }} size={18} />
//         <input
//           type="text"
//           placeholder="Search by task name or ID..."
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
//                 {editingTask ? 'Edit Task' : 'Add New Task'}
//               </h3>
//               <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
//                 <FiX size={24} />
//               </button>
//             </div>

//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
//               <div style={{ gridColumn: '1 / -1' }}>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Task Name</label>
//                 <input
//                   type="text"
//                   placeholder="Task name"
//                   value={formData.task_name}
//                   onChange={(e) => setFormData({ ...formData, task_name: e.target.value })}
//                   style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '14px' }}
//                 />
//               </div>
//               <div>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Task ID</label>
//                 <input
//                   type="text"
//                   placeholder="TASK-001"
//                   value={formData.task_id}
//                   onChange={(e) => setFormData({ ...formData, task_id: e.target.value })}
//                   style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '14px' }}
//                 />
//               </div>
//               <div>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Phase</label>
//                 <input
//                   type="text"
//                   placeholder="e.g., Foundation"
//                   value={formData.phase}
//                   onChange={(e) => setFormData({ ...formData, phase: e.target.value })}
//                   style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '14px' }}
//                 />
//               </div>
//               <div>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Status</label>
//                 <select
//                   value={formData.status}
//                   onChange={(e) => setFormData({ ...formData, status: e.target.value })}
//                   style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '14px' }}
//                 >
//                   <option>Not_Started</option>
//                   <option>In_Progress</option>
//                   <option>On_Hold</option>
//                   <option>Completed</option>
//                   <option>Blocked</option>
//                 </select>
//               </div>
//               <div>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Priority</label>
//                 <select
//                   value={formData.priority}
//                   onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
//                   style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '14px' }}
//                 >
//                   <option>Low</option>
//                   <option>Medium</option>
//                   <option>High</option>
//                   <option>Critical</option>
//                 </select>
//               </div>
//               <div>
//                 <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', fontSize: '14px' }}>Progress (%)</label>
//                 <input
//                   type="number"
//                   min="0"
//                   max="100"
//                   value={formData.progress_percentage}
//                   onChange={(e) => setFormData({ ...formData, progress_percentage: parseInt(e.target.value) })}
//                   style={{ width: '100%', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '14px' }}
//                 />
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
//                 onClick={handleSaveTask}
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
//                 Save Task
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {loading ? (
//         <div style={{ textAlign: 'center', padding: '40px' }}>
//           <FiLoader style={{ animation: 'spin 1s linear infinite' }} size={32} color={PRIMARY_COLOR} />
//         </div>
//       ) : tasks.length === 0 ? (
//         <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
//           No tasks found
//         </div>
//       ) : (
//         <div style={{ overflowX: 'auto' }}>
//           <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//             <thead>
//               <tr style={{ borderBottom: '2px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
//                 <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Task ID</th>
//                 <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Task Name</th>
//                 <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Phase</th>
//                 <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Status</th>
//                 <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Priority</th>
//                 <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Progress</th>
//                 <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {tasks.map((task) => (
//                 <tr key={task._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
//                   <td style={{ padding: '12px' }}>
//                     <span style={{ fontWeight: '600', color: PRIMARY_COLOR }}>{task.task_id}</span>
//                   </td>
//                   <td style={{ padding: '12px' }}>{task.task_name}</td>
//                   <td style={{ padding: '12px' }}>{task.phase}</td>
//                   <td style={{ padding: '12px' }}>
//                     <span style={{
//                       padding: '4px 12px',
//                       backgroundColor: getStatusColor(task.status),
//                       color: 'white',
//                       borderRadius: '4px',
//                       fontSize: '12px',
//                       fontWeight: '600'
//                     }}>
//                       {task.status}
//                     </span>
//                   </td>
//                   <td style={{ padding: '12px' }}>
//                     <span style={{
//                       padding: '4px 12px',
//                       backgroundColor: getPriorityColor(task.priority),
//                       color: 'white',
//                       borderRadius: '4px',
//                       fontSize: '12px',
//                       fontWeight: '600'
//                     }}>
//                       {task.priority}
//                     </span>
//                   </td>
//                   <td style={{ padding: '12px' }}>
//                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                       <div style={{
//                         width: '80px',
//                         height: '6px',
//                         backgroundColor: '#e5e7eb',
//                         borderRadius: '3px',
//                         overflow: 'hidden'
//                       }}>
//                         <div style={{
//                           width: `${task.progress_percentage}%`,
//                           height: '100%',
//                           backgroundColor: PRIMARY_COLOR,
//                           transition: 'width 0.3s'
//                         }} />
//                       </div>
//                       <span style={{ fontSize: '12px', fontWeight: '600' }}>{task.progress_percentage}%</span>
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
//                         onClick={() => handleEditTask(task)}
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
//                       <button onClick={() => task._id && handleDelete(task._id)} style={{
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

// export default ConstructionTasksTable;

'use client';
import React, { useState, useEffect } from 'react';
import { 
  FiEye, FiEdit2, FiTrash2, FiPlus, FiSearch, FiLoader, 
  FiX, FiCheckCircle, FiClock, FiAlertCircle, FiLayers 
} from 'react-icons/fi';
import { constructionTaskService } from '@/src/services/real-estate/constructionTaskService';
import toast, { Toaster } from 'react-hot-toast';

interface Task {
  _id?: string;
  task_id: string;
  task_name: string;
  phase: string;
  status: string;
  priority: string;
  progress_percentage: number;
  start_date: string;
  end_date: string;
}

const ConstructionTasksTable = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const [formData, setFormData] = useState({
    task_id: '',
    task_name: '',
    phase: '',
    status: 'Not_Started',
    priority: 'Medium',
    progress_percentage: 0,
    start_date: '',
    end_date: '',
    estimated_hours: 0,
    actual_hours: 0,
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await constructionTaskService.getTasks();
      setTasks(data);
      setFilteredTasks(data);
    } catch (err) {
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = tasks.filter((t) => 
      t.task_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.task_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTasks(filtered);
  }, [searchTerm, tasks]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await constructionTaskService.deleteTask(id);
      toast.success('Task deleted successfully');
      fetchTasks();
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const handleSaveTask = async () => {
    if (!formData.task_name || !formData.task_id) {
      toast.error('Task Name and ID are required');
      return;
    }
    try {
      if (editingTask) {
        await constructionTaskService.updateTask(editingTask._id!, formData);
        toast.success('Task updated');
      } else {
        await constructionTaskService.createTask(formData);
        toast.success('Task created');
      }
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: any = {
      'In_Progress': 'bg-indigo-50 text-indigo-600 border-indigo-100',
      'Completed': 'bg-emerald-50 text-emerald-600 border-emerald-100',
      'Not_Started': 'bg-slate-50 text-slate-500 border-slate-100',
      'On_Hold': 'bg-amber-50 text-amber-600 border-amber-100',
      'Blocked': 'bg-rose-50 text-rose-600 border-rose-100',
    };
    return styles[status] || 'bg-slate-50 text-slate-500';
  };

  return (
    <div className="w-full bg-[#fcfdfe] min-h-screen p-4 md:p-10 text-slate-900 font-sans">
      <Toaster />
      
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Construction Tasks</h1>
            <p className="text-slate-500 font-medium mt-1">Manage project phases, task assignments, and real-time progress.</p>
          </div>
          <button 
            onClick={() => { setEditingTask(null); setFormData({} as any); setShowForm(true); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            <FiPlus size={20} /> New Task
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            placeholder="Search tasks by name, ID or phase..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all shadow-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-100/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Task Details</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Phase</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Status & Priority</th>
                  <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Progress</th>
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
                ) : filteredTasks.map((task) => (
                  <tr key={task._id} className="hover:bg-blue-50/40 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                          <FiCheckCircle size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{task.task_name}</p>
                          <p className="text-[10px] font-black text-blue-500 uppercase tracking-wider">{task.task_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-slate-600 italic">
                      <span className="flex items-center gap-2"><FiLayers className="text-slate-400" /> {task.phase}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-2">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border self-start ${getStatusBadge(task.status)}`}>
                          {task.status.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          <FiAlertCircle /> {task.priority} Priority
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3 min-w-[120px]">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                          <div 
                            className="h-full bg-blue-600 rounded-full transition-all duration-500" 
                            style={{ width: `${task.progress_percentage}%` }}
                          />
                        </div>
                        <span className="text-xs font-black text-slate-900">{task.progress_percentage}%</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => { setEditingTask(task); setFormData(task as any); setShowForm(true); }} className="p-2.5 text-slate-400 hover:text-amber-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm">
                          <FiEdit2 size={16} />
                        </button>
                        <button onClick={() => task._id && handleDelete(task._id)} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm">
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

      {/* Glassmorphism Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white/90 backdrop-blur-xl border border-white w-full max-w-xl rounded-[2.5rem] shadow-2xl p-8 md:p-10">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-slate-900">{editingTask ? 'Update Task' : 'Create New Task'}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <FiX size={24} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-5 mb-8">
              <div className="col-span-2">
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Task Name</label>
                <input 
                  className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 outline-none font-bold"
                  value={formData.task_name}
                  onChange={(e) => setFormData({...formData, task_name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Task ID</label>
                <input 
                  className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 outline-none font-bold"
                  value={formData.task_id}
                  onChange={(e) => setFormData({...formData, task_id: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Phase</label>
                <input 
                  className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 outline-none font-bold"
                  value={formData.phase}
                  onChange={(e) => setFormData({...formData, phase: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Status</label>
                <select 
                  className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none font-bold appearance-none"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="Not_Started">Not Started</option>
                  <option value="In_Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="On_Hold">On Hold</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Progress (%)</label>
                <input 
                  type="number"
                  className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none font-bold"
                  value={formData.progress_percentage}
                  onChange={(e) => setFormData({...formData, progress_percentage: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <button 
              onClick={handleSaveTask}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-200"
            >
              Confirm Task Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConstructionTasksTable;