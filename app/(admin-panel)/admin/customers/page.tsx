'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface CustomerRow {
  id: string
  email: string
  name: string | null
  phone: string | null
  createdAt: string
  agreements: { planType: string; status: string }[]
  _count: { crmNotes: number; chatSessions: number }
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPlan, setFilterPlan] = useState('')

  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (filterStatus) params.set('status', filterStatus)
    if (filterPlan) params.set('planType', filterPlan)
    fetch(`/api/admin/customers?${params}`)
      .then((r) => r.json())
      .then(setCustomers)
      .catch(console.error)
  }, [search, filterStatus, filterPlan])

  const inputStyle = {
    padding: 'var(--space-3)',
    border: '1.5px solid var(--color-gray-200)',
    background: 'var(--color-white)',
    fontFamily: 'var(--font-primary)',
    fontSize: 'var(--type-body-sm)',
    color: 'var(--color-black)',
    outline: 'none',
  }

  return (
    <div style={{ maxWidth: '960px' }}>
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
        Customers
      </h1>

      <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...inputStyle, flex: 1, minWidth: '200px' }}
        />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ ...inputStyle, appearance: 'none', minWidth: '140px' }}>
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="PENDING">Pending</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <select value={filterPlan} onChange={(e) => setFilterPlan(e.target.value)} style={{ ...inputStyle, appearance: 'none', minWidth: '140px' }}>
          <option value="">All plans</option>
          <option value="FIXED">Fixed</option>
          <option value="VARIABLE">Variable</option>
          <option value="GREEN">Green</option>
        </select>
      </div>

      <div style={{ background: 'var(--color-white)', border: '1px solid var(--color-gray-100)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Customer', 'Email', 'Plan', 'Status', 'CRM', 'Chats'].map((h) => (
                <th
                  key={h}
                  style={{
                    fontFamily: 'var(--font-primary)',
                    fontSize: 'var(--type-label-lg)',
                    fontWeight: 400,
                    color: 'var(--color-gray-600)',
                    textAlign: 'left',
                    padding: 'var(--space-4)',
                    borderBottom: '1.5px solid var(--color-gray-100)',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: 'var(--space-8)', textAlign: 'center', fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-500)' }}>
                  No customers found
                </td>
              </tr>
            ) : (
              customers.map((c) => {
                const agreement = c.agreements[0]
                const cellStyle = {
                  padding: 'var(--space-4)',
                  borderBottom: '1px solid var(--color-gray-50)',
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--type-body-sm)',
                }
                return (
                  <tr key={c.id}>
                    <td style={cellStyle}>
                      <Link
                        href={`/admin/customers/${c.id}`}
                        style={{ fontWeight: 500, color: 'var(--color-black)', textDecoration: 'underline', textUnderlineOffset: '3px' }}
                      >
                        {c.name || '—'}
                      </Link>
                    </td>
                    <td style={{ ...cellStyle, color: 'var(--color-gray-700)' }}>{c.email}</td>
                    <td style={{ ...cellStyle, color: 'var(--color-gray-700)' }}>{agreement?.planType || '—'}</td>
                    <td style={{ ...cellStyle, fontWeight: agreement?.status === 'ACTIVE' ? 600 : 400, color: agreement?.status === 'ACTIVE' ? 'var(--color-success)' : 'var(--color-gray-500)' }}>
                      {agreement?.status || '—'}
                    </td>
                    <td style={{ ...cellStyle, color: 'var(--color-gray-600)' }}>{c._count.crmNotes}</td>
                    <td style={{ ...cellStyle, color: 'var(--color-gray-600)' }}>{c._count.chatSessions}</td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
