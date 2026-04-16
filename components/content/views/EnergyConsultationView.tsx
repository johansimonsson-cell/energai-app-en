'use client'

import { useState } from 'react'

const timeSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00']

export function EnergyConsultationView({ data: _data }: { data: Record<string, unknown> }) {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [booked, setBooked] = useState(false)

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
      <h2 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-lg)', fontWeight: 700, color: 'var(--color-black)', margin: 0 }}>
        Energy consultation
      </h2>
      <p style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-md)', color: 'var(--color-gray-700)', margin: 0, maxWidth: '50ch' }}>
        Book a free consultation with one of our energy experts. We review your home and provide concrete tips to reduce your electricity costs.
      </p>

      {/* Three columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
        {[
          { title: 'What we check', items: ['Consumption patterns', 'Insulation and ventilation', 'Heating system', 'Solar panel potential'] },
          { title: 'What it costs', items: ['Completely free', 'No commitment', '30 minutes via video', 'Or home visit (limited)'] },
          { title: 'What you get', items: ['Personal energy report', 'Savings suggestions with numbers', 'Product recommendations', 'ROI calculation'] },
        ].map((col, i) => (
          <div key={col.title} style={{ borderLeft: i === 0 ? 'none' : '2px solid var(--color-gray-200)', paddingLeft: i === 0 ? 0 : 'var(--space-6)', paddingRight: 'var(--space-6)' }}>
            <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-sm)', fontWeight: 700, margin: '0 0 var(--space-4) 0' }}>{col.title}</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {col.items.map(item => (
                <li key={item} style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-700)', display: 'flex', gap: 'var(--space-2)' }}>
                  <span style={{ color: 'var(--color-gray-400)', flexShrink: 0 }}>—</span>{item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Booking form */}
      {booked ? (
        <div style={{ borderLeft: '2px solid var(--color-accent)', paddingLeft: 'var(--space-6)' }}>
          <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-md)', fontWeight: 700, display: 'block' }}>Booked!</span>
          <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-600)' }}>{selectedDate} at {selectedTime}. We will send a confirmation via email.</span>
        </div>
      ) : (
        <div style={{ maxWidth: '400px' }}>
          <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-sm)', fontWeight: 700, margin: '0 0 var(--space-6) 0' }}>Book a time</h3>
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-primary)', fontSize: 'var(--type-label-lg)', fontWeight: 500, color: 'var(--color-gray-700)', marginBottom: 'var(--space-2)' }}>Date</label>
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
              style={{ width: '100%', padding: 'var(--space-3) 0', border: 'none', borderBottom: '1.5px solid var(--color-gray-300)', background: 'transparent', fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-md)', outline: 'none' }} />
          </div>
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-primary)', fontSize: 'var(--type-label-lg)', fontWeight: 500, color: 'var(--color-gray-700)', marginBottom: 'var(--space-2)' }}>Time</label>
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              {timeSlots.map(t => (
                <button key={t} onClick={() => setSelectedTime(t)} style={{
                  background: 'transparent', border: `1.5px solid ${selectedTime === t ? 'var(--color-black)' : 'var(--color-gray-200)'}`,
                  padding: 'var(--space-2) var(--space-4)', fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)',
                  fontWeight: selectedTime === t ? 700 : 400, cursor: 'pointer', minHeight: '44px',
                }}>{t}</button>
              ))}
            </div>
          </div>
          <button onClick={() => { if (selectedDate && selectedTime) setBooked(true) }}
            disabled={!selectedDate || !selectedTime}
            style={{ background: 'var(--color-black)', color: 'var(--color-white)', padding: '14px 28px', border: 'none', fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', fontWeight: 500, cursor: selectedDate && selectedTime ? 'pointer' : 'default', opacity: selectedDate && selectedTime ? 1 : 0.4, minHeight: '44px' }}>
            Book consultation
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 767px) {
          section > div[style*="grid-template-columns: repeat(3"] { grid-template-columns: 1fr !important; gap: var(--space-8) !important; }
          section > div[style*="grid-template-columns: repeat(3"] > div { border-left: 2px solid var(--color-gray-200) !important; padding-left: var(--space-6) !important; }
        }
      `}</style>
    </section>
  )
}
