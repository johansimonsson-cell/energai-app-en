'use client'

import { useAppStore } from '@/lib/store'
import { ContentPanel } from './content/ContentPanel'
import { ChatPanel } from './chat/ChatPanel'
import { ToastContainer } from './ui/ToastContainer'
import { OfflineBanner } from './ui/OfflineBanner'

const darkViews = new Set([
  'welcome', 'confirmation', 'offer',
  'outage-info', 'sustainability-dashboard',
  'dashboard', 'image-analysis', 'hardware-quote',
])

export function SplitView() {
  const { mobileView, setMobileView, contentState } = useAppStore()
  const isDark = darkViews.has(contentState.view)

  return (
    <>
      <OfflineBanner />
      <ToastContainer />
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <div
        style={{
          display: 'flex',
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Content panel - 60% on desktop */}
        <div
          id="main-content"
          style={{
            width: '60%',
            height: '100%',
            borderRight: isDark ? '1px solid var(--color-gray-800)' : '1px solid var(--color-gray-200)',
            overflow: 'hidden',
          }}
          className="content-panel-desktop"
          data-mobile-view={mobileView}
        >
          <ContentPanel />
        </div>

        {/* Chat panel - 40% on desktop */}
        <div
          style={{
            width: '40%',
            height: '100%',
            overflow: 'hidden',
          }}
          className="chat-panel-desktop"
          data-mobile-view={mobileView}
        >
          <ChatPanel />
        </div>

        {/* Mobile toggle button */}
        <button
          onClick={() => setMobileView(mobileView === 'chat' ? 'content' : 'chat')}
          aria-label={mobileView === 'chat' ? 'Show content' : 'Show chat'}
          className="mobile-toggle-btn"
          style={{
            display: 'none', // shown via CSS on mobile
            position: 'fixed',
            bottom: 'var(--space-5)',
            right: 'var(--space-5)',
            width: '48px',
            height: '48px',
            background: mobileView === 'chat' ? 'var(--color-white)' : 'var(--color-black)',
            color: mobileView === 'chat' ? 'var(--color-black)' : 'var(--color-white)',
            border: mobileView === 'chat' ? '1.5px solid var(--color-black)' : 'none',
            zIndex: 50,
            cursor: 'pointer',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {mobileView === 'chat' ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <rect x="2" y="3" width="16" height="14" stroke="currentColor" strokeWidth="1.5" />
              <line x1="10" y1="3" x2="10" y2="17" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M3 4H17M3 8H13M3 12H15M3 16H11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="square"
              />
            </svg>
          )}
        </button>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .content-panel-desktop {
            width: 100% !important;
            border-right: none !important;
            display: ${mobileView === 'content' ? 'block' : 'none'} !important;
          }
          .chat-panel-desktop {
            width: 100% !important;
            display: ${mobileView === 'chat' ? 'block' : 'none'} !important;
          }
          .mobile-toggle-btn {
            display: flex !important;
          }
          #main-content {
            padding: var(--space-5) !important;
          }
        }
      `}</style>
    </>
  )
}
