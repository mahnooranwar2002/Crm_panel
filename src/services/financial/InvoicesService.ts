export interface Invoice {
  _id?: string;
  invoiceNumber: string;
  clientName: string;
  email: string;
  phone: string;
  amount: number;
  dueDate: string;
  issueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  description: string;
  items?: InvoiceItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

const STORAGE_KEY = 'invoices_data';

const initialInvoices: Invoice[] = [
  {
    _id: '1',
    invoiceNumber: 'INV-001',
    clientName: 'Acme Corporation',
    email: 'contact@acme.com',
    phone: '555-0100',
    amount: 5000.0,
    dueDate: '2026-05-23',
    issueDate: '2026-04-23',
    status: 'paid',
    description: 'Professional Services - Q1 2026',
    items: [
      { description: 'Consulting Services', quantity: 40, rate: 100, amount: 4000 },
      { description: 'Software License', quantity: 1, rate: 1000, amount: 1000 },
    ],
    createdAt: '2026-04-23',
    updatedAt: '2026-04-23',
  }
];

// Helper to calculate total amount from items
const calculateTotal = (items: InvoiceItem[] = []): number => {
  return items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
};

const initializeStorage = () => {
  if (typeof window === 'undefined') return;
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialInvoices));
  }
};

export const getAllInvoices = (): Promise<Invoice[]> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(initialInvoices);
      return;
    }
    initializeStorage();
    const data = localStorage.getItem(STORAGE_KEY);
    const invoices = data ? JSON.parse(data) : initialInvoices;
    setTimeout(() => resolve(invoices), 300);
  });
};

export const getInvoiceById = (id: string): Promise<Invoice | undefined> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(initialInvoices.find(inv => inv._id === id));
      return;
    }
    initializeStorage();
    const data = localStorage.getItem(STORAGE_KEY);
    const invoices = data ? JSON.parse(data) : initialInvoices;
    const invoice = invoices.find((inv: Invoice) => inv._id === id);
    setTimeout(() => resolve(invoice), 300);
  });
};

export const createInvoice = (invoice: Invoice): Promise<Invoice> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(invoice);
      return;
    }
    initializeStorage();
    const data = localStorage.getItem(STORAGE_KEY);
    const invoices = data ? JSON.parse(data) : initialInvoices;
    
    const newInvoice = {
      ...invoice,
      _id: Date.now().toString(),
      amount: calculateTotal(invoice.items), // Ensure amount is calculated
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    invoices.push(newInvoice);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
    setTimeout(() => resolve(newInvoice), 300);
  });
};

export const updateInvoice = (id: string, invoice: Partial<Invoice>): Promise<Invoice> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window not available'));
      return;
    }
    initializeStorage();
    const data = localStorage.getItem(STORAGE_KEY);
    const invoices = data ? JSON.parse(data) : initialInvoices;
    const index = invoices.findIndex((inv: Invoice) => inv._id === id);
    
    if (index === -1) {
      reject(new Error('Invoice not found'));
      return;
    }
    
    const updatedInvoice = {
      ...invoices[index],
      ...invoice,
      amount: invoice.items ? calculateTotal(invoice.items) : invoices[index].amount,
      _id: id,
      updatedAt: new Date().toISOString(),
    };
    
    invoices[index] = updatedInvoice;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
    setTimeout(() => resolve(updatedInvoice), 300);
  });
};

export const deleteInvoice = (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window not available'));
      return;
    }
    initializeStorage();
    const data = localStorage.getItem(STORAGE_KEY);
    const invoices = data ? JSON.parse(data) : initialInvoices;
    const filteredInvoices = invoices.filter((inv: Invoice) => inv._id !== id);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredInvoices));
    setTimeout(() => resolve(), 300);
  });
};