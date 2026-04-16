'use client'

/**
 * Placeholder view for content views not yet built.
 * Will be replaced in sessions 4-7.
 */
export function PlaceholderView({ data, viewName, dark = false }: { data: Record<string, unknown>; viewName: string; dark?: boolean }) {
  const label = viewName.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: '100%',
        gap: 'var(--space-6)',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-primary)',
          fontSize: 'var(--type-display-sm)',
          fontWeight: 700,
          color: dark ? 'var(--color-white)' : 'var(--color-black)',
          letterSpacing: '-0.01em',
          margin: 0,
        }}
      >
        {label}
      </h2>
      <p
        style={{
          fontFamily: 'var(--font-primary)',
          fontSize: 'var(--type-body-md)',
          color: dark ? 'var(--color-gray-300)' : 'var(--color-gray-700)',
          maxWidth: '50ch',
          margin: 0,
        }}
      >
        This view will be built in an upcoming session.
      </p>
      {Object.keys(data).length > 0 && (
        <pre
          style={{
            fontFamily: 'monospace',
            fontSize: 'var(--type-label-md)',
            color: dark ? 'var(--color-gray-500)' : 'var(--color-gray-600)',
            background: dark ? 'var(--color-gray-900)' : 'var(--color-gray-100)',
            padding: 'var(--space-4)',
            overflow: 'auto',
            maxWidth: '100%',
          }}
        >
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </section>
  )
}
