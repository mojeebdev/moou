'use client'

import { useEffect, useState } from 'react'

type ApiStatus = 'checking' | 'operational' | 'down'

interface ApiStatusBadgeProps {
  variant?: 'navbar' | 'pill'
}

export default function ApiStatusBadge({ variant = 'navbar' }: ApiStatusBadgeProps) {
  const [status, setStatus] = useState<ApiStatus>('checking')

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetch('/api/v1/health')
        .then((r) => (r.ok ? setStatus('operational') : setStatus('down')))
        .catch(() => setStatus('down'))
    }, 1500)

    return () => window.clearTimeout(timer)
  }, [])

  const isOperational = status === 'operational'
  const color = status === 'checking' ? 'var(--ink-tertiary)' : isOperational ? '#00C48C' : '#E63B2E'

  if (variant === 'pill') {
    if (status === 'checking') return null

    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: 'var(--font-accent)',
          fontSize: '12px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color,
          padding: '8px 16px',
          border: `1px solid ${color}`,
          marginTop: '24px',
        }}
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: color,
            animation: isOperational ? 'status-pulse 2s ease-in-out infinite' : 'none',
          }}
        />
        {isOperational ? 'API Operational' : 'API Down'}
      </span>
    )
  }

  return (
    <span
      className="hidden md:flex"
      style={{
        alignItems: 'center',
        gap: '6px',
        fontFamily: 'var(--font-accent)',
        fontSize: '10px',
        color,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
      }}
    >
      {status !== 'checking' && (
        <>
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: color,
              animation: isOperational ? 'status-pulse 2s ease-in-out infinite' : 'none',
            }}
          />
          {isOperational ? 'API Live' : 'API Down'}
        </>
      )}
    </span>
  )
}