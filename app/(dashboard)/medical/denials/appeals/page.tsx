import React from 'react'
import { AppealForm } from '@/components/ui/medical/DenialsTable'

export default function ManageAppeals() {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">Appeal Management</h1>
      <AppealForm />
    </div>
  )
}
