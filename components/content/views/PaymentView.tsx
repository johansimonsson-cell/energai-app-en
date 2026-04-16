'use client'

import { useState } from 'react'

const payments = [
  { id: 'B-2026-04', date: '2026-04-01', amount: '847 kr', method: 'Direct debit', status: 'Completed' as const },
  { id: 'B-2026-03', date: '2026-03-01', amount: '923 kr', method: 'Direct debit', status: 'Completed' as const },
  { id: 'B-2026-02', date: '2026-02-01', amount: '1 104 kr', method: 'Direct debit', status: 'Completed' as const },
  { id: 'B-2026-01', date: '2026-01-01', amount: '1 287 kr', method: 'Invoice', status: 'Missed' as const },
  { id: 'B-2025-12', date: '2025-12-01', amount: '891 kr', method: 'Direct debit', status: 'Completed' as const },
]

export function PaymentView({ data: _data }: { data: Record<string, unknown> }) {
  const [autogiroActive] = useState(true)

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
      <h2 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-lg)', fontWeight: 700, color: 'var(--color-black)', margin: 0 }}>
        Payment
      </h2>

      {/* Autogiro status */}
      <div style={{ borderLeft: `2px solid ${autogiroActive ? 'var(--color-success)' : 'var(--color-error)'}`, paddingLeft: 'var(--space-6)' }}>
        <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-md)', fontWeight: 700, display: 'block', color: autogiroActive ? 'var(--color-success)' : 'var(--color-error)' }}>
          Direct debit {autogiroActive ? 'active' : 'inactive'}
        </span>
        <span style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-600)' }}>
          {autogiroActive ? 'Payments are automatically deducted on the 1st of each month.' : 'Enable direct debit below for automatic payment.'}
        </span>
      </div>

      {/* Payment history */}
      <div>
        <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-sm)', fontWeight: 700, margin: '0 0 var(--space-4) 0' }}>
          Payment history
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['ID', 'Date', 'Amount', 'Method', 'Status'].map(h => (
                <th key={h} style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-label-lg)', fontWeight: 400, color: 'var(--color-gray-600)', textAlign: 'left', padding: 'var(--space-3) 0', borderTop: '1.5px solid var(--color-gray-200)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id}>
                <td style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', fontWeight: 500, padding: 'var(--space-4) 0', borderBottom: '1px solid var(--color-gray-100)' }}>{p.id}</td>
                <td style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-700)', padding: 'var(--space-4) 0', borderBottom: '1px solid var(--color-gray-100)' }}>{p.date}</td>
                <td style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', fontWeight: 500, padding: 'var(--space-4) 0', borderBottom: '1px solid var(--color-gray-100)' }}>{p.amount}</td>
                <td style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-600)', padding: 'var(--space-4) 0', borderBottom: '1px solid var(--color-gray-100)' }}>{p.method}</td>
                <td style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', fontWeight: p.status === 'Missed' ? 700 : 400, color: p.status === 'Missed' ? 'var(--color-error)' : 'var(--color-gray-500)', padding: 'var(--space-4) 0', borderBottom: '1px solid var(--color-gray-100)' }}>{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reactivate form */}
      {!autogiroActive && (
        <div>
          <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-sm)', fontWeight: 700, margin: '0 0 var(--space-4) 0' }}>
            Reactivate direct debit
          </h3>
          <div style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <input type="text" placeholder="Account number / clearing number" style={{ width: '100%', padding: 'var(--space-3) 0', border: 'none', borderBottom: '1.5px solid var(--color-gray-300)', background: 'transparent', fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-md)', outline: 'none' }} />
            <button style={{ background: 'var(--color-black)', color: 'var(--color-white)', padding: '14px 28px', border: 'none', fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', fontWeight: 500, cursor: 'pointer', alignSelf: 'flex-start', minHeight: '44px' }}>
              Enable direct debit
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
