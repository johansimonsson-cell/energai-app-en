'use client'

const metrics = [
  { value: '2,500+', label: 'installations' },
  { value: '4.8/5', label: 'customer rating' },
  { value: '25 years', label: 'panel warranty' },
  { value: '100%', label: 'satisfaction guarantee' },
]

const quotes = [
  {
    text: 'The entire process was smooth from start to finish. The solar panels produce more than expected and the app gives full control.',
    name: 'Anna K.',
    location: 'Taby',
  },
  {
    text: 'Finally an energy company that doesn\'t hide behind complicated contracts. Transparent, fast and professional.',
    name: 'Marcus L.',
    location: 'Gothenburg',
  },
  {
    text: 'Saving over 18,000 kr per year with solar panels and battery. The payback period was shorter than calculated.',
    name: 'Eva S.',
    location: 'Uppsala',
  },
]

const certifications = [
  'F-tax certificate',
  'Authorised electrical installer',
  'Insured installation',
]

export function TrustProofView({ data: _data }: { data: Record<string, unknown> }) {
  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-12)',
        background: 'var(--color-black)',
        padding: 'var(--space-12) var(--space-8)',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-primary)',
          fontSize: 'var(--type-display-sm)',
          fontWeight: 700,
          letterSpacing: '-0.01em',
          color: 'var(--color-white)',
          margin: 0,
        }}
      >
        Why customers choose Energai
      </h2>

      {/* Key metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
        {metrics.map((m, i) => (
          <div
            key={m.label}
            className="stagger-item"
            style={{
              borderLeft: i === 0 ? 'none' : '2px solid var(--color-gray-700)',
              paddingLeft: i === 0 ? 0 : 'var(--space-6)',
              paddingRight: 'var(--space-6)',
            }}
          >
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--type-heading-lg)',
                fontWeight: 700,
                color: 'var(--color-white)',
                lineHeight: 1.1,
              }}
            >
              {m.value}
            </span>
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--type-body-sm)',
                fontWeight: 400,
                color: 'var(--color-gray-300)',
                marginTop: 'var(--space-1)',
              }}
            >
              {m.label}
            </span>
          </div>
        ))}
      </div>

      {/* Customer quotes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
        {quotes.map((q) => (
          <div
            key={q.name}
            style={{
              borderLeft: '2px solid var(--color-gray-700)',
              paddingLeft: 'var(--space-6)',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--type-body-md)',
                fontWeight: 400,
                fontStyle: 'italic',
                color: 'var(--color-gray-300)',
                lineHeight: 1.6,
                margin: '0 0 var(--space-3) 0',
                maxWidth: '55ch',
              }}
            >
              &ldquo;{q.text}&rdquo;
            </p>
            <span
              style={{
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--type-body-sm)',
                fontWeight: 500,
                color: 'var(--color-gray-500)',
              }}
            >
              {q.name}, {q.location}
            </span>
          </div>
        ))}
      </div>

      {/* Certifications */}
      <div>
        <h3
          style={{
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--type-heading-sm)',
            fontWeight: 700,
            color: 'var(--color-white)',
            margin: '0 0 var(--space-4) 0',
          }}
        >
          Certifications
        </h3>
        <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
          {certifications.map((cert) => (
            <span
              key={cert}
              style={{
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--type-body-sm)',
                fontWeight: 400,
                color: 'var(--color-gray-300)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 6L5 9L10 3" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
              </svg>
              {cert}
            </span>
          ))}
        </div>
      </div>

      {/* Performance guarantee */}
      <div
        style={{
          borderLeft: '2px solid var(--color-gray-700)',
          paddingLeft: 'var(--space-6)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--type-body-sm)',
            fontWeight: 400,
            color: 'var(--color-gray-300)',
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          The panels are guaranteed to produce at least 80% of nominal output after 25 years.
        </p>
      </div>

      <style>{`
        @media (max-width: 767px) {
          section > div[style*="grid-template-columns: repeat(4"] {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: var(--space-6) 0 !important;
          }
          section > div[style*="grid-template-columns: repeat(4"] > div:nth-child(odd) {
            border-left: none !important;
            padding-left: 0 !important;
          }
          section > div[style*="display: flex"][style*="gap"] {
            flex-direction: column !important;
          }
        }
      `}</style>
    </section>
  )
}
