import React from 'react'
import { ProviderDetail } from '@/components/ui/medical/ProvidersTable'

export default function ProviderDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="w-full">
      <ProviderDetail providerId={params.id} />
    </div>
  )
}
