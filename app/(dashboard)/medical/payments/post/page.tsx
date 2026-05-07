import React from 'react'
import { PaymentPostingForm } from '@/components/ui/medical/PaymentsTable'

export default function PostPayment() {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">Payment Posting</h1>
      <PaymentPostingForm />
    </div>
  )
}
