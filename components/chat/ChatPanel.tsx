'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useAppStore } from '@/lib/store'
import { ChatMessage } from './ChatMessage'
import { TypingIndicator } from './TypingIndicator'

const MAX_FILE_SIZE = 10 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']

export function ChatPanel() {
  const [input, setInput] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const {
    messages, isStreaming, sendMessage, uploadFile,
    pendingAttachments, addPendingAttachment, removePendingAttachment,
    addToast,
  } = useAppStore()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isStreaming])

  const handleFileUpload = useCallback(async (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      addToast('File type not supported. Use JPG, PNG, WebP or PDF.', 'error')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      addToast('File is too large (max 10 MB).', 'error')
      return
    }

    setIsUploading(true)
    try {
      const uploaded = await uploadFile(file)
      addPendingAttachment(uploaded)
    } catch (err) {
      addToast(err instanceof Error ? err.message : 'Upload failed', 'error')
    } finally {
      setIsUploading(false)
    }
  }, [uploadFile, addPendingAttachment, addToast])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    files.forEach(handleFileUpload)
  }, [handleFileUpload])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    files.forEach(handleFileUpload)
    e.target.value = ''
  }, [handleFileUpload])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!input.trim() && pendingAttachments.length === 0) || isStreaming) return
    const msg = input.trim() || (pendingAttachments.length > 0 ? 'See attached image' : '')
    setInput('')
    await sendMessage(msg)
  }

  return (
    <aside
      style={{
        background: 'var(--color-black)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
      }}
      aria-label="Chat"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Header */}
      <header
        style={{
          padding: 'var(--space-5) var(--space-6)',
          borderBottom: '1px solid var(--color-gray-800)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-primary)',
            fontSize: 'var(--type-heading-sm)',
            fontWeight: 700,
            color: 'var(--color-white)',
            letterSpacing: '-0.005em',
          }}
        >
          Energai
        </span>
      </header>

      {/* Drag overlay */}
      {isDragOver && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20,
            border: '2px dashed var(--color-accent)',
          }}
        >
          <span style={{ color: 'var(--color-white)', fontSize: 'var(--type-body-lg)', fontFamily: 'var(--font-primary)' }}>
            Drop to upload
          </span>
        </div>
      )}

      {/* Messages */}
      <div
        className="chat-scrollbar"
        role="list"
        aria-label="Chat messages"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 'var(--space-6)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
        }}
      >
        {messages.length === 0 && (
          <div
            style={{
              color: 'var(--color-gray-500)',
              fontSize: 'var(--type-body-md)',
              marginTop: 'auto',
              textAlign: 'center',
              padding: 'var(--space-10) 0',
            }}
          >
            Hi! How can I help you today?
          </div>
        )}
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isStreaming && messages[messages.length - 1]?.content === '' && (
          <TypingIndicator />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Pending attachments preview */}
      {pendingAttachments.length > 0 && (
        <div
          style={{
            padding: 'var(--space-3) var(--space-6)',
            borderTop: '1px solid var(--color-gray-800)',
            display: 'flex',
            gap: 'var(--space-3)',
            flexWrap: 'wrap',
          }}
        >
          {pendingAttachments.map((att) => (
            <div
              key={att.id}
              style={{
                position: 'relative',
                width: '56px',
                height: '56px',
                background: 'var(--color-gray-800)',
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
                  width: '100%', height: '100%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 2H12L16 6V18H4V2Z" stroke="var(--color-gray-500)" strokeWidth="1.5" />
                    <path d="M12 2V6H16" stroke="var(--color-gray-500)" strokeWidth="1.5" />
                  </svg>
                </div>
              )}
              <button
                onClick={() => removePendingAttachment(att.id)}
                aria-label={`Remove ${att.fileName}`}
                style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  width: '18px',
                  height: '18px',
                  background: 'var(--color-black)',
                  color: 'var(--color-white)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  lineHeight: 1,
                }}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload progress */}
      {isUploading && (
        <div style={{ height: '2px', background: 'var(--color-accent)', animation: 'progress-bar 1.5s ease-in-out infinite' }} />
      )}

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: 'var(--space-5) var(--space-6)',
          borderTop: '1px solid var(--color-gray-800)',
        }}
      >
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-end' }}>
          {/* Upload button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isStreaming || isUploading}
            aria-label="Upload image or document"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-gray-500)',
              cursor: isStreaming ? 'default' : 'pointer',
              opacity: isStreaming ? 0.3 : 1,
              padding: 'var(--space-2)',
              minWidth: '44px',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color var(--duration-fast) var(--ease-default)',
            }}
            onMouseEnter={(e) => { if (!isStreaming) e.currentTarget.style.color = 'var(--color-white)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-gray-500)' }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <rect x="2" y="4" width="16" height="12" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="7" cy="9" r="1.5" stroke="currentColor" strokeWidth="1" />
              <path d="M2 14L6 10L9 13L13 8L18 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
            </svg>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            onChange={handleFileInput}
            style={{ display: 'none' }}
            aria-hidden="true"
          />

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={pendingAttachments.length > 0 ? 'Add a message...' : 'Type a message...'}
            disabled={isStreaming}
            aria-label="Chat message"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              borderBottom: '1.5px solid var(--color-gray-600)',
              color: 'var(--color-white)',
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--type-body-md)',
              padding: 'var(--space-3) 0',
              outline: 'none',
              transition: 'border-color var(--duration-fast) var(--ease-default)',
            }}
            onFocus={(e) => { e.currentTarget.style.borderBottomColor = 'var(--color-white)' }}
            onBlur={(e) => { e.currentTarget.style.borderBottomColor = 'var(--color-gray-600)' }}
          />
          <button
            type="submit"
            disabled={isStreaming || (!input.trim() && pendingAttachments.length === 0)}
            aria-label="Send message"
            style={{
              background: 'var(--color-accent)',
              color: 'var(--color-black)',
              border: 'none',
              padding: 'var(--space-2) var(--space-4)',
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--type-body-sm)',
              fontWeight: 500,
              cursor: isStreaming || (!input.trim() && pendingAttachments.length === 0) ? 'default' : 'pointer',
              opacity: isStreaming || (!input.trim() && pendingAttachments.length === 0) ? 0.4 : 1,
              transition: 'opacity var(--duration-fast) var(--ease-default)',
              minWidth: '44px',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M3 10L17 10M17 10L11 4M17 10L11 16" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="miter" strokeLinecap="square" />
            </svg>
          </button>
        </div>
      </form>

      <style>{`
        @keyframes progress-bar {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </aside>
  )
}
