'use client'

import React from 'react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'

// 1. Medical Reports Dashboard Main
export function MedicalReportsDashboard() {
  return (
    <div className="w-full bg-slate-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Revenue Analytics</h1>
            <p className="text-slate-500 font-medium mt-1">Real-time clinical performance and financial health metrics.</p>
          </div>
          <div className="flex gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
            <button className="px-4 py-2 text-xs font-bold bg-slate-900 text-white rounded-lg">Last 30 Days</button>
            <button className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-lg transition-all">Quarterly</button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard title="Days in AR" value="34.5" trend="-2.4%" color="text-blue-600" />
          <KPICard title="Clean Claim Rate" value="94.2%" trend="+0.8%" color="text-emerald-600" />
          <KPICard title="Denial Rate" value="3.8%" trend="+0.1%" color="text-rose-600" />
          <KPICard title="Total Revenue" value="$125,450" trend="+14.2%" color="text-indigo-600" />
        </div>

        {/* Main Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <RevenueCycleMetrics />
          <PayerMixReport />
        </div>

        {/* Secondary Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ARAgingReport />
          </div>
          <div className="lg:col-span-1">
            <ClaimMetricsDashboard />
          </div>
        </div>
        
        <div className="mt-8">
           <ProviderProductionReport />
        </div>
      </div>
    </div>
  )
}

// Reusable KPI Card
function KPICard({ title, value, trend, color }: any) {
  const isPositive = trend.startsWith('+');
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <div className="flex justify-between items-end">
        <p className={`text-3xl font-black tracking-tighter ${color}`}>{value}</p>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {trend}
        </span>
      </div>
    </div>
  )
}

// 2. Revenue Cycle Metrics (Line/Area Chart)
export function RevenueCycleMetrics() {
  const data = [
    { month: 'Jan', charges: 45000, payments: 38000, adjustments: 5000 },
    { month: 'Feb', charges: 52000, payments: 44000, adjustments: 6000 },
    { month: 'Mar', charges: 48000, payments: 42000, adjustments: 5500 },
    { month: 'Apr', charges: 61000, payments: 51000, adjustments: 7000 }
  ]

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
      <h2 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Revenue Cycle Performance</h2>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorCharges" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
          <Tooltip 
            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
          />
          <Legend iconType="circle" />
          <Area type="monotone" dataKey="charges" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCharges)" />
          <Area type="monotone" dataKey="payments" stroke="#10b981" strokeWidth={3} fillOpacity={0} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

// 3. Payer Mix Report (Pie Chart)
export function PayerMixReport() {
  const data = [
    { name: 'Medicare', value: 35 },
    { name: 'Commercial', value: 45 },
    { name: 'Medicaid', value: 15 },
    { name: 'Self-Pay', value: 5 }
  ]
  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e']

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
      <h2 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Payer Mix Analysis</h2>
      <div className="flex flex-col md:flex-row items-center">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={data} innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value">
              {data.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="w-full md:w-48 space-y-3">
          {data.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center p-2 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                <span className="text-xs font-bold text-slate-600">{item.name}</span>
              </div>
              <span className="text-xs font-black text-slate-900">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// 4. AR Aging Report (Bar Chart)
export function ARAgingReport() {
  const data = [
    { range: '0-30', amount: 45000 },
    { range: '31-60', amount: 32000 },
    { range: '61-90', amount: 18000 },
    { range: '90+', amount: 8450 }
  ]

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
      <div className="flex justify-between items-start mb-8">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">AR Aging Distribution</h2>
        <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase">Total AR</p>
            <p className="text-lg font-black text-indigo-600">$103,450</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
          <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
          <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none' }} />
          <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// 5. Provider Production Report (Table)
export function ProviderProductionReport() {
  const data = [
    { provider: 'Dr. Smith', claims: 45, collections: 38000, rate: '94.2%' },
    { provider: 'Dr. Johnson', claims: 38, collections: 32000, rate: '92.1%' },
    { provider: 'Dr. Williams', claims: 52, collections: 44000, rate: '96.3%' }
  ]

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-slate-100">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Provider Performance Ledger</h2>
      </div>
      <table className="w-full text-left">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Provider Name</th>
            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Claims</th>
            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Collections</th>
            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Clean Rate</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-8 py-4 font-bold text-slate-900">{row.provider}</td>
              <td className="px-8 py-4 text-slate-600 font-medium">{row.claims}</td>
              <td className="px-8 py-4 font-bold text-slate-900">${row.collections.toLocaleString()}</td>
              <td className="px-8 py-4 text-right">
                <span className="px-3 py-1 rounded-lg text-xs font-black bg-emerald-50 text-emerald-600 border border-emerald-100">{row.rate}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// 6. Claim Metrics Dashboard
export function ClaimMetricsDashboard() {
  const data = [
    { status: 'Paid', count: 165 },
    { status: 'Pending', count: 45 },
    { status: 'Denied', count: 8 }
  ]

  return (
    <div className="bg-indigo-600 rounded-3xl p-8 text-white h-full shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
            <div className="w-32 h-32 border-8 border-white rounded-full"></div>
        </div>
        <h2 className="text-xl font-black mb-8 relative z-10">Claim Status</h2>
        <div className="space-y-6 relative z-10">
            {data.map((item, i) => (
                <div key={i}>
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest mb-2 text-indigo-200">
                        <span>{item.status}</span>
                        <span>{item.count}</span>
                    </div>
                    <div className="w-full bg-indigo-700/50 h-2 rounded-full overflow-hidden">
                        <div 
                            className="bg-white h-full rounded-full" 
                            style={{ width: `${(item.count / 218) * 100}%` }}
                        ></div>
                    </div>
                </div>
            ))}
        </div>
        <div className="mt-10 pt-6 border-t border-indigo-500/30">
            <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Throughput Rate</p>
            <p className="text-2xl font-black mt-1">82.4%</p>
        </div>
    </div>
  )
}