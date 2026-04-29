import React from 'react'
import { PatientDetail } from '@/components/ui/medical/PatientsTable'

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="w-full">
      <PatientDetail patientId={params.id} />
    </div>
  )
}
