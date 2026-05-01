"use client"
import React, { useState } from 'react'
import { PatientForm } from '@/components/ui/medical/PatientsTable'
import { createPatient } from '@/src/services/medical/patientService'
import { useRouter } from 'next/navigation'

export default function CreatePatient() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (patientData: any) => {
    try {
      setLoading(true)
      await createPatient(patientData)
      router.push('/medical/patients')
    } catch (error) {
      console.error('Failed to create patient:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    router.push('/medical/patients')
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-10">
      <h1 className="text-2xl font-bold mb-6">New Patient Registration</h1>
      <PatientForm onSubmit={handleSubmit} onClose={handleClose} />
    </div>
  )
}
