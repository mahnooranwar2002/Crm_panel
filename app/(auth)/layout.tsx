import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white font-sans">
      {/* LEFT CONTAINER: Dark Branding Side */}
      <div className="hidden md:flex md:w-1/2 bg-[#1a233a] p-12 flex-col justify-center items-center relative overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
        </div>
        
        <div className="relative z-10 text-center space-y-6">
          <img 
            src="https://wholcure.vercel.app/wholcure.png" 
            alt="Wholcure Logo" 
            className="w-64 mx-auto brightness-0 invert" 
          />
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">Welcome to the workspace</h2>
            <p className="text-slate-400 max-w-sm mx-auto">
              Access your professional CRM dashboard and stay connected with your team.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT CONTAINER: Form Side */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-16 bg-white">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}