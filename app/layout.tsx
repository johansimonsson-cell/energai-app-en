import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Energai – AI-Powered Energy Company',
  description: 'Transparent and AI-powered. Find the right electricity plan with the help of our AI assistant.',
  keywords: ['energy', 'electricity plan', 'AI', 'Sweden', 'energy company', 'green electricity'],
  authors: [{ name: 'Energai' }],
  openGraph: {
    title: 'Energai – AI-Powered Energy Company',
    description: 'Transparent and AI-powered. Find the right electricity plan with the help of our AI assistant.',
    siteName: 'Energai',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Energai – AI-Powered Energy Company',
    description: 'Find the right electricity plan with the help of our AI assistant.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" style={{ height: '100%' }}>
      <body style={{ margin: 0, height: '100%', overflow: 'hidden' }}>
        {children}
      </body>
    </html>
  )
}
