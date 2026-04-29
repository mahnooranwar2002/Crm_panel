import React from 'react'
import { PatientForm } from '@/components/ui/medical/PatientsTable'

export default function CreatePatient() {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">New Patient Registration</h1>
      <PatientForm />
    </div>
  )
}
