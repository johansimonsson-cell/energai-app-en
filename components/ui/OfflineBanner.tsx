'use client'

import { useEffect } from 'react'
import { useAppStore } from '@/lib/store'

export function OfflineBanner() {
  const { isOnline, setOnline } = useAppStore()

  useEffect(() => {
    const handleOnline = () => setOnline(true)
    const handleOffline = () => setOnline(false)

    // Set initial state
    setOnline(navigator.onLine)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [setOnline])

  if (isOnline) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'var(--color-warning)',
        color: 'var(--color-white)',
        padding: 'var(--space-3) var(--space-6)',
        fontFamily: 'var(--font-primary)',
        fontSize: 'var(--type-body-sm)',
        fontWeight: 500,
        textAlign: 'center',
        zIndex: 10000,
      }}
      role="alert"
    >
      You appear to be offline. Check your internet connection.
    </div>
  )
}
