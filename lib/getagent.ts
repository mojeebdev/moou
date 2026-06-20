import type { Risk, Strategy } from '@/lib/types'

export const GETAGENT_STUDIO_URL = 'https://getagent.studio/'
export const PLAYBOOK_EXPLORE_URL =
  'https://www.bitget.com/activity/ai-get-agent/playbook?tab=explore'
export const GETAGENT_SKILL_URL = 'https://www.npmjs.com/package/@bitget-ai/getagent-skill'
export const HACKATHON_TELEGRAM_URL = 'https://t.me/+o1tYqQ_lXxllYjgy'

type PartialRisk = Partial<Risk>

function formatRiskBlock(risk?: PartialRisk, heading = 'Pre-compiled risk assessment (MÓOU)'): string {
  if (!risk) return ''

  const lines: string[] = [`${heading}:`]

  if (risk.overall_score != null && risk.verdict) {
    lines.push(`- Overall score: ${risk.overall_score}/100 (${risk.verdict})`)
  }

  const dimensions: [string, number | undefined, string | undefined][] = [
    ['Volatility', risk.volatility_exposure, risk.volatility_note],
    ['Drawdown', risk.drawdown_risk, risk.drawdown_note],
    ['Leverage sensitivity', risk.leverage_sensitivity, risk.leverage_note],
    ['Regime dependency', risk.regime_dependency, risk.regime_note],
    ['Execution complexity', risk.execution_complexity, risk.execution_note],
  ]

  for (const [label, score, note] of dimensions) {
    if (score != null && note) lines.push(`- ${label}: ${score} — ${note}`)
  }

  return lines.length > 1 ? `\n${lines.join('\n')}\n` : ''
}

export function buildGetagentDeployPrompt(
  strategy: Strategy,
  risk?: PartialRisk,
  options?: { playbookKey?: string }
): string {
  const keyLine = options?.playbookKey
    ? `playbook key: ${options.playbookKey}`
    : 'playbook key: [your Playbook API Key from Bitget Playbook → Create Agent]'

  const riskBlock = formatRiskBlock(risk)

  return `1. Install getagent using ${GETAGENT_SKILL_URL}
2. Use getagent to create a strategy playbook from the MÓOU-compiled spec below, then upload, backtest, and publish it
3. Once backtest succeeds, show me the key metrics in a table (PnL, max drawdown, Sharpe, win rate)
4. Optional — run paper trading on GetAgent Studio (${GETAGENT_STUDIO_URL})

Strategy philosophy:
${strategy.playbook_format}

Structured spec (MÓOU):
- Name: ${strategy.strategy_name}
- Entry: ${strategy.entry_conditions}
- Exit: ${strategy.exit_conditions}
- Position sizing: ${strategy.position_sizing}
- Market regime: ${strategy.market_regime} — ${strategy.regime_description}
${riskBlock}${keyLine}`
}

/** Prompt for paper trading / backtest via GetAgent Studio (no coding agent required). */
export function buildStudioPaperTradePrompt(strategy: Strategy, risk?: PartialRisk): string {
  const riskBlock = formatRiskBlock(risk, 'MÓOU risk assessment')

  return `Paper-trade this MÓOU-compiled strategy on GetAgent Studio.

GetAgent Studio: ${GETAGENT_STUDIO_URL} — sign in with your Bitget account.

Steps:
1. Open ${GETAGENT_STUDIO_URL}
2. Create a strategy from the MÓOU spec below
3. Run backtest and paper trading
4. Publish and copy your public Studio strategy link

Strategy philosophy (Playbook-ready):
${strategy.playbook_format}

Structured spec:
- Name: ${strategy.strategy_name}
- Entry: ${strategy.entry_conditions}
- Exit: ${strategy.exit_conditions}
- Position sizing: ${strategy.position_sizing}
- Market regime: ${strategy.market_regime} — ${strategy.regime_description}
${riskBlock}`
}