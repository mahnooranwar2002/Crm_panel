"use client"
import React, { useState } from 'react';
import { FiSearch, FiBell, FiMoon, FiSun, FiSettings, FiFileText, FiClock } from "react-icons/fi";

export const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);

  return (
    <header className="h-[70px] bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-[100]">
      
      {/* Search Bar Section */}
      <div className="relative w-96">
        <div className="relative group">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500" />
          <input 
            type="text" 
            onFocus={() => setIsSearchOpen(true)}
            onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
            placeholder="Search..." 
            className="w-full bg-gray-50 border border-transparent rounded-lg py-2 pl-10 pr-4 focus:bg-white focus:border-emerald-500/30 focus:ring-4 focus:ring-emerald-500/5 outline-none text-sm transition-all"
          />
        </div>

        {/* --- Search Dropdown --- */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-4 border-b border-gray-50">
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Recent Search</span>
               <div className="flex gap-2 mt-2">
                  {['Grunt', 'Node JS', 'SCSS'].map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-[11px] rounded-md font-medium">{tag}</span>
                  ))}
               </div>
            </div>
            <div className="p-2">
               <span className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Help</span>
               <div className="mt-1">
                  <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer group">
                     <div className="p-2 bg-blue-50 text-blue-500 rounded-lg"><FiSettings size={14}/></div>
                     <span className="text-sm text-gray-700 group-hover:text-emerald-600">How to setup theme?</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer group">
                     <div className="p-2 bg-orange-50 text-orange-500 rounded-lg"><FiFileText size={14}/></div>
                     <span className="text-sm text-gray-700 group-hover:text-emerald-600">View detail documentation</span>
                  </div>
               </div>
            </div>
            <div className="p-3 bg-gray-50 text-center">
               <button className="text-xs font-bold text-emerald-600 hover:underline">Search all</button>
            </div>
          </div>
        )}
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-5">
        <button className="text-gray-500 hover:text-emerald-500 transition-colors"><FiMoon size={20} /></button>
        
        {/* --- Notification Bell & Dropdown (Screenshot 920 style) --- */}
        <div className="relative">
          <button 
            onClick={() => setIsNotifyOpen(!isNotifyOpen)}
            className={`p-2 rounded-full transition-colors relative ${isNotifyOpen ? 'bg-emerald-50 text-emerald-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <FiBell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {isNotifyOpen && (
            <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
               <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0">
                  <h4 className="font-bold text-slate-800">Notifications</h4>
                  <button className="text-gray-400 hover:text-emerald-500"><FiSettings size={16}/></button>
               </div>
               
               <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                  {/* Notification Item 1 */}
                  <div className="p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer flex gap-3 transition-colors">
                     <div className="w-10 h-10 rounded-full bg-pink-100 flex-shrink-0 flex items-center justify-center text-pink-600 font-bold">SW</div>
                     <div className="space-y-1">
                        <p className="text-xs text-slate-700 font-medium leading-snug">
                           Application of <span className="font-bold">Sarah Williams</span> is waiting for your approval
                        </p>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">Today 10:14 PM</p>
                     </div>
                  </div>

                  {/* Notification Item 2 */}
                  <div className="p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer flex gap-3">
                     <div className="w-10 h-10 rounded-full bg-purple-100 flex-shrink-0 flex items-center justify-center text-purple-600">
                        <FiFileText size={18}/>
                     </div>
                     <div className="space-y-1">
                        <p className="text-xs text-slate-700 font-medium leading-snug">
                           <span className="font-bold">Winston Churchill</span> shared a document with you
                        </p>
                        <span className="inline-block px-1.5 py-0.5 bg-purple-50 text-purple-600 text-[9px] font-bold rounded">File Manager</span>
                        <p className="text-[10px] text-gray-400 uppercase font-bold ml-2 inline">2 Oct, 2021</p>
                     </div>
                  </div>

                  {/* Notification Item 3 */}
                  <div className="p-4 hover:bg-gray-50 cursor-pointer flex gap-3">
                     <div className="w-10 h-10 rounded-full bg-red-100 flex-shrink-0 flex items-center justify-center text-red-600">
                        <FiClock size={18}/>
                     </div>
                     <div className="space-y-1">
                        <p className="text-xs text-slate-700 font-medium leading-snug">
                           Last 2 days left for the project to be completed
                        </p>
                        <span className="inline-block px-1.5 py-0.5 bg-orange-50 text-orange-600 text-[9px] font-bold rounded">Updates</span>
                        <p className="text-[10px] text-gray-400 uppercase font-bold ml-2 inline">14 Sep, 2021</p>
                     </div>
                  </div>
               </div>

               <div className="p-3 text-center border-t border-gray-50">
                  <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700">View all notifications</button>
               </div>
            </div>
          )}
        </div>

        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500/20 p-0.5 cursor-pointer hover:border-emerald-500 transition-all">
           <img src="https://ui-avatars.com/api/?name=Hamza+Shahid&background=10b981&color=fff" alt="user" className="w-full h-full rounded-full object-cover" />
        </div>
      </div>
    </header>
  );
};