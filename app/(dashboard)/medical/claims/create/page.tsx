import React from 'react'
import { ClaimForm } from '@/components/ui/medical/ClaimsTable'

export default function GenerateClaim() {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">Generate Claim</h1>
      <ClaimForm />
    </div>
  )
}
