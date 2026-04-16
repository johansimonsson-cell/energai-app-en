'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

interface AdminUser {
  id: string
  email: string
  name: string | null
  role: string
}

const navItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/ai-config', label: 'AI Configuration' },
  { href: '/admin/ai-policy', label: 'AI Policy (goals)' },
  { href: '/admin/customers', label: 'Customers' },
  { href: '/admin/offers', label: 'Offers' },
]

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = sessionStorage.getItem('adminUser')
    if (stored) {
      const parsed = JSON.parse(stored) as AdminUser
      if (parsed.role === 'ADMIN') {
        setUser(parsed)
        setLoading(false)
        return
      }
    }
    router.push('/admin/login')
  }, [router])

  const handleLogout = () => {
    sessionStorage.removeItem('adminUser')
    router.push('/admin/login')
  }

  if (loading && !user) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-primary)',
        fontSize: 'var(--type-body-sm)',
        color: 'var(--color-gray-500)',
      }}>
        Loading...
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '240px',
          background: 'var(--color-black)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            padding: 'var(--space-8) var(--space-6)',
            borderBottom: '1px solid var(--color-gray-800)',
          }}
        >
          <Link
            href="/admin"
            style={{
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--type-heading-sm)',
              fontWeight: 700,
              color: 'var(--color-white)',
              textDecoration: 'none',
              letterSpacing: '-0.02em',
            }}
          >
            Energai
          </Link>
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--type-label-md)',
              color: 'var(--color-gray-500)',
              marginTop: 'var(--space-1)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Admin
          </span>
        </div>

        <nav style={{ padding: 'var(--space-4) 0', flex: 1 }}>
          {navItems.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'block',
                  padding: 'var(--space-3) var(--space-6)',
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--type-body-sm)',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--color-white)' : 'var(--color-gray-400)',
                  textDecoration: 'none',
                  borderLeft: isActive ? '2px solid var(--color-accent)' : '2px solid transparent',
                  transition: `color var(--duration-fast) var(--ease-default)`,
                }}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div
          style={{
            padding: 'var(--space-6)',
            borderTop: '1px solid var(--color-gray-800)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--type-label-md)',
              color: 'var(--color-gray-500)',
              margin: '0 0 var(--space-2) 0',
            }}
          >
            {user?.email}
          </p>
          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--type-label-md)',
              color: 'var(--color-gray-600)',
              cursor: 'pointer',
              padding: 0,
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
            }}
          >
            Log out
          </button>
        </div>
      </aside>

      <main
        style={{
          flex: 1,
          overflow: 'auto',
          background: 'var(--color-gray-25)',
          padding: 'var(--space-10)',
        }}
      >
        {children}
      </main>
    </div>
  )
}
