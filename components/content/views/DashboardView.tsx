'use client'

import { useAppStore } from '@/lib/store'

export function DashboardView({ data: _data }: { data: Record<string, unknown> }) {
  const user = useAppStore((s) => s.user)
  const name = user?.name || user?.email || 'Customer'

  return (
    <section style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Dark hero section */}
      <div
        style={{
          background: 'var(--color-black)',
          margin: 'calc(-1 * var(--space-10))',
          marginBottom: 0,
          padding: 'var(--space-16) var(--space-10) var(--space-12)',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-primary)',
            fontSize: 'clamp(28px, 4vw, var(--type-display-sm))',
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '-0.01em',
            color: 'var(--color-white)',
            margin: '0 0 var(--space-3) 0',
          }}
        >
          Hi, {name}.
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--type-body-lg)',
            fontWeight: 400,
            lineHeight: 1.5,
            color: 'rgba(255,255,255,0.7)',
            margin: 0,
          }}
        >
          Variable rate plan &middot; Active since Jan 2025
        </p>
      </div>

      {/* Light data section */}
      <div
        style={{
          flex: 1,
          padding: 'var(--space-12) 0 var(--space-10)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0',
          }}
        >
          {[
            { value: '847 kr', label: 'Next invoice', sublabel: 'Due May 15' },
            { value: '312 kWh', label: 'Usage 30d', sublabel: '−8% vs last month' },
            { value: 'Active', label: 'Plan status', sublabel: 'Variable rate' },
          ].map((card, i) => (
            <div
              key={card.label}
              className="stagger-item"
              style={{
                borderLeft: i === 0 ? 'none' : '2px solid var(--color-gray-200)',
                paddingLeft: i === 0 ? '0' : 'var(--space-6)',
                paddingRight: 'var(--space-6)',
              }}
            >
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--type-heading-lg)',
                  fontWeight: 700,
                  lineHeight: 1.15,
                  letterSpacing: '-0.005em',
                  color: 'var(--color-black)',
                  marginBottom: 'var(--space-2)',
                }}
              >
                {card.value}
              </span>
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--type-label-lg)',
                  fontWeight: 500,
                  color: 'var(--color-gray-600)',
                  marginBottom: 'var(--space-1)',
                }}
              >
                {card.label}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--type-label-md)',
                  fontWeight: 400,
                  color: 'var(--color-gray-500)',
                }}
              >
                {card.sublabel}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          section > div:last-child > div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
            gap: var(--space-8) !important;
          }
          section > div:last-child > div[style*="grid-template-columns"] > div {
            border-left: 2px solid var(--color-gray-200) !important;
            padding-left: var(--space-6) !important;
          }
        }
      `}</style>
    </section>
  )
}
