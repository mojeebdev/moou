export function getRiskColor(score: number): string {
  if (score <= 30) return 'var(--risk-low)'
  if (score <= 60) return 'var(--risk-moderate)'
  if (score <= 80) return 'var(--risk-high)'
  return 'var(--risk-extreme)'
}

export function getRiskColorHex(score: number): string {
  if (score <= 30) return '#00C48C'
  if (score <= 60) return '#F5A623'
  if (score <= 80) return '#FF6B35'
  return '#E63B2E'
}

export function getVerdictColor(verdict: string): string {
  const v = verdict.toUpperCase()
  if (v === 'CONSERVATIVE') return '#00C48C'
  if (v === 'MODERATE') return '#F5A623'
  if (v === 'AGGRESSIVE') return '#FF6B35'
  return '#E63B2E'
}

export interface VerdictBadgeStyle {
  color: string
  background: string
  borderColor: string
  fontWeight: number
}

/** High-contrast pill styles — readable on dark/glass backgrounds */
export function getVerdictBadgeStyle(verdict: string): VerdictBadgeStyle {
  const v = verdict.toUpperCase()
  if (v === 'CONSERVATIVE') {
    return {
      color: '#050508',
      background: '#00C48C',
      borderColor: '#00C48C',
      fontWeight: 600,
    }
  }
  if (v === 'MODERATE') {
    return {
      color: '#0a0a0a',
      background: '#F5A623',
      borderColor: '#F5A623',
      fontWeight: 700,
    }
  }
  if (v === 'AGGRESSIVE') {
    return {
      color: '#FFFFFF',
      background: '#FF6B35',
      borderColor: '#FF6B35',
      fontWeight: 600,
    }
  }
  return {
    color: '#FFFFFF',
    background: '#E63B2E',
    borderColor: '#E63B2E',
    fontWeight: 600,
  }
}

export function getRegimeBadgeClass(regime: string): string {
  const r = regime.toLowerCase()
  if (r === 'trending') return 'text-[var(--risk-low)] border-[rgba(0,196,140,0.3)] bg-[rgba(0,196,140,0.15)]'
  if (r === 'ranging') return 'text-[var(--risk-moderate)] border-[rgba(245,166,35,0.3)] bg-[rgba(245,166,35,0.15)]'
  return 'text-[var(--ink-secondary)] border-[var(--void-05)] bg-[rgba(138,138,154,0.15)]'
}