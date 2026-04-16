'use client'

const invoices = [
  { id: 'F-2026-04', period: 'March 2026', amount: '847 kr', due: '2026-04-15', status: 'Unpaid' as const },
  { id: 'F-2026-03', period: 'February 2026', amount: '923 kr', due: '2026-03-15', status: 'Paid' as const },
  { id: 'F-2026-02', period: 'January 2026', amount: '1 104 kr', due: '2026-02-15', status: 'Paid' as const },
  { id: 'F-2025-01', period: 'December 2025', amount: '1 287 kr', due: '2026-01-15', status: 'Paid' as const },
  { id: 'F-2025-12', period: 'November 2025', amount: '891 kr', due: '2025-12-15', status: 'Paid' as const },
  { id: 'F-2025-11', period: 'October 2025', amount: '734 kr', due: '2025-11-15', status: 'Paid' as const },
]

const statusStyles: Record<string, { color: string; weight: number }> = {
  Paid: { color: 'var(--color-gray-500)', weight: 400 },
  Unpaid: { color: 'var(--color-black)', weight: 700 },
  'Overdue': { color: 'var(--color-error)', weight: 700 },
}

export function InvoicesView({ data: _data }: { data: Record<string, unknown> }) {
  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center',
        gap: 'var(--space-8)',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-primary)',
          fontSize: 'var(--type-heading-lg)',
          fontWeight: 700,
          lineHeight: 1.15,
          letterSpacing: '-0.005em',
          color: 'var(--color-black)',
          margin: 0,
        }}
      >
        Invoices
      </h2>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['Invoice', 'Period', 'Amount', 'Due date', 'Status'].map((h) => (
              <th
                key={h}
                style={{
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--type-label-lg)',
                  fontWeight: 400,
                  color: 'var(--color-gray-600)',
                  textAlign: 'left',
                  padding: 'var(--space-3) 0',
                  borderTop: '1.5px solid var(--color-gray-200)',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => {
            const style = statusStyles[inv.status] || statusStyles.Paid
            return (
              <tr key={inv.id} className="stagger-item">
                <td
                  style={{
                    fontFamily: 'var(--font-primary)',
                    fontSize: 'var(--type-body-sm)',
                    fontWeight: 500,
                    color: 'var(--color-black)',
                    padding: 'var(--space-4) 0',
                    borderBottom: '1px solid var(--color-gray-100)',
                  }}
                >
                  {inv.id}
                </td>
                <td
                  style={{
                    fontFamily: 'var(--font-primary)',
                    fontSize: 'var(--type-body-sm)',
                    fontWeight: 400,
                    color: 'var(--color-gray-700)',
                    padding: 'var(--space-4) 0',
                    borderBottom: '1px solid var(--color-gray-100)',
                  }}
                >
                  {inv.period}
                </td>
                <td
                  style={{
                    fontFamily: 'var(--font-primary)',
                    fontSize: 'var(--type-body-sm)',
                    fontWeight: 500,
                    color: 'var(--color-black)',
                    padding: 'var(--space-4) 0',
                    borderBottom: '1px solid var(--color-gray-100)',
                  }}
                >
                  {inv.amount}
                </td>
                <td
                  style={{
                    fontFamily: 'var(--font-primary)',
                    fontSize: 'var(--type-body-sm)',
                    fontWeight: 400,
                    color: 'var(--color-gray-600)',
                    padding: 'var(--space-4) 0',
                    borderBottom: '1px solid var(--color-gray-100)',
                  }}
                >
                  {inv.due}
                </td>
                <td
                  style={{
                    fontFamily: 'var(--font-primary)',
                    fontSize: 'var(--type-body-sm)',
                    fontWeight: style.weight,
                    color: style.color,
                    padding: 'var(--space-4) 0',
                    borderBottom: '1px solid var(--color-gray-100)',
                  }}
                >
                  {inv.status}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}
