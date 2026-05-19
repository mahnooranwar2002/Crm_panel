'use client'

import React, { useState } from 'react'
import { FiDownload, FiCalendar, FiX, FiTrendingUp, FiTrendingDown, FiPieChart } from 'react-icons/fi'

interface FinancialReportModalProps {
  isOpen: boolean
  onClose: () => void
  loading?: boolean
}

const FinancialReportModal: React.FC<FinancialReportModalProps> = ({
  isOpen,
  onClose,
  loading = false
}) => {
  const [reportType, setReportType] = useState('monthly')
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().split('T')[0].slice(0, 7))

  // Mock financial data
  const financialData = {
    totalIncome: 45000,
    totalExpenses: 18500,
    netProfit: 26500,
    projectedIncome: 52000,
    projectedExpenses: 21000,
    projectedProfit: 31000
  }

  const expenses = [
    { category: 'Maintenance', amount: 5200, percentage: 28 },
    { category: 'Labor', amount: 4800, percentage: 26 },
    { category: 'Materials', amount: 3500, percentage: 19 },
    { category: 'Equipment', amount: 2800, percentage: 15 },
    { category: 'Administrative', amount: 2200, percentage: 12 }
  ]

  const revenue = [
    { source: 'Rental Income', amount: 28000, percentage: 62 },
    { source: 'Property Sales', amount: 12000, percentage: 27 },
    { source: 'Service Fees', amount: 5000, percentage: 11 }
  ]

  const handleExportPDF = () => {
    console.log('Exporting PDF...')
  }

  const handleExportCSV = () => {
    console.log('Exporting CSV...')
  }

  if (!isOpen) return null

  return (
    /* Full screen backdrop blur glass overlay layout overlay */
    <div className="fixed inset-0 z-[9999] flex items-center justify-end bg-slate-900/40 backdrop-blur-md">
      <div className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        
        {/* Sticky Glassmorphic Header */}
        <div className="sticky top-0 p-6 border-b border-slate-100/80 flex items-center justify-between bg-white/80 backdrop-blur-md z-10">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Financial Reports</h2>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">Real estate revenue analytics & expense tracking</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
          >
            <FiX size={18} className="stroke-[2.5]" />
          </button>
        </div>

        {/* Scrollable Metrics Content Panel */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          
          {/* Report Type & Period Filter Segment */}
          <div className="grid grid-cols-2 gap-3 bg-white p-4 border border-slate-100 rounded-2xl shadow-xs">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Report Type</label>
              <div className="relative">
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-800 text-xs appearance-none focus:border-slate-900 transition-all"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-400 w-0 h-0"></div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Period</label>
              <div className="relative flex items-center">
                <FiCalendar size={14} className="absolute left-3 text-slate-400 pointer-events-none" />
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-800 text-xs focus:border-slate-900 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Core Summary Cards Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-3.5 relative overflow-hidden">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider block mb-1">Income</span>
              <p className="text-lg font-black text-emerald-800">${financialData.totalIncome.toLocaleString()}</p>
              <span className="text-[9px] font-bold text-emerald-600/80 bg-emerald-100 px-1.5 py-0.5 rounded-md mt-1.5 inline-block">Actual</span>
            </div>

            <div className="bg-rose-50/60 border border-rose-100 rounded-2xl p-3.5 relative overflow-hidden">
              <span className="text-[10px] font-black text-rose-600 uppercase tracking-wider block mb-1">Expenses</span>
              <p className="text-lg font-black text-rose-800">${financialData.totalExpenses.toLocaleString()}</p>
              <span className="text-[9px] font-bold text-rose-600/80 bg-rose-100 px-1.5 py-0.5 rounded-md mt-1.5 inline-block">Actual</span>
            </div>

            <div className="bg-sky-50/60 border border-sky-100 rounded-2xl p-3.5 relative overflow-hidden">
              <span className="text-[10px] font-black text-sky-600 uppercase tracking-wider block mb-1">Net Profit</span>
              <p className="text-lg font-black text-sky-800">${financialData.netProfit.toLocaleString()}</p>
              <span className="text-[9px] font-bold text-sky-600/80 bg-sky-100 px-1.5 py-0.5 rounded-md mt-1.5 inline-block">Actual</span>
            </div>
          </div>

          {/* Progress Targets Bar Matrix */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-2">
              <FiPieChart className="text-slate-400" size={16} />
              <h3 className="font-black text-xs text-slate-800 uppercase tracking-wider">Projected vs Actual</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-slate-500">Gross Income Target</span>
                  <div className="text-xs font-black">
                    <span className="text-emerald-600">${financialData.totalIncome.toLocaleString()}</span>
                    <span className="text-slate-300 mx-1">/</span>
                    <span className="text-slate-400 font-medium">${financialData.projectedIncome.toLocaleString()}</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((financialData.totalIncome / financialData.projectedIncome) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-slate-500">Expense Limit Cap</span>
                  <div className="text-xs font-black">
                    <span className="text-rose-600">${financialData.totalExpenses.toLocaleString()}</span>
                    <span className="text-slate-300 mx-1">/</span>
                    <span className="text-slate-400 font-medium">${financialData.projectedExpenses.toLocaleString()}</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((financialData.totalExpenses / financialData.projectedExpenses) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Income Streams Progress Distribution */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-2.5 mb-3.5">
              <FiTrendingUp className="text-emerald-500" size={16} />
              <h3 className="font-black text-xs text-slate-800 uppercase tracking-wider">Income Streams Breakdown</h3>
            </div>
            
            <div className="space-y-3.5">
              {revenue.map((item) => (
                <div key={item.source} className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-700">{item.source}</p>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right min-w-[70px]">
                    <p className="text-xs font-black text-slate-900">${item.amount.toLocaleString()}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">{item.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Capital Allocation Progress Matrix */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-50 pb-2.5 mb-3.5">
              <FiTrendingDown className="text-rose-500" size={16} />
              <h3 className="font-black text-xs text-slate-800 uppercase tracking-wider">Capital Outflow Metrics</h3>
            </div>
            
            <div className="space-y-3.5">
              {expenses.map((item) => (
                <div key={item.category} className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-700">{item.category}</p>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
                      <div
                        className="bg-rose-400 h-full rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right min-w-[70px]">
                    <p className="text-xs font-black text-slate-900">${item.amount.toLocaleString()}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">{item.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Sticky Glassmorphic Footer Action Triggers */}
        <div className="sticky bottom-0 p-4 border-t border-slate-100 flex flex-col gap-2 bg-white/90 backdrop-blur-md">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleExportPDF}
              className="py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-wider hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xs active:scale-98"
            >
              <FiDownload size={14} className="stroke-[2.5]" /> PDF Report
            </button>
            <button
              type="button"
              onClick={handleExportCSV}
              className="py-3 bg-slate-100 border border-slate-200 text-slate-700 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-slate-200 transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <FiDownload size={14} className="stroke-[2.5]" /> CSV Sheet
            </button>
          </div>
          
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 border border-slate-200 rounded-xl text-slate-400 font-bold text-[11px] uppercase tracking-widest hover:text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Close Panel
          </button>
        </div>

      </div>
    </div>
  )
}

export default FinancialReportModal