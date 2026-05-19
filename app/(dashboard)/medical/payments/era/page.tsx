import React from 'react'
import { ERAParser } from '@/components/ui/medical/PaymentsTable'

export default function ImportERA() {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">ERA Import</h1>
      <ERAParser />
    </div>
  )
}
