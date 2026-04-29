"use client"
import React from 'react';
import Link from 'next/link';
import { FiArrowRight, FiCheckCircle, FiShield, FiLayout, FiUsers } from 'react-icons/fi';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <img src="https://wholcure.vercel.app/wholcure.png" alt="Wholcure Logo" className="h-10" />
        </div>
        <div className="flex items-center gap-6">
          <Link href="/home" className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
            Dashboard
          </Link>
          <Link href="/home" className="px-6 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-emerald-600 transition-all shadow-lg active:scale-95">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
          {/* <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest mb-8 animate-bounce">
            <FiShield /> Production Ready CRM v1.0
          </div> */}
        
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8">
          Manage your <span className="text-emerald-600">Leads</span> & <br />
          <span className="text-blue-600">Opportunities</span> smarter.
        </h1>
        
        <p className="text-xl text-slate-500 max-w-2xl mb-12 font-medium">
          The all-in-one professional dashboard for Wholcure teams. Track companies, manage contacts, and close deals with real-time analytics.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/home" className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-[2px] flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-2xl shadow-slate-200 active:scale-95">
            Enter Dashboard <FiArrowRight size={18} />
          </Link>
        </div>

        {/* Features Preview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full text-left">
          <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 space-y-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm text-xl"><FiUsers /></div>
            <h3 className="font-bold text-slate-800 text-xl">Lead Management</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Efficiently track and manage your contacts from lead to customer.</p>
          </div>
          
          <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 space-y-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm text-xl"><FiLayout /></div>
            <h3 className="font-bold text-slate-800 text-xl">Role-Based Access</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Separate views for Admins, Managers, and Programmers.</p>
          </div>

          <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 space-y-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-purple-600 shadow-sm text-xl"><FiCheckCircle /></div>
            <h3 className="font-bold text-slate-800 text-xl">Deal Pipeline</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Visual opportunities and activity logs to keep your team productive.</p>
          </div>
        </div>
      </main>

      {/* Footer Decoration */}
      <div className="border-t border-slate-100 py-10 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
        &copy; 2026 Wholcure CRM. All Rights Reserved.
      </div>
    </div>
  );
}

