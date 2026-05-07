'use client'

import React, { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiCheckCircle, FiXCircle, FiRefreshCw, FiX, FiEye, FiSearch, FiFilter } from 'react-icons/fi'
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

  // --- Core Logic (Unchanged) ---
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

  // --- UI Helpers ---
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-700'
      case 'Submitted': return 'bg-blue-100 text-blue-700'
      case 'Rejected': return 'bg-red-100 text-red-700'
      case 'Reimbursed': return 'bg-purple-100 text-purple-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.expense_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          expense.submitted_by.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'All' || expense.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-8 max-w-7xl mx-auto text-slate-800 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Financial Expenses</h1>
          <p className="text-slate-500 font-medium">Track and manage company spending</p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-[#21a9ff] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-blue-200 hover:scale-[1.03] active:scale-95 transition-all"
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
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 outline-none transition-all"
          />
        </div>
        <div className="relative">
          <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="pl-12 pr-10 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/5 outline-none appearance-none font-bold text-slate-600"
          >
            <option>All</option>
            <option>Submitted</option>
            <option>Approved</option>
            <option>Rejected</option>
            <option>Reimbursed</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-left text-xs font-black uppercase tracking-widest text-slate-400">Expense Detail</th>
                <th className="px-8 py-6 text-left text-xs font-black uppercase tracking-widest text-slate-400">Amount</th>
                <th className="px-8 py-6 text-left text-xs font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-8 py-6 text-right text-xs font-black uppercase tracking-widest text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={4} className="px-8 py-20 text-center font-bold text-slate-400 animate-pulse">Loading data...</td></tr>
              ) : filteredExpenses.length === 0 ? (
                <tr><td colSpan={4} className="px-8 py-20 text-center font-bold text-slate-400">No records found.</td></tr>
              ) : (
                filteredExpenses.map((expense) => (
                  <tr key={expense._id} className="group hover:bg-blue-50/30 transition-colors">
                    <td className="px-8 py-5">
                      <p className="font-bold text-slate-800 text-lg">{expense.expense_name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter bg-slate-100 px-2 py-0.5 rounded-md">{expense.category}</span>
                        <span className="text-xs text-slate-300">•</span>
                        <span className="text-xs text-slate-500 font-medium">{new Date(expense.expense_date).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-xl font-black text-slate-900">${parseFloat(expense.amount).toFixed(2)}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{expense.currency}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider ${getStatusColor(expense.status)}`}>
                        {expense.status}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-end gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setViewingExpense(expense)} className="p-3 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-md rounded-xl transition-all" title="View Detail"><FiEye size={18} /></button>
                        <button onClick={() => handleEdit(expense)} className="p-3 text-slate-400 hover:text-slate-800 hover:bg-white hover:shadow-md rounded-xl transition-all" title="Edit"><FiEdit2 size={18} /></button>
                        
                        {/* Status specific actions */}
                        {expense.status === 'Submitted' && (
                          <>
                            <button onClick={() => handleApprove(expense._id || '')} className="p-3 text-slate-400 hover:text-green-600 hover:bg-white hover:shadow-md rounded-xl transition-all" title="Approve"><FiCheckCircle size={18} /></button>
                            <button onClick={() => handleReject(expense._id || '')} className="p-3 text-slate-400 hover:text-red-600 hover:bg-white hover:shadow-md rounded-xl transition-all" title="Reject"><FiXCircle size={18} /></button>
                          </>
                        )}
                        {expense.status === 'Approved' && (
                          <button onClick={() => handleMarkReimbursed(expense._id || '')} className="p-3 text-slate-400 hover:text-purple-600 hover:bg-white hover:shadow-md rounded-xl transition-all" title="Reimburse"><FiRefreshCw size={18} /></button>
                        )}
                        
                        <button onClick={() => handleDelete(expense._id || '')} className="p-3 text-slate-400 hover:text-red-600 hover:bg-white hover:shadow-md rounded-xl transition-all" title="Delete"><FiTrash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW CARD (Glassmorphism) */}
      {viewingExpense && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setViewingExpense(null)} />
          <div className="relative bg-white/90 backdrop-blur-2xl rounded-[3rem] shadow-2xl w-full max-w-lg border border-white/20 overflow-hidden">
            <div className="p-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${getStatusColor(viewingExpense.status)}`}>
                    {viewingExpense.status}
                  </span>
                  <h2 className="text-4xl font-black text-slate-900 mt-4 leading-tight">{viewingExpense.expense_name}</h2>
                </div>
                <button onClick={() => setViewingExpense(null)} className="p-3 bg-slate-100 text-slate-400 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors">
                  <FiX size={24} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/50 p-6 rounded-[2rem] border border-white shadow-sm">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Total Amount</p>
                  <p className="text-3xl font-black text-blue-600">${viewingExpense.amount}</p>
                  <p className="text-xs font-bold text-slate-400 mt-1">{viewingExpense.currency}</p>
                </div>
                <div className="bg-white/50 p-6 rounded-[2rem] border border-white shadow-sm text-center flex flex-col justify-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Category</p>
                  <p className="text-xl font-black text-slate-700">{viewingExpense.category}</p>
                </div>
              </div>

              <div className="space-y-4 px-2">
                <div className="flex justify-between text-sm py-3 border-b border-slate-100">
                  <span className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">Date</span>
                  <span className="font-black text-slate-700">{new Date(viewingExpense.expense_date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm py-3 border-b border-slate-100">
                  <span className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">Submitted By</span>
                  <span className="font-black text-slate-700">{viewingExpense.submitted_by}</span>
                </div>
                {viewingExpense.notes && (
                  <div className="mt-6">
                    <p className="font-bold text-slate-400 uppercase text-[10px] tracking-widest mb-2">Notes</p>
                    <p className="text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-2xl italic font-medium">"{viewingExpense.notes}"</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* CREATE/EDIT MODAL (Logic Restored) */}
      {showModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setShowModal(false)} />
          <div className="relative bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-white/20">
            <div className="p-10">
              <h2 className="text-2xl font-black mb-8 text-slate-900">{isEditing ? 'Modify Expense' : 'Create New Expense'}</h2>
              
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Expense Label *</label>
                  <input
                    type="text"
                    value={formData.expense_name}
                    onChange={(e) => setFormData({ ...formData, expense_name: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-blue-500/10 outline-none font-bold"
                    placeholder="e.g. Server Hosting"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Amount *</label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-blue-500/10 outline-none font-bold"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-slate-600"
                    >
                      <option>Travel</option><option>Equipment</option><option>Office</option>
                      <option>Utilities</option><option>Software</option><option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Date</label>
                    <input
                      type="date"
                      value={new Date(formData.expense_date).toISOString().split('T')[0]}
                      onChange={(e) => setFormData({ ...formData, expense_date: new Date(e.target.value).getTime() })}
                      className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-blue-500/10 outline-none font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Currency</label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-slate-600"
                    >
                      <option>USD</option><option>EUR</option><option>PKR</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Submitted By</label>
                    <input
                      type="text"
                      value={formData.submitted_by}
                      onChange={(e) => setFormData({ ...formData, submitted_by: e.target.value })}
                      className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-slate-500"
                    />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Internal Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-blue-500/10 outline-none font-medium resize-none"
                    placeholder="Describe this expense..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <button onClick={() => setShowModal(false)} className="flex-1 py-4 font-bold text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
                <button onClick={handleSave} className="flex-1 py-4 bg-[#21a9ff] text-white rounded-[1.5rem] font-bold shadow-lg shadow-blue-100 hover:bg-blue-600 transition-all">Save Record</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExpensesTable