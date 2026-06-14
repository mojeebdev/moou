'use client'

import { useEffect, useRef, useState } from 'react'

const DESKTOP_POSTER = '/images/hero-desktop.png'
const MOBILE_POSTER = '/images/hero-mobile.png'
const DESKTOP_VIDEO = '/videos/hero-desktop.mp4'
const MOBILE_VIDEO = '/videos/hero-mobile.mp4'

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [count, setCount] = useState<number | null>(null)
  const [videoReady, setVideoReady] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const markReady = () => setVideoReady(true)

    if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      markReady()
    }

    video.addEventListener('canplay', markReady)
    video.addEventListener('loadeddata', markReady)

    return () => {
      video.removeEventListener('canplay', markReady)
      video.removeEventListener('loadeddata', markReady)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const timer = window.setTimeout(() => {
      fetch('/api/v1/stats', { signal: controller.signal })
        .then((r) => r.json())
        .then((d) => setCount(d.total_compilations))
        .catch(() => {})
    }, 1200)

    return () => {
      controller.abort()
      window.clearTimeout(timer)
    }
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
      {/* Poster: correct image via picture — no JS required for first paint */}
      <picture
        className="absolute inset-0 z-0 block transition-opacity duration-700"
        style={{ opacity: videoReady ? 0 : 1 }}
      >
        <source media="(max-width: 768px)" srcSet={MOBILE_POSTER} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={DESKTOP_POSTER}
          alt=""
          aria-hidden
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover object-center"
        />
      </picture>

      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster={DESKTOP_POSTER}
        className="absolute inset-0 w-full h-full object-cover object-center z-0 transition-opacity duration-700"
        style={{ opacity: videoReady ? 1 : 0 }}
      >
        <source media="(max-width: 768px)" src={MOBILE_VIDEO} type="video/mp4" />
        <source src={DESKTOP_VIDEO} type="video/mp4" />
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

        <div className="hero-cta-group flex flex-col sm:flex-row sm:items-center gap-4">
          <a
            href="#compile"
            className="hero-cta hero-cta-primary inline-flex items-center justify-center no-underline transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5"
            style={{
              fontFamily: 'var(--font-accent)',
              fontWeight: 600,
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
            className="hero-cta hero-cta-secondary inline-flex items-center justify-center gap-2 no-underline transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--void-03)] animate-bounce-hint"
            style={{
              fontFamily: 'var(--font-accent)',
              fontWeight: 600,
              fontSize: '12px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '16px 28px',
              borderRadius: '8px',
              border: '1px solid var(--accent-border)',
              background: 'var(--void-02)',
              color: 'var(--ink-primary)',
            }}
          >
            ↓ See how it works
          </a>
        </div>

        {count !== null && count > 0 && (
          <p
            style={{
              fontFamily: 'var(--font-accent)',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              marginTop: '20px',
              textTransform: 'uppercase',
              color: 'var(--ink-primary)',
              textShadow: '0 1px 12px rgba(0, 0, 0, 0.6)',
            }}
          >
            <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '15px' }}>
              {count.toLocaleString()}
            </span>{' '}
            strategies compiled
          </p>
        )}
      </div>
    </section>
  )
}