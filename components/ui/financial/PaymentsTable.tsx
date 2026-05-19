'use client'

import React, { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiCheckCircle, FiZap, FiSearch, FiFilter, FiX, FiEye, FiClock, FiCreditCard, FiFile } from 'react-icons/fi'
import { PaymentsService, type Payment } from '@/src/services/financial/PaymentsService'

const PaymentsTable = () => {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [viewingPayment, setViewingPayment] = useState<Payment | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('All')

  const [formData, setFormData] = useState<Payment>({
    invoice_id: '',
    amount_received: 0,
    payment_date: Date.now(),
    payment_method: 'Bank_Transfer',
    status: 'Pending',
    recorded_by: 'Finance Team',
  })

  const emptyPayment: Payment = {
    invoice_id: '',
    amount_received: 0,
    payment_date: Date.now(),
    payment_method: 'Bank_Transfer',
    status: 'Pending',
    recorded_by: 'Finance Team',
  }

  // --- Logic Hooks ---
  useEffect(() => { loadPayments() }, [])

  const loadPayments = async () => {
    setLoading(true)
    try {
      const data = await PaymentsService.getAllPayments()
      setPayments(data)
    } catch (error) { console.error('Error loading payments:', error) }
    finally { setLoading(false) }
  }

  const handleAddNew = () => {
    setFormData(emptyPayment)
    setIsEditing(false)
    setEditingId(null)
    setShowModal(true)
  }

  const handleEdit = (payment: Payment) => {
    setFormData(payment)
    setIsEditing(true)
    setEditingId(payment._id || null)
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this payment?')) {
      try {
        await PaymentsService.deletePayment(id)
        loadPayments()
      } catch (error) { console.error(error) }
    }
  }

  const handleSave = async () => {
    if (!formData.invoice_id || !formData.amount_received) {
      alert('Please fill in all required fields')
      return
    }
    try {
      if (isEditing && editingId) { await PaymentsService.updatePayment(editingId, formData) }
      else { await PaymentsService.createPayment(formData) }
      loadPayments()
      setShowModal(false)
    } catch (error) { console.error(error) }
  }

  const handleConfirm = async (id: string) => {
    try { await PaymentsService.confirmPayment(id); loadPayments(); } catch (error) { console.error(error) }
  }

  const handleReconcile = async (id: string) => {
    try { await PaymentsService.reconcilePayment(id); loadPayments(); } catch (error) { console.error(error) }
  }

  // --- UI Helpers matching ClaimsTable style ---
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-600 border-amber-100'
      case 'Confirmed':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100'
      case 'Reconciled':
        return 'bg-purple-50 text-purple-600 border-purple-100'
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100'
    }
  }

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = payment.invoice_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          payment.reference_number?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'All' || payment.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="w-full bg-slate-50 min-h-screen p-6 text-black">
      <div className="max-w-7xl mx-auto">
        {/* Header Block matched with ClaimsTable style */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Payments Journal</h1>
            <p className="text-slate-500 font-medium">Manage and reconcile inbound transactions</p>
          </div>
          <button
            onClick={handleAddNew}
            className="bg-[#21a9ff] text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-600 shadow-lg shadow-blue-100 transition-all font-bold"
          >
            <FiPlus size={20} /> New Payment
          </button>
        </div>

        {/* Control Filters Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search invoice or reference ID..."
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
              <option>Pending</option>
              <option>Confirmed</option>
              <option>Reconciled</option>
            </select>
          </div>
        </div>

        {/* Table Wrapper matched with ClaimsTable style */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Invoice Info</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center opacity-40 animate-pulse">
                        <p className="font-bold text-slate-500">Syncing transactions...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center opacity-40">
                        <FiFile size={48} className="mb-2" />
                        <p className="font-medium text-slate-500">No payment records found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 font-mono text-sm text-slate-600">
                        <div>
                          <p className="font-bold text-slate-900 font-sans">#{payment.invoice_id}</p>
                          <p className="text-xs text-slate-400 font-normal mt-0.5">Ref: {payment.reference_number || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        ${payment.amount_received.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase border ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-sm font-medium">
                        <span className="bg-slate-100 px-2 py-0.5 rounded-md text-xs font-bold text-slate-500 uppercase tracking-tight">
                          {payment.payment_method.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-sm font-medium">
                        {new Date(payment.payment_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                        <button
                          onClick={() => setViewingPayment(payment)}
                          className="text-slate-400 hover:text-green-600 transition-colors"
                          title="View Detail"
                        >
                          <FiEye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(payment)}
                          className="text-slate-400 hover:text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 size={18} />
                        </button>

                        {/* Direct workflow actions */}
                        {payment.status === 'Pending' && (
                          <button onClick={() => handleConfirm(payment._id || '')} className="text-slate-400 hover:text-emerald-600 transition-colors" title="Confirm"><FiCheckCircle size={18} /></button>
                        )}
                        {payment.status === 'Confirmed' && (
                          <button onClick={() => handleReconcile(payment._id || '')} className="text-slate-400 hover:text-purple-600 transition-colors" title="Reconcile"><FiZap size={18} /></button>
                        )}

                        <button
                          onClick={() => handleDelete(payment._id || '')}
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
      {viewingPayment && (
        <>
          <div
            className="fixed inset-0 z-[998] bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setViewingPayment(null)}
          />
          <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl z-[999] animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h2 className="text-2xl font-black text-slate-800">Payment Details</h2>
                <button
                  onClick={() => setViewingPayment(null)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <label className="block text-[10px] font-bold text-blue-600 uppercase mb-1">Amount Received</label>
                  <p className="text-2xl font-black text-blue-900">${viewingPayment.amount_received.toFixed(2)}</p>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Invoice Reference</label>
                  <p className="font-bold text-slate-700">#{viewingPayment.invoice_id}</p>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</label>
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase inline-block border ${getStatusColor(viewingPayment.status)}`}>
                    {viewingPayment.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Method</label>
                  <p className="font-bold text-slate-700">{viewingPayment.payment_method.replace('_', ' ')}</p>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Recorded By</label>
                  <p className="font-bold text-slate-700">{viewingPayment.recorded_by}</p>
                </div>

                <div className="space-y-3 border-t border-slate-100 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                      <FiClock /> Transaction Date
                    </span>
                    <span className="font-black text-slate-700 text-sm">
                      {new Date(viewingPayment.payment_date).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                      <FiCreditCard /> Reference No.
                    </span>
                    <span className="font-black text-slate-700 text-sm">
                      {viewingPayment.reference_number || 'N/A'}
                    </span>
                  </div>
                </div>

                {viewingPayment.notes && (
                  <div className="space-y-1 pt-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Internal Notes</label>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 italic text-sm text-slate-600">
                      "{viewingPayment.notes}"
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
                  {isEditing ? 'Edit Transaction' : 'Add New Payment'}
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
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Invoice Reference *</label>
                  <input
                    type="text"
                    value={formData.invoice_id}
                    onChange={(e) => setFormData({ ...formData, invoice_id: e.target.value })}
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm"
                    placeholder="e.g. INV-0000"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Amount Received *</label>
                  <input
                    type="number"
                    value={formData.amount_received || ''}
                    onChange={(e) => setFormData({ ...formData, amount_received: parseFloat(e.target.value) || 0 })}
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm"
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Method</label>
                  <select
                    value={formData.payment_method}
                    onChange={(e) => setFormData({ ...formData, payment_method: e.target.value as any })}
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 outline-none font-medium text-slate-600 cursor-pointer text-sm focus:border-blue-500 focus:bg-white transition-all"
                  >
                    <option>Bank_Transfer</option><option>Cheque</option><option>Credit_Card</option><option>Cash</option><option>Wire</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Date</label>
                  <input
                    type="date"
                    value={new Date(formData.payment_date).toISOString().split('T')[0]}
                    onChange={(e) => setFormData({ ...formData, payment_date: new Date(e.target.value).getTime() })}
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Reference No</label>
                  <input
                    type="text"
                    value={formData.reference_number || ''}
                    onChange={(e) => setFormData({ ...formData, reference_number: e.target.value })}
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm"
                    placeholder="TXN-XXXX"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Internal Notes</label>
                  <textarea
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-5 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-700 font-medium text-sm resize-none"
                    placeholder="Add details..."
                    rows={2}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 font-bold text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-3 rounded-2xl transition-all shadow-lg shadow-blue-100 active:scale-95"
                  >
                    Complete Post
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

export default PaymentsTable