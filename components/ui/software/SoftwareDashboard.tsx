'use client'

import React, { useState, useEffect } from 'react'
import { 
  FiCode, 
  FiCheckSquare, 
  FiBarChart, 
  FiPlus, 
  FiUsers, 
  FiTrendingUp, 
  FiGitBranch
} from 'react-icons/fi'
import { FaProjectDiagram, FaTasks, FaGithub } from 'react-icons/fa'
import Link from 'next/link'
import { SoftwareService } from '@/src/services/software/softwareService'
import { TaskService } from '@/src/services/software/taskService'

export default function SoftwareDashboard() {
  const [projects, setProjects] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const projectsRes = await SoftwareService.getSoftwareProjects(1, 100)
      const tasksRes = await TaskService.getAllTasks(1, 100)
      
      let projectsArray = []
      if (projectsRes?.data?.projects && Array.isArray(projectsRes.data.projects)) {
        projectsArray = projectsRes.data.projects
      } else if (projectsRes?.data && Array.isArray(projectsRes.data)) {
        projectsArray = projectsRes.data
      } else if (Array.isArray(projectsRes)) {
        projectsArray = projectsRes
      }
      
      let tasksArray = []
      if (tasksRes?.data?.tasks && Array.isArray(tasksRes.data.tasks)) {
        tasksArray = tasksRes.data.tasks
      } else if (tasksRes?.data && Array.isArray(tasksRes.data)) {
        tasksArray = tasksRes.data
      } else if (Array.isArray(tasksRes)) {
        tasksArray = tasksRes
      }
      
      setProjects(Array.isArray(projectsArray) ? projectsArray : [])
      setTasks(Array.isArray(tasksArray) ? tasksArray : [])
    } catch (err) {
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Dynamic Metrics Calculation
  const totalProjects = projects.length
  const activeProjects = projects.filter(p => p.projectStatus !== 'Completed').length
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.status === 'Completed').length
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  const teamMembers = [...new Set(tasks.map(t => t.assignedTo).filter(Boolean))].length

  // Financial Dashboard UI Style Metrics Mapping
  const stats = [
    { 
      label: 'Total Projects', 
      value: totalProjects, 
      icon: FaProjectDiagram, 
      iconColor: 'text-blue-600 bg-blue-50' 
    },
    { 
      label: 'Active Projects', 
      value: activeProjects, 
      icon: FiTrendingUp, 
      iconColor: 'text-emerald-600 bg-emerald-50' 
    },
    { 
      label: 'Total Tasks', 
      value: totalTasks, 
      icon: FaTasks, 
      iconColor: 'text-purple-600 bg-purple-50' 
    },
    { 
      label: 'Completion Rate', 
      value: `${completionRate}%`, 
      icon: FiCheckSquare, 
      iconColor: 'text-amber-600 bg-amber-50' 
    },
  ]

  // Quick Actions Configuration matching clean box layouts
  const quickActions = [
    { 
      title: 'New Project', 
      description: 'Create a new software project', 
      icon: FiPlus, 
      href: '/software/track-all-projects', 
      badgeColor: 'bg-blue-50 text-blue-700' 
    },
    { 
      title: 'Assign Task', 
      description: 'Create and assign new task', 
      icon: FiCheckSquare, 
      href: '/software/task-details', 
      badgeColor: 'bg-purple-50 text-purple-700' 
    },
    { 
      title: 'View Status', 
      description: 'Check project progress', 
      icon: FiBarChart, 
      href: '/software/project-status', 
      badgeColor: 'bg-emerald-50 text-emerald-700' 
    },
    { 
      title: 'GitHub Sync', 
      description: 'Sync with repositories', 
      icon: FaGithub, 
      href: '/software/track-all-projects', 
      badgeColor: 'bg-slate-100 text-slate-700' 
    },
  ]

  // Status Badge Class Mapper matches Financial Dashboard exactly
  const getBadgeClass = (status: string) => {
    switch (status) {
      case 'Completed':
      case 'Active':
        return 'bg-green-100 text-green-700'
      case 'In Progress':
        return 'bg-blue-100 text-blue-700'
      case 'Pending':
        return 'bg-amber-100 text-amber-700'
      default:
        return 'bg-slate-100 text-slate-700'
  }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
        <div className="text-slate-400 font-medium">Loading software dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2 flex items-center gap-3">
            <FiCode className="text-blue-600" />
            Software Management
          </h1>
          <p className="text-slate-500 font-medium">Track projects, manage tasks, and monitor team progress dynamically.</p>
        </div>

        {/* Statistics Grid (Financial Dashboard Layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, index) => {
            const StatIcon = stat.icon
            return (
              <div key={index} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${stat.iconColor}`}>
                  <StatIcon size={20} />
                </div>
                <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              </div>
            )
          })}
        </div>

        {/* Quick Actions Card Grid */}
        <div className="mb-10">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-bold text-slate-800">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const ActionIcon = action.icon
              return (
                <Link key={index} href={action.href}>
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        <ActionIcon size={18} />
                      </div>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-blue-600 transition-colors">{action.title}</h3>
                    <p className="text-xs text-slate-500">{action.description}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Dynamic Project Modules Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-10">
          <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-800">Active Projects Tracking</h2>
            <span className="text-blue-600 font-bold bg-blue-50 px-3 py-1.5 rounded-lg text-sm">
              Total: {projects.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white">
                  <th className="text-left py-4 px-6 font-semibold text-slate-500 text-sm uppercase">Project Name</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-500 text-sm uppercase">Technology Stack</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-500 text-sm uppercase">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-500 text-sm uppercase">Git Repository</th>
                  <th className="text-right py-4 px-6 font-semibold text-slate-500 text-sm uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.length > 0 ? (
                  projects.map((project, index) => (
                    <tr key={project.id || index} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 text-slate-900 font-bold">{project.projectName || project.name || 'Unnamed Project'}</td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-bold uppercase tracking-tight">
                          {project.techStack || project.category || 'Software'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getBadgeClass(project.projectStatus || 'Active')}`}>
                          {project.projectStatus || 'Active'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-600 font-medium truncate max-w-xs">
                        {project.gitRepo || project.repoUrl || 'No Repository Linked'}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link href="/software/track-all-projects" className="text-blue-600 hover:text-blue-800 font-bold text-sm">
                          Manage →
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-500 text-sm">
                      No software projects found. Create one to populate this list!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dynamic Recent Activity / Tasks Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-800">Recent Tasks Activity</h2>
            <span className="text-purple-600 font-bold bg-purple-50 px-3 py-1.5 rounded-lg text-sm">
              In Progress: {inProgressTasks}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white">
                  <th className="text-left py-4 px-6 font-semibold text-slate-500 text-sm uppercase">Task Title</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-500 text-sm uppercase">Associated Project</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-500 text-sm uppercase">Assigned To</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-500 text-sm uppercase">Status</th>
                  <th className="text-right py-4 px-6 font-semibold text-slate-500 text-sm uppercase">Deadline / Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tasks.length > 0 ? (
                  tasks.slice(0, 5).map((task, index) => (
                    <tr key={task.id || index} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 text-slate-900 font-bold">{task.taskTitle || 'Untitled Task'}</td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-bold uppercase tracking-tight">
                          {task.projectName || 'General'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-600 font-medium">{task.assignedTo || 'Unassigned'}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getBadgeClass(task.status)}`}>
                          {task.status || 'Pending'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-900 font-bold text-right text-sm">
                        {task.dueDate || task.deadline || 'N/A'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-slate-500 text-sm">
                      No tasks found. Add a task to start tracking team production.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}