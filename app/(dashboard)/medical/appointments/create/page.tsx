import React from 'react'
import { AppointmentForm } from '@/components/ui/medical/AppointmentCalendar'

export default function BookAppointment() {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">Book Appointment</h1>
      <AppointmentForm />
    </div>
  )
}
