import type { ReactNode } from 'react'

const linkStyle = {
  fontFamily: 'var(--font-body)',
  fontWeight: 400,
  fontSize: '14px',
  color: 'var(--ink-secondary)',
} as const

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block mb-3 no-underline transition-colors hover:text-[var(--ink-primary)]"
      style={linkStyle}
    >
      {children}
    </a>
  )
}

function FooterInternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="block mb-3 no-underline transition-colors hover:text-[var(--ink-primary)]"
      style={linkStyle}
    >
      {children}
    </a>
  )
}

function FooterColumn({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p
        className="mb-5"
        style={{
          fontFamily: 'var(--font-accent)',
          fontSize: '10px',
          textTransform: 'uppercase',
          letterSpacing: '0.14em',
          color: 'var(--ink-tertiary)',
        }}
      >
        {label}
      </p>
      {children}
    </div>
  )
}

export default function Footer() {
  return (
    <footer
      className="border-t border-[var(--void-05)] bg-[var(--void-01)]"
      style={{ paddingTop: '120px', paddingBottom: 0 }}
    >
      <div className="section-inner">
        <div className="grid grid-cols-1 max-[479px]:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          {/* Column 1 — Brand */}
          <div>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '28px',
                color: 'var(--ink-primary)',
                marginBottom: '12px',
              }}
            >
              MÓOU · 谋
            </p>
            <p
              className="italic"
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 300,
                fontSize: '15px',
                color: 'var(--ink-secondary)',
                marginBottom: '8px',
              }}
            >
              Strategy before signal.
            </p>
            <p
              style={{
                fontFamily: 'var(--font-accent)',
                fontSize: '11px',
                color: 'var(--ink-tertiary)',
                marginBottom: '24px',
              }}
            >
              A BlindspotLab build
            </p>

          </div>

          {/* Column 2 — Project */}
          <FooterColumn label="Project">
            <FooterInternalLink href="/guide">User Guide</FooterInternalLink>
            <FooterInternalLink href="/docs">Developer Docs</FooterInternalLink>
            <FooterLink href="/api/v1/health">Health</FooterLink>
            <FooterInternalLink href="/about">About</FooterInternalLink>
            <FooterInternalLink href="/about#faq">FAQ</FooterInternalLink>
            <FooterInternalLink href="/about#disclaimer">Disclaimer</FooterInternalLink>
            <FooterLink href="https://github.com/mojeebdev/moou">GitHub</FooterLink>
            <FooterLink href="https://github.com/mojeebdev/moou/blob/main/API.md">API Reference</FooterLink>
            <FooterLink href="https://github.com/mojeebdev/moou#readme">README</FooterLink>
            <FooterLink href="https://blindspotlab.xyz">BlindspotLab</FooterLink>
          </FooterColumn>

          {/* Column 3 — Hackathon */}
          <FooterColumn label="Hackathon">
            <FooterLink href="https://www.bitget.com/">Bitget AI Base Camp</FooterLink>
            <FooterLink href="https://github.com/BitgetLimited/agent_hub">Track 2: Trading Infra</FooterLink>
            <FooterLink href="https://github.com/BitgetLimited/agent_hub">Agent Hub</FooterLink>
            <FooterLink href="https://www.bitget.com/">Bitget Playbook</FooterLink>
            <FooterLink href="https://foresightventures.com/">Foresight Ventures</FooterLink>
          </FooterColumn>

          {/* Column 4 — Support */}
          <FooterColumn label="Support">
            <FooterLink href="mailto:support@usemoou.xyz">support@usemoou.xyz</FooterLink>
            <FooterLink href="https://github.com/mojeebdev/moou/issues">GitHub Issues</FooterLink>
            <FooterLink href="https://x.com/tmojeeb">@tmojeeb on X</FooterLink>
            <FooterLink href="https://t.me/+o1tYqQ_lXxllYjgy">Hackathon Telegram</FooterLink>
            <FooterInternalLink href="/guide">User Guide</FooterInternalLink>
            <FooterLink href="https://blindspotlab.xyz">BlindspotLab</FooterLink>
          </FooterColumn>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row md:flex-wrap md:justify-between items-center text-center gap-4"
          style={{
            marginTop: '80px',
            padding: '24px 0',
            borderTop: '1px solid var(--void-05)',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-accent)',
              fontSize: '10px',
              color: 'var(--ink-tertiary)',
            }}
          >
            © 2026 MÓOU · BlindspotLab
          </p>
          <p
            style={{
              fontFamily: 'var(--font-accent)',
              fontSize: '10px',
              color: 'var(--ink-tertiary)',
            }}
          >
            Built for Bitget AI Base Camp Hackathon S1 · Track 2: Trading Infra
          </p>
          <p
            style={{
              fontFamily: 'var(--font-accent)',
              fontSize: '10px',
              color: 'var(--ink-tertiary)',
              lineHeight: 1.8,
              maxWidth: '360px',
            }}
          >
            Hero: Stephan Schmitz · Middle: Bryan White (@travangelist) · Expanded via Gemini ·
            Animated via Grok
          </p>
        </div>
      </div>
    </footer>
  )
}