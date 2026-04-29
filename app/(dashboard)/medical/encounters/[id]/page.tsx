import React from 'react'
import { EncounterDetail } from '@/components/ui/medical/EncountersTable'

export default function EncounterDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="w-full">
      <EncounterDetail encounterId={params.id} />
    </div>
  )
}
