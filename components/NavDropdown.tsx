'use client'

import Link from 'next/link'
import { useEffect, useId, useRef, useState } from 'react'

export type NavDropdownItem = {
  label: string
  href: string
  description?: string
  external?: boolean
}

interface NavDropdownProps {
  label: string
  items: NavDropdownItem[]
  /** Mobile accordion mode */
  mobile?: boolean
}

export default function NavDropdown({ label, items, mobile = false }: NavDropdownProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const panelId = useId()

  useEffect(() => {
    if (!open) return

    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const linkStyle = {
    fontFamily: 'var(--font-accent)',
    fontSize: '12px',
    color: 'var(--ink-primary)',
    textDecoration: 'none' as const,
  }

  const descStyle = {
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    color: 'var(--ink-tertiary)',
    marginTop: '4px',
    lineHeight: 1.5,
  }

  if (mobile) {
    return (
      <div ref={rootRef} style={{ borderBottom: '1px solid var(--void-05)' }}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="w-full flex items-center justify-between bg-transparent border-0 cursor-pointer"
          style={{
            fontFamily: 'var(--font-accent)',
            fontSize: '11px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: open ? 'var(--accent)' : 'var(--ink-secondary)',
            padding: '16px 0',
          }}
        >
          {label}
          <span style={{ fontSize: '10px', opacity: 0.7 }}>{open ? '−' : '+'}</span>
        </button>
        {open && (
          <div id={panelId} style={{ paddingBottom: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {items.map((item) =>
              item.external ? (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  style={linkStyle}
                >
                  {item.label}
                  {item.description && <p style={descStyle}>{item.description}</p>}
                </a>
              ) : (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)} style={linkStyle}>
                  {item.label}
                  {item.description && <p style={descStyle}>{item.description}</p>}
                </Link>
              )
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={panelId}
        className="uppercase bg-transparent border-0 cursor-pointer transition-colors duration-200"
        style={{
          fontFamily: 'var(--font-accent)',
          fontSize: '11px',
          letterSpacing: '0.1em',
          color: open ? 'var(--ink-primary)' : 'var(--ink-tertiary)',
          padding: 0,
        }}
      >
        {label}
        <span style={{ marginLeft: '6px', fontSize: '9px', opacity: 0.7 }}>▾</span>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            paddingTop: '10px',
            zIndex: 60,
          }}
        >
          <div
            id={panelId}
            role="menu"
            style={{
              minWidth: '240px',
              background: 'rgba(12, 12, 18, 0.98)',
              border: '1px solid var(--void-05)',
              boxShadow: '0 16px 48px rgba(0,0,0,0.45)',
              padding: '8px 0',
            }}
          >
          {items.map((item) => {
            const rowStyle = {
              display: 'block',
              padding: '12px 20px',
              textDecoration: 'none',
              transition: 'background 0.15s',
            }

            const content = (
              <>
                <span
                  style={{
                    fontFamily: 'var(--font-accent)',
                    fontSize: '11px',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-primary)',
                  }}
                >
                  {item.label}
                </span>
                {item.description && (
                  <span
                    style={{
                      display: 'block',
                      fontFamily: 'var(--font-body)',
                      fontSize: '12px',
                      color: 'var(--ink-tertiary)',
                      marginTop: '4px',
                      lineHeight: 1.45,
                      textTransform: 'none',
                      letterSpacing: 0,
                    }}
                  >
                    {item.description}
                  </span>
                )}
              </>
            )

            return item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                role="menuitem"
                className="hover:bg-[var(--void-03)]"
                style={rowStyle}
                onClick={() => setOpen(false)}
              >
                {content}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                className="hover:bg-[var(--void-03)]"
                style={rowStyle}
                onClick={() => setOpen(false)}
              >
                {content}
              </Link>
            )
          })}
          </div>
        </div>
      )}
    </div>
  )
}