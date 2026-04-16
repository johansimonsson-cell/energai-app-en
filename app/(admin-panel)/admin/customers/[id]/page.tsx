'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface CRMNote {
  id: string
  type: string
  content: string
  createdBy: string
  createdAt: string
}

interface Agreement {
  id: string
  planType: string
  monthlyPrice: number
  status: string
  address: string
  meterNumber: string
  startDate: string
}

interface CustomerData {
  id: string
  email: string
  name: string | null
  phone: string | null
  createdAt: string
  agreements: Agreement[]
  crmNotes: CRMNote[]
  chatSessions: { id: string; createdAt: string; messages: { content: string }[] }[]
}

const noteTypeLabels: Record<string, string> = {
  CALL: 'Call',
  CHAT: 'Chat',
  NOTE: 'Note',
  UPSELL_ATTEMPT: 'Upsell',
  SUPPORT: 'Support',
}

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [customer, setCustomer] = useState<CustomerData | null>(null)
  const [noteContent, setNoteContent] = useState('')
  const [noteType, setNoteType] = useState('NOTE')
  const [adding, setAdding] = useState(false)

  const fetchCustomer = () => {
    fetch(`/api/admin/customers/${id}`)
      .then((r) => r.json())
      .then(setCustomer)
      .catch(console.error)
  }

  useEffect(() => {
    fetchCustomer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!noteContent.trim()) return
    setAdding(true)
    try {
      await fetch('/api/crm/note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: id, type: noteType, content: noteContent, createdBy: 'admin' }),
      })
      setNoteContent('')
      fetchCustomer()
    } catch (error) {
      console.error('Add note error:', error)
    } finally {
      setAdding(false)
    }
  }

  if (!customer) {
    return <p style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-500)' }}>Loading...</p>
  }

  const agreement = customer.agreements[0]

  return (
    <div style={{ maxWidth: '800px' }}>
      <Link
        href="/admin/customers"
        style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-label-lg)', color: 'var(--color-gray-600)', textDecoration: 'none', display: 'inline-block', marginBottom: 'var(--space-6)' }}
      >
        &larr; Back to customers
      </Link>

      <h1
        style={{
          fontFamily: 'var(--font-primary)',
          fontSize: 'var(--type-display-sm)',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          color: 'var(--color-black)',
          margin: '0 0 var(--space-8) 0',
        }}
      >
        {customer.name || customer.email}
      </h1>

      {/* Info cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', marginBottom: 'var(--space-10)' }}>
        {[
          { label: 'Email', value: customer.email },
          { label: 'Phone', value: customer.phone || '—' },
          { label: 'Customer since', value: new Date(customer.createdAt).toLocaleDateString('sv-SE') },
          { label: 'Chat sessions', value: String(customer.chatSessions.length) },
        ].map((item) => (
          <div key={item.label} style={{ background: 'var(--color-white)', border: '1px solid var(--color-gray-100)', padding: 'var(--space-6)' }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-primary)', fontSize: 'var(--type-label-lg)', fontWeight: 400, color: 'var(--color-gray-600)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-1)' }}>
              {item.label}
            </span>
            <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-md)', fontWeight: 500, color: 'var(--color-black)' }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Agreement */}
      {agreement && (
        <div style={{ marginBottom: 'var(--space-10)' }}>
          <h2 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-md)', fontWeight: 700, color: 'var(--color-black)', margin: '0 0 var(--space-6) 0' }}>
            Contract
          </h2>
          <div style={{ background: 'var(--color-white)', border: '1px solid var(--color-gray-100)', padding: 'var(--space-6)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
            {[
              { label: 'Plan', value: agreement.planType },
              { label: 'Price', value: `${agreement.monthlyPrice} kr/mo` },
              { label: 'Status', value: agreement.status, accent: agreement.status === 'ACTIVE' },
              { label: 'Address', value: agreement.address },
              { label: 'Meter no.', value: agreement.meterNumber },
              { label: 'Start date', value: new Date(agreement.startDate).toLocaleDateString('sv-SE') },
            ].map((item) => (
              <div key={item.label}>
                <span style={{ display: 'block', fontFamily: 'var(--font-primary)', fontSize: 'var(--type-label-md)', fontWeight: 400, color: 'var(--color-gray-500)', marginBottom: '2px' }}>
                  {item.label}
                </span>
                <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', fontWeight: 'accent' in item && item.accent ? 600 : 500, color: 'accent' in item && item.accent ? 'var(--color-success)' : 'var(--color-black)' }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CRM History */}
      <div style={{ marginBottom: 'var(--space-10)' }}>
        <h2 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-md)', fontWeight: 700, color: 'var(--color-black)', margin: '0 0 var(--space-6) 0' }}>
          CRM history
        </h2>

        <form
          onSubmit={handleAddNote}
          style={{
            background: 'var(--color-white)',
            border: '1px solid var(--color-gray-100)',
            padding: 'var(--space-6)',
            marginBottom: 'var(--space-4)',
            display: 'flex',
            gap: 'var(--space-4)',
            alignItems: 'flex-end',
          }}
        >
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontFamily: 'var(--font-primary)', fontSize: 'var(--type-label-lg)', fontWeight: 500, color: 'var(--color-gray-700)', marginBottom: 'var(--space-2)' }}>
              New note
            </label>
            <input
              type="text"
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Write a note..."
              style={{ width: '100%', padding: 'var(--space-3) 0', border: 'none', borderBottom: '1.5px solid var(--color-gray-300)', background: 'transparent', fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-black)', outline: 'none' }}
            />
          </div>
          <select
            value={noteType}
            onChange={(e) => setNoteType(e.target.value)}
            style={{ padding: 'var(--space-3)', border: '1.5px solid var(--color-gray-200)', background: 'var(--color-white)', fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-black)', outline: 'none', appearance: 'none' }}
          >
            {Object.entries(noteTypeLabels).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <button
            type="submit"
            disabled={adding}
            style={{ background: 'var(--color-black)', color: 'var(--color-white)', border: 'none', padding: '10px 20px', fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', fontWeight: 500, cursor: adding ? 'wait' : 'pointer', minHeight: '40px', whiteSpace: 'nowrap' }}
          >
            Add
          </button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {customer.crmNotes.length === 0 ? (
            <p style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-500)', padding: 'var(--space-6)' }}>
              No notes yet.
            </p>
          ) : (
            customer.crmNotes.map((note) => (
              <div
                key={note.id}
                style={{ background: 'var(--color-white)', borderBottom: '1px solid var(--color-gray-50)', padding: 'var(--space-4) var(--space-6)' }}
              >
                <div style={{ borderLeft: '2px solid var(--color-gray-200)', paddingLeft: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center', marginBottom: 'var(--space-1)' }}>
                    <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-label-md)', fontWeight: 600, color: 'var(--color-gray-700)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {noteTypeLabels[note.type] || note.type}
                    </span>
                    <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-label-md)', color: 'var(--color-gray-400)' }}>
                      {new Date(note.createdAt).toLocaleString('sv-SE')}
                    </span>
                    <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-label-md)', color: 'var(--color-gray-400)' }}>
                      by {note.createdBy}
                    </span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-black)', margin: 0 }}>
                    {note.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
