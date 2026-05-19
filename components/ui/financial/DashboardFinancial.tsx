'use client';

import React, { useState, useEffect } from 'react';
import { FaCoins, FaFileInvoice, FaMoneyBillWave, FaChartLine } from "react-icons/fa";
import { MdTrendingUp, MdTrendingDown } from 'react-icons/md';

interface Invoice {
  id: string;
  invoice_number: string;
  client_id: string;
  amount: number;
  status: 'Draft' | 'Sent' | 'Viewed' | 'Paid' | 'Overdue' | 'Cancelled';
  invoice_date: string;
  due_date: string;
  description?: string;
}

interface Expense {
  id: string;
  expense_name: string;
  category: string;
  amount: number;
  expense_date: string;
  status: 'Submitted' | 'Approved' | 'Rejected' | 'Reimbursed';
  notes?: string;
}

interface Payment {
  id: string;
  invoice_id: string;
  amount_received: number;
  payment_date: string;
  payment_method: string;
  status: 'Pending' | 'Confirmed' | 'Reconciled';
  reference_number?: string;
}

const DashboardFinancial = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  // Load mock data
  useEffect(() => {
    setInvoices([
      { id: '1', invoice_number: 'INV-2026-001', client_id: 'CL-001', amount: 5500, status: 'Paid', invoice_date: '2026-04-10', due_date: '2026-05-10', description: 'Web Development' },
      { id: '2', invoice_number: 'INV-2026-002', client_id: 'CL-002', amount: 3200, status: 'Sent', invoice_date: '2026-04-15', due_date: '2026-05-15', description: 'Design Services' },
      { id: '3', invoice_number: 'INV-2026-003', client_id: 'CL-003', amount: 7800, status: 'Overdue', invoice_date: '2026-03-20', due_date: '2026-04-20', description: 'Project Completion' },
      { id: '4', invoice_number: 'INV-2026-004', client_id: 'CL-001', amount: 2500, status: 'Draft', invoice_date: '2026-04-22', due_date: '2026-05-22', description: 'Consulting' },
    ]);

    setExpenses([
      { id: '1', expense_name: 'Office Supplies', category: 'Office', amount: 250.50, expense_date: '2026-04-15', status: 'Approved', notes: 'Quarterly supplies' },
      { id: '2', expense_name: 'Travel', category: 'Travel', amount: 450, expense_date: '2026-04-18', status: 'Submitted', notes: 'Client meeting' },
      { id: '3', expense_name: 'Software License', category: 'Software', amount: 199, expense_date: '2026-04-20', status: 'Reimbursed', notes: 'Annual renewal' },
      { id: '4', expense_name: 'Equipment Purchase', category: 'Equipment', amount: 1200, expense_date: '2026-04-21', status: 'Approved', notes: 'New laptops' },
    ]);

    setPayments([
      { id: '1', invoice_id: 'INV-001', amount_received: 5500, payment_date: '2026-04-20', payment_method: 'Bank_Transfer', status: 'Confirmed', reference_number: 'TXN-12345' },
      { id: '2', invoice_id: 'INV-002', amount_received: 3200, payment_date: '2026-04-22', payment_method: 'Credit_Card', status: 'Pending', reference_number: 'TXN-12346' },
      { id: '3', invoice_id: 'INV-003', amount_received: 2500, payment_date: '2026-04-23', payment_method: 'Bank_Transfer', status: 'Reconciled', reference_number: 'TXN-12347' },
    ]);
  }, []);

  // Calculate metrics
  const totalRevenue = invoices.reduce((sum, inv) => inv.status === 'Paid' ? sum + inv.amount : sum, 0);
  const totalExpenses = expenses.reduce((sum, exp) => exp.status === 'Approved' || exp.status === 'Reimbursed' ? sum + exp.amount : sum, 0);
  const outstandingInvoices = invoices.filter(inv => inv.status === 'Sent' || inv.status === 'Overdue').reduce((sum, inv) => sum + inv.amount, 0);
  const confirmedPaymentsTotal = payments.reduce((sum, p) => p.status === 'Confirmed' ? sum + p.amount_received : sum, 0);

  // Status Badge Class Mapper
  const getBadgeClass = (status: string) => {
    switch (status) {
      case 'Paid':
      case 'Approved':
      case 'Confirmed':
        return 'bg-green-100 text-green-700';
      case 'Sent':
      case 'Submitted':
      case 'Pending':
        return 'bg-amber-100 text-amber-700';
      case 'Overdue':
        return 'bg-rose-100 text-rose-700';
      case 'Reimbursed':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Financial Overview</h1>
          <p className="text-slate-500 font-medium">Complete summary of invoices, expenses, and payments.</p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Total Revenue */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <FaCoins size={20} />
            </div>
            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-slate-900">${totalRevenue.toLocaleString()}</p>
          </div>

          {/* Total Expenses */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <FaMoneyBillWave size={20} />
            </div>
            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">Total Expenses</p>
            <p className="text-3xl font-bold text-slate-900">${totalExpenses.toLocaleString()}</p>
          </div>

          {/* Outstanding Invoices */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <FaFileInvoice size={20} />
            </div>
            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">Outstanding</p>
            <p className="text-3xl font-bold text-slate-900">${outstandingInvoices.toLocaleString()}</p>
          </div>

          {/* Confirmed Payments */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <FaChartLine size={20} />
            </div>
            <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">Confirmed Payments</p>
            <p className="text-3xl font-bold text-slate-900">${confirmedPaymentsTotal.toLocaleString()}</p>
          </div>
        </div>

        {/* Recent Invoices Table Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-10">
          <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-800">Recent Invoices</h2>
            <span className="text-blue-600 font-bold bg-blue-50 px-3 py-1.5 rounded-lg text-sm">
              Total: {invoices.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white">
                  <th className="text-left py-4 px-6 font-semibold text-slate-500 text-sm uppercase">Invoice Number</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-500 text-sm uppercase">Client ID</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-500 text-sm uppercase">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-500 text-sm uppercase">Due Date</th>
                  <th className="text-right py-4 px-6 font-semibold text-slate-500 text-sm uppercase">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 text-slate-900 font-bold">{invoice.invoice_number}</td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-bold uppercase tracking-tight">
                        {invoice.client_id}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getBadgeClass(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-medium">{invoice.due_date}</td>
                    <td className="py-4 px-6 text-slate-900 font-bold text-right">${invoice.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Expenses Table Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-10">
          <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-800">Recent Expenses</h2>
            <span className="text-purple-600 font-bold bg-purple-50 px-3 py-1.5 rounded-lg text-sm">
              Total: {expenses.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white">
                  <th className="text-left py-4 px-6 font-semibold text-slate-500 text-sm uppercase">Expense Name</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-500 text-sm uppercase">Category</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-500 text-sm uppercase">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-500 text-sm uppercase">Date</th>
                  <th className="text-right py-4 px-6 font-semibold text-slate-500 text-sm uppercase">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 text-slate-900 font-bold">{expense.expense_name}</td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-bold uppercase tracking-tight">
                        {expense.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getBadgeClass(expense.status)}`}>
                        {expense.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-medium">{expense.expense_date}</td>
                    <td className="py-4 px-6 text-slate-900 font-bold text-right">${expense.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Payments Table Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-800">Recent Payments</h2>
            <span className="text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg text-sm">
              Total: {payments.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white">
                  <th className="text-left py-4 px-6 font-semibold text-slate-500 text-sm uppercase">Invoice ID</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-500 text-sm uppercase">Method</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-500 text-sm uppercase">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-500 text-sm uppercase">Date</th>
                  <th className="text-right py-4 px-6 font-semibold text-slate-500 text-sm uppercase">Amount Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 text-slate-900 font-bold">{payment.invoice_id}</td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-bold uppercase tracking-tight">
                        {payment.payment_method.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getBadgeClass(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-medium">{payment.payment_date}</td>
                    <td className="py-4 px-6 text-slate-900 font-bold text-right">${payment.amount_received.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardFinancial;