import React from 'react'
import { InsurancePlanDetail } from '@/components/ui/medical/InsurancePlansTable'

export default function InsurancePlanDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="w-full">
      <InsurancePlanDetail planId={params.id} />
    </div>
  )
}
