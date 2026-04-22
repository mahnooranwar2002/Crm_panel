'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SoftwareMain() {
  const router = useRouter();

  useEffect(() => {
    router.push('/software/track-all-projects');
  }, [router]);

  return null;
}