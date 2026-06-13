import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ApiStatusBadge from '@/components/ApiStatusBadge'
import CopyCodeButton from '@/components/CopyCodeButton'

export const metadata: Metadata = {
  title: 'MÓOU API Docs',
  description:
    'Public REST API documentation for MÓOU — compile and score trading strategies programmatically.',
}

const codeBlockStyle = {
  background: 'var(--void-02)',
  border: '1px solid var(--void-05)',
  borderRadius: 0,
  padding: '24px 32px',
  fontFamily: 'var(--font-accent)',
  fontSize: '14px',
  color: 'var(--ink-primary)',
  lineHeight: 1.8,
  overflowX: 'auto' as const,
  whiteSpace: 'pre-wrap' as const,
}

const cardStyle = {
  background: 'var(--void-02)',
  border: '1px solid var(--void-05)',
  borderRadius: 0,
  padding: '40px',
  marginBottom: '24px',
}

const CURL_EXAMPLE = `curl -X POST https://usemoou.xyz/api/v1/compile \\
  -H "Content-Type: application/json" \\
  -d '{
    "strategy": "Buy BTC when RSI drops below 30 on the 4H chart with funding rates negative for 3 consecutive hours",
    "market": "Crypto Futures",
    "timeframe": "Swing (1H-4H)",
    "regime": "Ranging"
  }'`

function MethodBadge({ method }: { method: 'GET' | 'POST' }) {
  const isGet = method === 'GET'
  return (
    <span
      style={{
        display: 'inline-block',
        background: isGet ? '#00C48C' : 'var(--accent)',
        color: '#000',
        fontFamily: 'var(--font-accent)',
        fontSize: '11px',
        padding: '4px 10px',
        letterSpacing: '0.08em',
        marginBottom: '12px',
      }}
    >
      {method}
    </span>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        fontFamily: 'var(--font-accent)',
        fontSize: '12px',
        color: 'var(--accent)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginBottom: '12px',
        marginTop: '24px',
      }}
    >
      {children}
    </p>
  )
}

export default function DocsPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section style={{ background: 'var(--void-01)', padding: '160px clamp(24px, 6vw, 80px) 80px' }}>
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
            Developer Docs
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: 'clamp(48px, 7vw, 96px)',
              color: 'var(--ink-primary)',
              lineHeight: 1.05,
              marginBottom: '24px',
            }}
          >
            Build on MÓOU.
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 300,
              fontSize: '18px',
              color: 'var(--ink-secondary)',
              lineHeight: 1.7,
              maxWidth: '640px',
            }}
          >
            The MÓOU API is publicly accessible. Compile and score trading strategies programmatically.
            No API key required.
          </p>
          <ApiStatusBadge variant="pill" />
        </div>
      </section>

      {/* Base URL */}
      <section style={{ padding: '80px clamp(24px, 6vw, 80px)', background: 'var(--void-01)' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '28px',
              color: 'var(--ink-primary)',
              marginBottom: '24px',
            }}
          >
            Base URL
          </h2>
          <pre
            style={{
              ...codeBlockStyle,
              borderLeft: '3px solid var(--accent)',
            }}
          >
            https://usemoou.xyz/api/v1
          </pre>
        </div>
      </section>

      {/* Endpoints */}
      <section style={{ padding: '0 clamp(24px, 6vw, 80px) 80px', background: 'var(--void-01)' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '28px',
              color: 'var(--ink-primary)',
              marginBottom: '32px',
            }}
          >
            Endpoints
          </h2>

          {/* GET /health */}
          <div style={cardStyle}>
            <MethodBadge method="GET" />
            <p style={{ fontFamily: 'var(--font-accent)', fontSize: '16px', color: 'var(--ink-primary)', marginBottom: '12px' }}>
              /health
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 400, color: 'var(--ink-secondary)', marginBottom: '16px' }}>
              Check API status and version.
            </p>
            <pre style={codeBlockStyle}>{`{
  "status": "operational",
  "model": "qwen3.6-plus",
  "version": "1.0.0",
  "timestamp": "2026-06-13T11:32:55Z",
  "powered_by": "MÓOU 谋 · usemoou.xyz"
}`}</pre>
          </div>

          {/* GET /markets */}
          <div style={cardStyle}>
            <MethodBadge method="GET" />
            <p style={{ fontFamily: 'var(--font-accent)', fontSize: '16px', color: 'var(--ink-primary)', marginBottom: '12px' }}>
              /markets
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 400, color: 'var(--ink-secondary)' }}>
              Returns all supported markets, timeframes and market regimes.
            </p>
          </div>

          {/* GET /stats */}
          <div style={cardStyle}>
            <MethodBadge method="GET" />
            <p style={{ fontFamily: 'var(--font-accent)', fontSize: '16px', color: 'var(--ink-primary)', marginBottom: '12px' }}>
              /stats
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 400, color: 'var(--ink-secondary)', marginBottom: '16px' }}>
              Returns total strategies compiled.
            </p>
            <pre style={codeBlockStyle}>{`{
  "total_compilations": 1247,
  "status": "operational",
  "version": "1.0.0"
}`}</pre>
          </div>

          {/* POST /compile */}
          <div style={cardStyle}>
            <MethodBadge method="POST" />
            <p style={{ fontFamily: 'var(--font-accent)', fontSize: '16px', color: 'var(--ink-primary)', marginBottom: '12px' }}>
              /compile
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 400, color: 'var(--ink-secondary)', marginBottom: '8px' }}>
              Compile a plain-English trading strategy into a structured spec with risk scoring.
            </p>

            <SectionLabel>Request Body</SectionLabel>
            <pre style={codeBlockStyle}>{`{
  "strategy": "string (required) — your trade idea in plain English",
  "market": "string (required) — Crypto Futures | Crypto Spot | US Stocks (Tokenized)",
  "timeframe": "string (required) — Scalp (1–15m) | Swing (1H–4H) | Position (Daily+)",
  "regime": "string (required) — Trending Up | Trending Down | Ranging | Unclear"
}`}</pre>

            <SectionLabel>Response</SectionLabel>
            <pre style={codeBlockStyle}>{`{
  "strategy_name": "Sixty-Two Range Reversal",
  "entry_conditions": "Place a limit buy...",
  "exit_conditions": "Deploy a hard stop loss...",
  "position_sizing": "Allocate exactly 2%...",
  "market_regime": "ranging",
  "regime_description": "Performs best when...",
  "playbook_format": "Exploit established...",
  "risk": {
    "overall_score": 55,
    "verdict": "MODERATE",
    "volatility_exposure": 75,
    "volatility_note": "...",
    "drawdown_risk": 40,
    "drawdown_note": "...",
    "leverage_sensitivity": 65,
    "leverage_note": "...",
    "regime_dependency": 75,
    "regime_note": "...",
    "execution_complexity": 50,
    "execution_note": "..."
  },
  "meta": {
    "compiled_at": "2026-06-13T11:32:55Z",
    "model": "qwen3.6-plus",
    "version": "1.0.0",
    "processing_ms": 1243,
    "powered_by": "MÓOU 谋",
    "docs": "https://usemoou.xyz/docs"
  }
}`}</pre>

            <SectionLabel>Try it</SectionLabel>
            <pre style={codeBlockStyle}>{CURL_EXAMPLE}</pre>
            <CopyCodeButton text={CURL_EXAMPLE} label="Copy" />

            <SectionLabel>Error Codes</SectionLabel>
            <div style={{ border: '1px solid var(--void-05)', background: 'var(--void-02)', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-accent)', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--void-05)', textAlign: 'left' }}>
                    <th style={{ padding: '12px 16px', color: 'var(--accent)' }}>Code</th>
                    <th style={{ padding: '12px 16px', color: 'var(--accent)' }}>Status</th>
                    <th style={{ padding: '12px 16px', color: 'var(--accent)' }}>Description</th>
                  </tr>
                </thead>
                <tbody style={{ color: 'var(--ink-secondary)' }}>
                  <tr style={{ borderBottom: '1px solid var(--void-05)' }}>
                    <td style={{ padding: '12px 16px', color: 'var(--ink-primary)' }}>MISSING_FIELDS</td>
                    <td style={{ padding: '12px 16px' }}>400</td>
                    <td style={{ padding: '12px 16px' }}>Required field missing</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--void-05)' }}>
                    <td style={{ padding: '12px 16px', color: 'var(--ink-primary)' }}>INVALID_MARKET</td>
                    <td style={{ padding: '12px 16px' }}>400</td>
                    <td style={{ padding: '12px 16px' }}>Unrecognized market value</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--void-05)' }}>
                    <td style={{ padding: '12px 16px', color: 'var(--ink-primary)' }}>RATE_LIMIT_EXCEEDED</td>
                    <td style={{ padding: '12px 16px' }}>429</td>
                    <td style={{ padding: '12px 16px' }}>10 req/hour per IP</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px 16px', color: 'var(--ink-primary)' }}>COMPILATION_FAILED</td>
                    <td style={{ padding: '12px 16px' }}>500</td>
                    <td style={{ padding: '12px 16px' }}>AI model error</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Rate Limits */}
      <section style={{ padding: '0 clamp(24px, 6vw, 80px) 80px', background: 'var(--void-01)' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div
            style={{
              background: 'var(--accent-dim)',
              borderLeft: '3px solid var(--accent)',
              borderRadius: 0,
              padding: '24px 32px',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-accent)',
                fontSize: '11px',
                color: 'var(--accent)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}
            >
              ⚡ Rate Limits
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 400, color: 'var(--ink-secondary)', lineHeight: 1.8 }}>
              10 requests per IP per hour during hackathon period. Limits may change post-hackathon.
            </p>
          </div>
        </div>
      </section>

      {/* Built On */}
      <section style={{ padding: '80px clamp(24px, 6vw, 80px)', background: 'var(--void-01)' }}>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 300,
            fontSize: '15px',
            color: 'var(--ink-tertiary)',
            lineHeight: 1.8,
            textAlign: 'center',
            maxWidth: '560px',
            margin: '0 auto',
          }}
        >
          MÓOU 谋 is built for the Bitget AI Base Camp Hackathon S1 — Track 2: Trading Infra. Powered by
          Qwen3.6-plus via Bitget&apos;s hackathon API proxy.
        </p>
      </section>

      <Footer />
    </main>
  )
}