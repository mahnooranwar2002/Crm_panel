import React from 'react'
import { EncounterForm } from '@/components/ui/medical/EncountersTable'

export default function CreateEncounter() {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">New Encounter / Charge Capture</h1>
      <EncounterForm />
    </div>
  )
}
