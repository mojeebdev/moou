'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import ApiStatusBadge from '@/components/ApiStatusBadge'
import NavDropdown from '@/components/NavDropdown'
import { NAV_DEVELOPERS, NAV_PRODUCT } from '@/lib/nav-config'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!mobileOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileOpen])

  const navLinkStyle = {
    fontFamily: 'var(--font-accent)',
    fontSize: '11px',
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    color: 'var(--ink-tertiary)',
    textDecoration: 'none' as const,
    transition: 'color 0.2s',
  }

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center px-[clamp(24px,6vw,80px)] border-b border-[var(--void-05)]"
        style={{
          height: 'var(--nav-height)',
          background: 'rgba(5, 5, 8, 0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        {/* Left — brand */}
        <div className="flex items-center min-w-0" style={{ gap: '12px' }}>
          <Link
            href="/"
            className="text-[22px] font-bold tracking-[-0.02em] text-[var(--accent)] no-underline shrink-0"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            MÓOU · 谋
          </Link>
          <ApiStatusBadge variant="navbar" />
        </div>

        {/* Center — desktop nav */}
        <div className="hidden md:flex items-center justify-center" style={{ gap: '36px' }}>
          <NavDropdown label="Product" items={NAV_PRODUCT} />
          <Link href="/guide" className="hover:text-[var(--ink-primary)]" style={navLinkStyle}>
            User Guide
          </Link>
          <NavDropdown label="Developers" items={NAV_DEVELOPERS} />
        </div>

        {/* Right — CTA desktop / menu mobile */}
        <div className="flex items-center justify-end" style={{ gap: '16px' }}>
          <Link
            href="/#compile"
            className="hidden md:inline-flex items-center justify-center no-underline transition-all hover:brightness-110"
            style={{
              fontFamily: 'var(--font-accent)',
              fontWeight: 600,
              fontSize: '11px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '10px 18px',
              background: 'var(--accent)',
              color: '#0a0a0a',
            }}
          >
            Compile
          </Link>
          <button
            type="button"
            className="md:hidden bg-transparent border-0 cursor-pointer uppercase"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            style={{
              fontFamily: 'var(--font-accent)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.1em',
              color: 'var(--ink-primary)',
            }}
          >
            {mobileOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-[49]"
          style={{ top: 'var(--nav-height)' }}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            aria-label="Close menu overlay"
            className="absolute inset-0 w-full h-full border-0 cursor-pointer"
            style={{ background: 'rgba(5, 5, 8, 0.72)' }}
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="relative overflow-y-auto"
            style={{
              maxHeight: 'calc(100vh - var(--nav-height))',
              background: 'rgba(12, 12, 18, 0.98)',
              borderBottom: '1px solid var(--void-05)',
              padding: '8px clamp(24px, 6vw, 80px) 24px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <NavDropdown label="Product" items={NAV_PRODUCT} mobile />
            <Link
              href="/guide"
              onClick={() => setMobileOpen(false)}
              className="block uppercase no-underline"
              style={{ ...navLinkStyle, color: 'var(--ink-secondary)', padding: '16px 0', display: 'block' }}
            >
              User Guide
            </Link>
            <NavDropdown label="Developers" items={NAV_DEVELOPERS} mobile />
            <Link
              href="/#compile"
              onClick={() => setMobileOpen(false)}
              className="block text-center no-underline mt-4"
              style={{
                fontFamily: 'var(--font-accent)',
                fontWeight: 600,
                fontSize: '12px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '14px',
                background: 'var(--accent)',
                color: '#0a0a0a',
              }}
            >
              Compile Strategy
            </Link>
          </div>
        </div>
      )}
    </>
  )
}