import React from 'react'
import { EligibilityChecker } from '@/components/ui/medical/InsurancePlansTable'


export default function EligibilityVerification() {
  return (
    <div className="w-full text-black">
      <h1 className="text-2xl font-bold mb-6">Insurance Eligibility Verification</h1>
      <EligibilityChecker />
    </div>
  )
}
