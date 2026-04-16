'use client'

import type { Message } from '@/lib/store'
import { useAppStore } from '@/lib/store'

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'USER'
  const retryLastMessage = useAppStore((s) => s.retryLastMessage)
  const isStreaming = useAppStore((s) => s.isStreaming)

  return (
    <div
      role="listitem"
      aria-label={isUser ? 'Your message' : 'AI response'}
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
      }}
    >
      <div
        style={{
          maxWidth: '85%',
          padding: 'var(--space-3) var(--space-4)',
          background: isUser ? 'var(--color-gray-800)' : 'transparent',
          color: isUser
            ? 'var(--color-white)'
            : message.error
            ? 'var(--color-error)'
            : 'var(--color-gray-300)',
          fontFamily: 'var(--font-primary)',
          fontSize: 'var(--type-body-md)',
          fontWeight: 400,
          lineHeight: 1.5,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {/* Attachment thumbnails */}
        {message.attachments && message.attachments.length > 0 && (
          <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)', flexWrap: 'wrap' }}>
            {message.attachments.map((att) => (
              <div
                key={att.id}
                style={{
                  width: '80px',
                  height: '80px',
                  background: 'var(--color-gray-700)',
                  overflow: 'hidden',
                }}
              >
                {att.previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={att.previewUrl}
                    alt={att.fileName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{
                    width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: '4px',
                  }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4 2H12L16 6V18H4V2Z" stroke="var(--color-gray-400)" strokeWidth="1.5" />
                      <path d="M12 2V6H16" stroke="var(--color-gray-400)" strokeWidth="1.5" />
                    </svg>
                    <span style={{ fontSize: '9px', color: 'var(--color-gray-400)', textAlign: 'center', lineHeight: 1.1 }}>
                      {att.fileName.length > 10 ? att.fileName.slice(0, 10) + '...' : att.fileName}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {message.content}

        {message.error && !isStreaming && (
          <button
            onClick={retryLastMessage}
            style={{
              display: 'block',
              marginTop: 'var(--space-3)',
              background: 'transparent',
              border: '1px solid var(--color-gray-600)',
              color: 'var(--color-gray-300)',
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--type-body-sm)',
              padding: 'var(--space-2) var(--space-4)',
              cursor: 'pointer',
              transition: 'border-color var(--duration-fast) var(--ease-default)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-white)'; e.currentTarget.style.color = 'var(--color-white)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-gray-600)'; e.currentTarget.style.color = 'var(--color-gray-300)' }}
            aria-label="Try again"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  )
}
