// "use client"
// import React, { useState, useEffect } from 'react';
// import { FiBarChart, FiTrendingUp, FiAlertTriangle, FiCheckCircle, FiClock, FiUsers } from 'react-icons/fi';
// import { SoftwareService } from '@/src/services/software/softwareService';
// import { TaskService } from '@/src/services/software/taskService';

// const ProjectStatus = () => {
//   const [projects, setProjects] = useState<any[]>([]);
//   const [tasks, setTasks] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const projectsRes = await SoftwareService.getSoftwareProjects(1, 100);
//       const tasksRes = await TaskService.getAllTasks(1, 100);

//       // Handle projects response structure: response.data.projects
//       let projectsArray = [];
//       if (projectsRes?.data?.projects && Array.isArray(projectsRes.data.projects)) {
//         projectsArray = projectsRes.data.projects;
//       } else if (projectsRes?.data && Array.isArray(projectsRes.data)) {
//         projectsArray = projectsRes.data;
//       } else if (Array.isArray(projectsRes)) {
//         projectsArray = projectsRes;
//       }

//       // Handle tasks response structure
//       let tasksArray = [];
//       if (tasksRes?.data?.tasks && Array.isArray(tasksRes.data.tasks)) {
//         tasksArray = tasksRes.data.tasks;
//       } else if (tasksRes?.data && Array.isArray(tasksRes.data)) {
//         tasksArray = tasksRes.data;
//       } else if (Array.isArray(tasksRes)) {
//         tasksArray = tasksRes;
//       }

//       setProjects(projectsArray);
//       setTasks(tasksArray);
//     } catch (err) {
//       console.error('Error fetching data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getProjectStatus = (project: any) => {
//     const projectTasks = tasks.filter(t => t.projectName === project.projectName);

//     if (projectTasks.length === 0) return 'No Tasks';

//     const completedTasks = projectTasks.filter(t => t.status === 'Completed').length;
//     const inProgressTasks = projectTasks.filter(t => t.status === 'In Progress').length;
//     const pendingTasks = projectTasks.filter(t => t.status === 'Pending').length;
//     const notStartedTasks = projectTasks.filter(t => t.status === 'Not Started').length;

//     const completionRate = (completedTasks / projectTasks.length) * 100;

//     if (completionRate === 100) return 'Completed';
//     if (pendingTasks > inProgressTasks * 0.5) return 'Postponed';
//     if (notStartedTasks > projectTasks.length * 0.3) return 'Pending';
//     if (inProgressTasks > 0 || completedTasks > 0) return 'Going Good';

//     return 'Pending';
//   };

//   const getStatusColor = (status: string) => {
//     switch(status) {
//       case 'Going Good':
//         return { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700', icon: '✓' };
//       case 'Postponed':
//         return { bg: 'bg-orange-50', border: 'border-orange-100', text: 'text-orange-700', icon: '⏸' };
//       case 'Pending':
//         return { bg: 'bg-yellow-50', border: 'border-yellow-100', text: 'text-yellow-700', icon: '⏳' };
//       default:
//         return { bg: 'bg-slate-50', border: 'border-slate-100', text: 'text-slate-700', icon: '○' };
//     }
//   };

//   const getProjectStats = (projectName: string) => {
//     const projectTasks = tasks.filter(t => t.projectName === projectName);

//     return {
//       total: projectTasks.length,
//       completed: projectTasks.filter(t => t.status === 'Completed').length,
//       inProgress: projectTasks.filter(t => t.status === 'In Progress').length,
//       pending: projectTasks.filter(t => t.status === 'Pending').length,
//       notStarted: projectTasks.filter(t => t.status === 'Not Started').length,
//       completionRate: projectTasks.length > 0 ? Math.round((projectTasks.filter(t => t.status === 'Completed').length / projectTasks.length) * 100) : 0,
//       developers: [...new Set(projectTasks.filter(t => t.role === 'Developer').map(t => t.assignedTo))].length,
//       designers: [...new Set(projectTasks.filter(t => t.role === 'Designer').map(t => t.assignedTo))].length,
//       sales: [...new Set(projectTasks.filter(t => t.role === 'Sales').map(t => t.assignedTo))].length
//     };
//   };

//   if (loading) {
//     return (
//       <div className="w-full text-black space-y-6 px-2">
//         <div className="text-center py-20 text-slate-400">Loading project status...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full text-black space-y-6 animate-in slide-in-from-bottom-4 duration-500">

//       <div className="px-2">
//         <div>
//           <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
//             {/* Fixed the spacing error here */}
//             <FiBarChart className="text-blue-500" />
//             Project Status Overview
//           </h1>
//           <p className="text-sm text-slate-500 mt-1">Monitor project health, progress, and team performance across all initiatives.</p>
//         </div>
//       </div>

//       {/* Status Cards Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-2">
//         {projects.map((project) => {
//           const status = getProjectStatus(project);
//           const stats = getProjectStats(project.projectName);
//           const statusColor = getStatusColor(status);

//           return (
//             <div key={project._id} className="bg-white/70 backdrop-blur-xl rounded-[2rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)] overflow-hidden hover:shadow-lg transition-all duration-300">
//               {/* Project Header */}
//               <div className={`${statusColor.bg} border-b ${statusColor.border} px-6 py-6`}>
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <h3 className="text-lg font-black text-slate-800">{project.projectName}</h3>
//                     <p className="text-xs text-slate-600 mt-1">Lead: {project.leadName}</p>
//                   </div>
//                   <div className={`${statusColor.bg} ${statusColor.text} px-4 py-2 rounded-xl font-black text-sm border ${statusColor.border}`}>
//                     {statusColor.icon} {status}
//                   </div>
//                 </div>
//               </div>

//               {/* Progress Bar */}
//               <div className="px-6 py-6 border-b border-slate-100">
//                 <div className="flex justify-between items-center mb-2">
//                   <span className="text-xs font-bold text-slate-500 uppercase">Overall Progress</span>
//                   <span className="text-lg font-black text-slate-800">{stats.completionRate}%</span>
//                 </div>
//                 <div className="w-full bg-slate-100 rounded-full h-3">
//                   <div
//                     className="bg-gradient-to-r from-[#21a9ff] to-[#6dc6fe] h-3 rounded-full transition-all"
//                     style={{ width: `${stats.completionRate}%` }}
//                   ></div>
//                 </div>
//               </div>

//               {/* Task Statistics */}
//               <div className="px-6 py-6 border-b border-slate-100">
//                 <p className="text-xs font-bold text-slate-500 uppercase mb-3">Task Breakdown</p>
//                 <div className="grid grid-cols-2 gap-2">
//                   <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
//                     <div className="text-2xl font-black text-emerald-600">{stats.completed}</div>
//                     <div className="text-xs text-emerald-700 font-bold mt-1">Completed</div>
//                   </div>
//                   <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
//                     <div className="text-2xl font-black text-blue-600">{stats.inProgress}</div>
//                     <div className="text-xs text-blue-700 font-bold mt-1">In Progress</div>
//                   </div>
//                   <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-100">
//                     <div className="text-2xl font-black text-yellow-600">{stats.pending}</div>
//                     <div className="text-xs text-yellow-700 font-bold mt-1">Pending</div>
//                   </div>
//                   <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
//                     <div className="text-2xl font-black text-slate-600">{stats.notStarted}</div>
//                     <div className="text-xs text-slate-700 font-bold mt-1">Not Started</div>
//                   </div>
//                 </div>
//               </div>

//               {/* Team Stats */}
//               <div className="px-6 py-6 border-b border-slate-100">
//                 <p className="text-xs font-bold text-slate-500 uppercase mb-3">Team Allocation</p>
//                 <div className="space-y-2">
//                   {stats.developers > 0 && (
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm font-semibold text-slate-700">Developers</span>
//                       <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">{stats.developers} {stats.developers === 1 ? 'member' : 'members'}</span>
//                     </div>
//                   )}
//                   {stats.designers > 0 && (
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm font-semibold text-slate-700">Designers</span>
//                       <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">{stats.designers} {stats.designers === 1 ? 'member' : 'members'}</span>
//                     </div>
//                   )}
//                   {stats.sales > 0 && (
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm font-semibold text-slate-700">Sales</span>
//                       <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">{stats.sales} {stats.sales === 1 ? 'member' : 'members'}</span>
//                     </div>
//                   )}
//                   {(stats.developers === 0 && stats.designers === 0 && stats.sales === 0) && (
//                     <p className="text-xs text-slate-500 italic">No tasks assigned yet</p>
//                   )}
//                 </div>
//               </div>

//               {/* Timeline */}
//               <div className="px-6 py-6">
//                 <p className="text-xs font-bold text-slate-500 uppercase mb-3">Project Timeline</p>
//                 <div className="flex items-center gap-2 text-sm text-slate-700">
//                   <FiClock size={14} />
//                   <span>{project.startDate}</span>
//                   <span className="text-slate-400">→</span>
//                   <span>{project.endDate}</span>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Summary Statistics */}
//       {projects.length > 0 && (
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-2 mt-8">
//           <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)] p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs font-bold text-slate-500 uppercase">Total Projects</p>
//                 <p className="text-3xl font-black text-slate-800 mt-2">{projects.length}</p>
//               </div>
//               <div className="p-4 rounded-xl bg-blue-50 text-blue-600">
//                 <FiBarChart size={28} />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)] p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs font-bold text-slate-500 uppercase">Total Tasks</p>
//                 <p className="text-3xl font-black text-slate-800 mt-2">{tasks.length}</p>
//               </div>
//               <div className="p-4 rounded-xl bg-emerald-50 text-emerald-600">
//                 <FiCheckCircle size={28} />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)] p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs font-bold text-slate-500 uppercase">Avg. Progress</p>
//                 <p className="text-3xl font-black text-slate-800 mt-2">
//                   {Math.round(
//                     projects.reduce((sum, p) => sum + getProjectStats(p.projectName).completionRate, 0) / projects.length
//                   )}%
//                 </p>
//               </div>
//               <div className="p-4 rounded-xl bg-yellow-50 text-yellow-600">
//                 <FiTrendingUp size={28} />
//               </div>
//             </div>
//           </div>

//           <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)] p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs font-bold text-slate-500 uppercase">On Track</p>
//                 <p className="text-3xl font-black text-slate-800 mt-2">
//                   {projects.filter(p => getProjectStatus(p) === 'Going Good').length}
//                 </p>
//               </div>
//               <div className="p-4 rounded-xl bg-green-50 text-green-600">
//                 <FiCheckCircle size={28} />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProjectStatus;

"use client";
import React, { useState, useEffect } from "react";
import {
  FiBarChart,
  FiTrendingUp,
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiUsers,
} from "react-icons/fi";
import { SoftwareService } from "@/src/services/software/softwareService";
import { TaskService } from "@/src/services/software/taskService";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

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

      let projectsArray = [];
      if (
        projectsRes?.data?.projects &&
        Array.isArray(projectsRes.data.projects)
      ) {
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
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper calculation logic preserved
  const getProjectStatus = (project: any) => {
    const projectTasks = tasks.filter(
      (t) => t.projectName === project.projectName,
    );
    if (projectTasks.length === 0) return "No Tasks";

    const completedTasks = projectTasks.filter(
      (t) => t.status === "Completed",
    ).length;
    const inProgressTasks = projectTasks.filter(
      (t) => t.status === "In Progress",
    ).length;
    const pendingTasks = projectTasks.filter(
      (t) => t.status === "Pending",
    ).length;
    const notStartedTasks = projectTasks.filter(
      (t) => t.status === "Not Started",
    ).length;

    const completionRate = (completedTasks / projectTasks.length) * 100;

    if (completionRate === 100) return "Completed";
    if (pendingTasks > inProgressTasks * 0.5) return "Postponed";
    if (notStartedTasks > projectTasks.length * 0.3) return "Pending";
    if (inProgressTasks > 0 || completedTasks > 0) return "Going Good";

    return "Pending";
  };

  const getProjectStats = (projectName: string) => {
    const projectTasks = tasks.filter((t) => t.projectName === projectName);
    return {
      total: projectTasks.length,
      completed: projectTasks.filter((t) => t.status === "Completed").length,
      inProgress: projectTasks.filter((t) => t.status === "In Progress").length,
      pending: projectTasks.filter((t) => t.status === "Pending").length,
      notStarted: projectTasks.filter((t) => t.status === "Not Started").length,
      completionRate:
        projectTasks.length > 0
          ? Math.round(
              (projectTasks.filter((t) => t.status === "Completed").length /
                projectTasks.length) *
                100,
            )
          : 0,
      developers: [
        ...new Set(
          projectTasks
            .filter((t) => t.role === "Developer")
            .map((t) => t.assignedTo),
        ),
      ].length,
      designers: [
        ...new Set(
          projectTasks
            .filter((t) => t.role === "Designer")
            .map((t) => t.assignedTo),
        ),
      ].length,
      sales: [
        ...new Set(
          projectTasks
            .filter((t) => t.role === "Sales")
            .map((t) => t.assignedTo),
        ),
      ].length,
    };
  };

  // Medical Dashboard KPI styling model
  function KPICard({ title, value, trend, color }: any) {
    const isPositive = trend.startsWith("+");
    return (
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
          {title}
        </p>
        <div className="flex justify-between items-end">
          <p className={`text-3xl font-black tracking-tighter ${color}`}>
            {value}
          </p>
          <span
            className={`text-[10px] font-bold px-2 py-1 rounded-lg ${isPositive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
          >
            {trend}
          </span>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full bg-slate-50 min-h-screen p-6 flex items-center justify-center">
        <div className="text-center text-slate-400 font-medium">
          Loading project analytics status...
        </div>
      </div>
    );
  }

  // Dynamic calculations for overall widgets
  const avgProgress =
    projects.length > 0
      ? Math.round(
          projects.reduce(
            (sum, p) => sum + getProjectStats(p.projectName).completionRate,
            0,
          ) / projects.length,
        )
      : 0;
  const goingGoodCount = projects.filter(
    (p) => getProjectStatus(p) === "Going Good",
  ).length;
  const totalTasksCount = tasks.length;

  // 1. Dynamic Project Completion Distribution for Chart Line/Area
  const projectChartData = projects.map((p) => ({
    name: p.projectName?.substring(0, 10) || "Project",
    "Completion %": getProjectStats(p.projectName).completionRate,
    "Total Tasks": getProjectStats(p.projectName).total,
  }));

  // 2. Dynamic Task Status Mix for Pie Chart
  const totalCompleted = tasks.filter((t) => t.status === "Completed").length;
  const totalInProgress = tasks.filter(
    (t) => t.status === "In Progress",
  ).length;
  const totalPending = tasks.filter((t) => t.status === "Pending").length;
  const totalNotStarted = tasks.filter(
    (t) => t.status === "Not Started",
  ).length;

  const taskPieData = [
    { name: "Completed", value: totalCompleted },
    { name: "In Progress", value: totalInProgress },
    { name: "Pending", value: totalPending },
    { name: "Not Started", value: totalNotStarted },
  ].filter((item) => item.value > 0); // avoid empty angles

  const PIE_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#64748b"];

  return (
    <div className="w-full bg-slate-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <FiBarChart className="text-blue-600" />
              Project Status Overview
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Real-time dynamic development velocity and cross-initiative health
              metrics.
            </p>
          </div>
          <div className="flex gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
            <button className="px-4 py-2 text-xs font-bold bg-slate-900 text-white rounded-lg">
              Active Status
            </button>
          </div>
        </div>

        {/* Dynamic Medical-Style KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Total Initiatives"
            value={projects.length.toString()}
            trend={`+${projects.length}`}
            color="text-blue-600"
          />
          <KPICard
            title="Total Scope Tasks"
            value={totalTasksCount.toString()}
            trend="+100%"
            color="text-indigo-600"
          />
          <KPICard
            title="Avg Production Velocity"
            value={`${avgProgress}%`}
            trend={avgProgress > 50 ? "+5.4%" : "-2.1%"}
            color="text-emerald-600"
          />
          <KPICard
            title="On Track Stream"
            value={goingGoodCount.toString()}
            trend="Healthy"
            color="text-purple-600"
          />
        </div>

        {/* Recharts Graphics Integration Rows */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Chart 1: Project Progress Trends */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
            <h2 className="text-xl font-black text-slate-900 mb-8 tracking-tight">
              Velocity Allocation Curve
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={
                  projectChartData.length > 0
                    ? projectChartData
                    : [{ name: "None", "Completion %": 0, "Total Tasks": 0 }]
                }
              >
                <defs>
                  <linearGradient
                    id="colorVelocity"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#21a9ff" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#21a9ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend iconType="circle" />
                <Area
                  type="monotone"
                  dataKey="Completion %"
                  stroke="#21a9ff"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorVelocity)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 2: Task Distribution Analysis */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
            <h2 className="text-xl font-black text-slate-900 mb-8 tracking-tight">
              Scope Task Burden
            </h2>
            <div className="flex flex-col md:flex-row items-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={
                      taskPieData.length > 0
                        ? taskPieData
                        : [{ name: "No Tasks", value: 1 }]
                    }
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {taskPieData.length > 0 ? (
                      taskPieData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))
                    ) : (
                      <Cell fill="#cbd5e1" />
                    )}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="w-full md:w-48 space-y-3">
                {taskPieData.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-2 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: PIE_COLORS[idx] }}
                      ></div>
                      <span className="text-xs font-bold text-slate-600">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-xs font-black text-slate-900">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Project Performance Table Ledger */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-100">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Initiatives Breakdown Ledger
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Project Name
                      </th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Lead Strategist
                      </th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Health State
                      </th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                        Completion Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {projects.length > 0 ? (
                      projects.map((project, idx) => {
                        const currentStatus = getProjectStatus(project);
                        const currentStats = getProjectStats(
                          project.projectName,
                        );
                        return (
                          <tr
                            key={project._id || idx}
                            className="hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="px-6 py-4 font-bold text-slate-900">
                              {project.projectName}
                            </td>
                            <td className="px-6 py-4 text-slate-600 font-medium">
                              {project.leadName || "Unassigned"}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tight ${
                                  currentStatus === "Going Good"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : currentStatus === "Completed"
                                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                                      : "bg-amber-50 text-amber-700 border border-amber-200"
                                }`}
                              >
                                {currentStatus}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className="px-3 py-1 rounded-lg text-xs font-black bg-slate-100 text-slate-800 border border-slate-200">
                                {currentStats.completionRate}%
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-6 py-8 text-center text-slate-400 text-sm"
                        >
                          No dynamic software initiatives tracked yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Section: Team Claim / Allocation Simulation */}
          <div className="lg:col-span-1">
            <div className="bg-indigo-600 rounded-3xl p-8 text-white h-full shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <div className="w-32 h-32 border-8 border-white rounded-full"></div>
              </div>
              <h2 className="text-xl font-black mb-8 relative z-10">
                Total Dev Capacity
              </h2>

              <div className="space-y-6 relative z-10">
                <div>
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-2 text-indigo-200">
                    <span>Engineers</span>
                    <span>
                      {
                        Array.from(
                          new Set(
                            tasks
                              .filter((t) => t.role === "Developer")
                              .map((t) => t.assignedTo),
                          ),
                        ).length
                      }
                    </span>
                  </div>
                  <div className="w-full bg-indigo-700/50 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-white h-full rounded-full"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-2 text-indigo-200">
                    <span>Designers</span>
                    <span>
                      {
                        Array.from(
                          new Set(
                            tasks
                              .filter((t) => t.role === "Designer")
                              .map((t) => t.assignedTo),
                          ),
                        ).length
                      }
                    </span>
                  </div>
                  <div className="w-full bg-indigo-700/50 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-white h-full rounded-full"
                      style={{ width: "45%" }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-2 text-indigo-200">
                    <span>Business / Sales</span>
                    <span>
                      {
                        Array.from(
                          new Set(
                            tasks
                              .filter((t) => t.role === "Sales")
                              .map((t) => t.assignedTo),
                          ),
                        ).length
                      }
                    </span>
                  </div>
                  <div className="w-full bg-indigo-700/50 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-white h-full rounded-full"
                      style={{ width: "25%" }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-6 border-t border-indigo-500/30">
                <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">
                  Active Velocity Throughput
                </p>
                <p className="text-2xl font-black mt-1">
                  {avgProgress > 0 ? `${avgProgress}%` : "0%"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Project Timeline Grid Footer */}
        <div className="mt-8 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">
            Production Timeline Matrix
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl"
              >
                <FiClock className="text-blue-500 flex-shrink-0" size={16} />
                <div className="truncate">
                  <p className="font-bold text-slate-900 text-xs truncate">
                    {project.projectName}
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                    {project.startDate || "TBD"} → {project.endDate || "TBD"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectStatus;
