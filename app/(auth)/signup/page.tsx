'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/src/services/authService';
import { UploadService } from '@/src/services/uploadService';
import { getInitials } from '@/src/utils/avatarHelper';
import Link from 'next/link';
import { FiMail, FiLock, FiUser, FiPhone, FiAlertCircle, FiArrowRight, FiBriefcase, FiCamera } from 'react-icons/fi';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: '', // Will be role _id
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [rolesLoading, setRolesLoading] = useState(true);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setRolesLoading(true);
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
      
      const response = await fetch(`${API_BASE_URL}/auth/roles`);
      
      if (!response.ok) {
        console.log('Backend roles unavailable, using Sales role as default');
        // Use Sales as the default role - backend will assign it if ID is invalid
        setRoles([
          { _id: 'default-sales', role_name: 'Sales' },
          { _id: 'default-manager', role_name: 'Manager' },
          { _id: 'default-admin', role_name: 'Admin' }
        ]);
        setFormData(prev => ({ ...prev, role: 'default-sales' }));
        setRolesLoading(false);
        return;
      }

      const result = await response.json();
      const rolesData = result.data || [];
      
      if (rolesData.length > 0) {
        console.log('Fetched roles from backend:', rolesData);
        setRoles(rolesData);
        // Set to Sales role if available, otherwise first role
        const salesRole = rolesData.find((r: any) => r.role_name === 'Sales');
        setFormData(prev => ({ ...prev, role: (salesRole || rolesData[0])._id }));
      } else {
        // No roles - use defaults with Sales first
        console.log('No roles returned from backend, using default roles');
        setRoles([
          { _id: 'default-sales', role_name: 'Sales' },
          { _id: 'default-manager', role_name: 'Manager' },
          { _id: 'default-admin', role_name: 'Admin' }
        ]);
        setFormData(prev => ({ ...prev, role: 'default-sales' }));
      }
    } catch (err: any) {
      console.error('Error fetching roles:', err);
      // Fallback defaults
      setRoles([
        { _id: 'admin_default', role_name: 'Admin' },
        { _id: 'manager_default', role_name: 'Manager' },
        { _id: 'sales_default', role_name: 'Sales' }
      ]);
      setFormData(prev => ({ ...prev, role: 'admin_default' }));
    } finally {
      setRolesLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      
      // Upload avatar first if provided
      let avatarPath = null;
      if (avatarFile) {
        try {
          avatarPath = await UploadService.uploadAvatar(avatarFile);
        } catch (uploadErr) {
          console.warn('Avatar upload failed, continuing without:', uploadErr);
          // Don't fail signup if avatar upload fails
        }
      }
      
      await AuthService.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || '',
        role: formData.role,
        avatar: avatarPath, // Include avatar path if uploaded successfully
      });

      setSuccess(true);
      setTimeout(() => {
        router.push('/home');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleDescription = (roleName?: string) => {
    const descriptions: any = {
      'Admin': 'Full control over the system, manage users and all operations',
      'Manager': 'Create leads, assign tasks, and manage the sales team',
      'Sales': 'Work on assigned leads and update progress'
    };
    return descriptions[roleName || ''] || '';
  };

  const selectedRole = roles.find(r => r._id === formData.role);

  return (
    <div className="min-h-screen text-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-slate-800">Create Account</h1>
          <p className="text-slate-500 mt-2 font-medium">Join Wholcure CRM today</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
            <FiAlertCircle className="text-red-600 mt-0.5 flex-shrink-0" size={20} />
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-start gap-3">
            <div className="text-green-600 mt-0.5 flex-shrink-0">✓</div>
            <p className="text-green-700 text-sm font-medium">Account created! Redirecting...</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2.5">Full Name *</label>
            <div className="relative">
              <FiUser className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-2xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2.5">Email Address *</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-2xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2.5">Password *</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-2xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all"
                required
              />
            </div>
            <p className="text-xs text-slate-500 mt-1.5">At least 6 characters</p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2.5">Phone (Optional)</label>
            <div className="relative">
              <FiPhone className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+92 300 1234567"
                className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-2xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Profile Photo - Optional */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2.5">Profile Photo (Optional)</label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="w-full px-3 py-3 border-2 border-dashed border-slate-200 rounded-2xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 file:font-medium cursor-pointer"
              />
            </div>
            {avatarPreview && (
              <div className="mt-4 p-3 bg-indigo-50 border-2 border-indigo-200 rounded-2xl">
                <div className="flex items-center gap-3">
                  <img 
                    src={avatarPreview} 
                    alt="Preview" 
                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-700">Preview</p>
                    <p className="text-xs text-slate-500">Will be uploaded on signup</p>
                  </div>
                </div>
              </div>
            )}
            {formData.name && !avatarPreview && (
              <div className="mt-4 p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white text-center">
                <p className="text-xs font-medium uppercase tracking-wide mb-1">Default Avatar</p>
                <div className="w-12 h-12 mx-auto rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-lg mx-auto">
                  {formData.name.split(' ').map(n => n[0]).slice(0,2).join('')}
                </div>
              </div>
            )}
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2.5">Select Your Role *</label>
            <div className="relative">
              <FiBriefcase className="absolute left-4 top-3.5 text-slate-400 pointer-events-none" size={18} />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={rolesLoading}
                className="w-full pl-11 pr-4 py-3 border-2 border-slate-200 rounded-2xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all appearance-none cursor-pointer bg-white disabled:cursor-not-allowed disabled:bg-slate-50"
                required
              >
                <option value="">Choose a role...</option>
                {roles.map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.role_name || 'Unknown Role'}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-3.5 text-slate-400 pointer-events-none">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
            {selectedRole && (
              <p className="text-xs text-slate-600 mt-2 p-2.5 bg-indigo-50 rounded-lg border border-indigo-100">
                <strong className="text-indigo-900">{selectedRole.role_name}</strong>: {getRoleDescription(selectedRole.role_name)}
              </p>
            )}
            {rolesLoading && <p className="text-xs text-slate-500 mt-2">Loading roles...</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || success || rolesLoading}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-400 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? 'Creating account...' : success ? '✓ Account created!' : <>
              Sign Up <FiArrowRight size={18} />
            </>}
          </button>
        </form>

        <p className="text-center text-slate-600 mt-8">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
