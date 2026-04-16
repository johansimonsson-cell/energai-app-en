'use client'

/**
 * Skeleton loading states for content panel transitions.
 * Static blocks in gray-100 (light) / gray-800 (dark).
 * NO shimmer animation per design spec.
 */

export function SkeletonBlock({
  width = '100%',
  height = '16px',
  dark = false,
}: {
  width?: string
  height?: string
  dark?: boolean
}) {
  return (
    <div
      style={{
        width,
        height,
        background: dark ? 'var(--color-gray-800)' : 'var(--color-gray-100)',
      }}
      aria-hidden="true"
    />
  )
}

export function ContentSkeleton({ dark = false }: { dark?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-6)',
        padding: 'var(--space-10)',
        height: '100%',
        justifyContent: 'center',
      }}
      role="status"
      aria-label="Loading content..."
    >
      {/* Title skeleton */}
      <SkeletonBlock width="60%" height="40px" dark={dark} />
      <SkeletonBlock width="40%" height="20px" dark={dark} />

      {/* Spacer */}
      <div style={{ height: 'var(--space-8)' }} />

      {/* Content blocks */}
      <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
        <SkeletonBlock width="33%" height="120px" dark={dark} />
        <SkeletonBlock width="33%" height="120px" dark={dark} />
        <SkeletonBlock width="33%" height="120px" dark={dark} />
      </div>

      {/* Text lines */}
      <SkeletonBlock width="90%" height="14px" dark={dark} />
      <SkeletonBlock width="75%" height="14px" dark={dark} />
      <SkeletonBlock width="85%" height="14px" dark={dark} />
    </div>
  )
}

export function TableSkeleton() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-4)',
        padding: 'var(--space-10)',
        height: '100%',
        justifyContent: 'center',
      }}
      role="status"
      aria-label="Loading table..."
    >
      <SkeletonBlock width="30%" height="32px" />
      <div style={{ height: 'var(--space-4)' }} />
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: 'var(--space-4)' }}>
          <SkeletonBlock width="20%" height="16px" />
          <SkeletonBlock width="25%" height="16px" />
          <SkeletonBlock width="15%" height="16px" />
          <SkeletonBlock width="20%" height="16px" />
          <SkeletonBlock width="10%" height="16px" />
        </div>
      ))}
    </div>
  )
}
