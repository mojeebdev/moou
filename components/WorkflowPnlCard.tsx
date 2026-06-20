'use client'

import { useState, type CSSProperties } from 'react'
import type { Risk, Strategy } from '@/lib/types'
import ActionButton from '@/components/ActionButton'
import { GETAGENT_STUDIO_URL } from '@/lib/getagent'

const PANEL: CSSProperties = {
  background: 'var(--void-02)',
  border: '1px solid var(--accent-border)',
  borderRadius: 0,
  padding: '32px',
}

const WORKFLOW_STEPS = [
  { id: 'compile', label: 'Compile', detail: 'Plain English → structured spec' },
  { id: 'risk', label: 'Risk gate', detail: 'Five-dimension score' },
  { id: 'deploy', label: 'Deploy ready', detail: 'Playbook + Studio prompts' },
  { id: 'validate', label: 'Paper trade', detail: 'PnL proof on GetAgent Studio' },
] as const

type StudioMetrics = {
  pnl: string
  maxDrawdown: string
  sharpe: string
  winRate: string
  studioLink: string
}

const EMPTY_METRICS: StudioMetrics = {
  pnl: '',
  maxDrawdown: '',
  sharpe: '',
  winRate: '',
  studioLink: '',
}

function metricsStorageKey(strategyName: string) {
  return `moou-studio-metrics:${strategyName}`
}

function hasMetrics(metrics: StudioMetrics) {
  return Boolean(metrics.pnl && metrics.maxDrawdown && metrics.sharpe && metrics.winRate)
}

interface WorkflowPnlCardProps {
  strategy: Strategy
  risk: Risk
}

function loadStoredMetrics(strategyName: string): StudioMetrics {
  if (typeof window === 'undefined') return EMPTY_METRICS
  try {
    const raw = localStorage.getItem(metricsStorageKey(strategyName))
    if (raw) return { ...EMPTY_METRICS, ...JSON.parse(raw) }
  } catch {
    return EMPTY_METRICS
  }
  return EMPTY_METRICS
}

export default function WorkflowPnlCard({ strategy, risk }: WorkflowPnlCardProps) {
  const [metrics, setMetrics] = useState<StudioMetrics>(() => loadStoredMetrics(strategy.strategy_name))
  const [showForm, setShowForm] = useState(false)
  const [saved, setSaved] = useState(false)

  const validated = hasMetrics(metrics)

  const saveMetrics = () => {
    if (!hasMetrics(metrics)) return
    localStorage.setItem(metricsStorageKey(strategy.strategy_name), JSON.stringify(metrics))
    setSaved(true)
    setShowForm(false)
    setTimeout(() => setSaved(false), 2000)
  }

  const metricTiles = [
    { label: 'Total PnL', value: metrics.pnl, pending: '—' },
    { label: 'Max drawdown', value: metrics.maxDrawdown, pending: '—' },
    { label: 'Sharpe', value: metrics.sharpe, pending: '—' },
    { label: 'Win rate', value: metrics.winRate, pending: '—' },
  ]

  return (
    <div style={{ ...PANEL, marginBottom: '32px', borderLeft: '3px solid var(--accent)' }}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between" style={{ marginBottom: '24px' }}>
        <div>
          <span
            style={{
              display: 'block',
              color: 'var(--accent)',
              fontFamily: 'var(--font-accent)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}
          >
            End-to-end workflow
          </span>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(22px, 3vw, 28px)',
              color: '#F0F0F8',
              margin: 0,
            }}
          >
            {validated ? 'Validation complete' : 'Compile pipeline complete'}
          </h3>
        </div>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'var(--font-accent)',
            fontSize: '11px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: validated ? 'var(--risk-low)' : 'var(--accent)',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: validated ? 'var(--risk-low)' : 'var(--accent)',
              boxShadow: validated ? '0 0 12px rgba(0,196,140,0.5)' : '0 0 12px rgba(245,166,35,0.45)',
            }}
          />
          {validated ? 'Studio metrics recorded' : 'Awaiting Studio PnL'}
        </span>
      </div>

      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        style={{ marginBottom: '28px' }}
      >
        {WORKFLOW_STEPS.map((step, index) => {
          const done = index < 3 || validated
          return (
            <div
              key={step.id}
              style={{
                border: `1px solid ${done ? 'var(--accent-border)' : 'var(--void-05)'}`,
                background: done ? 'var(--void-03)' : 'var(--void-02)',
                padding: '14px 16px',
              }}
            >
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-accent)',
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: done ? 'var(--accent)' : 'var(--ink-tertiary)',
                  marginBottom: '6px',
                }}
              >
                {done ? '✓' : '○'} {step.label}
              </span>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  color: 'var(--ink-secondary)',
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {step.detail}
              </p>
            </div>
          )
        })}
      </div>

      <div
        style={{
          border: '1px solid var(--void-05)',
          background: 'var(--void-03)',
          padding: '24px',
          marginBottom: '20px',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4" style={{ marginBottom: '20px' }}>
          <div>
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-accent)',
                fontSize: '10px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--ink-tertiary)',
                marginBottom: '8px',
              }}
            >
              Performance snapshot
            </span>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                color: 'var(--ink-secondary)',
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              MÓOU risk gate:{' '}
              <strong style={{ color: 'var(--accent)' }}>{risk.overall_score}/100</strong> ({risk.verdict})
              {validated ? ' · Paper-trade metrics below from GetAgent Studio.' : ' · Add Studio paper-trade results to finish the loop.'}
            </p>
          </div>
          <ActionButton
            variant="secondary"
            onClick={() => setShowForm((v) => !v)}
            style={{ padding: '12px 20px', fontSize: '10px' }}
          >
            {showForm ? 'Close form' : validated ? 'Update metrics' : 'Add Studio PnL'}
          </ActionButton>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {metricTiles.map((tile) => (
            <div
              key={tile.label}
              style={{
                border: '1px solid var(--void-05)',
                background: '#050508',
                padding: '16px',
              }}
            >
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-accent)',
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-tertiary)',
                  marginBottom: '8px',
                }}
              >
                {tile.label}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 'clamp(20px, 3vw, 28px)',
                  color: validated ? 'var(--risk-low)' : 'var(--ink-tertiary)',
                  lineHeight: 1.1,
                }}
              >
                {validated ? tile.value : tile.pending}
              </span>
            </div>
          ))}
        </div>

        {validated && metrics.studioLink && (
          <p style={{ fontFamily: 'var(--font-accent)', fontSize: '12px', marginTop: '16px', marginBottom: 0 }}>
            Studio link:{' '}
            <a href={metrics.studioLink} style={{ color: 'var(--accent)' }} target="_blank" rel="noopener noreferrer">
              {metrics.studioLink}
            </a>
          </p>
        )}
      </div>

      {showForm && (
        <div
          style={{
            border: '1px solid var(--void-05)',
            background: 'var(--void-02)',
            padding: '20px',
            marginBottom: '20px',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              color: 'var(--ink-secondary)',
              marginBottom: '16px',
              lineHeight: 1.6,
            }}
          >
            Paper-trade on{' '}
            <a href={GETAGENT_STUDIO_URL} style={{ color: 'var(--accent)' }} target="_blank" rel="noopener noreferrer">
              GetAgent Studio
            </a>
            , then paste your backtest / paper-trade metrics here for your demo and submission.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginBottom: '16px' }}>
            {(
              [
                ['pnl', 'Total PnL (e.g. +12.4%)'],
                ['maxDrawdown', 'Max drawdown (e.g. -8.2%)'],
                ['sharpe', 'Sharpe (e.g. 1.42)'],
                ['winRate', 'Win rate (e.g. 58%)'],
              ] as const
            ).map(([key, placeholder]) => (
              <input
                key={key}
                value={metrics[key]}
                onChange={(e) => setMetrics((m) => ({ ...m, [key]: e.target.value }))}
                placeholder={placeholder}
                className="w-full border border-[var(--void-05)] bg-[var(--void-03)] px-4 py-3 text-[13px] text-[var(--ink-primary)] outline-none focus:border-[var(--accent-border)]"
                style={{ fontFamily: 'var(--font-accent)', borderRadius: 0 }}
              />
            ))}
          </div>
          <input
            value={metrics.studioLink}
            onChange={(e) => setMetrics((m) => ({ ...m, studioLink: e.target.value }))}
            placeholder="Studio strategy link (e.g. https://getagent.studio/strategy/...)"
            className="w-full border border-[var(--void-05)] bg-[var(--void-03)] px-4 py-3 text-[13px] text-[var(--ink-primary)] outline-none focus:border-[var(--accent-border)]"
            style={{ fontFamily: 'var(--font-accent)', borderRadius: 0, marginBottom: '16px' }}
          />
          <div className="flex flex-wrap gap-3">
            <ActionButton variant="primary" onClick={saveMetrics} disabled={!hasMetrics(metrics)}>
              {saved ? 'Saved ✓' : 'Save performance snapshot'}
            </ActionButton>
            <ActionButton
              variant="ghost"
              onClick={() => window.open(GETAGENT_STUDIO_URL, '_blank', 'noopener,noreferrer')}
            >
              Open Studio →
            </ActionButton>
          </div>
        </div>
      )}

      {!validated && !showForm && (
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            color: 'var(--ink-tertiary)',
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          Next: open GetAgent Studio, run paper trading, then click <strong style={{ color: 'var(--ink-secondary)' }}>Add Studio PnL</strong> to record metrics for your hackathon demo.
        </p>
      )}
    </div>
  )
}