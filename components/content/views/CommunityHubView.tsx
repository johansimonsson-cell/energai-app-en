'use client'

import { useState } from 'react'

export function CommunityHubView({ data: _data }: { data: Record<string, unknown> }) {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-12)' }}>
      <div>
        <h2 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-display-sm)', fontWeight: 700, color: 'var(--color-black)', letterSpacing: '-0.01em', margin: '0 0 var(--space-3) 0' }}>
          Energai Community
        </h2>
        <p style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-lg)', color: 'var(--color-gray-700)', lineHeight: 1.5, margin: 0, maxWidth: '55ch' }}>
          Join a network of energy-conscious households. Share experiences, learn more and shape the future of energy.
        </p>
      </div>

      {/* Three columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
        {[
          {
            num: '01', title: 'Newsletter',
            desc: 'Monthly insights on the energy market, tips to save, and exclusive offers.',
            items: ['Market prices and trends', 'Energy saving tips', 'Product news', 'Customer stories'],
          },
          {
            num: '02', title: 'Events',
            desc: 'Webinars and workshops on solar panels, energy savings and sustainability.',
            items: ['Solar 101 — April 15', 'Energy saving at home — April 22', 'The future of the grid — May 6'],
          },
          {
            num: '03', title: 'Ambassador programme',
            desc: 'Refer friends and family. You both get 500 kr off your next invoice.',
            items: ['500 kr per referral', 'No limit on number', 'Automatic discount', 'Exclusive ambassador events'],
          },
        ].map((col, i) => (
          <div key={col.title} className="stagger-item" style={{
            borderLeft: i === 0 ? 'none' : '2px solid var(--color-gray-200)',
            paddingLeft: i === 0 ? 0 : 'var(--space-6)', paddingRight: 'var(--space-6)',
          }}>
            <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'clamp(48px, 6vw, 80px)', fontWeight: 700, lineHeight: 0.85, letterSpacing: '-0.03em', color: 'var(--color-gray-200)', display: 'block', marginBottom: 'var(--space-3)', fontVariantNumeric: 'tabular-nums' }}>
              {col.num}
            </span>
            <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-md)', fontWeight: 700, margin: '0 0 var(--space-2) 0' }}>{col.title}</h3>
            <p style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-700)', lineHeight: 1.5, margin: '0 0 var(--space-4) 0' }}>{col.desc}</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {col.items.map(item => (
                <li key={item} style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-600)', display: 'flex', gap: 'var(--space-2)' }}>
                  <span style={{ color: 'var(--color-gray-400)', flexShrink: 0 }}>—</span>{item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Newsletter signup */}
      <div style={{ borderTop: '1px solid var(--color-gray-100)', paddingTop: 'var(--space-8)' }}>
        <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-sm)', fontWeight: 700, margin: '0 0 var(--space-4) 0' }}>
          Subscribe to the newsletter
        </h3>
        {subscribed ? (
          <div style={{ borderLeft: '2px solid var(--color-accent)', paddingLeft: 'var(--space-6)' }}>
            <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', fontWeight: 700 }}>Thank you!</span>
            <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-600)', display: 'block' }}>You will receive your first newsletter shortly.</span>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 'var(--space-3)', maxWidth: '480px' }}>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" aria-label="Email for newsletter"
              style={{ flex: 1, padding: 'var(--space-3) 0', border: 'none', borderBottom: '1.5px solid var(--color-gray-300)', background: 'transparent', fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-md)', outline: 'none' }}
              onFocus={e => { e.currentTarget.style.borderBottomColor = 'var(--color-black)' }}
              onBlur={e => { e.currentTarget.style.borderBottomColor = 'var(--color-gray-300)' }}
            />
            <button onClick={() => { if (email.includes('@')) setSubscribed(true) }}
              style={{ background: 'var(--color-black)', color: 'var(--color-white)', padding: '12px 24px', border: 'none', fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', fontWeight: 500, cursor: 'pointer', minHeight: '44px', whiteSpace: 'nowrap' }}>
              Subscribe
            </button>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 767px) {
          section > div[style*="grid-template-columns: repeat(3"] { grid-template-columns: 1fr !important; gap: var(--space-8) !important; }
          section > div[style*="grid-template-columns: repeat(3"] > div { border-left: 2px solid var(--color-gray-200) !important; padding-left: var(--space-6) !important; }
        }
      `}</style>
    </section>
  )
}
