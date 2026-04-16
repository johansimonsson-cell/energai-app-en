'use client'

import { useEffect, useState, useCallback } from 'react'

interface Offer {
  id: string
  name: string
  description: string
  discountPercent: number
  validUntil: string
  targetSegment: string
  isActive: boolean
}

const segmentLabels: Record<string, string> = {
  ALL: 'All customers',
  NEW_CUSTOMER: 'New customers',
  FIXED: 'Fixed price',
  VARIABLE: 'Variable price',
  GREEN: 'Green energy',
}

const emptyOffer = { name: '', description: '', discountPercent: 10, validUntil: '', targetSegment: 'ALL' }

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [editing, setEditing] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(emptyOffer)
  const [saving, setSaving] = useState(false)

  const fetchOffers = useCallback(() => {
    fetch('/api/admin/offers').then((r) => r.json()).then(setOffers).catch(console.error)
  }, [])

  useEffect(() => { fetchOffers() }, [fetchOffers])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await fetch('/api/admin/offers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      setCreating(false)
      setForm(emptyOffer)
      fetchOffers()
    } finally { setSaving(false) }
  }

  const handleUpdate = async (id: string) => {
    setSaving(true)
    try {
      await fetch(`/api/admin/offers/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      setEditing(null)
      fetchOffers()
    } finally { setSaving(false) }
  }

  const handleToggle = async (offer: Offer) => {
    await fetch(`/api/admin/offers/${offer.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !offer.isActive }) })
    fetchOffers()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) return
    await fetch(`/api/admin/offers/${id}`, { method: 'DELETE' })
    fetchOffers()
  }

  const startEdit = (offer: Offer) => {
    setEditing(offer.id)
    setForm({ name: offer.name, description: offer.description, discountPercent: offer.discountPercent, validUntil: offer.validUntil.slice(0, 10), targetSegment: offer.targetSegment })
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: 'var(--space-3)',
    border: '1.5px solid var(--color-gray-200)',
    background: 'var(--color-white)',
    fontFamily: 'var(--font-primary)',
    fontSize: 'var(--type-body-sm)',
    color: 'var(--color-black)',
    outline: 'none',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-primary)',
    fontSize: 'var(--type-label-lg)',
    fontWeight: 500,
    color: 'var(--color-gray-700)',
    marginBottom: 'var(--space-2)',
  }

  const btnPrimary: React.CSSProperties = {
    background: 'var(--color-black)',
    color: 'var(--color-white)',
    border: 'none',
    padding: '10px 20px',
    fontFamily: 'var(--font-primary)',
    fontSize: 'var(--type-body-sm)',
    fontWeight: 500,
    cursor: 'pointer',
    minHeight: '40px',
  }

  const btnSecondary: React.CSSProperties = {
    background: 'transparent',
    color: 'var(--color-gray-600)',
    border: '1.5px solid var(--color-gray-200)',
    padding: '10px 20px',
    fontFamily: 'var(--font-primary)',
    fontSize: 'var(--type-body-sm)',
    fontWeight: 500,
    cursor: 'pointer',
    minHeight: '40px',
  }

  const renderForm = () => (
    <>
      <div>
        <label style={labelStyle}>Name</label>
        <input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Description</label>
        <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} required rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Discount (%)</label>
          <input type="number" min={1} max={100} value={form.discountPercent} onChange={(e) => setForm((p) => ({ ...p, discountPercent: Number(e.target.value) }))} required style={inputStyle} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Valid until</label>
          <input type="date" value={form.validUntil} onChange={(e) => setForm((p) => ({ ...p, validUntil: e.target.value }))} required style={inputStyle} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={labelStyle}>Target segment</label>
          <select value={form.targetSegment} onChange={(e) => setForm((p) => ({ ...p, targetSegment: e.target.value }))} style={{ ...inputStyle, appearance: 'none' }}>
            <option value="ALL">All customers</option>
            <option value="NEW_CUSTOMER">New customers</option>
            <option value="FIXED">Fixed price</option>
            <option value="VARIABLE">Variable price</option>
            <option value="GREEN">Green energy</option>
          </select>
        </div>
      </div>
    </>
  )

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-display-sm)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1, color: 'var(--color-black)', margin: 0 }}>
          Offers
        </h1>
        {!creating && (
          <button onClick={() => { setCreating(true); setForm(emptyOffer); setEditing(null) }} style={{ ...btnPrimary, padding: '12px 24px', minHeight: '44px' }}>
            New offer
          </button>
        )}
      </div>

      {creating && (
        <form onSubmit={handleCreate} style={{ background: 'var(--color-white)', border: '1px solid var(--color-gray-100)', padding: 'var(--space-8)', marginBottom: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          <h2 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-sm)', fontWeight: 700, color: 'var(--color-black)', margin: 0 }}>New offer</h2>
          {renderForm()}
          <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <button type="submit" disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.6 : 1 }}>{saving ? 'Creating...' : 'Create'}</button>
            <button type="button" onClick={() => setCreating(false)} style={btnSecondary}>Cancel</button>
          </div>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {offers.map((offer) => (
          <div key={offer.id} style={{ background: 'var(--color-white)', border: '1px solid var(--color-gray-100)', padding: 'var(--space-6)', opacity: offer.isActive ? 1 : 0.6 }}>
            {editing === offer.id ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                {renderForm()}
                <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                  <button onClick={() => handleUpdate(offer.id)} disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.6 : 1 }}>Save</button>
                  <button onClick={() => setEditing(null)} style={btnSecondary}>Cancel</button>
                </div>
              </div>
            ) : (
              <div>
                <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-sm)', fontWeight: 700, color: 'var(--color-black)', margin: '0 0 var(--space-1) 0' }}>
                  {offer.name}
                </h3>
                <p style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-600)', margin: '0 0 var(--space-4) 0' }}>
                  {offer.description}
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
                  {[
                    { label: 'Discount', value: `${offer.discountPercent}%` },
                    { label: 'Segment', value: segmentLabels[offer.targetSegment] || offer.targetSegment },
                    { label: 'Valid until', value: new Date(offer.validUntil).toLocaleDateString('sv-SE') },
                    { label: 'Status', value: offer.isActive ? 'Active' : 'Inactive' },
                  ].map((d) => (
                    <div key={d.label}>
                      <span style={{ display: 'block', fontFamily: 'var(--font-primary)', fontSize: 'var(--type-label-md)', color: 'var(--color-gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{d.label}</span>
                      <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', fontWeight: 500, color: 'var(--color-black)' }}>{d.value}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-6)', borderTop: '1px solid var(--color-gray-50)', paddingTop: 'var(--space-4)' }}>
                  {[
                    { label: 'Edit', onClick: () => startEdit(offer) },
                    { label: offer.isActive ? 'Deactivate' : 'Activate', onClick: () => handleToggle(offer) },
                    { label: 'Delete', onClick: () => handleDelete(offer.id), danger: true },
                  ].map((btn) => (
                    <button
                      key={btn.label}
                      onClick={btn.onClick}
                      style={{ background: 'none', border: 'none', fontFamily: 'var(--font-primary)', fontSize: 'var(--type-label-lg)', fontWeight: 400, color: 'danger' in btn && btn.danger ? 'var(--color-error)' : 'var(--color-gray-600)', cursor: 'pointer', padding: 0, textDecoration: 'underline', textUnderlineOffset: '3px' }}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        {offers.length === 0 && (
          <p style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-500)', textAlign: 'center', padding: 'var(--space-10)' }}>
            No offers yet.
          </p>
        )}
      </div>
    </div>
  )
}
