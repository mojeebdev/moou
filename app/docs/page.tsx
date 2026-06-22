import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ApiStatusBadge from '@/components/ApiStatusBadge'
import CopyCodeButton from '@/components/CopyCodeButton'
import { INTEGRATION_PROMPT } from '@/lib/integration-prompt'

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
            Developer Documentation
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
            Integrate MÓOU into agents, bots, and internal tools. REST API, MCP server, OpenAPI spec, and a
            copy-paste LLM integration prompt. No API key during the hackathon.
          </p>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '15px',
              color: 'var(--ink-tertiary)',
              lineHeight: 1.7,
              marginTop: '16px',
            }}
          >
            Using MÓOU as a trader? See the{' '}
            <a href="/guide" style={{ color: 'var(--accent)' }}>
              User Guide
            </a>{' '}
            — Playbook deploy paths are documented there, not here.
          </p>
          <div
            style={{
              marginTop: '32px',
              background: 'var(--void-02)',
              border: '1px solid var(--void-05)',
              padding: '24px 32px',
              maxWidth: '640px',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-accent)',
                fontSize: '11px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--accent)',
                marginBottom: '12px',
              }}
            >
              Three ways to integrate
            </p>
            <ul
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '15px',
                color: 'var(--ink-secondary)',
                lineHeight: 2,
                paddingLeft: '20px',
              }}
            >
              <li>
                <strong style={{ color: 'var(--ink-primary)' }}>REST API</strong> —{' '}
                <code style={{ color: 'var(--ink-primary)' }}>POST /compile</code>,{' '}
                <code style={{ color: 'var(--ink-primary)' }}>/score</code>,{' '}
                <code style={{ color: 'var(--ink-primary)' }}>/deploy-prompt</code>
              </li>
              <li>
                <strong style={{ color: 'var(--ink-primary)' }}>MCP server</strong> —{' '}
                <code style={{ color: 'var(--ink-primary)' }}>moou_compile</code>,{' '}
                <code style={{ color: 'var(--ink-primary)' }}>moou_score</code>,{' '}
                <code style={{ color: 'var(--ink-primary)' }}>moou_deploy_prompt</code> for Cursor, Grok Build,
                Claude Code, Windsurf, Cline
              </li>
              <li>
                <strong style={{ color: 'var(--ink-primary)' }}>Integration prompt</strong> — paste into ChatGPT,
                Claude, Grok, Codex, Gemini, or any chat LLM
              </li>
            </ul>
          </div>
          <ApiStatusBadge variant="pill" />
        </div>
      </section>

      {/* Getting Started */}
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
            Get Started in 5 Steps
          </h2>
          <ol
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: '16px',
              color: 'var(--ink-secondary)',
              lineHeight: 2,
              paddingLeft: '24px',
              marginBottom: '32px',
            }}
          >
            <li>
              Try the <Link href="/#compile" style={{ color: 'var(--accent)' }}>web app</Link> — no API key, no rate limit
            </li>
            <li>
              <code style={{ color: 'var(--ink-primary)' }}>GET /health</code> — confirm the API is operational
            </li>
            <li>
              <code style={{ color: 'var(--ink-primary)' }}>GET /markets</code> — valid market, timeframe, regime labels
            </li>
            <li>
              <code style={{ color: 'var(--ink-primary)' }}>POST /compile</code> — your first programmatic compile
            </li>
            <li>
              Optional: <a href="https://github.com/mojeebdev/moou/tree/main/mcp-server" style={{ color: 'var(--accent)' }}>MCP server</a> (Cursor, Grok Build, Claude Code) or{' '}
              <a href="#integration-prompt" style={{ color: 'var(--accent)' }}>integration prompt</a> (Codex, ChatGPT, Gemini)
            </li>
          </ol>
        </div>
      </section>

      {/* Integration Prompt */}
      <section
        id="integration-prompt"
        style={{ padding: '0 clamp(24px, 6vw, 80px) 80px', background: 'var(--void-01)' }}
      >
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '28px',
              color: 'var(--ink-primary)',
              marginBottom: '16px',
            }}
          >
            LLM Integration Prompt
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: '16px',
              color: 'var(--ink-secondary)',
              lineHeight: 1.8,
              marginBottom: '24px',
            }}
          >
            Drop this into ChatGPT, Claude, Grok, Codex, Gemini, or any LLM to fast-track API integration. Edit the last line with your goal
            before pasting. Also in{' '}
            <a
              href="https://github.com/mojeebdev/moou/blob/main/INTEGRATION_PROMPT.md"
              style={{ color: 'var(--accent)' }}
            >
              INTEGRATION_PROMPT.md
            </a>{' '}
            on GitHub.
          </p>
          <pre style={{ ...codeBlockStyle, maxHeight: '420px', overflowY: 'auto' }}>{INTEGRATION_PROMPT}</pre>
          <CopyCodeButton text={INTEGRATION_PROMPT} label="Copy Integration Prompt" />
        </div>
      </section>

      {/* Base URL */}
      <section style={{ padding: '0 clamp(24px, 6vw, 80px) 80px', background: 'var(--void-01)' }}>
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
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 400, color: 'var(--ink-secondary)', marginBottom: '16px' }}>
              Typical latency: 15–30 seconds.
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
            <CopyCodeButton text={CURL_EXAMPLE} label="Copy cURL" variant="secondary" />

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
                    <td style={{ padding: '12px 16px' }}>30 req/hour per IP (API only)</td>
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

          {/* POST /score */}
          <div style={cardStyle}>
            <MethodBadge method="POST" />
            <p style={{ fontFamily: 'var(--font-accent)', fontSize: '16px', color: 'var(--ink-primary)', marginBottom: '12px' }}>
              /score
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 400, color: 'var(--ink-secondary)', marginBottom: '16px' }}>
              Score risk for an existing structured strategy. Composable primitive for agents that already have a spec.
            </p>
            <pre style={codeBlockStyle}>{`{
  "strategy": {
    "strategy_name": "...",
    "entry_conditions": "...",
    "exit_conditions": "...",
    "position_sizing": "..."
  },
  "market": "Crypto Futures",
  "timeframe": "Swing (1H-4H)"
}`}</pre>
          </div>

          {/* POST /deploy-prompt */}
          <div id="deploy-prompt" style={cardStyle}>
            <MethodBadge method="POST" />
            <p style={{ fontFamily: 'var(--font-accent)', fontSize: '16px', color: 'var(--ink-primary)', marginBottom: '12px' }}>
              /deploy-prompt — Playbook Bridge
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 400, color: 'var(--ink-secondary)', marginBottom: '16px', lineHeight: 1.8 }}>
              Closes the loop from MÓOU compile → Bitget Playbook. Returns{' '}
              <code style={{ color: 'var(--ink-primary)' }}>prompt</code> (getagent skill, Path B) and{' '}
              <code style={{ color: 'var(--ink-primary)' }}>studio_prompt</code> (GetAgent Studio paper trading,
              Path C — free at getagent.studio). Pass your own{' '}
              <code style={{ color: 'var(--ink-primary)' }}>playbook_key</code> to embed in the getagent prompt —
              never stored. Not rate-limited.
            </p>
            <pre style={codeBlockStyle}>{`// Response includes:
{
  "prompt": "...",
  "studio_prompt": "...",
  "getagent_studio": "https://getagent.studio/",
  "getagent_skill": "https://www.npmjs.com/package/@bitget-ai/getagent-skill",
  "playbook_explore": "https://www.bitget.com/activity/ai-get-agent/playbook?tab=explore"
}`}</pre>
          </div>

          {/* GET /openapi */}
          <div style={cardStyle}>
            <MethodBadge method="GET" />
            <p style={{ fontFamily: 'var(--font-accent)', fontSize: '16px', color: 'var(--ink-primary)', marginBottom: '12px' }}>
              /openapi
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 400, color: 'var(--ink-secondary)' }}>
              OpenAPI 3.1 specification for client generation and agent discovery.
            </p>
          </div>

          {/* MCP */}
          <div style={cardStyle}>
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
              MCP Server
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 400, color: 'var(--ink-secondary)', lineHeight: 1.8, marginBottom: '16px' }}>
              Tools: <code style={{ color: 'var(--ink-primary)' }}>moou_compile</code>,{' '}
              <code style={{ color: 'var(--ink-primary)' }}>moou_score</code>,{' '}
              <code style={{ color: 'var(--ink-primary)' }}>moou_deploy_prompt</code>.
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 400, color: 'var(--ink-secondary)', lineHeight: 1.8 }}>
              <strong style={{ color: 'var(--ink-primary)' }}>MCP clients:</strong> Cursor · Grok Build · Claude Code · Windsurf · Cline
              <br />
              <strong style={{ color: 'var(--ink-primary)' }}>Chat LLMs (use integration prompt above):</strong> ChatGPT · Codex · Grok · Gemini · Claude
              <br />
              Setup:{' '}
              <a href="https://github.com/mojeebdev/moou/tree/main/mcp-server" style={{ color: 'var(--accent)' }}>
                mcp-server/README.md
              </a>
            </p>
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
              marginBottom: '24px',
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
              Rate Limits
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 400, color: 'var(--ink-secondary)', lineHeight: 1.8 }}>
              <strong style={{ color: 'var(--ink-primary)' }}>30 requests per IP per hour</strong> on{' '}
              <code>POST /compile</code> and <code>POST /score</code>. The website UI is unlimited. Each compile uses
              ~2 Qwen calls (~3–5k tokens). <code>POST /deploy-prompt</code> is free.
            </p>
          </div>

          <div
            style={{
              background: 'var(--void-02)',
              border: '1px solid var(--void-05)',
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
              Support
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 400, color: 'var(--ink-secondary)', lineHeight: 2 }}>
              <a href="mailto:support@usemoou.xyz" style={{ color: 'var(--accent)' }}>support@usemoou.xyz</a>
              {' · '}
              <a href="https://github.com/mojeebdev/moou/issues" style={{ color: 'var(--accent)' }}>GitHub Issues</a>
              {' · '}
              <a href="https://x.com/tmojeeb" style={{ color: 'var(--accent)' }}>@tmojeeb</a>
              {' · '}
              <a href="https://t.me/+o1tYqQ_lXxllYjgy" style={{ color: 'var(--accent)' }}>Bitget Hackathon Telegram</a>
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