'use client'

import { useState } from 'react'

const API_ENDPOINT = 'https://usemoou.xyz/api/v1/compile'

const CODE_SAMPLE = `POST ${API_ENDPOINT}
Content-Type: application/json

{
  "strategy": "Buy BTC when RSI drops below 30 on the 4H chart",
  "market": "Crypto Futures",
  "timeframe": "Swing (1H-4H)",
  "regime": "Ranging"
}`

export default function ApiAccessSection() {
  const [copied, setCopied] = useState(false)

  const copyEndpoint = async () => {
    await navigator.clipboard.writeText(API_ENDPOINT)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section
      id="api"
      style={{
        padding: '120px clamp(24px, 6vw, 80px)',
        background: 'var(--void-02)',
        borderTop: '1px solid var(--void-05)',
      }}
    >
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <span
          className="block uppercase"
          style={{
            fontFamily: 'var(--font-accent)',
            fontSize: '11px',
            letterSpacing: '0.12em',
            color: 'var(--accent)',
            marginBottom: '16px',
          }}
        >
          For Developers
        </span>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 'clamp(32px, 4vw, 48px)',
            color: 'var(--ink-primary)',
            marginBottom: '24px',
          }}
        >
          Build on MÓOU.
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 400,
            fontSize: '17px',
            color: 'var(--ink-secondary)',
            lineHeight: 1.8,
            marginBottom: '32px',
            maxWidth: '640px',
          }}
        >
          The MÓOU API is publicly accessible. Any developer can compile and score trading strategies
          programmatically — no API key required.
        </p>

        <pre
          style={{
            background: 'var(--void-02)',
            border: '1px solid var(--void-05)',
            borderRadius: 0,
            padding: '32px',
            fontFamily: 'var(--font-accent)',
            fontSize: '13px',
            color: 'var(--ink-primary)',
            lineHeight: 1.8,
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
            marginBottom: '24px',
          }}
        >
          {CODE_SAMPLE}
        </pre>

        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            onClick={copyEndpoint}
            className="inline-flex items-center justify-center px-7 py-4 border border-[var(--void-05)] text-[var(--ink-secondary)] text-xs uppercase tracking-[0.08em] transition-colors hover:border-[var(--accent-border)] hover:text-[var(--ink-primary)]"
            style={{ fontFamily: 'var(--font-accent)', borderRadius: 0, cursor: 'pointer', background: 'transparent' }}
          >
            {copied ? 'Copied ✓' : 'Copy Endpoint'}
          </button>
          <a
            href="/docs"
            className="inline-flex items-center justify-center px-7 py-4 border border-[var(--void-05)] text-[var(--ink-secondary)] text-xs uppercase tracking-[0.08em] no-underline transition-colors hover:border-[var(--accent-border)] hover:text-[var(--ink-primary)]"
            style={{ fontFamily: 'var(--font-accent)', borderRadius: 0 }}
          >
            Full API Docs →
          </a>
        </div>
      </div>
    </section>
  )
}