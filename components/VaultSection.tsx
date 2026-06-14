'use client'

import ActionButton from '@/components/ActionButton'

import type { VaultEntry } from '@/lib/types'
import { getRiskColorHex } from '@/lib/risk'

interface VaultSectionProps {
  vault: VaultEntry[]
  onLoad: (id: number) => void
}

export default function VaultSection({ vault, onLoad }: VaultSectionProps) {
  return (
    <section
      id="vault"
      className="bg-[var(--void-01)] border-t border-[var(--void-05)]"
      style={{ paddingTop: '120px', paddingBottom: '120px' }}
    >
      <div className="section-inner">
        <div style={{ marginBottom: '56px' }}>
          <span
            className="block text-[11px] uppercase tracking-[0.12em] text-[var(--accent)] mb-4"
            style={{ fontFamily: 'var(--font-accent)' }}
          >
            Strategy Vault
          </span>
          <h2
            className="leading-tight"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(32px, 5vw, 56px)',
            }}
          >
            Your compiled strategies.
          </h2>
        </div>

        {vault.length === 0 ? (
          <div className="text-center" style={{ padding: '80px 0' }}>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '96px',
                color: 'var(--ink-tertiary)',
                opacity: 0.15,
                lineHeight: 1,
              }}
            >
              谋
            </div>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 300,
                color: 'var(--ink-tertiary)',
                marginTop: '16px',
              }}
            >
              No strategies compiled yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-auto" style={{ maxWidth: '1200px', gap: '24px' }}>
            {vault.map((entry) => {
              const scoreColor = getRiskColorHex(entry.risk.overall_score)
              return (
                <article
                  key={entry.id}
                  className="vault-card border border-[var(--void-05)] bg-[var(--void-02)] cursor-pointer transition-colors duration-200 hover:border-[var(--accent-border)]"
                  style={{
                    padding: '28px',
                    borderRadius: 0,
                    borderLeft: '3px solid var(--accent)',
                    boxShadow: 'none',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      style={{
                        fontFamily: 'var(--font-accent)',
                        fontSize: '11px',
                        fontWeight: 500,
                        padding: '4px 12px',
                        borderRadius: '20px',
                        color: scoreColor,
                        background: `${scoreColor}33`,
                      }}
                    >
                      {entry.risk.overall_score}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-accent)',
                        fontSize: '10px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: 'var(--ink-tertiary)',
                      }}
                    >
                      {entry.risk.verdict}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      fontSize: '20px',
                      color: 'var(--ink-primary)',
                      marginTop: '16px',
                      lineHeight: 1.3,
                    }}
                  >
                    {entry.strategy.strategy_name}
                  </h3>

                  <p
                    style={{
                      fontFamily: 'var(--font-accent)',
                      fontSize: '11px',
                      color: 'var(--ink-tertiary)',
                      marginTop: '8px',
                    }}
                  >
                    {entry.meta.market} · {entry.meta.timeframe}
                  </p>

                  <p
                    style={{
                      fontFamily: 'var(--font-accent)',
                      fontSize: '10px',
                      color: 'var(--ink-tertiary)',
                      marginTop: '4px',
                    }}
                  >
                    {entry.timestamp}
                  </p>

                  <ActionButton
                    variant="secondary"
                    onClick={() => onLoad(entry.id)}
                    className="w-full"
                    style={{ marginTop: '20px', height: '40px', padding: '0 16px', fontSize: '11px' }}
                  >
                    Load
                  </ActionButton>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}