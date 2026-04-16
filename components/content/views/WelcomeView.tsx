'use client'

const sellingPoints = [
  { label: 'Transparent pricing', text: 'No hidden fees. You see exactly what you pay and why.' },
  { label: 'AI-powered customer service', text: 'Get answers instantly, around the clock. No phone queues, no waiting.' },
  { label: '100% Swedish electricity', text: 'All our electricity is produced in Sweden, from wind, hydro, and solar power.' },
]

export function WelcomeView({ data: _data }: { data: Record<string, unknown> }) {
  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        height: '100%',
        padding: '0 0 var(--space-16) 0',
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-primary)',
          fontSize: 'clamp(56px, 10vw, var(--type-display-xl))',
          fontWeight: 900,
          lineHeight: 0.9,
          letterSpacing: '-0.02em',
          color: 'var(--color-white)',
          margin: '0 0 var(--space-6) 0',
          maxWidth: '60%',
        }}
      >
        Energai
      </h1>
      <p
        style={{
          fontFamily: 'var(--font-primary)',
          fontSize: 'var(--type-body-lg)',
          fontWeight: 400,
          lineHeight: 1.5,
          color: 'rgba(255,255,255,0.7)',
          maxWidth: '45ch',
          margin: '0 0 var(--space-16) 0',
        }}
      >
        Swedish, transparent, and AI-powered. Tell us what you need in the chat
        and we'll help you find the right electricity plan.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0',
        }}
      >
        {sellingPoints.map((point, i) => (
          <div
            key={point.label}
            className="stagger-item"
            style={{
              borderLeft: i === 0 ? 'none' : '2px solid var(--color-gray-700)',
              paddingLeft: i === 0 ? '0' : 'var(--space-6)',
              paddingRight: 'var(--space-6)',
            }}
          >
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--type-body-sm)',
                fontWeight: 500,
                color: 'var(--color-white)',
                marginBottom: 'var(--space-2)',
              }}
            >
              {point.label}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--type-body-sm)',
                fontWeight: 400,
                lineHeight: 1.5,
                color: 'var(--color-gray-300)',
              }}
            >
              {point.text}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 767px) {
          section > div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
            gap: var(--space-6) !important;
          }
          section > div[style*="grid-template-columns"] > div {
            border-left: 2px solid var(--color-gray-700) !important;
            padding-left: var(--space-6) !important;
          }
        }
      `}</style>
    </section>
  )
}
