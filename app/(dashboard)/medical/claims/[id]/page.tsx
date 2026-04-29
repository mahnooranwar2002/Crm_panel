import React from 'react'
import { ClaimDetail } from '@/components/ui/medical/ClaimsTable'

export default function ClaimDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="w-full">
      <ClaimDetail claimId={params.id} />
    </div>
  )
}
