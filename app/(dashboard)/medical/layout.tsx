import React from 'react'

export default function MedicalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full">
      {children}
    </div>
  )
}
