'use client'

import React, { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiCheckCircle, FiXCircle, FiRefreshCw, FiX, FiEye, FiSearch, FiFilter, FiFile } from 'react-icons/fi'
import { ExpensesService, type Expense } from '@/src/services/financial/ExpensesService'

const ExpensesTable = () => {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [viewingExpense, setViewingExpense] = useState<Expense | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('All')

  const [formData, setFormData] = useState<Expense>({
    expense_name: '',
    category: 'Office',
    amount: '',
    currency: 'USD',
    expense_date: Date.now(),
    submitted_by: 'John Doe',
    status: 'Submitted',
    notes: '',
  })

  const emptyExpense: Expense = {
    expense_name: '',
    category: 'Office',
    amount: '',
    currency: 'USD',
    expense_date: Date.now(),
    submitted_by: 'John Doe',
    status: 'Submitted',
    notes: '',
  }

  // --- Core Logic ---
  useEffect(() => { loadExpenses() }, [])

  const loadExpenses = async () => {
    setLoading(true)
    try {
      const data = await ExpensesService.getAllExpenses()
      setExpenses(data)
    } catch (error) { console.error('Error loading expenses:', error) }
    finally { setLoading(false) }
  }

  const handleAddNew = () => {
    setFormData(emptyExpense)
    setIsEditing(false)
    setEditingId(null)
    setShowModal(true)
  }

  const handleEdit = (expense: Expense) => {
    setFormData(expense)
    setIsEditing(true)
    setEditingId(expense._id || null)
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      try {
        await ExpensesService.deleteExpense(id)
        loadExpenses()
      } catch (error) { console.error(error) }
    }
  }

  const handleSave = async () => {
    if (!formData.expense_name || !formData.amount) {
      alert('Please fill in all required fields')
      return
    }
    try {
      if (isEditing && editingId) { await ExpensesService.updateExpense(editingId, formData) }
      else { await ExpensesService.createExpense(formData) }
      loadExpenses()
      setShowModal(false)
    } catch (error) { console.error(error) }
  }

  // --- Approval Logic ---
  const handleApprove = async (id: string) => {
    try { await ExpensesService.approveExpense(id, 'Manager Name'); loadExpenses(); } catch (error) { console.error(error) }
  }

  const handleReject = async (id: string) => {
    try { await ExpensesService.rejectExpense(id); loadExpenses(); } catch (error) { console.error(error) }
  }

  const handleMarkReimbursed = async (id: string) => {
    try { await ExpensesService.markAsReimbursed(id); loadExpenses(); } catch (error) { console.error(error) }
  }

  // --- UI Helpers matching ClaimsTable ---
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Submitted':
        return 'bg-blue-50 text-blue-600 border-blue-100'
      case 'Approved':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100'
      case 'Rejected':
        return 'bg-red-50 text-red-600 border-red-100'
      case 'Reimbursed':
        return 'bg-purple-50 text-purple-600 border-purple-100'
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100'
    }
  }

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.expense_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          expense.submitted_by.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'All' || expense.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="w-full bg-slate-50 min-h-screen p-6 text-black">
      <div className="max-w-7xl mx-auto">
        {/* Header Block matched with ClaimsTable style */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Financial Expenses</h1>
            <p className="text-slate-500 font-medium">Track and manage company spending</p>
          </div>
          <button
            onClick={handleAddNew}
            className="bg-[#21a9ff] text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-600 shadow-lg shadow-blue-100 transition-all font-bold"
          >
            <FiPlus size={20} /> New Expense
          </button>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search expenses or people..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium"
            />
          </div>
          <div className="relative">
            <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-12 pr-10 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none font-bold text-slate-600 text-sm cursor-pointer"
            >
              <option>All</option>
              <option>Submitted</option>
              <option>Approved</option>
              <option>Rejected</option>
              <option>Reimbursed</option>
            </select>
          </div>
        </div>

        {/* Table Wrapper matched with ClaimsTable style */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Expense ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Expense Label</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center opacity-40 animate-pulse">
                        <p className="font-bold text-slate-500">Loading data...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center opacity-40">
                        <FiFile size={48} className="mb-2" />
                        <p className="font-medium text-slate-500">No records found in the database</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((expense) => (
                    <tr key={expense._id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 font-mono text-sm text-slate-600">
                        #{expense._id ? expense._id.substring(0, 8) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        <div>
                          <p>{expense.expense_name}</p>
                          <p className="text-xs text-slate-400 font-normal mt-0.5">By: {expense.submitted_by}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        ${parseFloat(expense.amount).toFixed(2)} <span className="text-[10px] font-bold text-slate-400 uppercase ml-0.5">{expense.currency}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase border ${getStatusColor(expense.status)}`}>
                          {expense.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-sm font-medium">
                        <span className="bg-slate-100 px-2 py-0.5 rounded-md text-xs font-bold text-slate-500 uppercase tracking-tight">
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-sm font-medium">
                        {new Date(expense.expense_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                        <button 
                          onClick={() => setViewingExpense(expense)} 
                          className="text-slate-400 hover:text-green-600 transition-colors"
                          title="View Detail"
                        >
                          <FiEye size={18} />
                        </button>
                        <button 
                          onClick={() => handleEdit(expense)} 
                          className="text-slate-400 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        
                        {/* Status specific actions */}
                        {expense.status === 'Submitted' && (
                          <>
                            <button onClick={() => handleApprove(expense._id || '')} className="text-slate-400 hover:text-emerald-600 transition-colors" title="Approve"><FiCheckCircle size={18} /></button>
                            <button onClick={() => handleReject(expense._id || '')} className="text-slate-400 hover:text-red-600 transition-colors" title="Reject"><FiXCircle size={18} /></button>
                          </>
                        )}
                        {expense.status === 'Approved' && (
                          <button onClick={() => handleMarkReimbursed(expense._id || '')} className="text-slate-400 hover:text-purple-600 transition-colors" title="Reimburse"><FiRefreshCw size={18} /></button>
                        )}
                        
                        <button 
                          onClick={() => handleDelete(expense._id || '')} 
                          className="text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- View Sidebar --- */}
      {viewingExpense && (
        <>
          <div
            className="fixed inset-0 z-[998] bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setViewingExpense(null)}
          />
          <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl z-[999] animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h2 className="text-2xl font-black text-slate-800">
                  Expense Details
                </h2>
                <button
                  onClick={() => setViewingExpense(null)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <label className="block text-[10px] font-bold text-blue-600 uppercase mb-1">Total Amount</label>
                  <p className="text-2xl font-black text-blue-900">${viewingExpense.amount} <span className="text-xs font-bold text-blue-400 uppercase">{viewingExpense.currency}</span></p>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Expense Label</label>
                  <p className="font-bold text-slate-700">{viewingExpense.expense_name}</p>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</label>
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase inline-block border ${getStatusColor(viewingExpense.status)}`}>
                    {viewingExpense.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Category</label>
                  <p className="font-bold text-slate-700">{viewingExpense.category}</p>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Submitted By</label>
                  <p className="font-bold text-slate-700">{viewingExpense.submitted_by}</p>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date</label>
                  <p className="font-bold text-slate-700">{new Date(viewingExpense.expense_date).toLocaleDateString()}</p>
                </div>

                {viewingExpense.notes && (
                  <div className="space-y-1 pt-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Internal Notes</label>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 italic text-sm text-slate-600">
                      "{viewingExpense.notes}"
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* CREATE/EDIT SIDEBAR */}
      {showModal && (
        <>
          <div
            className="fixed inset-0 z-[998] bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl z-[999] animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h2 className="text-2xl font-black text-slate-800">
                  {isEditing ? 'Edit Expense' : 'Add New Expense'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Expense Label *</label>
                  <input
                    type="text"
                    value={formData.expense_name}
                    onChange={(e) => setFormData({ ...formData, expense_name: e.target.value })}
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm"
                    placeholder="e.g. Server Hosting"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Amount *</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm"
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none font-medium text-slate-600 cursor-pointer text-sm focus:border-blue-500 focus:bg-white transition-all"
                  >
                    <option>Travel</option><option>Equipment</option><option>Office</option>
                    <option>Utilities</option><option>Software</option><option>Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Date</label>
                  <input
                    type="date"
                    value={new Date(formData.expense_date).toISOString().split('T')[0]}
                    onChange={(e) => setFormData({ ...formData, expense_date: new Date(e.target.value).getTime() })}
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none font-medium text-slate-600 cursor-pointer text-sm focus:border-blue-500 focus:bg-white transition-all"
                  >
                    <option>USD</option><option>EUR</option><option>PKR</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Submitted By</label>
                  <input
                    type="text"
                    value={formData.submitted_by}
                    onChange={(e) => setFormData({ ...formData, submitted_by: e.target.value })}
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Internal Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm resize-none"
                    placeholder="Describe this expense..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 font-bold text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-3 rounded-2xl transition-all shadow-lg shadow-blue-100 active:scale-95"
                  >
                    Save Record
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ExpensesTable