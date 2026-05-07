import React from 'react'
import { RevenueCycleMetrics } from '@/components/ui/medical/MedicalReports'

export default function RevenueCycleReportPage() {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">Revenue Cycle Metrics</h1>
      <RevenueCycleMetrics />
    </div>
  )
}
