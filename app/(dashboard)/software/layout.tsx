'use client';
import React from 'react';

export default function SoftwareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl w-full">
      {children}
    </div>
  );
}