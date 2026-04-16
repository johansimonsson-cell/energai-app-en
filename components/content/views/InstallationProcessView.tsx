'use client'

const timelineSteps = [
  {
    num: '01',
    title: 'Quote and contract',
    time: '1–2 days',
    description: 'You receive a tailored quote based on your roof, energy needs and budget. Sign digitally when you are ready.',
  },
  {
    num: '02',
    title: 'Technical inspection',
    time: '1 week',
    description: 'Our technician visits you to check the roof condition, electrical panel and plan the optimal placement.',
  },
  {
    num: '03',
    title: 'Material procurement',
    time: '1–2 weeks',
    description: 'We order panels, inverter and mounting materials. Everything is premium quality with full warranty.',
  },
  {
    num: '04',
    title: 'Installation',
    time: '1–3 days',
    description: 'Certified installers mount the system on your roof. You don\'t need to be home the entire time.',
  },
  {
    num: '05',
    title: 'Inspection and commissioning',
    time: '1 day',
    description: 'The system is inspected, connected to the grid and activated. You can see the production in real time via the app.',
  },
  {
    num: '06',
    title: 'Follow-up',
    time: 'After 1 month',
    description: 'We verify that everything is working optimally and that production matches the projections. Any adjustments are made.',
  },
]

export function InstallationProcessView({ data }: { data: Record<string, unknown> }) {
  const product = (data?.product as string) || 'Solar panels'

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
      <div>
        <h2
          style={{
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--type-heading-lg)',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            color: 'var(--color-black)',
            margin: '0 0 var(--space-3) 0',
          }}
        >
          From quote to completed installation
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--type-body-md)',
            color: 'var(--color-gray-700)',
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          Here is how the process works for {product.toLowerCase()}.
        </p>
      </div>

      {/* Vertical timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {timelineSteps.map((step, i) => (
          <div
            key={step.num}
            className="stagger-item"
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr auto',
              gap: 'var(--space-6)',
              borderLeft: '2px solid var(--color-gray-200)',
              paddingLeft: 'var(--space-6)',
              paddingBottom: i < timelineSteps.length - 1 ? 'var(--space-8)' : 0,
              position: 'relative' as const,
            }}
          >
            {/* Step indicator dot */}
            <div
              style={{
                position: 'absolute' as const,
                left: '-5px',
                top: '4px',
                width: '8px',
                height: '8px',
                background: 'var(--color-gray-300)',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', flex: 1 }}>
              <span
                style={{
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--type-display-sm)',
                  fontWeight: 700,
                  color: 'var(--color-gray-400)',
                  lineHeight: 1,
                }}
              >
                {step.num}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--type-heading-sm)',
                  fontWeight: 700,
                  color: 'var(--color-black)',
                  marginTop: 'var(--space-1)',
                }}
              >
                {step.title}
              </span>
              <p
                style={{
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--type-body-sm)',
                  fontWeight: 400,
                  color: 'var(--color-gray-700)',
                  lineHeight: 1.5,
                  margin: 'var(--space-2) 0 0 0',
                  maxWidth: '50ch',
                }}
              >
                {step.description}
              </p>
            </div>
            <span
              style={{
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--type-body-sm)',
                fontWeight: 500,
                color: 'var(--color-gray-500)',
                whiteSpace: 'nowrap' as const,
              }}
            >
              {step.time}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom section */}
      <div
        style={{
          borderLeft: '2px solid var(--color-gray-200)',
          paddingLeft: 'var(--space-6)',
        }}
      >
        <h3
          style={{
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--type-heading-sm)',
            fontWeight: 700,
            color: 'var(--color-black)',
            margin: '0 0 var(--space-3) 0',
          }}
        >
          What happens if something goes wrong?
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {[
            'All installations are fully insured throughout the entire process.',
            '25-year product warranty on panels, 12 years on inverter.',
            'Free support and troubleshooting via the app or phone.',
            'If production falls below the projection, we investigate the cause at no cost.',
          ].map((text) => (
            <p
              key={text}
              style={{
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--type-body-sm)',
                fontWeight: 400,
                color: 'var(--color-gray-700)',
                lineHeight: 1.5,
                margin: 0,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-3)',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" style={{ marginTop: '4px', flexShrink: 0 }}>
                <path d="M2 6L5 9L10 3" stroke="var(--color-gray-500)" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />
              </svg>
              {text}
            </p>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          section > div > div[style*="grid-template-columns: auto"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
