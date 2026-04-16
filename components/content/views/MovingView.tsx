'use client'

import { useState } from 'react'

const steps = [
  { num: '01', title: 'Update address at Energai', description: 'Fill in your new address below. We will update your contract automatically.' },
  { num: '02', title: 'Notify the grid operator', description: 'Contact the grid operator for your new address. They need to know your move-in date.' },
  { num: '03', title: 'Meter reading at old address', description: 'Read the meter and report to your current grid operator on the last day.' },
  { num: '04', title: 'Confirm move', description: 'We will send a confirmation when everything is done. Your electricity plan follows you.' },
]

const priceAreas = [
  { area: 'SE1', region: 'Luleå', description: 'Lowest electricity price — close to hydropower' },
  { area: 'SE2', region: 'Sundsvall', description: 'Low electricity price — good access to hydropower' },
  { area: 'SE3', region: 'Stockholm', description: 'Mid-range price — largest population' },
  { area: 'SE4', region: 'Malmö', description: 'Highest electricity price — farthest from production' },
]

export function MovingView({ data: _data }: { data: Record<string, unknown> }) {
  const [address, setAddress] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [city, setCity] = useState('')
  const [moveDate, setMoveDate] = useState('')

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
      <h2 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-lg)', fontWeight: 700, color: 'var(--color-black)', margin: 0 }}>
        Move with your electricity plan
      </h2>

      {/* Checklist */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
        {steps.map((step, i) => (
          <div key={step.num} className="stagger-item" style={{
            borderLeft: i === 0 ? 'none' : '2px solid var(--color-gray-200)',
            paddingLeft: i === 0 ? 0 : 'var(--space-6)',
            paddingRight: 'var(--space-6)',
          }}>
            <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'clamp(48px, 6vw, 80px)', fontWeight: 700, lineHeight: 0.85, letterSpacing: '-0.03em', color: 'var(--color-gray-200)', display: 'block', marginBottom: 'var(--space-3)', fontVariantNumeric: 'tabular-nums' }}>
              {step.num}
            </span>
            <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-sm)', fontWeight: 700, margin: '0 0 var(--space-2) 0' }}>{step.title}</h3>
            <p style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-700)', lineHeight: 1.5, margin: 0 }}>{step.description}</p>
          </div>
        ))}
      </div>

      {/* Price area indicator */}
      <div>
        <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-sm)', fontWeight: 700, margin: '0 0 var(--space-4) 0' }}>
          Electricity price areas in Sweden
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
          {priceAreas.map((pa, i) => (
            <div key={pa.area} style={{
              borderLeft: i === 0 ? 'none' : '2px solid var(--color-gray-200)',
              paddingLeft: i === 0 ? 0 : 'var(--space-6)',
              paddingRight: 'var(--space-6)',
            }}>
              <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-md)', fontWeight: 700, display: 'block' }}>{pa.area}</span>
              <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-600)', display: 'block' }}>{pa.region}</span>
              <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-label-md)', color: 'var(--color-gray-500)' }}>{pa.description}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Address form */}
      <div style={{ maxWidth: '480px' }}>
        <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-sm)', fontWeight: 700, margin: '0 0 var(--space-6) 0' }}>New address</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {[
            { label: 'Street address', value: address, onChange: setAddress, placeholder: 'Storgatan 1' },
            { label: 'Postal code', value: postalCode, onChange: setPostalCode, placeholder: '111 22' },
            { label: 'City', value: city, onChange: setCity, placeholder: 'Stockholm' },
            { label: 'Move-in date', value: moveDate, onChange: setMoveDate, placeholder: 'YYYY-MM-DD' },
          ].map(f => (
            <div key={f.label}>
              <label style={{ display: 'block', fontFamily: 'var(--font-primary)', fontSize: 'var(--type-label-lg)', fontWeight: 500, color: 'var(--color-gray-700)', marginBottom: 'var(--space-2)' }}>{f.label}</label>
              <input type="text" value={f.value} onChange={e => f.onChange(e.target.value)} placeholder={f.placeholder}
                style={{ width: '100%', padding: 'var(--space-3) 0', border: 'none', borderBottom: '1.5px solid var(--color-gray-300)', background: 'transparent', fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-md)', outline: 'none' }}
                onFocus={e => { e.currentTarget.style.borderBottomColor = 'var(--color-black)' }}
                onBlur={e => { e.currentTarget.style.borderBottomColor = 'var(--color-gray-300)' }}
              />
            </div>
          ))}
          <button style={{ background: 'var(--color-black)', color: 'var(--color-white)', padding: '14px 28px', border: 'none', fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', fontWeight: 500, cursor: 'pointer', alignSelf: 'flex-start', minHeight: '44px' }}>
            Submit move
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          section > div[style*="grid-template-columns: repeat(4"] { grid-template-columns: repeat(2, 1fr) !important; gap: var(--space-6) 0 !important; }
        }
      `}</style>
    </section>
  )
}
