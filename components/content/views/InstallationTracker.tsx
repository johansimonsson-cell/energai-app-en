'use client'

const milestones = [
  { title: 'Order received', date: 'March 1, 2026', status: 'completed' as const, comment: 'Order confirmed via AI chat.' },
  { title: 'Installer assigned', date: 'March 5, 2026', status: 'completed' as const, comment: 'SolTech Partner AB, contact person: Johan Lindqvist.' },
  { title: 'Materials ordered', date: 'March 10, 2026', status: 'completed' as const, comment: '25 monocrystalline panels + Huawei inverter ordered.' },
  { title: 'Installation scheduled', date: 'May 15, 2026', status: 'active' as const, comment: 'Installation estimated to take 2-3 working days.' },
  { title: 'Installation completed', date: '—', status: 'future' as const, comment: 'The installer tests and documents the system.' },
  { title: 'Commissioned', date: '—', status: 'future' as const, comment: 'The system is running and producing electricity.' },
]

const faq = [
  { q: 'What happens during installation?', a: 'The installer mounts panels, runs cabling, and connects the inverter. You need to be home or provide access.' },
  { q: 'How long does it take?', a: 'Typically 2-3 working days for a 10 kW system. Weather may affect the schedule.' },
  { q: 'Do I need to prepare anything?', a: 'Make sure the roof is clear and the installer has access to the electrical panel. We will contact you beforehand.' },
]

export function InstallationTracker({ data: _data }: { data: Record<string, unknown> }) {
  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
      <h2 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-lg)', fontWeight: 700, color: 'var(--color-black)', margin: 0 }}>
        Installation status
      </h2>

      {/* Vertical timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {milestones.map((ms, i) => {
          const isLast = i === milestones.length - 1
          return (
            <div key={ms.title} className="stagger-item" style={{ display: 'flex', gap: 'var(--space-6)', minHeight: '80px' }}>
              {/* Timeline column */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '24px', flexShrink: 0 }}>
                {/* Dot */}
                <div style={{
                  width: '12px', height: '12px', flexShrink: 0,
                  background: ms.status === 'completed' ? 'var(--color-black)' : ms.status === 'active' ? 'var(--color-accent)' : 'transparent',
                  border: ms.status === 'future' ? '1.5px solid var(--color-gray-300)' : 'none',
                }} />
                {/* Line */}
                {!isLast && (
                  <div style={{
                    width: '1.5px', flex: 1, minHeight: '40px',
                    background: ms.status === 'completed' ? 'var(--color-black)' : 'var(--color-gray-200)',
                  }} />
                )}
              </div>

              {/* Content */}
              <div style={{ paddingBottom: 'var(--space-6)', flex: 1 }}>
                <span style={{
                  fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', fontWeight: 700, display: 'block',
                  color: ms.status === 'future' ? 'var(--color-gray-400)' : 'var(--color-black)',
                }}>
                  {ms.title}
                </span>
                <span style={{
                  fontFamily: 'var(--font-primary)', fontSize: 'var(--type-label-md)',
                  color: ms.status === 'active' ? 'var(--color-accent)' : 'var(--color-gray-500)',
                  display: 'block', marginTop: 'var(--space-1)',
                }}>
                  {ms.date}
                </span>
                <span style={{
                  fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)',
                  color: ms.status === 'future' ? 'var(--color-gray-400)' : 'var(--color-gray-700)',
                  lineHeight: 1.5, display: 'block', marginTop: 'var(--space-1)',
                }}>
                  {ms.comment}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Contact info */}
      <div style={{ borderLeft: '2px solid var(--color-gray-200)', paddingLeft: 'var(--space-6)' }}>
        <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-sm)', fontWeight: 700, margin: '0 0 var(--space-2) 0' }}>
          Installer
        </h3>
        <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-700)', display: 'block' }}>
          SolTech Partner AB
        </span>
        <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-700)', display: 'block' }}>
          Contact person: Johan Lindqvist
        </span>
        <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-sm)', fontWeight: 700, display: 'block', marginTop: 'var(--space-2)' }}>
          073-123 45 67
        </span>
      </div>

      {/* FAQ */}
      <div>
        <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-sm)', fontWeight: 700, margin: '0 0 var(--space-4) 0' }}>
          Frequently asked questions about installation
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {faq.map(item => (
            <div key={item.q} style={{ borderLeft: '2px solid var(--color-gray-200)', paddingLeft: 'var(--space-6)' }}>
              <h4 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', fontWeight: 700, margin: '0 0 var(--space-1) 0' }}>{item.q}</h4>
              <p style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-700)', lineHeight: 1.5, margin: 0 }}>{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
