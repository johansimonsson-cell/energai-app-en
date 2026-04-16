import { create } from 'zustand'

export type ContentView =
  // New customer / Sales
  | 'welcome' | 'plans' | 'plan-detail' | 'signup-form' | 'confirmation'
  | 'login' | 'energy-education'
  // Products & Hardware
  | 'product-catalog' | 'product-detail' | 'hardware-quote'
  | 'financing-calculator' | 'bundle-overview'
  | 'image-upload-prompt' | 'image-analysis'
  // Logged in / My pages
  | 'dashboard' | 'usage' | 'invoices' | 'offer' | 'support'
  | 'settings' | 'payment' | 'moving'
  | 'order-status' | 'installation-tracker'
  // Specialized
  | 'outage-info' | 'solar-info' | 'sustainability-dashboard'
  | 'energy-consultation' | 'b2b-referral' | 'community-hub'
  // New sales support views
  | 'needs-assessment' | 'roi-calculator' | 'competitor-comparison'
  | 'trust-proof' | 'installation-process' | 'human-handoff'
  // Energai Flex (kravspec 2026-04 §1)
  | 'flex-builder' | 'price-breakdown' | 'binding-explainer'
  | 'post-binding-view' | 'flex-confirmation'
  // Marknadsdata (kravspec 2026-04 §3)
  | 'market-insight' | 'battery-business-case'
  | 'solar-business-case' | 'price-history-explorer'

export type TransitionType = 'fade' | 'slide-left' | 'slide-right'

export interface UploadedFile {
  id: string
  fileName: string
  filePath: string
  fileType: string
  category: string | null
  fileSize: number
  base64?: string
  mimeType?: string
  previewUrl?: string
}

export interface Message {
  id: string
  role: 'USER' | 'ASSISTANT' | 'SYSTEM'
  content: string
  attachments?: UploadedFile[]
  timestamp: Date
  error?: boolean
}

export interface ContentState {
  view: ContentView
  data: Record<string, unknown>
  transition: TransitionType
}

export interface User {
  id: string
  email: string
  name: string | null
  role: string
}

export interface Toast {
  id: string
  message: string
  type: 'info' | 'error' | 'success'
}

interface AppState {
  // Chat
  messages: Message[]
  isStreaming: boolean
  sessionId: string | null

  // Content panel
  contentState: ContentState

  // User
  user: User | null
  isAuthenticated: boolean

  // Mobile
  mobileView: 'chat' | 'content'

  // Pending attachments (before send)
  pendingAttachments: UploadedFile[]

  // UI state
  toasts: Toast[]
  isOnline: boolean

  // Price toggle: show electricity price incl. grid fee? Persisted per session (not localStorage).
  // Source: requirements update 2026-04.md §1.3
  includeNetworkFee: boolean
  setIncludeNetworkFee: (value: boolean) => void

  // Actions
  sendMessage: (content: string, attachments?: UploadedFile[]) => Promise<void>
  uploadFile: (file: File) => Promise<UploadedFile>
  addPendingAttachment: (attachment: UploadedFile) => void
  removePendingAttachment: (id: string) => void
  clearPendingAttachments: () => void
  retryLastMessage: () => Promise<void>
  setContentView: (view: ContentView, data?: Record<string, unknown>, transition?: TransitionType) => void
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setMobileView: (view: 'chat' | 'content') => void
  addToast: (message: string, type?: Toast['type']) => void
  removeToast: (id: string) => void
  setOnline: (online: boolean) => void
}

function generateId() {
  return Math.random().toString(36).substring(2, 15)
}

function parseContentAction(text: string): { chatText: string; action: Partial<ContentState> | null; isBuffering: boolean } {
  // Check for a complete CONTENT_ACTION block
  const actionMatch = text.match(/<!--CONTENT_ACTION-->([\s\S]*?)<!--\/CONTENT_ACTION-->/)
  if (actionMatch) {
    const chatText = text.replace(/<!--CONTENT_ACTION-->[\s\S]*?<!--\/CONTENT_ACTION-->/, '').trim()
    try {
      const action = JSON.parse(actionMatch[1].trim())
      return { chatText, action, isBuffering: false }
    } catch {
      return { chatText, action: null, isBuffering: false }
    }
  }

  // Check for an incomplete/in-progress CONTENT_ACTION block (being streamed)
  // Buffer it so the raw JSON is never shown to the user
  const partialMatch = text.indexOf('<!--CONTENT_ACTION')
  if (partialMatch !== -1) {
    const chatText = text.substring(0, partialMatch).trim()
    return { chatText, action: null, isBuffering: true }
  }

  return { chatText: text, action: null, isBuffering: false }
}

const CHAT_TIMEOUT = 30000

export const useAppStore = create<AppState>((set, get) => ({
  messages: [],
  isStreaming: false,
  sessionId: null,

  contentState: {
    view: 'welcome',
    data: {},
    transition: 'fade',
  },

  user: null,
  isAuthenticated: false,
  mobileView: 'chat',
  pendingAttachments: [],
  toasts: [],
  isOnline: true,
  includeNetworkFee: false,
  setIncludeNetworkFee: (value: boolean) => set({ includeNetworkFee: value }),

  sendMessage: async (content: string, attachments?: UploadedFile[]) => {
    if (!get().isOnline) {
      get().addToast('You appear to be offline. Check your connection.', 'error')
      return
    }

    // Use pending attachments if none provided explicitly
    const allAttachments = attachments || get().pendingAttachments
    set({ pendingAttachments: [] })

    const userMessage: Message = {
      id: generateId(),
      role: 'USER',
      content,
      attachments: allAttachments.length > 0 ? allAttachments : undefined,
      timestamp: new Date(),
    }

    set((state) => ({
      messages: [...state.messages, userMessage],
      isStreaming: true,
    }))

    const assistantMessage: Message = {
      id: generateId(),
      role: 'ASSISTANT',
      content: '',
      timestamp: new Date(),
    }

    set((state) => ({
      messages: [...state.messages, assistantMessage],
    }))

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), CHAT_TIMEOUT)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          sessionId: get().sessionId,
          context: get().contentState,
          userId: get().user?.id || null,
          attachments: allAttachments.length > 0 ? allAttachments.map(a => ({
            id: a.id,
            fileName: a.fileName,
            fileType: a.fileType,
            category: a.category,
            base64: a.base64,
            mimeType: a.mimeType,
          })) : undefined,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeout)

      if (response.status === 429) {
        throw new Error('RATE_LIMITED')
      }

      if (!response.ok) throw new Error('Chat request failed')

      const returnedSessionId = response.headers.get('X-Session-Id')
      if (returnedSessionId && !get().sessionId) {
        set({ sessionId: returnedSessionId })
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No reader')

      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        fullText += chunk

        const { chatText, action, isBuffering } = parseContentAction(fullText)

        // Only update the displayed text — never show raw CONTENT_ACTION JSON
        set((state) => {
          const messages = [...state.messages]
          const lastIdx = messages.length - 1
          messages[lastIdx] = { ...messages[lastIdx], content: chatText }
          return { messages }
        })

        if (action?.view) {
          set((state) => ({
            contentState: {
              view: (action.view as ContentView) || state.contentState.view,
              data: action.data as Record<string, unknown> || state.contentState.data,
              transition: (action.transition as TransitionType) || 'fade',
            },
          }))
        }
      }
    } catch (error) {
      clearTimeout(timeout)
      console.error('Chat error:', error)

      let errorMessage = 'Something went wrong. Please try again.'
      let isRetryable = true

      if (error instanceof DOMException && error.name === 'AbortError') {
        errorMessage = 'The response took too long. Click "Try again" to retry.'
      } else if (error instanceof Error && error.message === 'RATE_LIMITED') {
        errorMessage = 'Too many requests. Please wait a moment and try again.'
        isRetryable = false
      }

      set((state) => {
        const messages = [...state.messages]
        const lastIdx = messages.length - 1
        messages[lastIdx] = {
          ...messages[lastIdx],
          content: errorMessage,
          error: isRetryable,
        }
        return { messages }
      })
    } finally {
      set({ isStreaming: false })
    }
  },

  uploadFile: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const userId = get().user?.id
    if (userId) formData.append('userId', userId)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.error || 'Upload failed')
    }

    const uploaded = await response.json()

    // Create a local preview URL for images
    let previewUrl: string | undefined
    if (file.type.startsWith('image/')) {
      previewUrl = URL.createObjectURL(file)
    }

    return { ...uploaded, previewUrl } as UploadedFile
  },

  addPendingAttachment: (attachment: UploadedFile) => {
    set((state) => ({
      pendingAttachments: [...state.pendingAttachments, attachment],
    }))
  },

  removePendingAttachment: (id: string) => {
    set((state) => ({
      pendingAttachments: state.pendingAttachments.filter(a => a.id !== id),
    }))
  },

  clearPendingAttachments: () => {
    set({ pendingAttachments: [] })
  },

  retryLastMessage: async () => {
    const messages = get().messages
    let lastUserContent: string | null = null
    let lastUserAttachments: UploadedFile[] | undefined

    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'USER') {
        lastUserContent = messages[i].content
        lastUserAttachments = messages[i].attachments
        break
      }
    }

    if (!lastUserContent) return

    set((state) => ({
      messages: state.messages.slice(0, -2),
    }))

    await get().sendMessage(lastUserContent, lastUserAttachments)
  },

  setContentView: (view, data = {}, transition = 'fade') => {
    set({
      contentState: { view, data, transition },
    })
  },

  login: async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) throw new Error('Login failed')

    const user = await response.json()
    set({ user, isAuthenticated: true })
  },

  logout: () => {
    set({ user: null, isAuthenticated: false, sessionId: null })
  },

  setMobileView: (view) => {
    set({ mobileView: view })
  },

  addToast: (message: string, type: Toast['type'] = 'info') => {
    const id = generateId()
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }))
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }))
    }, 4000)
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }))
  },

  setOnline: (online: boolean) => {
    set({ isOnline: online })
  },
}))
