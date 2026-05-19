'use client'

import React, { useState } from 'react'
import { 
  FiHome, 
  FiDollarSign, 
  FiCalendar, 
  FiTool, 
  FiCheckCircle, 
  FiFileText,
  FiPlus,
  FiMapPin,
  FiPieChart,
  FiUsers
} from 'react-icons/fi'
import Link from 'next/link'
import PropertyModal from './modals/PropertyModal'
import ProjectModal from './modals/ProjectModal'
import TaskModal from './modals/TaskModal'
import ResourceModal from './modals/ResourceModal'
import InspectionModal from './modals/InspectionModal'
import PermitModal from './modals/PermitModal'
import ScheduleVisitModal from './modals/ScheduleVisitModal'
import NewContractModal from './modals/NewContractModal'
import ManageTenantsModal from './modals/ManageTenantsModal'
import FinancialReportModal from './modals/FinancialReportModal'
import toast from 'react-hot-toast'

export default function RealEstateDashboard() {
  // Modal state management
  const [modals, setModals] = useState({
    addProperty: false,
    startProject: false,
    scheduleVisit: false,
    newContract: false,
    manageTenants: false,
    financialReport: false,
    // CRUD modals
    propertyForm: false,
    projectForm: false,
    taskForm: false,
    resourceForm: false,
    inspectionForm: false,
    permitForm: false
  })

  const [loading, setLoading] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  const [selectedResource, setSelectedResource] = useState(null)
  const [selectedInspection, setSelectedInspection] = useState(null)
  const [selectedPermit, setSelectedPermit] = useState(null)

  // Modal toggler function
  const toggleModal = (modalName: string, state: boolean = !modals[modalName as keyof typeof modals]) => {
    setModals(prev => ({
      ...prev,
      [modalName]: state
    }))
  }

  // Handlers for each modal
  const handleAddProperty = (property: any) => {
    setLoading(true)
    setTimeout(() => {
      console.log('Adding/Updating property:', property)
      toast.success(selectedProperty ? 'Property updated!' : 'Property added!')
      toggleModal('propertyForm', false)
      setSelectedProperty(null)
      setLoading(false)
    }, 500)
  }

  const handleStartProject = (project: any) => {
    setLoading(true)
    setTimeout(() => {
      console.log('Creating/Updating project:', project)
      toast.success(selectedProject ? 'Project updated!' : 'Project started!')
      toggleModal('projectForm', false)
      setSelectedProject(null)
      setLoading(false)
    }, 500)
  }

  const handleCreateTask = (task: any) => {
    setLoading(true)
    setTimeout(() => {
      console.log('Creating/Updating task:', task)
      toast.success(selectedTask ? 'Task updated!' : 'Task created!')
      toggleModal('taskForm', false)
      setSelectedTask(null)
      setLoading(false)
    }, 500)
  }

  const handleAddResource = (resource: any) => {
    setLoading(true)
    setTimeout(() => {
      console.log('Adding/Updating resource:', resource)
      toast.success(selectedResource ? 'Resource updated!' : 'Resource added!')
      toggleModal('resourceForm', false)
      setSelectedResource(null)
      setLoading(false)
    }, 500)
  }

  const handleScheduleInspection = (inspection: any) => {
    setLoading(true)
    setTimeout(() => {
      console.log('Scheduling inspection:', inspection)
      toast.success(selectedInspection ? 'Inspection updated!' : 'Inspection scheduled!')
      toggleModal('inspectionForm', false)
      setSelectedInspection(null)
      setLoading(false)
    }, 500)
  }

  const handleAddPermit = (permit: any) => {
    setLoading(true)
    setTimeout(() => {
      console.log('Adding/Updating permit:', permit)
      toast.success(selectedPermit ? 'Permit updated!' : 'Permit added!')
      toggleModal('permitForm', false)
      setSelectedPermit(null)
      setLoading(false)
    }, 500)
  }

  const handleScheduleVisit = (visit: any) => {
    setLoading(true)
    setTimeout(() => {
      console.log('Scheduling visit:', visit)
      toast.success('Visit scheduled successfully!')
      toggleModal('scheduleVisit', false)
      setLoading(false)
    }, 500)
  }

  const handleCreateContract = (contract: any) => {
    setLoading(true)
    setTimeout(() => {
      console.log('Creating contract:', contract)
      toast.success('Contract created successfully!')
      toggleModal('newContract', false)
      setLoading(false)
    }, 500)
  }

  const handleAddTenant = (tenant: any) => {
    setLoading(true)
    setTimeout(() => {
      console.log('Adding tenant:', tenant)
      toast.success('Tenant added successfully!')
      toggleModal('manageTenants', false)
      setLoading(false)
    }, 500)
  }
  // Stats Data
  const stats = [
    { label: 'Total Properties', value: '24', icon: FiHome, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Budget', value: '$2.5M', icon: FiDollarSign, color: 'bg-green-50 text-green-600' },
    { label: 'Active Projects', value: '08', icon: FiCalendar, color: 'bg-purple-50 text-purple-600' },
    { label: 'Completed Tasks', value: '45', icon: FiCheckCircle, color: 'bg-amber-50 text-amber-600' },
    { label: 'Site Visits', value: '12', icon: FiMapPin, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Total Revenue', value: '$840K', icon: FiPieChart, color: 'bg-pink-50 text-pink-600' },
  ]

  const quickActions = [
    { title: 'Add Property', description: 'List a new property unit', icon: FiPlus, action: () => toggleModal('propertyForm', true), color: 'blue' },
    { title: 'Start Project', description: 'Create construction plan', icon: FiTool, action: () => toggleModal('projectForm', true), color: 'green' },
    { title: 'Schedule Visit', description: 'Book a site inspection', icon: FiCalendar, action: () => toggleModal('scheduleVisit', true), color: 'purple' },
    { title: 'New Contract', description: 'Generate legal agreement', icon: FiFileText, action: () => toggleModal('newContract', true), color: 'amber' },
    { title: 'Manage Tenants', description: 'View and edit tenant info', icon: FiUsers, action: () => toggleModal('manageTenants', true), color: 'indigo' },
    { title: 'Financial Report', description: 'Check ROI & expenses', icon: FiDollarSign, action: () => toggleModal('financialReport', true), color: 'pink' },
  ]

  const modules = [
    { title: 'Inventory Management', description: 'Track available units, pricing, and availability status.', link: '/real-estate/inventory' },
    { title: 'Project Tracking', description: 'Monitor construction phases, labor, and milestones.', link: '/real-estate/projects' },
    { title: 'Accounts & Ledger', description: 'Manage payments, invoices, and project expenses.', link: '/real-estate/billing' },
    { title: 'Task Manager', description: 'Assign tasks to contractors and track completion.', link: '/real-estate/tasks' },
  ]

  const colorMap: Record<string, string> = {
    blue: 'hover:border-blue-300 text-blue-600',
    green: 'hover:border-green-300 text-green-600',
    purple: 'hover:border-purple-300 text-purple-600',
    amber: 'hover:border-amber-300 text-amber-600',
    indigo: 'hover:border-indigo-300 text-indigo-600',
    pink: 'hover:border-pink-300 text-pink-600',
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Real Estate & Construction</h1>
          <p className="text-slate-500 font-medium">Manage properties, construction projects, and resources efficiently.</p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-10">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all">
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                  <Icon size={18} />
                </div>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-xl font-bold text-slate-900">{stat.value}</p>
              </div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <button
                  key={action.title}
                  onClick={action.action}
                  className={`bg-white rounded-xl border-2 border-transparent shadow-sm p-6 cursor-pointer transition-all hover:shadow-lg text-left w-full ${colorMap[action.color]}`}
                >
                  <div className="flex items-center gap-5">
                    <div className="p-4 bg-slate-50 rounded-xl text-slate-700">
                      <Icon size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 text-lg mb-0.5">{action.title}</h3>
                      <p className="text-sm text-slate-500 font-medium">{action.description}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

      {/* All Modals */}
      <PropertyModal
        isOpen={modals.propertyForm}
        onClose={() => {
          toggleModal('propertyForm', false)
          setSelectedProperty(null)
        }}
        property={selectedProperty || undefined}
        onSave={handleAddProperty}
        loading={loading}
      />

      <ProjectModal
        isOpen={modals.projectForm}
        onClose={() => {
          toggleModal('projectForm', false)
          setSelectedProject(null)
        }}
        project={selectedProject || undefined}
        onSave={handleStartProject}
        loading={loading}
      />

      <TaskModal
        isOpen={modals.taskForm}
        onClose={() => {
          toggleModal('taskForm', false)
          setSelectedTask(null)
        }}
        task={selectedTask || undefined}
        onSave={handleCreateTask}
        loading={loading}
      />

      <ResourceModal
        isOpen={modals.resourceForm}
        onClose={() => {
          toggleModal('resourceForm', false)
          setSelectedResource(null)
        }}
        resource={selectedResource || undefined}
        onSave={handleAddResource}
        loading={loading}
      />

      <InspectionModal
        isOpen={modals.inspectionForm}
        onClose={() => {
          toggleModal('inspectionForm', false)
          setSelectedInspection(null)
        }}
        inspection={selectedInspection || undefined}
        onSave={handleScheduleInspection}
        loading={loading}
      />

      <PermitModal
        isOpen={modals.permitForm}
        onClose={() => {
          toggleModal('permitForm', false)
          setSelectedPermit(null)
        }}
        permit={selectedPermit || undefined}
        onSave={handleAddPermit}
        loading={loading}
      />

      <ScheduleVisitModal
        isOpen={modals.scheduleVisit}
        onClose={() => toggleModal('scheduleVisit', false)}
        onSave={handleScheduleVisit}
        loading={loading}
      />

      <NewContractModal
        isOpen={modals.newContract}
        onClose={() => toggleModal('newContract', false)}
        onSave={handleCreateContract}
        loading={loading}
      />

      <ManageTenantsModal
        isOpen={modals.manageTenants}
        onClose={() => toggleModal('manageTenants', false)}
        onSave={handleAddTenant}
        loading={loading}
      />

      <FinancialReportModal
        isOpen={modals.financialReport}
        onClose={() => toggleModal('financialReport', false)}
        loading={loading}
      />
    </div>
    </div>
  )
}