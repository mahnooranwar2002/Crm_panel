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
  const paidInvoices = invoices.filter(inv => inv.status === 'Paid').length;
  const approvedExpenses = expenses.filter(exp => exp.status === 'Approved').length;
  const confirmedPayments = payments.filter(p => p.status === 'Confirmed').length;

  // Status color mapping like Opportunities
  const STATUS_COLORS: { [key: string]: string } = {
    'Paid': 'bg-emerald-50 ring-emerald-200 text-emerald-700',
    'Sent': 'bg-blue-50 ring-blue-200 text-blue-700',
    'Draft': 'bg-slate-50 ring-slate-200 text-slate-700',
    'Overdue': 'bg-rose-50 ring-rose-200 text-rose-700',
    'Approved': 'bg-emerald-50 ring-emerald-200 text-emerald-700',
    'Submitted': 'bg-amber-50 ring-amber-200 text-amber-700',
    'Reimbursed': 'bg-purple-50 ring-purple-200 text-purple-700',
    'Confirmed': 'bg-emerald-50 ring-emerald-200 text-emerald-700',
    'Pending': 'bg-yellow-50 ring-yellow-200 text-yellow-700',
  };

  const BadgeComponent = ({ status, count = 1 }: { status: string; count?: number }) => (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ring-1 ${STATUS_COLORS[status] || 'bg-slate-50 ring-slate-200 text-slate-700'}`}>
      {status} {count > 1 && `(${count})`}
    </span>
  );

  return (
    <div className='text-slate-800'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-4xl font-bold text-slate-900 mb-2'>Financial Overview</h1>
        <p className='text-slate-500'>Complete summary of invoices, expenses, and payments</p>
      </div>

      {/* Top Metrics Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
        {/* Total Revenue */}
        <div className='bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl border border-emerald-200 p-6 shadow-sm hover:shadow-md transition-shadow'>
          <div className='flex items-center justify-between mb-4'>
            <div className='bg-emerald-100 p-3 rounded-lg'>
              <FaCoins className='text-emerald-600 text-xl' />
            </div>
            <div className='flex items-center text-emerald-600 text-sm font-semibold'>
              <MdTrendingUp className='mr-1' /> +12%
            </div>
          </div>
          <p className='text-emerald-600 text-sm font-medium mb-1'>Total Revenue</p>
          <h3 className='text-3xl font-bold text-emerald-900'>${totalRevenue.toLocaleString()}</h3>
          <p className='text-emerald-600 text-xs mt-2'>{paidInvoices} invoices paid</p>
        </div>

        {/* Total Expenses */}
        <div className='bg-gradient-to-br from-rose-50 to-rose-100/50 rounded-xl border border-rose-200 p-6 shadow-sm hover:shadow-md transition-shadow'>
          <div className='flex items-center justify-between mb-4'>
            <div className='bg-rose-100 p-3 rounded-lg'>
              <FaMoneyBillWave className='text-rose-600 text-xl' />
            </div>
            <div className='flex items-center text-rose-600 text-sm font-semibold'>
              <MdTrendingDown className='mr-1' /> -5%
            </div>
          </div>
          <p className='text-rose-600 text-sm font-medium mb-1'>Total Expenses</p>
          <h3 className='text-3xl font-bold text-rose-900'>${totalExpenses.toLocaleString()}</h3>
          <p className='text-rose-600 text-xs mt-2'>{approvedExpenses} expenses approved</p>
        </div>

        {/* Outstanding Invoices */}
        <div className='bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl border border-amber-200 p-6 shadow-sm hover:shadow-md transition-shadow'>
          <div className='flex items-center justify-between mb-4'>
            <div className='bg-amber-100 p-3 rounded-lg'>
              <FaFileInvoice className='text-amber-600 text-xl' />
            </div>
            <div className='flex items-center text-amber-600 text-sm font-semibold'>
              {invoices.filter(i => i.status === 'Overdue').length > 0 ? '⚠️ Alert' : '✓ Good'}
            </div>
          </div>
          <p className='text-amber-600 text-sm font-medium mb-1'>Outstanding</p>
          <h3 className='text-3xl font-bold text-amber-900'>${outstandingInvoices.toLocaleString()}</h3>
          <p className='text-amber-600 text-xs mt-2'>{invoices.filter(i => i.status === 'Overdue').length} overdue invoices</p>
        </div>

        {/* Confirmed Payments */}
        <div className='bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200 p-6 shadow-sm hover:shadow-md transition-shadow'>
          <div className='flex items-center justify-between mb-4'>
            <div className='bg-blue-100 p-3 rounded-lg'>
              <FaChartLine className='text-blue-600 text-xl' />
            </div>
            <div className='flex items-center text-blue-600 text-sm font-semibold'>
              {confirmedPayments} verified
            </div>
          </div>
          <p className='text-blue-600 text-sm font-medium mb-1'>Confirmed Payments</p>
          <h3 className='text-3xl font-bold text-blue-900'>${payments.reduce((sum, p) => p.status === 'Confirmed' ? sum + p.amount_received : sum, 0).toLocaleString()}</h3>
          <p className='text-blue-600 text-xs mt-2'>{confirmedPayments} payments confirmed</p>
        </div>
      </div>

      {/* Recent Invoices Section */}
      <div className='bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h2 className='text-xl font-bold text-slate-900'>Recent Invoices</h2>
            <p className='text-sm text-slate-500 mt-1'>Latest {invoices.length} invoices</p>
          </div>
          <div className='text-right'>
            <p className='text-2xl font-bold text-slate-900'>{invoices.length}</p>
            <p className='text-xs text-slate-500'>Total invoices</p>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {invoices.map((invoice) => (
            <div key={invoice.id} className='border border-slate-200 rounded-lg p-4 hover:border-slate-300 hover:shadow-md transition-all'>
              <div className='flex justify-between items-start mb-3'>
                <div>
                  <p className='font-semibold text-slate-900 text-sm'>{invoice.invoice_number}</p>
                  <p className='text-xs text-slate-500'>{invoice.client_id}</p>
                </div>
                <BadgeComponent status={invoice.status} />
              </div>
              <div className='border-t border-slate-200 pt-3'>
                <p className='text-lg font-bold text-slate-900'>${invoice.amount.toLocaleString()}</p>
                <p className='text-xs text-slate-500 mt-2'>Due: {invoice.due_date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Expenses Section */}
      <div className='bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h2 className='text-xl font-bold text-slate-900'>Recent Expenses</h2>
            <p className='text-sm text-slate-500 mt-1'>Latest {expenses.length} expenses</p>
          </div>
          <div className='text-right'>
            <p className='text-2xl font-bold text-slate-900'>{expenses.length}</p>
            <p className='text-xs text-slate-500'>Total expenses</p>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {expenses.map((expense) => (
            <div key={expense.id} className='border border-slate-200 rounded-lg p-4 hover:border-slate-300 hover:shadow-md transition-all'>
              <div className='flex justify-between items-start mb-3'>
                <div>
                  <p className='font-semibold text-slate-900 text-sm'>{expense.expense_name}</p>
                  <p className='text-xs text-slate-500'>{expense.category}</p>
                </div>
                <BadgeComponent status={expense.status} />
              </div>
              <div className='border-t border-slate-200 pt-3'>
                <p className='text-lg font-bold text-slate-900'>${expense.amount.toLocaleString()}</p>
                <p className='text-xs text-slate-500 mt-2'>Date: {expense.expense_date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Payments Section */}
      <div className='bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h2 className='text-xl font-bold text-slate-900'>Recent Payments</h2>
            <p className='text-sm text-slate-500 mt-1'>Latest {payments.length} payments</p>
          </div>
          <div className='text-right'>
            <p className='text-2xl font-bold text-slate-900'>{payments.length}</p>
            <p className='text-xs text-slate-500'>Total payments</p>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {payments.map((payment) => (
            <div key={payment.id} className='border border-slate-200 rounded-lg p-4 hover:border-slate-300 hover:shadow-md transition-all'>
              <div className='flex justify-between items-start mb-3'>
                <div>
                  <p className='font-semibold text-slate-900 text-sm'>{payment.invoice_id}</p>
                  <p className='text-xs text-slate-500'>{payment.payment_method.replace('_', ' ')}</p>
                </div>
                <BadgeComponent status={payment.status} />
              </div>
              <div className='border-t border-slate-200 pt-3'>
                <p className='text-lg font-bold text-slate-900'>${payment.amount_received.toLocaleString()}</p>
                <p className='text-xs text-slate-500 mt-2'>Date: {payment.payment_date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardFinancial;
