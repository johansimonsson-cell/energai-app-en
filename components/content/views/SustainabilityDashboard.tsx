'use client'

export function SustainabilityDashboard({ data: _data }: { data: Record<string, unknown> }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', gap: 'var(--space-12)' }}>
      {/* CO2 hero */}
      <div>
        <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'clamp(56px, 10vw, var(--type-display-xl))', fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.02em', color: 'var(--color-accent)', display: 'block' }}>
          126 kg
        </span>
        <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-md)', fontWeight: 700, color: 'var(--color-white)', display: 'block', marginTop: 'var(--space-3)' }}>
          CO2 saved this year
        </span>
        <p style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-md)', color: 'rgba(255,255,255,0.7)', margin: 'var(--space-2) 0 0', maxWidth: '45ch' }}>
          Compared to the Nordic electricity mix. Thanks to your green electricity plan, you are contributing to a sustainable future.
        </p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
        {[
          { value: '100%', label: 'Renewable electricity', sublabel: 'Swedish wind and hydropower' },
          { value: '4 200 kWh', label: 'Green consumption', sublabel: 'Last 12 months' },
          { value: 'RECS', label: 'Certification', sublabel: 'Guarantees of origin (EECS)' },
        ].map((stat, i) => (
          <div key={stat.label} className="stagger-item" style={{
            borderLeft: i === 0 ? 'none' : '2px solid var(--color-gray-700)',
            paddingLeft: i === 0 ? 0 : 'var(--space-6)',
            paddingRight: 'var(--space-6)',
          }}>
            <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-lg)', fontWeight: 700, color: 'var(--color-white)', display: 'block' }}>{stat.value}</span>
            <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-label-lg)', color: 'var(--color-gray-400)', display: 'block', marginTop: 'var(--space-1)' }}>{stat.label}</span>
            <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-label-md)', color: 'var(--color-gray-600)' }}>{stat.sublabel}</span>
          </div>
        ))}
      </div>

      {/* Comparison */}
      <div style={{ borderLeft: '2px solid var(--color-gray-700)', paddingLeft: 'var(--space-6)' }}>
        <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-sm)', fontWeight: 700, color: 'var(--color-white)', margin: '0 0 var(--space-3) 0' }}>
          Comparison with Nordic electricity mix
        </h3>
        <div style={{ display: 'flex', gap: 'var(--space-8)', alignItems: 'flex-end' }}>
          <div>
            <div style={{ width: '60px', height: '120px', background: 'var(--color-gray-700)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 'var(--space-2)' }}>
              <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-label-md)', color: 'var(--color-gray-400)' }}>47g</span>
            </div>
            <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-label-md)', color: 'var(--color-gray-500)', display: 'block', marginTop: 'var(--space-2)', textAlign: 'center' }}>Nordic mix</span>
          </div>
          <div>
            <div style={{ width: '60px', height: '12px', background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            </div>
            <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-label-md)', color: 'var(--color-accent)', display: 'block', marginTop: 'var(--space-2)', textAlign: 'center' }}>0g</span>
            <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-label-md)', color: 'var(--color-gray-500)', display: 'block', textAlign: 'center' }}>Your electricity</span>
          </div>
          <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-label-md)', color: 'var(--color-gray-500)' }}>g CO2/kWh</span>
        </div>
      </div>
    </section>
  )
}
