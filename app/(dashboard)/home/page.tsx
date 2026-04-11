// import React from 'react'
// import HomeTable from '@/components/ui/HomeTable'

// export default function LeadsManagement() {
//   return (
//     <div className="w-full">
//           <HomeTable />
//     </div>
//   )
// }

"use client"
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { FiUsers, FiTarget, FiActivity, FiBriefcase } from 'react-icons/fi';

// Dummy Data (Aap isay baad mein API se replace karenge)
const data = [
  { name: 'Jan', leads: 400, deals: 240 },
  { name: 'Feb', leads: 300, deals: 139 },
  { name: 'Mar', leads: 200, deals: 980 },
  { name: 'Apr', leads: 278, deals: 390 },
  { name: 'May', leads: 189, deals: 480 },
  { name: 'Jun', leads: 239, deals: 380 },
];

const DashboardHome = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* 1. Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Companies', value: '128', icon: <FiBriefcase />, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active Leads', value: '450', icon: <FiUsers />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Opportunities', value: '$45.2k', icon: <FiTarget />, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Recent Logs', value: '24', icon: <FiActivity />, color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-2xl ${item.bg} ${item.color} text-2xl`}>{item.icon}</div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                <h3 className="text-2xl font-bold text-slate-800">{item.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Main Charts Row (Power BI Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart: Leads vs Deals */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 uppercase tracking-tight">Performance Analytics</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="leads" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="deals" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Area Chart: Revenue Trend */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 uppercase tracking-tight">Revenue Forecast</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorDeals" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip />
                <Area type="monotone" dataKey="deals" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorDeals)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. Recent Activity Table */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Recent Opportunities</h3>
          <button className="text-sm font-bold text-blue-600 hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[2px]">
              <tr>
                <th className="px-8 py-4">Title</th>
                <th className="px-8 py-4">Stage</th>
                <th className="px-8 py-4">Amount</th>
                <th className="px-8 py-4">Probability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { title: 'Website Dev Project', stage: 'Proposal', amount: '$5,000', prob: '70%' },
                { title: 'SEO Optimization', stage: 'Negotiation', amount: '$1,200', prob: '40%' },
                { title: 'Mobile App UI', stage: 'Discovery', amount: '$8,500', prob: '20%' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-5 text-sm font-bold text-slate-700">{row.title}</td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase">
                      {row.stage}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-600">{row.amount}</td>
                  <td className="px-8 py-5 text-sm font-bold text-emerald-600">{row.prob}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;