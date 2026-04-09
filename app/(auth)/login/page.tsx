"use client"
import React, { useState } from 'react';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('developer');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Sign In</h1>
        <p className="text-slate-500 font-medium">
            Sign in with your administrator or member account to continue.
        </p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); router.push('/'); }} className="space-y-6">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="email" 
              className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              placeholder="info@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
            <button type="button" className="text-xs font-bold text-emerald-600 hover:underline">Forgot password?</button>
          </div>
          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="password" 
              className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="w-full py-4 bg-[#59df74] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all shadow-lg active:scale-[0.98]">
          Sign in <FiArrowRight />
        </button>
      </form>
    </div>
  );
}