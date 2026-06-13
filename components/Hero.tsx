'use client'

import { useEffect, useState } from 'react'

export default function Hero() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/v1/stats')
      .then((r) => r.json())
      .then((d) => setCount(d.total_compilations))
      .catch(() => {})
  }, [])

  return (
    <section
      className="hero-section relative overflow-hidden"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 'var(--nav-height) clamp(24px, 6vw, 80px) clamp(60px, 8vw, 100px)',
        textAlign: 'left',
      }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="/images/hero-desktop.png"
        className="hero-desktop absolute inset-0 w-full h-full object-cover object-center z-0 hidden md:block"
      >
        <source src="/videos/hero-desktop.mp4" type="video/mp4" />
      </video>
      <video
        autoPlay
        loop
        muted
        playsInline
        poster="/images/hero-mobile.png"
        className="hero-mobile absolute inset-0 w-full h-full object-cover object-center z-0 block md:hidden"
      >
        <source src="/videos/hero-mobile.mp4" type="video/mp4" />
      </video>

      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            'linear-gradient(to bottom, rgba(5,5,8,0.45) 0%, rgba(5,5,8,0.60) 50%, rgba(5,5,8,0.92) 100%)',
        }}
      />

      <div className="relative z-[2] w-full max-w-[640px] text-left">
        <p
          className="text-[11px] uppercase tracking-[0.14em] mb-7"
          style={{
            fontFamily: 'var(--font-accent)',
            color: 'var(--accent)',
            textShadow: '0 0 20px rgba(245, 166, 35, 0.25)',
          }}
        >
          Bitget AI Base Camp · Track 2 · Trading Infra
        </p>

        <h1
          className="leading-[1.05] tracking-[-0.02em] mb-7"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(40px, 10vw, 108px)',
            fontWeight: 900,
          }}
        >
          <span className="block text-[var(--ink-primary)]">Before you trade,</span>
          <span className="block text-[var(--accent)] italic">谋.</span>
        </h1>

        <p
          className="text-[18px] font-light leading-[1.65] mb-10"
          style={{
            fontFamily: 'var(--font-body)',
            color: 'rgba(240, 240, 248, 0.88)',
          }}
        >
          Describe any trading idea in plain English. MÓOU structures your thinking, scores your
          risk, and outputs Playbook-ready strategy.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <a
            href="#compile"
            className="inline-flex items-center justify-center no-underline transition-all duration-200 hover:-translate-y-0.5"
            style={{
              fontFamily: 'var(--font-accent)',
              fontWeight: 500,
              fontSize: '13px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '18px 40px',
              borderRadius: '8px',
              background: 'var(--accent)',
              color: '#0a0a0a',
              boxShadow: '0 4px 28px rgba(245, 166, 35, 0.4)',
            }}
          >
            Compile Your Strategy →
          </a>
          <a
            href="#how-it-works"
            className="inline-flex items-center justify-center gap-2 no-underline transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)] animate-bounce-hint"
            style={{
              fontFamily: 'var(--font-accent)',
              fontWeight: 400,
              fontSize: '12px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '16px 28px',
              borderRadius: '8px',
              border: '1px solid rgba(245, 166, 35, 0.35)',
              background: 'rgba(5, 5, 8, 0.45)',
              backdropFilter: 'blur(8px)',
              color: 'rgba(240, 240, 248, 0.92)',
            }}
          >
            ↓ See how it works
          </a>
        </div>

        {count !== null && count > 0 && (
          <p
            style={{
              fontFamily: 'var(--font-accent)',
              fontSize: '11px',
              color: 'var(--ink-tertiary)',
              letterSpacing: '0.1em',
              marginTop: '16px',
              textTransform: 'uppercase',
            }}
          >
            {count.toLocaleString()} strategies compiled
          </p>
        )}
      </div>
    </section>
  )
}