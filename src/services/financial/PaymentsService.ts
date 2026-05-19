export interface Payment {
  _id?: string;
  invoice_id: string;
  amount_received: number;
  payment_date: number;
  payment_method: 'Bank_Transfer' | 'Cheque' | 'Credit_Card' | 'Cash' | 'Wire';
  reference_number?: string;
  bank_account?: string;
  status: 'Pending' | 'Confirmed' | 'Reconciled';
  notes?: string;
  recorded_by: string;
  createdAt?: string;
  updatedAt?: string;
}

// Hardcoded mock data
let paymentsDatabase: Payment[] = [
  {
    _id: '1',
    invoice_id: 'INV-2026-001',
    amount_received: 5500,
    payment_date: new Date('2026-04-22').getTime(),
    payment_method: 'Bank_Transfer',
    reference_number: 'TXN-12345-ABC',
    bank_account: 'XXXX-XXXX-5678',
    status: 'Confirmed',
    notes: 'Received via wire transfer',
    recorded_by: 'Finance Team',
    createdAt: '2026-04-22T09:00:00Z',
    updatedAt: '2026-04-22T09:00:00Z',
  },
  {
    _id: '2',
    invoice_id: 'INV-2026-002',
    amount_received: 3250.75,
    payment_date: new Date('2026-04-20').getTime(),
    payment_method: 'Credit_Card',
    reference_number: 'CC-98765-XYZ',
    status: 'Confirmed',
    notes: 'Credit card payment received',
    recorded_by: 'Finance Team',
    createdAt: '2026-04-20T14:30:00Z',
    updatedAt: '2026-04-20T14:30:00Z',
  },
  {
    _id: '3',
    invoice_id: 'INV-2026-003',
    amount_received: 1500,
    payment_date: new Date('2026-04-25').getTime(),
    payment_method: 'Cheque',
    reference_number: 'CHQ-55555-LMN',
    status: 'Pending',
    notes: 'Cheque received, pending bank clearing',
    recorded_by: 'Finance Team',
    createdAt: '2026-04-25T10:15:00Z',
    updatedAt: '2026-04-25T10:15:00Z',
  },
  {
    _id: '4',
    invoice_id: 'INV-2026-004',
    amount_received: 8750,
    payment_date: new Date('2026-04-18').getTime(),
    payment_method: 'Wire',
    reference_number: 'WIRE-77777-OPQ',
    bank_account: 'YYYY-YYYY-9999',
    status: 'Reconciled',
    notes: 'Wire transfer reconciled with bank statement',
    recorded_by: 'Finance Team',
    createdAt: '2026-04-18T08:45:00Z',
    updatedAt: '2026-04-21T16:20:00Z',
  },
];

// CRUD Operations
export const PaymentsService = {
  // Get all payments
  getAllPayments: async (): Promise<Payment[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...paymentsDatabase]);
      }, 300);
    });
  },

  // Get single payment
  getPaymentById: async (id: string): Promise<Payment | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const payment = paymentsDatabase.find((p) => p._id === id);
        resolve(payment || null);
      }, 200);
    });
  },

  // Create new payment
  createPayment: async (payment: Payment): Promise<Payment> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newPayment: Payment = {
          ...payment,
          _id: String(Date.now()),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        paymentsDatabase.push(newPayment);
        resolve(newPayment);
      }, 300);
    });
  },

  // Update payment
  updatePayment: async (id: string, payment: Payment): Promise<Payment | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = paymentsDatabase.findIndex((p) => p._id === id);
        if (index !== -1) {
          const updated: Payment = {
            ...paymentsDatabase[index],
            ...payment,
            updatedAt: new Date().toISOString(),
          };
          paymentsDatabase[index] = updated;
          resolve(updated);
        } else {
          resolve(null);
        }
      }, 300);
    });
  },

  // Delete payment
  deletePayment: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = paymentsDatabase.findIndex((p) => p._id === id);
        if (index !== -1) {
          paymentsDatabase.splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 300);
    });
  },

  // Confirm payment
  confirmPayment: async (id: string): Promise<Payment | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = paymentsDatabase.findIndex((p) => p._id === id);
        if (index !== -1) {
          const updated: Payment = {
            ...paymentsDatabase[index],
            status: 'Confirmed',
            updatedAt: new Date().toISOString(),
          };
          paymentsDatabase[index] = updated;
          resolve(updated);
        } else {
          resolve(null);
        }
      }, 300);
    });
  },

  // Reconcile payment
  reconcilePayment: async (id: string): Promise<Payment | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = paymentsDatabase.findIndex((p) => p._id === id);
        if (index !== -1) {
          const updated: Payment = {
            ...paymentsDatabase[index],
            status: 'Reconciled',
            updatedAt: new Date().toISOString(),
          };
          paymentsDatabase[index] = updated;
          resolve(updated);
        } else {
          resolve(null);
        }
      }, 300);
    });
  },
};

