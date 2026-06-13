import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://usemoou.xyz')

const ogImage = 'https://usemoou.xyz/images/hero-desktop.png'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'MÓOU 谋 — Trading Strategy Compiler',
    template: '%s · MÓOU 谋',
  },
  description:
    'Describe any trading idea in plain English. MÓOU structures your thinking, scores your risk, and outputs Bitget Playbook-ready strategy.',
  applicationName: 'MÓOU',
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: [{ url: '/apple-icon.svg', type: 'image/svg+xml' }],
  },
  openGraph: {
    title: 'MÓOU 谋 — Before you trade, 谋.',
    description:
      'Natural language → structured strategy + risk score + Bitget Playbook output.',
    url: 'https://usemoou.xyz',
    siteName: 'MÓOU',
    images: [
      {
        url: ogImage,
        width: 1400,
        height: 788,
        alt: 'MÓOU 谋 — Trading Strategy Compiler',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MÓOU 谋 — Before you trade, 谋.',
    description:
      'Natural language → structured strategy + risk score + Bitget Playbook output.',
    images: [ogImage],
    creator: '@mojeebeth',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}