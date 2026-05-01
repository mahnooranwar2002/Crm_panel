// Hard-coded seed data for payments
export const PAYMENT_SEED_DATA = [
  {
    id: 'PAY-001',
    claimId: 'CLM-001',
    amount: 150.00,
    type: 'Insurance Check',
    date: '2026-04-28',
    patient: 'John Smith',
    status: 'Posted',
    notes: 'Payment received from Blue Cross'
  },
  {
    id: 'PAY-002',
    claimId: 'CLM-002',
    amount: 250.00,
    type: 'Insurance Check',
    date: '2026-04-27',
    patient: 'Maria Garcia',
    status: 'Posted',
    notes: 'Full payment from United Healthcare'
  },
  {
    id: 'PAY-003',
    claimId: 'CLM-003',
    amount: 125.00,
    type: 'Patient Copay',
    date: '2026-04-26',
    patient: 'Robert Johnson',
    status: 'Posted',
    notes: 'Patient copay collected'
  },
  {
    id: 'PAY-004',
    claimId: 'CLM-004',
    amount: 75.00,
    type: 'Contractual Adjustment',
    date: '2026-04-25',
    patient: 'Jennifer Lee',
    status: 'Posted',
    notes: 'Contractual write-off adjustment'
  }
];

// Payment Service - Payment recording and posting
export const paymentService = {
  // Local storage for payments
  payments: [...PAYMENT_SEED_DATA],

  // Record new payment
  async recordPayment(paymentData: any) {
    try {
      const newPayment = {
        id: `PAY-${String(this.payments.length + 1).padStart(3, '0')}`,
        ...paymentData,
        status: 'Posted'
      };
      this.payments.push(newPayment);
      return newPayment;
    } catch (error) {
      throw error;
    }
  },

  // Get all payments
  async getAllPayments(filters?: any) {
    try {
      return this.payments;
    } catch (error) {
      throw error;
    }
  },

  // Get payment by ID
  async getPaymentById(paymentId: string) {
    try {
      return this.payments.find(p => p.id === paymentId);
    } catch (error) {
      throw error;
    }
  },

  // Update payment
  async updatePayment(paymentId: string, paymentData: any) {
    try {
      const index = this.payments.findIndex(p => p.id === paymentId);
      if (index !== -1) {
        this.payments[index] = { ...this.payments[index], ...paymentData };
        return this.payments[index];
      }
      throw new Error('Payment not found');
    } catch (error) {
      throw error;
    }
  },

  // Delete payment
  async deletePayment(paymentId: string) {
    try {
      const index = this.payments.findIndex(p => p.id === paymentId);
      if (index !== -1) {
        this.payments.splice(index, 1);
        return { success: true };
      }
      throw new Error('Payment not found');
    } catch (error) {
      throw error;
    }
  },

  // Apply payment to claim
  async applyPayment(paymentId: string, applyData: any) {
    try {
      const payment = this.payments.find(p => p.id === paymentId);
      if (payment) {
        payment.status = 'Applied';
        return payment;
      }
      throw new Error('Payment not found');
    } catch (error) {
      throw error;
    }
  },

  // Get unapplied payments
  async getUnappliedPayments() {
    try {
      return this.payments.filter(p => p.status === 'Unapplied');
    } catch (error) {
      throw error;
    }
  },

  // Generate patient statement
  async generatePatientStatement(statementData: any) {
    try {
      return { success: true, statementId: 'STMT-' + Date.now() };
    } catch (error) {
      throw error;
    }
  },
};