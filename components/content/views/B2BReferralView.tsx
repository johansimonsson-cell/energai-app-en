'use client'

import { useState } from 'react'

export function B2BReferralView({ data: _data }: { data: Record<string, unknown> }) {
  const [companyName, setCompanyName] = useState('')
  const [contactName, setContactName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (companyName && contactName && email) setSubmitted(true)
  }

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
      <div>
        <h2 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-display-sm)', fontWeight: 700, color: 'var(--color-black)', letterSpacing: '-0.01em', margin: '0 0 var(--space-3) 0' }}>
          Business Solutions
        </h2>
        <p style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-lg)', color: 'var(--color-gray-700)', lineHeight: 1.5, margin: 0, maxWidth: '55ch' }}>
          Energai offers residential contracts via this chat. For business contracts, we have a dedicated B2B team that tailors solutions for your organisation.
        </p>
      </div>

      {/* What we offer for B2B */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
        {[
          { title: 'Business electricity contracts', desc: 'Tailored contracts with volume discounts, portfolio management and a dedicated contact person.' },
          { title: 'Solar installations', desc: 'Large-scale installations for offices, warehouses and industrial properties. PPA agreements available.' },
          { title: 'Charging infrastructure', desc: 'Charging stations for employees, visitors and fleet vehicles. Billing and load balancing included.' },
        ].map((item, i) => (
          <div key={item.title} className="stagger-item" style={{
            borderLeft: i === 0 ? 'none' : '2px solid var(--color-gray-200)',
            paddingLeft: i === 0 ? 0 : 'var(--space-6)', paddingRight: 'var(--space-6)',
          }}>
            <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-sm)', fontWeight: 700, margin: '0 0 var(--space-2) 0' }}>{item.title}</h3>
            <p style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-700)', lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Contact form */}
      {submitted ? (
        <div style={{ borderLeft: '2px solid var(--color-accent)', paddingLeft: 'var(--space-6)' }}>
          <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-md)', fontWeight: 700, display: 'block' }}>Thank you!</span>
          <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-600)' }}>Our B2B team will contact you within 1 business day.</span>
        </div>
      ) : (
        <div style={{ maxWidth: '480px' }}>
          <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-sm)', fontWeight: 700, margin: '0 0 var(--space-6) 0' }}>
            Contact the B2B team
          </h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {[
              { label: 'Company name', value: companyName, onChange: setCompanyName, required: true },
              { label: 'Contact person', value: contactName, onChange: setContactName, required: true },
              { label: 'Email', value: email, onChange: setEmail, required: true },
              { label: 'Phone', value: phone, onChange: setPhone, required: false },
            ].map(f => (
              <div key={f.label}>
                <label style={{ display: 'block', fontFamily: 'var(--font-primary)', fontSize: 'var(--type-label-lg)', fontWeight: 500, color: 'var(--color-gray-700)', marginBottom: 'var(--space-2)' }}>{f.label}</label>
                <input type="text" value={f.value} onChange={e => f.onChange(e.target.value)} required={f.required}
                  style={{ width: '100%', padding: 'var(--space-3) 0', border: 'none', borderBottom: '1.5px solid var(--color-gray-300)', background: 'transparent', fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-md)', outline: 'none' }}
                  onFocus={e => { e.currentTarget.style.borderBottomColor = 'var(--color-black)' }}
                  onBlur={e => { e.currentTarget.style.borderBottomColor = 'var(--color-gray-300)' }}
                />
              </div>
            ))}
            <button type="submit" style={{ background: 'var(--color-black)', color: 'var(--color-white)', padding: '14px 28px', border: 'none', fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', fontWeight: 500, cursor: 'pointer', alignSelf: 'flex-start', minHeight: '44px' }}>
              Send enquiry
            </button>
          </form>
        </div>
      )}

      <style>{`
        @media (max-width: 767px) {
          section > div[style*="grid-template-columns: repeat(3"] { grid-template-columns: 1fr !important; gap: var(--space-6) !important; }
          section > div[style*="grid-template-columns: repeat(3"] > div { border-left: 2px solid var(--color-gray-200) !important; padding-left: var(--space-6) !important; }
        }
      `}</style>
    </section>
  )
}
