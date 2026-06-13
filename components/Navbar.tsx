'use client'

import Link from 'next/link'
import ApiStatusBadge from '@/components/ApiStatusBadge'

const NAV_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/about#faq' },
  { label: 'Docs', href: '/docs' },
  { label: 'GitHub', href: 'https://github.com/mojeebdev/moou', external: true },
] as const

export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[clamp(24px,6vw,80px)] border-b border-[var(--void-05)]"
      style={{
        height: 'var(--nav-height)',
        background: 'rgba(5, 5, 8, 0.80)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <div className="flex items-center" style={{ gap: '16px' }}>
        <Link
          href="/"
          className="text-[22px] font-bold tracking-[-0.02em] text-[var(--accent)] no-underline"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          MÓOU · 谋
        </Link>
        <ApiStatusBadge variant="navbar" />
      </div>

      <div className="hidden md:flex items-center" style={{ gap: '32px' }}>
        {NAV_LINKS.map((link) =>
          'external' in link && link.external ? (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="uppercase no-underline transition-colors duration-200 hover:text-[var(--ink-primary)]"
              style={{
                fontFamily: 'var(--font-accent)',
                fontSize: '11px',
                letterSpacing: '0.1em',
                color: 'var(--ink-tertiary)',
              }}
            >
              {link.label}
            </a>
          ) : (
            <Link
              key={link.label}
              href={link.href}
              className="uppercase no-underline transition-colors duration-200 hover:text-[var(--ink-primary)]"
              style={{
                fontFamily: 'var(--font-accent)',
                fontSize: '11px',
                letterSpacing: '0.1em',
                color: 'var(--ink-tertiary)',
              }}
            >
              {link.label}
            </Link>
          )
        )}
      </div>
    </nav>
  )
}