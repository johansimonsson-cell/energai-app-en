'use client'

import { useEffect, useState } from 'react'

interface Stats {
  totalCustomers: number
  newRegistrations: number
  activeSessions: number
  totalAgreements: number
  conversionRate: number
}

const statCards = [
  { key: 'totalCustomers' as const, label: 'Active customers', suffix: '' },
  { key: 'newRegistrations' as const, label: 'New (7 days)', suffix: '' },
  { key: 'activeSessions' as const, label: 'Chat sessions (7d)', suffix: '' },
  { key: 'totalAgreements' as const, label: 'Active contracts', suffix: '' },
  { key: 'conversionRate' as const, label: 'Conversion rate', suffix: '%' },
]

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error)
  }, [])

  return (
    <div style={{ maxWidth: '960px' }}>
      <h1
        style={{
          fontFamily: 'var(--font-primary)',
          fontSize: 'var(--type-display-sm)',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          color: 'var(--color-black)',
          margin: '0 0 var(--space-10) 0',
        }}
      >
        Dashboard
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 'var(--space-6)',
        }}
      >
        {statCards.map((card) => (
          <div
            key={card.key}
            style={{
              background: 'var(--color-white)',
              border: '1px solid var(--color-gray-100)',
              padding: 'var(--space-6)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--type-label-lg)',
                fontWeight: 400,
                color: 'var(--color-gray-600)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {card.label}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--type-display-sm)',
                fontWeight: 700,
                color: 'var(--color-black)',
                letterSpacing: '-0.03em',
                lineHeight: 1,
              }}
            >
              {stats ? `${stats[card.key]}${card.suffix}` : '—'}
            </span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'var(--space-12)' }}>
        <h2
          style={{
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--type-heading-md)',
            fontWeight: 700,
            color: 'var(--color-black)',
            margin: '0 0 var(--space-6) 0',
            letterSpacing: '-0.01em',
          }}
        >
          Recent activity
        </h2>
        <div
          style={{
            background: 'var(--color-white)',
            border: '1px solid var(--color-gray-100)',
            padding: 'var(--space-8)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--type-body-sm)',
              color: 'var(--color-gray-500)',
              margin: 0,
            }}
          >
            The activity log will be displayed here in future versions.
          </p>
        </div>
      </div>
    </div>
  )
}
