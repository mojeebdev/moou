import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HowItWorks from '@/components/HowItWorks'
import ApiAccessSection from '@/components/ApiAccessSection'
import FaqAccordion from '@/components/FaqAccordion'

export const metadata: Metadata = {
  title: 'About',
  description:
    'MÓOU (谋) is a natural language trading strategy compiler built for the Bitget AI Base Camp Hackathon S1, Track 2: Trading Infra.',
  openGraph: {
    title: 'About MÓOU 谋 — Strategy before signal.',
    description:
      'MÓOU (谋) is a natural language trading strategy compiler built for the Bitget AI Base Camp Hackathon S1, Track 2: Trading Infra.',
    images: ['/images/hero-desktop.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About MÓOU 谋 — Strategy before signal.',
    description:
      'MÓOU (谋) is a natural language trading strategy compiler built for the Bitget AI Base Camp Hackathon S1, Track 2: Trading Infra.',
    images: ['/images/hero-desktop.png'],
  },
}

const STACK_ITEMS = [
  { label: 'Framework', value: 'Next.js 16' },
  { label: 'AI Model (Alibaba Cloud)', value: 'Qwen3.6-plus' },
  { label: 'API Endpoint', value: 'Bitget Proxy' },
  { label: 'Chart Widget', value: 'TradingView' },
  { label: 'Deployment', value: 'Vercel' },
  { label: 'Strategy Vault', value: 'localStorage' },
] as const

export default function AboutPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section
        style={{
          background: 'var(--void-01)',
          padding: '160px clamp(24px, 6vw, 80px) 80px',
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
            About MÓOU
          </span>
          <h1
            className="italic"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: 'clamp(48px, 7vw, 96px)',
              color: 'var(--ink-primary)',
              lineHeight: 1.05,
              marginBottom: '24px',
            }}
          >
            Strategy before signal.
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
            MÓOU (谋) turns plain-English trading ideas into structured strategy specs, a five-dimension
            risk score, and Bitget Playbook-ready output — before you place a single trade.
          </p>
        </div>
      </section>

      {/* Who it's for */}
      <section
        style={{
          padding: '0 clamp(24px, 6vw, 80px) 80px',
          background: 'var(--void-01)',
        }}
      >
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
            Who it&apos;s for
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              style={{
                background: 'var(--void-02)',
                border: '1px solid var(--void-05)',
                borderLeft: '3px solid var(--accent)',
                padding: '32px',
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
                Traders &amp; Bitget Agent users
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '15px',
                  color: 'var(--ink-secondary)',
                  lineHeight: 1.8,
                  marginBottom: '16px',
                }}
              >
                Describe your idea on the web app, review the risk breakdown, then deploy via Playbook copy
                or the getagent loop. No code. Unlimited compiles on the website.
              </p>
              <Link href="/guide" style={{ color: 'var(--accent)', fontFamily: 'var(--font-accent)', fontSize: '13px' }}>
                Read the User Guide →
              </Link>
            </div>
            <div
              style={{
                background: 'var(--void-02)',
                border: '1px solid var(--void-05)',
                borderLeft: '3px solid var(--risk-low)',
                padding: '32px',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-accent)',
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--risk-low)',
                  marginBottom: '12px',
                }}
              >
                Developers &amp; agent builders
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '15px',
                  color: 'var(--ink-secondary)',
                  lineHeight: 1.8,
                  marginBottom: '16px',
                }}
              >
                Integrate via REST API, MCP tools for Cursor and Claude Code, or paste the integration
                prompt into any LLM workflow. OpenAPI spec included.
              </p>
              <Link href="/docs" style={{ color: 'var(--accent)', fontFamily: 'var(--font-accent)', fontSize: '13px' }}>
                Read Developer Docs →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section
        style={{
          padding: '80px clamp(24px, 6vw, 80px)',
          background: 'var(--void-01)',
        }}
      >
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
          style={{ maxWidth: '860px', margin: '0 auto' }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '36px',
              color: 'var(--ink-primary)',
              lineHeight: 1.2,
            }}
          >
            The gap between idea and execution.
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: '17px',
              color: 'var(--ink-secondary)',
              lineHeight: 1.8,
            }}
          >
            Every trading agent starts with an idea in someone&apos;s head. The gap between that idea and a
            structured, deployable strategy is where most traders lose precision. MÓOU is the missing layer —
            it structures your thinking, scores your risk, and hands you Playbook-ready code.
          </p>
        </div>
      </section>

      <HowItWorks />

      {/* Stack */}
      <section
        style={{
          padding: '120px clamp(24px, 6vw, 80px)',
          background: 'var(--void-01)',
        }}
      >
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(32px, 4vw, 48px)',
              color: 'var(--ink-primary)',
              marginBottom: '48px',
            }}
          >
            Built with.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {STACK_ITEMS.map((item) => (
              <div
                key={item.value}
                style={{
                  background: 'var(--void-02)',
                  border: '1px solid var(--void-05)',
                  padding: '24px',
                  borderRadius: 0,
                }}
              >
                <span
                  className="block uppercase"
                  style={{
                    fontFamily: 'var(--font-accent)',
                    fontSize: '10px',
                    letterSpacing: '0.1em',
                    color: 'var(--accent)',
                    marginBottom: '8px',
                  }}
                >
                  {item.label}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 400,
                    fontSize: '16px',
                    color: 'var(--ink-secondary)',
                  }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ApiAccessSection />

      <FaqAccordion />

      {/* Disclaimer */}
      <section
        id="disclaimer"
        style={{
          background: 'var(--void-02)',
          borderTop: '1px solid var(--void-05)',
          borderBottom: '1px solid var(--void-05)',
          padding: '40px clamp(24px, 6vw, 80px)',
        }}
      >
        <div style={{ maxWidth: '720px' }}>
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
            Disclaimer
          </span>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 300,
              fontSize: '14px',
              color: 'var(--ink-secondary)',
              lineHeight: 1.8,
            }}
          >
            The trading strategies generated by MÓOU are produced by an AI model and are intended solely for
            educational, research, and planning purposes. They do not constitute financial advice, investment
            recommendations, or solicitation to trade any asset. Past strategy performance in backtests does
            not guarantee future results. Trading cryptocurrencies and financial instruments involves
            significant risk of loss. Always conduct your own research and consult a qualified financial
            advisor before making any trading decisions. BlindspotLab and MÓOU accept no liability for
            trading decisions made based on AI-generated outputs.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}