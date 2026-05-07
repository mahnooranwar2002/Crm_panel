import React from 'react'
import { ClaimScrubber } from '@/components/ui/medical/ClaimsTable'

export default function ScrubClaims() {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">Claim Scrubbing</h1>
      <ClaimScrubber />
    </div>
  )
}
