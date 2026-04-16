'use client'

export function TypingIndicator() {
  return (
    <div
      style={{
        display: 'flex',
        gap: '6px',
        padding: 'var(--space-3) var(--space-4)',
        alignItems: 'center',
      }}
      aria-label="AI skriver..."
      role="status"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: '6px',
            height: '6px',
            background: 'var(--color-gray-500)',
            display: 'inline-block',
            animation: `typing-pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          @keyframes typing-pulse {
            0%, 80%, 100% { opacity: 0.3; }
            40% { opacity: 1; }
          }
        }
      `}</style>
    </div>
  )
}
