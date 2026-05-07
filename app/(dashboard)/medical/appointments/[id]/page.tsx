import React from 'react'
import { AppointmentDetail } from '@/components/ui/medical/AppointmentCalendar'

export default function AppointmentDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="w-full">
      <AppointmentDetail appointmentId={params.id} />
    </div>
  )
}
