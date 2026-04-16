'use client'

import { useAppStore } from '@/lib/store'
import { useRef, useCallback, useState } from 'react'

const options = [
  {
    title: 'Photo of roof',
    description: 'Take a photo of your roof and we will estimate solar panel capacity, tilt, and orientation.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="14" r="5" stroke="currentColor" strokeWidth="1.5" /><path d="M16 3V6M16 22V25M3 14H6M26 14H29M6 5L8.5 7.5M23.5 20.5L26 23M26 5L23.5 7.5M8.5 20.5L6 23" stroke="currentColor" strokeWidth="1.5" /><path d="M4 28H28" stroke="currentColor" strokeWidth="1.5" /><path d="M8 28L8 24L14 20L18 22L24 18V28" stroke="currentColor" strokeWidth="1.5" /></svg>
    ),
    category: 'ROOF_PHOTO',
    accept: 'image/*',
  },
  {
    title: 'Photo of parking',
    description: 'Show your parking area or garage and we will recommend the right charging station and placement.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="4" y="8" width="24" height="16" stroke="currentColor" strokeWidth="1.5" /><path d="M4 14H28M10 14V24M18 14V24" stroke="currentColor" strokeWidth="1.5" /><path d="M12 18H16V22H12V18Z" stroke="currentColor" strokeWidth="1.5" /></svg>
    ),
    category: 'PARKING',
    accept: 'image/*',
  },
  {
    title: 'Enter your address',
    description: 'We analyze your roof via satellite imagery and calculate the solar potential for your property.',
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M16 4C11 4 7 8 7 13C7 20 16 28 16 28C16 28 25 20 25 13C25 8 21 4 16 4Z" stroke="currentColor" strokeWidth="1.5" /><circle cx="16" cy="13" r="3" stroke="currentColor" strokeWidth="1.5" /></svg>
    ),
    category: null,
    isAddress: true,
  },
]

export function ImageUploadPrompt({ data: _data }: { data: Record<string, unknown> }) {
  const { uploadFile, addPendingAttachment, sendMessage, addToast } = useAppStore()
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [address, setAddress] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = useCallback(async (file: File, category: string) => {
    setIsUploading(true)
    try {
      const uploaded = await uploadFile(file)
      uploaded.category = category
      addPendingAttachment(uploaded)
      await sendMessage(`I am uploading a photo of my ${category === 'ROOF_PHOTO' ? 'roof' : 'parking area'}`)
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Upload failed', 'error')
    } finally {
      setIsUploading(false)
    }
  }, [uploadFile, addPendingAttachment, sendMessage, addToast])

  const handleAddressSubmit = useCallback(async () => {
    if (!address.trim()) return
    await sendMessage(`My address is ${address}`)
  }, [address, sendMessage])

  return (
    <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-10)' }}>
      <h2 style={{
        fontFamily: 'var(--font-primary)',
        fontSize: 'var(--type-heading-lg)',
        fontWeight: 700,
        color: 'var(--color-black)',
        letterSpacing: '-0.005em',
        margin: 0,
      }}>
        Help us give you the right price
      </h2>
      <p style={{
        fontFamily: 'var(--font-primary)',
        fontSize: 'var(--type-body-md)',
        color: 'var(--color-gray-700)',
        margin: 0,
        maxWidth: '50ch',
      }}>
        Choose one of the options below so we can give you a more accurate quote.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
        {options.map((opt, i) => (
          <div
            key={opt.title}
            className="stagger-item"
            style={{
              borderLeft: i === 0 ? 'none' : '2px solid var(--color-gray-200)',
              paddingLeft: i === 0 ? 0 : 'var(--space-6)',
              paddingRight: 'var(--space-6)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)',
            }}
          >
            <div style={{ color: 'var(--color-black)' }}>{opt.icon}</div>
            <h3 style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-heading-md)', fontWeight: 700, margin: 0 }}>
              {opt.title}
            </h3>
            <p style={{ fontFamily: 'var(--font-primary)', fontSize: 'var(--type-body-sm)', color: 'var(--color-gray-700)', lineHeight: 1.5, margin: 0 }}>
              {opt.description}
            </p>

            {opt.isAddress ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street address, city"
                  aria-label="Address"
                  style={{
                    width: '100%',
                    padding: 'var(--space-3) 0',
                    border: 'none',
                    borderBottom: '1.5px solid var(--color-gray-300)',
                    background: 'transparent',
                    fontFamily: 'var(--font-primary)',
                    fontSize: 'var(--type-body-md)',
                    outline: 'none',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderBottomColor = 'var(--color-black)' }}
                  onBlur={(e) => { e.currentTarget.style.borderBottomColor = 'var(--color-gray-300)' }}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddressSubmit() }}
                />
                <button
                  onClick={handleAddressSubmit}
                  disabled={!address.trim()}
                  style={{
                    background: 'var(--color-black)',
                    color: 'var(--color-white)',
                    padding: '12px 24px',
                    border: 'none',
                    fontFamily: 'var(--font-primary)',
                    fontSize: 'var(--type-body-sm)',
                    fontWeight: 500,
                    cursor: address.trim() ? 'pointer' : 'default',
                    opacity: address.trim() ? 1 : 0.4,
                    alignSelf: 'flex-start',
                    minHeight: '44px',
                  }}
                >
                  Analyze
                </button>
              </div>
            ) : (
              <>
                <input
                  ref={el => { fileInputRefs.current[i] = el }}
                  type="file"
                  accept={opt.accept}
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file && opt.category) handleUpload(file, opt.category)
                    e.target.value = ''
                  }}
                />
                <button
                  onClick={() => fileInputRefs.current[i]?.click()}
                  disabled={isUploading}
                  style={{
                    background: 'var(--color-black)',
                    color: 'var(--color-white)',
                    padding: '12px 24px',
                    border: 'none',
                    fontFamily: 'var(--font-primary)',
                    fontSize: 'var(--type-body-sm)',
                    fontWeight: 500,
                    cursor: isUploading ? 'default' : 'pointer',
                    opacity: isUploading ? 0.4 : 1,
                    alignSelf: 'flex-start',
                    minHeight: '44px',
                  }}
                >
                  {isUploading ? 'Uploading...' : 'Upload photo'}
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 767px) {
          section > div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: 1fr !important;
            gap: var(--space-8) !important;
          }
          section > div[style*="grid-template-columns: repeat(3"] > div {
            border-left: 2px solid var(--color-gray-200) !important;
            padding-left: var(--space-6) !important;
          }
        }
      `}</style>
    </section>
  )
}
