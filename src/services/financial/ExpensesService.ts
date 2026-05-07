// import { apiRequest } from '../api/client';

export interface Expense {
  _id?: string;
  expense_name: string;
  category: 'Travel' | 'Equipment' | 'Office' | 'Utilities' | 'Software' | 'Other';
  amount: string;
  currency: string;
  expense_date: number;
  submitted_by: string;
  approved_by?: string;
  status: 'Submitted' | 'Approved' | 'Rejected' | 'Reimbursed';
  receipt_url?: string;
  project_id?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Hardcoded mock data
let expensesDatabase: Expense[] = [
  {
    _id: '1',
    expense_name: 'Office Supplies',
    category: 'Office',
    amount: '250.50',
    currency: 'USD',
    expense_date: new Date('2026-04-15').getTime(),
    submitted_by: 'John Doe',
    approved_by: 'Manager Name',
    status: 'Approved',
    receipt_url: 'https://storage.example.com/receipt1.pdf',
    project_id: 'proj-001',
    notes: 'Quarterly office supplies',
    createdAt: '2026-04-15T14:20:00Z',
    updatedAt: '2026-04-17T10:15:00Z',
  },
  {
    _id: '2',
    expense_name: 'Client Meeting - Travel',
    category: 'Travel',
    amount: '1200.00',
    currency: 'USD',
    expense_date: new Date('2026-04-10').getTime(),
    submitted_by: 'Jane Smith',
    status: 'Submitted',
    receipt_url: 'https://storage.example.com/receipt2.pdf',
    notes: 'Flight and hotel for NYC client meeting',
    createdAt: '2026-04-10T09:30:00Z',
    updatedAt: '2026-04-10T09:30:00Z',
  },
  {
    _id: '3',
    expense_name: 'Software License',
    category: 'Software',
    amount: '500.00',
    currency: 'USD',
    expense_date: new Date('2026-04-12').getTime(),
    submitted_by: 'Alex Johnson',
    approved_by: 'Finance Lead',
    status: 'Reimbursed',
    receipt_url: 'https://storage.example.com/receipt3.pdf',
    project_id: 'proj-002',
    notes: 'Annual license renewal',
    createdAt: '2026-04-12T11:00:00Z',
    updatedAt: '2026-04-20T15:45:00Z',
  },
];

// CRUD Operations
export const ExpensesService = {
  // Get all expenses
  getAllExpenses: async (): Promise<Expense[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...expensesDatabase]);
      }, 300);
    });
  },

  // Get single expense
  getExpenseById: async (id: string): Promise<Expense | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const expense = expensesDatabase.find((e) => e._id === id);
        resolve(expense || null);
      }, 200);
    });
  },

  // Create new expense
  createExpense: async (expense: Expense): Promise<Expense> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newExpense: Expense = {
          ...expense,
          _id: String(Date.now()),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        expensesDatabase.push(newExpense);
        resolve(newExpense);
      }, 300);
    });
  },

  // Update expense
  updateExpense: async (id: string, expense: Expense): Promise<Expense | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = expensesDatabase.findIndex((e) => e._id === id);
        if (index !== -1) {
          const updated: Expense = {
            ...expensesDatabase[index],
            ...expense,
            updatedAt: new Date().toISOString(),
          };
          expensesDatabase[index] = updated;
          resolve(updated);
        } else {
          resolve(null);
        }
      }, 300);
    });
  },

  // Delete expense
  deleteExpense: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = expensesDatabase.findIndex((e) => e._id === id);
        if (index !== -1) {
          expensesDatabase.splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 300);
    });
  },

  // Approve expense
  approveExpense: async (id: string, approvedBy: string): Promise<Expense | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = expensesDatabase.findIndex((e) => e._id === id);
        if (index !== -1) {
          const updated: Expense = {
            ...expensesDatabase[index],
            status: 'Approved',
            approved_by: approvedBy,
            updatedAt: new Date().toISOString(),
          };
          expensesDatabase[index] = updated;
          resolve(updated);
        } else {
          resolve(null);
        }
      }, 300);
    });
  },

  // Reject expense
  rejectExpense: async (id: string): Promise<Expense | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = expensesDatabase.findIndex((e) => e._id === id);
        if (index !== -1) {
          const updated: Expense = {
            ...expensesDatabase[index],
            status: 'Rejected',
            updatedAt: new Date().toISOString(),
          };
          expensesDatabase[index] = updated;
          resolve(updated);
        } else {
          resolve(null);
        }
      }, 300);
    });
  },

  // Mark as reimbursed
  markAsReimbursed: async (id: string): Promise<Expense | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = expensesDatabase.findIndex((e) => e._id === id);
        if (index !== -1) {
          const updated: Expense = {
            ...expensesDatabase[index],
            status: 'Reimbursed',
            updatedAt: new Date().toISOString(),
          };
          expensesDatabase[index] = updated;
          resolve(updated);
        } else {
          resolve(null);
        }
      }, 300);
    });
  },
};