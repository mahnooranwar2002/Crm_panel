import React from 'react'
import { ProviderForm } from '@/components/ui/medical/ProvidersTable'

export default function CreateProvider() {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">Add Provider</h1>
      <ProviderForm />
    </div>
  )
}
