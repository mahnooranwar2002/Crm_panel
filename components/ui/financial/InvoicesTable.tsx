'use client'

import React, { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiLoader, FiEye, FiClock, FiCreditCard } from 'react-icons/fi'
import { Invoice, getAllInvoices, createInvoice, updateInvoice, deleteInvoice } from '@/src/services/financial/InvoicesService'

// Types (Refined)
interface FormData extends Omit<Invoice, 'invoiceNumber' | 'clientName' | 'issueDate' | 'dueDate' | 'amount'> {
  invoiceNumber: string
  clientName: string
  issueDate: string
  dueDate: string
  amount: number
  email: string
  phone: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  items: Array<{ description: string; quantity: number; rate: number; amount: number }>
}

const emptyInvoice: FormData = {
  invoiceNumber: '',
  clientName: '',
  email: '',
  phone: '',
  amount: 0,
  dueDate: '',
  issueDate: new Date().toISOString().split('T')[0],
  status: 'draft',
  description: '',
  items: [{ description: '', quantity: 1, rate: 0, amount: 0 }]
}

const InvoicesTable = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<FormData>(emptyInvoice)
  const [submitting, setSubmitting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null)

  useEffect(() => { fetchInvoices() }, [])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [showModal])

  const fetchInvoices = async () => {
    try {
      setLoading(true)
      const data = await getAllInvoices()
      setInvoices(data)
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...(formData.items || [])]
    if (field === 'quantity' || field === 'rate') {
      const val = parseFloat(String(value)) || 0
      newItems[index] = { ...newItems[index], [field]: val, amount: (field === 'quantity' ? val : newItems[index].quantity) * (field === 'rate' ? val : newItems[index].rate) }
    } else {
      newItems[index] = { ...newItems[index], [field]: value }
    }
    const totalAmount = newItems.reduce((sum, item) => sum + item.amount, 0)
    setFormData(prev => ({ ...prev, items: newItems, amount: totalAmount }))
  }

  const addItemRow = () => {
    setFormData(prev => ({ ...prev, items: [...prev.items, { description: '', quantity: 1, rate: 0, amount: 0 }] }))
  }

  const removeItemRow = (index: number) => {
    const newItems = formData.items.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, items: newItems, amount: newItems.reduce((sum, item) => sum + item.amount, 0) }))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (isEditing && formData._id) await updateInvoice(formData._id, formData as any)
      else await createInvoice(formData as any)
      await fetchInvoices()
      setShowModal(false)
    } catch (err) { alert('Failed to save') } finally { setSubmitting(false) }
  }

  const inputBase = "w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all placeholder:text-slate-400 bg-white"

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'paid': return 'bg-green-50 text-green-600'
      case 'sent': return 'bg-blue-50 text-blue-600'
      case 'draft': return 'bg-slate-50 text-slate-600'
      case 'overdue': return 'bg-red-50 text-red-600'
      case 'cancelled': return 'bg-gray-50 text-gray-600'
      default: return 'bg-slate-50 text-slate-600'
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto text-slate-800">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black">Invoices</h1>
          <p className="text-slate-500 text-sm">Manage and track your client billings</p>
        </div>
        <button 
          onClick={() => { setFormData(emptyInvoice); setIsEditing(false); setShowModal(true); }}
          className="bg-[#21a9ff] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-100 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <FiPlus /> New Invoice
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {invoices.map(invoice => (
          <div key={invoice._id} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <span className="text-blue-500 font-bold text-sm tracking-tight">{invoice.invoiceNumber}</span>
              <span className="bg-green-50 text-green-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{invoice.status}</span>
            </div>
            <h3 className="font-bold text-lg mb-1">{invoice.clientName}</h3>
            <p className="text-3xl font-black text-slate-900">${invoice.amount.toLocaleString()}</p>
            <div className="flex gap-2 mt-6">
              <button onClick={() => { setFormData(invoice as any); setIsEditing(true); setShowModal(true); }} className="flex-1 py-2.5 bg-slate-50 rounded-xl flex justify-center text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"><FiEdit2 /></button>
              <button onClick={() => invoice._id && deleteInvoice(invoice._id).then(fetchInvoices)} className="flex-1 py-2.5 bg-slate-50 rounded-xl flex justify-center text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"><FiTrash2 /></button>
              <button onClick={() => setViewingInvoice(invoice)} className="flex-1 py-2.5 bg-slate-50 rounded-xl flex justify-center text-slate-500 hover:bg-green-50 hover:text-green-600 transition-colors"><FiEye size={18} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* --- Create/Edit Sidebar --- */}
      {showModal && (
        <>
          <div
            className="fixed inset-0 z-[9998] bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowModal(false)}
          />
          <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl z-[9999] animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h2 className="text-2xl font-black text-slate-800">
                  {isEditing ? 'Edit Invoice' : 'Create Invoice'}
                </h2>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
                >
                  <FiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    name="invoiceNumber"
                    placeholder="INV-000"
                    value={formData.invoiceNumber}
                    onChange={handleInputChange}
                    className={inputBase}
                  />
                  <input
                    name="clientName"
                    placeholder="Client Name"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    className={inputBase}
                  />
                  <input
                    type="date"
                    name="issueDate"
                    value={formData.issueDate}
                    onChange={handleInputChange}
                    className={inputBase}
                  />
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className={inputBase}
                  />
                </div>

                <div className="space-y-4">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    Items
                  </p>
                  <div className="space-y-3">
                    {formData.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input
                          placeholder="Desc"
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          className={`${inputBase} flex-[3]`}
                        />
                        <input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          className={`${inputBase} flex-1 text-center px-2`}
                        />
                        <input
                          type="number"
                          placeholder="Rate"
                          value={item.rate}
                          onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                          className={`${inputBase} flex-1 text-center px-2`}
                        />
                        <button
                          type="button"
                          onClick={() => removeItemRow(index)}
                          className="text-slate-300 hover:text-red-500 p-1"
                        >
                          <FiX />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={addItemRow}
                    className="text-[#21a9ff] text-xs font-bold flex items-center gap-1 hover:underline"
                  >
                    + Add Item
                  </button>
                </div>

                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">
                        Grand Total
                      </p>
                      <span className="text-2xl font-black text-slate-900">
                        ${formData.amount.toFixed(2)}
                      </span>
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="bg-[#21a9ff] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                    >
                      {submitting ? 'Saving...' : 'Save Invoice'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      {/* --- View Sidebar --- */}
      {viewingInvoice && (
        <>
          <div
            className="fixed inset-0 z-[998] bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setViewingInvoice(null)}
          />
          <div className="fixed right-0 top-0 h-screen w-full max-w-md bg-white shadow-2xl z-[999] animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h2 className="text-2xl font-black text-slate-800 uppercase">
                  Invoice Details
                </h2>
                <button
                  type="button"
                  onClick={() => setViewingInvoice(null)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${getStatusColor(viewingInvoice.status)}`}
                  >
                    {viewingInvoice.status}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-slate-900">
                  Invoice {viewingInvoice.invoiceNumber}
                </h3>
                <p className="text-slate-500 font-medium">
                  {viewingInvoice.clientName}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">
                      Amount
                    </p>
                    <p className="text-2xl font-black text-blue-600">
                      ${viewingInvoice.amount.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">
                      Status
                    </p>
                    <p className="text-lg font-black text-slate-700 capitalize">
                      {viewingInvoice.status}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 border-t border-slate-100 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                      <FiClock /> Issue Date
                    </span>
                    <span className="font-black text-slate-700">
                      {new Date(viewingInvoice.issueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                      <FiCreditCard /> Due Date
                    </span>
                    <span className="font-black text-slate-700">
                      {new Date(viewingInvoice.dueDate).toLocaleDateString()}
                    </span>
                  </div>

                  {viewingInvoice.email && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                        Email
                      </span>
                      <span className="font-black text-slate-700">
                        {viewingInvoice.email}
                      </span>
                    </div>
                  )}

                  {viewingInvoice.phone && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                        Phone
                      </span>
                      <span className="font-black text-slate-700">
                        {viewingInvoice.phone}
                      </span>
                    </div>
                  )}

                  {viewingInvoice.description && (
                    <div className="mt-3 bg-slate-50 p-4 rounded-2xl italic text-sm text-slate-600">
                      "{viewingInvoice.description}"
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setViewingInvoice(null)}
                  className="w-full py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ///////////////////// */}
    </div>
  )
}

export default InvoicesTable
