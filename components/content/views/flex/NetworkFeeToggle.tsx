'use client'

import { useAppStore } from '@/lib/store'

/**
 * Price toggle: show electricity price incl/excl network fee.
 * Source: requirements update 2026-04.md section 1.3
 */
export function NetworkFeeToggle({ dark = false }: { dark?: boolean }) {
  const { includeNetworkFee, setIncludeNetworkFee } = useAppStore()
  const labelColor = dark ? 'var(--color-gray-300)' : 'var(--color-gray-700)'
  const trackOff = dark ? 'var(--color-gray-800)' : 'var(--color-gray-200)'
  const trackOn = 'var(--color-accent)'

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        padding: 'var(--space-2) var(--space-3)',
        borderLeft: `3px solid ${includeNetworkFee ? 'var(--color-accent)' : trackOff}`,
        background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
      }}
      title="The network fee is paid to your grid operator, not to us. We show it here for transparency."
    >
      <span
        style={{
          fontFamily: 'var(--font-primary)',
          fontSize: 'var(--type-label-md)',
          color: labelColor,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        Incl. network fee
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={includeNetworkFee}
        onClick={() => setIncludeNetworkFee(!includeNetworkFee)}
        style={{
          position: 'relative',
          width: 44,
          height: 22,
          borderRadius: 0,
          background: includeNetworkFee ? trackOn : trackOff,
          border: 'none',
          cursor: 'pointer',
          transition: 'background var(--duration-fast)',
        }}
      >
        <span
          aria-hidden
          style={{
            position: 'absolute',
            top: 2,
            left: includeNetworkFee ? 24 : 2,
            width: 18,
            height: 18,
            background: 'var(--color-white)',
            transition: 'left var(--duration-fast)',
          }}
        />
      </button>
    </div>
  )
}
