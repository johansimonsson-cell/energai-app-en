'use client'

import { useAppStore } from '@/lib/store'
import { AnimatePresence, motion } from 'framer-motion'

const typeColors = {
  info: { bg: 'var(--color-black)', text: 'var(--color-white)' },
  error: { bg: 'var(--color-error)', text: 'var(--color-white)' },
  success: { bg: 'var(--color-success)', text: 'var(--color-white)' },
}

export function ToastContainer() {
  const { toasts, removeToast } = useAppStore()

  return (
    <div
      style={{
        position: 'fixed',
        top: 'var(--space-6)',
        right: 'var(--space-6)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
        pointerEvents: 'none',
      }}
      aria-live="assertive"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const colors = typeColors[toast.type]
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.3, ease: [0.0, 0.0, 0.2, 1.0] }}
              style={{
                background: colors.bg,
                color: colors.text,
                padding: 'var(--space-4) var(--space-6)',
                fontFamily: 'var(--font-primary)',
                fontSize: 'var(--type-body-sm)',
                fontWeight: 400,
                lineHeight: 1.5,
                maxWidth: '360px',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-4)',
                pointerEvents: 'auto',
                cursor: 'pointer',
              }}
              onClick={() => removeToast(toast.id)}
              role="alert"
            >
              <span style={{ flex: 1 }}>{toast.message}</span>
              <span
                style={{
                  fontSize: 'var(--type-label-md)',
                  opacity: 0.7,
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                &times;
              </span>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
