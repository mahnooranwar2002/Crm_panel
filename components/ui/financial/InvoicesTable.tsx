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

      {/* Modal with Fixed Overlay Fix */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-hidden">
          {/* Backdrop Layer */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
            onClick={() => setShowModal(false)}
          />
          
          {/* Modal Content */}
          <form 
            onSubmit={handleSubmit} 
            className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden border border-white/20 animate-in fade-in zoom-in duration-200"
          >
            <div className="p-8 pb-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Create Invoice</h2>
              <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><FiX size={20} /></button>
            </div>

            <div className="p-8 pt-2 space-y-6 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <input name="invoiceNumber" placeholder="INV-000" value={formData.invoiceNumber} onChange={handleInputChange} className={inputBase} />
                <input name="clientName" placeholder="Client Name" value={formData.clientName} onChange={handleInputChange} className={inputBase} />
                <input type="date" name="issueDate" value={formData.issueDate} onChange={handleInputChange} className={inputBase} />
                <input type="date" name="dueDate" value={formData.dueDate} onChange={handleInputChange} className={inputBase} />
              </div>

              <div className="space-y-4">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Items</p>
                <div className="space-y-3">
                  {formData.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input placeholder="Desc" value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} className={`${inputBase} flex-[3]`} />
                      <input type="number" placeholder="Qty" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} className={`${inputBase} flex-1 text-center px-2`} />
                      <input type="number" placeholder="Rate" value={item.rate} onChange={e => handleItemChange(index, 'rate', e.target.value)} className={`${inputBase} flex-1 text-center px-2`} />
                      <button type="button" onClick={() => removeItemRow(index)} className="text-slate-300 hover:text-red-500 p-1"><FiX /></button>
                    </div>
                  ))}
                </div>
                <button type="button" onClick={addItemRow} className="text-[#21a9ff] text-xs font-bold flex items-center gap-1 hover:underline">+ Add Item</button>
              </div>
            </div>

            <div className="p-8 bg-slate-50/80 border-t border-slate-100 flex justify-between items-center">
              <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Grand Total</p>
                <span className="text-2xl font-black text-slate-900">${formData.amount.toFixed(2)}</span>
              </div>
              <button 
                type="submit" 
                disabled={submitting}
                className="bg-[#21a9ff] text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:scale-[1.05] active:scale-95 transition-all disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Save Invoice'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ///////////////////// */}
      {/* VIEW DETAILS MODAL */}
      {viewingInvoice && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setViewingInvoice(null)} />
          <div className="relative bg-white/90 backdrop-blur-2xl rounded-[3rem] shadow-2xl w-full max-w-lg border border-white/20 overflow-hidden transform transition-all animate-in zoom-in duration-300">
            <div className="p-10">
              <div className="flex justify-between items-start mb-8">
                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${getStatusColor(viewingInvoice.status)}`}>
                  {viewingInvoice.status}
                </span>
                <button onClick={() => setViewingInvoice(null)} className="p-3 bg-slate-100 text-slate-400 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors">
                  <FiX size={24} />
                </button>
              </div>

              <h2 className="text-4xl font-black text-slate-900 mb-2">Invoice {viewingInvoice.invoiceNumber}</h2>
              <p className="text-slate-500 font-medium mb-8">{viewingInvoice.clientName}</p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/50 p-6 rounded-[2rem] border border-white shadow-sm">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Amount</p>
                  <p className="text-3xl font-black text-blue-600">${viewingInvoice.amount.toFixed(2)}</p>
                </div>
                <div className="bg-white/50 p-6 rounded-[2rem] border border-white shadow-sm flex flex-col justify-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Status</p>
                  <p className="text-lg font-black text-slate-700 capitalize">{viewingInvoice.status}</p>
                </div>
              </div>

              <div className="space-y-4 px-2 border-t border-slate-100 pt-6">
                <div className="flex justify-between items-center py-2">
                  <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest"><FiClock /> Issue Date</div>
                  <div className="font-black text-slate-700">{new Date(viewingInvoice.issueDate).toLocaleDateString()}</div>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest"><FiCreditCard /> Due Date</div>
                  <div className="font-black text-slate-700">{new Date(viewingInvoice.dueDate).toLocaleDateString()}</div>
                </div>
                {viewingInvoice.email && (
                  <div className="flex justify-between items-center py-2">
                    <div className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Email</div>
                    <div className="font-black text-slate-700">{viewingInvoice.email}</div>
                  </div>
                )}
                {viewingInvoice.phone && (
                  <div className="flex justify-between items-center py-2">
                    <div className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Phone</div>
                    <div className="font-black text-slate-700">{viewingInvoice.phone}</div>
                  </div>
                )}
                {viewingInvoice.description && (
                  <div className="mt-4 bg-slate-50 p-4 rounded-2xl italic text-sm text-slate-600">"{viewingInvoice.description}"</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ///////////////////// */}
    </div>
  )
}

export default InvoicesTable