'use client'

export function OutageInfoView({ data: _data }: { data: Record<string, unknown> }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', margin: 'calc(-1 * var(--space-10))' }}>
      {/* Dark hero */}
      <div style={{ background: 'var(--color-black)', padding: 'var(--space-16) var(--space-10) var(--space-12)' }}>
        <h2 style={{ fontFamily: 'var(--font-primary)', fontSize: 'clamp(28px, 4vw, var(--type-display-md))', fontWeight: 700, color: 'var(--color-white)', margin: '0 0 var(--space-4) 0', letterSpacing: '-0.01em' }}>
          Power outages are handled by the grid operator
        </h2>
        <p style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-lg)', color: 'rgba(255,255,255,0.7)', margin: 0, maxWidth: '55ch' }}>
          We are your electricity retailer — the grid operator is responsible for delivering electricity to your home. During a power outage, contact them directly.
        </p>
      </div>

      {/* Light content */}
      <div style={{ background: 'var(--color-gray-25)', padding: 'var(--space-10)', display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
        {/* Grid operators */}
        <div>
          <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-sm)', fontWeight: 700, margin: '0 0 var(--space-6) 0' }}>
            Contact your grid operator
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
            {[
              { name: 'Vattenfall Eldistribution', phone: '08-739 52 00', areas: 'Stockholm, Norrbotten and more' },
              { name: 'E.ON Energidistribution', phone: '020-22 22 22', areas: 'Skåne, Halland and more' },
              { name: 'Ellevio', phone: '020-00 10 00', areas: 'Stockholm, Dalarna and more' },
            ].map((op, i) => (
              <div key={op.name} style={{ borderLeft: i === 0 ? 'none' : '2px solid var(--color-gray-200)', paddingLeft: i === 0 ? 0 : 'var(--space-6)', paddingRight: 'var(--space-6)' }}>
                <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', fontWeight: 700, display: 'block', marginBottom: 'var(--space-1)' }}>{op.name}</span>
                <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-sm)', fontWeight: 700, display: 'block', marginBottom: 'var(--space-1)' }}>{op.phone}</span>
                <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-label-md)', color: 'var(--color-gray-500)' }}>{op.areas}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Compensation rules */}
        <div style={{ borderLeft: '2px solid var(--color-accent)', paddingLeft: 'var(--space-6)' }}>
          <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-sm)', fontWeight: 700, margin: '0 0 var(--space-2) 0' }}>
            Compensation rules
          </h3>
          <p style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-700)', lineHeight: 1.5, margin: 0 }}>
            For power outages lasting more than 12 hours, you are entitled to statutory compensation from the grid operator. The compensation depends on the outage duration: 12-24h = 12.5% of annual grid fee, 24-48h = 25%, and so on. Contact your grid operator to apply.
          </p>
        </div>

        {/* CTA */}
        <button style={{ background: 'var(--color-black)', color: 'var(--color-white)', padding: '14px 28px', border: 'none', fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', fontWeight: 500, cursor: 'pointer', alignSelf: 'flex-start', minHeight: '44px' }}>
          Register a case with us
        </button>
      </div>

      <style>{`
        @media (max-width: 767px) {
          section > div > div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; gap: var(--space-6) !important; }
          section > div > div[style*="grid-template-columns"] > div { border-left: 2px solid var(--color-gray-200) !important; padding-left: var(--space-6) !important; }
        }
      `}</style>
    </section>
  )
}
