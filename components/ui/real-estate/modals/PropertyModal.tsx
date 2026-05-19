'use client';

import React, { useState, useEffect } from 'react';
import { FiX, FiAlertCircle } from 'react-icons/fi';

interface Property {
  _id?: string;
  property_id?: string;
  address: string;
  city: string;
  state: string;
  zip_code?: string;
  country?: string;
  property_type: string;
  total_area: number;
  area_unit?: string;
  price: number;
  currency?: string;
  owner_name: string;
  owner_contact?: string;
  status?: string;
  description?: string;
}

interface PropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (property: Property) => void;
  property?: Property;
  loading?: boolean;
}

const PropertyModal: React.FC<PropertyModalProps> = ({
  isOpen,
  onClose,
  onSave,
  property,
  loading = false
}) => {
  const [formData, setFormData] = useState<Property>({
    address: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'USA',
    property_type: 'Commercial',
    total_area: 0,
    area_unit: 'sq ft',
    price: 0,
    currency: 'USD',
    owner_name: '',
    owner_contact: '',
    status: 'Available',
    description: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Property, string>>>({});

  useEffect(() => {
    if (property) {
      setFormData(property);
    } else {
      setFormData({
        address: '',
        city: '',
        state: '',
        zip_code: '',
        country: 'USA',
        property_type: 'Commercial',
        total_area: 0,
        area_unit: 'sq ft',
        price: 0,
        currency: 'USD',
        owner_name: '',
        owner_contact: '',
        status: 'Available',
        description: ''
      });
    }
    setErrors({});
  }, [property, isOpen]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Property, string>> = {};
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.owner_name) newErrors.owner_name = 'Owner name is required';
    if (formData.total_area <= 0) newErrors.total_area = 'Area must be greater than 0';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    
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
      {/* Dim Overlay Back-drop with proper z-index and glassmorphism styling */}
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Embedded Sidebar Form Layout stacked high over dashboard header */}
      <div className="absolute top-0 right-0 h-full w-full sm:w-[450px] bg-white/95 backdrop-blur-md border-l border-slate-200/50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 text-sm">
        
        {/* Sidebar Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
          <h2 className="text-xl font-bold text-slate-900">
            {property ? 'Edit Property' : 'Add New Property'}
          </h2>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Form Body Fields (Scrollable area) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Property ID */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Property ID</label>
            <input
              type="text"
              name="property_id"
              value={formData.property_id || ''}
              placeholder="Auto-generated"
              disabled
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-400 font-medium"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Main St, Downtown"
              className={`w-full px-3 py-2 border rounded-lg outline-none transition-all ${
                errors.address ? 'border-red-500 bg-red-50/50' : 'border-slate-200 focus:border-blue-500'
              }`}
            />
            {errors.address && (
              <p className="text-red-500 text-xs font-medium mt-1 flex items-center gap-1">
                <FiAlertCircle size={12} /> {errors.address}
              </p>
            )}
          </div>

          {/* City & State */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Austin"
                className={`w-full px-3 py-2 border rounded-lg outline-none ${
                  errors.city ? 'border-red-500' : 'border-slate-200 focus:border-blue-500'
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="TX"
                className={`w-full px-3 py-2 border rounded-lg outline-none ${
                  errors.state ? 'border-red-500' : 'border-slate-200 focus:border-blue-500'
                }`}
              />
            </div>
          </div>

          {/* Zip Code & Country */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Zip Code</label>
              <input
                type="text"
                name="zip_code"
                value={formData.zip_code}
                onChange={handleChange}
                placeholder="78701"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Property Type & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Property Type</label>
              <select
                name="property_type"
                value={formData.property_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white outline-none focus:border-blue-500"
              >
                <option value="Commercial">Commercial</option>
                <option value="Residential">Residential</option>
                <option value="Industrial">Industrial</option>
                <option value="Mixed-Use">Mixed-Use</option>
                <option value="Land">Land</option>
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
                <option value="Available">Available</option>
                <option value="Sold">Sold</option>
                <option value="Rented">Rented</option>
                <option value="Under_Offer">Under Offer</option>
              </select>
            </div>
          </div>

          {/* Total Area & Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Total Area <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="total_area"
                value={formData.total_area || ''}
                onChange={handleChange}
                placeholder="2500"
                className={`w-full px-3 py-2 border rounded-lg outline-none ${
                  errors.total_area ? 'border-red-500' : 'border-slate-200 focus:border-blue-500'
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Unit</label>
              <select
                name="area_unit"
                value={formData.area_unit}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white outline-none focus:border-blue-500"
              >
                <option value="sq ft">sq ft</option>
                <option value="sq m">sq m</option>
              </select>
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Price ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price || ''}
              onChange={handleChange}
              placeholder="450000"
              className={`w-full px-3 py-2 border rounded-lg outline-none ${
                errors.price ? 'border-red-500' : 'border-slate-200 focus:border-blue-500'
              }`}
            />
          </div>

          {/* Owner Details */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Owner Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="owner_name"
              value={formData.owner_name}
              onChange={handleChange}
              placeholder="John Doe"
              className={`w-full px-3 py-2 border rounded-lg outline-none ${
                errors.owner_name ? 'border-red-500' : 'border-slate-200 focus:border-blue-500'
              }`}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Owner Contact</label>
            <input
              type="text"
              name="owner_contact"
              value={formData.owner_contact || ''}
              onChange={handleChange}
              placeholder="john@example.com"
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
              placeholder="Property details..."
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Sidebar Footer Actions */}
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
            {loading ? 'Saving...' : 'Save Property'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyModal;