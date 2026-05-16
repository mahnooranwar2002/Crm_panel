'use client';

import React, { useState, useEffect } from 'react';
import { FiX, FiAlertCircle } from 'react-icons/fi';

interface Resource {
  _id?: string;
  project_id?: string;
  resource_type: "Equipment" | "Material" | "Labor" | "Subcontractor";
  resource_name: string;
  quantity: number;
  unit: string;
  cost_per_unit: number;
  supplier_id?: string;
  allocation_status: "Available" | "Allocated" | "In_Use" | "Returned";
  assigned_to_task?: string;
  date_allocated?: string;
  date_returned?: string;
  cost_total?: number;
  notes?: string;
}

interface ResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (resource: Resource) => void;
  resource?: Resource;
  loading?: boolean;
}

const ResourceModal: React.FC<ResourceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  resource,
  loading = false
}) => {
  const [formData, setFormData] = useState<Resource>({
    resource_type: 'Equipment',
    resource_name: '',
    quantity: 0,
    unit: 'Units',
    cost_per_unit: 0,
    allocation_status: 'Available',
    project_id: '',
    supplier_id: '',
    assigned_to_task: '',
    date_allocated: '',
    date_returned: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Resource, string>>>({});

  useEffect(() => {
    if (resource) {
      setFormData(resource);
    } else {
      setFormData({
        resource_type: 'Equipment',
        resource_name: '',
        quantity: 0,
        unit: 'Units',
        cost_per_unit: 0,
        allocation_status: 'Available',
        project_id: '',
        supplier_id: '',
        assigned_to_task: '',
        date_allocated: '',
        date_returned: '',
        notes: ''
      });
    }
    setErrors({});
  }, [resource, isOpen]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Resource, string>> = {};
    if (!formData.resource_name.trim()) newErrors.resource_name = 'Resource name is required';
    if (formData.quantity <= 0) newErrors.quantity = 'Quantity must be greater than 0';
    if (formData.cost_per_unit <= 0) newErrors.cost_per_unit = 'Cost per unit must be greater than 0';
    
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
      {/* Backdrop Glassmorphism Blur Overlay */}
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Right Aligned Form Panel Sheet */}
      <div className="absolute top-0 right-0 h-full w-full sm:w-[450px] bg-white/95 backdrop-blur-md border-l border-slate-200/50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 text-sm text-slate-900">
        
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
          <h2 className="text-xl font-bold text-slate-900">
            {resource ? 'Edit Inventory Resource' : 'Add New Resource'}
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
          
          {/* Resource Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Resource Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="resource_name"
              value={formData.resource_name}
              onChange={handleChange}
              placeholder="E.g., Ready-Mix Concrete Grade 40"
              className={`w-full px-3 py-2 border rounded-lg outline-none transition-all ${
                errors.resource_name ? 'border-red-500 bg-red-50/50' : 'border-slate-200 focus:border-blue-500'
              }`}
            />
            {errors.resource_name && (
              <p className="text-red-500 text-xs font-medium mt-1 flex items-center gap-1">
                <FiAlertCircle size={12} /> {errors.resource_name}
              </p>
            )}
          </div>

          {/* Linked Project ID */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Linked Project ID</label>
            <input
              type="text"
              name="project_id"
              value={formData.project_id || ''}
              onChange={handleChange}
              placeholder="PROJ-10023"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
            />
          </div>

          {/* Resource Type & Allocation Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Resource Type</label>
              <select
                name="resource_type"
                value={formData.resource_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white outline-none focus:border-blue-500"
              >
                <option value="Material">Material</option>
                <option value="Equipment">Equipment</option>
                <option value="Labor">Labor</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Status</label>
              <select
                name="allocation_status"
                value={formData.allocation_status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white outline-none focus:border-blue-500"
              >
                <option value="Available">Available</option>
                <option value="Allocated">Allocated</option>
                <option value="Under_Maintenance">Under Maintenance</option>
                <option value="Depleted">Depleted</option>
              </select>
            </div>
          </div>

          {/* Quantity & Unit Metric */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity || ''}
                onChange={handleChange}
                placeholder="50"
                className={`w-full px-3 py-2 border rounded-lg outline-none ${
                  errors.quantity ? 'border-red-500' : 'border-slate-200 focus:border-blue-500'
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Unit</label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                placeholder="Tons, Units, Hours"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Cost Per Unit */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Cost Per Unit ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="cost_per_unit"
              value={formData.cost_per_unit || ''}
              onChange={handleChange}
              placeholder="120"
              className={`w-full px-3 py-2 border rounded-lg outline-none ${
                errors.cost_per_unit ? 'border-red-500' : 'border-slate-200 focus:border-blue-500'
              }`}
            />
          </div>

          {/* Supplier ID & Assigned To Task */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Supplier ID</label>
              <input
                type="text"
                name="supplier_id"
                value={formData.supplier_id || ''}
                onChange={handleChange}
                placeholder="SUPP-789"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Assigned Task ID</label>
              <input
                type="text"
                name="assigned_to_task"
                value={formData.assigned_to_task || ''}
                onChange={handleChange}
                placeholder="TASK-445"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Timeline Range Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Date Allocated</label>
              <input
                type="date"
                name="date_allocated"
                value={formData.date_allocated ? formData.date_allocated.split('T')[0] : ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Date Returned</label>
              <input
                type="date"
                name="date_returned"
                value={formData.date_returned ? formData.date_returned.split('T')[0] : ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Description Operational Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Notes / Specifications</label>
            <textarea
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              placeholder="Enter special storage requirements or deployment parameters..."
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
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
            {loading ? 'Saving...' : 'Save Resource'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceModal;