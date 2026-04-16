'use client'

const columns = [
  {
    title: 'Grid operator',
    description: 'Owns the power lines and delivers electricity to your home. Responsible for outages, meters, and grid fees.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M4 28H28M8 28V12L16 4L24 12V28" stroke="currentColor" strokeWidth="1.5" />
        <path d="M13 28V20H19V28" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    details: ['You do NOT choose your grid operator — it is determined by where you live', 'The grid fee is listed separately on your invoice', 'Contact them during power outages'],
  },
  {
    title: 'Electricity retailer',
    description: 'That is us — Energai. We buy and sell the electricity you consume. You are free to choose any electricity retailer.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M18 4L8 18H16L14 28L24 14H16L18 4Z" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    details: ['You can switch retailer at any time', 'Fixed, variable, or green — you choose the plan type', 'We charge per kWh you consume'],
  },
  {
    title: 'Your meter',
    description: 'Records your consumption hour by hour. The meter number is needed to sign a contract.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect x="6" y="6" width="20" height="20" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 16H22M16 10V22" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    details: ['Meter number: 18 digits, starts with SE-735999', 'Found on your electricity meter or your latest invoice', 'The grid operator can also provide the number'],
  },
]

const faq = [
  { q: 'What is a kilowatt-hour (kWh)?', a: 'The unit we measure electricity consumption in. A washing machine uses about 1 kWh per wash. A house typically consumes 15,000-25,000 kWh/year.' },
  { q: 'Why do I have two charges on my invoice?', a: 'Grid fee (to the grid operator) + electricity cost (to Energai). Two different companies, two different services.' },
  { q: 'What is the difference between fixed and variable?', a: 'Fixed price = same öre/kWh for the entire contract period. Variable = follows the market price hour by hour.' },
  { q: 'What happens when switching electricity retailer?', a: 'Electricity is delivered without interruption. The switch takes 2-3 weeks. You do not need to do anything with the grid operator.' },
]

export function EnergyEducationView({ data: _data }: { data: Record<string, unknown> }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
      <h2
        style={{
          fontFamily: 'var(--font-primary)',
          fontSize: 'var(--type-display-sm)',
          fontWeight: 700,
          color: 'var(--color-black)',
          letterSpacing: '-0.01em',
          margin: 0,
        }}
      >
        How electricity works in Sweden
      </h2>

      {/* Three columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
        {columns.map((col, i) => (
          <div
            key={col.title}
            className="stagger-item"
            style={{
              borderLeft: i === 0 ? 'none' : '2px solid var(--color-gray-200)',
              paddingLeft: i === 0 ? 0 : 'var(--space-6)',
              paddingRight: 'var(--space-6)',
            }}
          >
            <div style={{ color: 'var(--color-black)', marginBottom: 'var(--space-4)' }}>{col.icon}</div>
            <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-md)', fontWeight: 700, margin: '0 0 var(--space-3) 0' }}>
              {col.title}
            </h3>
            <p style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-700)', lineHeight: 1.5, margin: '0 0 var(--space-4) 0' }}>
              {col.description}
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {col.details.map((d) => (
                <li key={d} style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-600)', display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--color-gray-400)', flexShrink: 0 }}>—</span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div>
        <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-sm)', fontWeight: 700, margin: '0 0 var(--space-6) 0' }}>
          Frequently asked questions
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-6)' }}>
          {faq.map((item, i) => (
            <div
              key={i}
              style={{
                borderLeft: '2px solid var(--color-gray-200)',
                paddingLeft: 'var(--space-6)',
              }}
            >
              <h4 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-sm)', fontWeight: 700, margin: '0 0 var(--space-2) 0' }}>
                {item.q}
              </h4>
              <p style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-700)', lineHeight: 1.5, margin: 0 }}>
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          section > div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: 1fr !important;
            gap: var(--space-8) !important;
          }
          section > div[style*="grid-template-columns: repeat(3"] > div {
            border-left: 2px solid var(--color-gray-200) !important;
            padding-left: var(--space-6) !important;
          }
          section > div[style*="grid-template-columns: repeat(2"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
