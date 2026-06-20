'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import type { Risk, Strategy } from '@/lib/types'
import ActionButton from '@/components/ActionButton'
import WorkflowPnlCard from '@/components/WorkflowPnlCard'
import {
  GETAGENT_STUDIO_URL,
  buildGetagentDeployPrompt,
  buildStudioPaperTradePrompt,
} from '@/lib/getagent'
import { getRegimeBadgeClass, getRiskColorHex } from '@/lib/risk'

const DESKTOP_BG = '/images/middle-desktop.png'
const MOBILE_BG = '/images/middle-mobile.png'

const GLASS_PANEL: CSSProperties = {
  background: 'var(--void-02)',
  border: '1px solid var(--accent-border)',
  borderRadius: 0,
  padding: '32px',
}

interface OutputSectionProps {
  strategy: Strategy | null
  risk: Risk | null
  isVisible: boolean
  onSaveToVault: () => void
}

const DIMENSIONS = [
  { key: 'volatility_exposure', noteKey: 'volatility_note', label: 'Volatility Exposure' },
  { key: 'drawdown_risk', noteKey: 'drawdown_note', label: 'Drawdown Risk' },
  { key: 'leverage_sensitivity', noteKey: 'leverage_note', label: 'Leverage Sensitivity' },
  { key: 'regime_dependency', noteKey: 'regime_note', label: 'Regime Dependency' },
  { key: 'execution_complexity', noteKey: 'execution_note', label: 'Execution Complexity' },
] as const

function AnimatedRiskBars({ risk }: { risk: Risk }) {
  const [barWidths, setBarWidths] = useState<Record<string, number>>({})

  useEffect(() => {
    const timers = DIMENSIONS.map((dim, i) =>
      setTimeout(() => {
        setBarWidths((prev) => ({
          ...prev,
          [dim.key]: risk[dim.key as keyof Risk] as number,
        }))
      }, i * 120)
    )

    return () => timers.forEach(clearTimeout)
  }, [risk])

  return (
    <>
      {DIMENSIONS.map((dim, i) => {
        const score = risk[dim.key as keyof Risk] as number
        const note = risk[dim.noteKey as keyof Risk] as string
        const fillColor = getRiskColorHex(score)
        return (
          <div
            key={dim.key}
            style={{
              position: 'relative',
              zIndex: 2,
              marginBottom: '24px',
            }}
          >
            <div className="flex justify-between items-center" style={{ marginBottom: '8px' }}>
              <span
                style={{
                  color: '#F0F0F8',
                  fontFamily: 'var(--font-accent)',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                {dim.label}
              </span>
              <span
                style={{
                  color: 'var(--accent)',
                  fontFamily: 'var(--font-accent)',
                  fontWeight: 600,
                  fontSize: '13px',
                }}
              >
                {score}
              </span>
            </div>
            <div
              style={{
                height: '6px',
                background: 'var(--void-05)',
                borderRadius: 0,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '6px',
                  borderRadius: 0,
                  width: `${barWidths[dim.key] ?? 0}%`,
                  background: fillColor,
                  transition: 'width 800ms ease-out',
                  transitionDelay: `${i * 120}ms`,
                }}
              />
            </div>
            <p
              style={{
                color: 'var(--ink-secondary)',
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                fontStyle: 'italic',
                marginTop: '6px',
                lineHeight: 1.6,
                marginBottom: 0,
              }}
            >
              {note}
            </p>
          </div>
        )
      })}
    </>
  )
}

export default function OutputSection({ strategy, risk, isVisible, onSaveToVault }: OutputSectionProps) {
  const [copied, setCopied] = useState(false)
  const [copiedDeploy, setCopiedDeploy] = useState(false)
  const [copiedStudio, setCopiedStudio] = useState(false)
  const [playbookKey, setPlaybookKey] = useState('')
  const [copyError, setCopyError] = useState('')
  const [bgSrc, setBgSrc] = useState(DESKTOP_BG)

  useEffect(() => {
    const updateBg = () => {
      const mobile = window.matchMedia('(max-width: 768px)').matches
      const probe = new Image()
      probe.onload = () => setBgSrc(mobile ? MOBILE_BG : DESKTOP_BG)
      probe.onerror = () => setBgSrc(MOBILE_BG)
      probe.src = DESKTOP_BG
    }
    updateBg()
    window.addEventListener('resize', updateBg)
    return () => window.removeEventListener('resize', updateBg)
  }, [])

  if (!isVisible || !strategy || !risk) return null

  const writeClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopyError('')
      return true
    } catch {
      setCopyError('Copy failed — select the text and copy manually.')
      return false
    }
  }

  const copyPlaybook = async () => {
    if (await writeClipboard(strategy.playbook_format)) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const copyDeployPrompt = async () => {
    if (!risk) return
    if (
      await writeClipboard(
        buildGetagentDeployPrompt(strategy, risk, {
          playbookKey: playbookKey.trim() || undefined,
        })
      )
    ) {
      setCopiedDeploy(true)
      setTimeout(() => setCopiedDeploy(false), 2000)
    }
  }

  const copyStudioPrompt = async () => {
    if (!risk) return
    if (await writeClipboard(buildStudioPaperTradePrompt(strategy, risk))) {
      setCopiedStudio(true)
      setTimeout(() => setCopiedStudio(false), 2000)
    }
  }

  const contentStyle: CSSProperties = {
    position: 'relative',
    zIndex: 2,
    maxWidth: 'var(--content-max)',
    margin: '0 auto',
    padding: 'clamp(80px, 10vw, 140px) clamp(24px, 6vw, 80px)',
  }

  return (
    <section
      id="output-section"
      style={{ position: 'relative', overflow: 'hidden', background: 'transparent' }}
    >
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }} aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bgSrc}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
          }}
        />
      </div>

      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(5, 5, 8, 0.88)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      <div className="animate-fade-up" style={contentStyle}>
        <div className="grid grid-cols-1 lg:grid-cols-[58%_42%] items-start" style={{ gap: '48px' }}>
            <div>
              <span
                style={{
                  display: 'block',
                  color: 'var(--accent)',
                  fontFamily: 'var(--font-accent)',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  marginBottom: '16px',
                  textTransform: 'uppercase',
                }}
              >
                Compiled Strategy
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 900,
                  fontSize: 'clamp(32px, 5vw, 56px)',
                  color: '#F0F0F8',
                  marginBottom: '40px',
                  textShadow: '0 2px 20px rgba(0, 0, 0, 0.8)',
                  letterSpacing: '-0.01em',
                }}
              >
                {strategy.strategy_name}
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '16px' }}>
                {[
                  { icon: '→', label: 'Entry', content: strategy.entry_conditions },
                  { icon: '←', label: 'Exit', content: strategy.exit_conditions },
                  { icon: '◈', label: 'Position Size', content: strategy.position_sizing },
                  { icon: '◎', label: 'Best Conditions', content: strategy.regime_description, regime: strategy.market_regime },
                ].map((card) => (
                  <div key={card.label} style={GLASS_PANEL}>
                    <span
                      style={{
                        display: 'block',
                        color: 'var(--accent)',
                        fontFamily: 'var(--font-accent)',
                        marginBottom: '8px',
                      }}
                    >
                      {card.icon}
                    </span>
                    <span
                      style={{
                        display: 'block',
                        color: 'var(--accent)',
                        fontFamily: 'var(--font-accent)',
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.14em',
                        marginBottom: '16px',
                        textTransform: 'uppercase',
                      }}
                    >
                      {card.label}
                    </span>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontWeight: 500,
                        fontSize: '16px',
                        lineHeight: 1.8,
                        color: '#F0F0F8',
                        margin: 0,
                      }}
                    >
                      {card.content}
                    </p>
                    {'regime' in card && card.regime && (
                      <span
                        className={`inline-block border ${getRegimeBadgeClass(card.regime)}`}
                        style={{
                          fontFamily: 'var(--font-accent)',
                          fontSize: '10px',
                          fontWeight: 600,
                          letterSpacing: '0.08em',
                          marginTop: '12px',
                          padding: '6px 12px',
                          borderRadius: 0,
                          textTransform: 'uppercase',
                        }}
                      >
                        {card.regime}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={GLASS_PANEL}>
              <span
                style={{
                  display: 'block',
                  color: 'var(--accent)',
                  fontFamily: 'var(--font-accent)',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  marginBottom: '16px',
                  textTransform: 'uppercase',
                }}
              >
                Risk Assessment
              </span>

              <div style={{ marginBottom: '24px' }}>
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-display)',
                    fontSize: '56px',
                    fontWeight: 900,
                    color: 'var(--accent)',
                    lineHeight: 1,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {risk.overall_score}
                </span>
              </div>

              <div style={{ marginBottom: '32px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    background: 'var(--accent)',
                    color: '#000000',
                    fontFamily: 'var(--font-accent)',
                    fontWeight: 700,
                    padding: '6px 16px',
                    borderRadius: 0,
                    fontSize: '11px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  {risk.verdict}
                </span>
              </div>

              <AnimatedRiskBars
                key={`${strategy.strategy_name}-${risk.overall_score}`}
                risk={risk}
              />
            </div>
        </div>

        <div className="border-t border-[var(--void-05)]" style={{ marginTop: '64px', paddingTop: '60px' }}>
          <WorkflowPnlCard
            key={`${strategy.strategy_name}-${risk.overall_score}`}
            strategy={strategy}
            risk={risk}
          />

          <span
            style={{
              display: 'block',
              color: 'var(--accent)',
              fontFamily: 'var(--font-accent)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.14em',
              marginBottom: '16px',
              textTransform: 'uppercase',
            }}
          >
            Bitget Playbook Output
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(24px, 3vw, 40px)',
              fontWeight: 700,
              color: '#F0F0F8',
              letterSpacing: '-0.01em',
              marginBottom: '32px',
            }}
          >
            Ready to deploy.
          </h2>

          <div
            className="whitespace-pre-wrap"
            style={{
              ...GLASS_PANEL,
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: '15px',
              lineHeight: 1.9,
              color: '#F0F0F8',
              marginBottom: '24px',
            }}
          >
            {strategy.playbook_format}
          </div>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              color: 'var(--ink-tertiary)',
              marginBottom: '16px',
              lineHeight: 1.6,
            }}
          >
            <a href="/guide#playbook" style={{ color: 'var(--accent)' }}>
              User Guide
            </a>{' '}
            explains all three deploy paths.
          </p>
          {copyError && (
            <p
              style={{
                fontFamily: 'var(--font-accent)',
                fontSize: '12px',
                color: 'var(--risk-extreme)',
                marginBottom: '16px',
              }}
            >
              {copyError}
            </p>
          )}
          <div
            style={{
              ...GLASS_PANEL,
              marginBottom: '24px',
              borderLeft: '3px solid var(--risk-low)',
            }}
          >
            <span
              style={{
                display: 'block',
                color: 'var(--risk-low)',
                fontFamily: 'var(--font-accent)',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.14em',
                marginBottom: '12px',
                textTransform: 'uppercase',
              }}
            >
              Path C — Paper trade on GetAgent Studio (recommended for demo)
            </span>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '15px',
                color: 'var(--ink-secondary)',
                lineHeight: 1.8,
                marginBottom: '16px',
              }}
            >
              <a href={GETAGENT_STUDIO_URL} style={{ color: 'var(--accent)' }} target="_blank" rel="noopener noreferrer">
                GetAgent Studio
              </a>{' '}
              is free — sign in with your Bitget account. Backtest and paper-trade your MÓOU strategy,
              then share the public Studio link and performance metrics in your hackathon submission.
            </p>
            <div className="flex flex-wrap gap-4">
              <ActionButton
                variant="primary"
                onClick={() => window.open(GETAGENT_STUDIO_URL, '_blank', 'noopener,noreferrer')}
              >
                Open GetAgent Studio →
              </ActionButton>
              <ActionButton variant="secondary" onClick={copyStudioPrompt}>
                {copiedStudio ? 'Copied ✓' : 'Copy Studio Paper-Trade Prompt'}
              </ActionButton>
            </div>
          </div>

          <div style={{ ...GLASS_PANEL, marginBottom: '24px' }}>
            <label
              htmlFor="playbook-key"
              className="block text-[10px] uppercase tracking-[0.1em] text-[var(--ink-tertiary)] mb-2"
              style={{ fontFamily: 'var(--font-accent)' }}
            >
              Playbook API key (optional — Path B)
            </label>
            <input
              id="playbook-key"
              type="password"
              value={playbookKey}
              onChange={(e) => setPlaybookKey(e.target.value)}
              placeholder="Paste your Playbook key — embedded in deploy prompt only, never stored"
              autoComplete="off"
              className="w-full border border-[var(--void-05)] bg-[var(--void-03)] px-4 py-3 text-[13px] text-[var(--ink-primary)] outline-none focus:border-[var(--accent-border)]"
              style={{ fontFamily: 'var(--font-accent)', borderRadius: 0, marginBottom: '16px' }}
            />
            <div className="flex flex-wrap gap-4">
              <ActionButton variant="primary" onClick={copyPlaybook}>
                {copied ? 'Copied ✓' : 'Copy for Bitget Playbook'}
              </ActionButton>
              <ActionButton variant="secondary" onClick={copyDeployPrompt}>
                {copiedDeploy ? 'Copied ✓' : 'Copy getagent Deploy Prompt'}
              </ActionButton>
              <ActionButton variant="ghost" onClick={onSaveToVault}>
                Save to Vault
              </ActionButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}