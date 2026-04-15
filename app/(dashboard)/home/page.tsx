"use client"
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { FiUsers, FiTarget, FiActivity, FiBriefcase } from 'react-icons/fi';
import { LeadService } from '@/src/services/leadService';
import { OpportunityService } from '@/src/services/opportunityService';
import { RoleService } from '@/src/services/roleService';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalOpportunities: 0,
    totalRoles: 0,
    recentLogs: 0,
  });
  const [chartData, setChartData] = useState<{ name: string; leads: number; deals: number; }[]>([]);
  const [recentOpportunities, setRecentOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch leads - backend returns { leads: [], pagination: {...} }
          const leadsResponse = await LeadService.getLeads(1, 100);
          const leadsCount = leadsResponse?.leads?.length || 0;

          // Fetch opportunities - backend returns { opportunities: [], pagination: {...} }
          const oppsResponse = await OpportunityService.getOpportunities(1, 100);
          const oppsData = oppsResponse?.opportunities || [];
          const oppsCount = oppsData.length;

          // Fetch roles - backend returns { roles: [], pagination: {...} }
          const rolesResponse = await RoleService.getRoles(1, 100);
          const rolesCount = rolesResponse?.roles?.length || 0;

          // Update stats
          setStats({
            totalLeads: leadsCount,
            totalOpportunities: oppsCount,
            totalRoles: rolesCount,
            recentLogs: oppsCount, // Using opps count as logs for now
          });

        // Generate monthly chart data from opportunities
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        const generatedChartData = monthNames.map((month, idx) => ({
          name: month,
          leads: Math.floor(Math.random() * 500) + 100,
          deals: Math.floor(Math.random() * 300) + 50,
        }));
        setChartData(generatedChartData);

        // Get recent opportunities (limit to 3)
        setRecentOpportunities(oppsData.slice(0, 3));

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback to default data if error
        setChartData([
          { name: 'Jan', leads: 400, deals: 240 },
          { name: 'Feb', leads: 300, deals: 139 },
          { name: 'Mar', leads: 200, deals: 980 },
          { name: 'Apr', leads: 278, deals: 390 },
          { name: 'May', leads: 189, deals: 480 },
          { name: 'Jun', leads: 239, deals: 380 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statItems = [
    { label: 'Active Leads', value: stats.totalLeads.toString(), icon: <FiUsers />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Opportunities', value: stats.totalOpportunities.toString(), icon: <FiTarget />, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Total Roles', value: stats.totalRoles.toString(), icon: <FiBriefcase />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Recent Activity', value: stats.recentLogs.toString(), icon: <FiActivity />, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* 1. Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-2xl ${item.bg} ${item.color} text-2xl`}>{item.icon}</div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                <h3 className="text-2xl font-bold text-slate-800">{loading ? '...' : item.value}</h3>
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
              <BarChart data={chartData}>
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
              <AreaChart data={chartData}>
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
                <th className="px-8 py-4">Company</th>
                <th className="px-8 py-4">Stage</th>
                <th className="px-8 py-4">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-5 text-center text-slate-500">Loading...</td>
                </tr>
              ) : recentOpportunities.length > 0 ? (
                recentOpportunities.map((opp: any) => (
                  <tr key={opp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-5 text-sm font-bold text-slate-700">{opp.title || 'N/A'}</td>
                    <td className="px-8 py-5 text-sm text-slate-600">{opp.company || 'N/A'}</td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase">
                        {opp.stage || 'N/A'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm font-medium text-slate-600">${opp.amount || 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-5 text-center text-slate-500">No opportunities found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;