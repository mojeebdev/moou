import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { DM_Mono, Lora, Playfair_Display } from 'next/font/google'
import './globals.css'

const fontDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '600', '700', '900'],
  style: ['normal', 'italic'],
})

const fontBody = Lora({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500'],
  style: ['normal', 'italic'],
})

const fontAccent = DM_Mono({
  subsets: ['latin'],
  variable: '--font-accent',
  display: 'swap',
  weight: ['300', '400', '500'],
})

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
    <html
      lang="en"
      className={`${fontDisplay.variable} ${fontBody.variable} ${fontAccent.variable}`}
    >
      <head>
        <link
          rel="preload"
          as="image"
          href="/images/hero-desktop.png"
          media="(min-width: 769px)"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/images/hero-mobile.png"
          media="(max-width: 768px)"
          fetchPriority="high"
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}