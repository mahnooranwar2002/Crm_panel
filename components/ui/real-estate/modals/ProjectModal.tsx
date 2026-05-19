'use client';

import React, { useState, useEffect } from 'react';
import { FiX, FiAlertCircle } from 'react-icons/fi';

interface Project {
  _id?: string;
  project_id?: string;
  project_name: string;
  property_id?: string;
  project_type: string;
  description?: string;
  contractor_id?: string;
  project_manager_id?: string;
  start_date: string;
  end_date: string;
  actual_end_date?: string;
  budget: number;
  spent_amount?: number;
  currency?: string;
  status?: string;
  progress_percentage?: number;
  site_manager_id?: string;
}

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  project?: Project;
  loading?: boolean;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  project,
  loading = false
}) => {
  const [formData, setFormData] = useState<Project>(({
    project_name: '',
    project_type: 'New_Build',
    start_date: '',
    end_date: '',
    budget: 0,
    spent_amount: 0,
    currency: 'USD',
    status: 'Planning',
    progress_percentage: 0,
    description: '',
    property_id: ''
  }));

  const [errors, setErrors] = useState<Partial<Record<keyof Project, string>>>({});

  useEffect(() => {
    if (project) {
      setFormData(project);
    } else {
      setFormData({
        project_name: '',
        project_type: 'New_Build',
        start_date: '',
        end_date: '',
        budget: 0,
        spent_amount: 0,
        currency: 'USD',
        status: 'Planning',
        progress_percentage: 0,
        description: '',
        property_id: ''
      });
    }
    setErrors({});
  }, [project, isOpen]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Project, string>> = {};
    if (!formData.project_name) newErrors.project_name = 'Project name is required';
    if (!formData.start_date) newErrors.start_date = 'Start date is required';
    if (!formData.end_date) newErrors.end_date = 'End date is required';
    if (formData.budget <= 0) newErrors.budget = 'Budget must be greater than 0';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      {/* Backdrop Dim Overlay with Glass blur effect */}
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Right Aligned Form Sidebar Sheet */}
      <div className="absolute top-0 right-0 h-full w-full sm:w-[450px] bg-white/95 backdrop-blur-md border-l border-slate-200/50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 text-sm text-slate-900">
        
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
          <h2 className="text-xl font-bold text-slate-900">
            {project ? 'Edit Construction Project' : 'Add New Project'}
          </h2>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Scrollable Form Fields Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* Project Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="project_name"
              value={formData.project_name}
              onChange={handleChange}
              placeholder="E.g., Downtown Plaza Renovation"
              className={`w-full px-3 py-2 border rounded-lg outline-none transition-all ${
                errors.project_name ? 'border-red-500 bg-red-50/50' : 'border-slate-200 focus:border-blue-500'
              }`}
            />
            {errors.project_name && (
              <p className="text-red-500 text-xs font-medium mt-1 flex items-center gap-1">
                <FiAlertCircle size={12} /> {errors.project_name}
              </p>
            )}
          </div>

          {/* Property ID Linked mapping */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Linked Property ID</label>
            <input
              type="text"
              name="property_id"
              value={formData.property_id || ''}
              onChange={handleChange}
              placeholder="PROP-12345"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
            />
          </div>

          {/* Project Type & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Project Type</label>
              <select
                name="project_type"
                value={formData.project_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white outline-none focus:border-blue-500"
              >
                <option value="New_Build">New Build</option>
                <option value="Renovation">Renovation</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Expansion">Expansion</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white outline-none focus:border-blue-500"
              >
                <option value="Planning">Planning</option>
                <option value="In_Progress">In Progress</option>
                <option value="On_Hold">On Hold</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Start & End Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date ? formData.start_date.split('T')[0] : ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg outline-none ${
                  errors.start_date ? 'border-red-500' : 'border-slate-200 focus:border-blue-500'
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date ? formData.end_date.split('T')[0] : ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg outline-none ${
                  errors.end_date ? 'border-red-500' : 'border-slate-200 focus:border-blue-500'
                }`}
              />
            </div>
          </div>

          {/* Budget & Spent Amount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Budget ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="budget"
                value={formData.budget || ''}
                onChange={handleChange}
                placeholder="500000"
                className={`w-full px-3 py-2 border rounded-lg outline-none ${
                  errors.budget ? 'border-red-500' : 'border-slate-200 focus:border-blue-500'
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Spent Amount ($)</label>
              <input
                type="number"
                name="spent_amount"
                value={formData.spent_amount || 0}
                onChange={handleChange}
                placeholder="15000"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Progress Percentage */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Progress (%)</label>
            <input
              type="number"
              name="progress_percentage"
              value={formData.progress_percentage || 0}
              onChange={handleChange}
              min="0"
              max="100"
              placeholder="45"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              placeholder="Describe project details, layout updates..."
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Action Controls Footer */}
        <div className="p-4 border-t border-slate-100 grid grid-cols-2 gap-3 bg-white/50">
          <button
            onClick={onClose}
            className="w-full py-2.5 border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 shadow-md shadow-blue-100"
          >
            {loading ? 'Saving...' : 'Save Project'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;