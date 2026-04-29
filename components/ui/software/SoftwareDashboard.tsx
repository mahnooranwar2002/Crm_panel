'use client'

import React, { useState, useEffect } from 'react'
import { 
  FiCode, 
  FiCheckSquare, 
  FiBarChart, 
  FiPlus, 
  FiUsers, 
  FiTrendingUp, 
  FiGitBranch,
  FiAlertCircle
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
      
      // Handle projects response structure: response.data.projects
      let projectsArray = []
      if (projectsRes?.data?.projects && Array.isArray(projectsRes.data.projects)) {
        projectsArray = projectsRes.data.projects
      } else if (projectsRes?.data && Array.isArray(projectsRes.data)) {
        projectsArray = projectsRes.data
      } else if (Array.isArray(projectsRes)) {
        projectsArray = projectsRes
      }
      
      // Handle tasks response structure: response.data.tasks
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

  // Calculate stats
  const totalProjects = projects.length
  const activeProjects = projects.filter(p => p.projectStatus !== 'Completed').length
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.status === 'Completed').length
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
  const teamMembers = [...new Set(tasks.map(t => t.assignedTo).filter(Boolean))].length

  const stats = [
    { 
      label: 'Total Projects', 
      value: totalProjects.toString(), 
      icon: FaProjectDiagram, 
      color: 'bg-blue-50 text-blue-600' 
    },
    { 
      label: 'Active Projects', 
      value: activeProjects.toString(), 
      icon: FiTrendingUp, 
      color: 'bg-green-50 text-green-600' 
    },
    { 
      label: 'Total Tasks', 
      value: totalTasks.toString(), 
      icon: FaTasks, 
      color: 'bg-purple-50 text-purple-600' 
    },
    { 
      label: 'Completion Rate', 
      value: `${completionRate}%`, 
      icon: FiCheckSquare, 
      color: 'bg-amber-50 text-amber-600' 
    },
    { 
      label: 'In Progress', 
      value: inProgressTasks.toString(), 
      icon: FiCode, 
      color: 'bg-indigo-50 text-indigo-600' 
    },
    { 
      label: 'Team Members', 
      value: teamMembers.toString(), 
      icon: FiUsers, 
      color: 'bg-pink-50 text-pink-600' 
    },
  ]

  const quickActions = [
    { 
      title: 'New Project', 
      description: 'Create a new software project', 
      icon: FiPlus, 
      href: '/software/track-all-projects', 
      color: 'blue' 
    },
    { 
      title: 'Assign Task', 
      description: 'Create and assign new task', 
      icon: FiCheckSquare, 
      href: '/software/task-details', 
      color: 'purple' 
    },
    { 
      title: 'View Status', 
      description: 'Check project progress', 
      icon: FiBarChart, 
      href: '/software/project-status', 
      color: 'green' 
    },
    { 
      title: 'GitHub Sync', 
      description: 'Sync with repositories', 
      icon: FaGithub, 
      href: '/software/track-all-projects', 
      color: 'slate' 
    },
  ]

  const modules = [
    { 
      title: 'Track All Projects', 
      description: 'Manage and monitor all software projects in one place.', 
      link: '/software/track-all-projects',
      icon: FaProjectDiagram
    },
    { 
      title: 'Task Management', 
      description: 'Assign tasks, set deadlines, and track team productivity.', 
      link: '/software/task-details',
      icon: FaTasks
    },
    { 
      title: 'Project Status', 
      description: 'View real-time project progress and completion metrics.', 
      link: '/software/project-status',
      icon: FiBarChart
    },
    { 
      title: 'Team Collaboration', 
      description: 'Coordinate with team members and track contributions.', 
      link: '/software/track-all-projects',
      icon: FiUsers
    },
  ]

  const colorMap: Record<string, string> = {
    blue: 'hover:border-blue-300 text-blue-600',
    purple: 'hover:border-purple-300 text-purple-600',
    green: 'hover:border-green-300 text-green-600',
    slate: 'hover:border-slate-300 text-slate-600',
  }

  if (loading) {
    return (
      <div className="w-full space-y-6 px-2 py-6">
        <div className="text-center py-20 text-slate-400">Loading software dashboard...</div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-8 px-2 py-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
          <FiCode className="text-blue-500 text-4xl" />
          Software Management
        </h1>
        <p className="text-slate-500 mt-2">Track projects, manage tasks, and monitor team progress</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const StatIcon = stat.icon
          return (
            <div 
              key={index}
              className={`${stat.color} rounded-2xl p-6 border border-opacity-30 border-slate-200 shadow-sm hover:shadow-md transition-all duration-200`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <StatIcon className="text-3xl opacity-30" />
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <FiCheckSquare className="text-purple-500" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const ActionIcon = action.icon
            return (
              <Link key={index} href={action.href}>
                <div className={`${colorMap[action.color]} border-2 border-slate-100 rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 h-full`}>
                  <ActionIcon className="text-4xl mb-3" />
                  <h3 className="font-bold text-sm mb-1">{action.title}</h3>
                  <p className="text-xs text-slate-600">{action.description}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Modules */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <FiGitBranch className="text-green-500" />
          Key Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((module, index) => {
            const ModuleIcon = module.icon
            return (
              <Link key={index} href={module.link}>
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200 cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all duration-300 group h-full">
                  <div className="flex items-start justify-between mb-3">
                    <ModuleIcon className="text-3xl text-blue-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg mb-2 group-hover:text-blue-600 transition-colors">
                    {module.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {module.description}
                  </p>
                  <div className="mt-4 text-blue-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more →
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <FiTrendingUp className="text-amber-500" />
          Recent Activity
        </h2>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          {tasks.slice(0, 5).length > 0 ? (
            tasks.slice(0, 5).map((task, index) => (
              <div key={index} className="flex items-center justify-between pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">{task.taskTitle}</p>
                  <p className="text-sm text-slate-500">{task.projectName} • {task.assignedTo}</p>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  task.status === 'Completed' ? 'bg-green-100 text-green-700' :
                  task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                  task.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {task.status}
                </span>
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-center py-8">No tasks yet. Create one to get started!</p>
          )}
        </div>
      </div>
    </div>
  )
}
