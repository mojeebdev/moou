import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'User Guide — MÓOU',
  description:
    'How to compile trading strategies with MÓOU and deploy to Bitget Playbook — for traders and Bitget Agent users.',
}

const cardStyle = {
  background: 'var(--void-02)',
  border: '1px solid var(--void-05)',
  padding: '40px',
  marginBottom: '24px',
} as const

const stepNumStyle = {
  fontFamily: 'var(--font-accent)',
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '0.12em',
  color: 'var(--accent)',
  textTransform: 'uppercase' as const,
  marginBottom: '12px',
}

export default function GuidePage() {
  return (
    <main>
      <Navbar />

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
            User Guide
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: 'clamp(40px, 6vw, 72px)',
              color: 'var(--ink-primary)',
              lineHeight: 1.05,
              marginBottom: '24px',
            }}
          >
            Use MÓOU. Deploy on Playbook.
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 300,
              fontSize: '18px',
              color: 'var(--ink-secondary)',
              lineHeight: 1.75,
              maxWidth: '640px',
            }}
          >
            For traders and Bitget Agent users. No code required.{' '}
            <Link href="/docs" style={{ color: 'var(--accent)' }}>
              Developer docs
            </Link>{' '}
            are separate.
          </p>
        </div>
      </section>

      {/* What you get */}
      <section style={{ padding: '0 clamp(24px, 6vw, 80px) 80px', background: 'var(--void-01)' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={cardStyle}>
            <p style={stepNumStyle}>What MÓOU gives you</p>
            <ul
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                color: 'var(--ink-secondary)',
                lineHeight: 2,
                paddingLeft: '20px',
                listStyle: 'disc',
              }}
            >
              <li>
                <strong style={{ color: 'var(--ink-primary)' }}>Structured spec</strong> — entry, exit, position
                sizing, and market regime in plain language you can review before trading.
              </li>
              <li>
                <strong style={{ color: 'var(--ink-primary)' }}>Risk score (0–100)</strong> — five dimensions
                (volatility, drawdown, leverage, regime dependency, execution complexity) with notes.
              </li>
              <li>
                <strong style={{ color: 'var(--ink-primary)' }}>Playbook-ready output</strong> — copy directly into
                Bitget Playbook or hand off to an agent via the deploy prompt.
              </li>
              <li>
                <strong style={{ color: 'var(--ink-primary)' }}>Strategy Vault</strong> — save up to 10 compiles in
                your browser for later.
              </li>
            </ul>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                color: 'var(--ink-tertiary)',
                lineHeight: 1.7,
                marginTop: '16px',
              }}
            >
              The website has no account signup and no API key. Compiles on usemoou.xyz are unlimited.
            </p>
          </div>
        </div>
      </section>

      {/* Compile */}
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
            Step 1 — Compile your idea
          </h2>

          <div style={cardStyle}>
            <p style={stepNumStyle}>On usemoou.xyz</p>
            <ol
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                color: 'var(--ink-secondary)',
                lineHeight: 2,
                paddingLeft: '20px',
              }}
            >
              <li>
                Go to <Link href="/#compile" style={{ color: 'var(--accent)' }}>Compile</Link> and describe your
                strategy in plain English (20+ characters).
              </li>
              <li>Choose market, timeframe, and market conditions.</li>
              <li>Click <strong style={{ color: 'var(--ink-primary)' }}>Compile Strategy</strong>.</li>
            </ol>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '15px',
                color: 'var(--ink-secondary)',
                lineHeight: 1.8,
                marginTop: '16px',
              }}
            >
              You get a structured spec, a 5-dimension risk score, and Playbook-ready output. No account. No API key.
              Unlimited compiles on the website.
            </p>
          </div>
        </div>
      </section>

      {/* Two paths */}
      <section id="playbook" style={{ padding: '0 clamp(24px, 6vw, 80px) 80px', background: 'var(--void-01)' }}>
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
            Step 2 — Deploy to Bitget Playbook
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '16px',
              color: 'var(--ink-secondary)',
              lineHeight: 1.8,
              marginBottom: '32px',
            }}
          >
            Two paths. Pick based on how you work with Bitget Agent.
          </p>

          <div style={{ ...cardStyle, borderLeft: '3px solid var(--accent)' }}>
            <p style={stepNumStyle}>Path A — Quick copy (manual)</p>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '22px',
                color: 'var(--ink-primary)',
                marginBottom: '12px',
              }}
            >
              Copy for Bitget Playbook
            </h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--ink-secondary)', lineHeight: 1.8 }}>
              After compile, click <strong style={{ color: 'var(--ink-primary)' }}>Copy for Bitget Playbook</strong>.
              This copies the <code style={{ color: 'var(--ink-primary)' }}>playbook_format</code> text — a short
              strategy philosophy you can paste into Bitget Playbook or share with an agent as context.
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--ink-tertiary)', lineHeight: 1.7, marginTop: '12px' }}>
              Best when: you already use Playbook UI, or you only need the strategy wording.
            </p>
          </div>

          <div style={{ ...cardStyle, borderLeft: '3px solid var(--risk-low)' }}>
            <p style={stepNumStyle}>Path B — Full Playbook loop (recommended)</p>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '22px',
                color: 'var(--ink-primary)',
                marginBottom: '12px',
              }}
            >
              Copy getagent Deploy Prompt
            </h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--ink-secondary)', lineHeight: 1.8 }}>
              Click <strong style={{ color: 'var(--ink-primary)' }}>Copy getagent Deploy Prompt</strong>. This copies a
              complete instruction block for Claude Code, Cursor, or any agent with the{' '}
              <a
                href="https://www.npmjs.com/package/@bitget-ai/getagent-skill"
                style={{ color: 'var(--accent)' }}
                target="_blank"
                rel="noopener noreferrer"
              >
                getagent skill
              </a>{' '}
              installed — including your MÓOU spec, risk notes, and a slot for your Playbook API key.
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--ink-tertiary)', lineHeight: 1.7, marginTop: '12px' }}>
              Best when: you want upload → backtest → publish on Bitget Playbook in one flow.
            </p>
          </div>
        </div>
      </section>

      {/* Playbook loop */}
      <section id="playbook-loop" style={{ padding: '0 clamp(24px, 6vw, 80px) 80px', background: 'var(--void-01)' }}>
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
            The Bitget Agent loop (Path B)
          </h2>

          <div style={cardStyle}>
            <ol
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                color: 'var(--ink-secondary)',
                lineHeight: 2.2,
                paddingLeft: '20px',
                listStyle: 'decimal',
              }}
            >
              <li>
                <strong style={{ color: 'var(--ink-primary)' }}>Compile on MÓOU</strong> — idea → structured spec +
                risk score.
              </li>
              <li>
                <strong style={{ color: 'var(--ink-primary)' }}>Get your Playbook API key</strong> — Bitget Playbook →{' '}
                <a
                  href="https://www.bitget.com/activity/ai-get-agent/playbook?tab=explore"
                  style={{ color: 'var(--accent)' }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Create Agent
                </a>{' '}
                → set up sub-account → copy your key. Or ask in the{' '}
                <a href="https://t.me/+o1tYqQ_lXxllYjgy" style={{ color: 'var(--accent)' }}>
                  Hackathon Telegram
                </a>
                .
              </li>
              <li>
                <strong style={{ color: 'var(--ink-primary)' }}>Install getagent</strong> — in Claude Code or Cursor:{' '}
                <code style={{ color: 'var(--ink-primary)', fontSize: '13px' }}>@bitget-ai/getagent-skill</code>
              </li>
              <li>
                <strong style={{ color: 'var(--ink-primary)' }}>Paste the deploy prompt</strong> from MÓOU. Add your{' '}
                <code style={{ color: 'var(--ink-primary)' }}>playbook key:</code> line.
              </li>
              <li>
                <strong style={{ color: 'var(--ink-primary)' }}>Agent runs the loop</strong> — create package → upload
                → backtest → show metrics → publish.
              </li>
              <li>
                <strong style={{ color: 'var(--ink-primary)' }}>View on Playbook</strong> — your strategy appears on{' '}
                <a
                  href="https://www.bitget.com/activity/ai-get-agent/playbook?tab=explore"
                  style={{ color: 'var(--accent)' }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Playbook Explore
                </a>
                .
              </li>
            </ol>
          </div>

          <pre
            style={{
              background: 'var(--void-02)',
              border: '1px solid var(--void-05)',
              padding: '24px 32px',
              fontFamily: 'var(--font-accent)',
              fontSize: '13px',
              color: 'var(--ink-primary)',
              lineHeight: 1.9,
              overflowX: 'auto',
            }}
          >
{`Idea (plain English)
    ↓
MÓOU — spec + risk + deploy prompt
    ↓
Your Playbook API key + getagent skill
    ↓
Upload → Backtest → Publish on Bitget Playbook`}
          </pre>
        </div>
      </section>

      {/* Vault + support */}
      <section style={{ padding: '0 clamp(24px, 6vw, 80px) 120px', background: 'var(--void-01)' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={cardStyle}>
            <p style={stepNumStyle}>Extra</p>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '20px',
                color: 'var(--ink-primary)',
                marginBottom: '12px',
              }}
            >
              Strategy Vault
            </h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--ink-secondary)', lineHeight: 1.8 }}>
              Click <strong style={{ color: 'var(--ink-primary)' }}>Save to Vault</strong> to store up to 10 strategies
              in your browser. Reload later from the{' '}
              <Link href="/#vault" style={{ color: 'var(--accent)' }}>
                Vault section
              </Link>
              .
            </p>
          </div>

          <div
            style={{
              background: 'var(--accent-dim)',
              borderLeft: '3px solid var(--accent)',
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
              Need help?
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--ink-secondary)', lineHeight: 2 }}>
              <a href="https://github.com/mojeebdev/moou/issues" style={{ color: 'var(--accent)' }}>
                GitHub Issues
              </a>
              {' · '}
              <a href="https://x.com/mojeebeth" style={{ color: 'var(--accent)' }}>
                @mojeebeth
              </a>
              {' · '}
              <a href="https://t.me/+o1tYqQ_lXxllYjgy" style={{ color: 'var(--accent)' }}>
                Hackathon Telegram
              </a>
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--ink-tertiary)', marginTop: '12px' }}>
              Building an integration? See{' '}
              <Link href="/docs" style={{ color: 'var(--accent)' }}>
                Developer Docs
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}