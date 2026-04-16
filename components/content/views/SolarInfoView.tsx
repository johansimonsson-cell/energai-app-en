'use client'

const sections = [
  {
    title: 'How do solar panels work?',
    content: 'Solar panels convert sunlight into electricity. The panels are mounted on your roof and produce electricity during the day. The surplus is sold back to the grid via net metering — you get paid for the electricity you don\'t use.',
  },
  {
    title: 'Are solar panels right for my house?',
    content: 'Best conditions: south- or southwest-facing roof, 20-40° tilt, minimal shading. But even roofs with east/west orientation provide good production. We analyse your roof for free — enter your address or upload a photo in the chat.',
  },
]

const subsidies = [
  { title: 'Green deduction', value: '20%', description: 'Of material and installation cost for solar panels. Max 50,000 kr per person. Deducted directly on the invoice.' },
  { title: 'ROT deduction', value: '30%', description: 'Of the labour cost. Max 50,000 kr per person per year. Can be combined with the green deduction.' },
  { title: 'Net metering', value: '60 öre/kWh', description: 'Tax reduction for surplus electricity you feed into the grid. Applies up to 30,000 kWh per year.' },
]

const faq = [
  { q: 'How long does the installation take?', a: 'Typically 2–5 working days depending on system size. We plan everything — you just need to be home during the installation.' },
  { q: 'What happens in winter?', a: 'Production decreases but doesn\'t disappear. On average, solar panels produce 70–80% of annual output during March–October. In winter, you buy electricity as usual through your electricity contract.' },
  { q: 'Do I need a building permit?', a: 'In most cases, no building permit is needed if the panels follow the shape and angle of the roof. We check this for you.' },
  { q: 'How long do solar panels last?', a: 'The panels come with a 25-year warranty and an expected lifespan of 30–40 years. The inverter is typically replaced after 10–15 years.' },
]

export function SolarInfoView({ data: _data }: { data: Record<string, unknown> }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
      <h2 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-display-sm)', fontWeight: 700, color: 'var(--color-black)', letterSpacing: '-0.01em', margin: 0 }}>
        Solar Panels
      </h2>

      {/* Intro sections */}
      {sections.map(s => (
        <div key={s.title}>
          <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-md)', fontWeight: 700, margin: '0 0 var(--space-3) 0' }}>{s.title}</h3>
          <p style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-md)', color: 'var(--color-gray-700)', lineHeight: 1.5, margin: 0, maxWidth: '65ch' }}>{s.content}</p>
        </div>
      ))}

      {/* Subsidies */}
      <div>
        <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-md)', fontWeight: 700, margin: '0 0 var(--space-6) 0' }}>Government subsidies and deductions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
          {subsidies.map((sub, i) => (
            <div key={sub.title} className="stagger-item" style={{
              borderLeft: i === 0 ? 'none' : '2px solid var(--color-gray-200)',
              paddingLeft: i === 0 ? 0 : 'var(--space-6)', paddingRight: 'var(--space-6)',
            }}>
              <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-lg)', fontWeight: 700, color: 'var(--color-accent)', display: 'block' }}>{sub.value}</span>
              <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', fontWeight: 700, display: 'block', marginTop: 'var(--space-1)' }}>{sub.title}</span>
              <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-700)', lineHeight: 1.5, display: 'block', marginTop: 'var(--space-2)' }}>{sub.description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-md)', fontWeight: 700, margin: '0 0 var(--space-6) 0' }}>Frequently asked questions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-6)' }}>
          {faq.map(item => (
            <div key={item.q} style={{ borderLeft: '2px solid var(--color-gray-200)', paddingLeft: 'var(--space-6)' }}>
              <h4 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', fontWeight: 700, margin: '0 0 var(--space-1) 0' }}>{item.q}</h4>
              <p style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-700)', lineHeight: 1.5, margin: 0 }}>{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      <p style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-500)', margin: 0 }}>
        Write in the chat to get a free quote based on your home.
      </p>

      <style>{`
        @media (max-width: 767px) {
          section > div > div[style*="grid-template-columns: repeat(3"] { grid-template-columns: 1fr !important; gap: var(--space-6) !important; }
          section > div > div[style*="grid-template-columns: repeat(3"] > div { border-left: 2px solid var(--color-gray-200) !important; padding-left: var(--space-6) !important; }
          section > div > div[style*="grid-template-columns: repeat(2"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
