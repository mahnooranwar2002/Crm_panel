'use client'

import React, { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiCheckCircle, FiZap, FiSearch, FiFilter, FiX, FiEye, FiClock, FiCreditCard } from 'react-icons/fi'
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

  // --- Logic Hooks (Same as before) ---
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

  // --- UI Helpers ---
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-emerald-100 text-emerald-700'
      case 'Pending': return 'bg-amber-100 text-amber-700'
      case 'Reconciled': return 'bg-violet-100 text-violet-700'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = payment.invoice_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          payment.reference_number?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'All' || payment.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="p-8 max-w-7xl mx-auto text-slate-900 font-sans antialiased">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Payments Journal</h1>
          <p className="text-slate-500 font-medium mt-1">Manage and reconcile inbound transactions</p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-[#21a9ff] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          <FiPlus size={20} /> New Payment
        </button>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search invoice or reference ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[1.25rem] shadow-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 outline-none transition-all"
          />
        </div>
        <div className="relative min-w-[200px]">
          <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full pl-12 pr-10 py-4 bg-white border border-slate-200 rounded-[1.25rem] shadow-sm focus:ring-4 focus:ring-blue-500/5 outline-none appearance-none font-bold text-slate-600 cursor-pointer"
          >
            <option>All</option>
            <option>Pending</option>
            <option>Confirmed</option>
            <option>Reconciled</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Invoice Info</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Amount</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-8 py-5 text-right text-xs font-black uppercase tracking-widest text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={4} className="px-8 py-20 text-center font-bold text-slate-400 animate-pulse">Syncing transactions...</td></tr>
              ) : filteredPayments.length === 0 ? (
                <tr><td colSpan={4} className="px-8 py-20 text-center font-bold text-slate-400">No payment records found.</td></tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment._id} className="group hover:bg-slate-50/80 transition-colors">
                    <td className="px-8 py-5">
                      <p className="font-bold text-slate-800 text-lg">{payment.invoice_id}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-tighter bg-blue-50 px-2 py-0.5 rounded-md">
                          {payment.payment_method.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {new Date(payment.payment_date).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-xl font-black text-slate-900">${payment.amount_received.toFixed(2)}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{payment.reference_number || 'No Ref'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setViewingPayment(payment)} className="p-3 text-slate-400 hover:text-blue-500 hover:bg-white hover:shadow-md rounded-xl transition-all"><FiEye size={18} /></button>
                        <button onClick={() => handleEdit(payment)} className="p-3 text-slate-400 hover:text-slate-900 hover:bg-white hover:shadow-md rounded-xl transition-all"><FiEdit2 size={18} /></button>
                        
                        {payment.status === 'Pending' && (
                          <button onClick={() => handleConfirm(payment._id || '')} className="p-3 text-slate-400 hover:text-emerald-500 hover:bg-white hover:shadow-md rounded-xl transition-all"><FiCheckCircle size={18} /></button>
                        )}
                        {payment.status === 'Confirmed' && (
                          <button onClick={() => handleReconcile(payment._id || '')} className="p-3 text-slate-400 hover:text-violet-500 hover:bg-white hover:shadow-md rounded-xl transition-all"><FiZap size={18} /></button>
                        )}
                        
                        <button onClick={() => handleDelete(payment._id || '')} className="p-3 text-slate-400 hover:text-red-500 hover:bg-white hover:shadow-md rounded-xl transition-all"><FiTrash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
                  type="button"
                  onClick={() => setViewingPayment(null)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(viewingPayment.status)}`}
                >
                  {viewingPayment.status}
                </span>

                <h3 className="text-2xl font-black text-slate-900">
                  Invoice {viewingPayment.invoice_id}
                </h3>
                <p className="text-slate-500 font-medium">
                  Recorded by {viewingPayment.recorded_by}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">
                      Amount Received
                    </p>
                    <p className="text-2xl font-black text-blue-600">
                      ${viewingPayment.amount_received.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Method</p>
                    <p className="text-lg font-black text-slate-700">
                      {viewingPayment.payment_method.replace('_', ' ')}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 border-t border-slate-100 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                      <FiClock /> Transaction Date
                    </span>
                    <span className="font-black text-slate-700">
                      {new Date(viewingPayment.payment_date).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                      <FiCreditCard /> Reference No.
                    </span>
                    <span className="font-black text-slate-700">
                      {viewingPayment.reference_number || 'N/A'}
                    </span>
                  </div>

                  {viewingPayment.bank_account && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                        Bank Account
                      </span>
                      <span className="font-black text-slate-700">
                        {viewingPayment.bank_account}
                      </span>
                    </div>
                  )}

                  {viewingPayment.notes && (
                    <div className="bg-slate-50 p-4 rounded-2xl italic text-sm text-slate-600">
                      "{viewingPayment.notes}"
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setViewingPayment(null)}
                  className="w-full py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* CREATE/EDIT Sidebar (right drawer) */}
      {showModal && (
        <>
          <div
            className="fixed inset-0 z-[109] bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl z-[110] animate-in slide-in-from-right duration-300 overflow-y-auto">
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

              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Invoice Reference *</label>
                  <input
                    type="text"
                    value={formData.invoice_id}
                    onChange={(e) => setFormData({ ...formData, invoice_id: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-blue-500/10 outline-none font-bold placeholder:text-slate-300"
                    placeholder="INV-0000"
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Amount Received *</label>
                    <input
                      type="number"
                      value={formData.amount_received}
                      onChange={(e) => setFormData({ ...formData, amount_received: parseFloat(e.target.value) })}
                      className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-blue-500/10 outline-none font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Method</label>
                    <select
                      value={formData.payment_method}
                      onChange={(e) => setFormData({ ...formData, payment_method: e.target.value as any })}
                      className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-slate-600"
                    >
                      <option>Bank_Transfer</option><option>Cheque</option><option>Credit_Card</option><option>Cash</option><option>Wire</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Date</label>
                    <input
                      type="date"
                      value={new Date(formData.payment_date).toISOString().split('T')[0]}
                      onChange={(e) => setFormData({ ...formData, payment_date: new Date(e.target.value).getTime() })}
                      className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-blue-500/10 outline-none font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Reference No</label>
                    <input
                      type="text"
                      value={formData.reference_number || ''}
                      onChange={(e) => setFormData({ ...formData, reference_number: e.target.value })}
                      className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-blue-500/10 outline-none font-bold placeholder:text-slate-300"
                      placeholder="TXN-XXXX"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Internal Notes</label>
                  <textarea
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-blue-500/10 outline-none font-medium resize-none"
                    rows={2}
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 font-bold text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-4 bg-[#21a9ff] text-white rounded-2xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-600 transition-all"
                >
                  Complete Post
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default PaymentsTable