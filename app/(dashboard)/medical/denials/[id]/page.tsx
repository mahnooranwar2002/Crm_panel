import React from 'react'
import { DenialDetail } from '@/components/ui/medical/DenialsTable'

export default function DenialDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="w-full">
      <DenialDetail denialId={params.id} />
    </div>
  )
}
