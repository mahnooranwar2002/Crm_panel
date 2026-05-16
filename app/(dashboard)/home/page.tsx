"use client"
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { FiDollarSign, FiBox, FiTrendingUp, FiCheckCircle, FiUsers, FiFileText, FiActivity, FiHome, FiTrendingDown, FiClock, FiPlus } from 'react-icons/fi';

const DashboardHome = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  // Monthly Overview Data
  const monthlyData = [
    { name: 'Jan', companies: 12, leads: 45, opportunities: 23, financial: 8500, marketing: 3200, medical: 5400, software: 6200, realEstate: 4100 },
    { name: 'Feb', companies: 15, leads: 52, opportunities: 28, financial: 9200, marketing: 3800, medical: 5800, software: 6800, realEstate: 4500 },
    { name: 'Mar', companies: 18, leads: 68, opportunities: 35, financial: 10500, marketing: 4500, medical: 6200, software: 7400, realEstate: 5200 },
    { name: 'Apr', companies: 22, leads: 73, opportunities: 42, financial: 11800, marketing: 5200, medical: 6800, software: 8100, realEstate: 5900 },
    { name: 'May', companies: 25, leads: 85, opportunities: 48, financial: 13200, marketing: 6100, medical: 7400, software: 8900, realEstate: 6700 },
    { name: 'Jun', companies: 28, leads: 92, opportunities: 54, financial: 14500, marketing: 6800, medical: 8100, software: 9600, realEstate: 7400 },
  ];

  // Department Performance Data
  const departmentData = [
    { name: 'Financial', value: 28, color: '#3b82f6' },
    { name: 'Marketing', value: 22, color: '#10b981' },
    { name: 'Medical', value: 20, color: '#f59e0b' },
    { name: 'Software', value: 18, color: '#8b5cf6' },
    { name: 'Real Estate', value: 12, color: '#ec4899' },
  ];

  // Company Performance Data
  const companyData = [
    { company: 'Tech Innovations Inc', revenue: 45000, status: 'Active', employees: 125, deals: 18 },
    { company: 'Global Solutions Ltd', revenue: 38000, status: 'Active', employees: 98, deals: 14 },
    { company: 'Digital Enterprise Co', revenue: 52000, status: 'Active', employees: 156, deals: 22 },
    { company: 'Financial Partners LLC', revenue: 61000, status: 'Active', employees: 178, deals: 28 },
    { company: 'Healthcare Systems Inc', revenue: 55000, status: 'Active', employees: 142, deals: 25 },
  ];

  // Leads Data
  const leadsData = [
    { name: 'John Smith', company: 'Tech Corp', status: 'Hot', value: 45000, source: 'LinkedIn', date: '2024-05-10' },
    { name: 'Sarah Johnson', company: 'Finance Plus', status: 'Warm', value: 32000, source: 'Email', date: '2024-05-09' },
    { name: 'Michael Davis', company: 'Consulting Group', status: 'Hot', value: 58000, source: 'Referral', date: '2024-05-11' },
    { name: 'Emily Wilson', company: 'Retail Solutions', status: 'Cold', value: 28000, source: 'Website', date: '2024-05-08' },
    { name: 'Robert Martinez', company: 'Manufacturing Co', status: 'Warm', value: 42000, source: 'Phone', date: '2024-05-07' },
  ];

  // Opportunities Data
  const opportunitiesData = [
    { opportunity: 'Enterprise Cloud Migration', stage: 'Proposal', value: 125000, probability: 75, closeDate: '2024-06-15' },
    { opportunity: 'Marketing Automation Platform', stage: 'Negotiation', value: 85000, probability: 85, closeDate: '2024-06-01' },
    { opportunity: 'Medical Records System', stage: 'Demo', value: 95000, probability: 60, closeDate: '2024-07-01' },
    { opportunity: 'Real Estate Portal Development', stage: 'Proposal', value: 110000, probability: 70, closeDate: '2024-06-30' },
    { opportunity: 'Financial Analytics Dashboard', stage: 'Negotiation', value: 105000, probability: 80, closeDate: '2024-06-20' },
  ];

  // Marketing Campaigns Data
  const campaignData = [
    { campaign: 'Spring Email Campaign', type: 'Email', status: 'Active', leads: 342, conversions: 28, roi: '245%' },
    { campaign: 'Social Media Blitz', type: 'Social', status: 'Active', leads: 567, conversions: 45, roi: '312%' },
    { campaign: 'Content Marketing Series', type: 'Content', status: 'Completed', leads: 234, conversions: 18, roi: '189%' },
    { campaign: 'Webinar Series', type: 'Webinar', status: 'Active', leads: 456, conversions: 52, roi: '428%' },
  ];

  // Medical Data
  const medicalData = [
    { provider: 'Dr. Sarah Wilson', specialty: 'Cardiology', patients: 145, appointments: 12, revenue: 18500 },
    { provider: 'Dr. James Brown', specialty: 'Pediatrics', patients: 168, appointments: 15, revenue: 22300 },
    { provider: 'Dr. Lisa Anderson', specialty: 'Neurology', patients: 132, appointments: 10, revenue: 16800 },
    { provider: 'Dr. David Clark', specialty: 'Orthopedics', patients: 156, appointments: 14, revenue: 20100 },
  ];

  // Software Projects Data
  const softwareProjects = [
    { project: 'CRM Mobile App', status: 'In Progress', progress: 75, team: 6, deadline: '2024-06-30' },
    { project: 'Analytics Dashboard', status: 'In Progress', progress: 60, team: 4, deadline: '2024-07-15' },
    { project: 'API Integration', status: 'Completed', progress: 100, team: 3, deadline: '2024-05-01' },
    { project: 'Database Migration', status: 'In Progress', progress: 45, team: 5, deadline: '2024-08-01' },
  ];

  // Real Estate Data
  const realEstateData = [
    { property: 'Downtown Office Complex', type: 'Commercial', price: 2500000, status: 'Sold', sqft: 45000, beds: 0 },
    { property: 'Luxury Residential Tower', type: 'Residential', price: 3800000, status: 'Active', sqft: 85000, beds: 120 },
    { property: 'Shopping Mall Development', type: 'Commercial', price: 4200000, status: 'Active', sqft: 120000, beds: 0 },
    { property: 'Suburban Homes Project', type: 'Residential', price: 1900000, status: 'Sold', sqft: 35000, beds: 25 },
  ];

  // Stat Cards Data
  const statCards = [
    { label: 'Total Companies', value: '28', icon: <FiBox />, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Active Leads', value: '85', icon: <FiUsers />, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Total Opportunities', value: '54', icon: <FiTrendingUp />, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Financial Revenue', value: '$14.5M', icon: <FiDollarSign />, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Marketing Campaigns', value: '12', icon: <FiFileText />, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Medical Patients', value: '601', icon: <FiActivity />, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Software Projects', value: '8', icon: <FiCheckCircle />, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'Real Estate Properties', value: '24', icon: <FiHome />, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen space-y-6 font-sans">
      {/* Header Area */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">CRM Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back! Here's your business overview.</p>
        </div>
        
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Left Section: Stats & Main Charts */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          
          {/* Top Stat Cards (8 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {statCards.map((card, i) => (
              <div key={i} className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow flex justify-between items-start border border-slate-100">
                <div>
                  <p className="text-xs text-slate-500 font-medium">{card.label}</p>
                  <h3 className="text-xl font-bold mt-1 text-slate-800">{card.value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${card.bg} ${card.color}`}>{card.icon}</div>
              </div>
            ))}
          </div>

          {/* Monthly Overview Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Monthly Business Performance</h3>
                <p className="text-xs text-slate-500 mt-1">All departments combined revenue and activities</p>
              </div>
            </div>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff'}}
                    cursor={{fill: 'rgba(59, 130, 246, 0.1)'}}
                  />
                  <Bar dataKey="financial" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="marketing" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="medical" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Two Column Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Companies & Leads Trend */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-6">Companies & Leads Trend</h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff'}} />
                    <Legend />
                    <Line type="monotone" dataKey="companies" stroke="#3b82f6" strokeWidth={2} dot={{fill: '#3b82f6', r: 4}} />
                    <Line type="monotone" dataKey="leads" stroke="#10b981" strokeWidth={2} dot={{fill: '#10b981', r: 4}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Department Performance */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-6">Department Performance</h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} deals`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Companies Table */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">Top Companies</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">Company Name</th>
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">Revenue</th>
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">Employees</th>
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">Deals</th>
                  </tr>
                </thead>
                <tbody>
                  {companyData.map((row, i) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition">
                      <td className="py-3 px-4 text-slate-700">{row.company}</td>
                      <td className="py-3 px-4 text-slate-700 font-semibold">${row.revenue.toLocaleString()}</td>
                      <td className="py-3 px-4"><span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">{row.status}</span></td>
                      <td className="py-3 px-4 text-slate-700">{row.employees}</td>
                      <td className="py-3 px-4 text-slate-700">{row.deals}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Leads Table */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">Recent Leads</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">Lead Name</th>
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">Company</th>
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">Value</th>
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {leadsData.map((row, i) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition">
                      <td className="py-3 px-4 text-slate-700">{row.name}</td>
                      <td className="py-3 px-4 text-slate-700">{row.company}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          row.status === 'Hot' ? 'bg-red-100 text-red-700' :
                          row.status === 'Warm' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>{row.status}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-semibold">${row.value.toLocaleString()}</td>
                      <td className="py-3 px-4 text-slate-700">{row.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Opportunities Table */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">Active Opportunities</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">Opportunity</th>
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">Stage</th>
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">Value</th>
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">Probability</th>
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">Close Date</th>
                  </tr>
                </thead>
                <tbody>
                  {opportunitiesData.map((row, i) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition">
                      <td className="py-3 px-4 text-slate-700">{row.opportunity}</td>
                      <td className="py-3 px-4 text-slate-700">{row.stage}</td>
                      <td className="py-3 px-4 text-slate-700 font-semibold">${row.value.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{width: `${row.probability}%`}}></div>
                          </div>
                          <span className="text-slate-700 font-medium">{row.probability}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-700">{row.closeDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Marketing Campaigns Table */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">Marketing Campaigns</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">Campaign Name</th>
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">Type</th>
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">Leads Generated</th>
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">Conversions</th>
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">ROI</th>
                  </tr>
                </thead>
                <tbody>
                  {campaignData.map((row, i) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition">
                      <td className="py-3 px-4 text-slate-700">{row.campaign}</td>
                      <td className="py-3 px-4 text-slate-700">{row.type}</td>
                      <td className="py-3 px-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${row.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>{row.status}</span></td>
                      <td className="py-3 px-4 text-slate-700">{row.leads}</td>
                      <td className="py-3 px-4 text-slate-700 font-semibold">{row.conversions}</td>
                      <td className="py-3 px-4 text-emerald-600 font-semibold">{row.roi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Medical Data Table */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">Medical - Healthcare Providers</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">Provider Name</th>
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">Specialty</th>
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">Patients</th>
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">Appointments</th>
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {medicalData.map((row, i) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition">
                      <td className="py-3 px-4 text-slate-700">{row.provider}</td>
                      <td className="py-3 px-4 text-slate-700">{row.specialty}</td>
                      <td className="py-3 px-4 text-slate-700">{row.patients}</td>
                      <td className="py-3 px-4 text-slate-700">{row.appointments}</td>
                      <td className="py-3 px-4 text-slate-700 font-semibold">${row.revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Software Projects Table */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">Software Projects</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">Project Name</th>
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">Progress</th>
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">Team Size</th>
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {softwareProjects.map((row, i) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition">
                      <td className="py-3 px-4 text-slate-700">{row.project}</td>
                      <td className="py-3 px-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${row.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>{row.status}</span></td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{width: `${row.progress}%`}}></div>
                          </div>
                          <span className="text-slate-700 font-medium">{row.progress}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-700">{row.team}</td>
                      <td className="py-3 px-4 text-slate-700">{row.deadline}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Real Estate Table */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">Real Estate - Properties</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">Property Name</th>
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">Type</th>
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">Price</th>
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 text-slate-600 font-semibold">Square Feet</th>
                  </tr>
                </thead>
                <tbody>
                  {realEstateData.map((row, i) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition">
                      <td className="py-3 px-4 text-slate-700">{row.property}</td>
                      <td className="py-3 px-4 text-slate-700">{row.type}</td>
                      <td className="py-3 px-4 text-slate-700 font-semibold">${row.price.toLocaleString()}</td>
                      <td className="py-3 px-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${row.status === 'Sold' ? 'bg-slate-100 text-slate-700' : 'bg-emerald-100 text-emerald-700'}`}>{row.status}</span></td>
                      <td className="py-3 px-4 text-slate-700">{row.sqft.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Key Metrics */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          {/* Total Earning Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-slate-500 text-sm font-medium">Total Earning</h3>
            <h2 className="text-3xl font-bold text-slate-800 mt-2">$487,250</h2>
            
            <div className="flex gap-4 mt-6 border-b border-slate-100 pb-3">
              <button className="text-blue-600 border-b-2 border-blue-600 pb-2 text-sm font-semibold">Day</button>
              <button className="text-slate-400 text-sm font-medium hover:text-slate-600">Week</button>
              <button className="text-slate-400 text-sm font-medium hover:text-slate-600">Month</button>
            </div>

            <div className="mt-6">
               <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="colorEarn" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="financial" stroke="#3b82f6" fillOpacity={1} fill="url(#colorEarn)" strokeWidth={3} />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm text-slate-600 font-medium">Conversion Rate</h4>
                <span className="text-emerald-600 text-sm font-bold">↑ 12.5%</span>
              </div>
              <p className="text-2xl font-bold text-slate-800">42.3%</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm text-slate-600 font-medium">Average Deal Size</h4>
                <span className="text-emerald-600 text-sm font-bold">↑ 8.2%</span>
              </div>
              <p className="text-2xl font-bold text-slate-800">$89,450</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm text-slate-600 font-medium">Pipeline Value</h4>
                <span className="text-emerald-600 text-sm font-bold">↑ 24.1%</span>
              </div>
              <p className="text-2xl font-bold text-slate-800">$2.8M</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm text-slate-600 font-medium">Active Users</h4>
                <span className="text-emerald-600 text-sm font-bold">↑ 18.3%</span>
              </div>
              <p className="text-2xl font-bold text-slate-800">1,284</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { activity: 'New lead from Tech Corp', time: '2 hours ago', icon: '📝' },
                { activity: 'Opportunity won - $125K deal', time: '4 hours ago', icon: '🎉' },
                { activity: 'Marketing campaign started', time: '6 hours ago', icon: '📢' },
                { activity: 'Medical appointment scheduled', time: '1 day ago', icon: '📋' },
                { activity: 'Real estate property listed', time: '2 days ago', icon: '🏠' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3 pb-3 border-b border-slate-100 last:border-0">
                  <span className="text-lg">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 line-clamp-1">{item.activity}</p>
                    <p className="text-xs text-slate-400 mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DashboardHome;